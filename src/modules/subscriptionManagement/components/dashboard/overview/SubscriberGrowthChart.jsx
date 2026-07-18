import React from "react";
import { format } from "date-fns";
import { Users } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "./ChartCard";

// const AQUA = "#46C7CD";
const AQUA = "#007FC0"; // primary2

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-slate-100 rounded-lg px-3 py-2 text-xs shadow-xl space-y-1">
      <p className="font-bold text-slate-300">{label}</p>
      <p>
        New subscribers: <span className="font-bold text-white">{payload[0].value}</span>
      </p>
    </div>
  );
}

export default function SubscriberGrowthChart({ data = [] }) {
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
  const isEmpty = chartData.every((d) => (d.new_subscribers || 0) === 0);

  return (
    <ChartCard
      title="Subscriber Growth"
      subtitle="First-time subscribers over the selected range"
      icon={Users}
      isEmpty={isEmpty}
      emptyMessage="No new subscribers in this range"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            allowDecimals={false}
            width={30}
          />
          {/* <Tooltip content={<CustomTooltip />} cursor={{ fill: "#46C7CD", fillOpacity: 0.08 }} /> */}
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#007FC0", fillOpacity: 0.08 }} />
          <Bar dataKey="new_subscribers" fill={AQUA} radius={[4, 4, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
