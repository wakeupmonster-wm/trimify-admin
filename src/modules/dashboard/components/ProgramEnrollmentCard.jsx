import React from "react";
import DashboardHead from "@/components/shared/dashboard.head";
import { cn } from "@/lib/utils";

/**
 * ProgramEnrollmentCard — replaces the generic vertical bar chart for
 * "Program Enrollment Split" with a clean horizontal bar-list that is
 * easier to scan and looks polished on the dashboard.
 *
 * Data shape: [{ title: string, total: number }, …]
 */
const BAR_COLORS = [
  "#007FC0", // primary blue
  "#0ea5e9", // sky-500
  "#6366f1", // indigo-500
  "#8b5cf6", // violet-500
  "#0891b2", // cyan-600
  "#2563eb", // blue-600
  "#7c3aed", // violet-600
  "#0d9488", // teal-600
  "#4f46e5", // indigo-600
  "#06b6d4", // cyan-500
];

const ProgramEnrollmentCard = ({
  title = "Program Enrollment Split",
  subtitle,
  Icon,
  iconColor = "text-slate-600",
  iconBg = "bg-slate-100/50",
  tooltipText,
  data = [],
}) => {
  // Sort descending and take top 5
  const sorted = [...data]
    .sort((a, b) => (b.total ?? 0) - (a.total ?? 0))
    .slice(0, 5);

  const maxVal = Math.max(...sorted.map((d) => d.total ?? 0), 1);

  return (
    <div className="bg-white border border-slate-300/60 hover:border-blue-200 transition-all duration-300 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
      <div className="pt-5 pb-4 px-6 border-b border-slate-300/60">
        <DashboardHead
          title={title}
          subtitle={subtitle}
          Icon={Icon}
          iconColor={iconColor}
          iconBg={iconBg}
          tooltipText={tooltipText}
        />
      </div>

      <div className="flex-1 flex flex-col p-5 pb-6">
        {sorted.length > 0 ? (
          <div className="flex flex-col gap-3.5">
            {sorted.map((program, idx) => {
              const pct = maxVal > 0 ? ((program.total ?? 0) / maxVal) * 100 : 0;
              const color = BAR_COLORS[idx % BAR_COLORS.length];

              return (
                <div key={program.title || idx} className="group">
                  {/* Row: Rank + Name + Count */}
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span
                        className="flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-bold text-white shrink-0"
                        style={{ backgroundColor: color }}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-[13px] font-semibold text-slate-700 truncate">
                        {program.title}
                      </span>
                    </div>
                    <span className="text-[13px] font-bold text-slate-900 tabular-nums shrink-0">
                      {(program.total ?? 0).toLocaleString()}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${Math.max(pct, 2)}%`,
                        backgroundColor: color,
                        opacity: 0.85,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full flex-1 min-h-[240px] flex items-center justify-center text-xs text-slate-400 font-medium">
            No data for this period.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramEnrollmentCard;
