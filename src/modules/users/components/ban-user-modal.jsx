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
import { IconLoader2, IconAlertCircle, IconLock, IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { REASON_CONFIGS } from "@/constants/reason.config";

export function BanUserModal({ isOpen, onClose, onConfirm, userName }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedReason("");
      setCustomReason("");
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      const finalReason =
        selectedReason === "Other" ? customReason : selectedReason;
      await onConfirm("Administrative", finalReason);
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md gap-0 p-0 overflow-hidden bg-white rounded-2xl border-none shadow-2xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-red-600">
            <span className="p-2 rounded-lg bg-red-50 text-red-600">
              <IconLock size={20} />
            </span>
            Ban User Account
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-2 space-y-5">
          <div className="p-3 rounded-xl border bg-red-50/50 border-red-100 flex items-start gap-3">
            <IconAlertCircle
              className="shrink-0 mt-0.5 text-red-600"
              size={16}
            />
            <div className="space-y-1">
              <p className="text-xs font-bold leading-none text-red-600">
                Targeting: {userName}
              </p>
              <p className="text-[11px] text-muted-foreground leading-snug">
                This will revoke all access for this user. Their profile will be
                hidden and they will be logged out immediately.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Reason for Ban{" "}
                <span className="text-red-400 font-normal">*</span>
              </Label>
              <Select
                value={selectedReason}
                onValueChange={(val) => {
                  setSelectedReason(val);
                  if (val !== "Other") setCustomReason("");
                }}
              >
                <SelectTrigger className="h-12 w-full border transition-all focus:border-red-500/50 focus:ring-red-500/20">
                  <SelectValue placeholder="Select a reason..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  {REASON_CONFIGS.banned?.map((r) => (
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

            {selectedReason === "Other" && (
              <div className="space-y-2 animate-in zoom-in-95 duration-200">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Custom Detailed Reason
                </Label>
                <Textarea
                  placeholder="Please specify the detailed reason for this action..."
                  className={cn(
                    "text-xs resize-none min-h-[100px] border rounded-lg p-3 focus:ring-red-500/20",
                    customReason.length > 500
                      ? "border-red-500 focus:border-red-600"
                      : "border-slate-200 focus:border-red-500/50"
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
          </div>
        </div>

        <DialogFooter className="bg-slate-50/50 px-6 pt-3 pb-5 flex-row gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-10 font-semibold text-slate-600 border border-slate-300 rounded-lg transition-all duration-300"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              loading ||
              success ||
              !selectedReason ||
              (selectedReason === "Other" && (!customReason.trim() || customReason.length > 500))
            }
            className={cn(
              "flex-1 h-10 font-semibold text-white rounded-lg shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-95 flex items-center justify-center gap-2",
              success
                ? "bg-emerald-600 hover:bg-emerald-700"
                : selectedReason === "Other" && customReason.length > 500,
              "bg-red-600 hover:bg-red-700 text-white"
            )}
          >
            {loading ? (
              <>
                <IconLoader2 className="animate-spin w-4 h-4" />
                <span>Banning...</span>
              </>
            ) : success ? (
              <>
                <IconCheck className="w-4 h-4 animate-in zoom-in duration-300" />
                <span>Banned Successfully!</span>
              </>
            ) : (
              "Confirm Ban Account"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
