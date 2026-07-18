import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Save, CreditCard } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@/components/ui/dialog";

export function SubscriptionEditDialog({
  open,
  onOpenChange,
  onSubmit,
  editData,
  loading,
}) {
  const [formData, setFormData] = useState({ price: "", features: "" });

  useEffect(() => {
    if (open && editData) {
      setFormData({
        price: editData.price || "",
        features: editData.features || "",
      });
    }
  }, [open, editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit && editData) {
      onSubmit({
        id: editData.id,
        price: formData.price,
        features: formData.features,
      });
    }
  };

  if (!editData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-white border-slate-300/60 rounded-xl shadow-2xl">
        <DialogHeader className="px-6 py-5 border-b border-slate-300/60 flex flex-row items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-app-primary2/10 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <DialogTitle className="text-slate-900 text-lg font-bold text-left">
              Edit Subscription
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs mt-1 text-left">
              Modify the existing subscription plan details.
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Plan Title — read only, backend does not support renaming a plan */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Plan Title
              </Label>
              <Input
                value={editData.title || ""}
                disabled
                className="h-10 text-sm font-medium border-slate-300/60 bg-slate-50 text-slate-500"
              />
            </div>

            {/* Sub Title — read only */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Sub Title
              </Label>
              <Input
                value={editData.subtitle || ""}
                disabled
                className="h-10 text-sm font-medium border-slate-300/60 bg-slate-50 text-slate-500"
              />
            </div>

            {/* Price — editable */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Price ($)
              </Label>
              <Input
                name="price"
                placeholder="e.g. 34.99"
                value={formData.price}
                onChange={handleChange}
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300/60"
                required
              />
            </div>

            {/* Duration — read only */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Duration (in Months)
              </Label>
              <Input
                value={editData.duration || ""}
                disabled
                className="h-10 text-sm font-medium border-slate-300/60 bg-slate-50 text-slate-500"
              />
            </div>

            {/* Features — editable */}
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs font-bold text-slate-800">
                Features (comma separated)
              </Label>
              <Textarea
                name="features"
                placeholder="e.g. Unlimited Projects, Priority Support, Advanced Analytics"
                value={formData.features}
                onChange={handleChange}
                className="min-h-[80px] text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300/60 resize-none p-3"
                required
              />
            </div>
          </div>

          <p className="mt-4 text-[11px] text-slate-400 font-medium">
            Only price and features can be updated — title, sub title and
            duration are managed elsewhere.
          </p>

          <div className="mt-8 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-md px-6 py-2 h-auto text-xs font-semibold border-slate-300/60"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-app-primary2 hover:bg-app-primary5 text-white rounded-md px-6 py-2 h-auto text-xs font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Update Plan
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
