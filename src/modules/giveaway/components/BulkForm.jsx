import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CalendarRange,
  CalendarDays,
  Trophy,
  Rocket,
  AlertCircle,
  Type,
  RefreshCcw,
  Gift,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, startOfWeek, endOfWeek, setDay } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

/**
 * Calculates the Monday–Sunday boundaries for a given date.
 */
function getWeekRange(date) {
  const monday = startOfWeek(date, { weekStartsOn: 1 });
  const sunday = endOfWeek(date, { weekStartsOn: 1 });
  return { from: monday, to: sunday };
}

export default function BulkForm({
  prizes = [],
  campaigns = [],
  onSubmit,
  onCancel,
  isSubmitting,
  isPrizesLoading,
}) {
  const [form, setForm] = useState({
    title: "",
    startDate: "",
    endDate: "",
    prizeId: "",
  });
  const [errors, setErrors] = useState({});
  const [calOpen, setCalOpen] = useState(false);

  // ─── Compute which dates belong to weeks with existing campaigns ───
  const disabledWeekDates = useMemo(() => {
    const existingWeeks = (campaigns || []).map((c) => {
      const d = new Date(c.date);
      return getWeekRange(d);
    });

    return (date) => {
      // Disable past dates always
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) return true;

      if (!existingWeeks.length) return false;

      // Disable dates that fall within a week that already has a campaign
      return existingWeeks.some((week) => {
        return date >= week.from && date <= week.to;
      });
    };
  }, [campaigns]);

  // Compute the full date range for visual highlighting
  const bulkRange = useMemo(() => {
    if (!form.startDate && !form.endDate) return undefined;
    return {
      from: form.startDate ? new Date(form.startDate + "T12:00:00") : undefined,
      to: form.endDate ? new Date(form.endDate + "T12:00:00") : undefined,
    };
  }, [form.startDate, form.endDate]);

  const validate = () => {
    const newErrors = {};
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);

    if (!form.title?.trim()) newErrors.title = "Campaign batch title required";
    if (!form.startDate) newErrors.startDate = "Start date required";
    if (!form.endDate) newErrors.endDate = "End date required";
    if (form.startDate && form.endDate && start > end)
      newErrors.dateRange = "End date cannot be before start date";
    if (!form.prizeId) newErrors.prizeId = "Please select a prize";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAction = () => {
    if (!validate()) return;
    onSubmit({ ...form, supportiveItems: [] });
    setForm({ title: "", startDate: "", endDate: "", prizeId: "" });
  };

  const ErrorMsg = ({ msg }) => (
    <p className="text-[10px] font-medium text-red-500 flex items-center gap-1 mt-1">
      <AlertCircle className="h-3 w-3" /> {msg}
    </p>
  );

  /**
   * Reusable calendar date range picker popover
   */
  const DateRangePickerInput = ({ label, error, isOpen, setIsOpen }) => {
    const activeRange = bulkRange;

    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {label} <span className="text-red-400 font-normal">*</span>
          </label>
          {(form.startDate || form.endDate) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setForm((prev) => ({ ...prev, startDate: "", endDate: "" }));
              }}
              className="group flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-brand-aqua transition-colors py-1 px-2 rounded-lg hover:bg-brand-aqua/5"
            >
              <RefreshCcw className="h-2.5 w-2.5 transition-transform group-hover:rotate-180 duration-500" />
              Reset Range
            </button>
          )}
        </div>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full h-10 py-1.5 px-3 justify-start text-left font-semibold border-slate-200 rounded-md bg-white text-xs shadow-sm transition-all focus-visible:border-slate-500",
                error && "border-red-400 focus-visible:border-red-400",
              )}
            >
              <CalendarRange className="mr-2 h-4 w-4 text-brand-aqua shrink-0" />
              {form.startDate ? (
                form.endDate ? (
                  <span className="truncate text-slate-900">
                    {format(new Date(form.startDate + "T12:00:00"), "PP")} –{" "}
                    {format(new Date(form.endDate + "T12:00:00"), "PP")}
                  </span>
                ) : (
                  <span className="truncate text-slate-900">
                    {format(new Date(form.startDate + "T12:00:00"), "PP")}
                  </span>
                )
              ) : (
                <span className="truncate text-muted-foreground w-full">
                  Pick a date range
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 z-[100] pointer-events-auto rounded-xl shadow-2xl border-slate-200 overflow-y-auto overflow-x-hidden max-w-[95vw] max-h-[85vh] sm:max-h-[var(--radix-popover-content-available-height)] max-sm:!fixed max-sm:!top-1/2 max-sm:!left-1/2 max-sm:!-translate-x-1/2 max-sm:!-translate-y-1/2 max-sm:!transform"
            align="center"
            side="bottom"
            avoidCollisions={true}
          >
            <Calendar
              mode="range"
              defaultMonth={
                form.startDate
                  ? new Date(form.startDate + "T12:00:00")
                  : new Date()
              }
              selected={activeRange}
              showOutsideDays={false}
              onSelect={(range) => {
                if (range?.from) {
                  const tzOffsetFrom = range.from.getTimezoneOffset() * 60000;
                  const localFrom = new Date(
                    range.from.getTime() - tzOffsetFrom,
                  )
                    .toISOString()
                    .slice(0, 10);
                  setForm((prev) => ({ ...prev, startDate: localFrom }));
                } else {
                  setForm((prev) => ({ ...prev, startDate: "" }));
                }

                if (range?.to) {
                  // Snap end date to the Friday of the clicked date's week
                  let toD = new Date(range.to.getTime() + 12 * 60 * 60 * 1000);
                  let friday = setDay(toD, 5, { weekStartsOn: 1 });

                  const tzOffsetTo = friday.getTimezoneOffset() * 60000;
                  const localTo = new Date(friday.getTime() - tzOffsetTo)
                    .toISOString()
                    .slice(0, 10);
                  setForm((prev) => ({ ...prev, endDate: localTo }));
                } else {
                  setForm((prev) => ({ ...prev, endDate: "" }));
                }

                if (errors.startDate)
                  setErrors((e) => ({
                    ...e,
                    startDate: null,
                    dateRange: null,
                  }));
                if (errors.endDate)
                  setErrors((e) => ({ ...e, endDate: null, dateRange: null }));
              }}
              disabled={disabledWeekDates}
              initialFocus
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>
        {error && <ErrorMsg msg={error} />}
        {(errors.startDate || errors.endDate) && !error && (
          <ErrorMsg msg={errors.startDate || errors.endDate} />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Batch Title Section */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Campaign Title <span className="text-red-400 font-normal">*</span>
        </label>

        <div className="relative">
          <Pencil className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={form.title}
            onChange={(e) => {
              setForm({ ...form, title: e.target.value });
              if (errors.title) setErrors({ ...errors, title: null });
            }}
            placeholder="e.g. Easter Special Draws - April 2026"
            className={cn(
              "h-10 pl-10 text-xs font-semibold rounded-md border-slate-200 bg-white shadow-sm focus-visible:border-slate-500 transition-all",
              errors.title && "border-red-400 focus-visible:border-red-400",
            )}
          />
          {errors.title && <ErrorMsg msg={errors.title} />}
        </div>
      </div>

      {/* Date Range Section — Premium Calendar Popovers */}
      <div className="space-y-2">
        <DateRangePickerInput
          label="Campaign Date Range"
          error={errors.dateRange}
          isOpen={calOpen}
          setIsOpen={setCalOpen}
        />
        <p className="text-[11px] text-slate-500 leading-snug">
          Select any date range. The system will smartly generate campaigns ONLY
          for the <span className="text-brand-aqua font-semibold">Fridays</span>{" "}
          that fall within this range.
        </p>
      </div>

      {/* Prize Section */}
      <div className="space-y-2">
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Assign Prize <span className="text-red-400 font-normal">*</span>
          </label>
          <Select
            value={form.prizeId}
            onValueChange={(v) => {
              setForm({ ...form, prizeId: v });
              if (errors.prizeId) setErrors({ ...errors, prizeId: null });
            }}
          >
            <SelectTrigger
              className={cn(
                "h-10 text-xs font-semibold rounded-md border-slate-200 bg-white shadow-sm focus:outline-none focus:border-slate-500 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0 transition-all",
                errors.prizeId && "border-red-400 focus-visible:border-red-400",
              )}
            >
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-slate-400 shrink-0" />
                <SelectValue
                  placeholder={
                    isPrizesLoading
                      ? "Loading prizes..."
                      : "Choose a prize for all campaigns"
                  }
                />
              </div>
            </SelectTrigger>
            <SelectContent>
              {isPrizesLoading ? (
                <div className="p-3 text-sm text-center text-slate-500">
                  Loading prizes...
                </div>
              ) : prizes.length === 0 ? (
                <div className="p-3 text-sm text-center text-slate-500">
                  No prizes found
                </div>
              ) : (
                prizes.map((p) => (
                  <SelectItem
                    key={p._id}
                    value={p._id}
                    disabled={!p.isActive}
                    className="py-2"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      {/* <Trophy className="h-3.5 w-3.5 text-amber-500" /> */}
                      {p.title}
                      {!p.isActive && (
                        <Badge variant="secondary" className="text-[9px] ml-1">
                          Inactive
                        </Badge>
                      )}
                    </span>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.prizeId && <ErrorMsg msg={errors.prizeId} />}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
        <Button
          variant="outline"
          onClick={onCancel}
          type="button"
          className="font-bold text-xs text-slate-600 border-slate-200 h-10 px-6 rounded-md hover:bg-slate-50 transition-all"
        >
          Cancel
        </Button>
        <Button
          className="bg-brand-aqua hover:bg-brand-hoverAqua text-white font-bold gap-2 h-10 px-6 text-[13px] rounded-md shadow-sm transition-all active:scale-[0.98]"
          onClick={handleAction}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Processing...
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4" /> Create Campaigns
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
