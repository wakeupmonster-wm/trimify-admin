import * as React from "react";
import {
  subDays,
  format,
  startOfDay,
  endOfDay,
  isSameDay,
  startOfMonth,
  endOfMonth,
  subMonths,
} from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const PRESETS = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "last7" },
  { label: "Last 30 Days", value: "last30" },
  { label: "Last 90 Days", value: "last90" },
  { label: "Custom Range", value: "custom" },
];

export function CalendarDateRangePicker({
  className,
  compact = false,
  onDateChange,
  value,
}) {
  const [date, setDate] = React.useState({
    from: value?.from ? new Date(value.from) : startOfDay(new Date()),
    to: value?.to ? new Date(value.to) : endOfDay(new Date()),
  });

  const [tempDate, setTempDate] = React.useState(date);
  const [presetValue, setPresetValue] = React.useState(
    value?.preset || "today",
  );
  const [isOpen, setIsOpen] = React.useState(false);

  // Sync with external value
  React.useEffect(() => {
    if (value?.from && value?.to) {
      const from = new Date(value.from);
      const to = new Date(value.to);
      setDate({ from, to });
      setTempDate({ from, to });
      if (value.preset) setPresetValue(value.preset);
    }
  }, [value]);

  // Reset temp state when popover opens so discarded selections don't persist
  React.useEffect(() => {
    if (isOpen) {
      setTempDate(date);
      if (value?.preset) setPresetValue(value.preset);
    }
  }, [isOpen, date, value]);

  const handleSelect = (selected) => {
    if (!selected) return;
    setTempDate(selected);
    setPresetValue("custom");
  };

  const applyDateRange = (targetDate, targetPreset) => {
    setDate(targetDate);
    const finalDate = { ...targetDate };

    finalDate.preset = targetPreset;

    if (onDateChange) onDateChange(finalDate);
    setIsOpen(false);
  };

  const handlePresetSelect = (value) => {
    setPresetValue(value);
    const today = startOfDay(new Date());
    const endOfToday = endOfDay(new Date());
    let newDate;

    if (value === "custom") {
      return; // Stay open for custom selection
    }

    switch (value) {
      case "today":
        newDate = { from: today, to: endOfToday };
        break;
      case "yesterday":
        const yesterday = subDays(today, 1);
        newDate = { from: yesterday, to: endOfDay(yesterday) };
        break;
      case "last7":
        newDate = { from: subDays(today, 7), to: endOfToday };
        break;
      case "last30":
        newDate = { from: subDays(today, 30), to: endOfToday };
        break;
      case "last90":
        newDate = { from: subDays(today, 90), to: endOfToday };
        break;
      case "thisMonth":
        newDate = { from: startOfMonth(today), to: endOfToday };
        break;
      case "lastMonth": {
        const lastMonth = subMonths(today, 1);
        newDate = {
          from: startOfMonth(lastMonth),
          to: endOfDay(endOfMonth(lastMonth)),
        };
        break;
      }
      default:
        break;
    }

    /* Original code (set temp date only):
    if (newDate) {
      setTempDate(newDate);
    }
    */
    if (newDate) {
      setTempDate(newDate);
      applyDateRange(newDate, value);
    }
  };

  const handleApply = () => {
    applyDateRange(tempDate, presetValue);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover
        open={isOpen}
        onOpenChange={setIsOpen}
        className={"shadow-none z-0"}
      >
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-between group text-left shadow-sm font-semibold bg-white hover:bg-slate-50 text-slate-600 border border-slate-300/60 transition-all duration-300 rounded-md px-4 focus-visible:outline-none focus-visible:border-app-primary2 focus-visible:ring-0",
              compact ? "h-8 text-xs px-2 gap-2" : "h-10 text-xs gap-3",
              !date && "text-slate-400",
            )}
          >
            <div className="flex items-center gap-2.5">
              <CalendarIcon
                className={cn(
                  "text-slate-400 shrink-0",
                  compact ? "h-3.5 w-3.5" : "h-4 w-4",
                )}
              />
              <span className="truncate">
                {date?.from ? (
                  date.to && !isSameDay(date.from, date.to) ? (
                    <>
                      {format(date.from, "MMM dd")} –{" "}
                      {format(date.to, "MMM dd, y")}
                    </>
                  ) : (
                    format(date.from, "MMM dd, y")
                  )
                ) : (
                  "Pick a date"
                )}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full min-w-52 max-h-[var(--radix-popover-content-available-height)] overflow-y-auto p-2 pb-1 rounded-xl mt-0.5 sm:mt-1 bg-white"
          align="end"
        >
          {/* Presets List */}
          <div className="flex flex-col gap-0.5">
            {PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => handlePresetSelect(p.value)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-[11px] sm:text-xs font-semibold transition-all duration-300",
                  presetValue === p.value
                    ? "bg-blue-50 text-app-primary2"
                    : "text-muted-foreground/90 hover:bg-slate-50 hover:text-foreground",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Calendar Section (Always show if custom, or keep it if you want presets to be previewable) */}
          {presetValue === "custom" && (
            <>
              <div className="border-t border-slate-300/60/80 my-3" />
              <div className="mt-2 p-1 relative animate-in fade-in slide-in-from-top-1 duration-300">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={tempDate?.from}
                  selected={tempDate}
                  onSelect={handleSelect}
                  numberOfMonths={1}
                  className="p-0 border-0"
                  classNames={{
                    root: "w-full",
                    months: "w-full",
                    month: "w-full space-y-4",
                    nav: "flex items-center justify-between absolute w-full pr-5 top-0",
                    button_previous:
                      "h-7 w-7 sm:h-8 sm:w-8 bg-white border border-slate-300/60/80 rounded-lg flex items-center justify-center hover:bg-slate-50 hover:border-slate-300/60 transition-all",
                    button_next:
                      "h-7 w-7 sm:h-8 sm:w-8 bg-white border border-slate-300/60/80 rounded-lg flex items-center justify-center hover:bg-slate-50 hover:border-slate-300/60 transition-all",
                    month_caption:
                      "flex justify-center items-center h-6 sm:h-9 font-bold text-foreground text-xs mb-1 tracking-tight",
                    weekdays: "flex w-full mt-2",
                    weekday:
                      "text-muted-foreground flex-1 font-semibold text-[11px] sm:text-xs uppercase text-center",
                    week: "flex w-full",
                    day: "relative p-0 flex-1 aspect-square flex items-center justify-center",
                    day_button:
                      "w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-[11px] sm:text-xs font-semibold rounded-xl transition-all",
                    range_start:
                      "bg-app-primary2 text-white rounded-l-xl my-0.5",
                    range_end: "bg-app-primary2 text-white rounded-r-xl my-0.5",
                    range_middle:
                      "bg-app-primary2 text-app-primary2 rounded-none my-0.5",
                    selected: "bg-app-primary2 text-white",
                    today:
                      "text-app-primary2 font-bold underline decoration-2 underline-offset-4",
                    outside: "text-slate-300 opacity-50",
                  }}
                />
              </div>
            </>
          )}

          {/* Action Footer - Only visible for custom range to allow applying the selection */}
          {/* Original code (always visible):
          <div className="border-t border-slate-300/60/80 my-2 pt-2 flex justify-end px-2">
            <Button
              onClick={handleApply}
              className="w-20 bg-app-primary2 hover:bg-brand-hoverAqua text-white font-bold text-[11px] h-8 rounded-lg transition-all duration-300 shadow-sm"
            >
              Apply Filter
            </Button>
          </div>
          */}
          {presetValue === "custom" && (
            <div className="border-t border-slate-300/60/80 my-2 pt-2 flex justify-end px-2">
              <Button
                onClick={handleApply}
                className="w-20 bg-app-primary2 hover:bg-brand-hoverAqua text-white font-bold text-[11px] h-8 rounded-lg transition-all duration-300 shadow-sm"
              >
                Apply Filter
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
