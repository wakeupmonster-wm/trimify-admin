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
  Target,
  Users2,
  Salad,
  TrendingUp,
  Activity as ActivityIcon,
  Dumbbell,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { ConversionFunnel } from "../components/ConversionFunnel";
import SecondaryKpiRow from "../components/SecondaryKpiRow";
import { EcosystemAlerts } from "../components/EcosystemAlerts";
import LastUpdatedIndicator from "../components/LastUpdatedIndicator";
import DonutStatCard from "../components/DonutStatCard";
import TrendChartCard from "../components/TrendChartCard";
// import FitzoneAssignmentChips from "../components/FitzoneAssignmentChips";
import ProgramEnrollmentCard from "../components/ProgramEnrollmentCard";
import DashboardTableCard from "../components/DashboardTableCard";
import { format } from "date-fns";
import { cn, formatAppDate } from "@/lib/utils";
import { TableLoader } from "@/app/loader/table.loader";
import { ACCENT_COLORS, SECTION_CHART_COLORS } from "@/config/theme.config.js";

const LoadingOverlay = motion.div;

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    dashboardExtras,
    dashboardMeta,
    dateRange,
    lastUpdated,
    error,
  } = useSelector((state) => state.dashboard);
  const displayExtras = dashboardExtras;

  const [selectedDate, setSelectedDate] = useState(
    dateRange || { preset: "today" },
  );
  const [refreshing, setRefreshing] = useState(false);
  const hasLoadedDashboard = useRef(false);

  // --- Unified Brand Palette imported from theme.config.js ---
  const FRONTEND_USER_GOALS = [
    "Weight Loss",
    "Gain Muscle",
    "Maintain Weight",
    "Manage Diabetes",
    "Manage Hypertension",
    "Prevent Chronic Disease",
  ];

  const mapUserGoals = (dataArray) => {
    const counts = {};
    (dataArray || []).forEach((item) => {
      const raw = (item.label || item.name || "").trim();
      if (!raw) return;
      const lower = raw.toLowerCase().replace(/_/g, " ");
      if (
        lower.includes("unspecified") ||
        lower === "none" ||
        lower === "other"
      ) {
        return; // Exclude Unspecified completely
      }
      let matchedGoal = null;
      if (lower === "lose weight" || lower === "weight loss")
        matchedGoal = "Weight Loss";
      else if (lower === "gain muscle" || lower === "muscle gain")
        matchedGoal = "Gain Muscle";
      else if (
        lower === "maintain weight" ||
        lower === "weight maintenance"
      )
        matchedGoal = "Maintain Weight";
      else if (lower.includes("diabetes"))
        matchedGoal = "Manage Diabetes";
      else if (lower.includes("hypertension"))
        matchedGoal = "Manage Hypertension";
      else if (lower.includes("chronic"))
        matchedGoal = "Prevent Chronic Disease";
      else {
        matchedGoal =
          FRONTEND_USER_GOALS.find((g) => g.toLowerCase() === lower) || raw;
      }

      if (matchedGoal) {
        counts[matchedGoal] =
          (counts[matchedGoal] || 0) + (Number(item.value) || 0);
      }
    });

    const goalColors = SECTION_CHART_COLORS?.dashboard?.userGoals || [
      "#007fc0",
      "#009dee",
      "#1cb2ff",
      "#3dc1ff",
      "#49c1ff",
      "#77d1ff",
    ];

    return FRONTEND_USER_GOALS.map((goal) => ({
      label: goal,
      value: counts[goal] || 0,
    }))
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
      .map((item, i) => ({
        ...item,
        color: goalColors[i % goalColors.length],
      }));
  };

  const mapGenderColors = (dataArray) => {
    const raw = Array.isArray(dataArray) ? dataArray : [];
    const COLOR_MALE =
      SECTION_CHART_COLORS?.dashboard?.gender?.male || "#007fc0";
    const COLOR_FEMALE =
      SECTION_CHART_COLORS?.dashboard?.gender?.female || "#3dc1ff";
    const COLOR_OTHER =
      SECTION_CHART_COLORS?.dashboard?.gender?.other || "#D9E0E6";

    const maleItem = raw.find(
      (item) => (item.label || item.name || "").toLowerCase() === "male",
    );
    const femaleItem = raw.find(
      (item) => (item.label || item.name || "").toLowerCase() === "female",
    );
    const otherItem = raw.find((item) => {
      const lbl = (item.label || item.name || "").toLowerCase();
      return (
        lbl === "other" ||
        lbl === "others" ||
        lbl === "unspecified" ||
        lbl === "unknown" ||
        lbl === "none"
      );
    });

    return [
      {
        label: "Male",
        value: maleItem ? Number(maleItem.value) || 0 : 0,
        color: COLOR_MALE,
      },
      {
        label: "Female",
        value: femaleItem ? Number(femaleItem.value) || 0 : 0,
        color: COLOR_FEMALE,
      },
      {
        label: "Other",
        value: otherItem ? Number(otherItem.value) || 0 : 0,
        color: COLOR_OTHER,
      },
    ];
  };

  const mapDietColors = (dataArray) => {
    if (!dataArray) return [];
    return dataArray
      .filter((item) => {
        const lbl = (item.label || item.name || "").toLowerCase().trim();
        return (
          lbl !== "" &&
          !lbl.includes("unspecified") &&
          !lbl.includes("other") &&
          !lbl.includes("none") &&
          !lbl.includes("unknown")
        );
      })
      .map((item) => {
        const lbl = item.label.toLowerCase();
        let color = SECTION_CHART_COLORS?.dashboard?.diet?.veg || "#007fc0";
        if (lbl.includes("non")) {
          color = SECTION_CHART_COLORS?.dashboard?.diet?.nonVeg || "#3dc1ff";
        }
        return { ...item, color };
      });
  };

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
      const isSubsequentLoad = hasLoadedDashboard.current;
      if (isSubsequentLoad) setRefreshing(true);
      try {
        await dispatch(fetchDashboardExtras(buildDateRangeParams(dateObj)));
      } catch (err) {
        console.error("Dashboard manual refresh failed:", err);
      } finally {
        hasLoadedDashboard.current = true;
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
  };
  const dynamicPeriodLabel =
    selectedDate?.preset && PRESET_LABELS[selectedDate.preset]
      ? PRESET_LABELS[selectedDate.preset]
      : selectedDate?.from
        ? `${formatAppDate(selectedDate.from)} - ${formatAppDate(selectedDate.to || selectedDate.from)}`
        : dashboardMeta?.periodLabel;
  const isShortPeriod =
    selectedDate?.preset === "today" || selectedDate?.preset === "yesterday";
  const extendedSubtitleSuffix = isShortPeriod
    ? ""
    : ` by ${dynamicPeriodLabel}`;

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
  if (error && !displayExtras) {
    return (
      <div className="flex flex-1 flex-col font-sans bg-slate-50 min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Failed to load Dashboard Data
          </h2>
          <p className="text-sm text-slate-500 max-w-sm">
            {typeof error === "string"
              ? error
              : "An unknown error occurred while fetching dashboard data."}
          </p>
          <Button
            onClick={handleManualRefresh}
            variant="outline"
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Show full-page skeleton until the first backend response populates the dashboard.
  // After data exists, subsequent date-change refreshes show the TableLoader overlay instead.
  if (!displayExtras) {
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
          {refreshing && displayExtras && (
            <LoadingOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[60]"
            >
              <TableLoader text="Updating Results..." />
            </LoadingOverlay>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full flex-wrap">
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

          <div className="flex flex-col gap-4 3xl:gap-6 py-5 px-4 lg:px-6 w-full">
            <div className="w-full flex-col gap-4 md:gap-6 flex min-w-0">
              <SecondaryKpiRow
                data={displayExtras?.secondaryKpis}
                title={displayExtras?.title}
                dateRange={selectedDate}
                contextLabel={dashboardMeta?.contextLabel}
              />
              <EcosystemAlerts
                data={{ alerts: displayExtras?.alerts || [] }}
                selectedDate={selectedDate}
              />
            </div>

            {/* Composition — pie/donut breakdowns */}
            <div className="flex flex-col items-start gap-4 3xl:gap-6">
              <div className="flex flex-col items-start pt-2 gap-1">
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
                  title="Vegetarian vs Non-veg"
                  subtitle={`Dietary preference split by ${dynamicPeriodLabel}`}
                  Icon={Salad}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                  data={mapDietColors(
                    displayExtras?.pieCharts?.dietPreference || [],
                  )}
                />
                <DonutStatCard
                  title="Gender Distribution"
                  subtitle={`Male vs Female user breakdown by ${dynamicPeriodLabel}`}
                  Icon={Users2}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                  data={mapGenderColors(displayExtras?.pieCharts?.gender || [])}
                />
                <DonutStatCard
                  title="User Goal Distribution"
                  subtitle={`Primary fitness goal by ${dynamicPeriodLabel}`}
                  Icon={Target}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                  data={mapUserGoals(
                    displayExtras?.pieCharts?.userGoals || [],
                  )}
                  scrollableLegend
                />
                <ConversionFunnel data={displayExtras?.funnel} />
              </div>
            </div>

            {/* Trends — everything not already covered by Signups/Revenue/Heatmap above */}
            <div className="flex flex-col items-start gap-4 3xl:gap-6">
              <div className="flex flex-col items-start pt-2 gap-1">
                <h2 className="text-base font-bold text-slate-900">Trends</h2>
                <p className="text-[11px] font-medium text-slate-500 leading-none">
                  Change over time, grouped to match the selected date range
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 3xl:gap-6 w-full items-stretch min-w-0">
                {/* <TrendChartCard
                  title="Engagement Trend (DAU)"
                  subtitle={`Users logging food / water / steps / weight ${dynamicPeriodLabel}`}
                  Icon={ActivityIcon}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                  data={displayExtras?.trends?.engagementDAU || []}
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
                /> */}

                <TrendChartCard
                  title="Engagement Trend (DAU)"
                  subtitle={`Users logging food / water / steps / weight ${extendedSubtitleSuffix}`}
                  Icon={ActivityIcon}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                  data={displayExtras?.trends?.engagementDAU || []}
                  xKey="date"
                  periodLabel={dynamicPeriodLabel}
                  series={[
                    {
                      key: "active_users",
                      label: "Daily Active Users",
                      color: SECTION_CHART_COLORS?.dashboard?.dauTrend || "#007fc0",
                      type: "area",
                    },
                  ]}
                  note="Count of unique users who logged their diet, water, steps, or weight on a specific day."
                  focusTimeline
                />

                <TrendChartCard
                  title="Fitzone Users Assigned"
                  subtitle={`Unique users with a usable Fitzone category ${extendedSubtitleSuffix}`}
                  Icon={Dumbbell}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                  data={displayExtras?.trends?.fitzoneCompletion || []}
                  xKey="date"
                  periodLabel={dynamicPeriodLabel}
                  hideLegend={true}
                  series={(displayExtras?.trends?.fitzoneStatuses || []).map((status, i) => {
                    const fitzoneColors =
                      SECTION_CHART_COLORS?.dashboard?.fitzone || [
                        "#009dee",
                        "#49c1ff",
                        "#a4e0ff",
                      ];
                    return {
                      key: status,
                      label: status === "assigned_users" ? "Users Assigned" : status,
                      color: fitzoneColors[i % fitzoneColors.length],
                      type: "bar",
                    };
                  })}
                  note="Counts each user once per displayed day, week or month after an admin assigns them an active Fitzone category with an active workout session."
                />
                <ProgramEnrollmentCard
                  title="Program Enrollment Split"
                  subtitle={`Top 5 ranked programs${extendedSubtitleSuffix}`}
                  Icon={TrendingUp}
                  iconColor="text-slate-600"
                  iconBg="bg-slate-100/50"
                  data={displayExtras?.trends?.popularPrograms || []}
                />

                <div className="w-full h-full min-h-[320px]">
                  <DashboardTableCard
                    title="Recent Joined Users"
                    subtitle="Latest registrations from the past 15 days"
                    Icon={Users2}
                    iconColor="text-slate-600"
                    iconBg="bg-slate-100/50"
                    rows={displayExtras?.tables?.recentUsers || []}
                    emptyMessage="No users joined in the last 15 days."
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
                              ? formatAppDate(r.created_at)
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

            {/* Drill-down lists */}
            <div className="flex flex-col items-start pt-2 gap-4 3xl:gap-6">
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
                    subtitle={`Signed up but haven't paid in 7+ days`}
                    Icon={Wallet}
                    iconColor="text-slate-600"
                    iconBg="bg-slate-100/50"
                    rows={displayExtras?.tables?.abandonedCheckouts || []}
                    emptyMessage="No abandoned checkouts right now."
                    actionLabel="Follow Up"
                    onAction={(row) =>
                      navigate(
                        `/admin/users/view-user/${row.id || row.user_id}`,
                      )
                    }
                    columns={[
                      {
                        key: "sr_no",
                        label: "Sr. No.",
                        width: "w-[10%]",
                        align: "left",
                        render: (_, idx) => (
                          <span className="text-slate-500 text-left px-0 font-medium">
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
                      {
                        key: "signed_up_at",
                        label: "Signed Up",
                        width: "w-[15%]",
                        align: "left",
                        render: (r) =>
                          format(new Date(r.signed_up_at), "dd MMM yyyy, HH:mm"),
                      },
                      {
                        key: "days_since_signup",
                        label: "Days Since",
                        width: "w-[15%]",
                        align: "left",
                        render: (r) => (
                          <span className="px-1">{`${r.days_since_signup}d`}</span>
                        ),
                      },
                      {
                        key: "main_goal",
                        label: "Goal",
                        width: "w-[15%]",
                        align: "left",
                        render: (r) => (
                          <span className="capitalize px-1">{r.main_goal}</span>
                        ),
                      },
                      {
                        key: "gender",
                        label: "Gender",
                        width: "w-[15%]",
                        align: "left",
                        render: (r) => (
                          <span className="capitalize px-1">{r.gender}</span>
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
