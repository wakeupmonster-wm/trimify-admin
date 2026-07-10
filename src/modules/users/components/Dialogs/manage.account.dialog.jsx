import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  IconLoader2,
  IconAlertCircle,
  IconShieldCheck,
  IconLock,
  IconClockPause,
  IconCheck,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
  bannedUserProfile,
  unbanUserProfile,
  suspendUserProfile,
  fetchUserData,
  unsuspendUserProfile,
} from "../../store/user.slice";
import { REASON_CONFIGS } from "@/constants/reason.config";

export const ManageAccountDialog = ({ isOpen, onOpenChange, userData }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reason, setReason] = useState("");

  const currentStatus = userData?.account?.status;
  const [status, setStatus] = useState(currentStatus);
  const [selectedReason, setSelectedReason] = useState("");
  const [suspensionDuration, setSuspensionDuration] = useState("24");
  const [customDuration, setCustomDuration] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStatus(currentStatus);
      setReason("");
      setSelectedReason("");
      setSuspensionDuration("24");
      setCustomDuration("");
      setSuccess(false);
      setLoading(false);
    }
  }, [isOpen, currentStatus]);

  // Reset reason when status changes manually
  useEffect(() => {
    setSelectedReason("");
    setReason("");
  }, [status]);

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);
    const nickname = userData?.profile?.nickname || "User";

    try {
      const finalReason = selectedReason === "Other" ? reason : selectedReason;

      // Logic for RESTORING/UNBANNING
      if (status === "active" && currentStatus === "banned") {
        await dispatch(
          unbanUserProfile({
            userId: userData._id,
            category: "Administrative",
            reason: finalReason || "Account restored by admin",
          }),
        ).unwrap();
        toast.success("Account Restored", {
          description: `${nickname} is now active.`,
        });
      }
      // Logic for UNSUSPENDING
      else if (status === "active" && currentStatus === "suspended") {
        await dispatch(
          unsuspendUserProfile({
            userId: userData._id,
            category: "Administrative",
            reason: finalReason || "Suspension lifted by admin",
          }),
        ).unwrap();
        toast.success("Account Restored", {
          description: `${nickname} is now active.`,
        });
      }
      // Logic for BANNING
      else if (status === "banned") {
        await dispatch(
          bannedUserProfile({
            userId: userData._id,
            category: "Administrative",
            reason: finalReason || "Manual ban by admin",
          }),
        ).unwrap();
        toast.success("User Banned", {
          description: `${nickname} is restricted.`,
        });
      }
      // Logic for SUSPENDING
      else if (status === "suspended") {
        const durationHours =
          suspensionDuration === "custom"
            ? parseInt(customDuration) || 24
            : parseInt(suspensionDuration);

        await dispatch(
          suspendUserProfile({
            userId: userData._id,
            reason: finalReason || "Temporary suspension",
            durationHours: durationHours,
          }),
        ).unwrap();
        toast.success("User Suspended", {
          description: `Access restricted for ${durationHours} hours.`,
        });
      }

      // 2. AUTOMATICALLY RE-FETCH the fresh data from the server
      await dispatch(fetchUserData(userData._id));

      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    } catch (err) {
      toast.error(err || "Action failed");
      setLoading(false);
    }
  };

  const isReasonOverLimit = selectedReason === "Other" && reason.length > 500;
  const customHoursNum = parseInt(customDuration);
  // Only show red border + error when user typed something out of range
  const isCustomEmpty =
    status === "suspended" &&
    suspensionDuration === "custom" &&
    customDuration.trim() === "";
  const isSuspensionInvalid =
    status === "suspended" &&
    suspensionDuration === "custom" &&
    customDuration.trim() !== "" &&
    !isNaN(customHoursNum) &&
    (customHoursNum < 1 || customHoursNum > 168);
  // Disables submit when empty OR invalid
  const isSuspensionBlocking = isCustomEmpty || isSuspensionInvalid;

  const isFormInvalid =
    isReasonOverLimit ||
    isSuspensionBlocking ||
    (status !== currentStatus &&
      status !== "active" &&
      (!selectedReason || (selectedReason === "Other" && !reason.trim())));

  const getStatusConfig = (val) => {
    const configs = {
      active: {
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-slate-200",
        focusBorder: "focus:border-green-400",
        focusVisibleBorder: "focus-visible:border-green-400",
        icon: <IconShieldCheck />,
      },
      banned: {
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-slate-200",
        focusBorder: "focus:border-red-400",
        focusVisibleBorder: "focus-visible:border-red-400",
        icon: <IconLock />,
      },
      suspended: {
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-slate-200",
        focusBorder: "focus:border-amber-400",
        focusVisibleBorder: "focus-visible:border-amber-400",
        icon: <IconClockPause />,
      },
    };
    return configs[val] || configs.active;
  };

  const config = getStatusConfig(status);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 p-0 overflow-hidden bg-white rounded-2xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <span
              className={cn(
                "p-2 rounded-lg",
                config.bg,
                config.color,
                status === "suspended" && "animate-pulse",
              )}
            >
              {React.cloneElement(config.icon, { size: 20 })}
            </span>
            Administrative Control
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 py-2 space-y-6">
          <div className="space-y-3">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Account Management{" "}
              <span className="text-red-400 font-normal">*</span>
            </Label>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-10 w-full bg-white border border-slate-200 rounded-md px-3 text-xs font-semibold text-slate-600 shadow-sm focus:border-slate-500 transition-all outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0">
                <SelectValue
                  placeholder={
                    currentStatus
                      ? currentStatus.charAt(0).toUpperCase() +
                      currentStatus.slice(1)
                      : "Select Status"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {/* Hidden item to allow the Select bar to show the current status by default */}
                <SelectItem value={currentStatus} className="hidden capitalize">
                  {currentStatus
                    ? currentStatus.charAt(0).toUpperCase() +
                    currentStatus.slice(1)
                    : ""}
                </SelectItem>

                {/* Dynamically filter options based on currentStatus for better UX */}
                {currentStatus === "banned" ? (
                  <>
                    <SelectItem
                      value="active"
                      className="text-green-600 text-xs font-semibold focus:bg-green-50"
                    >
                      ✅ Unban & Restore to Active
                    </SelectItem>
                    <SelectItem value="suspended" className="text-amber-600">
                      ⏳ Switch to Account Suspended
                    </SelectItem>
                  </>
                ) : currentStatus === "suspended" ? (
                  <>
                    <SelectItem
                      value="active"
                      className="text-green-600 text-xs font-semibold focus:bg-green-50"
                    >
                      ✅ Unsuspend & Restore to Active
                    </SelectItem>
                    <SelectItem
                      value="banned"
                      className="text-red-600 text-xs font-semibold"
                    >
                      🚫 Ban Account
                    </SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem
                      value="suspended"
                      className="text-amber-600 text-xs font-semibold"
                    >
                      ⚠️ Suspend Account
                    </SelectItem>
                    <SelectItem
                      value="banned"
                      className="text-red-600 text-xs font-semibold"
                    >
                      🚫 Ban Account Permanently
                    </SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>

            <div
              className={cn(
                "p-3 rounded-lg border flex items-start gap-3",
                config.bg,
                config.border,
              )}
            >
              <IconAlertCircle
                className={cn("shrink-0 mt-0.5", config.color)}
                size={16}
              />
              <div className="space-y-2">
                <p
                  className={cn(
                    "text-xs font-bold leading-none capitalize",
                    config.color,
                  )}
                >
                  Targeting: {status}
                </p>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  {status === "active" &&
                    "This will restore full access to the user's account. They will be able to log in and use all features again."}
                  {status === "banned" &&
                    "This will revoke all access for this user. Their profile will be hidden and they will be logged out immediately.."}
                  {status === "suspended" &&
                    "Temporary restriction. The user will be unable to use matching or messaging features for the selected duration."}
                </p>
              </div>
            </div>

            {status === currentStatus && (
              <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center justify-center text-center gap-1 animate-in fade-in zoom-in-95">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
                  <IconAlertCircle size={20} />
                </div>
                <p className="text-xs font-bold text-slate-600">
                  Already {status === "active" ? "Active" : status}
                </p>
                <p className="text-[10px] text-slate-400 max-w-[300px]">
                  No changes needed. Change the target status to perform a new
                  action.
                </p>
              </div>
            )}

            {status !== currentStatus && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Reason for {status}{" "}
                    <span className="text-red-400 font-normal">*</span>
                  </Label>
                  <Select
                    value={selectedReason}
                    onValueChange={(val) => {
                      setSelectedReason(val);
                      if (val !== "Other") setReason("");
                    }}
                  >
                    <SelectTrigger className="h-10 w-full bg-white border border-slate-200 rounded-md px-3 text-xs font-semibold text-slate-600 shadow-sm focus:border-slate-500 transition-all outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0">
                      <SelectValue placeholder={`Select ${status} reason...`} />
                    </SelectTrigger>
                    <SelectContent>
                      {REASON_CONFIGS[
                        status === "active"
                          ? currentStatus === "banned"
                            ? "unbanned"
                            : "unsuspended"
                          : status
                      ]?.map((r) => (
                        <SelectItem key={r} value={r} className="text-xs font-medium ">
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedReason === "Other" && (
                  <div className="space-y-2 animate-in zoom-in-95 duration-200">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Custom Detailed Reason{" "}
                      <span className="text-red-400 font-normal">*</span>
                    </Label>
                    <Textarea
                      placeholder="Please specify the detailed reason for this action..."
                      className={cn("min-h-[80px] w-full bg-white border rounded-md p-3 text-xs font-semibold text-slate-600 shadow-sm transition-all outline-none focus:ring-0", reason.length > 500 ? "border-red-400 focus-visible:border-red-500" : "border-slate-200 focus-visible:border-slate-500")}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                    <div className="flex justify-between items-center">
                      {reason.length > 500 && (
                        <span className="text-[10px] font-semibold text-red-500 animate-in fade-in duration-200">
                          Maximum 500 characters allowed
                        </span>
                      )}
                      <span className={cn("text-[10px] font-semibold transition-colors ml-auto", reason.length > 500 ? "text-red-500" : reason.length > 450 ? "text-amber-500" : "text-slate-400")}>
                        {reason.length} / 500
                      </span>
                    </div>
                  </div>
                )}

                {status === "suspended" && status !== currentStatus && (
                  <div className="pt-2 space-y-4 animate-in fade-in slide-in-from-top-1">
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Suspension Duration{" "}
                        <span className="text-red-400 font-normal">*</span>
                      </Label>
                      <Select
                        value={suspensionDuration}
                        onValueChange={setSuspensionDuration}
                      >
                        <SelectTrigger className="h-10 w-full bg-white border border-slate-200 rounded-md px-3 text-xs font-semibold text-slate-600 shadow-sm focus:border-slate-500 transition-all outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12" className="text-xs font-medium ">
                            12 Hours
                          </SelectItem>
                          <SelectItem value="24" className="text-xs font-medium ">
                            24 Hours (1 Day)
                          </SelectItem>
                          <SelectItem value="48" className="text-xs font-medium ">
                            48 Hours (2 Days)
                          </SelectItem>
                          <SelectItem value="72" className="text-xs font-medium ">
                            72 Hours (3 Days)
                          </SelectItem>
                          <SelectItem value="custom" className="text-xs font-medium ">
                            Custom Hours
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {suspensionDuration === "custom" && (
                      <div className="space-y-2 animate-in zoom-in-95 duration-200">
                        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Enter Custom Hours{" "}
                          <span className="text-red-400 font-normal">*</span>
                        </Label>
                        <Input
                          type="number"
                          min={1}
                          max={168}
                          placeholder="e.g. 36"
                          className={cn(
                            "h-10 w-full bg-white border rounded-md px-3 text-xs font-semibold text-slate-600 shadow-sm focus-visible:border-slate-500 transition-all outline-none focus:ring-0",
                            isSuspensionInvalid ? "border-red-500 focus-visible:border-red-500" : "border-slate-200"
                          )}
                          value={customDuration}
                          onChange={(e) => setCustomDuration(e.target.value)}
                        />
                        {isSuspensionInvalid && (
                          <p className="text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1 mt-1">
                            {customHoursNum < 1
                              ? "Duration cannot be less than 1 hour."
                              : "Duration cannot exceed 168 hours (7 days)."}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="bg-muted/30 p-6 pt-4 flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading || success || status === currentStatus}
            className="flex-1 border border-slate-300 disabled:cursor-not-allowed disabled:opacity-90"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || success || status === currentStatus || isFormInvalid}
            className={cn(
              "flex-1 font-bold disabled:cursor-not-allowed disabled:opacity-90 flex items-center justify-center gap-2 duration-300",
              success
                ? "bg-emerald-600 hover:bg-emerald-700 text-white opacity-100"
                : status === "banned"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : status === "active"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-amber-600 hover:bg-amber-700 text-white",
            )}
          >
            {loading ? (
              <>
                <IconLoader2 className="animate-spin w-4 h-4" />
                <span>Applying...</span>
              </>
            ) : success ? (
              <>
                <IconCheck className="w-4 h-4 animate-in zoom-in duration-300" />
                <span>Applied Successfully!</span>
              </>
            ) : (
              "Apply Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
