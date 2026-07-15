import {
  differenceInDays,
  isToday,
  isYesterday,
  format,
  subDays,
} from "date-fns";

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Detect which preset the date range matches.
 * Returns: "today" | "yesterday" | "last7" | "last30" | "custom"
 */
function detectPreset(dateRange) {
  // If preset is explicitly provided, use it
  if (dateRange?.preset) return dateRange.preset;

  if (!dateRange?.from) return "last7"; // default

  const from = new Date(dateRange.from);
  const to = dateRange.to ? new Date(dateRange.to) : new Date();
  const days = differenceInDays(to, from);

  if (days === 0 && isToday(from)) return "today";
  if (days === 0 && isYesterday(from)) return "yesterday";
  if (days >= 2 && days <= 3 && isToday(to)) return "last3";
  if (days >= 6 && days <= 7 && isToday(to)) return "last7";
  if (days >= 29 && days <= 30 && isToday(to)) return "last30";
  return "custom";
}

/**
 * Returns a comparison context label based on date range preset.
 * e.g., "vs yesterday", "vs previous 7 days"
 */
function getContextLabel(preset) {
  switch (preset) {
    case "today":
      return "vs yesterday";
    case "yesterday":
      return "vs day before";
    case "last3":
      return "vs previous 3 days";
    case "last7":
      return "vs previous 7 days";
    case "last30":
      return "vs previous 30 days";
    case "custom":
    default:
      return "vs previous period";
  }
}

/**
 * Returns a human-readable period label.
 * e.g., "Today", "Last 7 Days", "Apr 01 – Apr 08, 2026"
 */
function getPeriodLabel(dateRange, preset) {
  switch (preset) {
    case "today":
      return "Today";
    case "yesterday":
      return "Yesterday";
    case "last3":
      return "Last 3 Days";
    case "last7":
      return "Last 7 Days";
    case "last30":
      return "Last 30 Days";
    case "custom":
    default: {
      const from = dateRange?.from
        ? new Date(dateRange.from)
        : subDays(new Date(), 7);
      const to = dateRange?.to ? new Date(dateRange.to) : new Date();
      return `${format(from, "MMM dd")} – ${format(to, "dd MMM, yyyy")}`;
    }
  }
}

/**
 * Returns a revenue period label for display.
 */
function getRevenuePeriodLabel(preset) {
  switch (preset) {
    case "today":
      return "Today's";
    case "yesterday":
      return "Yesterday's";
    case "last3":
      return "Last 3 days";
    case "last7":
      return "Last 7 days";
    case "last30":
      return "Last 30 days";
    case "custom":
    default:
      return "Selected period";
  }
}

/**
 * Returns a section title prefix for the glance zone.
 */
function getGlanceTitle(preset) {
  switch (preset) {
    case "today":
      return "Today at a glance";
    case "yesterday":
      return "Yesterday at a glance";
    case "last3":
      return "Last 3 days at a glance";
    case "last7":
      return "Last 7 days at a glance";
    case "last30":
      return "Last 30 days at a glance";
    case "custom":
    default:
      return "Period at a glance";
  }
}

/**
 * Randomizes a number within a variance percentage for variety.
 */
function randomize(base, variancePercent = 15) {
  const variance = base * (variancePercent / 100);
  return Math.round(base + (Math.random() * 2 - 1) * variance);
}

/**
 * Generates slightly different sparkline chart data.
 */
function randomizeChartData(baseData, variancePercent = 20) {
  return baseData.map((val) => randomize(val, variancePercent));
}

/**
 * Returns days array based on preset for gender growth chart.
 */
function getGrowthDays(preset) {
  switch (preset) {
    case "today":
      return [{ day: "Today" }];
    case "yesterday":
      return [{ day: "Yesterday" }];
    case "last30":
      return [
        { day: "Week 1" },
        { day: "Week 2" },
        { day: "Week 3" },
        { day: "Week 4" },
      ];
    case "last7":
    case "custom":
    default:
      return [
        { day: "Mon" },
        { day: "Tue" },
        { day: "Wed" },
        { day: "Thu" },
        { day: "Fri" },
        { day: "Sat" },
        { day: "Sun" },
      ];
  }
}

// ─── Builder Functions ─────────────────────────────────────────────────────────

