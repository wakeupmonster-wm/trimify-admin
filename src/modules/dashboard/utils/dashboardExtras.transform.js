// Transforms the real GET /admin/dashboard/* + /admin/subscription/* payloads
// (see AI/backend contract, 2026-07-17) into the exact shapes the dashboard
// widgets (SecondaryKpiRow / DonutStatCard / TrendChartCard / DashboardTableCard
// / ConversionFunnel) already consume — so swapping dummy → real data never
// touches the widgets themselves, only this mapping layer.

// Fixed categorical order — assigned by index, never by rank/value, so a
// slice's color stays stable even if the underlying counts change.
export const CATEGORICAL_COLORS = [
  "hsl(212, 100%, 45%)", // brand blue
  "hsl(182, 59%, 54%)", // teal / brand accent
  "hsl(38, 92%, 50%)", // amber
  "hsl(160, 84%, 39%)", // emerald
  "hsl(262, 60%, 62%)", // violet
  "hsl(340, 82%, 60%)", // rose
];

// Reserved status colors — used only for genuinely stateful data
// (success/failed/pending/…), never recycled as a categorical hue.
export const STATUS_COLORS = {
  success: "hsl(160, 84%, 39%)",
  paid: "hsl(160, 84%, 39%)",
  active: "hsl(160, 84%, 39%)",
  failed: "hsl(0, 84%, 60%)",
  expired: "hsl(0, 84%, 60%)",
  churned: "hsl(0, 84%, 60%)",
  pending: "hsl(38, 92%, 50%)",
  revoked: "hsl(215, 16%, 65%)",
};

const titleCase = (str) =>
  String(str || "")
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");

/** Generic array -> [{label,value,color}] mapper, fixed categorical color order. */
export const toCategoricalPie = (items = [], labelKey, valueKey) =>
  items.map((item, i) => ({
    label: titleCase(item[labelKey]),
    value: Number(item[valueKey]) || 0,
    color: CATEGORICAL_COLORS[i % CATEGORICAL_COLORS.length],
  }));

/** transactionStatus is a {success,failed,pending} object, not an array. */
export const toStatusPie = (statusObj = {}) =>
  Object.entries(statusObj).map(([label, value]) => ({
    label: titleCase(label),
    value: Number(value) || 0,
    color: STATUS_COLORS[label.toLowerCase()] || "hsl(215, 16%, 78%)",
  }));

/** vegetarianSplit already ships {label,total} — just normalize the value key & color. */
export const toLabeledPie = (items = []) =>
  items.map((item, i) => ({
    label: item.label,
    value: Number(item.total) || 0,
    color:
      item.label === "Unspecified"
        ? "hsl(215, 16%, 78%)"
        : CATEGORICAL_COLORS[i % CATEGORICAL_COLORS.length],
  }));

/**
 * dashboard/conversion-funnel only gives 2 real checkpoints (signups, paid) —
 * we render exactly those, no fabricated intermediate stages.
 */
export const buildFunnel = (data) => {
  if (!data) return { stages: [], insight: "" };
  const { totalSignups = 0, paidUsers = 0, conversionRate = 0, dropOffRate = 0 } = data;
  return {
    subtitle: "Signup → Payment, this period",
    insight: `${conversionRate}% of signups convert to a paid subscription (${dropOffRate}% drop-off).`,
    stages: [
      { label: "Total Signups", value: totalSignups, color: CATEGORICAL_COLORS[0], dropOff: 0 },
      { label: "Paid Users", value: paidUsers, color: STATUS_COLORS.success, dropOff: -Math.round(dropOffRate) },
    ],
  };
};

export const buildSecondaryKpis = (summary, overview) => {
  if (!summary) return null;
  return {
    newSignups: {
      today: summary.newSignupsToday || 0,
      week: summary.newSignupsThisWeek || 0,
      month: summary.newSignupsThisMonth || 0,
    },
    activeSubscriptions: { value: overview?.activeSubscribers ?? 0 },
    expiringSoon: { count: summary.expiringSoonCount || 0 },
    churn: { count: summary.churnCount || 0, rate: `${summary.churnRate ?? 0}%` },
    failedTransactions: { count: summary.failedTransactions || 0 },
  };
};
