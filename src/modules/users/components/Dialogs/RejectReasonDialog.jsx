import { useState, useEffect } from "react";
import { AlertTriangle, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Ensure you have this shadcn component

const REJECTION_REASONS = [
  "ID Document is blurry or unreadable",
  "Name on ID does not match profile name",
  "ID has expired",
  "Document appears to be tampered with",
  "Selfie does not match ID photo",
  "Incorrect document type provided",
  "Other",
];

const ReasonDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  userName = "this user",
  mode = "reject", // "reject", "re-approve", "unban", "unsuspend"
}) => {
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isNegative = mode === "reject";

  const getReasons = () => {
    switch (mode) {
      case "reject":
        return [
          "ID Document is blurry or unreadable",
          "Name on ID does not match profile name",
          "ID has expired",
          "Document appears to be tampered with",
          "Selfie does not match ID photo",
          "Incorrect document type provided",
          "Other",
        ];
      case "re-approve":
        return [
          "User provided clearer documents",
          "Mistakenly rejected earlier",
          "Documents verified upon manual review",
          "Other",
        ];
      case "unban":
      case "unsuspend":
        return [
          "Appealed successfully",
          "First-time offender (Warning given)",
          "Mistakenly flagged by automated system",
          "Behavior improved / Probation period over",
          "Other",
        ];
      default:
        return ["Other"];
    }
  };

  const REASONS = getReasons();

  useEffect(() => {
    if (!isOpen) {
      setReason("");
      setOtherReason("");
      setLocalLoading(false);
      setSuccess(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    setLocalLoading(true);
    setSuccess(false);
    try {
      const finalReason = reason === "Other" ? otherReason : reason;
      const res = await onConfirm(finalReason);
      if (res !== false) {
        setSuccess(true);
        setLocalLoading(false);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setLocalLoading(false);
      }
    } catch (error) {
      setLocalLoading(false);
    }
  };

  const getTitle = () => {
    if (mode === "reject") return "Reject Verification";
    if (mode === "re-approve") return "Re-approve Verification";
    if (mode === "unban") return "Unban User";
    if (mode === "unsuspend") return "Unsuspend User";
    return "Provide Reason";
  };

  const getDescription = () => {
    if (mode === "reject")
      return `Select a reason for rejecting ${userName}'s identity verification.`;
    if (mode === "re-approve")
      return `Explain why you are re-approving ${userName}'s identity verification.`;
    if (mode === "unban")
      return `Select a reason for unbanning ${userName}. This will be logged.`;
    if (mode === "unsuspend")
      return `Select a reason for unsuspending ${userName}. This will be logged.`;
    return `Select a reason for this action on ${userName}.`;
  };

  const getButtonLabel = () => {
    if (mode === "reject") return "Confirm Rejection";
    if (mode === "re-approve") return "Confirm Approval";
    if (mode === "unban") return "Confirm Unban";
    if (mode === "unsuspend") return "Confirm Unsuspend";
    return "Confirm";
  };

  const getButtonContent = () => {
    if (localLoading) {
      const text =
        mode === "reject"
          ? "Rejecting..."
          : mode === "re-approve"
            ? "Re-approving..."
            : mode === "unban"
              ? "Unbanning..."
              : mode === "unsuspend"
                ? "Unsuspending..."
                : "Confirming...";
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{text}</span>
        </>
      );
    }
    if (success) {
      const text =
        mode === "reject"
          ? "Rejected Successfully!"
          : mode === "re-approve"
            ? "Re-approved Successfully!"
            : mode === "unban"
              ? "Unbanned Successfully!"
              : mode === "unsuspend"
                ? "Unsuspended Successfully!"
                : "Confirmed!";
      return (
        <>
          <Check className="w-4 h-4 animate-in zoom-in duration-300" />
          <span>{text}</span>
        </>
      );
    }
    return getButtonLabel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md glass-card border-border/50">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${isNegative ? "bg-destructive/10" : "bg-emerald-100"}`}
            >
              <AlertTriangle
                className={`w-5 h-5 ${isNegative ? "text-destructive" : "text-emerald-600"}`}
              />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">
                {getTitle()}
              </DialogTitle>
              <DialogDescription className="text-xs font-medium text-slate-600 mt-0.5">
                {getDescription()}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              Reason / Note
            </label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a reason..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200">
                {REASONS.map((r) => (
                  <SelectItem
                    key={r}
                    value={r}
                    className="text-xs font-medium py-2.5"
                  >
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {reason === "Other" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Specific Note
              </label>
              <Textarea
                placeholder="Describe the reason for this action..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                className={cn(
                  "min-h-[100px] w-full bg-white border rounded-md p-3 text-xs font-semibold text-slate-800 shadow-sm transition-all outline-none focus:ring-0",
                  otherReason.length > 500
                    ? "border-red-400 focus-visible:border-red-500"
                    : "border-slate-200 focus-visible:border-slate-500"
                )}
              />
              <div className="flex justify-between items-center">
                {otherReason.length > 500 && (
                  <span className="text-[10px] font-semibold text-red-500 animate-in fade-in duration-200">
                    Maximum 500 characters allowed
                  </span>
                )}
                <span
                  className={cn(
                    "text-[10px] font-semibold transition-colors ml-auto",
                    otherReason.length > 500
                      ? "text-red-500"
                      : otherReason.length > 450
                        ? "text-amber-500"
                        : "text-slate-400"
                  )}
                >
                  {otherReason.length} / 500
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            className="border border-slate-300"
            onClick={onClose}
            disabled={localLoading || success}
          >
            Cancel
          </Button>
          <Button
            variant={isNegative ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={
              !reason ||
              (reason === "Other" && (!otherReason.trim() || otherReason.length > 500)) ||
              localLoading ||
              success
            }
            className={cn(
              "gap-2 font-semibold text-white transition-all duration-300 flex items-center justify-center min-w-[150px]",
              success
                ? "bg-emerald-600 hover:bg-emerald-700 border-none shadow-lg text-white"
                : reason === "Other" && otherReason.length > 500
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white hover:text-white border-none shadow-lg"
                  : isNegative
                    ? "bg-alerts-error hover:bg-alerts-error_dark border-none shadow-sm text-white"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white hover:text-white border-none shadow-lg",
            )}
          >
            {getButtonContent()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  );
};

export default ReasonDialog;
