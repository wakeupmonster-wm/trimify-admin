import { RevenueTrendChart } from "@/components/shared/RevenueTrendChart";
import { ChartUserDistribution } from "@/components/shared/chart-user-distribution";
import { RecentUsersTable } from "@/components/shared/recent-users-table";
import { CalendarDateRangePicker } from "@/components/shared/date-range-picker";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchDashboardKPIs,
  fetchDashboardData,
  fetchDashboardExtras,
  setDashboardDateRange,
} from "../store/dashboard.slice";
import { PageHeader } from "@/components/common/headSubhead";
import {
  LayoutDashboard,
  PieChart as PieChartIcon,
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
import LastUpdatedIndicator from "../components/LastUpdatedIndicator";
import DonutStatCard from "../components/DonutStatCard";
import TrendChartCard from "../components/TrendChartCard";
import DashboardTableCard from "../components/DashboardTableCard";
import StatusPill from "../components/StatusPill";
import { format, formatDistanceToNow } from "date-fns";
import { useSocket } from "@/app/context/SocketContext";
import { cn } from "@/lib/utils";
import { TableLoader } from "@/app/loader/table.loader";

export default function Dashboard() {
  const socket = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    stats,
    loading,
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

  // --- Flutter App Palette ---
  const appColors = [
    "#007FC0", // primary2
    "#15B097", // cardGreen
    "#DC6B1B", // cardOrange
    "#EDA145", // cardYellow
    "#5AA0C1", // primary3
    "#FF5252", // caloriesRed
    "#4A90E2", // proteinBlue
    "#FFC107", // fatsYellow
    "#8BC34A", // carbsGreen
    "#04365F", // primary5
  ];

  const mapChartColors = (dataArray) => {
    if (!dataArray) return [];
    return dataArray.map((item, i) => ({
      ...item,
      color: appColors[i % appColors.length],
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
          dispatch(fetchDashboardExtras(serializableDate)),
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

  // Manual refresh — re-pulls the same three thunks for the currently
  // selected range, used by the "as of HH:MM" indicator's refresh button.
  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      const preset = selectedDate?.preset || "today";
      const apiParams = {
        preset,
        from: selectedDate?.from
          ? format(new Date(selectedDate.from), "yyyy-MM-dd")
          : null,
        to: selectedDate?.to
          ? format(new Date(selectedDate.to), "yyyy-MM-dd")
          : null,
      };
      const serializableDate = {
        ...selectedDate,
        from: selectedDate?.from
          ? new Date(selectedDate.from).toISOString()
          : null,
        to: selectedDate?.to ? new Date(selectedDate.to).toISOString() : null,
      };
      await Promise.all([
        dispatch(fetchDashboardData(serializableDate)),
        dispatch(fetchDashboardKPIs(apiParams)),
        dispatch(fetchDashboardExtras(serializableDate)),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

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
  if (!dashboardExtras) {
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
                  <LayoutDashboard
                    strokeWidth={2}
                    className="w-8 h-8 text-white"
                  />
                }
                color="bg-app-primary2 shadow-brand-blue"
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

          <div className="flex flex-col gap-4 3xl:gap-6 py-5 px-4 lg:px-6 w-full">
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

            <SecondaryKpiRow
              data={dashboardExtras?.secondaryKpis}
              selectedDate={selectedDate}
            />

            {/* Composition — pie/donut breakdowns */}
            <div className="flex flex-col items-start gap-4 3xl:gap-6">
              <div className="flex flex-col items-start gap-1">
                <h2 className="text-base font-bold text-slate-900">
                  Composition
                </h2>
                <p className="text-[11px] font-medium text-slate-500 leading-none">
                  How the current user & revenue base breaks down
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 3xl:gap-6 w-full items-stretch min-w-0">
                <DonutStatCard
                  title="Users by Plan Type"
                  subtitle="Monthly vs Quarterly"
                  Icon={PieChartIcon}
                  iconColor="text-brand-blue"
                  iconBg="bg-blue-50"
                  // data={dashboardExtras?.pieCharts?.planType || []}
                  data={mapChartColors(
                    dashboardExtras?.pieCharts?.planType || [],
                  )}
                  footnote="Yearly plan isn't live in the catalog yet — this chart is ready to pick it up as soon as it has subscribers."
                />
                <DonutStatCard
                  title="Transaction Status"
                  subtitle="Success / failed / pending"
                  Icon={Receipt}
                  iconColor="text-emerald-600"
                  iconBg="bg-emerald-50"
                  // data={dashboardExtras?.pieCharts?.txStatus || []}
                  data={mapChartColors(
                    dashboardExtras?.pieCharts?.txStatus || [],
                  )}
                />
                <DonutStatCard
                  title="User Goal Distribution"
                  subtitle="Primary goal, main_goal field"
                  Icon={Target}
                  iconColor="text-violet-600"
                  iconBg="bg-violet-50"
                  // data={dashboardExtras?.pieCharts?.userGoals || []}
                  data={mapChartColors(
                    dashboardExtras?.pieCharts?.userGoals || [],
                  )}
                  scrollableLegend
                />
                <DonutStatCard
                  title="Gender Distribution"
                  Icon={Users2}
                  iconColor="text-cyan-600"
                  iconBg="bg-cyan-50"
                  // data={dashboardExtras?.pieCharts?.gender || []}
                  data={mapChartColors(
                    dashboardExtras?.pieCharts?.gender || [],
                  )}
                />
                <DonutStatCard
                  title="Vegetarian vs Non-veg"
                  Icon={Salad}
                  iconColor="text-amber-600"
                  iconBg="bg-amber-50"
                  // data={dashboardExtras?.pieCharts?.dietPreference || []}
                  data={mapChartColors(
                    dashboardExtras?.pieCharts?.dietPreference || [],
                  )}
                  footnote="A large share of users haven't filled this field in — tracked as Unspecified rather than dropped."
                />
                <ConversionFunnel data={dashboardExtras?.funnel} />
              </div>
            </div>

            {/* Trends — everything not already covered by Signups/Revenue/Heatmap above */}
            <div className="flex flex-col items-start gap-4 3xl:gap-6">
              <div className="flex flex-col items-start gap-1">
                <h2 className="text-base font-bold text-slate-900">Trends</h2>
                <p className="text-[11px] font-medium text-slate-500 leading-none">
                  Change over time, grouped to match the selected date range
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 3xl:gap-6 w-full items-stretch min-w-0">
                <TrendChartCard
                  title="Active vs Churned Users"
                  subtitle="Month-wise comparison"
                  Icon={TrendingUp}
                  iconColor="text-brand-blue"
                  iconBg="bg-blue-50"
                  tooltipText="Approximate — churnedUsers can only reflect plans that lapsed and haven't been renewed as of today, not a full historical ledger."
                  data={dashboardExtras?.trends?.activeVsChurned || []}
                  xKey="month"
                  series={[
                    {
                      key: "activeUsers",
                      label: "Active",
                      // color: "hsl(160, 84%, 39%)",
                      color: "#15B097", // cardGreen
                      type: "line",
                    },
                    {
                      key: "churnedUsers",
                      label: "Churned",
                      // color: "hsl(0, 84%, 60%)",
                      color: "#FF5252", // caloriesRed
                      type: "line",
                    },
                  ]}
                  note="Churn numbers are approximate — a user who churned and later renewed no longer shows up as churned that month."
                />
                <TrendChartCard
                  title="Engagement Trend (DAU)"
                  subtitle="Users logging food / water / steps / weight"
                  Icon={ActivityIcon}
                  iconColor="text-cyan-600"
                  iconBg="bg-cyan-50"
                  data={dashboardExtras?.trends?.engagementDAU || []}
                  xKey="date"
                  series={[
                    {
                      key: "active_users",
                      label: "Daily Active Users",
                      // color: "hsl(182, 59%, 54%)",
                      color: "#007FC0", // primary2
                      type: "line",
                    },
                  ]}
                />
                <TrendChartCard
                  title="Plan-wise Revenue"
                  subtitle="Revenue contribution per plan"
                  Icon={Wallet}
                  iconColor="text-emerald-600"
                  iconBg="bg-emerald-50"
                  data={dashboardExtras?.trends?.planRevenue || []}
                  xKey="title"
                  series={[
                    {
                      key: "revenue",
                      label: "Revenue",
                      // color: "hsl(212, 100%, 45%)",
                      color: "#5AA0C1", // primary3
                      type: "bar",
                    },
                  ]}
                />
                <TrendChartCard
                  title="Fitzone Session Completion"
                  subtitle="Assignment volume per period"
                  Icon={Dumbbell}
                  iconColor="text-rose-600"
                  iconBg="bg-rose-50"
                  data={dashboardExtras?.trends?.fitzoneCompletion || []}
                  xKey="date"
                  series={(
                    dashboardExtras?.trends?.fitzoneStatuses || ["Active"]
                  ).map((status, i) => ({
                    key: status,
                    label: status,
                    color: [
                      // "hsl(340, 82%, 60%)",
                      // "hsl(160, 84%, 39%)",
                      // "hsl(38, 92%, 50%)",
                      "#C03744", // logOutRed
                      "#15B097", // cardGreen
                      "#EDA145", // cardYellow
                    ][i % 3],
                    type: "bar",
                  }))}
                  note="Sessions only have an 'Active' status today — this chart will pick up a 'Completed' series automatically once the app starts writing one."
                />
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
            <div className="flex flex-col items-start gap-4 3xl:gap-6">
              <div className="flex flex-col items-start gap-1">
                <h2 className="text-base font-bold text-slate-900">
                  Follow-ups & Roster
                </h2>
                <p className="text-[11px] font-medium text-slate-500 leading-none">
                  Renewals, abandoned checkouts and platform admin/notification
                  activity
                </p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 3xl:gap-6 w-full items-stretch min-w-0">
                <DashboardTableCard
                  title="Recent Transactions"
                  subtitle="Latest 10"
                  Icon={Receipt}
                  iconColor="text-emerald-600"
                  iconBg="bg-emerald-50"
                  rows={dashboardExtras?.tables?.recentTransactions || []}
                  emptyMessage="No transactions yet."
                  columns={[
                    {
                      key: "sr_no",
                      label: "SR.No",
                      width: "w-[10%]",
                      render: (_, idx) => (
                        <span className="font-bold px-2 text-foreground/90">
                          {idx + 1}
                        </span>
                      ),
                    },
                    { key: "user_name", label: "User", width: "w-[20%]" },
                    { key: "plan_title", label: "Plan", width: "w-[15%]" },
                    {
                      key: "amount",
                      label: "Amount",
                      width: "w-[15%]",
                      render: (r) => `$${Number(r.amount).toLocaleString()}`,
                    },
                    {
                      key: "status",
                      label: "Status",
                      width: "w-[15%]",
                      render: (r) => <StatusPill status={r.status} />,
                    },
                    {
                      key: "created_at",
                      label: "Date",
                      width: "w-[15%]",
                      render: (r) =>
                        format(new Date(r.created_at), "MMM dd, HH:mm"),
                    },
                  ]}
                />

                <DashboardTableCard
                  title="Users Nearing Plan Expiry"
                  subtitle="Renewal follow-up list"
                  Icon={TrendingUp}
                  iconColor="text-amber-600"
                  iconBg="bg-amber-50"
                  rows={dashboardExtras?.tables?.expiringSoon || []}
                  emptyMessage="No plans expiring soon."
                  actionLabel="Renew"
                  onAction={(row) =>
                    navigate(`/admin/subscription-management/subscribers`, {
                      state: { user: row.name },
                    })
                  }
                  columns={[
                    {
                      key: "sr_no",
                      label: "SR.No",
                      width: "w-[10%]",
                      render: (_, idx) => (
                        <span className="font-bold text-foreground/90 px-2">
                          {idx + 1}
                        </span>
                      ),
                    },
                    { key: "name", label: "User", width: "w-[30%]" },
                    { key: "plan_title", label: "Plan", width: "w-[25%]" },
                    {
                      key: "expires_at",
                      label: "Expiry",
                      width: "w-[20%]",
                      render: (r) =>
                        format(new Date(r.expires_at), "MMM dd, yyyy"),
                    },
                    {
                      key: "days_left",
                      label: "Days Left",
                      width: "w-[15%]",
                      render: (r) => (
                        <span
                          className={`font-bold ${r.days_left <= 3 ? "text-red-600" : "text-amber-600"}`}
                        >
                          {r.days_left}d
                        </span>
                      ),
                    },
                  ]}
                />

                <DashboardTableCard
                  title="Pending / Abandoned Checkouts"
                  subtitle="Signed up but haven't paid in 24–48h"
                  Icon={Wallet}
                  iconColor="text-rose-600"
                  iconBg="bg-rose-50"
                  rows={dashboardExtras?.tables?.abandonedCheckouts || []}
                  emptyMessage="No abandoned checkouts right now."
                  actionLabel="Follow Up"
                  onAction={(row) =>
                    navigate(`/admin/users`, { state: { user: row.name } })
                  }
                  columns={[
                    {
                      key: "sr_no",
                      label: "SR.No",
                      width: "w-[10%]",
                      render: (_, idx) => (
                        <span className="font-bold px-2 text-foreground/90">
                          {idx + 1}
                        </span>
                      ),
                    },
                    { key: "name", label: "User", width: "w-[30%]" },
                    {
                      key: "signed_up_at",
                      label: "Signed Up",
                      width: "w-[30%]",
                      render: (r) =>
                        format(new Date(r.signed_up_at), "MMM dd, HH:mm"),
                    },
                    {
                      key: "hours_since_signup",
                      label: "Hours Since",
                      width: "w-[25%]",
                      render: (r) => `${r.hours_since_signup}h`,
                    },
                  ]}
                />

                <DashboardTableCard
                  title="Sub-Admin Roster"
                  subtitle="Managers & how many users they cover"
                  Icon={ShieldCheck}
                  iconColor="text-slate-700"
                  iconBg="bg-slate-100"
                  rows={dashboardExtras?.tables?.subAdminRoster || []}
                  emptyMessage="No sub-admins yet."
                  columns={[
                    {
                      key: "sr_no",
                      label: "SR.No",
                      width: "w-[15%]",
                      render: (_, idx) => (
                        <span className="font-bold px-2 text-foreground/90">
                          {idx + 1}
                        </span>
                      ),
                    },
                    { key: "name", label: "Name", width: "w-[30%]" },
                    {
                      key: "role",
                      label: "Role",
                      width: "w-[25%]",
                      render: (r) => (
                        <span className="capitalize">{r.role}</span>
                      ),
                    },
                    {
                      key: "managed_users",
                      label: "Users Managed",
                      width: "w-[25%]",
                      align: "center",
                      render: (r) => (
                        <span className="font-medium text-foreground/90 px-1">
                          {r.managed_users}
                        </span>
                      ),
                    },
                    {
                      key: "status",
                      label: "Status",
                      width: "w-[10%]",
                      render: (r) => <StatusPill status={r.status} />,
                    },
                  ]}
                />

                <DashboardTableCard
                  title="Recent Notifications Sent"
                  subtitle="Latest broadcast/push activity"
                  Icon={Bell}
                  iconColor="text-brand-blue"
                  iconBg="bg-blue-50"
                  rows={dashboardExtras?.tables?.recentNotifications || []}
                  emptyMessage="No notifications sent yet."
                  columns={[
                    {
                      key: "sr_no",
                      label: "SR.No",
                      width: "w-[15%]",
                      render: (_, idx) => (
                        <span className="font-bold text-foreground/90">
                          {idx + 1}
                        </span>
                      ),
                    },
                    { key: "title", label: "Title", width: "w-[40%]" },
                    {
                      key: "target_audience",
                      label: "Audience",
                      width: "w-[25%]",
                      render: (r) => (
                        <span className="capitalize">{r.target_audience}</span>
                      ),
                    },
                    {
                      key: "created_at",
                      label: "Sent",
                      width: "w-[20%]",
                      render: (r) =>
                        formatDistanceToNow(new Date(r.created_at), {
                          addSuffix: true,
                        }),
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
