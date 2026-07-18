import React from "react";
import { PieChart as PieIcon } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import ChartCard from "./ChartCard";

// Fixed categorical order — never cycled/regenerated per-render.
// const COLORS = ["#46C7CD", "#818CF8", "#F472B6", "#FB923C", "#A78BFA"];
const COLORS = [
  "#007FC0", // primary2
  "#15B097", // cardGreen
  "#DC6B1B", // cardOrange
  "#EDA145", // cardYellow
  "#5AA0C1", // primary3
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { title, total, percentage } = payload[0].payload;
  return (
    <div className="bg-slate-900 text-slate-100 rounded-lg px-3 py-2 text-xs shadow-xl space-y-1">
      <p className="font-bold text-slate-300">{title}</p>
      <p>
        <span className="font-bold text-white">{total}</span> subscribers ({percentage}%)
      </p>
    </div>
  );
}

function renderLegend({ payload }) {
  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2">
      {payload.map((entry) => (
        <li key={entry.value} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          {entry.value}
        </li>
      ))}
    </ul>
  );
}

export default function PlanDistributionChart({ data = [] }) {
  const isEmpty = !data.length || data.every((d) => (d.total || 0) === 0);

  return (
    <ChartCard
      title="Plan Distribution"
      subtitle="Share of subscribers per plan"
      icon={PieIcon}
      isEmpty={isEmpty}
      emptyMessage="No active plan assignments yet"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="title"
            cx="50%"
            cy="45%"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={2}
            stroke="#fff"
            strokeWidth={2}
          >
            {data.map((entry, idx) => (
              <Cell key={entry.id ?? idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
