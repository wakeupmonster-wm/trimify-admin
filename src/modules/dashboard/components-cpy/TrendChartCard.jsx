import React from "react";
import {
  ComposedChart,
  Area,
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const color = data.color || data.payload?.fill || "#15b097";
    return (
      <div
        className="relative flex items-center justify-center px-2 py-1 text-white text-xs font-bold rounded shadow-sm"
        style={{ backgroundColor: color }}
      >
        <span>{data.value}</span>
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent"
          style={{ borderTopColor: color }}
        />
      </div>
    );
  }
  return null;
};

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
    <Card className="rounded-xl shadow-sm bg-white gap-0 border border-slate-300/60 hover:border-blue-200 transition-all duration-300 w-full h-full flex flex-col py-5">
      <CardHeader className="px-0 pb-0">
        <div className="w-full flex items-center justify-between gap-2 pb-4 px-5 border-b border-slate-300/60">
          <DashboardHead
            title={title}
            subtitle={subtitle}
            Icon={Icon}
            iconColor={iconColor}
            iconBg={iconBg}
            tooltipText={tooltipText}
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col items-center gap-4 pt-2">
        {hasData ? (
          <ChartContainer config={chartConfig} className={`w-full ${height}`}>
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 12, left: -20, bottom: 0 }}
            >
              <defs>
                {series.map((s) => (
                  <linearGradient
                    key={`fill-${s.key}`}
                    id={`fill-${s.key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
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
              <ChartTooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "hsl(215, 20%, 92%)",
                  strokeWidth: 1,
                  strokeDasharray: "3 3",
                  fill: "transparent",
                }}
              />
              {series.length > 1 && (
                <ChartLegend content={<ChartLegendContent />} />
              )}
              {series.map((s) =>
                s.type === "bar" ? (
                  <Bar
                    key={s.key}
                    dataKey={s.key}
                    fill={s.color}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={36}
                  />
                ) : (
                  <Area
                    key={s.key}
                    type="linear"
                    dataKey={s.key}
                    stroke={s.color}
                    strokeWidth={2}
                    fill={`url(#fill-${s.key})`}
                    dot={{ r: 3, fill: s.color, strokeWidth: 0 }}
                    activeDot={{
                      r: 5,
                      fill: "#fff",
                      stroke: s.color,
                      strokeWidth: 2,
                    }}
                  />
                ),
              )}
            </ComposedChart>
          </ChartContainer>
        ) : (
          <div
            className={`w-full ${height} flex items-center justify-center text-xs text-slate-400 font-medium`}
          >
            No data for this period.
          </div>
        )}

        {note && (
          <div className="mt-1 flex items-start gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-foreground/80 text-[11px] font-medium leading-relaxed">
            <Info size={12} className="text-brand-blue mt-0.5 shrink-0" />
            {note}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendChartCard;
