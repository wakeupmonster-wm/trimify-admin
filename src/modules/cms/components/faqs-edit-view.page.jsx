import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createFAQ, updateFAQ } from "../store/faq.slice";
import { Label } from "@/components/ui/label";
import { HelpCircle, Layers, Pencil, Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQDialog = ({ isOpen, onClose, initialData }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "general",
  });
  const [errors, setErrors] = useState({});

  // Sync form state when initialData changes (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData({
        question: initialData.question || "",
        answer: initialData.answer || "",
        category: initialData.category || "general",
      });
      setErrors({});
    } else {
      setFormData({ question: "", answer: "", category: "general" });
      setErrors({});
    }
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.question?.trim()) newErrors.question = "Question is required";
    if (!formData.answer?.trim()) newErrors.answer = "Answer is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (initialData?._id || initialData?.id) {
        const id = initialData._id || initialData.id;
        await dispatch(updateFAQ({ id, payload: formData })).unwrap();
        toast.success("FAQ Updated successfully!");
      } else {
        await dispatch(createFAQ(formData)).unwrap();
        toast.success("FAQ Created successfully!");
      }
      onClose();
    } catch (error) {
      toast.error(error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-[560px] max-h-[90vh] overflow-y-auto gap-0 p-0 border-none shadow-2xl rounded-2xl">
        {/* ── Header ── */}
        <DialogHeader className="px-7 pt-7 pb-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-aqua/10 border border-brand-aqua/20">
              <HelpCircle className="h-6 w-6 text-brand-aqua" />
            </div>
            <div className="flex flex-col gap-0.5">
              <DialogTitle className="text-lg font-extrabold text-slate-900 tracking-tight">
                {initialData ? "Update FAQ" : "Create FAQ"}
              </DialogTitle>
              <p className="text-[12px] text-slate-500 font-medium">
                {initialData
                  ? "Modify the details of your active FAQ item"
                  : "Add a new question and answer pair to help users"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-7 py-5 space-y-5 bg-white">
          {/* Category */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Category <span className="text-red-400 font-normal">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(v) => setFormData({ ...formData, category: v })}
            >
              <SelectTrigger className="h-10 rounded-md border-slate-200 bg-white text-left font-semibold text-xs shadow-sm focus:outline-none focus:border-slate-500 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0 transition-all capitalize">
                <div className="flex items-center gap-3">
                  <Layers className="h-4 w-4 text-slate-400 shrink-0" />
                  <SelectValue placeholder="Select Category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {[
                  "general",
                  "account",
                  "dating",
                  "subscriptions",
                  "troubleshooting",
                  "billing",
                  "technical",
                  "security_privacy",
                  "safety_reporting",
                  "other",
                ].map((cat) => (
                  <SelectItem
                    key={cat}
                    value={cat}
                    className="py-2 capitalize text-xs"
                  >
                    {cat
                      .replace(/_/g, " ")
                      .split(" ")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Question */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Question <span className="text-red-400 font-normal">*</span>
            </Label>
            <div className="relative">
              <Pencil className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={formData.question}
                onChange={(e) => {
                  setFormData({ ...formData, question: e.target.value });
                  if (errors.question) setErrors({ ...errors, question: null });
                }}
                placeholder="e.g. How do I reset my password?"
                className={cn(
                  "h-10 pl-10 text-xs font-semibold rounded-md border-slate-200 bg-white shadow-sm focus-visible:border-slate-500 transition-all placeholder:font-medium placeholder:text-slate-400",
                  errors.question &&
                  "border-red-400 focus-visible:border-red-400",
                )}
              />
            </div>
            {errors.question && (
              <p className="text-[10px] font-semibold text-red-500 mt-1">
                {errors.question}
              </p>
            )}
          </div>

          {/* Answer */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Answer <span className="text-red-400 font-normal">*</span>
            </Label>
            <Textarea
              value={formData.answer}
              onChange={(e) => {
                setFormData({ ...formData, answer: e.target.value });
                if (errors.answer) setErrors({ ...errors, answer: null });
              }}
              placeholder="Write a clear, helpful answer…"
              className={cn(
                "bg-white border border-slate-200 text-xs font-semibold rounded-md shadow-sm focus-visible:border-slate-500 transition-all min-h-[120px] placeholder:font-medium placeholder:text-slate-400",
                errors.answer && "border-red-400 focus-visible:border-red-400",
              )}
            />
            {errors.answer && (
              <p className="text-[10px] font-semibold text-red-500 mt-1">
                {errors.answer}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex items-center sm:justify-end px-7 py-5 bg-slate-50/80 border-t border-slate-100 gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="font-semibold text-[13px] text-slate-600 border-slate-300 h-10 px-6 rounded-md hover:bg-slate-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-brand-aqua hover:bg-brand-hoverAqua text-white text-[13px] font-bold h-10 px-6 rounded-md shadow-sm gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {initialData ? "Save Changes" : "Create FAQ"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FAQDialog;
