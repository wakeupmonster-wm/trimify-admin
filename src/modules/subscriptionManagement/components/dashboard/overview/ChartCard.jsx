import React from "react";
import DashboardHead from "@/components/shared/dashboard.head";
import { DataNotFound } from "@/modules/not-found/components/data.not-found";

export default function ChartCard({ title, subtitle, icon, isEmpty, emptyMessage, height = 320, headerRight, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden h-full flex flex-col">
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
        <DashboardHead
          title={title}
          subtitle={subtitle}
          Icon={icon}
          iconColor="text-brand-aqua"
          iconBg="bg-brand-aqua/10"
        />
        {headerRight}
      </div>
      {/* Fixed (not min-) height so ResponsiveContainer inside always resolves against a
          definite pixel height, regardless of flex/grid stretch behavior. */}
      <div className="p-4" style={{ height }}>
        {isEmpty ? (
          <div className="h-full flex items-center justify-center">
            <DataNotFound message={emptyMessage} />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
