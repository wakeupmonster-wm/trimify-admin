import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ShieldOff, AlertTriangle, ArrowRight } from "lucide-react";

export default function RevokeSubscriberDialog({ open, onOpenChange, subscriber, onConfirm, loading }) {
  const [step, setStep] = useState(1); // 1: Reason input, 2: Confirmation
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) {
      setStep(1);
      setReason("");
    }
  }, [open, subscriber]);

  const handleNext = (e) => {
    e.preventDefault();
    if (!reason.trim() || reason.length > 500) return;
    setStep(2);
  };

  const handleSubmit = () => {
    onConfirm({ reason: reason.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-xl">
        {step === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                <ShieldOff className="w-5 h-5 text-red-500" />
                Revoke Subscriber Access
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleNext} className="space-y-5 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-semibold text-slate-800">Reason for Revocation</Label>
                  <span className={`text-xs font-bold ${reason.length > 500 ? 'text-red-500' : 'text-slate-500'}`}>
                    {reason.length} / 500
                  </span>
                </div>
                <Textarea
                  placeholder="Please provide a detailed reason for revoking this user's access..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="min-h-[120px] resize-none placeholder:font-normal text-sm focus-visible:ring-red-500"
                  maxLength={500}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="text-sm font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!reason.trim() || reason.length > 500}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-bold text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Confirm Revocation
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                Are you absolutely sure you want to revoke access for <strong className="text-slate-800">{subscriber?.name || subscriber?.email}</strong>?
              </p>
              
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                  <span className="text-slate-500 font-semibold">User:</span>
                  <span className="font-medium text-slate-800">{subscriber?.name} ({subscriber?.email})</span>
                  
                  <span className="text-slate-500 font-semibold">Current Plan:</span>
                  <span className="font-medium text-slate-800">{subscriber?.plan_title || "Unknown Plan"}</span>
                </div>
              </div>

              <div className="bg-red-50 border border-red-100 rounded-lg p-4 space-y-1">
                <span className="text-xs font-bold text-red-800 uppercase tracking-wider">Provided Reason</span>
                <p className="text-sm text-red-900 italic">"{reason}"</p>
              </div>
            </div>

            <DialogFooter className="pt-6">
              <div className="flex justify-end gap-3 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="text-sm font-semibold"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 rounded-md text-sm font-semibold flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Revoking...
                    </>
                  ) : (
                    "Yes, Revoke Access"
                  )}
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
