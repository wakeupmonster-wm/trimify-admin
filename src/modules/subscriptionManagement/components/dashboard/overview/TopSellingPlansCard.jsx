import React from "react";
import { Trophy } from "lucide-react";
import ChartCard from "./ChartCard";

export default function TopSellingPlansCard({ plans = [] }) {
  return (
    <ChartCard
      title="Top Selling Plans"
      subtitle="Ranked by units sold"
      icon={Trophy}
      isEmpty={!plans.length}
      emptyMessage="No plan sales recorded yet"
    >
      <div className="space-y-1.5 overflow-y-auto max-h-[280px] pr-1">
        {plans.map((plan, idx) => (
          <div
            key={plan.id}
            className="flex items-center justify-between gap-3 p-2.5 rounded-lg hover:bg-slate-100/70 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* <span className="h-7 w-7 shrink-0 rounded-full bg-brand-aqua/10 text-[#2A9DA3] text-[11px] font-black flex items-center justify-center"> */}
              <span className="h-7 w-7 shrink-0 rounded-full bg-[#007FC0]/10 text-[#007FC0] text-[11px] font-black flex items-center justify-center">
                #{idx + 1}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{plan.title}</p>
                <p className="text-[10px] text-slate-400 font-medium">{plan.total_sold} sold</p>
              </div>
            </div>
            <span className="text-xs font-black text-slate-900 shrink-0">
              ${Number(plan.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
