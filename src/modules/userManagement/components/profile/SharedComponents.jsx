import React from "react";

export const SectionCard = ({
  title,
  subheading,
  icon: Icon,
  children,
  headerAction,
  className = "",
}) => (
  <div
    className={`bg-slate-50 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-200 flex flex-col transition-all duration-200 ${className}`}
  >
    <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/30 rounded-t-2xl">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div className="p-2 bg-slate-100/60 rounded-3xl text-slate-500">
            <Icon className="w-6 h-5" />
          </div>
        )}
        <div>
          <h3 className="font-bold text-slate-900 text-sm capitalize">
            {title}
          </h3>
          {subheading && (
            <p className="text-xs text-slate-500 font-medium">
              {subheading}
            </p>
          )}
        </div>
      </div>
      {headerAction && <div>{headerAction}</div>}
    </div>
    <div className="p-6 flex-1 flex flex-col">{children}</div>
  </div>
);

export const GridItem = ({
  label,
  value,
  icon: Icon,
  iconColor = "text-slate-300",
}) => (
  <div className="flex items-start gap-3 w-full max-w-60">
    <div className="mt-1">
      {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
    </div>
    <div className="flex flex-col gap-0.5 text-[13px] font-semibold text-slate-800">
      <h4 className="text-[11px] font-semibold text-slate-400 uppercase">
        {label}
      </h4>
      {value || "-"}
    </div>
  </div>
);

export const ListItem = ({ label, value, icon: Icon, badge }) => (
  <div className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0 last:pb-0 first:pt-0">
    <div className="p-2 bg-slate-100/60 rounded-xl border border-slate-100 text-slate-500">
      <Icon className="w-4 h-4" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
        {label}
      </div>
      <div className="text-[13px] font-semibold text-slate-800 truncate">
        {value || "-"}
      </div>
    </div>
    {badge && <div>{badge}</div>}
  </div>
);
