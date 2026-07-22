import React from "react";
import { cn } from "@/lib/utils";

export const KpiStatCard = ({
  title,
  value,
  icon: Icon,
  colorClass = "text-brand-blue",
  bgClass = "bg-blue-50",
  description,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-start gap-4 p-4 py-5 rounded-xl border bg-white shadow-sm cursor-pointer transition-all duration-500 hover:shadow-md hover:shadow-slate-200/50 hover:-translate-y-1 active:scale-[0.98]",
        onClick && "cursor-pointer",
      )}
    >
      <div
        className={cn("p-3 rounded-full bg-slate-200/40 shadow-sm", bgClass)}
      >
        {Icon && <Icon className={cn("h-6 w-6", colorClass)} />}
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="text-xs capitalize font-semibold text-foreground/70 transition-colors">
          {title}
        </p>
        {/* <h4 className="truncate text-2xl font-black leading-tight text-slate-900 mt-0.5"> */}
        <h4 className="text-[26px] font-extrabold text-slate-900 leading-none">
          {value}
        </h4>
        {description && (
          // <p className="truncate text-[10px] font-medium text-slate-400 mt-0.5">
          <p className="text-[11px] font-medium mt-1 max-w-[150px] truncate text-secondary-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
