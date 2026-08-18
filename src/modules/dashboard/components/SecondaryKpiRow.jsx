import React from "react";
import { useNavigate } from "react-router-dom";
import KpiCard from "./KpiCard";

const fmtMoney = (n) => `$${Number(n || 0).toLocaleString()}`;

/**
 * Secondary KPI rows — platform signup/content stats that don't already
 * belong to the Subscription Dashboard (Active Subscriptions, Churn,
 * Failed Transactions and Conversion Rate all live there instead,
 * alongside the rest of subscription/revenue analytics).
 */
const KPI_CONFIG = [
  {
    key: "totalRevenue",
    label: "Revenue",
    description: "All-time, all plans",
    tone: "emerald",
    trendValue: "12%",
    isPositive: true,
    format: (data) => {
      const val = data?.totalRevenue;
      return fmtMoney(typeof val === 'object' && val !== null ? val.current : val);
    },
    isCurrency: true,
    onClick: (navigate) =>
      navigate("/admin/subscription-management/transactions"),
  },
  // {
  //   key: "totalUsersAllTime",
  //   label: "Total Users",
  //   description: "All-time platform total",
  //   trendValue: "8%",
  //   isPositive: true,
  //   format: (data) => data?.totalUsersAllTime?.toLocaleString() || "0",
  //   isCurrency: false,
  //   onClick: (navigate) => navigate("/admin/users"),
  // },
  // {
  //   key: "newSignupsToday",
  //   label: "New Signups",
  //   description: "Signed up today",
  //   trendValue: "2%",
  //   isPositive: true,
  //   format: (data) => data?.newSignupsToday?.toLocaleString() || "0",
  //   isCurrency: false,
  //   onClick: (navigate) =>
  //     navigate("/admin/users", { state: { filterId: "new_today" } }),
  // },
  {
    key: "missedStepGoals",
    label: "Missed Step Goals",
    description: "Users missing goals",
    tone: "rose",
    trendValue: "2%",
    isPositive: false,
    format: (data) => data?.missedStepGoals?.toLocaleString() || "0",
    isCurrency: false,
    onClick: (navigate, dateRange) =>
      navigate("/admin/users", {
        state: { filterId: "missed_step_goals", dateRange },
      }),
  },
  {
    key: "missedDietLogs",
    label: "Missed Diet Logs",
    description: "Users missing food logs",
    tone: "amber",
    trendValue: "1%",
    isPositive: false,
    format: (data) => data?.missedDietLogs?.toLocaleString() || "0",
    isCurrency: false,
    onClick: (navigate, dateRange) =>
      navigate("/admin/users", {
        state: { filterId: "missed_diet_logs", dateRange },
      }),
  },
  {
    key: "missedWaterLogs",
    label: "Missed Water Logs",
    description: "Users missing water logs",
    tone: "cyan",
    trendValue: "1%",
    isPositive: false,
    format: (data) => data?.missedWaterLogs?.toLocaleString() || "0",
    isCurrency: false,
    onClick: (navigate, dateRange) =>
      navigate("/admin/users", {
        state: { filterId: "missed_water_logs", dateRange },
      }),
  },
  {
    key: "totalPrograms",
    label: "Total Programs",
    description: "Tap to manage",
    tone: "violet",
    trendValue: "4%",
    isPositive: true,
    format: (data) => data?.totalPrograms?.toLocaleString() || "0",
    isCurrency: false,
    onClick: (navigate, dateRange) =>
      navigate("/admin/manage-program", { state: { dateRange } }),
  },

  {
    key: "totalBlogs",
    label: "Total Blogs",
    description: "Tap to manage",
    tone: "cyan",
    trendValue: "3%",
    isPositive: true,
    format: (data) => data?.totalBlogs?.toLocaleString() || "0",
    isCurrency: false,
    onClick: (navigate, dateRange) => navigate("/admin/blog-section/manage-blogs", { state: { dateRange } }),
  },
  {
    key: "totalFitzoneSessions",
    label: "Fitzone Sessions",
    description: "Tap to manage",
    tone: "rose",
    trendValue: "15%",
    isPositive: true,
    format: (data) => data?.totalFitzoneSessions?.toLocaleString() || "0",
    isCurrency: false,
    onClick: (navigate, dateRange) =>
      navigate("/admin/fitzone-management", { state: { dateRange } }),
  },
  {
    key: "expiringSoon",
    label: "Expiring Soon",
    description: "Expires within 15 days",
    forceDescription: true,
    hideTrend: true,
    tone: "amber",
    trendValue: "5%",
    isPositive: false,
    format: (data) => data?.expiringSoon?.toLocaleString() || "0",
    isCurrency: false,
    onClick: (navigate) =>
      navigate("/admin/subscription-management/subscribers", {
        state: { filterId: "expiring_soon" },
      }),
  },
  // {
  //   key: "totalPublishedBlogs",
  //   label: "Published Blogs",
  //   description: "Live on the app",
  //   tone: "emerald",
  //   trendValue: "1%",
  //   isPositive: true,
  //   format: (data) => data?.totalPublishedBlogs?.toLocaleString() || "0",
  //   isCurrency: false,
  //   onClick: (navigate) => navigate("/admin/blog-section/manage-blogs"),
  // },
];

const SecondaryKpiRow = ({ data, title, dateRange, contextLabel }) => {
  const navigate = useNavigate();
  if (!data) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2 flex flex-col items-start gap-1">
        <h2 className="text-base font-bold text-slate-900">
          {title || "Today at a glance"}
        </h2>
        <p className="text-[11px] font-medium text-slate-500 leading-none">
          Key insights that matter most right now.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.isArray(data)
          ? data.map((kpi, idx) => {
              const config = KPI_CONFIG.find((c) => c.label === kpi.label);

              // Parse numeric value for the tooltip chart
              const rawVal =
                parseFloat(String(kpi.value).replace(/[^0-9.-]+/g, "")) || 0;
              const isCurrency = String(kpi.value).includes("$");
              const trendPct =
                parseFloat(String(kpi.trend).replace(/[^0-9.-]+/g, "")) || 0;

              const multiplier = kpi.isPositive
                ? (100 - trendPct) / 100
                : (100 + trendPct) / 100;
              const previous = rawVal * multiplier;

              return (
                <KpiCard
                  key={idx}
                  label={kpi.label}
                  value={kpi.value}
                  description={kpi.sub}
                  tone={kpi.color}
                  trendValue={kpi.trend}
                  isPositive={kpi.isPositive}
                  tooltipData={{
                    current: rawVal,
                    previous,
                    isCurrency,
                  }}
                  onClick={() => {
                    if (config?.onClick) config.onClick(navigate, dateRange);
                  }}
                />
              );
            })
          : KPI_CONFIG.map((kpi) => {
              const val = data[kpi.key] || 0;
              const trendObj = data.trends?.[kpi.key];
              const trendStr = trendObj?.trend;

              const dynamicDescription = (contextLabel && !kpi.forceDescription)
                ? contextLabel.replace(/^vs\s+/i, "Compared to ")
                : kpi.description;

              return (
                <KpiCard
                  key={kpi.key}
                  label={kpi.label}
                  value={kpi.format(data)}
                  description={dynamicDescription}
                  tone={kpi.tone}
                  trendValue={kpi.hideTrend ? null : trendStr}
                  isPositive={kpi.isPositive}
                  trendExplanation={kpi.trendExplanation}
                  tooltipData={kpi.hideTrend ? null : (trendObj || null)}
                  onClick={() => kpi.onClick(navigate, dateRange)}
                />
              );
            })}
      </div>
    </div>
  );
};

export default SecondaryKpiRow;
