import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  CalendarDays,
  Trophy,
  Gift,
  Loader2,
  AlertCircle,
  Layers,
  Info,
  Pencil,
  RefreshCcw,
  ChevronDown,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, startOfWeek, endOfWeek, setDay } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import BulkForm from "../BulkForm";

function getWeekRange(date) {
  const monday = startOfWeek(date, { weekStartsOn: 1 });
  const sunday = endOfWeek(date, { weekStartsOn: 1 });
  return { from: monday, to: sunday };
}

const CampaignDialog = ({
  isOpen,
  onOpenChange,
  isEditing,
  form,
  setForm,
  prizes = [],
  campaigns = [],
  loading,
  onSubmit,
  onBulkSubmit,
  bulkLoading,
}) => {
  const [errors, setErrors] = useState({});
  const [mode, setMode] = useState("single");
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setErrors({});
      setMode("single");
    }
  }, [isOpen]);

  useEffect(() => {
    if (isEditing) setMode("single");
  }, [isEditing]);

  const prizesList = Array.isArray(prizes) ? prizes : [];

  const weekRange = useMemo(() => {
    if (!form.date) return undefined;
    const d = new Date(form.date + "T12:00:00");
    const friday = setDay(d, 5, { weekStartsOn: 1 });
    if (friday < d) return { from: friday, to: d };
    return { from: d, to: friday };
  }, [form.date]);

  const disabledWeekDates = useMemo(() => {
    // When editing, exclude the current campaign's own week so the user can
    // still select dates within that same week (or any past week).
    const currentWeek = isEditing && form.date ? getWeekRange(new Date(form.date + "T12:00:00")) : null;

    const existingWeeks = (campaigns || [])
      .map((c) => {
        const dateValue = c.date;
        if (!dateValue) return null;
        const d = new Date(
          dateValue + (String(dateValue).includes("T") ? "" : "T12:00:00")
        );
        return getWeekRange(d);
      })
      .filter((week) => {
        if (!week) return false;
        if (!currentWeek) return true;
        return !(week.from.getTime() === currentWeek.from.getTime() && week.to.getTime() === currentWeek.to.getTime());
      });

    return (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) return true;
      if (!existingWeeks.length) return false;
      const time = date.getTime();
      return existingWeeks.some((week) => time >= week.from.getTime() && time <= week.to.getTime());
    };
  }, [campaigns, isEditing, form.date]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.title?.trim()) newErrors.title = "Campaign title is required";
    if (!form.date) {
      newErrors.date = "Campaign date is required";
    } else {
      const selectedDate = new Date(form.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (!isEditing && selectedDate < today)
        newErrors.date = "Date cannot be in the past";
    }
    if (!form.prizeId) newErrors.prizeId = "Please select a prize";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOnSubmit = () => {
    if (validateForm()) onSubmit();
  };

  const ErrorMsg = ({ msg }) => (
    <p className="text-[10px] font-medium text-red-500 flex items-center gap-1 mt-1">
      <AlertCircle className="h-3 w-3" /> {msg}
    </p>
  );

  // Compute selected Friday label for info text
  const fridayLabel = useMemo(() => {
    if (!form.date || !weekRange) return "Friday";
    return format(weekRange.to, "EEEE");
  }, [form.date, weekRange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[560px] max-h-[90vh] overflow-y-auto gap-0 p-0 border-none shadow-2xl rounded-2xl">
        {/* ── Header ── */}
        <DialogHeader className="px-7 pt-7 pb-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-aqua/10 border border-brand-aqua/20">
              <Trophy className="h-6 w-6 text-brand-aqua" />
            </div>
            <div className="flex flex-col gap-0.5">
              <DialogTitle className="text-lg font-extrabold text-slate-900 tracking-tight">
                {isEditing ? "Update Campaign" : "Create Campaign"}
              </DialogTitle>
              <p className="text-[12px] text-slate-500 font-medium">
                {isEditing
                  ? "Modify the details of your campaign"
                  : "Set up a new giveaway draw"}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* ── Mode Selector (only on create) ── */}
        {!isEditing && (
          <div className="px-7 pt-2 pb-0 bg-white">
            <div className="grid grid-cols-2 gap-3">
              {/* Single */}
              <button
                onClick={() => setMode("single")}
                className={cn(
                  "flex items-center gap-3 px-4 py-4 rounded-lg border-2 transition-all duration-200 text-left",
                  mode === "single"
                    ? "border-brand-aqua bg-brand-aqua/5"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300",
                )}
              >
                <CalendarDays
                  className={cn(
                    "h-6 w-6 shrink-0",
                    mode === "single" ? "text-brand-aqua" : "text-slate-400",
                  )}
                />
                <div className="flex flex-col gap-0.5">
                  <span
                    className={cn(
                      "text-sm font-bold",
                      mode === "single" ? "text-brand-aqua" : "text-slate-700",
                    )}
                  >
                    Single
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Create one campaign
                  </span>
                </div>
              </button>

              {/* Bulk Create */}
              <button
                onClick={() => setMode("bulk")}
                className={cn(
                  "flex items-center gap-3 px-4 py-4 rounded-lg border-2 transition-all duration-200 text-left",
                  mode === "bulk"
                    ? "border-brand-aqua bg-brand-aqua/5"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300",
                )}
              >
                <Layers
                  className={cn(
                    "h-6 w-6 shrink-0",
                    mode === "bulk" ? "text-brand-aqua" : "text-slate-400",
                  )}
                />
                <div className="flex flex-col gap-0.5">
                  <span
                    className={cn(
                      "text-sm font-bold",
                      mode === "bulk" ? "text-brand-aqua" : "text-slate-700",
                    )}
                  >
                    Bulk Create
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Create multiple campaigns
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ── SINGLE MODE ── */}
        {mode === "single" && (
          <>
            <div className="px-7 py-5 space-y-5 bg-white">
              {/* Campaign Title */}
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Campaign Title{" "}
                  <span className="text-red-400 font-normal">*</span>
                </Label>
                <div className="relative">
                  <Pencil className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="e.g. Weekly Mega Draw"
                    className={cn(
                      "h-10 pl-10 text-xs font-semibold rounded-md border-slate-200 bg-white shadow-sm focus-visible:border-slate-500 transition-all",
                      errors.title &&
                      "border-red-400 focus-visible:border-red-400",
                    )}
                  />
                </div>
                {errors.title && <ErrorMsg msg={errors.title} />}
              </div>

              {/* Campaign Date */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Campaign Date{" "}
                    <span className="text-red-400 font-normal">*</span>
                  </Label>
                  {form.date && (
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, date: "" }))}
                      className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-brand-aqua transition-colors px-2 py-1 rounded-lg hover:bg-brand-aqua/5"
                    >
                      <RefreshCcw className="h-2.5 w-2.5" />
                      Reset
                    </button>
                  )}
                </div>

                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-10 justify-start text-left font-semibold border-slate-200 rounded-md bg-white text-xs shadow-sm focus-visible:border-slate-500 transition-all",
                        !form.date && "text-slate-400",
                        errors.date && "border-red-400",
                      )}
                    >
                      <CalendarDays className="mr-3 h-4 w-4 text-slate-400 shrink-0" />
                      <span className="flex-1 truncate">
                        {form.date
                          ? format(new Date(form.date + "T12:00:00"), "PPP")
                          : "Select any day of the week"}
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4 text-slate-400 shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 z-[100] rounded-xl shadow-2xl border-slate-200 overflow-hidden max-w-[95vw]"
                    align="center"
                    side="bottom"
                    avoidCollisions={false}
                  >
                    <Calendar
                      mode="range"
                      selected={weekRange}
                      showOutsideDays={false}
                      numberOfMonths={1}
                      onSelect={() => { }}
                      onDayClick={(date) => {
                        const tzOffset = date.getTimezoneOffset() * 60000;
                        const localISO = new Date(date.getTime() - tzOffset)
                          .toISOString()
                          .slice(0, 10);
                        setForm({ ...form, date: localISO });
                        if (errors.date) setErrors({ ...errors, date: null });
                      }}
                      disabled={disabledWeekDates}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {/* Info hint */}
                <div className="flex items-start gap-2 mt-1">
                  <Info className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-slate-500 leading-snug">
                    The campaign will be active starting from your selected date
                    and will conclude on{" "}
                    <span className="text-brand-aqua font-semibold">
                      {fridayLabel}
                    </span>{" "}
                    of that week.
                  </p>
                </div>
                {errors.date && <ErrorMsg msg={errors.date} />}
              </div>

              {/* Select Prize */}
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Select Prize{" "}
                  <span className="text-red-400 font-normal">*</span>
                </Label>
                <Select
                  value={form.prizeId}
                  onValueChange={(v) => {
                    setForm({ ...form, prizeId: v });
                    if (errors.prizeId) setErrors({ ...errors, prizeId: null });
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      "h-10 rounded-md border-slate-200 bg-white text-left font-semibold text-xs shadow-sm focus:outline-none focus:border-slate-500 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0 transition-all",
                      errors.prizeId && "border-red-400",
                      !form.prizeId && "text-slate-400",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Gift className="h-4 w-4 text-slate-400 shrink-0" />
                      <SelectValue
                        placeholder="Choose a campaign prize"
                        className="!text-left"
                      />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {prizesList.length === 0 ? (
                      <div className="p-3 text-sm text-left text-slate-400">
                        No active prizes available
                      </div>
                    ) : (
                      prizesList
                        .filter((p) => p && p.isActive)
                        .map((p) => (
                          <SelectItem
                            key={p._id}
                            value={p._id}
                            className="py-2"
                          >
                            <span className="flex items-center gap-2 font-medium">
                              {/* <Gift className="h-4 w-4 text-amber-500" /> */}
                              {p.title}
                            </span>
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
                {errors.prizeId && <ErrorMsg msg={errors.prizeId} />}
              </div>
            </div>

            {/* ── Footer ── */}
            <DialogFooter className="flex items-center sm:justify-end px-7 py-5 bg-slate-50/80 border-t border-slate-100 gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="font-semibold text-[13px] text-slate-600 border-slate-300 h-10 px-6 rounded-md hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleOnSubmit}
                disabled={loading}
                className="bg-brand-aqua hover:bg-brand-hoverAqua text-white text-[13px] font-bold h-10 px-6 rounded-md shadow-sm gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isEditing ? (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Campaign
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {/* ── BULK MODE ── */}
        {mode === "bulk" && (
          <div className="p-6 bg-white">
            <BulkForm
              prizes={prizesList}
              campaigns={campaigns}
              onSubmit={onBulkSubmit}
              onCancel={() => onOpenChange(false)}
              isSubmitting={bulkLoading}
              isPrizesLoading={loading}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CampaignDialog;
