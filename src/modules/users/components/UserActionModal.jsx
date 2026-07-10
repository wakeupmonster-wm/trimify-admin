import React, { useState, useEffect } from "react";
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
import { cn } from "@/lib/utils";
import {
  IconLoader2,
  IconAlertCircle,
  IconLock,
  IconClockPause,
  IconUserCheck,
} from "@tabler/icons-react";
import { REASON_CONFIGS } from "@/constants/reason.config";
import { UnlockIcon, Mail } from "lucide-react";

/**
 * Unified Modal for User Actions (Ban or Suspend)
 * @param {Object} props
 * @param {"ban" | "suspend"} props.type - Type of action
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Function to close modal
 * @param {Function} props.onConfirm - Function to handle confirmation (reason, [duration])
 * @param {string} props.userName - Name of the user being targeted
 */
export function UserActionModal({
  type,
  isOpen,
  onClose,
  onConfirm,
  userName,
}) {
  const [loading, setLoading] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [suspensionDuration, setSuspensionDuration] = useState("24");
  const [customDuration, setCustomDuration] = useState("");
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [channels, setChannels] = useState({ email: true, push: true });
  // const [ctaLabel, setCtaLabel] = useState("");
  const [ctaAction, setCtaAction] = useState("OPEN_APP");

  const isBan = type === "ban";
  const isSuspend = type === "suspend";
  const isUnban = type === "unban";
  const isUnsuspend = type === "unsuspend";

  const customHoursNum = parseInt(customDuration);
  // Only invalid (red border + error) when user has typed something out of range
  const isCustomEmpty = isSuspend && suspensionDuration === "custom" && customDuration.trim() === "";
  const isSuspensionInvalid =
    isSuspend &&
    suspensionDuration === "custom" &&
    customDuration.trim() !== "" &&
    (!isNaN(customHoursNum)) &&
    (customHoursNum < 1 || customHoursNum > 168);
  // Disables submit when custom is empty OR invalid
  const isSuspensionBlocking = isCustomEmpty || isSuspensionInvalid;

  const config = {
    ban: {
      title: "Ban User Account",
      icon: <IconLock size={20} />,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
      buttonBg: "bg-red-600 hover:bg-red-700 shadow-red-500/20",
      reasons: REASON_CONFIGS.banned,
      description:
        "This will revoke all access for this user. Their profile will be hidden and they will be logged out immediately.",
      confirmLabel: "Confirm Ban Account",
    },
    suspend: {
      title: "Suspend User Account",
      icon: <IconClockPause size={20} />,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
      buttonBg: "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20",
      reasons: REASON_CONFIGS.suspended,
      description:
        "Temporary restriction. The user will be unable to use matching or messaging features for the selected duration.",
      confirmLabel: "Confirm Suspension",
    },
    unban: {
      title: "Unban User Account",
      icon: <IconUserCheck size={20} />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      buttonBg: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20",
      reasons: REASON_CONFIGS.unbanned,
      description:
        "This will restore full access to the user's account. They will be able to log in and use all features again.",
      confirmLabel: "Confirm Unban User",
    },
    unsuspend: {
      title: "Lift Suspension",
      icon: <UnlockIcon size={20} />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      buttonBg: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20",
      reasons: REASON_CONFIGS.unsuspended,
      description:
        "This will immediately lift any temporary restrictions on the user's account features.",
      confirmLabel: "Confirm Unsuspend",
    },
    notify: {
      title: "Send Notification",
      icon: <Mail size={20} />,
      color: "text-cyan-600",
      bg: "bg-cyan-50/50",
      border: "border-cyan-100",
      buttonBg: "bg-cyan-600 hover:bg-cyan-700 shadow-cyan-500/20",
      reasons: [],
      description:
        "Send an individual Email and/or Push Notification directly to this user's registered delivery channels.",
      confirmLabel: "Send Notification",
    },
  };

  const currentConfig = config[type] || config.ban;

  useEffect(() => {
    if (isOpen) {
      setSelectedReason("");
      setCustomReason("");
      setSuspensionDuration("24");
      setCustomDuration("");
      setNotifyTitle("");
      setNotifyMessage("");
      setChannels({ email: true, push: true });
      // setCtaLabel("");
      setCtaAction("OPEN_APP");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    const isNotify = type === "notify";
    if (!isNotify && !selectedReason && !customReason) {
      toast.error("Please select a reason");
      return;
    }
    if (isNotify && (!notifyTitle || !notifyMessage || (!channels.email && !channels.push))) {
      toast.error("Please fill all notification fields and select a channel");
      return;
    }
    setLoading(true);
    try {
      if (isNotify) {
        const activeChannels = Object.keys(channels).filter((key) => channels[key]);
        const finalCtaLabel = channels.push ? ctaLabel : "";
        const finalCtaAction = channels.push ? ctaAction : "";
        await onConfirm(notifyTitle, notifyMessage, activeChannels, finalCtaLabel, finalCtaAction);
      } else {
        const finalReason =
          selectedReason === "Other" ? customReason : selectedReason;

        if (isSuspend) {
          const durationHours =
            suspensionDuration === "custom"
              ? parseInt(customDuration) || 24
              : parseInt(suspensionDuration);
          await onConfirm(finalReason, durationHours);
        } else {
          // For ban, unban, and unsuspend, we only need the reason
          await onConfirm(finalReason);
        }
      }
      onClose();
    } catch (error) {
      console.error("Action Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg gap-0 p-0 overflow-hidden bg-white rounded-2xl border-none shadow-2xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle
            className={cn(
              "flex items-center gap-2 text-xl font-bold",
              currentConfig.color,
            )}
          >
            <span
              className={cn(
                "p-2 rounded-lg",
                currentConfig.bg,
                isSuspend && "animate-pulse",
              )}
            >
              {currentConfig.icon}
            </span>
            {currentConfig.title}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-2 space-y-4">
          <div
            className={cn(
              "p-3 rounded-xl border flex items-start gap-3",
              currentConfig.bg,
              currentConfig.border,
            )}
          >
            <IconAlertCircle
              className={cn("shrink-0 mt-0.5", currentConfig.color)}
              size={16}
            />
            <div className="space-y-2">
              <p
                className={cn(
                  "text-xs font-bold leading-none",
                  currentConfig.color,
                )}
              >
                Targeting: {userName}
              </p>
              <p className="text-[11px] font-medium text-gray-700 leading-snug">
                {currentConfig.description}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {type !== "notify" && (
              <>
                {/* Reason Selection */}
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Reason for {type}{" "}
                    <span className="text-red-400 font-normal">*</span>
                  </Label>
                  <Select
                    value={selectedReason}
                    onValueChange={(val) => {
                      setSelectedReason(val);
                      if (val !== "Other") setCustomReason("");
                    }}
                  >
                    <SelectTrigger className="h-10 w-full bg-white border border-slate-200 rounded-md px-3 text-xs font-semibold text-slate-800 shadow-sm focus:border-slate-500 transition-all outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0">
                      <SelectValue placeholder={`Select ${type} reason...`} />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-slate-200">
                      {currentConfig.reasons?.map((r) => (
                        <SelectItem
                          key={r}
                          value={r}
                          className="text-[11px] font-medium py-2"
                        >
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Reason Textarea */}
                {selectedReason === "Other" && (
                  <div className="space-y-2 animate-in zoom-in-95 duration-200">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Custom Detailed Reason{" "}
                      <span className="text-red-400 font-normal">*</span>
                    </Label>
                    <Textarea
                      placeholder="Please specify the detailed reason for this action..."
                      className={cn(
                        "min-h-[100px] w-full bg-white border rounded-md p-3 text-xs font-semibold text-slate-800 shadow-sm transition-all outline-none focus:ring-0",
                        customReason.length > 500
                          ? "border-red-400 focus-visible:border-red-500"
                          : "border-slate-200 focus-visible:border-slate-500"
                      )}
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                    />
                    <div className="flex justify-between items-center">
                      {customReason.length > 500 && (
                        <span className="text-[10px] font-semibold text-red-500 animate-in fade-in duration-200">
                          Maximum 500 characters allowed
                        </span>
                      )}
                      <span
                        className={cn(
                          "text-[10px] font-semibold transition-colors ml-auto",
                          customReason.length > 500
                            ? "text-red-500"
                            : customReason.length > 450
                              ? "text-amber-500"
                              : "text-slate-400"
                        )}
                      >
                        {customReason.length} / 500
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}

            {type === "notify" && (
              <div className="pt-2 space-y-4 animate-in zoom-in-95 duration-200">
                {/* Channels Selection */}
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                    Delivery Channels
                  </Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        checked={channels.email}
                        onChange={(e) =>
                          setChannels((prev) => ({
                            ...prev,
                            email: e.target.checked,
                          }))
                        }
                        className="rounded border-slate-200 text-cyan-600 focus:ring-cyan-600/20 w-4 h-4 cursor-pointer"
                      />
                      Email
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        checked={channels.push}
                        onChange={(e) =>
                          setChannels((prev) => ({
                            ...prev,
                            push: e.target.checked,
                          }))
                        }
                        className="rounded border-slate-200 text-cyan-600 focus:ring-cyan-600/20 w-4 h-4 cursor-pointer"
                      />
                      Push Notification
                    </label>
                  </div>
                </div>

                {/* Title / Subject Input */}
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                    Title / Subject
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter notification title or subject..."
                    className="h-10 w-full bg-white border border-slate-200 rounded-md px-3 text-xs font-semibold text-slate-800 shadow-sm focus-visible:border-slate-500 transition-all outline-none focus:ring-0"
                    value={notifyTitle}
                    onChange={(e) => setNotifyTitle(e.target.value)}
                  />
                </div>

                {/* Message Body Textarea */}
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                    Message Body
                  </Label>
                  <Textarea
                    placeholder="Enter message details..."
                    className="min-h-[120px] w-full bg-white border border-slate-200 rounded-md p-3 text-xs font-semibold text-slate-800 shadow-sm focus-visible:border-slate-500 transition-all outline-none focus:ring-0"
                    value={notifyMessage}
                    onChange={(e) => setNotifyMessage(e.target.value)}
                  />
                </div>

                {/* Call To Action (CTA) fields for push notifications */}
                {channels.push && (
                  <div className="pt-2 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                      Call To Action (CTA)
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* <div className="space-y-1">
                        <Label className="text-[10px] text-slate-500 font-semibold">Button Text</Label>
                        <Input
                          placeholder="e.g. View Offer"
                          className="h-10 w-full bg-white border border-slate-200 rounded-md px-3 text-xs font-semibold text-slate-800 shadow-sm focus-visible:border-slate-500 transition-all outline-none"
                          value={ctaLabel}
                          onChange={(e) => setCtaLabel(e.target.value)}
                        />
                      </div> */}
                      <div className="space-y-1">
                        <Label className="text-[10px] text-slate-500 font-semibold">Landing Page</Label>
                        <Select value={ctaAction} onValueChange={setCtaAction}>
                          <SelectTrigger className="h-10 w-full bg-white border border-slate-200 rounded-md px-3 text-xs font-semibold text-slate-800 shadow-sm">
                            <SelectValue placeholder="Select Action" />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg border-slate-200">
                            <SelectItem value="OPEN_APP" className="text-[11px]">Open App</SelectItem>
                            <SelectItem value="BUY_PREMIUM" className="text-[11px]">Premium Subscription Page</SelectItem>
                            <SelectItem value="OPEN_CHAT" className="text-[11px]">Chat Hub</SelectItem>
                            <SelectItem value="DISCOVERY" className="text-[11px]">User Discovery</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Suspension Duration (Only for suspend type) */}
            {isSuspend && (
              <div className="pt-2 space-y-4">
                <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Suspension Duration{" "}
                    <span className="text-red-400 font-normal">*</span>
                  </Label>
                  <Select
                    value={suspensionDuration}
                    onValueChange={setSuspensionDuration}
                  >
                    <SelectTrigger className="h-10 w-full bg-white border border-slate-200 rounded-md px-3 text-xs font-semibold text-slate-800 shadow-sm focus:border-slate-500 transition-all outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200">
                      <SelectItem
                        value="12"
                        className="text-[11px] font-medium py-2"
                      >
                        12 Hours
                      </SelectItem>
                      <SelectItem
                        value="24"
                        className="text-[11px] font-medium py-2"
                      >
                        24 Hours (1 Day)
                      </SelectItem>
                      <SelectItem
                        value="48"
                        className="text-[11px] font-medium py-2"
                      >
                        48 Hours (2 Days)
                      </SelectItem>
                      <SelectItem
                        value="72"
                        className="text-[11px] font-medium py-2"
                      >
                        72 Hours (3 Days)
                      </SelectItem>
                      <SelectItem
                        value="custom"
                        className="text-[11px] font-medium py-2"
                      >
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
        </div>

        <DialogFooter className="bg-slate-50/50 px-6 py-5 flex-row gap-1 border-t border-slate-100">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-10 font-semibold text-slate-600 hover:bg-slate-100 rounded-md"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              loading ||
              (type === "notify"
                ? !notifyTitle || !notifyMessage || (!channels.email && !channels.push) || (channels.push && !ctaLabel)
                : !selectedReason ||
                (selectedReason === "Other" && (!customReason.trim() || customReason.length > 500)) ||
                isSuspensionBlocking)
            }
            className={cn(
              "flex-1 h-10 font-semibold rounded-md transition-all disabled:opacity-95 disabled:cursor-not-allowed",
              type !== "notify" && selectedReason === "Other" && customReason.length > 500
                ? currentConfig.buttonBg
                : currentConfig.buttonBg,
            )}
          >
            {loading ? (
              <IconLoader2 className="animate-spin" />
            ) : (
              currentConfig.confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}