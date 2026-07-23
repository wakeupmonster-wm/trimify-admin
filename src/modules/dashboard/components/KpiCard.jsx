import React from "react";
import { cn } from "@/lib/utils";

// Shared compact KPI card — used by both the main Dashboard's secondary KPI
// row and the Subscription Dashboard's overview row, so the two look
// consistent. Icon + label + value + description sit in one tight row
// (no `justify-between` split), so short and long descriptions never
// produce the uneven gaps a two-block layout does.
const TONE_STYLES = {
  default: {
    iconBg: "bg-blue-50",
    iconColor: "text-app-primary2",
    border: "border-slate-200 hover:border-app-primary2",
  },
  emerald: {
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    border: "border-slate-200 hover:border-emerald-300",
  },
  amber: {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    border: "border-amber-200 hover:border-amber-400",
  },
  rose: {
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    border: "border-rose-200 hover:border-rose-400",
  },
  violet: {
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    border: "border-slate-200 hover:border-violet-300",
  },
  cyan: {
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    border: "border-slate-200 hover:border-cyan-300",
  },
  slate: {
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    border: "border-slate-200 hover:border-slate-400",
  },
};

const KpiCard = ({ label, value, description, tone = "default", onClick, isSelected }) => {
  const t = TONE_STYLES[tone] || TONE_STYLES.default;
  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "flex flex-col justify-center rounded-xl border bg-white px-5 py-5 shadow-sm transition-all duration-300 hover:shadow-md",
        t.border,
        onClick && "cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-blue focus-visible:outline-none",
        isSelected && "border-brand-blue/60 shadow-brand-blue/10 shadow-md",
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wide">
          {label}
        </p>
        <h4 className="truncate text-2xl font-extrabold leading-tight text-slate-900 mt-1">
          {value}
        </h4>
        {description && (
          <p className="truncate text-[11px] font-medium text-slate-400 mt-1.5">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
