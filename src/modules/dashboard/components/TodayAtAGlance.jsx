import React from "react";
import { useNavigate } from "react-router";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { formatCompactNumber } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

const getTrendExplanation = (stat, trendValue, isTrendingUp) => {
  if (stat.tooltipData?.type === "contribution") {
    return "Revenue contribution breakdown";
  }

  if (!stat.tooltipData) {
    return `${isTrendingUp ? "Increase" : "Decrease"} compared to previous period`;
  }

  const { current, previous, isCurrency } = stat.tooltipData;
  const currStr = isCurrency
    ? `$${current?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : current?.toLocaleString();
  const prevStr = isCurrency
    ? `$${previous?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : previous?.toLocaleString();
  const action = isTrendingUp ? "increased" : "decreased";
  const label = stat.label;

  if (previous === 0 && current > 0) {
    return `${label} spiked to ${currStr} because there was 0 activity in the previous period.`;
  }
  if (current === 0 && previous > 0) {
    return `${label} dropped to zero from ${prevStr} in the previous period.`;
  }
  if (current === previous) {
    return `${label} remained exactly the same as the previous period (${currStr}).`;
  }

  return `${label} ${action} by ${trendValue.replace(/[+-]/g, "")} from ${prevStr} to ${currStr}.`;
};

export function TodayAtAGlance({
  data,
  periodLabel,
  selectedDate,
  summaryData,
}) {
  const navigate = useNavigate();
  if (!data && !summaryData) return null;

  let statsToRender = data?.stats || [];

  if (summaryData) {
    const s = summaryData;
    // Map new API data to the cards
    statsToRender = [
      {
        label: "Total Revenue",
        value: `$${(s.totalRevenue || 0).toLocaleString()}`,
        sub: periodLabel || "Overall",
        icon: "Sparkles",
        color: "emerald",
      },
      {
        label: "MRR",
        value: `$${(s.mrr || 0).toLocaleString()}`,
        sub: "Monthly Recurring Revenue",
        icon: "TrendingUp",
        color: "blue",
      },
      {
        label: "Total Users",
        value: s.totalUsers?.toLocaleString() || "0",
        sub: "Registered users",
        icon: "Users",
        color: "orange",
      },
      {
        label: "Active Users",
        value: s.activeUsers?.toLocaleString() || "0",
        sub: "Currently active",
        icon: "Activity",
        color: "cyan",
      },
      {
        label: "Premium Subs",
        value: s.premiumSubscribers?.toLocaleString() || "0",
        sub: "Conversion: " + (s.premiumConversionRate || 0) + "%",
        icon: "Star",
        color: "sky",
      },
      {
        label: "Programs",
        value: s.totalPrograms?.toLocaleString() || "0",
        sub: "Active programs",
        icon: "List",
        color: "indigo",
      },
      {
        label: "Sessions",
        value: s.totalFitzoneSessions?.toLocaleString() || "0",
        sub: "Fitzone sessions",
        icon: "Video",
        color: "rose",
      },
      {
        label: "Blogs",
        value: s.totalBlogs?.toLocaleString() || "0",
        sub: "Published blogs",
        icon: "FileText",
        color: "amber",
      },
      {
        label: "Sub-Admins",
        value: s.totalSubAdmins?.toLocaleString() || "0",
        sub: "Platform managers",
        icon: "Shield",
        color: "slate",
      },
      {
        label: "Transactions",
        value: s.totalTransactions?.toLocaleString() || "0",
        sub: `${s.successfulTransactions} successful`,
        icon: "CreditCard",
        color: "emerald",
      },
    ];
  }

  // Mock trend data logic since it's not fully in the dummy data yet
  return (
    <TooltipProvider>
      <div className="mb-2">
        <div className="mb-4 flex flex-col items-start gap-1">
          <h2 className="text-base font-bold text-slate-900">
            {data?.title || "Today at a glance"}
          </h2>
          <p className="text-[11px] font-medium text-slate-500 leading-none">
            Key insights that matter most right now.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.isArray(statsToRender) &&
            statsToRender.map((stat, idx) => {
              // Purely backend-driven data mapping
              const trendValue = stat.trend;
              const isPositive = stat.isPositive;
              const isTrendingUp = trendValue && !trendValue.startsWith("-");
              // const isZero = trendValue && parseFloat(trendValue) === 0;
              let isRed = !isPositive;

              // Use compact number formatting for raw numeric values
              const displayValue =
                !isNaN(stat.value) &&
                typeof stat.value !== "boolean" &&
                stat.value !== ""
                  ? formatCompactNumber(Number(stat.value))
                  : stat.value;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 transition-all duration-300 shadow-sm border border-slate-300/60 hover:border-app-primary2 hover:shadow-sm cursor-pointer group flex flex-col justify-between min-h-[128px]"
                  onClick={() => {
                    sessionStorage.clear();
                    navigate(stat.route, {
                      state: {
                        label: stat.label,
                        preset: selectedDate?.preset,
                        from: selectedDate?.from,
                        to: selectedDate?.to,
                      },
                    });
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-2 overflow-hidden">
                      <p className="text-xs font-semibold text-foreground/70 transition-colors">
                        {stat.label}
                      </p>
                      {trendValue ? (
                        <Tooltip delayDuration={200}>
                          <TooltipTrigger asChild>
                            <div
                              className={`flex items-center gap-1 font-bold text-[10px] rounded-full py-1 px-2 shrink-0 transition-transform ${
                                isRed
                                  ? "text-rose-600 bg-rose-50"
                                  : "text-emerald-600 bg-emerald-50"
                              }`}
                            >
                              {isTrendingUp ? (
                                <IconTrendingUp size={12} stroke={3} />
                              ) : (
                                <IconTrendingDown size={12} stroke={3} />
                              )}
                              <span>{trendValue}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl max-w-xs text-xs space-y-1.5 p-3 rounded-xl font-medium"
                            side="bottom"
                            align="end"
                          >
                            <p className="text-slate-300 border-b border-slate-700/50 pb-1.5 mb-1.5 leading-relaxed">
                              {getTrendExplanation(
                                stat,
                                trendValue,
                                isTrendingUp,
                              )}
                            </p>
                            {stat.tooltipData &&
                            stat.tooltipData.type === "contribution" ? (
                              <div className="space-y-1 mt-1">
                                <div className="flex justify-between gap-4">
                                  <span className="text-slate-400">
                                    Supercharge Revenue:
                                  </span>
                                  <span>
                                    $
                                    {stat.tooltipData.superChargeRev.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-slate-400">
                                    Total Revenue:
                                  </span>
                                  <span>
                                    ${stat.tooltipData.totalRev.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-4 font-bold text-white pt-1 mt-1 border-t border-slate-700/50">
                                  <span>Contribution:</span>
                                  <span>{stat.tooltipData.contribution}%</span>
                                </div>
                              </div>
                            ) : stat.tooltipData ? (
                              <div className="space-y-1 mt-1">
                                <div className="flex justify-between gap-4">
                                  <span className="text-slate-400">
                                    Current Period:
                                  </span>
                                  <span>
                                    {stat.tooltipData.isCurrency ? "$" : ""}
                                    {stat.tooltipData.current?.toLocaleString(
                                      undefined,
                                      {
                                        minimumFractionDigits: stat.tooltipData
                                          .isCurrency
                                          ? 2
                                          : 0,
                                        maximumFractionDigits: stat.tooltipData
                                          .isCurrency
                                          ? 2
                                          : 0,
                                      },
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-slate-400">
                                    Previous Period:
                                  </span>
                                  <span>
                                    {stat.tooltipData.isCurrency ? "$" : ""}
                                    {stat.tooltipData.previous?.toLocaleString(
                                      undefined,
                                      {
                                        minimumFractionDigits: stat.tooltipData
                                          .isCurrency
                                          ? 2
                                          : 0,
                                        maximumFractionDigits: stat.tooltipData
                                          .isCurrency
                                          ? 2
                                          : 0,
                                      },
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-4 font-bold text-white pt-1 mt-1 border-t border-slate-700/50">
                                  <span>Difference:</span>
                                  <span
                                    className={
                                      isRed
                                        ? "text-rose-400"
                                        : "text-emerald-400"
                                    }
                                  >
                                    {stat.tooltipData.current -
                                      stat.tooltipData.previous >
                                    0
                                      ? "+"
                                      : ""}
                                    {stat.tooltipData.isCurrency ? "$" : ""}
                                    {(
                                      stat.tooltipData.current -
                                      stat.tooltipData.previous
                                    ).toLocaleString(undefined, {
                                      minimumFractionDigits: stat.tooltipData
                                        .isCurrency
                                        ? 2
                                        : 0,
                                      maximumFractionDigits: stat.tooltipData
                                        .isCurrency
                                        ? 2
                                        : 0,
                                    })}
                                  </span>
                                </div>
                              </div>
                            ) : null}
                          </TooltipContent>
                        </Tooltip>
                      ) : null}
                    </div>
                    <h3 className="text-[28px] font-extrabold text-slate-900 tracking-tight leading-none mt-1">
                      {displayValue}
                    </h3>
                  </div>

                  <div>
                    <p className="text-[11px] text-secondary-foreground font-medium truncate">
                      {stat.periodLabel ||
                        (() => {
                          if (!periodLabel)
                            return "Compared to previous 30 days";
                          const lowerLabel = periodLabel.toLowerCase();
                          if (lowerLabel === "today")
                            return "Compared to yesterday";
                          if (lowerLabel === "yesterday")
                            return "Compared to previous day";
                          if (
                            lowerLabel.includes("days") ||
                            lowerLabel.includes("day")
                          )
                            return `Compared to previous ${periodLabel.toLowerCase()}`;
                          if (lowerLabel.includes("-"))
                            return "Compared to equivalent period";
                          return `Compared to previous period`;
                        })()}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </TooltipProvider>
  );
}