function buildZoneAStats(contextLabel, preset) {
  const revenueBase =
    preset === "today"
      ? 84
      : preset === "last7"
        ? 520
        : preset === "last30"
          ? 2100
          : 84;
  const revenueVal = `${randomize(revenueBase, 15)}k`;

  const getTrend = () => `${(randomize(120, 40) / 10).toFixed(1)}%`;

  const usersBase =
    preset === "today" ? 50 : preset === "last7" ? 350 : preset === "last30" ? 1400 : 50;
  const activeBase = Math.round(usersBase * 0.8);
  const premiumBase = Math.round(usersBase * 0.33);

  return {
    title: getGlanceTitle(preset),
    stats: [
      {
        label: "Revenue",
        value: `$${revenueVal}`,
        sub: contextLabel,
        trend: getTrend(),
        isPositive: true,
        icon: "Sparkles",
        color: "emerald",
      },
      {
        label: "MRR",
        value: `$${randomize(5000, 15)}`,
        sub: "Monthly Recurring Revenue",
        trend: getTrend(),
        isPositive: true,
        icon: "TrendingUp",
        color: "blue",
      },
      {
        label: "Total Users",
        value: String(randomize(usersBase, 15)),
        sub: contextLabel,
        trend: getTrend(),
        isPositive: true,
        icon: "Users",
        color: "orange",
      },
      {
        label: "Active Users",
        value: String(randomize(activeBase, 15)),
        sub: "Currently active",
        trend: getTrend(),
        isPositive: true,
        icon: "Activity",
        color: "cyan",
      },
      {
        label: "Premium Subs",
        value: String(randomize(premiumBase, 15)),
        sub: `Conversion: ${randomize(33, 10)}%`,
        trend: getTrend(),
        isPositive: true,
        icon: "Star",
        color: "sky",
      },
    ],
  };
}

// buildZoneBAlerts removed — KYC, Reported Users, Ghosting not applicable to this app
function buildZoneBAlerts() {
  return { alerts: [] };
}

function buildZoneCMetrics(periodLabel, preset) {
  return {
    metrics: [
      {
        label: "Gender Ratio",
        value: `${randomize(180, 20)} : ${randomize(120, 20)}`,
        subtitle: "Distribution of male vs female users",
        iconName: "LuUsersRound",
        iconColor: "text-indigo-600",
        iconBg: "bg-indigo-50",
        sub: "Male : Female",
        isRatio: true,
        ratioValue: 62,
        maleCount: 186,
        femaleCount: 114,
      },
    ],
  };
}

function buildGenderGrowth(dateRange, preset) {
  const days = getGrowthDays(preset);
  const multiplier =
    preset === "last30"
      ? 4
      : preset === "today" || preset === "yesterday"
        ? 0.15
        : 1;

  const data = days.map((d) => ({
    day: d.day,
    male: randomize(Math.round(340 * multiplier), 20),
    female: randomize(Math.round(210 * multiplier), 20),
  }));

  const subtitleMap = {
    today: "Signups so far today",
    yesterday: "Yesterday's signups",
    last3: "Signups for the last 3 days",
    last7: "Daily signups for the last 7 days",
    last30: "Weekly signups for the last 30 days",
    custom: "Signups during selected period",
  };

  return {
    subtitle: subtitleMap[preset] || subtitleMap.last7,
    insight: `Male signups are up ${randomize(18, 30)}% this ${preset === "last30" ? "month" : "week"}`,
    data,
  };
}

