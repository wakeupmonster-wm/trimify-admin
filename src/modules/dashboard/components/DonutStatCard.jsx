import React from "react";
import { PieChart, Pie, Tooltip, Label, Cell } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import DashboardHead from "@/components/shared/dashboard.head";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="bg-white px-3 py-2 rounded-lg shadow-xl border border-slate-100 flex items-center gap-2 z-50">
      <div
        className="w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: item.fill }}
      />
      <div className="flex items-center gap-3">
        <span className="text-slate-500 text-xs font-medium">{item.name}</span>
        <span className="text-slate-900 text-xs font-bold">
          {item.value.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

/**
 * Reusable donut/pie widget — matches the RevenueBreakdown card shell so
 * plan-type, transaction-status, user-goal, gender & diet-preference charts
 * all read as one visual system. `scrollableLegend` caps the legend height
 * for series with many entries (e.g. user goals).
 */
const DonutStatCard = ({
  title,
  subtitle,
  Icon,
  iconColor = "text-slate-700",
  iconBg = "bg-slate-50",
  tooltipText,
  data = [],
  centerLabel = "TOTAL",
  footnote,
}) => {
  const hasData = data.some((d) => d.value > 0);
  const total = data.reduce((sum, d) => sum + (d.value || 0), 0);

  const chartConfig = Object.fromEntries(
    data.map((d) => [
      d.label.toLowerCase().replace(/\s+/g, "_"),
      { label: d.label, color: d.color },
    ]),
  );

  const chartData = hasData
    ? data.map((d) => ({ name: d.label, value: d.value, fill: d.color }))
    : [{ name: "No Data", value: 1, fill: "#f1f5f9" }];

  return (
    <div className="bg-white border border-slate-300/60 hover:border-blue-200 transition-all duration-300 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
      <div className="pt-5 pb-4 px-6 border-b border-slate-300/60">
        <DashboardHead
          title={title}
          subtitle={subtitle}
          Icon={Icon}
          iconColor={iconColor}
          iconBg={iconBg}
          tooltipText={tooltipText || footnote}
        />
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-8 items-center px-6 py-8">
        <div className="relative w-full aspect-square max-w-[200px] mx-auto flex items-center justify-center">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <PieChart>
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={54}
                outerRadius={85}
                stroke="none"
                paddingAngle={hasData ? 1 : 0}
                animationDuration={800}
              >
                {chartData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy - 4}
                            className="fill-slate-900 text-xl font-black"
                          >
                            {hasData ? total.toLocaleString() : "0"}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy + 16}
                            className="fill-slate-400 text-[9px] font-bold tracking-[0.1em] uppercase"
                          >
                            {centerLabel}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>

        <div className="w-full my-auto flex-1 h-max min-h-0 overflow-y-auto pr-1">
          {hasData ? (
            <div className="divide-y divide-slate-100">
              {data.map((item, idx) => {
                const pct =
                  total > 0 ? Math.round((item.value / total) * 100) : 0;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs font-medium text-slate-700 truncate">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs font-bold text-slate-900 tabular-nums">
                        {item.value.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 tabular-nums">
                        ({pct}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[80px] text-xs text-slate-400 font-medium border-2 border-dashed border-slate-100 rounded-xl">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonutStatCard;
