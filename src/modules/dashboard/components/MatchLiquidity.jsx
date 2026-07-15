import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TbSwipe } from "react-icons/tb";
import { TrendingUp, TrendingDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip as ShadTooltip,
  TooltipContent as ShadTooltipContent,
  TooltipProvider as ShadTooltipProvider,
  TooltipTrigger as ShadTooltipTrigger,
} from "@/components/ui/tooltip";

export function MatchLiquidity({ data, preset }) {
  if (!data) return null;

  // Extract the specific metric from zoneC if needed, or assume it's passed directly
  const metric =
    data.metrics?.find((m) => m.label === "Match Liquidity") || data;

  const getComparisonLabel = () => {
    switch (preset) {
      case "today":
        return "vs yesterday";
      case "yesterday":
        return "vs previous day";
      case "last7":
        return "vs previous 7 days";
      case "last30":
        return "vs previous 30 days";
      case "last90":
        return "vs previous 90 days";
      default:
        return "vs previous period";
    }
  };

  // Parse match/swipe counts from sub: "13 matches / 278 swipes"
  const parts = metric.sub?.split("/") || [];
  const matchesStr = parts[0]?.trim() || "0 matches";
  const swipesStr = parts[1]?.trim() || "0 swipes";

  const matchesCount = parseInt(matchesStr.replace(/[^\d]/g, "")) || 0;
  const totalSwipesCount = parseInt(swipesStr.replace(/[^\d]/g, "")) || 0;
  const unmatchedSwipesCount = Math.max(0, totalSwipesCount - matchesCount);

  const value = totalSwipesCount > 0 ? parseFloat(metric.value) || 0 : 0;
  const remaining = totalSwipesCount > 0 ? 100 - value : 0;

  const chartData =
    totalSwipesCount > 0
      ? [
          { name: "Matched", value: value, color: "#258A8E" },
          { name: "Remaining", value: remaining, color: "#9AE2E5" }, // Matches the legend indicator dot color
        ]
      : [
          { name: "Empty", value: 100, color: "#9AE2E5" }, // Clean light gray placeholder ring when there are no swipes
        ];

  const trendValue = parseFloat(metric.trend) || 0;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl pt-5 pb-3 shadow-sm hover:border-blue-200 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start gap-3 px-6 pb-4 border-b border-slate-200">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100/50">
          <TbSwipe className="h-5 w-5 text-slate-600" />
        </div>
        <div className="flex flex-col gap-0.5 items-start text-left">
          <h3 className="text-sm font-black text-[#0F172A] flex items-center gap-1.5">
            Match Liquidity
            <ShadTooltipProvider>
              <ShadTooltip delayDuration={200}>
                <ShadTooltipTrigger asChild>
                  <div className="cursor-help text-slate-400 hover:text-brand-blue transition-colors">
                    <Info size={14} strokeWidth={2.5} />
                  </div>
                </ShadTooltipTrigger>
                <ShadTooltipContent
                  className="bg-slate-900 border-slate-800 text-slate-100 max-w-[250px] p-2.5 rounded-lg text-[11px] font-medium leading-relaxed shadow-xl"
                  side="right"
                >
                  Percentage of total user swipes (likes and superlikes) that
                  successfully resulted in a mutual match during the selected
                  period.
                </ShadTooltipContent>
              </ShadTooltip>
            </ShadTooltipProvider>
          </h3>
          <p className="text-xs font-medium text-slate-500">
            {metric.subtitle ||
              "Percentage of swipes that successfully resulted in a match"}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center md:items-start justify-center gap-5 mt-5 px-6">
        {/* Doughnut Chart */}
        <div className="relative w-48 lg:w-36 h-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={44}
                outerRadius={60}
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="none"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-black text-[#0F172A]">
              {totalSwipesCount > 0 ? metric.value : "0%"}
            </span>
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tight">
              Match Liquidity
            </span>
          </div>
        </div>

        {/* Legend and Trend */}
        <div className="flex-1 w-full space-y-3">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#9AE2E5]" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#0F172A]">
                    Total Swipes
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    {unmatchedSwipesCount.toLocaleString()} swipes
                  </span>
                </div>
              </div>
              <span className="text-xs font-black text-slate-400">
                {remaining.toFixed(1)}%
              </span>
            </div>

            <div className="h-px bg-slate-100 w-full" />
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#258A8E]" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#0F172A]">
                    Matches
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    {matchesStr}
                  </span>
                </div>
              </div>
              <span className="text-xs font-black text-[#258A8E]">
                {value.toFixed(1)}%
              </span>
            </div>
          </div>

          <div
            className={cn(
              "rounded-xl p-2 flex flex-col items-center justify-center gap-1 border transition-all duration-300",
              trendValue > 0
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : trendValue < 0
                  ? "bg-rose-50 text-rose-600 border-rose-100"
                  : "bg-slate-50 text-slate-500 border-slate-200",
            )}
          >
            <div className="flex items-center gap-2">
              {trendValue > 0 ? (
                <TrendingUp size={16} className="stroke-[2.5]" />
              ) : trendValue < 0 ? (
                <TrendingDown size={16} className="stroke-[2.5]" />
              ) : null}
              <span className="text-base font-black">{metric.trend}</span>
            </div>
            <p className="text-[9px] font-bold opacity-80">
              {getComparisonLabel()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
