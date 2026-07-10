import React, { useState } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Mail,
  Loader2,
  Type,
  FileText,
  ListOrdered,
  Plus,
  X,
  GripVertical,
  Send,
  Gift,
  User,
  Sparkles,
  CreditCard,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export default function DeliveryEmailDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  loading,
  delivery,
}) {
  const [form, setForm] = useState({
    couponCode: "",
    giftCardExpiryDate: "",
    actualDeliveredValue: "",
    title: "",
    subject: "",
    description: "",
    steps: [""],
  });
  const [showEmailCustomize, setShowEmailCustomize] = useState(false);

  // Reset form when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setForm({
        couponCode: "",
        giftCardExpiryDate: "",
        actualDeliveredValue: delivery?.prize?.value?.toString() || "",
        title: delivery?.prize?.title
          ? `Your ${delivery.prize.title} Gift Card is Here!`
          : "Your Gift Card is Here!",
        subject: delivery?.prize?.title
          ? `🎉 Congratulations! Your ${delivery.prize.title} Prize`
          : "🎉 Congratulations! Your Prize Awaits",
        description: "",
        steps: [""],
      });
      setShowEmailCustomize(false);
    }
  }, [isOpen, delivery]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleStepChange = (index, value) => {
    setForm((prev) => {
      const steps = [...prev.steps];
      steps[index] = value;
      return { ...prev, steps };
    });
  };

  const addStep = () => {
    setForm((prev) => ({ ...prev, steps: [...prev.steps, ""] }));
  };

  const removeStep = (index) => {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  const isValid = form.couponCode.trim() && form.giftCardExpiryDate?.trim();

  const handleSubmit = () => {
    if (!isValid) return;
    // Filter out empty steps
    const cleanSteps = form.steps.filter((s) => s.trim());

    // Build final payload
    const payload = {
      couponCode: form.couponCode.trim(),
      giftCardExpiryDate: form.giftCardExpiryDate?.trim() || "",
    };

    // Only add actualDeliveredValue if provided
    if (form.actualDeliveredValue && !isNaN(form.actualDeliveredValue)) {
      payload.actualDeliveredValue = parseFloat(form.actualDeliveredValue);
    }

    // Only add emailTemplate if any email field is filled
    const hasEmailCustomization =
      form.title.trim() ||
      form.subject.trim() ||
      form.description.trim() ||
      cleanSteps.length > 0;
    if (hasEmailCustomization) {
      payload.emailTemplate = {
        title: form.title.trim(),
        subject: form.subject.trim(),
        description: form.description.trim(),
        steps: cleanSteps,
      };
    }

    onSubmit(payload);
  };

  const winner = delivery?.user;
  const prize = delivery?.prize;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[620px] max-h-[90vh] overflow-y-auto p-0 gap-0 border-none shadow-2xl rounded-2xl [&>button]:!right-2 [&>button]:!top-2">
        {/* ─── Header ─── */}
        <DialogHeader className="pl-7 pr-12 pt-7 pb-0 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-aqua/10 border border-brand-aqua/20 shadow-sm">
                <Mail className="h-6 w-6 text-brand-aqua" />
              </div>
              <div className="flex flex-col gap-0.5">
                <DialogTitle className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Delivery Email Template
                </DialogTitle>
                <p className="text-[12px] text-slate-500 font-medium">
                  Compose the email that will be sent to the winner
                </p>
              </div>
            </div>

            {/* Winner & Prize Summary */}
            {(winner || prize) && (
              <div className="hidden sm:flex flex-col items-end gap-1.5">
                {winner && (
                  <Badge
                    variant="outline"
                    className="bg-white border-slate-200 text-slate-600 text-[10px] font-bold gap-1.5 py-0.5 px-2 rounded-md shadow-sm"
                  >
                    <User className="h-3 w-3 text-brand-aqua" />
                    {winner?.profile?.nickname || winner?.email || "Winner"}
                  </Badge>
                )}
                {prize && (
                  <Badge
                    variant="outline"
                    className="bg-brand-aqua/5 border-brand-aqua/20 text-brand-aqua text-[10px] font-bold gap-1.5 py-0.5 px-2 rounded-md"
                  >
                    <Gift className="h-3 w-3" />
                    {prize?.title || "Gift Card"}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Mobile Badges */}
          {(winner || prize) && (
            <div className="flex sm:hidden flex-wrap gap-2 mt-2">
              {winner && (
                <Badge
                  variant="outline"
                  className="bg-white border-slate-200 text-slate-600 text-[10px] font-bold gap-1.5 py-0.5 px-2 rounded-md"
                >
                  <User className="h-3 w-3 text-brand-aqua" />
                  {winner?.profile?.nickname || "Winner"}
                </Badge>
              )}
              {prize && (
                <Badge
                  variant="outline"
                  className="bg-brand-aqua/5 border-brand-aqua/20 text-brand-aqua text-[10px] font-bold gap-1.5 py-0.5 px-2 rounded-md"
                >
                  <Gift className="h-3 w-3" />
                  {prize?.title}
                </Badge>
              )}
            </div>
          )}
        </DialogHeader>

        {/* ─── Form ─── */}
        <div className="px-7 py-5 space-y-6 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Voucher Code */}
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Voucher / Gift Card Code{" "}
                <span className="text-red-400 font-normal">*</span>
              </Label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={form.couponCode}
                  onChange={(e) => handleChange("couponCode", e.target.value)}
                  placeholder="e.g. AMZN-XXXX-YYYY"
                  className={cn(
                    "h-11 pl-10 rounded-md border-slate-300 focus-visible:ring-brand-aqua/20 focus-visible:border-brand-aqua text-sm font-medium bg-white shadow-sm",
                    !form.couponCode.trim() && "border-rose-200",
                  )}
                />
              </div>
              {!form.couponCode.trim() && (
                <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                  <AlertCircle className="h-2.5 w-2.5" /> Required to deliver
                </p>
              )}
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Expiry Date <span className="text-red-400 font-normal">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="date"
                  value={form.giftCardExpiryDate}
                  onChange={(e) =>
                    handleChange("giftCardExpiryDate", e.target.value)
                  }
                  className={cn(
                    "h-11 pl-10 rounded-md border-slate-300 focus-visible:border-slate-500 text-xs font-bold bg-white shadow-sm",
                    !form.giftCardExpiryDate?.trim() && "border-rose-200",
                  )}
                />
              </div>
            </div>
          </div>

          {/* Actual Delivered Value */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Actual Delivered Value{" "}
              <span className="text-slate-400 normal-case font-medium ml-1">
                (Optional)
              </span>
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="number"
                value={form.actualDeliveredValue}
                onChange={(e) =>
                  handleChange("actualDeliveredValue", e.target.value)
                }
                placeholder={
                  prize?.value ? `Original Value: $${prize.value}` : "e.g. 50"
                }
                className="h-11 pl-10 rounded-md border-slate-300 focus-visible:border-slate-500 text-xs font-bold bg-white shadow-sm"
              />
            </div>
          </div>

          {/* <div className="relative py-2">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-slate-100"></div>
            </div>
          </div> */}

          {/* Collapsible Email Customization */}
          <button
            type="button"
            onClick={() => setShowEmailCustomize(!showEmailCustomize)}
            className={cn(
              "w-full flex items-center justify-between px-5 py-3.5 rounded-lg border transition-all duration-300",
              showEmailCustomize
                ? "bg-brand-aqua/5 border-brand-aqua/50 shadow-sm"
                : "bg-slate-50 border-slate-300",
            )}
          >
            <span className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-slate-600">
              <div
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  showEmailCustomize
                    ? "bg-brand-aqua text-white"
                    : "bg-slate-200 text-slate-500",
                )}
              >
                <Mail className="h-3.5 w-3.5" />
              </div>
              Customize Winning Email
            </span>
            {showEmailCustomize ? (
              <ChevronUp className="h-4 w-4 text-brand-aqua" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </button>

          <AnimatePresence>
            {showEmailCustomize && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6 pt-2 overflow-hidden"
              >
                {/* Email Title & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Email Title
                    </Label>
                    <div className="relative">
                      <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        value={form.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        placeholder="e.g. Your Gift Card is Here!"
                        className="h-10 pl-10 rounded-md border-slate-300 focus-visible:border-slate-500 text-xs font-bold bg-white shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Subject Line
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        value={form.subject}
                        onChange={(e) =>
                          handleChange("subject", e.target.value)
                        }
                        placeholder="e.g. 🎉 Congratulations!"
                        className="h-10 pl-10 rounded-md border-slate-300 focus-visible:border-slate-500 text-xs font-bold bg-white shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Message Description
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Textarea
                      value={form.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      placeholder="We are thrilled to deliver your prize..."
                      rows={3}
                      className="pl-10 rounded-md border-slate-300 focus-visible:border-slate-500 text-xs font-medium resize-none min-h-[80px] bg-white shadow-sm"
                    />
                  </div>
                </div>

                {/* Steps Section */}
                <div className="space-y-3 p-4 rounded-xl border border-slate-300 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Redemption Steps
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addStep}
                      className="h-7 text-[10px] font-bold uppercase border-slate-300 tracking-widest text-brand-aqua hover:bg-brand-aqua/10 gap-1.5 px-2.5 rounded-lg"
                    >
                      <Plus className="h-3 w-3" /> Add Step
                    </Button>
                  </div>

                  <div className="space-y-2.5">
                    {form.steps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2 group">
                        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-brand-aqua/10 text-brand-aqua text-[10px] font-black shrink-0 shadow-sm border border-brand-aqua/10">
                          {idx + 1}
                        </div>
                        <Input
                          value={step}
                          onChange={(e) =>
                            handleStepChange(idx, e.target.value)
                          }
                          placeholder={`Step ${idx + 1} description...`}
                          className="h-10 rounded-md border-slate-200 focus-visible:border-slate-500 text-xs font-semibold flex-1"
                        />
                        {form.steps.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeStep(idx)}
                            className="h-9 w-9 shrink-0 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Preview */}
                <div className="space-y-3 pt-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    Live Email Preview
                  </Label>
                  <div className="rounded-xl border border-slate-300 bg-slate-50/80 shadow-sm overflow-hidden">
                    <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        Preview Mode
                      </span>
                    </div>
                    <div className="p-6 space-y-4">
                      <h4 className="text-base font-extrabold text-slate-900 leading-tight">
                        {form.title || "Winning Notification Title"}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium pb-2 border-b border-slate-50">
                        <span className="text-slate-400">Subject:</span>{" "}
                        {form.subject || "Email Subject"}
                      </p>
                      {form.description && (
                        <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                          {form.description}
                        </p>
                      )}
                      {form.steps.filter((s) => s.trim()).length > 0 && (
                        <div className="space-y-3 pt-2">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            Instruction Manual
                          </p>
                          <div className="space-y-2">
                            {form.steps
                              .filter((s) => s.trim())
                              .map((step, idx) => (
                                <div
                                  key={idx}
                                  className="flex gap-3 items-start"
                                >
                                  <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 border border-slate-200/50">
                                    {idx + 1}
                                  </span>
                                  <span className="text-xs font-semibold text-slate-600">
                                    {step}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Footer ─── */}
        <DialogFooter className="px-7 pb-5 pt-2  flex-row gap-3 items-center sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-none h-11 px-6 rounded-md border-slate-300 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className={cn(
              "flex-1 sm:flex-none h-11 px-8 rounded-md font-bold text-xs uppercase tracking-widest gap-2 shadow-sm transition-all active:scale-95",
              "bg-brand-aqua hover:bg-brand-hoverAqua text-white shadow-brand-aqua/10",
            )}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {loading ? "Processing..." : "Confirm Delivery"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
