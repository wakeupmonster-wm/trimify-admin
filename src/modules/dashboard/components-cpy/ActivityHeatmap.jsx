import React, { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LuActivity } from "react-icons/lu";
import { Info } from "lucide-react";
import DashboardHead from "@/components/shared/dashboard.head";
import { formatCompactNumber } from "@/lib/utils";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);

const getIntensityColor = (intensity) => {
  switch (intensity) {
    case 3:
      // return "bg-[#46C7CD]"; // High
      return "bg-[#5AA0C1]"; // High
    case 2:
      // return "bg-[#46C7CD]/70"; // Medium
      return "bg-[#5AA0C1]/70"; // Medium
    case 1:
      // return "bg-[#46C7CD]/40"; // Low
      return "bg-[#5AA0C1]/40"; // Low
    case 0:
      return "bg-slate-100"; // No activity
    default:
      return "bg-slate-200/60";
  }
};

const formatHour = (hour) => {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
};

export function ActivityHeatmap({ data }) {
  if (!data) return null;

  const dataMap = useMemo(() => {
    const map = {};
    let maxTotal = 0;

    const items = Array.isArray(data) ? data : data.peakActivityHeatmap || [];

    items.forEach((item) => {
      const day = item.day_of_week; // 1 (Mon) - 7 (Sun)
      const hour = item.hour_of_day;
      map[`${day}-${hour}`] = item.total;
      if (item.total > maxTotal) {
        maxTotal = item.total;
      }
    });

    return { map, maxTotal };
  }, [data]);

  const getIntensity = (total, max) => {
    if (!total || total === 0) return 0;
    if (total > max * 0.66) return 3;
    if (total > max * 0.33) return 2;
    return 1;
  };

  const peakCell = useMemo(() => {
    let peak = null;
    let max = 0;
    Object.entries(dataMap.map).forEach(([key, total]) => {
      if (total > max) {
        max = total;
        const [d, h] = key.split("-");
        peak = { day: parseInt(d), hour: parseInt(h), total };
      }
    });
    return peak;
  }, [dataMap]);

  return (
    <Card className="flex flex-col h-full pb-0 bg-white gap-2 border border-slate-300/60 hover:border-blue-200 transition-all duration-300 rounded-2xl shadow-sm font-jakarta overflow-hidden">
      <CardHeader className="px-0">
        <div className="flex items-start justify-between pb-4 px-5 border-b border-slate-300/60">
          <DashboardHead
            title="Peak Activity Heatmap"
            subtitle="When your users are most active"
            Icon={LuActivity}
            iconColor="text-slate-600"
            iconBg="bg-slate-100/50"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col px-5 pb-5 overflow-x-auto">
        <div className="min-w-[600px] mt-2">
          {/* Hours Header */}
          <div className="flex mb-2 ml-[35px]">
            {hoursOfDay.map((hour) => (
              <div
                key={hour}
                className="flex-1 text-center text-[9px] font-bold text-slate-400"
              >
                {hour % 2 === 0 ? formatHour(hour).replace(" ", "") : ""}
              </div>
            ))}
          </div>

          {/* Grid */}
          <TooltipProvider>
            {daysOfWeek.map((dayLabel, dIdx) => {
              const day = dIdx + 1;
              return (
                <div key={dayLabel} className="flex items-center mb-1">
                  {/* Day Label */}
                  <span className="w-full max-w-[35px] text-[10px] font-medium text-slate-400 text-right pr-2 shrink-0">
                    {dayLabel}
                  </span>

                  {/* Cells */}
                  <div className="flex-1 flex gap-1">
                    {hoursOfDay.map((hour) => {
                      const total = dataMap.map[`${day}-${hour}`] || 0;
                      const intensity = getIntensity(total, dataMap.maxTotal);
                      const isPeak =
                        peakCell &&
                        peakCell.day === day &&
                        peakCell.hour === hour;

                      return (
                        <Tooltip key={hour}>
                          <TooltipTrigger asChild>
                            <div
                              className={`flex-1 aspect-square rounded-[3px] border border-slate-100 transition-all duration-200 cursor-pointer hover:ring-2 hover:ring-brand-aqua/40 hover:scale-110 ${getIntensityColor(intensity)} ${
                                isPeak ? "ring-2 ring-brand-aqua" : ""
                              }`}
                            />
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="bg-slate-900 text-white border-none rounded-lg px-3 py-2 shadow-xl"
                          >
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[11px] font-bold">
                                {dayLabel}, {formatHour(hour)}
                              </span>
                              <span className="text-[10px] text-slate-300">
                                👥 {formatCompactNumber(total)} users
                              </span>
                              {isPeak && (
                                <span className="text-[10px] font-bold text-brand-aqua">
                                  ✨ Highest activity
                                </span>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </TooltipProvider>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between px-0">
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

            <div className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-brand-aqua/5 border border-brand-aqua/40 rounded-xl text-foreground/80 text-xs font-medium">
              <div className="w-5 h-5 rounded-full flex items-center justify-center">
                <Info size={12} className="text-brand-blue" />
              </div>
              {peakCell ? (
                <span>
                  Peak activity occurs on {daysOfWeek[peakCell.day - 1]}s at{" "}
                  {formatHour(peakCell.hour)}.
                </span>
              ) : (
                <span>No activity data found.</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
