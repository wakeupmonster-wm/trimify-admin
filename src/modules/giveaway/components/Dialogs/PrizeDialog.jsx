import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Loader2,
  X,
  Pencil,
  DollarSign,
  User,
  Gift,
  ChevronDown,
  Save,
} from "lucide-react";
import { TbLayoutGrid } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { apiConnector } from "@/services/axios/axios.connector";
import { SUBSCRIPTION_ENDPOINTS } from "@/services/api-endpoints/subscriptions.endpoints";
import { AnimatePresence, motion } from "framer-motion";

const MAX_DESC = 200;
const MAX_TAGS = 5;

export const PrizeDialog = ({
  isOpen,
  onOpenChange,
  form,
  setForm,
  onSubmit,
  loading,
  isEditing,
}) => {
  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const [initialForm, setInitialForm] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setErrors({});
      setInitialForm(null);
    } else {
      setInitialForm(JSON.stringify(form));
      const fetchProducts = async () => {
        try {
          if (products.length > 0) return;
          setFetchingProducts(true);
          const res = await apiConnector(
            "GET",
            SUBSCRIPTION_ENDPOINTS.LIST_PRODUCTS,
          );
          let fetchedProducts = [];

          if (res && res.data) {
            fetchedProducts = res.data;
          } else if (Array.isArray(res)) {
            fetchedProducts = res;
          } else if (res && res.products) {
            fetchedProducts = res.products;
          }

          if (fetchedProducts?.length > 0) {
            setProducts(
              fetchedProducts.filter((p) => p.type === "SUBSCRIPTION"),
            );
          }
        } catch (e) {
          console.error("Failed to fetch products:", e);
        } finally {
          setFetchingProducts(false);
        }
      };
      fetchProducts();
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!form.title?.trim()) newErrors.title = "Prize title is required";
    if (!form.type) newErrors.type = "Please select a prize type";
    if (!form.value || isNaN(form.value)) {
      newErrors.value = "Valid value is required";
    } else if (Number(form.value) <= 0) {
      newErrors.value = "Value must be greater than 0";
    }
    if (!form.spinWheelLabel?.trim()) {
      newErrors.spinWheelLabel = "Spin wheel label is required";
    }
    if (!form.description?.trim()) {
      newErrors.description = "Description is required";
    }
    if (!form.supportiveItems || form.supportiveItems.length < 5) {
      newErrors.supportiveItems = "Exactly 5 supportive items are required";
    } else if (form.supportiveItems.length > MAX_TAGS) {
      newErrors.supportiveItems = `Maximum ${MAX_TAGS} supportive items allowed`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasChanges = isEditing && initialForm ? initialForm !== JSON.stringify(form) : true;

  const isInvalid =
    !form.title?.trim() ||
    !form.value ||
    !form.spinWheelLabel?.trim() ||
    !form.description?.trim() ||
    !form.supportiveItems ||
    form.supportiveItems.length < 5 ||
    form.supportiveItems.length > MAX_TAGS ||
    (isEditing && !hasChanges);

  const handleAction = () => {
    if (validate()) onSubmit();
  };

  const ErrorMsg = ({ msg }) => (
    <p className="text-[10px] font-medium text-red-500 flex items-center gap-1 mt-1">
      <AlertCircle className="h-3 w-3" /> {msg}
    </p>
  );

  const descLen = (form.description || "").length;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto gap-0 p-0 border-none shadow-2xl rounded-2xl">
        {/* ── Header ── */}
        <DialogHeader className="px-7 pt-7 pb-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-aqua/10 border border-brand-aqua/20">
              <Gift className="h-6 w-6 text-brand-aqua" />
            </div>
            <div className="flex flex-col gap-0.5">
              <DialogTitle className="text-lg font-extrabold text-slate-900 tracking-tight">
                {isEditing ? "Update Prize Details" : "Create New Prize"}
              </DialogTitle>
              <p className="text-[12px] text-slate-500 font-medium">
                {isEditing
                  ? "Edit and update the prize information"
                  : "Define a new prize for your campaigns"}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* ── Form Body ── */}
        <div className="px-7 py-3 space-y-2 bg-white">
          {/* Prize Title */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Prize Title <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <Pencil className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Summer Pre Pool"
                className={cn(
                  "h-12 pl-10 text-sm font-medium rounded-md border-slate-300 shadow-none focus-visible:border-slate-500",
                  errors.title && "border-red-400 focus-visible:ring-red-200",
                )}
              />
            </div>
            {errors.title && <ErrorMsg msg={errors.title} />}
          </div>

          {/* Type + Value row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Type <span className="text-red-400">*</span>
              </Label>
              <div className="relative">
                <TbLayoutGrid className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value="Gift Card"
                  readOnly
                  className="h-12 pl-10 text-sm font-medium rounded-md border-slate-300 bg-slate-50/50 text-slate-500 cursor-default shadow-none focus-visible:ring-0 focus-visible:border-slate-300"
                />
              </div>
              {errors.type && <ErrorMsg msg={errors.type} />}
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Value <span className="text-red-400">*</span>
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  placeholder="10"
                  className={cn(
                    "h-12 pl-10 text-sm font-medium rounded-md border-slate-300 shadow-none focus-visible:border-slate-500",
                    errors.value && "border-red-400 focus-visible:ring-red-200",
                  )}
                />
              </div>
              {errors.value && <ErrorMsg msg={errors.value} />}
            </div>
          </div>

          {/* Winner Label */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Winner Label <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={form.spinWheelLabel}
                placeholder="e.g. Lucky Draw"
                onChange={(e) =>
                  setForm({ ...form, spinWheelLabel: e.target.value })
                }
                className={cn(
                  "h-12 pl-10 text-sm font-medium rounded-md border-slate-300 shadow-none focus-visible:border-slate-500",
                  errors.spinWheelLabel &&
                  "border-red-400 focus-visible:ring-red-200",
                )}
              />
            </div>
            {errors.spinWheelLabel && <ErrorMsg msg={errors.spinWheelLabel} />}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Description <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <textarea
                value={form.description || ""}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_DESC) {
                    setForm({ ...form, description: e.target.value });
                  }
                }}
                placeholder="Short info about the prize"
                rows={3}
                className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-medium shadow-none focus:outline-none focus:border-slate-500 resize-none"
              />
              <span className="absolute bottom-2.5 right-3 text-[10px] font-semibold text-slate-400">
                {descLen}/{MAX_DESC}
              </span>
            </div>
            {errors.description && <ErrorMsg msg={errors.description} />}
          </div>

          {/* Supportive Items */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex justify-between items-center">
              Supportive Items
              <span
                className={cn(
                  "normal-case font-medium text-[10px]",
                  form.supportiveItems?.length < 5
                    ? "text-red-500"
                    : form.supportiveItems?.length === MAX_TAGS
                      ? "text-amber-500"
                      : "text-slate-400",
                )}
              >
                {form.supportiveItems?.length || 0}/{MAX_TAGS} items added (exactly 5 required)
              </span>
            </Label>

            <div
              className={cn(
                "min-h-[48px] px-3 py-2.5 rounded-md border bg-white flex flex-wrap items-center gap-2 transition-all focus-within:border-slate-500",
                errors.supportiveItems ? "border-red-400" : "border-slate-300",
              )}
            >
              <AnimatePresence>
                {form.supportiveItems?.map((item, index) => (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-aqua/10 text-brand-aqua text-xs font-bold border border-brand-aqua/20"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = form.supportiveItems.filter(
                          (_, i) => i !== index,
                        );
                        setForm({ ...form, supportiveItems: newItems });
                      }}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>

              <input
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium min-w-[100px] h-7 placeholder:text-slate-400 disabled:cursor-not-allowed"
                disabled={form.supportiveItems?.length >= MAX_TAGS}
                placeholder={
                  form.supportiveItems?.length >= MAX_TAGS
                    ? `Max ${MAX_TAGS} items reached`
                    : form.supportiveItems?.length >= 2
                      ? "Add more..."
                      : "Type and press Enter..."
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = e.target.value.trim();
                    if (form.supportiveItems?.length >= MAX_TAGS) return;
                    if (val && !form.supportiveItems.includes(val)) {
                      setForm({
                        ...form,
                        supportiveItems: [...form.supportiveItems, val],
                      });
                      e.target.value = "";
                    }
                  }
                }}
              />
            </div>
            {errors.supportiveItems && (
              <ErrorMsg msg={errors.supportiveItems} />
            )}
            <p className="text-[10px] text-slate-400 font-medium">
              Create tags by typing and pressing <strong>Enter</strong>.
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <DialogFooter className="flex items-center sm:justify-end px-7 py-5 bg-slate-50/80 border-t border-slate-100 gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="font-semibold text-[13px] text-slate-600 border-slate-300 h-10 px-6 rounded-md hover:bg-slate-100 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAction}
            disabled={loading || isInvalid}
            className="bg-brand-aqua hover:bg-brand-hoverAqua text-white text-[13px] font-bold h-10 px-6 rounded-md shadow-sm gap-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEditing ? "Save Changes" : "Create Prize"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
