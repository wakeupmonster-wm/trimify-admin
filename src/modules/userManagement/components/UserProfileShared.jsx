import React from "react";
import { cn } from "@/lib/utils";
import DashboardHead from "@/components/shared/dashboard.head";

const PILL_TONES = {
  success: "bg-emerald-50 text-emerald-600 border-emerald-200",
  danger: "bg-red-50 text-red-600 border-red-200",
  warning: "bg-amber-50 text-amber-600 border-amber-200",
  neutral: "bg-slate-100 text-slate-500 border-slate-300/60",
};

export function Pill({ tone = "neutral", children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        PILL_TONES[tone] || PILL_TONES.neutral,
      )}
    >
      {children}
    </span>
  );
}

export function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
      {children}
    </span>
  );
}

export function Card({
  title,
  subtitle,
  right,
  children,
  className,
  icon: Icon,
  iconColor,
  iconBg,
  tooltipText,
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-slate-300/60 bg-white shadow-sm transition-all duration-300 hover:border-blue-200",
        className,
      )}
    >
      {(title || right) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 bg-slate-50/20">
          <div className="flex-1 min-w-0">
            <DashboardHead
              title={title}
              subtitle={subtitle}
              Icon={Icon}
              iconColor={iconColor}
              iconBg={iconBg}
              tooltipText={tooltipText}
            />
          </div>
          {right && <div className="shrink-0">{right}</div>}
        </div>
      )}
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

export function KV({ icon: Icon, label, value, noBorder }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-2.5 group",
        !noBorder && "border-b border-slate-50 last:border-b-0 last:pb-0",
      )}
    >
      <div className="flex items-center gap-4">
        <div className="p-1.5 bg-slate-100/50 rounded-lg text-slate-400 group-hover:text-slate-600 transition-colors">
          {Icon && <Icon className="h-4 w-4" />}
        </div>
        <p className="text-[13px] font-semibold text-slate-600">{label}</p>
      </div>
      <div className="text-[13px] font-bold text-slate-600 max-w-[60%] break-words text-right">
        {value}
      </div>
    </div>
  );
}

export function Kpi({ icon: Icon, label, value, tone = "blue" }) {
  const textTones = {
    blue: "text-blue-500",
    purple: "text-purple-500",
    emerald: "text-emerald-500",
    amber: "text-amber-500",
  };
  const borderTones = {
    blue: "border-b-blue-500",
    purple: "border-b-purple-500",
    emerald: "border-b-emerald-500",
    amber: "border-b-amber-500",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-4 rounded-2xl border border-slate-300/80 bg-white border-b-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
        borderTones[tone] || borderTones.blue,
      )}
    >
      <div
        className={cn(
          "text-2xl md:text-3xl font-black mb-1 transition-transform duration-300",
          textTones[tone] || textTones.blue,
        )}
      >
        {value}
      </div>
      <p className="text-xs md:text-[13px] font-bold text-slate-600 text-center tracking-tight">
        {label}
      </p>
    </div>
  );
}

export function GoalTile({ label, value, pct, colorClass = "bg-blue-500" }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-white p-4 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md group flex flex-col gap-1">
      <div className="space-y-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </div>
        <div className="text-lg font-black tabular-nums text-slate-900 tracking-tight">
          {value}
        </div>
      </div>

      {pct !== undefined && (
        <div className="flex items-center gap-2.5">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700 ease-out group-hover:opacity-80",
                colorClass,
              )}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-slate-600 text-right w-7">
            {Math.round(pct)}%
          </span>
        </div>
      )}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 py-5 text-center">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-300 border border-slate-100">
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-[11.5px] font-bold text-slate-600">{title}</div>
      {subtitle && (
        <div className="max-w-[280px] text-[10.5px] font-medium text-slate-400">
          {subtitle}
        </div>
      )}
    </div>
  );
}
