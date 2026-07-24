import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const REASONS = [
  { value: "requested_by_customer", label: "Requested by Customer" },
  { value: "duplicate", label: "Duplicate Transaction" },
  { value: "fraudulent", label: "Fraudulent Transaction" }
];

export default function RevokeTransactionDialog({ open, onOpenChange, transaction, onConfirm, loading }) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) {
      setReason("requested_by_customer"); // Default reason
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason) return;
    onConfirm({ reason });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-red-600">
            <ShieldOff className="w-5 h-5" />
            Revoke & Refund
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <p className="text-sm text-slate-600 font-medium">
            Are you sure you want to revoke and refund the transaction for <strong className="text-slate-800">{transaction?.user_email}</strong>?
            This will immediately issue a refund and remove the user's active subscription plan.
          </p>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-800">Reason for Refund</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="h-10 text-sm">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !reason}
              className="bg-red-600 hover:bg-red-700 text-white px-6 rounded-md text-xs font-semibold flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Refund"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
