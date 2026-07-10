import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REASON_CONFIGS } from "@/constants/reason.config";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const LiftRestrictionDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
  userName,
  type = "restriction", // restriction, ban, suspension, deactivation, deletion
}) => {
  const [reason, setReason] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setSelectedReason("");
      setLocalLoading(false);
      setSuccess(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    const finalReason = selectedReason === "Other" ? reason : selectedReason;
    const promise = onConfirm(finalReason);

    if (promise && typeof promise.then === "function") {
      setLocalLoading(true);
      setSuccess(false);
      try {
        await promise;
        setSuccess(true);
        setLocalLoading(false);
        setTimeout(() => {
          onOpenChange(false);
        }, 1500);
      } catch (err) {
        setLocalLoading(false);
      }
    } else {
      setReason("");
      setSelectedReason("");
    }
  };

  const getTitle = () => {
    if (type === "banned") return "Lift Account Ban";
    if (type === "suspended") return "Lift Account Suspension";
    if (type === "deactivated") return "Reactivate Account";
    if (type === "deleted") return "Cancel Account Deletion";
    return "Lift Account Restriction";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
        <div className="bg-white p-8 space-y-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-slate-900">
              {getTitle()}
            </DialogTitle>
          </div>

          <p className="text-slate-500 text-sm leading-relaxed">
            This action will restore full platform access to{" "}
            <span className="font-bold text-slate-700">{userName}</span>. Please
            provide a reason for lifting this{" "}
            {type === "banned"
              ? "ban"
              : type === "suspended"
                ? "suspension"
                : "restriction"}{" "}
            for the audit trail.
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">
                Reason for lifting
              </label>
              <Select
                value={selectedReason}
                onValueChange={(val) => {
                  setSelectedReason(val);
                  if (val !== "Other") setReason("");
                }}
              >
                <SelectTrigger className="h-10 w-full bg-white border border-slate-200 rounded-md px-3 text-xs font-semibold text-slate-600 shadow-sm focus:outline-none focus:border-slate-500 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0 transition-all">
                  <SelectValue placeholder="Select reason..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {REASON_CONFIGS.active?.map((r) => (
                    <SelectItem key={r} value={r} className="text-xs">
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedReason === "Other" && (
              <div className="space-y-2 animate-in slide-in-from-top-1 duration-200">
                <label className="text-xs font-bold text-slate-700">
                  Custom Detailed Reason
                </label>
                <Textarea
                  placeholder="Please specify the detailed reason..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={cn(
                    "min-h-[100px] w-full bg-white border rounded-md p-3 text-xs font-semibold text-slate-600 shadow-sm transition-all outline-none focus:ring-0",
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

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={localLoading || success}
              className="flex-1 h-9 rounded-md text-xs border-slate-200 text-slate-600 font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={
                !selectedReason ||
                (selectedReason === "Other" && (!reason.trim() || reason.length > 500)) ||
                localLoading ||
                success
              }
              className={cn(
                "flex-1 h-9 rounded-md text-xs font-semibold shadow-sm gap-2 transition-all duration-300 flex items-center justify-center min-w-[120px]",
                success
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : selectedReason === "Other" && reason.length > 500
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed border-slate-200"
                    : "bg-brand-aqua hover:bg-brand-hoverAqua text-white"
              )}
            >
              {localLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Lifting...</span>
                </>
              ) : success ? (
                <>
                  <Check className="h-4 w-4 animate-in zoom-in duration-300 text-white" />
                  <span>Lifted Successfully!</span>
                </>
              ) : (
                "Confirm & Lift"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
