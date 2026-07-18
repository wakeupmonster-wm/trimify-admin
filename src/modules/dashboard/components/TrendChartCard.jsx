import React from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import DashboardHead from "@/components/shared/dashboard.head";
import { Info } from "lucide-react";

/**
 * Reusable trend widget — one series renders as a plain line/bar (no legend
 * needed, the title already names it); two or more always get a legend, per
 * the dashboard's chart convention. `series[].type` is "line" or "bar";
 * mixing both (e.g. bar for volume + line for a rate) is supported.
 */
const TrendChartCard = ({
  title,
  subtitle,
  Icon,
  iconColor = "text-slate-700",
  iconBg = "bg-slate-50",
  tooltipText,
  data = [],
  xKey,
  series = [],
  note,
  height = "h-[240px]",
}) => {
  const chartConfig = Object.fromEntries(
    series.map((s) => [s.key, { label: s.label, color: s.color }]),
  );
  const hasData = data.length > 0;

  return (
    <div className="bg-white border border-slate-200 hover:border-blue-200 transition-all duration-300 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
      <div className="pt-5 pb-4 px-6 border-b border-slate-200">
        <DashboardHead
          title={title}
          subtitle={subtitle}
          Icon={Icon}
          iconColor={iconColor}
          iconBg={iconBg}
          tooltipText={tooltipText}
        />
      </div>

      <div className="flex-1 flex flex-col px-4 py-4">
        {hasData ? (
          <ChartContainer config={chartConfig} className={`w-full ${height}`}>
            <ComposedChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="hsl(215, 20%, 92%)" />
              <XAxis
                dataKey={xKey}
                tick={{ fill: "hsl(215, 16%, 55%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="number"
                domain={[0, "auto"]}
                allowDecimals={false}
                tick={{ fill: "hsl(215, 16%, 55%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <ChartTooltip content={<ChartTooltipContent className="bg-white" />} cursor={{ fill: "hsl(215, 20%, 96%)" }} />
              {series.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
              {series.map((s) =>
                s.type === "bar" ? (
                  <Bar key={s.key} dataKey={s.key} fill={s.color} radius={[4, 4, 0, 0]} maxBarSize={36} />
                ) : (
                  <Line
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    stroke={s.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ),
              )}
            </ComposedChart>
          </ChartContainer>
        ) : (
          <div className={`w-full ${height} flex items-center justify-center text-xs text-slate-400 font-medium`}>
            No data for this period.
          </div>
        )}

        {note && (
          <div className="mt-3 mx-2 flex items-start gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-foreground/80 text-[11px] font-medium leading-relaxed">
            <Info size={12} className="text-brand-blue mt-0.5 shrink-0" />
            {note}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendChartCard;
