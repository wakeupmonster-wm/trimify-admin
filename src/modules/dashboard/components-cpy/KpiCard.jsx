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
    border: "border-slate-200 hover:border-slate-300",
  },
};

const KpiCard = ({
  icon: Icon,
  label,
  value,
  description,
  tone = "default",
  onClick,
}) => {
  const t = TONE_STYLES[tone] || TONE_STYLES.default;
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md",
        t.border,
        onClick && "cursor-pointer",
      )}
    >
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          t.iconBg,
        )}
      >
        {Icon && <Icon className={cn("h-5 w-5", t.iconColor)} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-semibold text-slate-500">
          {label}
        </p>
        <h4 className="truncate text-lg font-extrabold leading-tight text-slate-900">
          {value}
        </h4>
        {description && (
          <p className="truncate text-[10px] font-medium text-slate-400 mt-0.5">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