function buildRevenueBreakdown(periodLabel, preset) {
  const totalBase =
    preset === "today"
      ? 84
      : preset === "last7"
        ? 520
        : preset === "last30"
          ? 2100
          : randomize(84, 30);

  const subsPct = randomize(39, 10);
  const boostPct = randomize(31, 10);
  const superPct = 100 - subsPct - boostPct;

  const subsVal = Math.round(totalBase * 1000 * (subsPct / 100));
  const boostVal = Math.round(totalBase * 1000 * (boostPct / 100));
  const superVal = Math.round(totalBase * 1000 * (superPct / 100));

  const formatVal = (v) =>
    v >= 100000 ? `${(v / 100000).toFixed(1)}L` : `${Math.round(v / 1000)}k`;

  return {
    subtitle: `${getRevenuePeriodLabel(preset)} revenue by source`,
    total: String(totalBase),
    insight: `Boosts contribute ${boostPct}% of ${getRevenuePeriodLabel(preset).toLowerCase()} revenue`,
    categories: [
      {
        label: "Subscriptions",
        value: subsVal,
        displayValue: formatVal(subsVal),
        percentage: subsPct,
        color: "hsl(182 59% 75%)",
      },
      {
        label: "Profile Boost",
        value: boostVal,
        displayValue: formatVal(boostVal),
        percentage: boostPct,
        color: "hsl(182 59% 54%)",
      },
      {
        label: "Superkeen",
        value: superVal,
        displayValue: formatVal(superVal),
        percentage: superPct,
        color: "hsl(182 59% 35%)",
      },
    ],
  };
}

function buildLiveActivity() {
  // Live activity is always "now" — not affected by date range
  return {
    subtitle: "Important events happening now",
    events: [
      {
        id: 1,
        time: "just now",
        description: "New user registered",
        color: "#46C7CD",
      },
      {
        id: 2,
        time: "1m ago",
        description: "User #4821 subscribed to Premium plan",
        color: "#780DCC",
      },
      {
        id: 3,
        time: "3m ago",
        description: "New program assigned to User #3302",
        color: "#46C7CD",
      },
      {
        id: 4,
        time: "5m ago",
        description: "User #5511 completed Fitzone session",
        color: "#46C7CD",
      },
      {
        id: 5,
        time: "8m ago",
        description: "New blog published: Healthy Diet Tips",
        color: "#46C7CD",
      },
    ],
  };
}

// ConversionFunnel removed — App Installs, Swipes not applicable to fitness app
function buildConversionFunnel() {
  return { subtitle: "", insight: "", stages: [] };
}

function buildActivityHeatmap() {
  // Heatmap is general pattern — not heavily date-dependent
  return {
    subtitle: "When your users are most active",
    insight: "Peak activity: 7PM - 10PM • Best day: Friday",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    times: ["3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm", "12am"],
    data: [
      [1, 1, 1, 1, 2, 3, 3, 2],
      [1, 2, 1, 1, 2, 3, 3, 2],
      [1, 1, 1, 2, 2, 3, 3, 2],
      [1, 1, 1, 2, 3, 3, 3, 3],
      [1, 1, 2, 2, 2, 3, 3, 2],
      [1, 2, 1, 1, 2, 3, 3, 2],
      [1, 1, 1, 2, 2, 2, 3, 2],
    ],
  };
}

// PerformanceInsights removed — Boost ROI, Super Keen, match rate not applicable
function buildPerformanceInsights() {
  return { subtitle: "", insight: "", metrics: [] };
}

// ─── Main Factory Function ─────────────────────────────────────────────────────

/**
 * Generate dashboard data based on a date range.
 * When backend API is ready, this function will be replaced by the actual API call.
 *
 * @param {Object} dateRange - { from: Date, to: Date, preset?: string }
 * @returns {{ success: boolean, meta: Object, data: Object }}
 */
export function getDashboardData(dateRange) {
  const preset = detectPreset(dateRange);
  const contextLabel = getContextLabel(preset);
  const periodLabel = getPeriodLabel(dateRange, preset);

  return {
    success: true,
    meta: {
      dateRange,
      preset,
      periodLabel,
      contextLabel,
    },
    data: {
      zoneA: buildZoneAStats(contextLabel, preset),
      zoneB: buildZoneBAlerts(contextLabel, preset),
      zoneC: buildZoneCMetrics(periodLabel, preset),
      genderGrowth: buildGenderGrowth(dateRange, preset),
      revenueBreakdown: buildRevenueBreakdown(periodLabel, preset),
      liveActivity: buildLiveActivity(),
      conversionFunnel: buildConversionFunnel(periodLabel, preset),
      activityHeatmap: buildActivityHeatmap(),
      performanceInsights: buildPerformanceInsights(periodLabel, preset),
      userDistribution: {
        active: 62,
        inactive: 38,
      },
    },
  };
}

// ─── Static Fallback (initial load before any date selection) ──────────────────

export const dummyDashboardData = getDashboardData({ preset: "today" });
