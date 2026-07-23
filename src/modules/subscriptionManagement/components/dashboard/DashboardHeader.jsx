import React from "react";
import { LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/common/headSubhead";
import { CalendarDateRangePicker } from "@/components/shared/date-range-picker";
import LastUpdatedIndicator from "../../../dashboard/components/LastUpdatedIndicator";

export default function DashboardHeader({
  scrolled,
  dateRange,
  onDateChange,
  onRefresh,
  refreshing,
  lastUpdated,
  rangeLabel,
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 px-3 md:px-6 py-3 transition-all duration-300 ease-in-out",
        scrolled
          ? "backdrop-blur-md bg-white/95 border-b border-slate-300/60 shadow-sm shadow-slate-300/50"
          : "bg-slate-50 backdrop-blur-none border-b border-transparent shadow-none",
      )}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 w-full min-w-0">
        <div className="flex-1 min-w-0 w-max md:w-auto">
          <PageHeader
            heading="Subscription Dashboard"
            icon={
              <LayoutDashboard
                strokeWidth={2}
                className="w-6 h-6 text-white shrink-0"
              />
            }
            color="bg-app-primary2 shadow-blue-200"
            subheading="Plans, subscribers and revenue at a glance."
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-max shrink-0 mt-2 md:mt-0">
          <LastUpdatedIndicator
            lastUpdated={lastUpdated}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
          <CalendarDateRangePicker
            value={dateRange}
            onDateChange={onDateChange}
            className="flex-1 w-full max-w-max"
          />
        </div>
      </div>
    </header>
  );
}
