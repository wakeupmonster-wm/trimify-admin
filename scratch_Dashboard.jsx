import { CalendarDateRangePicker } from "@/components/shared/date-range-picker";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  fetchDashboardExtras,
  setDashboardDateRange,
} from "../store/dashboard.slice";
import { PageHeader } from "@/components/common/headSubhead";
import {
  LayoutDashboard,
  Target,
  Users2,
  Salad,
  Activity as ActivityIcon,
  Wallet,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { ConversionFunnel } from "../components/ConversionFunnel";
import { TopKpiRow } from "../components/TopKpiRow";
import LastUpdatedIndicator from "../components/LastUpdatedIndicator";
import DonutStatCard from "../components/DonutStatCard";
import TrendChartCard from "../components/TrendChartCard";
import QuickAlertBanner from "../components/QuickAlertBanner";
import { MemberHealthAttentionCenter } from "../components/MemberHealthAttentionCenter";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TableLoader } from "@/app/loader/table.loader";
import { ACCENT_COLORS, APP_COLORS } from "@/config/theme.config.js";
import DashboardTableCard from "../components/DashboardTableCard";
import { dashboardUnifiedColumns } from "@/components/columns/dashboard.unified.columns";

// ─── Section Header ──────────────────────────────────────────────────────────
const SectionHeader = ({ title, subtitle, Icon }) => (
  <div className="flex items-start gap-3">
    {Icon && (
      <div className="w-8 h-8 rounded-lg bg-app-primary2/10 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-app-primary2" strokeWidth={2} />
      </div>
    )}
    <div>
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
      {subtitle && (
        <p className="text-[11px] font-medium text-slate-500 leading-none mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

// ─── Dashboard Section Wrapper ────────────────────────────────────────────────
const Section = ({ title, subtitle, Icon, children }) => (
  <div className="flex flex-col gap-5">
    <SectionHeader title={title} subtitle={subtitle} Icon={Icon} />
    {children}
  </div>
);

const mapChartColors = (dataArray) => {
  if (!dataArray) return [];
  return dataArray.map((item, i) => ({
    ...item,
    color: APP_COLORS[i % APP_COLORS.length],
  }));
};

const mapAccentColors = (dataArray) => {
  if (!dataArray) return [];
  return dataArray.map((item, i) => ({
    ...item,
    color: ACCENT_COLORS[i % ACCENT_COLORS.length],
  }));
};

const mapGenderColors = (dataArray) => {
  if (!dataArray) return [];
  return dataArray.map((item) => {
    let color = "#cbd5e1"; // Slate for Other/Unspecified
    if (item.label === "Male")
      color = "#3b82f6"; // Blue
    else if (item.label === "Female") color = "#ec4899"; // Pink
    return { ...item, color };
  });
};

const mapDietColors = (dataArray) => {
  if (!dataArray) return [];
  return dataArray.map((item) => {
    let color = "#94a3b8"; // Slate for Unspecified
    const lbl = item.label.toLowerCase();
    if (lbl === "veg" || lbl === "vegetarian")
      color = "#10b981"; // Green
    else if (lbl === "non-veg" || lbl === "non-vegetarian") color = "#ef4444"; // Red
    return { ...item, color };
  });
};

const mapSubscriptionHealthColors = (dataArray) => {
  if (!dataArray) return [];
  return dataArray.map((item) => {
    let color = "#94a3b8"; // Slate
    const lbl = item.label.toLowerCase();
    if (lbl === "healthy")
      color = "#10b981"; // Emerald
    else if (lbl === "expiring soon")
      color = "#f59e0b"; // Amber
    else if (lbl === "expired") color = "#ef4444"; // Red
    return { ...item, color };
  });
};

const buildDateRangeParams = (dateObj) => ({
  preset: dateObj?.preset || "today",
  from: dateObj?.from ? format(new Date(dateObj.from), "yyyy-MM-dd") : null,
  to: dateObj?.to ? format(new Date(dateObj.to), "yyyy-MM-dd") : null,
});

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { dashboardExtras, dashboardMeta, dateRange, lastUpdated } =
    useSelector((state) => state.dashboard);

  const [selectedDate, setSelectedDate] = useState(
    dateRange || { preset: "today" },
  );
  const [refreshing, setRefreshing] = useState(false);

  // ─── Dashboard Fetch Lifecycle ────────────────────────────────────────────
  useEffect(() => {
    if (!selectedDate) return;
    const refreshData = async (dateObj) => {
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

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchDashboardExtras(buildDateRangeParams(selectedDate)));
    } finally {
      setRefreshing(false);
    }
  };

  const PRESET_LABELS = {
    today: "Today",
    yesterday: "Yesterday",
    last7: "Last 7 Days",
    last30: "Last 30 Days",
    last90: "Last 90 Days",
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
      setScrolled(currentScrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });
    return () =>
      window.removeEventListener("scroll", handleScroll, { capture: true });
  }, []);

  const extras = dashboardExtras?.zone1
    ? {
        ...dashboardExtras.zone1,
        ...dashboardExtras.zone2,
        ...dashboardExtras.zone3,
        ...dashboardExtras.zone4,
        ...dashboardExtras.zone5,
      }
    : dashboardExtras;

  const healthAttentionData = useMemo(() => {
    if (!extras) return null;
    let matrix = extras?.healthAttentionCenter?.matrix || [];

    if (!matrix.some((m) => m.metric.includes("BMI"))) {
      const bmiData = extras?.pieCharts?.bmiDistribution || [];
      const healthyBmi =
        bmiData.find(
          (d) =>
            d.label.toLowerCase() === "healthy" ||
            d.label.toLowerCase() === "normal",
        )?.value || 0;
      const noDataBmi =
        bmiData.find((d) => d.label.toLowerCase() === "unspecified")?.value ||
        0;
      const totalBmi = bmiData.reduce((acc, curr) => acc + curr.value, 0);
      const needsAttentionBmi = totalBmi - healthyBmi - noDataBmi;

      if (totalBmi > 0) {
        matrix = [
          ...matrix,
          {
            metric: "BMI (Healthy Range)",
            onTrack: healthyBmi,
            needsAttention: needsAttentionBmi > 0 ? needsAttentionBmi : 0,
            noData: noDataBmi,
          },
        ];
      }
    }

    return {
      ...extras?.healthAttentionCenter,
      matrix,
    };
  }, [extras]);

  const mergedTableData = useMemo(() => {
    return Array.from(
      new Map(
        [...(extras?.tables?.usersList || [])].map((item) => [item.id, item]),
      ).values(),
    ).sort((a, b) => {
      // Show attention required first
      const aNeedsAttention =
        (a.reasons && a.reasons.length > 0) || !a.email_verified_at ? 1 : 0;
      const bNeedsAttention =
        (b.reasons && b.reasons.length > 0) || !b.email_verified_at ? 1 : 0;
      if (aNeedsAttention !== bNeedsAttention)
        return bNeedsAttention - aNeedsAttention;
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [extras?.tables?.usersList]);

  // ─── Initial Load Guard ───────────────────────────────────────────────────
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
        {/* Refreshing overlay */}
        <AnimatePresence>
          {refreshing && extras && (
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
          {/* ── Sticky Header ─────────────────────────────────────────────── */}
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

          {/* ── Dashboard Body ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-8 py-3 pb-6 px-4 lg:px-6 w-full">
            {/* ── Section 1: KPI Overview ──────────────────────────────────── */}
            <TopKpiRow
              data={extras?.kpis}
              title={extras?.title}
              periodLabel={dynamicPeriodLabel}
            />

            {/* ── Section 2: Alerts ────────────────────────────────────────── */}
            <Section
              title="Alerts"
              subtitle="Critical alerts and notifications"
            >
              <div className="flex flex-col gap-4 w-full">
                {extras?.alerts?.length > 0 && (
                  <QuickAlertBanner alerts={extras.alerts} />
                )}
                {/* 
                Removed Priority Follow-ups table from here as requested.
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                  <PriorityFollowUpWidget ... />
                </div>
                */}
              </div>
            </Section>

            {/* ── Section 3: Goal Distribution & DAU ───────────────────────── */}
            <Section
              title="Goal Distribution & DAU"
              subtitle="Fitness goals and daily active users"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full items-start">
                <DonutStatCard
                  title="Goal Distribution"
                  subtitle={`Primary fitness goals across members for ${dynamicPeriodLabel.toLowerCase()}`}
                  Icon={Target}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                  data={mapAccentColors(extras?.goalDistribution || [])}
                />
                <TrendChartCard
                  title="Daily Active Users (DAU)"
                  subtitle={`Unique users logging food / water / steps / weight for ${dynamicPeriodLabel.toLowerCase()}`}
                  Icon={ActivityIcon}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                  data={extras?.trends?.engagementDAU || []}
                  xKey="date"
                  periodLabel={dynamicPeriodLabel}
                  datePreset={selectedDate?.preset || "custom"}
                  focusTimeline={true}
                  series={[
                    {
                      key: "active_users",
                      label: "Active Users",
                      color: "#007FC0",
                      type: "area",
                    },
                    // {
                    //   key: "inactive_users",
                    //   label: "Inactive Users",
                    //   color: "#94A3B8",
                    //   type: "line",
                    // },
                  ]}
                  note="How many unique members tracked at least one metric on a given day."
                />
              </div>
            </Section>

            {/* ── Section 4: Subscription Health & Dietary Preference ──────── */}
            <Section
              title="Subscription Health & Dietary Preference"
              subtitle="Account renewal risk and dietary preferences"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full items-start">
                <DonutStatCard
                  title="Subscription Health"
                  subtitle={`Account renewal risk overview for ${dynamicPeriodLabel.toLowerCase()}`}
                  Icon={Wallet}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                  data={mapSubscriptionHealthColors(
                    extras?.subscriptionHealth
                      ? [
                          {
                            label: "Healthy",
                            value: extras.subscriptionHealth.healthy,
                          },
                          {
                            label: "Expiring Soon",
                            value: extras.subscriptionHealth.expiring,
                          },
                          {
                            label: "Expired",
                            value: extras.subscriptionHealth.expired,
                          },
                        ]
                      : [],
                  )}
                />
                <DonutStatCard
                  title="Dietary Preference"
                  subtitle={`Vegetarian vs Non-Vegetarian split for ${dynamicPeriodLabel.toLowerCase()}`}
                  Icon={Salad}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                  tooltipText="Users who haven't filled in this field are tracked as Unspecified."
                  data={mapDietColors(extras?.pieCharts?.dietPreference || [])}
                />
              </div>
            </Section>

            {/* ── Section 5: Member Health & Attention Center ──────────────── */}
            <Section
              title="Member Health & Attention Center"
              subtitle="Overview of member health and goal progress"
            >
              <MemberHealthAttentionCenter
                data={healthAttentionData}
                matrixSubtitle={`Member status against their goals for ${dynamicPeriodLabel.toLowerCase()}`}
                attentionSubtitle={`Top issues that require your attention for ${dynamicPeriodLabel.toLowerCase()}`}
              />
            </Section>

            {/* ── Section 6: Gender Distribution & Conversion Funnel ───────── */}
            <Section
              title="Gender Distribution & Conversion Funnel"
              subtitle="Demographics and plan conversions"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full items-start">
                <DonutStatCard
                  title="Gender Distribution"
                  subtitle={`Male vs Female breakdown for ${dynamicPeriodLabel.toLowerCase()}`}
                  Icon={Users2}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                  data={mapGenderColors(extras?.pieCharts?.gender || [])}
                />
                <ConversionFunnel data={extras?.funnel} />
              </div>
            </Section>

            {/* ── Section 8: Member Roster ───── */}
            <Section
              title="Member Roster"
              subtitle="Manage and track your assigned users and their current status"
            >
              <div className="w-full">
                <DashboardTableCard
                  title="Priority Follow-ups"
                  subtitle="Consolidated overview of all assigned members, including those requiring attention"
                  Icon={Users2}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                  rows={mergedTableData}
                  emptyMessage="No assigned users right now."
                  actionLabel="View"
                  onAction={(row) => navigate(`/users/view-user/${row.id}`)}
                  columns={dashboardUnifiedColumns}
                />
              </div>
            </Section>
          </div>
        </div>
      </div>
    </>
  );
}
