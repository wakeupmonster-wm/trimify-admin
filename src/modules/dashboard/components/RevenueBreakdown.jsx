import React from "react";
import { PieChart, Pie, Tooltip, Label } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Info } from "lucide-react";
import DashboardHead from "@/components/shared/dashboard.head";
import { PiCurrencyCircleDollarBold } from "react-icons/pi";

export function RevenueBreakdown({ data, revenueChartsData }) {
  if (!data && !revenueChartsData) return null;

  let categories = Array.isArray(data?.categories) ? data.categories : [];
  let insightText = data?.insight || "Revenue by plan distribution.";
  let totalValue = data?.total || "0";

  if (revenueChartsData?.planWiseSubscribers?.length > 0) {
    const plans = revenueChartsData.planWiseSubscribers;
    const sum = plans.reduce((acc, curr) => acc + curr.total, 0);
    const colors = [
      "hsl(182 59% 75%)",
      "hsl(182 59% 54%)",
      "hsl(182 59% 35%)",
      "hsl(215 50% 50%)",
    ];
    totalValue = String(sum);
    insightText = "Revenue by plan distribution.";
    categories = plans.map((p, i) => {
      const percentage = sum > 0 ? Math.round((p.total / sum) * 100) : 0;
      return {
        label: p.title || "Plan",
        value: p.total,
        displayValue: String(p.total),
        percentage,
        color: colors[i % colors.length],
      };
    });
  }

  const hasData = categories && categories.some((c) => c.value > 0);

  const chartConfig = {
    revenue: {
      label: "Revenue",
    },
    ...Object.fromEntries(
      categories.map((c, i) => [
        c.label.toLowerCase().replace(/\s+/g, "_"),
        { label: c.label, color: c.color },
      ]),
    ),
  };

  const chartData = hasData
    ? categories.map((c) => ({
        name: c.label,
        value: c.value,
        fill: c.color,
      }))
    : [{ name: "No Data", value: 1, fill: "#f1f5f9" }];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length && hasData) {
      const data = payload[0].payload;
      return (
        <div className="bg-white px-3 py-2 rounded-lg shadow-xl border border-slate-100 flex items-center gap-2 z-50">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: data.fill }}
          />
          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-xs font-medium">
              {data.name}
            </span>
            <span className="text-slate-900 text-xs font-bold">
              {data.value.toLocaleString()}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-300/60 hover:border-blue-200 transition-all duration-300 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="pt-5 pb-4 px-6 border-b border-slate-300/60">
        <DashboardHead
          title="Revenue Breakdown"
          subtitle={data?.subtitle || "Last 30 Days revenue by source"}
          Icon={PiCurrencyCircleDollarBold}
          iconColor="text-slate-700"
          iconBg="bg-slate-50"
        />
      </div>

      <div className="flex-1 flex flex-col px-6 py-4">
        {/* Chart Section */}
        <div className="relative w-full aspect-square max-w-[240px] 3xl:max-w-[260px] mx-auto flex items-center justify-center">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <PieChart>
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={95}
                stroke="none"
                paddingAngle={1}
                animationDuration={800}
              >
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
                            y={viewBox.cy - 5}
                            className="fill-slate-900 text-2xl font-black"
                          >
                            {hasData ? totalValue : "$0"}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy + 18}
                            className="fill-slate-400 text-[10px] font-bold tracking-[0.1em] uppercase"
                          >
                            TOTAL
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

        <div className="flex-1 w-full space-y-6">
          {categories.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 mb-0.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-bold text-slate-800 tracking-tight">
                  {item.label}
                </span>
              </div>

              {/* Middle Row: Value (Left) + Percentage (Right) */}
              <div className="flex items-end justify-between">
                <span className="text-xs font-bold text-slate-900 leading-none">
                  {item.displayValue}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {item.percentage}%
                </span>
              </div>

              {/* Bottom Row: Progress Bar */}
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-in-out"
                  style={{
                    backgroundColor: item.color,
                    width: `${item.percentage}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Insight Box */}
        <div className="mt-8 lg:mt-1 flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-foreground/80 text-xs font-medium">
          <div className="w-5 h-5 rounded-full flex items-center justify-center">
            <Info size={12} className="text-app-primary2" />
          </div>
          {insightText}
        </div>
      </div>
    </div>
  );
}
