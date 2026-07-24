import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  Pencil,
  Loader2,
  Tag,
  DollarSign,
  Info,
  Save,
  LayoutGrid,
  Image as ImageIcon,
  Star,
  ListOrdered,
} from "lucide-react";
import { IconBrandAndroid, IconBrandApple } from "@tabler/icons-react";
import { IoLogoApple, IoLogoGoogle } from "react-icons/io5";
import { cn } from "@/lib/utils";

export const ProductDialog = ({
  isOpen,
  onOpenChange,
  isEditMode,
  editTargetKey,
  formData,
  updateField,
  addFeature,
  updateFeature,
  removeFeature,
  handleSubmit,
  actionLoading,
  CATEGORY_MAP,
}) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto gap-0 p-0 border-none shadow-2xl rounded-2xl font-sans">
        {/* ── Header ── */}
        <DialogHeader className="px-7 pt-7 pb-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-app-primary2 border border-app-primary2">
              <Package className="h-6 w-6 text-app-primary2" />
            </div>
            <div className="flex flex-col gap-0.5">
              <DialogTitle className="text-lg font-extrabold text-slate-900 tracking-tight">
                {isEditMode ? "Update Product Details" : "Create New Product"}
              </DialogTitle>
              <p className="text-[12px] text-slate-500 font-medium">
                {isEditMode
                  ? `Updating · ${editTargetKey}`
                  : "Add a product to the catalog"}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* ── Price Notice Banner ── */}
        <div className="bg-amber-50/50 border border-amber-200 mx-5 rounded-lg px-6 py-3 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700 font-semibold leading-snug">
            <span className="font-black">Note:</span> The admin cannot change
            actual prices. The reference price below is for display only. Real
            prices are fetched from App Store Connect & Google Play Console at
            runtime.
          </p>
        </div>

        {/* ── Form Body ── */}
        <div className="px-7 py-5 space-y-4 bg-white">
          {/* Type + Category */}
          <div
            className={cn(
              "grid gap-4",
              formData.type === "SUBSCRIPTION" && !isEditMode
                ? "grid-cols-1"
                : "grid-cols-2",
            )}
          >
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Product Type</span>
                {isEditMode && (
                  <span className="text-[9px] text-amber-500 normal-case tracking-normal">
                    cannot be changed
                  </span>
                )}
              </Label>
              {isEditMode ? (
                <div className="relative">
                  <LayoutGrid className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    value={
                      formData.type === "SUBSCRIPTION"
                        ? "Subscription"
                        : "Consumable"
                    }
                    disabled
                    className="h-12 pl-10 pr-9 text-sm font-medium rounded-md border-slate-300/60 bg-slate-50 text-slate-600 shadow-none cursor-not-allowed"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 h-12">
                  {["SUBSCRIPTION", "CONSUMABLE"].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        updateField("type", t);
                        updateField(
                          "category",
                          t === "SUBSCRIPTION" ? "PREMIUM_PLAN" : "SUPER_KEEN",
                        );
                      }}
                      className={cn(
                        "rounded-md font-bold text-[11px] uppercase tracking-wider border-2 transition-all",
                        formData.type === t
                          ? "border-app-primary2 bg-app-primary2 text-app-primary2"
                          : "border-slate-300/60 bg-slate-50 text-slate-400 hover:border-slate-300/60",
                      )}
                    >
                      {t === "SUBSCRIPTION" ? "Subscription" : "Consumable"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category: show dropdown only for Consumable; for Subscription it's always Premium Plan */}
            {(isEditMode || formData.type === "CONSUMABLE") && (
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span>Category</span>
                  {isEditMode && (
                    <span className="text-[9px] text-amber-500 normal-case tracking-normal">
                      cannot be changed
                    </span>
                  )}
                </Label>
                {isEditMode ? (
                  <div className="relative">
                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      value={
                        CATEGORY_MAP[formData.category]?.label ||
                        formData.category
                      }
                      disabled
                      className="h-12 pl-10 pr-9 text-sm font-medium rounded-md border-slate-300/60 bg-slate-50 text-slate-600 shadow-none cursor-not-allowed"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <Select
                      value={formData.category}
                      onValueChange={(v) => updateField("category", v)}
                    >
                      <SelectTrigger className="h-12 pl-3.5 rounded-md border-slate-300/60 shadow-none focus:outline-none focus:border-slate-500 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0 text-sm font-medium bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl shadow-lg border-slate-100">
                        <SelectItem
                          value="SUPER_KEEN"
                          className="font-semibold text-sm"
                        >
                          Super Keen
                        </SelectItem>
                        <SelectItem
                          value="SUPERCHARGE"
                          className="font-semibold text-sm"
                        >
                          Supercharge
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Product Key + Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>
                  Product Key (SKU) <span className="text-red-400">*</span>
                </span>
                {isEditMode && (
                  <span className="text-[9px] text-amber-500 normal-case tracking-normal">
                    read-only
                  </span>
                )}
              </Label>
              <div className="relative">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={formData.productKey}
                  onChange={(e) =>
                    updateField(
                      "productKey",
                      e.target.value.toLowerCase().replace(/\s/g, "_"),
                    )
                  }
                  readOnly={isEditMode}
                  placeholder="e.g. premium_monthly"
                  className={cn(
                    "h-12 pl-10 text-sm font-medium rounded-md shadow-none focus-visible:border-slate-500",
                    isEditMode
                      ? "border-slate-300/60 bg-slate-50 text-slate-600 cursor-not-allowed"
                      : "border-slate-300/60 bg-white",
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>
                  Product Name <span className="text-red-400">*</span>
                </span>
              </Label>
              <div className="relative">
                <Pencil className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={formData.displayName}
                  onChange={(e) => updateField("displayName", e.target.value)}
                  placeholder="e.g. Gold Monthly Plan"
                  className="h-12 pl-10 text-sm font-medium rounded-md border-slate-300/60 shadow-none focus-visible:border-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Apple + Google IDs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <IoLogoApple size={14} className="text-slate-500" /> Apple
                  Product ID <span className="text-red-400">*</span>
                </span>
                {isEditMode && !!formData.appleProductId && (
                  <span className="text-[9px] text-amber-500 normal-case tracking-normal">
                    read-only
                  </span>
                )}
              </Label>
              <div className="relative">
                <Input
                  value={formData.appleProductId}
                  onChange={(e) =>
                    updateField("appleProductId", e.target.value)
                  }
                  readOnly={isEditMode && !!formData.appleProductId}
                  placeholder="com.app.product.id"
                  className={cn(
                    "h-12 px-3.5 text-sm font-medium rounded-md shadow-none focus-visible:border-slate-500 font-mono",
                    isEditMode && !!formData.appleProductId
                      ? "border-slate-300/60 bg-slate-50 text-slate-600 cursor-not-allowed"
                      : "border-slate-300/60 bg-white",
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <IoLogoGoogle size={14} className="text-slate-500" /> Google
                  Product ID <span className="text-red-400">*</span>
                </span>
                {isEditMode && !!formData.googleProductId && (
                  <span className="text-[9px] text-amber-500 normal-case tracking-normal">
                    read-only
                  </span>
                )}
              </Label>
              <div className="relative">
                <Input
                  value={formData.googleProductId}
                  onChange={(e) =>
                    updateField("googleProductId", e.target.value)
                  }
                  readOnly={isEditMode && !!formData.googleProductId}
                  placeholder="product_id_here"
                  className={cn(
                    "h-12 px-3.5 text-sm font-medium rounded-md shadow-none focus-visible:border-slate-500 font-mono",
                    isEditMode && !!formData.googleProductId
                      ? "border-slate-300/60 bg-slate-50 text-slate-600 cursor-not-allowed"
                      : "border-slate-300/60 bg-white",
                  )}
                />
              </div>
            </div>
          </div>

          {/* Ref Price + Currency */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Reference Price <span className="text-red-400">*</span>
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="19.99"
                  value={formData.displayPrice}
                  onChange={(e) => {
                    let valStr = e.target.value;
                    if (valStr.startsWith("-")) valStr = valStr.substring(1);
                    updateField("displayPrice", valStr);
                  }}
                  className="h-12 pl-10 text-sm font-medium rounded-md border-slate-300/60 shadow-none focus-visible:border-slate-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Currency
              </Label>
              <div className="relative">
                <Input
                  value={formData.currency || "AUD"}
                  readOnly
                  className="h-12 px-3.5 text-sm font-bold rounded-md border-slate-300/60 bg-slate-50 text-slate-600 cursor-not-allowed shadow-none"
                />
              </div>
            </div>
          </div>

          {/* Consumable Bundle Quantity */}
          {formData.type === "CONSUMABLE" && (
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Bundle Quantity
              </Label>
              <div className="relative">
                <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="number"
                  placeholder="10"
                  value={formData.quantity}
                  onChange={(e) =>
                    updateField("quantity", Number(e.target.value))
                  }
                  className="max-w-[200px] h-12 pl-10 text-sm font-medium rounded-md border-slate-300/60 shadow-none focus-visible:border-slate-500"
                />
              </div>
            </div>
          )}

          {/* Badge & Subtitle row */}
          <div className="grid grid-cols-1 gap-4">
            {/* <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Display Badge Text
              </Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.badgeColor || "#00BCD4"}
                  onChange={(e) => updateField("badgeColor", e.target.value)}
                  className="w-12 h-12 rounded-md border border-slate-300/60 cursor-pointer p-0.5 bg-white shrink-0"
                />
                <div className="relative flex-1">
                  <Input
                    placeholder="e.g. MOST POPULAR"
                    value={formData.badgeText || ""}
                    onChange={(e) => updateField("badgeText", e.target.value)}
                    className="h-12 px-3.5 text-sm font-medium rounded-md border-slate-300/60 shadow-none focus-visible:ring-app-primary2 focus-visible:border-app-primary2 w-full pr-24"
                  />
                  {formData.badgeText && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <span
                        className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm text-white inline-block max-w-[80px] truncate"
                        style={{
                          backgroundColor: formData.badgeColor || "#00BCD4",
                        }}
                      >
                        {formData.badgeText}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div> */}
            {/* i icon hover tooltip code snippet */}
            {/* <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                Subtitle
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-pointer">
                        <Info className="w-3.5 h-3.5 text-slate-400 hover:text-app-primary2 transition-colors" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[350px] text-center">
                      <p className="text-xs">This subtitle is shown under the product name in the app.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="relative w-full">
                <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="e.g. Best Value"
                  value={formData.subtitle || ""}
                  onChange={(e) => updateField("subtitle", e.target.value)}
                  className="h-12 pl-10 text-sm font-medium rounded-md border-slate-300/60 shadow-none focus-visible:border-slate-500"
                />
              </div>
            </div> */}
            <div className="space-y-2">
              <div>
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  Subtitle
                </Label>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  Shown under the product name in the app
                </p>
              </div>
              <div className="relative w-full">
                <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="e.g. Best Value"
                  value={formData.subtitle || ""}
                  onChange={(e) => updateField("subtitle", e.target.value)}
                  className="h-12 pl-10 text-sm font-medium rounded-md border-slate-300/60 shadow-none focus-visible:border-slate-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            {/* i icon hover tooltip code snippet */}
            {/* <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                Badge
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-pointer">
                        <Info className="w-3.5 h-3.5 text-slate-400 hover:text-app-primary2 transition-colors" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[350px] text-center">
                      <p className="text-xs">This badge text is shown over the product card in the app.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="relative">
                <Star className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="e.g. 🔥 HOT"
                  value={formData.badge || ""}
                  onChange={(e) => updateField("badge", e.target.value)}
                  className="h-12 pl-10 text-sm font-medium rounded-md border-slate-300/60 shadow-none focus-visible:border-slate-500"
                />
              </div>
            </div> */}
            <div className="space-y-2">
              <div>
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  Badge
                </Label>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  Shown over the product card in the app
                </p>
              </div>
              <div className="relative">
                <Star className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="e.g. 🔥 HOT"
                  value={formData.badge || ""}
                  onChange={(e) => updateField("badge", e.target.value)}
                  className="h-12 pl-10 text-sm font-medium rounded-md border-slate-300/60 shadow-none focus-visible:border-slate-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Sort Order
              </Label>
              <div className="relative">
                <ListOrdered className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="number"
                  min="0"
                  value={formData.sortOrder}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    updateField("sortOrder", val < 0 ? 0 : val);
                  }}
                  className="h-12 pl-10 text-sm font-medium rounded-md border-slate-300/60 shadow-none focus-visible:border-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Features (Subscription only) */}
          {/* {formData.type === "SUBSCRIPTION" && (
            <div className="space-y-2 border-t border-slate-100 pt-4 mt-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex justify-between items-center">
                <span>Features List</span>
                <span className="text-[10px] normal-case text-slate-400 font-medium">
                  {formData.features?.length || 0} features added
                </span>
              </Label>
              <div className="space-y-2">
                {(formData.features || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      placeholder={`Feature ${i + 1}`}
                      value={f}
                      onChange={(e) => updateFeature(i, e.target.value)}
                      className="flex-1 h-10 text-sm font-medium rounded-md border-slate-300/60 shadow-none focus-visible:ring-app-primary2 focus-visible:border-app-primary2"
                    />
                    <button
                      onClick={() => removeFeature(i)}
                      className="w-10 h-10 rounded-md bg-red-50 text-red-400 hover:bg-red-100 transition-colors flex items-center justify-center shrink-0 border border-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addFeature}
                  className="flex items-center justify-center w-full h-10 gap-1.5 text-xs font-bold text-app-primary2 bg-app-primary2 hover:bg-app-primary3 rounded-md transition-colors border border-app-primary2"
                >
                  <Plus className="w-4 h-4" /> Add Feature
                </button>
              </div>
            </div>
          )} */}

          {/* Status */}
          <div className="border-t border-slate-100 pt-4 mt-2 flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Product Status
              </Label>
              <p className="text-[10px] text-slate-400 font-medium">
                Activate or deactivate this product
              </p>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 px-4 h-12 rounded-md border border-slate-300/60">
              <span
                className={cn(
                  "text-sm font-black",
                  formData.isActive ? "text-emerald-600" : "text-slate-400",
                )}
              >
                {formData.isActive ? "Active" : "Inactive"}
              </span>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(v) => updateField("isActive", v)}
              />
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <DialogFooter className="flex items-center sm:justify-end px-7 py-5 bg-slate-50/80 border-t border-slate-100 gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="font-semibold text-[13px] text-slate-600 border-slate-300/60 h-10 px-6 rounded-md hover:bg-slate-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={actionLoading}
            className="bg-app-primary2 hover:bg-brand-hoverAqua text-white text-[13px] font-bold h-10 px-6 rounded-md shadow-sm gap-2"
          >
            {actionLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEditMode ? "Save Changes" : "Create Product"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
