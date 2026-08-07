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
    key: "totalRevenueAllTime",
    label: "Revenue",
    description: "All-time, all plans",
    tone: "emerald",
    trendValue: "12%",
    isPositive: true,
    format: (data) => fmtMoney(data?.totalRevenueAllTime),
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
    onClick: (navigate) => navigate("/admin/users"),
  },
  {
    key: "missedDietWaterLogs",
    label: "Missed Diet/Water",
    description: "Users missing logs",
    tone: "amber",
    trendValue: "1%",
    isPositive: false,
    format: (data) => data?.missedDietWaterLogs?.toLocaleString() || "0",
    isCurrency: false,
    onClick: (navigate) => navigate("/admin/users"),
  },
  {
    key: "expiringSoon",
    label: "Expiring Soon",
    description: "Next 7 days · tap to view",
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
  {
    key: "totalPrograms",
    label: "Total Programs",
    description: "Tap to manage",
    tone: "violet",
    trendValue: "4%",
    isPositive: true,
    format: (data) => data?.totalPrograms?.toLocaleString() || "0",
    isCurrency: false,
    onClick: (navigate) => navigate("/admin/manage-program"),
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
    onClick: (navigate) => navigate("/admin/fitzone-management"),
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
    onClick: (navigate) => navigate("/admin/blog-section"),
  },
  {
    key: "totalPublishedBlogs",
    label: "Published Blogs",
    description: "Live on the app",
    tone: "emerald",
    trendValue: "1%",
    isPositive: true,
    format: (data) => data?.totalPublishedBlogs?.toLocaleString() || "0",
    isCurrency: false,
    onClick: (navigate) => navigate("/admin/blog-section/manage-blogs"),
  },
];

const SecondaryKpiRow = ({ data, title }) => {
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
                    if (config?.onClick) config.onClick(navigate);
                  }}
                />
              );
            })
          : KPI_CONFIG.map((kpi) => {
              const val = data[kpi.key] || 0;
              // Simple mock formula to generate a "previous" value so tooltips look realistic
              const multiplier = kpi.isPositive
                ? (100 - parseInt(kpi.trendValue)) / 100
                : (100 + parseInt(kpi.trendValue)) / 100;
              const previous = val * multiplier;

              return (
                <KpiCard
                  key={kpi.key}
                  label={kpi.label}
                  value={kpi.format(data)}
                  description={kpi.description}
                  tone={kpi.tone}
                  trendValue={kpi.trendValue}
                  isPositive={kpi.isPositive}
                  trendExplanation={kpi.trendExplanation}
                  tooltipData={{
                    current: val,
                    previous,
                    isCurrency: kpi.isCurrency,
                  }}
                  onClick={() => kpi.onClick(navigate)}
                />
              );
            })}
      </div>
    </div>
  );
};

export default SecondaryKpiRow;
