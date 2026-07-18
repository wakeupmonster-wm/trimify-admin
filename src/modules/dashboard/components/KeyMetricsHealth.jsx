import React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Users, Currency } from "lucide-react";
import { IconGenderMale, IconGenderFemale } from "@tabler/icons-react";
import DashboardHead from "@/components/shared/dashboard.head";
import { TbSwipe } from "react-icons/tb";
import { LuUsersRound } from "react-icons/lu";

const Sparkline = ({ data, color, isPositive }) => {
  const chartData = Array.isArray(data)
    ? data.map((val, i) => ({ value: val, id: i }))
    : [];
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="h-[50px] w-[90px] mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={isPositive ? "#2dd4bf" : "#f43f5e"}
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor={isPositive ? "#2dd4bf" : "#f43f5e"}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={isPositive ? "#2dd4bf" : "#f43f5e"}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const GenderRatioBar = ({ ratio, maleCount, femaleCount, value }) => {
  const femaleRatio = 100 - ratio;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Progress Bar with Labels Inside */}
      <div className="relative h-7 w-full bg-slate-100 rounded-md flex overflow-hidden shadow-inner">
        {/* Segments */}
        {ratio > 0 && (
          <div
            className="h-full bg-[#44cacfff] transition-all duration-1000 ease-out"
            style={{ width: `${ratio}%` }}
          />
        )}
        {femaleRatio > 0 && (
          <div
            className="h-full bg-[#44cacfff]/30 transition-all duration-1000 ease-out"
            style={{ width: `${femaleRatio}%` }}
          />
        )}

        {/* Absolute Labels Overlay */}
        <div className="absolute inset-0 flex justify-between items-center px-3 pointer-events-none">
          {ratio > 0 ? (
            <span
              className={`text-[10px] font-black whitespace-nowrap ${
                ratio > 15 ? "text-white drop-shadow-sm" : "text-brand-blue"
              }`}
            >
              {ratio}%
            </span>
          ) : (
            <div />
          )}
          {femaleRatio > 0 ? (
            <span className="text-[10px] font-black whitespace-nowrap text-brand-blue">
              {femaleRatio}%
            </span>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* Detailed Legends */}
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-1">
          <IconGenderMale className="w-6 h-6 text-[#258a8eff]" stroke={2} />
          <div className="flex flex-col">
            <span className="text-[11px] font-black text-[#0F172A]">
              {/* {ratio}%  */}
              Male
            </span>
            <span className="text-[10px] font-medium text-slate-400 italic">
              ({maleCount || 0} signups)
            </span>
          </div>
        </div>

        <div className="flex items-start gap-1">
          <IconGenderFemale className="w-6 h-6 text-[#b6f7f9]" stroke={2} />
          <div className="flex flex-col items-start">
            <span className="text-[11px] font-black text-[#0F172A]">
              {/* {femaleRatio}%  */}
              Female
            </span>
            <span className="text-[10px] font-medium text-slate-400 italic">
              ({femaleCount || 0} signups)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MatchLiquidityCard = ({ metric }) => {
  const parsedValue = parseFloat(metric.value);
  const value = isNaN(parsedValue) ? 1.4 : parsedValue;
  const remaining = 100 - value;

  const chartData = [
    { name: "Matched", value: value, color: "#0D9488" },
    { name: "Remaining", value: remaining, color: "#CCF2F4" },
  ];

  // Parse match/swipe counts from sub: "136 matches / 11,418 swipes"
  const parts = metric.sub.split("/");
  const matchesStr = parts[0]?.trim() || "0 matches";
  const swipesStr = parts[1]?.trim() || "0 swipes";

  const matchesCount = parseInt(matchesStr.replace(/[^\d]/g, "")) || 0;
  const totalSwipesCount = parseInt(swipesStr.replace(/[^\d]/g, "")) || 0;
  const unmatchedSwipesCount = Math.max(0, totalSwipesCount - matchesCount);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-start gap-3 px-5 pb-4 border-b border-slate-300/60">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200/50">
          <TbSwipe className="h-5 w-5 text-slate-600" />
        </div>
        <div className="flex flex-col gap-0.5 items-start text-left">
          <h3 className="text-sm font-black text-[#0F172A]">Match Liquidity</h3>
          <p className="text-xs font-medium text-slate-500">
            {metric.subtitle ||
              "Quick overview of platform health for last 24 hours"}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-4 px-4">
        {/* Doughnut Chart */}
        <div className="relative w-36 h-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
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
              {metric.value}
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
                <div className="w-2 h-2 rounded-full bg-[#0D9488]" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#0F172A]">
                    Matched
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    {matchesStr}
                  </span>
                </div>
              </div>
              <span className="text-xs font-black text-[#0D9488]">
                {metric.value}
              </span>
            </div>

            <div className="h-px bg-slate-100 w-full" />

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#CCF2F4]" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#0F172A]">
                    Unmatched
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    {unmatchedSwipesCount.toLocaleString()} swipes
                  </span>
                </div>
              </div>
              <span className="text-xs font-black text-[#0D9488]">
                {remaining.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="bg-[#F0FDF4] rounded-xl p-2 flex flex-col items-center justify-center gap-1 border border-[#DCFCE7]">
            <div className="flex items-center gap-2 text-[#16A34A]">
              <TrendingUp size={16} className="stroke-[2]" />
              <span className="text-base font-black">{metric.trend}</span>
            </div>
            <p className="text-[9px] font-bold text-slate-500">
              vs previous 24 hours
            </p>
          </div>
        </div>
      </div>

      {/* <div className="bg-slate-50/80 rounded-xl px-4 flex items-center justify-center gap-2.5">
        <Users size={14} className="text-slate-400" />
        <span className="text-[11px] font-bold text-slate-600">
          {matchesStr} / {totalSwipes} swipes
        </span>
      </div> */}
    </div>
  );
};

export function KeyMetricsHealth({ data }) {
  if (!data) return null;

  return (
    <div className="mb-1">
      <div className="grid grid-cols-1 gap-6">
        {Array.isArray(data.metrics) &&
          data.metrics.map((metric, idx) => {
            if (metric.label === "Match Liquidity") {
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-300/60 rounded-xl py-5 shadow-sm hover:border-brand-blue transition-all duration-300"
                >
                  <MatchLiquidityCard metric={metric} />
                </div>
              );
            }

            return (
              <div
                key={idx}
                className="bg-white border border-slate-300/60 rounded-xl py-5 hover:border-brand-blue transition-all duration-300 shadow-sm"
              >
                <div className="flex items-start gap-2 pb-4 px-5 border-b border-slate-300/60">
                  <DashboardHead
                    title={metric.label}
                    subtitle={metric.subtitle}
                    Icon={metric.Icon || LuUsersRound}
                    iconColor="text-slate-600"
                    iconBg="bg-slate-100/50"
                  />
                </div>

                <div className="relative flex flex-col justify-between items-start mx-5 mt-3">
                  <div className="w-full flex flex-col justify-between items-start space-y-1">
                    <h3 className="text-xl font-bold text-foreground leading-none">
                      {metric.value}
                    </h3>
                    <p className="text-[11px] font-medium text-muted-foreground">
                      {metric.sub}
                    </p>
                  </div>

                  <div className="w-full flex items-start justify-between gap-2">
                    {!metric.isRatio ? (
                      <Sparkline
                        data={metric.chartData}
                        isPositive={metric.isPositive}
                      />
                    ) : (
                      <div className="w-full mt-2">
                        <GenderRatioBar
                          ratio={metric.ratioValue}
                          maleCount={metric.maleCount}
                          femaleCount={metric.femaleCount}
                          value={metric.value}
                        />
                      </div>
                    )}

                    {metric.trend && (
                      <div
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-[6px] text-[12px] font-bold ${
                          metric.isPositive
                            ? "bg-[#f0fdf4] text-[#16a34a]"
                            : "bg-[#fef2f2] text-[#dc2626]"
                        }`}
                      >
                        {metric.isPositive ? (
                          <TrendingUp size={14} />
                        ) : (
                          <TrendingDown size={14} />
                        )}
                        {metric.trend}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
