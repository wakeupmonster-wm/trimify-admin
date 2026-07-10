import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, CalendarPlus, Pencil, Clock, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const ExtendSubscriptionDialog = ({
  open,
  onOpenChange,
  onExtend,
}) => {
  const [days, setDays] = useState(30);
  const [reason, setReason] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setDays(30);
      setReason("");
      setSuccess(false);
      setLocalLoading(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    setLocalLoading(true);
    setSuccess(false);
    try {
      const isOk = await onExtend(Number(days), reason);
      if (isOk) {
        setSuccess(true);
        setLocalLoading(false);
        setTimeout(() => {
          onOpenChange(false);
        }, 1500);
      } else {
        setLocalLoading(false);
      }
    } catch (err) {
      setLocalLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] gap-0 p-0 border-none shadow-2xl rounded-2xl">
        {/* ── Header ── */}
        <DialogHeader className="px-7 pt-7 pb-5 bg-gradient-to-b from-slate-50 to-white">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-aqua/10 border border-brand-aqua/20">
              <CalendarPlus className="h-6 w-6 text-brand-aqua" />
            </div>
            <div className="flex flex-col gap-0.5 text-left">
              <DialogTitle className="text-lg font-extrabold text-slate-900 tracking-tight">
                Extend Plan
              </DialogTitle>
              <p className="text-[12px] text-slate-500 font-medium">
                Add extra days to current subscription
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* ── Form Body ── */}
        <div className="px-7 pb-2 space-y-4 bg-white">
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Duration (Days) <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                min={1}
                className="h-12 pl-10 text-sm font-medium rounded-md border-slate-300 shadow-none focus-visible:border-slate-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Reason / Note{" "}
              <span className="normal-case font-normal text-slate-400">
                (Optional)
              </span>
            </Label>
            <div className="relative">
              <Pencil className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <Textarea
                placeholder="Write a reason for this extension..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[100px] pl-10 pt-2.5 text-sm font-medium rounded-md border-slate-300 shadow-none focus-visible:border-slate-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <DialogFooter className="flex items-center sm:justify-end px-7 py-5 bg-slate-50/80 border-t border-slate-100 gap-3 rounded-b-2xl">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={localLoading || success}
            className="font-semibold text-[13px] text-slate-600 border-slate-300 h-10 px-6 rounded-md hover:bg-slate-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={localLoading || success}
            className={cn(
              "text-[13px] font-bold h-10 px-6 rounded-md shadow-sm gap-2 transition-all duration-300 flex items-center justify-center min-w-[140px]",
              success
                ? "bg-green-500 hover:bg-green-600 text-white shadow-none border border-emerald-800/20"
                : "bg-brand-aqua hover:bg-brand-hoverAqua text-white shadow-sm"
            )}
          >
            {localLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Extending...</span>
              </>
            ) : success ? (
              <>
                <Check className="h-4 w-4 animate-in zoom-in duration-300 text-white" />
                <span>Extended!</span>
              </>
            ) : (
              <>
                <CalendarPlus className="h-4 w-4" />
                <span>Extend Now</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
