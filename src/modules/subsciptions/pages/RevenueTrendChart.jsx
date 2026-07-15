import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconChartBarOff } from "@tabler/icons-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-[12px] p-[12px_16px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06)] font-['Plus_Jakarta_Sans'] min-w-[160px]">
        <p className="text-[12px] font-bold text-slate-800 mb-2 capitalize">
          {label}
        </p>
        <div className="space-y-1.5">
          {payload.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-6 text-[12px]"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.fill || item.color }}
                />
                <span className="text-slate-600 font-medium">{item.name}</span>
              </div>
              <span className="text-slate-900 font-extrabold">
                ${item.value?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function RevenueTrendChart({
  revenueTrendChartData,
  chartType,
  setChartType,
  activeSubFilters,
  setActiveSubFilters,
  isRevenueTrendEmpty,
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[14px] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-[440px] flex flex-col">
      <div className="p-[18px_22px] border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-[10px]">
          <div className="w-[34px] h-[34px] rounded-[7px] flex items-center justify-center bg-[#F1F5F9] text-[#475569]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <div>
            <div className="font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-[#1F2937]">
              Revenue Trend
            </div>
            <div className="w-max text-[11.5px] text-[#9CA3AF] mt-[1px] flex items-center gap-1.5">
              Subscription vs consumable revenue
            </div>
          </div>
        </div>

        {/* Dynamic Checkboxes for Sub-filters */}
        {chartType === "subscription" && (
          <div className="flex flex-wrap items-center gap-3 mt-3 sm:mt-0">
            <label className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-700 cursor-pointer hover:text-indigo-600 transition-colors">
              <input
                type="checkbox"
                className="rounded text-indigo-500 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer border-slate-300"
                checked={activeSubFilters.includes("subscription_1_month")}
                onChange={(e) => {
                  if (e.target.checked)
                    setActiveSubFilters((prev) => [
                      ...prev,
                      "subscription_1_month",
                    ]);
                  else
                    setActiveSubFilters((prev) =>
                      prev.filter((f) => f !== "subscription_1_month"),
                    );
                }}
              />
              1 Month Sub
            </label>
            <label className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-700 cursor-pointer hover:text-indigo-600 transition-colors">
              <input
                type="checkbox"
                className="rounded text-indigo-600 focus:ring-indigo-600 w-3.5 h-3.5 cursor-pointer border-slate-300"
                checked={activeSubFilters.includes("subscription_3_month")}
                onChange={(e) => {
                  if (e.target.checked)
                    setActiveSubFilters((prev) => [
                      ...prev,
                      "subscription_3_month",
                    ]);
                  else
                    setActiveSubFilters((prev) =>
                      prev.filter((f) => f !== "subscription_3_month"),
                    );
                }}
              />
              3 Month Sub
            </label>
          </div>
        )}

        {chartType === "consumable" && (
          <div className="flex flex-wrap items-center gap-3 mt-3 sm:mt-0">
            <label className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-700 cursor-pointer hover:text-amber-500 transition-colors">
              <input
                type="checkbox"
                className="rounded text-amber-400 focus:ring-amber-400 w-3.5 h-3.5 cursor-pointer border-slate-300"
                checked={activeSubFilters.includes("consumable_super_keen")}
                onChange={(e) => {
                  if (e.target.checked)
                    setActiveSubFilters((prev) => [
                      ...prev,
                      "consumable_super_keen",
                    ]);
                  else
                    setActiveSubFilters((prev) =>
                      prev.filter((f) => f !== "consumable_super_keen"),
                    );
                }}
              />
              Super Keen
            </label>
            <label className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-700 cursor-pointer hover:text-amber-600 transition-colors">
              <input
                type="checkbox"
                className="rounded text-amber-500 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer border-slate-300"
                checked={activeSubFilters.includes("consumable_boost")}
                onChange={(e) => {
                  if (e.target.checked)
                    setActiveSubFilters((prev) => [
                      ...prev,
                      "consumable_boost",
                    ]);
                  else
                    setActiveSubFilters((prev) =>
                      prev.filter((f) => f !== "consumable_boost"),
                    );
                }}
              />
              Super Charge
            </label>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="h-9 rounded-lg bg-white hover:bg-brand-hoverBlue border border-slate-300 hover:border-none text-[10px] sm:text-[11px] text-slate-800 hover:text-white font-bold hover:font-semibold w-full sm:w-[140px]">
              <SelectValue placeholder="Revenue Type" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-xl">
              <SelectItem
                value="all"
                className="text-xs rounded-xl cursor-pointer"
              >
                All Revenue
              </SelectItem>
              <SelectItem
                value="subscription"
                className="text-xs rounded-xl cursor-pointer"
              >
                All Subscriptions
              </SelectItem>
              <SelectItem
                value="consumable"
                className="text-xs rounded-xl cursor-pointer"
              >
                All Consumables
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 p-5 pr-8 min-h-0">
        {isRevenueTrendEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-[#9CA3AF]">
            <IconChartBarOff className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs font-bold text-center">
              No revenue data available
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={revenueTrendChartData}
              barGap={8}
              barCategoryGap="20%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: "#94a3b8",
                  fontWeight: 600,
                }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: "#94a3b8",
                  fontWeight: 600,
                }}
                width={40}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#f8fafc", radius: 8 }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  fontSize: "10px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#64748b",
                  paddingBottom: "12px",
                }}
              />
              {chartType === "all" && (
                <Bar
                  dataKey="total"
                  fill="#46C7CD"
                  radius={[4, 4, 0, 0]}
                  name="Total Revenue"
                  maxBarSize={40}
                />
              )}
              {chartType === "subscription" &&
                activeSubFilters.length === 0 && (
                  <Bar
                    dataKey="subscription"
                    fill="#4F46E5"
                    radius={[4, 4, 0, 0]}
                    name="Subscriptions"
                    maxBarSize={40}
                  />
                )}
              {chartType === "subscription" &&
                activeSubFilters.includes("subscription_1_month") && (
                  <Bar
                    dataKey="subscription_1_month"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    name="1 Month Sub"
                    maxBarSize={40}
                  />
                )}
              {chartType === "subscription" &&
                activeSubFilters.includes("subscription_3_month") && (
                  <Bar
                    dataKey="subscription_3_month"
                    fill="#ec4899"
                    radius={[4, 4, 0, 0]}
                    name="3 Month Sub"
                    maxBarSize={40}
                  />
                )}
              {chartType === "consumable" && activeSubFilters.length === 0 && (
                <Bar
                  dataKey="consumable"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  name="Consumables"
                  maxBarSize={40}
                />
              )}
              {chartType === "consumable" &&
                activeSubFilters.includes("consumable_super_keen") && (
                  <Bar
                    dataKey="consumable_super_keen"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                    name="Super Keen"
                    maxBarSize={40}
                  />
                )}
              {chartType === "consumable" &&
                activeSubFilters.includes("consumable_boost") && (
                  <Bar
                    dataKey="consumable_boost"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name="Super Charge"
                    maxBarSize={40}
                  />
                )}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
