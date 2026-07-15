import React from "react";
import { format } from "date-fns";
import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "./ChartCard";

const AQUA = "#46C7CD";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="bg-slate-900 text-slate-100 rounded-lg px-3 py-2 text-xs shadow-xl space-y-1">
      <p className="font-bold text-slate-300">{label}</p>
      <p>
        Revenue: <span className="font-bold text-white">${point.revenue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
      </p>
      <p className="text-slate-400">{point.transactions} transaction{point.transactions === 1 ? "" : "s"}</p>
    </div>
  );
}

export default function RevenueTrendChart({ data = [] }) {
  const chartData = data.map((d) => ({
    ...d,
    label: (() => {
      try {
        return format(new Date(d.date), "MMM dd");
      } catch {
        return d.date;
      }
    })(),
  }));
  const isEmpty = chartData.every((d) => (d.revenue || 0) === 0);

  return (
    <ChartCard
      title="Revenue Trend"
      subtitle="Successful transactions over the selected range"
      icon={TrendingUp}
      isEmpty={isEmpty}
      emptyMessage="No revenue recorded for this range"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueTrendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={AQUA} stopOpacity={0.35} />
              <stop offset="100%" stopColor={AQUA} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#E2E8F0" strokeDasharray="4 4" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#94A3B8" }}
            axisLine={{ stroke: "#E2E8F0" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={AQUA}
            strokeWidth={2}
            fill="url(#revenueTrendFill)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
