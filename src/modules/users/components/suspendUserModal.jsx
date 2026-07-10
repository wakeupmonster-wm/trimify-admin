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
  IconClockPause,
} from "@tabler/icons-react";
import { REASON_CONFIGS } from "@/constants/reason.config";

export function SuspendUserModal({ isOpen, onClose, onConfirm, userName }) {
  const [loading, setLoading] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [suspensionDuration, setSuspensionDuration] = useState("24");
  const [customDuration, setCustomDuration] = useState("");

  const customHoursNum = parseInt(customDuration);
  // Only show red border + error when user typed something out of range
  const isCustomEmpty = suspensionDuration === "custom" && customDuration.trim() === "";
  const isSuspensionInvalid =
    suspensionDuration === "custom" &&
    customDuration.trim() !== "" &&
    !isNaN(customHoursNum) &&
    (customHoursNum < 1 || customHoursNum > 168);
  // Disables submit when empty OR invalid
  const isSuspensionBlocking = isCustomEmpty || isSuspensionInvalid;

  useEffect(() => {
    if (isOpen) {
      setSelectedReason("");
      setCustomReason("");
      setSuspensionDuration("24");
      setCustomDuration("");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const finalReason =
        selectedReason === "Other" ? customReason : selectedReason;
      const durationHours =
        suspensionDuration === "custom"
          ? parseInt(customDuration) || 24
          : parseInt(suspensionDuration);

      await onConfirm(finalReason, durationHours);
      onClose();
    } catch (error) {
      // Error handled by caller
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md gap-0 p-0 overflow-hidden bg-white rounded-2xl border-none shadow-2xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-amber-600">
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600 animate-pulse">
              <IconClockPause size={20} />
            </span>
            Suspend User Account
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-2 space-y-6">
          <div className="p-3 rounded-xl border bg-amber-50/50 border-amber-100 flex items-start gap-3">
            <IconAlertCircle
              className="shrink-0 mt-0.5 text-amber-600"
              size={16}
            />
            <div className="space-y-1">
              <p className="text-xs font-bold leading-none text-amber-600">
                Targeting: {userName}
              </p>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Temporary restriction. The user will be unable to use matching
                or messaging features for the selected duration.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Reason for Suspension{" "}
                <span className="text-red-400 font-normal">*</span>
              </Label>
              <Select
                value={selectedReason}
                onValueChange={(val) => {
                  setSelectedReason(val);
                  if (val !== "Other") setCustomReason("");
                }}
              >
                <SelectTrigger className="h-10 w-full bg-white border border-slate-200 rounded-md px-3 text-xs font-semibold text-slate-600 shadow-sm focus:outline-none focus:border-slate-500 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0 transition-all">
                  <SelectValue placeholder="Select a reason..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  {REASON_CONFIGS.suspended?.map((r) => (
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
                  Custom Detailed Reason{" "}
                  <span className="text-red-400 font-normal">*</span>
                </Label>
                <Textarea
                  placeholder="Explain why the account is being suspended..."
                  className={cn(
                    "min-h-[80px] w-full bg-white border rounded-md p-3 text-xs font-semibold text-slate-600 shadow-sm transition-all outline-none focus:ring-0",
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
                  <SelectTrigger className="h-10 w-full bg-white border border-slate-200 rounded-md px-3 text-xs font-semibold text-slate-600 shadow-sm focus:outline-none focus:border-slate-500 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0 transition-all">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200">
                    <SelectItem
                      value="12"
                      className="text-xs font-medium py-2.5"
                    >
                      12 Hours
                    </SelectItem>
                    <SelectItem
                      value="24"
                      className="text-xs font-medium py-2.5"
                    >
                      24 Hours (1 Day)
                    </SelectItem>
                    <SelectItem
                      value="48"
                      className="text-xs font-medium py-2.5"
                    >
                      48 Hours (2 Days)
                    </SelectItem>
                    <SelectItem
                      value="72"
                      className="text-xs font-medium py-2.5"
                    >
                      72 Hours (3 Days)
                    </SelectItem>
                    <SelectItem
                      value="custom"
                      className="text-xs font-medium py-2.5"
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
                      "h-10 w-full bg-white border rounded-md px-3 text-xs font-semibold text-slate-600 shadow-sm focus-visible:border-slate-500 transition-all",
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
          </div>
        </div>

        <DialogFooter className="bg-slate-50/50 p-6 flex-row gap-3 border-t border-slate-100">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-10 cursor-pointer font-semibold border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-lg"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              loading ||
              !selectedReason ||
              (selectedReason === "Other" && (!customReason.trim() || customReason.length > 500)) ||
              isSuspensionBlocking
            }
            className={cn(
              "flex-1 h-10 font-semibold rounded-lg transition-all duration-300 disabled:opacity-95 cursor-pointer disabled:cursor-not-allowed",
              selectedReason === "Other" && customReason.length > 500
                ? "bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-500/20"
                : "bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-500/20"
            )}
          >
            {loading ? (
              <IconLoader2 className="animate-spin" />
            ) : (
              "Confirm Suspension"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
