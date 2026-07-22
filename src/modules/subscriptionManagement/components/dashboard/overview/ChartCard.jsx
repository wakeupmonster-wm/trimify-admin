import React from "react";
import DashboardHead from "@/components/shared/dashboard.head";
import { DataNotFound } from "@/modules/not-found/components/data.not-found";

export default function ChartCard({
  title,
  subtitle,
  icon,
  isEmpty,
  emptyMessage,
  headerRight,
  children,
}) {
  return (
    <div className="bg-white border border-slate-300/60 hover:border-blue-200 transition-all duration-300 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
      <div className="pt-5 pb-4 px-6 border-b border-slate-100 flex items-center justify-between gap-3">
        <DashboardHead
          title={title}
          subtitle={subtitle}
          Icon={icon}
          iconColor="text-slate-600"
          iconBg="bg-slate-100/50"
        />
        {headerRight}
      </div>
      <div className="flex-1 p-4 flex flex-col min-h-[200px]">
        {isEmpty ? (
          <div className="flex-1 flex items-center justify-center">
            <DataNotFound message={emptyMessage} />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
