import React from "react";
import { LayoutDashboard, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/headSubhead";
import { CalendarDateRangePicker } from "@/components/shared/date-range-picker";

export default function DashboardHeader({
  scrolled,
  dateRange,
  onDateChange,
  onRefresh,
  refreshing,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <PageHeader
          heading="Subscription Dashboard"
          icon={
            <LayoutDashboard strokeWidth={2} className="w-8 h-8 text-white" />
          }
          color="bg-app-primary2 shadow-blue-200"
          subheading="Plans, subscribers and revenue at a glance."
        />

        <div className="flex items-center gap-2.5 w-full sm:w-max">
          <CalendarDateRangePicker
            value={dateRange}
            onDateChange={onDateChange}
            className="flex-1 sm:flex-none sm:w-full max-w-max"
          />
          <Button
            type="button"
            variant="outline"
            onClick={onRefresh}
            disabled={refreshing}
            className="h-10 shrink-0 border-slate-300/60 bg-white hover:bg-app-primary2 shadow-sm text-slate-500 hover:text-white transition-all active:scale-95"
          >
            <RefreshCcw
              className={cn("h-4 w-4", refreshing && "animate-spin")}
            />
          </Button>
        </div>
      </div>
    </header>
  );
}
