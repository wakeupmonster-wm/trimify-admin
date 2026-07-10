import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const RevokeSubscriptionDialog = ({
  open,
  onOpenChange,
  onRevoke,
}) => {
  const [localLoading, setLocalLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setSuccess(false);
      setLocalLoading(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    setLocalLoading(true);
    setSuccess(false);
    try {
      const isOk = await onRevoke();
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
      <DialogContent className="sm:max-w-[550px] gap-0 p-0 border-none shadow-2xl rounded-2xl">
        {/* ── Header ── */}
        <DialogHeader className="px-7 pt-7 pb-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 border border-rose-100">
              <ShieldAlert className="h-6 w-6 text-rose-500" />
            </div>
            <div className="flex flex-col gap-0.5 text-left">
              <DialogTitle className="text-lg font-extrabold text-slate-900 tracking-tight">
                Terminate Access?
              </DialogTitle>
              <p className="text-[12px] text-slate-500 font-medium">
                This will immediately revoke all privileges.
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* ── Form Body ── */}
        <div className="px-7 py-5 space-y-4 bg-white">
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3">
            <div className="p-2 bg-rose-100/80 rounded-lg shrink-0 mt-0.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-[12px] font-semibold text-rose-900/80 leading-relaxed">
              Are you absolutely sure you want to revoke this user's
              subscription? This action cannot be undone and will terminate
              access immediately.
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
                : "bg-rose-500 hover:bg-rose-600 text-white"
            )}
          >
            {localLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Revoking...</span>
              </>
            ) : success ? (
              <>
                <Check className="h-4 w-4 animate-in zoom-in duration-300 text-white" />
                <span>Revoked!</span>
              </>
            ) : (
              <>
                <ShieldAlert className="h-4 w-4" />
                <span>Revoke Now</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
