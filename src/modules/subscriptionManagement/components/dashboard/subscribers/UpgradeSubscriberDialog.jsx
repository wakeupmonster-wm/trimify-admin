import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowUpCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UpgradeSubscriberDialog({ open, onOpenChange, subscriber, plans, onConfirm, loading }) {
  const [planId, setPlanId] = useState("");
  const [planExpiry, setPlanExpiry] = useState("");

  useEffect(() => {
    if (open) {
      setPlanId(subscriber?.plan_id ? String(subscriber.plan_id) : "");
      setPlanExpiry("");
    }
  }, [open, subscriber]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!planId || !planExpiry) return;
    onConfirm({ plan_id: Number(planId), plan_expiry: planExpiry });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <ArrowUpCircle className="w-5 h-5 text-brand-aqua" />
            Upgrade {subscriber?.name || "Subscriber"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-800">Plan</Label>
            <Select value={planId} onValueChange={setPlanId}>
              <SelectTrigger className="h-10 text-sm">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={String(plan.id)}>
                    {plan.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-800">New Expiry Date</Label>
            <Input
              type="date"
              value={planExpiry}
              onChange={(e) => setPlanExpiry(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="h-10 text-sm"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !planId || !planExpiry}
            className="bg-brand-aqua hover:bg-brand-hoverAqua text-white px-6 rounded-md text-xs font-semibold flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Upgrading...
              </>
            ) : (
              "Confirm Upgrade"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
