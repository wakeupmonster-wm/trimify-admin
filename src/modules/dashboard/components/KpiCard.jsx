import React from "react";
import { cn } from "@/lib/utils";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

// Shared compact KPI card — used by both the main Dashboard's secondary KPI
// row and the Subscription Dashboard's overview row, so the two look
// consistent. Icon + label + value + description sit in one tight row
// (no `justify-between` split), so short and long descriptions never
// produce the uneven gaps a two-block layout does.
const TONE_STYLES = {
  default: {
    iconBg: "bg-blue-50",
    iconColor: "text-app-primary2",
    border: "border-slate-200 hover:border-app-primary2",
  },
  emerald: {
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    border: "border-slate-200 hover:border-emerald-300",
  },
  amber: {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    border: "border-slate-200 hover:border-amber-400",
  },
  rose: {
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    border: "border-slate-200 hover:border-rose-400",
  },
  violet: {
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    border: "border-slate-200 hover:border-violet-300",
  },
  cyan: {
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    border: "border-slate-200 hover:border-cyan-300",
  },
  slate: {
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    border: "border-slate-200 hover:border-slate-400",
  },
};

const KpiCard = ({
  icon: Icon,
  label,
  value,
  description,
  tone = "default",
  onClick,
  isSelected,
  trendValue,
  isPositive,
  trendExplanation,
  tooltipData,
}) => {
  const t = TONE_STYLES[tone] || TONE_STYLES.default;

  let dynamicExplanation = trendExplanation;
  if (
    tooltipData &&
    tooltipData.current !== undefined &&
    tooltipData.previous !== undefined &&
    !trendExplanation
  ) {
    const { current, previous, isCurrency } = tooltipData;
    const currStr = isCurrency
      ? `$${current?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : current?.toLocaleString();
    const prevStr = isCurrency
      ? `$${previous?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : previous?.toLocaleString();

    if (previous === 0 && current > 0) {
      dynamicExplanation = `${label} spiked to ${currStr} because there was 0 activity in the previous period.`;
    } else if (current === 0 && previous > 0) {
      dynamicExplanation = `${label} dropped to zero from ${prevStr} in the previous period.`;
    } else if (current === previous) {
      dynamicExplanation = `${label} remained exactly the same as the previous period (${currStr}).`;
    } else {
      const action = current > previous ? "increased" : "decreased";
      dynamicExplanation = `${label} ${action} from ${prevStr} to ${currStr}.`;
    }
  } else if (!dynamicExplanation) {
    dynamicExplanation = `${isPositive ? "Increase" : "Decrease"} compared to previous period`;
  }

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "bg-white rounded-2xl p-5 transition-all duration-300 shadow-sm border border-slate-200 hover:shadow-sm group flex flex-col justify-between min-h-[128px]",
        onClick &&
          "cursor-pointer hover:border-cyan-300/60 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-app-primary2 focus-visible:outline-none",
        isSelected && "border-app-primary2/60 shadow-app-primary2/10 shadow-md",
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2 overflow-hidden">
          <div className="flex items-center gap-2">
            {Icon && (
              <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0", t.iconBg, t.iconColor)}>
                <Icon className="w-4 h-4" />
              </div>
            )}
            <p className="text-xs font-semibold text-slate-600 transition-colors">
              {label}
            </p>
          </div>
          {trendValue ? (
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "flex items-center gap-1 font-bold text-[10px] border rounded-full py-1 px-2 shrink-0 transition-transform cursor-pointer",
                      !isPositive
                        ? "text-rose-600 bg-rose-50 border-rose-200"
                        : "text-emerald-600 bg-emerald-50 border-emerald-200",
                    )}
                  >
                    {isPositive ? (
                      <IconTrendingUp size={12} stroke={3} />
                    ) : (
                      <IconTrendingDown size={12} stroke={3} />
                    )}
                    <span>
                      {isPositive ? "+" : "-"}
                      {trendValue.replace(/^[+-]/, "")}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl max-w-xs text-xs p-3.5 rounded-xl font-medium"
                  side="bottom"
                  align="end"
                >
                  <p className="text-slate-300 border-b border-slate-700/50 pb-1.5 mb-1.5 leading-relaxed">
                    {dynamicExplanation}
                  </p>
                  {tooltipData ? (
                    <div className="space-y-1 mt-1">
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Current Period:</span>
                        <span>
                          {tooltipData.isCurrency ? "$" : ""}
                          {tooltipData.current?.toLocaleString(undefined, {
                            minimumFractionDigits: tooltipData.isCurrency
                              ? 2
                              : 0,
                            maximumFractionDigits: tooltipData.isCurrency
                              ? 2
                              : 0,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Previous Period:</span>
                        <span>
                          {tooltipData.isCurrency ? "$" : ""}
                          {tooltipData.previous?.toLocaleString(undefined, {
                            minimumFractionDigits: tooltipData.isCurrency
                              ? 2
                              : 0,
                            maximumFractionDigits: tooltipData.isCurrency
                              ? 2
                              : 0,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4 font-bold text-white pt-1 mt-1 border-t border-slate-700/50">
                        <span>Difference:</span>
                        <span
                          className={
                            !isPositive ? "text-rose-400" : "text-emerald-400"
                          }
                        >
                          {tooltipData.current - tooltipData.previous > 0
                            ? "+"
                            : ""}
                          {tooltipData.isCurrency ? "$" : ""}
                          {(
                            tooltipData.current - tooltipData.previous
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: tooltipData.isCurrency
                              ? 2
                              : 0,
                            maximumFractionDigits: tooltipData.isCurrency
                              ? 2
                              : 0,
                          })}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : description ? (
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <div className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors mt-0.5 opacity-0">
                    {/* Invisible trigger to keep height consistent if needed */}
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl max-w-xs text-xs p-3.5 rounded-xl font-medium"
                  side="bottom"
                  align="end"
                >
                  {label && (
                    <p className="text-slate-200 font-medium border-b border-slate-700/50 pb-2.5 mb-2.5 leading-relaxed">
                      {label}
                    </p>
                  )}
                  <p className="text-slate-300 border-b border-slate-700/50 pb-1.5 mb-1.5 leading-relaxed">
                    {dynamicExplanation}
                  </p>
                  {tooltipData ? (
                    <div className="space-y-1 mt-1">
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Current Period:</span>
                        <span>
                          {tooltipData.isCurrency ? "$" : ""}
                          {tooltipData.current?.toLocaleString(undefined, {
                            minimumFractionDigits: tooltipData.isCurrency
                              ? 2
                              : 0,
                            maximumFractionDigits: tooltipData.isCurrency
                              ? 2
                              : 0,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Previous Period:</span>
                        <span>
                          {tooltipData.isCurrency ? "$" : ""}
                          {tooltipData.previous?.toLocaleString(undefined, {
                            minimumFractionDigits: tooltipData.isCurrency
                              ? 2
                              : 0,
                            maximumFractionDigits: tooltipData.isCurrency
                              ? 2
                              : 0,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4 font-bold text-white pt-1 mt-1 border-t border-slate-700/50">
                        <span>Difference:</span>
                        <span
                          className={
                            !isPositive ? "text-rose-400" : "text-emerald-400"
                          }
                        >
                          {tooltipData.current - tooltipData.previous > 0
                            ? "+"
                            : ""}
                          {tooltipData.isCurrency ? "$" : ""}
                          {(
                            tooltipData.current - tooltipData.previous
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: tooltipData.isCurrency
                              ? 2
                              : 0,
                            maximumFractionDigits: tooltipData.isCurrency
                              ? 2
                              : 0,
                          })}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
        </div>
        <h3 className="text-[28px] font-extrabold text-slate-900 tracking-tight leading-none mt-1">
          {value}
        </h3>
      </div>
      {description && (
        <div className="mt-auto pt-2">
          <p className="text-[11px] text-slate-500 font-medium truncate">
            {description}
          </p>
        </div>
      )}
    </div>
  );
};

export default KpiCard;
