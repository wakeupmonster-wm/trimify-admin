import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format, startOfDay, endOfDay, subDays } from "date-fns";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import OverviewView from "../components/dashboard/OverviewView";
import {
  fetchOverview,
  fetchCharts,
  fetchDailyPerformance,
  fetchDashboardExtrasForSubscription,
} from "../store/subscription-dashboard.slice";

export default function SubscriptionDashboardPage() {
  const dispatch = useDispatch();
  const { overview, overviewLoading, overviewError, charts, dailyPerformance, dashboardExtras } = useSelector(
    (state) => state.subscriptionDashboard
  );

  const [scrolled, setScrolled] = useState(false);
  const [dateRange, setDateRange] = useState(() => ({
    from: subDays(startOfDay(new Date()), 30),
    to: endOfDay(new Date()),
    preset: "last30",
  }));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const rangeLabel = useMemo(() => {
    const presetLabels = {
      today: "Today",
      yesterday: "Yesterday",
      last7: "Last 7 Days",
      last30: "Last 30 Days",
      last90: "Last 90 Days",
      thisMonth: "This Month",
      lastMonth: "Last Month",
    };
    if (dateRange.preset && dateRange.preset !== "custom") {
      return presetLabels[dateRange.preset] || "Selected Range";
    }
    return `${format(dateRange.from, "MMM dd")} – ${format(dateRange.to, "MMM dd, y")}`;
  }, [dateRange]);

  const fetchChartsForRange = useCallback(
    (range) => {
      const params = {
        from: format(range.from, "yyyy-MM-dd"),
        to: format(range.to, "yyyy-MM-dd"),
      };
      dispatch(fetchCharts(params));
      dispatch(fetchDashboardExtrasForSubscription(params));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(fetchOverview());
    dispatch(fetchDailyPerformance());
  }, [dispatch]);

  useEffect(() => {
    fetchChartsForRange(dateRange);
  }, [dateRange, fetchChartsForRange]);

  const handleRefresh = () => {
    dispatch(fetchOverview());
    dispatch(fetchDailyPerformance());
    fetchChartsForRange(dateRange);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-1 flex-col font-jakarta bg-slate-50 min-h-screen w-full min-w-0 overflow-x-hidden">
        <DashboardHeader
          scrolled={scrolled}
          dateRange={dateRange}
          onDateChange={setDateRange}
          onRefresh={handleRefresh}
          refreshing={overviewLoading}
        />

        <OverviewView
          overview={overview}
          overviewLoading={overviewLoading}
          overviewError={overviewError}
          charts={charts}
          dailyPerformance={dailyPerformance}
          dashboardExtras={dashboardExtras}
          rangeLabel={rangeLabel}
          onRetry={handleRefresh}
        />
      </div>
    </TooltipProvider>
  );
}
