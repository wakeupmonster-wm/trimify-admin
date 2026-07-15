import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function SubscriptionDialog({ open, onOpenChange, onSubmit, editData }) {
  const isEditMode = !!editData;

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    price: "",
    duration: "",
    features: "",
  });

  useEffect(() => {
    if (open) {
      if (editData) {
        setFormData({
          title: editData.title || "",
          subtitle: editData.subtitle || "",
          price: editData.price || "",
          duration: editData.duration || "",
          features: editData.features || "",
        });
      } else {
        setFormData({
          title: "",
          subtitle: "",
          price: "",
          duration: "",
          features: "",
        });
      }
    }
  }, [open, editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 border-none rounded-xl overflow-hidden shadow-2xl">
        <DialogHeader className="bg-brand-blue p-4 text-center">
          <DialogTitle className="text-white text-lg font-bold text-center w-full mx-auto">
            {isEditMode ? "Edit Subscription" : "Add Subscription"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            
            {/* Plan Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">Plan Title</Label>
              <Input
                name="title"
                placeholder="e.g. Premium"
                value={formData.title}
                onChange={handleChange}
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-aqua/30 font-medium border-slate-300"
                required
              />
            </div>

            {/* Sub Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">Sub Title</Label>
              <Input
                name="subtitle"
                placeholder="e.g. Package details here"
                value={formData.subtitle}
                onChange={handleChange}
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-aqua/30 font-medium border-slate-300"
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">Price ($)</Label>
              <Input
                type="number"
                step="0.01"
                name="price"
                placeholder="e.g. 50.00"
                value={formData.price}
                onChange={handleChange}
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-aqua/30 font-medium border-slate-300"
                required
              />
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">Duration (in Months)</Label>
              <Input
                type="number"
                name="duration"
                placeholder="e.g. 2"
                value={formData.duration}
                onChange={handleChange}
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-aqua/30 font-medium border-slate-300"
                required
              />
            </div>

            {/* Features */}
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs font-bold text-slate-800">Features (comma separated)</Label>
              <Textarea
                name="features"
                placeholder="e.g. Unlimited Projects, Priority Support, Advanced Analytics"
                value={formData.features}
                onChange={handleChange}
                className="min-h-[80px] text-sm focus-visible:ring-1 focus-visible:ring-brand-aqua/30 font-medium border-slate-300 resize-none p-3"
                required
              />
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              type="submit"
              className="bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md px-8 py-2.5 h-auto text-sm font-semibold flex items-center gap-2"
            >
              <Send size={16} />
              {isEditMode ? "Update Subscription" : "Add Subscription"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
