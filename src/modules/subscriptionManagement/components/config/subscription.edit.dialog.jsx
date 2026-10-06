import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Save, CreditCard, Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const EMPTY_FORM = {
  title: "",
  subtitle: "",
  price: "",
};

const FIELD_ERRORS = {
  title: "",
  subtitle: "",
  price: "",
  features: "",
};

export function SubscriptionEditDialog({
  open,
  onOpenChange,
  onSubmit,
  editData,
  loading,
}) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [featuresList, setFeaturesList] = useState([]);
  const [featureInput, setFeatureInput] = useState("");
  const [fieldErrors, setFieldErrors] = useState(FIELD_ERRORS);

  useEffect(() => {
    if (open && editData) {
      setFormData({
        title: editData.title || "",
        subtitle: editData.subtitle || "",
        price:
          editData.price !== undefined && editData.price !== null
            ? String(editData.price)
            : "",
      });

      // Parse existing features (comma-separated or string)
      if (editData.features) {
        const parsed = editData.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean)
          .slice(0, 5);
        setFeaturesList(parsed);
      } else {
        setFeaturesList([]);
      }

      setFeatureInput("");
      setFieldErrors(FIELD_ERRORS);
    }
  }, [open, editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddFeature = (e) => {
    e?.preventDefault();
    const trimmed = featureInput.trim();
    if (!trimmed) return;
    if (featuresList.length >= 5) return;

    setFeaturesList((prev) => [...prev, trimmed]);
    setFeatureInput("");
    if (fieldErrors.features) {
      setFieldErrors((prev) => ({ ...prev, features: "" }));
    }
  };

  const handleRemoveFeature = (indexToRemove) => {
    setFeaturesList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleFeatureKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (featureInput.trim() && featuresList.length < 5) {
        handleAddFeature();
      }
    }
  };

  const validate = () => {
    const errors = { ...FIELD_ERRORS };
    let isValid = true;

    if (!formData.title.trim()) {
      errors.title = "Plan title is required.";
      isValid = false;
    }
    if (!formData.subtitle.trim()) {
      errors.subtitle = "Sub title is required.";
      isValid = false;
    }
    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price < 0) {
      errors.price = "Enter a valid price (e.g. 29.99).";
      isValid = false;
    }
    if (featuresList.length === 0) {
      errors.features = "Please add at least one feature (max 5).";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (onSubmit && editData) {
      onSubmit({
        id: editData.id,
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
        price: parseFloat(formData.price),
        features: featuresList.join(", "),
      });
    }
  };

  if (!editData) return null;

  const isAddFeatureDisabled = !featureInput.trim() || featuresList.length >= 5;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-white border-slate-300/60 rounded-xl shadow-2xl">
        <DialogHeader className="px-6 py-5 border-b border-slate-300/60 flex flex-row items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-app-primary2/10 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-app-primary2" />
          </div>
          <div>
            <DialogTitle className="text-base font-bold text-slate-800">
              Edit Subscription Plan
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-0.5">
              Update pricing, subtitle, and features for this plan.
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Plan Title — editable */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Plan Title <span className="text-red-500">*</span>
              </Label>
              <Input
                name="title"
                placeholder="e.g. 1 Month Plan"
                value={formData.title}
                onChange={handleChange}
                className={`h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium border-slate-300/60 ${fieldErrors.title ? "border-red-400 focus-visible:ring-red-400" : ""}`}
              />
              {fieldErrors.title && (
                <p className="text-[11px] text-red-500 font-medium">
                  {fieldErrors.title}
                </p>
              )}
            </div>

            {/* Sub Title — editable */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Sub Title <span className="text-red-500">*</span>
              </Label>
              <Input
                name="subtitle"
                placeholder="e.g. Best for individuals"
                value={formData.subtitle}
                onChange={handleChange}
                className={`h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium border-slate-300/60 ${fieldErrors.subtitle ? "border-red-400 focus-visible:ring-red-400" : ""}`}
              />
              {fieldErrors.subtitle && (
                <p className="text-[11px] text-red-500 font-medium">
                  {fieldErrors.subtitle}
                </p>
              )}
            </div>

            {/* Price — editable */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Price ($) <span className="text-red-500">*</span>
              </Label>
              <Input
                name="price"
                type="number"
                step="0.01"
                placeholder="e.g. 34.99"
                value={formData.price}
                onChange={handleChange}
                className={`h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium border-slate-300/60 ${fieldErrors.price ? "border-red-400 focus-visible:ring-red-400" : ""}`}
              />
              {fieldErrors.price && (
                <p className="text-[11px] text-red-500 font-medium">
                  {fieldErrors.price}
                </p>
              )}
            </div>

            {/* Duration — read only */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Duration (in Months)
              </Label>
              <Input
                value={editData.duration || ""}
                disabled
                className="h-10 text-sm font-medium border-slate-300/60 bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>

            {/* Features (Max 5) */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-slate-800">
                  Features <span className="text-red-500">*</span>
                </Label>
                <span className="text-[11px] font-semibold text-slate-500">
                  {featuresList.length}/5 features added
                </span>
              </div>

              {/* Input + Add button */}
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder={
                    featuresList.length >= 5
                      ? "Maximum 5 features reached"
                      : "Type a feature (e.g. Unlimited Access)..."
                  }
                  value={featureInput}
                  disabled={featuresList.length >= 5}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={handleFeatureKeyDown}
                  className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium border-slate-300/60"
                />
                <Button
                  type="button"
                  onClick={handleAddFeature}
                  disabled={isAddFeatureDisabled}
                  className="h-10 px-4 bg-app-primary2 hover:bg-app-primary3 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 shrink-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Feature</span>
                </Button>
              </div>

              {/* Added Features list/tags */}
              {featuresList.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {featuresList.map((feat, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium rounded-full animate-in fade-in duration-200"
                    >
                      <span className="max-w-[280px] truncate">{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="w-4 h-4 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {fieldErrors.features && (
                <p className="text-[11px] text-red-500 font-medium">
                  {fieldErrors.features}
                </p>
              )}
            </div>
          </div>

          <p className="mt-4 text-[11px] text-slate-400 font-medium">
            Duration is fixed. Plan title, sub title, price, and features can be updated.
          </p>

          <div className="mt-8 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-md px-6 py-2 h-auto text-xs font-semibold border-slate-300/60"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-app-primary2 hover:bg-app-primary3 text-white rounded-md px-6 py-2 h-auto text-xs font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95"
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
