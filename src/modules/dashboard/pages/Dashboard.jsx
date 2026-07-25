import { RevenueTrendChart } from "@/components/shared/RevenueTrendChart";
import { ChartUserDistribution } from "@/components/shared/chart-user-distribution";
import { RecentUsersTable } from "@/components/shared/recent-users-table";
import { CalendarDateRangePicker } from "@/components/shared/date-range-picker";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchDashboardExtras,
  setDashboardDateRange,
} from "../store/dashboard.slice";
import { PageHeader } from "@/components/common/headSubhead";
import {
  LayoutDashboard,
  Receipt,
  Target,
  Users2,
  Salad,
  TrendingUp,
  Activity as ActivityIcon,
  Dumbbell,
  Wallet,
  ShieldCheck,
  Bell,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TodayAtAGlance } from "../components/TodayAtAGlance";
import { UserGrowthChart } from "../components/UserGrowthChart";
import { RevenueBreakdown } from "../components/RevenueBreakdown";
import { LiveActivity } from "../components/LiveActivity";
import { ActivityHeatmap } from "../components/ActivityHeatmap";
import { ContentPerformance } from "@/components/shared/ContentPerformance";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { ConversionFunnel } from "../components/ConversionFunnel";
import SecondaryKpiRow from "../components/SecondaryKpiRow";
import { EcosystemAlerts } from "../components/EcosystemAlerts";
import LastUpdatedIndicator from "../components/LastUpdatedIndicator";
import DonutStatCard from "../components/DonutStatCard";
import TrendChartCard from "../components/TrendChartCard";
import DashboardTableCard from "../components/DashboardTableCard";
import StatusPill from "../components/StatusPill";
import { format, formatDistanceToNow } from "date-fns";
import { useSocket } from "@/app/context/SocketContext";
import { cn } from "@/lib/utils";
import { TableLoader } from "@/app/loader/table.loader";
import { APP_COLORS } from "@/config/theme.config.js";
export default function Dashboard() {
  const socket = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    dashboardData,
    dashboardExtras,
    dashboardMeta,
    dateRange,
    lastUpdated,
  } = useSelector((state) => state.dashboard);
  const [selectedDate, setSelectedDate] = useState(
    dateRange || { preset: "today" },
  );
  const [refreshing, setRefreshing] = useState(false);
  const [liveEvents, setLiveEvents] = useState([]);

  // --- Unified Brand Palette imported from theme.config.js ---

  const mapChartColors = (dataArray) => {
    if (!dataArray) return [];
    return dataArray.map((item, i) => ({
      ...item,
      color: APP_COLORS[i % APP_COLORS.length],
    }));
  };

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

  // Backend requires from/to as plain YYYY-MM-DD (per the dashboard API
  // contract) — never send a full ISO datetime here, the backend can't
  // parse it and silently falls back to its default range, which makes
  // every date-filter preset look like it's doing nothing.
  const buildDateRangeParams = (dateObj) => ({
    preset: dateObj?.preset || "today",
    from: dateObj?.from ? format(new Date(dateObj.from), "yyyy-MM-dd") : null,
    to: dateObj?.to ? format(new Date(dateObj.to), "yyyy-MM-dd") : null,
  });

  // ─── Dashboard API Fetch Lifecycle ──────────────────────────────────────────
  // Fetches dashboard extras whenever the selected date range changes.
  // On initial load: DashboardSkeleton handles the loading state (no overlay).
  // On subsequent date changes: a "refreshing" overlay is shown over the existing dashboard.
  useEffect(() => {
    if (!selectedDate) return;

    const refreshData = async (dateObj) => {
      // Show the refreshing overlay ONLY on subsequent loads (data already exists).
      // The initial load is handled by the DashboardSkeleton early return below.
      const isSubsequentLoad = !!dashboardExtras;
      if (isSubsequentLoad) setRefreshing(true);
      try {
        await dispatch(fetchDashboardExtras(buildDateRangeParams(dateObj)));
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

  // Manual refresh — re-pulls dashboard extras for the currently selected
  // range, used by the "as of HH:MM" indicator's refresh button.
  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchDashboardExtras(buildDateRangeParams(selectedDate)));
    } finally {
      setRefreshing(false);
    }
  };

  // Derive the human-readable period label (e.g. "May 01 – May 27, 2026" for
  // a custom range, or the preset's own label otherwise).
  const PRESET_LABELS = {
    today: "Today",
    yesterday: "Yesterday",
    last7: "Last 7 Days",
    last30: "Last 30 Days",
    last90: "Last 90 Days",
    thisMonth: "This Month",
    lastMonth: "Last Month",
  };
  const dynamicPeriodLabel =
    selectedDate?.preset && PRESET_LABELS[selectedDate.preset]
      ? PRESET_LABELS[selectedDate.preset]
      : selectedDate?.from
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
  if (!dashboardExtras) {
    return (
      <div className="flex flex-1 flex-col font-sans bg-slate-50 min-h-screen max-w-[100vw] overflow-x-hidden">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-1 flex-col font-sans bg-slate-50 min-h-screen max-w-[100vw] relative">
        <AnimatePresence>
          {refreshing && dashboardExtras && (
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
                ? "backdrop-blur-md bg-white/95 border-b border-slate-300/60 shadow-sm shadow-slate-300/50"
                : "bg-slate-50 backdrop-blur-none border-b border-transparent shadow-none",
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
              <PageHeader
                heading="Dashboard Overview"
                icon={
                  <LayoutDashboard className="w-6 h-6 text-white shrink-0" />
                }
                variant="primary"
                subheading={
                  <div className="flex items-center gap-1">
                    <span>Showing data for:</span>
                    <span className="text-app-primary2 font-semibold">
                      {dynamicPeriodLabel}
                    </span>
                  </div>
                }
              />
              <div className="flex items-center gap-2.5 w-full sm:w-max shrink-0">
                <LastUpdatedIndicator
                  lastUpdated={lastUpdated}
                  onRefresh={handleManualRefresh}
                  refreshing={refreshing}
                />
                <CalendarDateRangePicker
                  value={selectedDate}
                  onDateChange={setSelectedDate}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 py-5 px-4 lg:px-6 w-full">
            {/* ─────────────────────────────────────────────────────────────
                Previous dashboard widgets — temporarily disabled while the
                new dashboard (extras-driven) is being built out. Nothing
                deleted, just switched off; flip back to `true` to restore.
               ───────────────────────────────────────────────────────────── */}
            {false && (
              <>
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
                    <UserGrowthChart
                      data={dashboardData?.engagementChartsData}
                      selectedDate={selectedDate}
                    />
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
                      <ActivityHeatmap
                        data={dashboardData?.engagementChartsData}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-4 3xl:gap-6 w-full items-stretch min-w-0">
                  <div className="flex-[1.2] min-w-0 flex flex-col h-full w-full">
                    <RevenueTrendChart
                      data={dashboardData?.revenueChartsData}
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col h-full w-full">
                    <ChartUserDistribution
                      data={{
                        active: dashboardData?.summaryData?.activeUsers || 0,
                        inactive:
                          dashboardData?.summaryData?.inactiveUsers || 0,
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            <SecondaryKpiRow data={dashboardExtras?.secondaryKpis} />
            <EcosystemAlerts
              data={{ alerts: dashboardExtras?.alerts || [] }}
              selectedDate={selectedDate}
            />

            {/* Composition — pie/donut breakdowns */}
            <div className="flex flex-col items-start gap-6">
              <div className="flex flex-col items-start gap-1">
                <h2 className="text-base font-bold text-slate-900">
                  Composition
                </h2>
                <p className="text-[11px] font-medium text-slate-500 leading-none">
                  How the current user & revenue base breaks down
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 3xl:gap-6 w-full items-stretch min-w-0">
                {/* "Users by Plan Type" and "Transaction Status" moved to the
                    Subscription Dashboard (OverviewView.jsx) — plan/revenue
                    breakdowns belong with the rest of subscription analytics. */}
                <DonutStatCard
                  title="User Goal Distribution"
                  subtitle="Primary fitness goal"
                  Icon={Target}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                  // data={dashboardExtras?.pieCharts?.userGoals || []}
                  data={mapChartColors(
                    dashboardExtras?.pieCharts?.userGoals || [],
                  )}
                  scrollableLegend
                />
                <DonutStatCard
                  title="Gender Distribution"
                  subtitle="Male vs Female user breakdown"
                  Icon={Users2}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                  // data={dashboardExtras?.pieCharts?.gender || []}
                  data={mapChartColors(
                    dashboardExtras?.pieCharts?.gender || [],
                  )}
                />
                <DonutStatCard
                  title="Vegetarian vs Non-veg"
                  subtitle="Dietary preference split"
                  Icon={Salad}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                  tooltipText="A large share of users haven't filled this field in — tracked as Unspecified rather than dropped."
                  data={mapChartColors(
                    dashboardExtras?.pieCharts?.dietPreference || [],
                  )}
                />
                <ConversionFunnel data={dashboardExtras?.funnel} />
              </div>
            </div>

            {/* Trends — everything not already covered by Signups/Revenue/Heatmap above */}
            <div className="flex flex-col items-start gap-6">
              <div className="flex flex-col items-start gap-1">
                <h2 className="text-base font-bold text-slate-900">Trends</h2>
                <p className="text-[11px] font-medium text-slate-500 leading-none">
                  Change over time, grouped to match the selected date range
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 3xl:gap-6 w-full items-stretch min-w-0">
                <TrendChartCard
                  title="Engagement Trend (DAU)"
                  subtitle="Users logging food / water / steps / weight"
                  Icon={ActivityIcon}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                  data={dashboardExtras?.trends?.engagementDAU || []}
                  xKey="date"
                  periodLabel={dynamicPeriodLabel}
                  series={[
                    {
                      key: "active_users",
                      label: "Daily Active Users",
                      // color: "hsl(182, 59%, 54%)",
                      color: "#007FC0", // primary2
                      type: "area",
                    },
                  ]}
                  note="Daily Active Users — how many unique users tracked their diet, water, steps, or weight on a given day. This shows whether people are actually using the app, not just installing and abandoning it."
                />
                <TrendChartCard
                  title="Fitzone Session Completion"
                  subtitle="Assignment volume per period"
                  Icon={Dumbbell}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                  data={dashboardExtras?.trends?.fitzoneCompletion || []}
                  xKey="date"
                  periodLabel={dynamicPeriodLabel}
                  series={(
                    dashboardExtras?.trends?.fitzoneStatuses || ["Active"]
                  ).map((status, i) => ({
                    key: status,
                    label: status,
                    color: APP_COLORS[i % APP_COLORS.length],
                    type: "bar",
                  }))}
                  note="Sessions only have an 'Active' status today — this chart will pick up a 'Completed' series automatically once the app starts writing one."
                />
                <TrendChartCard
                  title="Program Enrollment Split"
                  subtitle="Top 10 ranked programs"
                  Icon={TrendingUp}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                  data={dashboardExtras?.trends?.popularPrograms || []}
                  xKey="title"
                  series={[
                    {
                      key: "total",
                      label: "Users Enrolled",
                      color: "#007FC0", // Primary Blue
                      type: "bar",
                    },
                  ]}
                />
                <div className="w-full h-full min-h-[320px]">
                  <DashboardTableCard
                    title="Recent Joined Users"
                    subtitle="Monitor the latest member registrations"
                    Icon={Users2}
                    iconColor="text-slate-600"
                    iconBg="bg-slate-100/50"
                    rows={(dashboardExtras?.tables?.recentUsers || []).slice(
                      0,
                      5,
                    )}
                    emptyMessage="No recent users found."
                    columns={[
                      {
                        key: "name",
                        label: "User",
                        render: (r) => (
                          <span
                            className="block max-w-[150px] truncate font-semibold"
                            title={r.name}
                          >
                            {r.name}
                          </span>
                        ),
                      },
                      {
                        key: "email",
                        label: "Email",
                        render: (r) => (
                          <span
                            className="block max-w-[180px] truncate text-slate-500"
                            title={r.email}
                          >
                            {r.email || "-"}
                          </span>
                        ),
                      },
                      {
                        key: "created_at",
                        label: "Joined",
                        render: (r) => (
                          <span className="whitespace-nowrap">
                            {r.created_at
                              ? format(new Date(r.created_at), "MMM, dd yyyy")
                              : "-"}
                          </span>
                        ),
                      },
                    ]}
                    actionLabel={"View"}
                    onAction={(row) =>
                      navigate(`/admin/users/view-user/${row.id}`, {
                        state: { from: "/admin/dashboard" },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {false && (
              <>
                {/* Content Performance */}
                <div className="flex flex-col gap-4 3xl:gap-6 w-full items-stretch min-w-0">
                  <div className="w-full flex flex-col h-full min-w-0">
                    <ContentPerformance
                      data={dashboardData?.contentChartsData}
                    />
                  </div>
                </div>

                {/* Recent Joined Users */}
                <div className="flex flex-col gap-4 3xl:gap-6 w-full items-stretch min-w-0">
                  <div className="w-full flex flex-col h-full min-w-0 overflow-x-auto">
                    <RecentUsersTable
                      recentActivityData={dashboardData?.recentActivityData}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Drill-down lists */}
            <div className="flex flex-col items-start gap-6">
              <div className="flex flex-col items-start gap-1">
                <h2 className="text-base font-bold text-slate-900">
                  Follow-ups & Roster
                </h2>
                <p className="text-[11px] font-medium text-slate-500 leading-none">
                  Renewals, abandoned checkouts and platform admin/notification
                  activity
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 3xl:gap-6 w-full items-stretch min-w-0">
                <div className="w-full">
                  <DashboardTableCard
                    title="Pending / Abandoned Checkouts"
                    subtitle="Signed up but haven't paid in 7+ days"
                    Icon={Wallet}
                    iconColor="text-slate-600"
                    iconBg="bg-slate-100/50"
                    rows={dashboardExtras?.tables?.abandonedCheckouts || []}
                    emptyMessage="No abandoned checkouts right now."
                    actionLabel="Follow Up"
                    onAction={(row) =>
                      navigate(
                        `/admin/users/view-user/${row.user_id || row.id}`,
                      )
                    }
                    columns={[
                      {
                        key: "sr_no",
                        label: "Sr. No.",
                        width: "w-[10%]",
                        align: "left",
                        render: (_, idx) => (
                          <span className="text-slate-500 px-2 font-medium">
                            {idx + 1}
                          </span>
                        ),
                      },
                      {
                        key: "name",
                        label: "User",
                        width: "w-[20%]",
                        align: "left",
                        render: (r) => (
                          <span
                            className="block max-w-[120px] xl:max-w-max truncate font-semibold"
                            title={r.name}
                          >
                            {r.name}
                          </span>
                        ),
                      },
                      { key: "signed_up_at", label: "Signed Up", width: "w-[15%]", align: "left", render: (r) => format(new Date(r.signed_up_at), "MMM dd, HH:mm"), },
                      { key: "days_since_signup", label: "Days Since", width: "w-[15%]", align: "left", render: (r) => `${r.days_since_signup}d` },
                      {
                        key: "main_goal",
                        label: "Goal",
                        width: "w-[15%]",
                        align: "left",
                        render: (r) => (
                          <span className="capitalize">{r.main_goal}</span>
                        ),
                      },
                      {
                        key: "gender",
                        label: "Gender",
                        width: "w-[15%]",
                        align: "left",
                        render: (r) => (
                          <span className="capitalize">{r.gender}</span>
                        ),
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
