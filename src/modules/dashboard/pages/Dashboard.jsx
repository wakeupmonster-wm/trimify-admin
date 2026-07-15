import { RevenueTrendChart } from "@/components/shared/RevenueTrendChart";
import { ChartUserDistribution } from "@/components/shared/chart-user-distribution";
import { RecentUsersTable } from "@/components/shared/recent-users-table";
import { CalendarDateRangePicker } from "@/components/shared/date-range-picker";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchDashboardKPIs,
  fetchDashboardData,
  setDashboardDateRange,
} from "../store/dashboard.slice";
import { PageHeader } from "@/components/common/headSubhead";
import { LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { TodayAtAGlance } from "../components/TodayAtAGlance";
import { UserGrowthChart } from "../components/UserGrowthChart";
import { RevenueBreakdown } from "../components/RevenueBreakdown";
import { LiveActivity } from "../components/LiveActivity";
import { ActivityHeatmap } from "../components/ActivityHeatmap";
import { ContentPerformance } from "@/components/shared/ContentPerformance";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { format } from "date-fns";
import { useSocket } from "@/app/context/SocketContext";
import { cn } from "@/lib/utils";
import { TableLoader } from "@/app/loader/table.loader";

export default function Dashboard() {
  const socket = useSocket();
  const dispatch = useDispatch();

  const { stats, loading, dashboardData, dashboardMeta, dateRange } =
    useSelector((state) => state.dashboard);
  const [selectedDate, setSelectedDate] = useState(
    dateRange || { preset: "today" },
  );
  const [refreshing, setRefreshing] = useState(false);
  const [liveEvents, setLiveEvents] = useState([]);

  // ─── Socket: Real-time Live Activity Feed ──────────────────────────────────
  // Connects to WebSocket to receive live user activity events.
  // On mount: joins the admin dashboard room and listens for activity history + new events.
  // On unmount: leaves the room and removes all socket listeners to prevent memory leaks.
  useEffect(() => {
    if (!socket) return;

    // 1. Load existing activity history when first joining the room
    const handleHistory = (history) => {
      console.log("📜 Activity History Received:");
      if (Array.isArray(history)) {
        setLiveEvents(history);
      } else {
        console.warn("⚠️ Received history is not an array:");
      }
    };

    // 2. Append new live events as they arrive (capped at 50 most recent)
    const handleNewActivity = (data) => {
      console.log("🔥 Live Activity Received:", data);
      setLiveEvents((prev) => [data, ...prev].slice(0, 50));
    };

    socket.on("activity_history", handleHistory);
    socket.on("new_live_activity", handleNewActivity);

    // 3. Join the admin dashboard room (handles both already-connected and reconnect scenarios)
    console.log("📤 Emitting join_admin_dashboard...");

    if (socket.connected) {
      console.log("⚡ Socket already connected, joining now.");
      socket.emit("join_admin_dashboard");
    }

    const onConnect = () => {
      console.log("⚡ Socket connected event, joining now.");
      socket.emit("join_admin_dashboard");
    };
    socket.on("connect", onConnect);

    // Cleanup: leave room and detach all listeners
    return () => {
      console.log("📤 Emitting leave_admin_dashboard...");
      socket.emit("leave_admin_dashboard");
      socket.off("activity_history", handleHistory);
      socket.off("new_live_activity", handleNewActivity);
      socket.off("connect", onConnect);
    };
  }, [socket]);

  // ─── Dashboard API Fetch Lifecycle ──────────────────────────────────────────
  // Fetches both KPI stats and dashboard data whenever the selected date range changes.
  // On initial load: DashboardSkeleton handles the loading state (no overlay).
  // On subsequent date changes: a "refreshing" overlay is shown over the existing dashboard.
  useEffect(() => {
    if (!selectedDate) return;

    const refreshData = async (dateObj) => {
      // Show the refreshing overlay ONLY on subsequent loads (data already exists).
      // The initial load is handled by the DashboardSkeleton early return below.
      const isSubsequentLoad = !!dashboardData;
      if (isSubsequentLoad) setRefreshing(true);
      try {
        const preset = dateObj?.preset || "today";
        const apiParams = {
          preset,
          from: dateObj?.from
            ? format(new Date(dateObj.from), "yyyy-MM-dd")
            : null,
          to: dateObj?.to ? format(new Date(dateObj.to), "yyyy-MM-dd") : null,
        };

        const serializableDate = {
          ...dateObj,
          from: dateObj?.from ? new Date(dateObj.from).toISOString() : null,
          to: dateObj?.to ? new Date(dateObj.to).toISOString() : null,
        };

        await Promise.all([
          dispatch(fetchDashboardData(serializableDate)),
          dispatch(fetchDashboardKPIs(apiParams)),
        ]);
      } catch (err) {
        console.error("Dashboard manual refresh failed:", err);
      } finally {
        setRefreshing(false);
      }
    };

    refreshData(selectedDate);

    // Persist selected date range to Redux so it survives component re-mounts
    dispatch(
      setDashboardDateRange({
        ...selectedDate,
        from: selectedDate?.from
          ? new Date(selectedDate.from).toISOString()
          : null,
        to: selectedDate?.to ? new Date(selectedDate.to).toISOString() : null,
      }),
    );
  }, [selectedDate, dispatch]);

  // Derive the human-readable period label (e.g. "May 01 – May 27, 2026")
  // For custom date ranges: format from the selected dates
  // For presets (today, 7d, 30d): use the label returned by the backend
  const dynamicPeriodLabel =
    selectedDate?.from &&
    (!selectedDate.preset || selectedDate.preset === "custom")
      ? `${format(selectedDate.from, "MMM dd")} - ${format(selectedDate.to || selectedDate.from, "MMM dd, y")}`
      : dashboardMeta?.periodLabel;

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (e) => {
      const target =
        e.target === document
          ? document.documentElement || document.body
          : e.target;
      const currentScrollY =
        window.scrollY || (target && target.scrollTop) || 0;
      // Update scrolled state for shadow
      setScrolled(currentScrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });
    return () =>
      window.removeEventListener("scroll", handleScroll, { capture: true });
  }, []);

  // ─── Initial Load Guard ─────────────────────────────────────────────────────
  // Show full-page skeleton until the first API response populates dashboardData.
  // After data exists, subsequent date-change refreshes show the TableLoader overlay instead.
  if (!dashboardData) {
    return (
      <div className="flex flex-1 flex-col font-jakarta bg-slate-50 min-h-screen max-w-[100vw] overflow-x-hidden">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-1 flex-col font-jakarta bg-slate-50 min-h-screen max-w-[100vw] relative">
        <AnimatePresence>
          {refreshing && dashboardData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[60]"
            >
              <TableLoader text="Updating Results..." />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="@container/main flex flex-1 flex-col w-full">
          {/* Top Dashboard Header - Sticky with Blur */}
          <div
            className={cn(
              "sticky top-0 z-[50] px-3 md:px-6 py-3 transition-all duration-300 ease-in-out",
              scrolled
                ? "backdrop-blur-md bg-white/95 border-b border-slate-200 shadow-sm shadow-slate-300/50"
                : "bg-slate-50 backdrop-blur-none border-b border-transparent shadow-none",
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
              <PageHeader
                heading="Dashboard Overview"
                icon={
                  <LayoutDashboard
                    strokeWidth={2}
                    className="w-8 h-8 text-white"
                  />
                }
                color="bg-brand-blue shadow-brand-blue"
                subheading={
                  <div className="flex items-center gap-1">
                    <span>Showing data for:</span>
                    <span className="text-brand-blue font-semibold">
                      {dynamicPeriodLabel}
                    </span>
                  </div>
                }
              />
              <div className="flex items-center gap-2.5 w-full sm:w-max shrink-0">
                <CalendarDateRangePicker
                  value={selectedDate}
                  onDateChange={setSelectedDate}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 3xl:gap-6 py-5 px-4 lg:px-6 w-full">
            <div className="w-full flex-col gap-4 md:gap-6 flex min-w-0">
              <TodayAtAGlance
                data={dashboardData?.zoneA}
                summaryData={dashboardData?.summaryData}
                periodLabel={dynamicPeriodLabel}
                selectedDate={selectedDate}
              />
            </div>

            <div className="flex flex-col items-start justify-between gap-4 3xl:gap-6">
              <div className="flex flex-col items-start gap-1">
                <h2 className="text-base font-bold text-slate-900 group">
                  Key Metrics
                </h2>
                <p className="text-[11px] font-medium text-slate-500 leading-none">
                  Quick overview of platform health
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 3xl:gap-6 w-full items-stretch min-w-0">
                <UserGrowthChart data={dashboardData?.engagementChartsData} selectedDate={selectedDate} />
                <LiveActivity
                  data={
                    dashboardData
                      ? dashboardData.recentActivityData
                      : undefined
                  }
                />
              </div>
            </div>

            {/* Analytical Row 3: Bento Grid (Revenue, Match, Gender, Heatmap) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 3xl:gap-6 w-full items-stretch min-w-0">
              {/* Left Column: Revenue Breakdown */}
              <div className="lg:col-span-4 h-full">
                <RevenueBreakdown 
                  data={dashboardData?.revenueBreakdown} 
                  revenueChartsData={dashboardData?.revenueChartsData} 
                />
              </div>

              {/* Right Column: Stats & Heatmap */}
              <div className="lg:col-span-8 flex flex-col gap-4 3xl:gap-6">

                <div className="flex-1">
                  <ActivityHeatmap data={dashboardData?.engagementChartsData} />
                </div>
              </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-4 3xl:gap-6 w-full items-stretch min-w-0">
              <div className="flex-[1.2] min-w-0 flex flex-col h-full w-full">
                <RevenueTrendChart data={dashboardData?.revenueChartsData} />
              </div>
              <div className="flex-1 min-w-0 flex flex-col h-full w-full">
                <ChartUserDistribution 
                  data={{
                    active: dashboardData?.summaryData?.activeUsers || 0,
                    inactive: dashboardData?.summaryData?.inactiveUsers || 0
                  }} 
                />
              </div>
            </div>

            {/* Content Performance */}
            <div className="flex flex-col gap-4 3xl:gap-6 w-full items-stretch min-w-0">
              <div className="w-full flex flex-col h-full min-w-0">
                <ContentPerformance data={dashboardData?.contentChartsData} />
              </div>
            </div>

            {/* Recent Joined Users */}
            <div className="flex flex-col gap-4 3xl:gap-6 w-full items-stretch min-w-0">
              <div className="w-full flex flex-col h-full min-w-0 overflow-x-auto">
                <RecentUsersTable recentActivityData={dashboardData?.recentActivityData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
