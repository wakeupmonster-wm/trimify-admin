// Transforms the real GET /admin/dashboard/* + /admin/subscription/* payloads
// (see AI/backend contract, 2026-07-17) into the exact shapes the dashboard
// widgets (SecondaryKpiRow / DonutStatCard / TrendChartCard / DashboardTableCard
// / ConversionFunnel) already consume — so swapping dummy → real data never
// touches the widgets themselves, only this mapping layer.

import { APP_COLORS as CATEGORICAL_COLORS, STATUS_COLORS } from "@/config/theme.config.js";

const titleCase = (str) =>
  String(str || "")
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");

/** Generic array -> [{label,value,color}] mapper, fixed categorical color order. */
export const toCategoricalPie = (items = [], labelKey, valueKey) => {
  const grouped = {};
  items.forEach((item) => {
    let rawLabel = item[labelKey] || "Unspecified";
    if (typeof rawLabel === "string") {
      rawLabel = rawLabel.replace(/_/g, " ");
    }
    const label = titleCase(rawLabel);
    grouped[label] = (grouped[label] || 0) + (Number(item[valueKey]) || 0);
  });

  return Object.entries(grouped)
    .sort((a, b) => b[1] - a[1]) // sort descending
    .map(([label, value], i) => ({
      label,
      value,
      color: CATEGORICAL_COLORS[i % CATEGORICAL_COLORS.length],
    }));
};

/** transactionStatus is a {success,failed,pending} object, not an array. */
export const toStatusPie = (statusObj = {}) =>
  Object.entries(statusObj).map(([label, value]) => ({
    label: titleCase(label),
    value: Number(value) || 0,
    color: STATUS_COLORS[label.toLowerCase()] || "hsl(215, 16%, 78%)",
  }));

/**
 * Transaction Health widget needs 5 states, but they come from two different
 * endpoints: success/failed/pending live on revenue-charts' transactionStatus,
 * while refunded/disputed were only just added to dashboard/summary. Merge
 * them into one object so the widget has a single data source.
 */
export const toTransactionHealthPie = (statusObj = {}, refundedCount = 0, disputedCount = 0) =>
  toStatusPie({
    ...statusObj,
    refunded: refundedCount || 0,
    disputed: disputedCount || 0,
  });

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
 * dashboard/conversion-funnel only gives 2 real checkpoints (signups, paid),
 * so the visual funnel bars stay exactly those two — no fabricated
 * intermediate stages. But the app's signup flow ends with every user
 * eventually buying a subscription, so notPaidUsers/conversionRate/
 * dropOffRate are surfaced as their own top-level fields too (not just
 * baked into the insight sentence), so the widget can show the complete
 * picture: how many haven't converted yet, not just the two raw counts.
 */
export const buildFunnel = (data) => {
  if (!data) return { stages: [], insight: "" };
  const { totalSignups = 0, paidUsers = 0, notPaidUsers = 0, conversionRate = 0, dropOffRate = 0 } = data;
  return {
    subtitle: "Signup → Payment, this period",
    notPaidUsers,
    conversionRate,
    dropOffRate,
    insight: `${conversionRate}% of signups have converted to a paid subscription. Since every user is expected to subscribe eventually, the ${notPaidUsers.toLocaleString()} who haven't yet (${dropOffRate}%) are the ones to follow up with.`,
    stages: [
      { label: "Total Signups", value: totalSignups, color: CATEGORICAL_COLORS[0], dropOff: 0 },
      { label: "Paid Users", value: paidUsers, color: STATUS_COLORS.success, dropOff: -Math.round(dropOffRate) },
    ],
  };
};

// Flat, single-purpose KPI set for the main Dashboard's secondary KPI row.
// "Active Subscriptions"/"Churn"/"Failed Transactions"/"Conversion Rate" all
// live on the Subscription Dashboard instead — this row sticks to platform
// signup/content stats that don't belong there.
export const buildSecondaryKpis = (summary) => {
  if (!summary) return null;
  return {
    newSignupsToday: summary.newSignupsToday || 0,
    expiringSoon: summary.expiringSoonCount || 0,
    totalRevenueAllTime: summary.totalRevenueAllTime || 0,
    inactiveUsers: summary.inactiveUsers || 0,
    totalUsersAllTime: summary.totalUsersAllTime || 0,
    totalPrograms: summary.totalPrograms || 0,
    totalFitzoneSessions: summary.totalFitzoneSessions || 0,
    totalBlogs: summary.totalBlogs || 0,
    totalPublishedBlogs: summary.totalPublishedBlogs || 0,
    totalSubAdmins: summary.totalSubAdmins || 0,
  };
};

export const buildAlerts = (alerts = {}) => {
  const result = [];

  const ghosting = alerts?.ghostingUsers;
  if (ghosting && (ghosting.needsAttention === true || ghosting.needsAttention === "true" || ghosting.needsAttention === 1)) {
    result.push({
      id: "ghosting",
      label: "Ghosting Users",
      value: `${ghosting.count || 0} users have been inactive for over ${ghosting.thresholdDays || 60} days`,
      route: "/admin/users",
      filterId: "ghosted"
    });
  }

  const zeroEng = alerts?.newSignupsZeroEngagement;
  if (zeroEng && (zeroEng.needsAttention === true || zeroEng.needsAttention === "true" || zeroEng.needsAttention === 1)) {
    result.push({
      id: "reported",
      label: "Zero Engagement",
      value: `${zeroEng.count || 0} new signups have 0 activity in ${zeroEng.thresholdDays || 7} days`,
      route: "/admin/users",
      filterId: "zero_engagement"
    });
  }

  const incomplete = alerts?.incompleteProfiles;
  if (incomplete && (incomplete.needsAttention === true || incomplete.needsAttention === "true" || incomplete.needsAttention === 1)) {
    result.push({
      id: "kyc",
      label: "Incomplete Profiles",
      value: `${incomplete.incompleteCount || 0} profiles are missing information`,
      route: "/admin/users",
      filterId: "incomplete"
    });
  }

  const stagnation = alerts?.contentStagnation;
  if (stagnation && (stagnation.needsAttention === true || stagnation.needsAttention === "true" || stagnation.needsAttention === 1)) {
    const staleItems = [];
    if (stagnation.programs?.stale) staleItems.push("programs");
    if (stagnation.blogs?.stale) staleItems.push("blogs");
    if (stagnation.fitzoneCategories?.stale) staleItems.push("fitzone sessions");

    const itemString = staleItems.length > 0 ? staleItems.join(", ") : "content";

    result.push({
      id: "stale_content",
      label: "Content Stagnation",
      value: `No new ${itemString} published in over ${stagnation.thresholdDays || 14} days`,
      route: "/admin/fitzone-management",
      filterId: "stale_content",
    });
  }

  const zeroEnrollment = alerts?.zeroEnrollmentPrograms;
  if (zeroEnrollment && (zeroEnrollment.needsAttention === true || zeroEnrollment.needsAttention === "true" || zeroEnrollment.needsAttention === 1)) {
    result.push({
      id: "stalled",
      label: "Zero Enrollment",
      value: `${zeroEnrollment.count || 0} programs have 0 enrollments past grace period`,
      route: "/admin/manage-program",
      filterId: "zero_enrollment"
    });
  }

  return result;
};
