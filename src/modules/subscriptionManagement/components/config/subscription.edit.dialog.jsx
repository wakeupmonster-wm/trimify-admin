import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function SubscriptionEditDialog({ open, onOpenChange, onSubmit, editData, loading }) {
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
      onSubmit({ id: editData.id, price: formData.price, features: formData.features });
    }
  };

  if (!editData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 border-none rounded-xl overflow-hidden shadow-2xl">
        <DialogHeader className="bg-brand-aqua p-4 text-center">
          <DialogTitle className="text-white text-lg font-bold text-center w-full mx-auto">
            Edit Subscription
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Plan Title — read only, backend does not support renaming a plan */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Plan Title
              </Label>
              <Input
                value={editData.title || ""}
                disabled
                className="h-10 text-sm font-medium border-slate-200 bg-slate-50 text-slate-500"
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
                className="h-10 text-sm font-medium border-slate-200 bg-slate-50 text-slate-500"
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
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300"
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
                className="h-10 text-sm font-medium border-slate-200 bg-slate-50 text-slate-500"
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
                className="min-h-[80px] text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300 resize-none p-3"
                required
              />
            </div>
          </div>

          <p className="mt-4 text-[11px] text-slate-400 font-medium">
            Only price and features can be updated — title, sub title and duration are managed elsewhere.
          </p>

          <div className="mt-6 flex justify-center">
            <Button
              type="submit"
              disabled={loading}
              className="bg-brand-aqua hover:bg-brand-hoverAqua text-white rounded-md px-8 py-2.5 h-auto text-sm font-semibold flex items-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Update Subscription
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
