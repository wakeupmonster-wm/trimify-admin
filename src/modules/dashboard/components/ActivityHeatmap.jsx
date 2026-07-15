import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LuActivity } from "react-icons/lu";
import { Calendar, Info } from "lucide-react";
import { format, getDaysInMonth } from "date-fns";
import DashboardHead from "@/components/shared/dashboard.head";
import { formatCompactNumber } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Intensity color mapping — existing colors preserved
const getIntensityColor = (intensity) => {
  switch (intensity) {
    case 3:
      return "bg-[#46C7CD]"; // High — bright brand aqua
    case 2:
      return "bg-[#46C7CD]/70"; // Medium
    case 1:
      return "bg-[#46C7CD]/40"; // Low
    case 0:
      return "bg-slate-100"; // No activity
    default:
      return "bg-slate-200/60";
  }
};

const timeSlots = [
  "3AM - 6AM",
  "6AM - 9AM",
  "9AM - 12PM",
  "12PM - 3PM",
  "3PM - 6PM",
  "6PM - 9PM",
  "9PM - 12AM",
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function ActivityHeatmap({ data }) {
  if (!data) return null;

  const currentDate = new Date();
  const [viewMonth, setViewMonth] = useState(currentDate.getMonth());
  const [viewYear, setViewYear] = useState(currentDate.getFullYear());

  // Year options: current year and 3 years back
  const yearOptions = useMemo(() => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 4; i++) {
      years.push(currentYear - i);
    }
    return years;
  }, []);

  const totalDays = getDaysInMonth(new Date(viewYear, viewMonth));

  // Build lookup map for fast access: "YYYY-MM-DD|slot" → { count, intensity }
  const dataMap = useMemo(() => {
    const map = {};
    const items = data.data || (Array.isArray(data) ? data : []);
    items.forEach((item) => {
      if (item.date && item.slot !== undefined) {
        map[`${item.date}|${item.slot}`] = {
          count: item.count,
          intensity: item.intensity,
        };
      }
    });
    return map;
  }, [data]);

  // Find peak cell for this month
  const peakCell = useMemo(() => {
    let peak = null;
    for (let d = 1; d <= totalDays; d++) {
      // Use manual string construction to be timezone-safe (YYYY-MM-DD)
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      for (let s = 0; s < 7; s++) {
        const entry = dataMap[`${dateStr}|${s}`];
        if (entry && (!peak || entry.count > peak.count)) {
          peak = { dateStr, slot: s, count: entry.count };
        }
      }
    }
    return peak;
  }, [dataMap, viewMonth, viewYear, totalDays]);

  const dynamicInsight = useMemo(() => {
    const monthName = monthNames[viewMonth];

    if (!peakCell) {
      return `No significant activity data found for ${monthName} ${viewYear}. Select a different period to view trends.`;
    }

    const peakDate = new Date(peakCell.dateStr);
    const peakTime = timeSlots[peakCell.slot];

    return `Peak activity in ${monthName} ${viewYear} occurred on ${format(
      peakDate,
      "do",
    )} at ${peakTime} (${formatCompactNumber(peakCell.count)} users)`;
  }, [peakCell, viewMonth, viewYear]);

  return (
    <Card className="flex flex-col h-full pb-0 bg-white gap-2 border border-slate-200 hover:border-blue-200 transition-all duration-300 rounded-2xl shadow-sm font-jakarta overflow-hidden">
      <CardHeader className="px-0">
        <div className="flex items-start justify-between pb-4 px-5 border-b border-slate-200">
          <DashboardHead
            title="Peak Activity Heatmap"
            subtitle="When your users are most active"
            Icon={LuActivity}
            iconColor="text-slate-600"
            iconBg="bg-slate-100/50"
          />

          {/* Month & Year Selectors */}
          <div className="flex flex-col md:flex-row items-end md:items-center gap-2">
            {/* Month Select */}
            <Select
              value={viewMonth.toString()}
              onValueChange={(val) => setViewMonth(parseInt(val))}
            >
              <SelectTrigger className="h-9 w-full md:w-[125px] rounded-md bg-white border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-600 shadow-sm transition-all duration-300 focus:border-brand-blue focus:ring-0 focus-visible:border-brand-blue focus-visible:ring-0">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <SelectValue placeholder="Month" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-lg border border-slate-100/80 bg-white p-1.5 shadow-xl min-w-[130px]">
                {monthNames.map((name, idx) => (
                  <SelectItem
                    key={idx}
                    value={idx.toString()}
                    className={`text-xs font-semibold py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      viewMonth === idx
                        ? "!bg-brand-blue !text-brand-blue !data-[highlighted]:bg-brand-blue !data-[highlighted]:text-brand-blue"
                        : "text-slate-500 hover:!bg-white hover:text-slate-900"
                    }`}
                  >
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year Select */}
            <Select
              value={viewYear.toString()}
              onValueChange={(val) => setViewYear(parseInt(val))}
            >
              <SelectTrigger className="h-9 w-full md:w-[95px] rounded-md bg-white border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-600 shadow-sm transition-all duration-300 focus:border-brand-blue focus:ring-0 focus-visible:border-brand-blue focus-visible:ring-0">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border border-slate-100/80 bg-white p-1.5 shadow-xl min-w-[100px]">
                {yearOptions.map((year) => (
                  <SelectItem
                    key={year}
                    value={year.toString()}
                    className={`text-xs font-semibold py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      viewYear === year
                        ? "!bg-brand-blue !text-brand-blue !data-[highlighted]:bg-brand-blue !data-[highlighted]:text-brand-blue"
                        : "text-slate-500 hover:!bg-white hover:text-slate-900"
                    }`}
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col px-5 pb-5 overflow-x-auto">
        <div className="min-w-[750px]">
          {/* Date Numbers Header (1 to totalDays) */}
          <div className="flex mb-1.5 ml-[70px]">
            {Array.from({ length: totalDays }).map((_, i) => (
              <div
                key={i}
                className="flex-1 text-center text-[9px] font-bold text-slate-400"
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Heatmap Grid: 7 rows (time slots) × totalDays cols */}
          <TooltipProvider>
            {timeSlots.map((slotLabel, slotIdx) => (
              <div key={slotLabel} className="flex items-center mb-[4px]">
                {/* Time Slot Label */}
                <span className="w-full max-w-[70px] text-[10px] font-medium text-slate-400 text-right pr-3 shrink-0">
                  {slotLabel}
                </span>

                {/* Cells for this time slot row */}
                <div className="flex-1 flex gap-[5px]">
                  {Array.from({ length: totalDays }).map((_, dIdx) => {
                    const dateObj = new Date(viewYear, viewMonth, dIdx + 1);
                    const dateStr = format(dateObj, "yyyy-MM-dd");
                    const entry = dataMap[`${dateStr}|${slotIdx}`];
                    const count = entry?.count || 0;
                    const intensity = entry?.intensity || 0;
                    const isPeak =
                      peakCell &&
                      peakCell.dateStr === dateStr &&
                      peakCell.slot === slotIdx;

                    return (
                      <Tooltip key={dIdx}>
                        <TooltipTrigger asChild>
                          <div
                            className={`flex-1 aspect-square rounded-[3px] border border-slate-100 transition-all duration-200 cursor-pointer hover:ring-2 hover:ring-brand-blue hover:scale-110 ${getIntensityColor(intensity)} ${
                              isPeak ? "ring-2 ring-brand-blue" : ""
                            }`}
                          />
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="bg-slate-900 text-white border-none rounded-lg px-3 py-2 shadow-xl"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] font-bold">
                              {format(dateObj, "MMM dd, yyyy")} (
                              {format(dateObj, "EEE")})
                            </span>
                            <span className="text-[10px] text-slate-300">
                              {slotLabel}
                            </span>
                            <span className="text-[10px] text-slate-300">
                              👥 {formatCompactNumber(count)} users
                            </span>
                            {isPeak && (
                              <span className="text-[10px] font-bold text-brand-blue">
                                ✨ Highest for this slot
                              </span>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            ))}
          </TooltipProvider>

          {/* Footer Row */}
          <div className="mt-4 flex items-center justify-between px-0">
            {/* Legend */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Low
              </span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-[3px] bg-slate-100 border border-slate-100" />
                <div className="w-3 h-3 rounded-[3px] bg-[#46C7CD]/40 border border-slate-100" />
                <div className="w-3 h-3 rounded-[3px] bg-[#46C7CD]/70 border border-slate-100" />
                <div className="w-3 h-3 rounded-[3px] bg-[#46C7CD] border border-slate-100" />
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                High
              </span>
            </div>

            {/* Timezone Info */}
            {/* <div className="flex items-center gap-1 text-[9px] text-slate-400">
              <span>ⓘ</span>
              <span>All times shown in local time (GMT+5:30)</span>
            </div> */}

            {/* Insight Box */}
            <div className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl text-foreground/80 text-xs font-medium">
              <div className="w-5 h-5 rounded-full flex items-center justify-center">
                <Info size={12} className="text-brand-blue" />
              </div>
              {dynamicInsight}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
