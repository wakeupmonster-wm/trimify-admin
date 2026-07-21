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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 w-full min-w-0">
        <div className="flex-1 min-w-0 w-full md:w-auto">
          <PageHeader
            heading="Subscription Dashboard"
            icon={
              <LayoutDashboard strokeWidth={2} className="w-6 md:w-7 h-6 md:h-7 text-white shrink-0" />
            }
            color="bg-app-primary2 shadow-blue-200"
            subheading="Plans, subscribers and revenue at a glance."
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-max shrink-0 mt-2 md:mt-0">
          <CalendarDateRangePicker
            value={dateRange}
            onDateChange={onDateChange}
            className="flex-1 md:flex-none w-full md:w-auto h-11 md:h-10"
          />
          <Button
            type="button"
            variant="outline"
            onClick={onRefresh}
            disabled={refreshing}
            className="h-11 md:h-10 w-11 md:w-10 shrink-0 border-slate-300/60 bg-white hover:bg-app-primary2 shadow-sm text-slate-500 hover:text-white transition-all active:scale-95 flex items-center justify-center p-0 rounded-xl md:rounded-lg"
          >
            <RefreshCcw
              className={cn("h-4 sm:h-5 w-4 sm:w-5", refreshing && "animate-spin")}
            />
          </Button>
        </div>
      </div>
    </header>
  );
}
