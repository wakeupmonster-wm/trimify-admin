import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { toast } from "sonner";
import {
  IconEdit,
  IconLoader2,
  IconAlertCircle,
  IconShieldCheck,
  IconLock,
  IconClockPause,
  IconGavel,
  IconInfoCircle,
  IconCheck,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
  bannedUserProfile,
  unbanUserProfile,
  suspendUserProfile,
  unsuspendUserProfile,
  fetchUserData,
} from "../../store/user.slice";
import { Textarea } from "@/components/ui/textarea";
import { REASON_CONFIGS } from "@/constants/reason.config";

export const EditSettingsDialog = ({ userData }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedReason, setSelectedReason] = useState("");

  const currentStatus = userData.account.status;

  // ✅ FIX: Start with empty string (no selection) instead of current status
  const [status, setStatus] = useState("");

  useEffect(() => {
    setStatus(currentStatus);
    setReason("");
    setSelectedReason("");
    setSuccess(false);
    setLoading(false);
  }, [currentStatus, isOpen]);

  const handleSave = async () => {
    // ✅ Guard: Nothing selected
    if (!status) {
      toast.error("Please select an action first");
      return;
    }

    setLoading(true);
    setSuccess(false);
    const nickname = userData?.profile?.nickname || "User";

    try {
      const finalReason = selectedReason === "Other" ? reason : selectedReason;

      // FIX: Corrected logical comparison
      if (
        (currentStatus === "banned" || currentStatus === "suspended") &&
        status === "active"
      ) {
        // Note: unbanUserProfile thunk accepts a payload object with userId, category, and reason
        await dispatch(
          unbanUserProfile({
            userId: userData._id,
            category: "Administrative",
            reason: finalReason || "Manual unban by admin",
          }),
        ).unwrap();
        toast.success("Account Restored");
      } else if (status === "banned") {
        await dispatch(
          bannedUserProfile({
            userId: userData._id,
            category: "Administrative",
            reason: finalReason || "Manual ban by admin",
          }),
        ).unwrap();
        toast.success("User Banned");
      } else if (status === "suspended") {
        const hours = 24;
        await dispatch(
          suspendUserProfile({
            userId: userData._id,
            reason: finalReason || "Temporary suspension",
            durationHours: hours,
          }),
        ).unwrap();
        toast.success("User Suspended");
      }

      // 🔥 RE-FETCH the fresh data for the profile page
      await dispatch(fetchUserData(userData._id));

      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        setIsOpen(false);
        setReason("");
      }, 1500);
    } catch (err) {
      toast.error(err || "Update failed");
      setLoading(false);
    }
  };

  // Status config helper
  const getStatusConfig = (val) => {
    switch (val) {
      case "active":
        return {
          color: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-100",
          icon: <IconShieldCheck />,
        };
      case "banned":
        return {
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-100",
          icon: <IconLock />,
        };
      case "suspended":
        return {
          color: "text-amber-600",
          bg: "bg-amber-50",
          border: "border-amber-100",
          icon: <IconClockPause />,
        };
      default:
        return {
          color: "text-slate-500",
          bg: "bg-slate-50",
          border: "border-slate-200",
          icon: <IconGavel />,
        };
    }
  };

  // ✅ Use selected status config, or default when nothing selected
  const config = getStatusConfig(status || null);
  const currentConfig = getStatusConfig(currentStatus);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 transition-colors"
        >
          <IconEdit size={14} />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md gap-0 p-0 overflow-hidden">
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

        <div className="p-6 pt-2 space-y-6">
          {/* ✅ NEW: Current Status Indicator - Always visible at top */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Current Status
              </span>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "font-bold text-xs capitalize px-3 py-1",
                currentConfig.color,
                currentConfig.bg,
                currentConfig.border,
              )}
            >
              {React.cloneElement(currentConfig.icon, {
                size: 14,
                className: "mr-1",
              })}
              {currentStatus}
            </Badge>
          </div>

          <div className="space-y-3">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Account Governance
            </Label>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger
                className="h-10 w-full bg-white border border-slate-200 rounded-md px-3 text-xs font-semibold text-slate-600 shadow-sm focus:outline-none focus:border-slate-500 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0 transition-all"
              >
                <SelectValue placeholder="Choose an action to perform..." />
              </SelectTrigger>
              <SelectContent>
                {currentStatus === "banned" ? (
                  <>
                    <SelectItem
                      value="active"
                      className="text-green-600 font-bold focus:bg-green-50"
                    >
                      ✅ Unban & Restore Account
                    </SelectItem>
                    <SelectItem value="suspended" className="text-amber-600">
                      ⏳ Switch to Suspension
                    </SelectItem>
                  </>
                ) : currentStatus === "suspended" ? (
                  <>
                    <SelectItem
                      value="active"
                      className="text-green-600 font-bold"
                    >
                      ✅ Lift Suspension (Set Active)
                    </SelectItem>
                    <SelectItem
                      value="banned"
                      className="text-red-600 font-bold"
                    >
                      🚫 Upgrade to Permanent Ban
                    </SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem
                      value="suspended"
                      className="text-amber-600 font-medium"
                    >
                      ⚠️ Suspend Account
                    </SelectItem>
                    <SelectItem
                      value="banned"
                      className="text-red-600 font-bold"
                    >
                      🚫 Ban Account Permanently
                    </SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>

            {/* Dynamic Status Description */}
            <div
              className={cn(
                "p-3 rounded-lg border flex items-start gap-3 transition-colors",
                config.bg,
                config.border,
              )}
            >
              <IconAlertCircle
                className={cn("shrink-0 mt-0.5", config.color)}
                size={16}
              />
              <div className="space-y-1">
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
                    "Restores all login privileges. The user will be able to swipe, match, and chat immediately."}
                  {status === "banned" &&
                    "Revokes all access. User's profile will be hidden and they will be force-logged out."}
                  {status === "suspended" &&
                    "Temporary restriction. User remains in database but cannot perform matches or chats."}
                  {status === "deactivated" &&
                    "Account remains but is inactive. Can be reactivated by the user manually."}
                </p>
              </div>
            </div>

            {/* Reason Selection - Standardized across dialogs */}
            {status !== currentStatus && status && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Reason for {status} action
                  </Label>
                  <Select
                    value={selectedReason}
                    onValueChange={(val) => {
                      setSelectedReason(val);
                      if (val !== "Other") setReason("");
                    }}
                  >
                    <SelectTrigger className="h-10 w-full bg-white border border-slate-200 rounded-md px-3 text-xs font-semibold text-slate-600 shadow-sm focus:outline-none focus:border-slate-500 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0 transition-all">
                      <SelectValue placeholder="Select a reason..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {REASON_CONFIGS[status]?.map((r) => (
                        <SelectItem key={r} value={r} className="text-xs">
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedReason === "Other" && (
                  <div className="space-y-2 animate-in slide-in-from-top-1 duration-200">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Custom Detailed Reason
                    </Label>
                    <Textarea
                      placeholder="Please specify the detailed reason..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className={cn(
                        "min-h-[80px] w-full bg-white border rounded-md p-3 text-xs font-semibold text-slate-600 shadow-sm transition-all outline-none focus:ring-0",
                        reason.length > 500
                          ? "border-red-400 focus-visible:border-red-500"
                          : "border-slate-200 focus-visible:border-slate-500"
                      )}
                    />
                    <div className="flex justify-between items-center">
                      {reason.length > 500 && (
                        <span className="text-[10px] font-semibold text-red-500 animate-in fade-in duration-200">
                          Maximum 500 characters allowed
                        </span>
                      )}
                      <span
                        className={cn(
                          "text-[10px] font-semibold transition-colors ml-auto",
                          reason.length > 500
                            ? "text-red-500"
                            : reason.length > 450
                            ? "text-amber-500"
                            : "text-slate-400"
                        )}
                      >
                        {reason.length} / 500
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="bg-muted/30 p-6 flex-row gap-2">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="flex-1"
            disabled={loading || success}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              loading ||
              success ||
              !status ||
              (status !== currentStatus &&
                status !== "active" &&
                (!selectedReason || (selectedReason === "Other" && (!reason.trim() || reason.length > 500))))
            }
            className={cn(
              "flex-[2] font-bold shadow-sm transition-all flex items-center justify-center gap-2 duration-300",
              !status ||
                (status !== currentStatus &&
                  status !== "active" &&
                  (!selectedReason || (selectedReason === "Other" && (!reason.trim() || reason.length > 500))))
                ? "bg-slate-200 text-slate-400 cursor-not-allowed border-slate-200"
                : success
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : status === "banned"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : status === "active"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : status === "suspended"
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "",
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
            ) : !status ? (
              "Select an Action"
            ) : (
              "Apply Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
