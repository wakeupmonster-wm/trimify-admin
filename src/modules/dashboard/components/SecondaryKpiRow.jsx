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
const getNumberVal = (val) => {
  if (typeof val === 'object' && val !== null) return val.current;
  return val;
};

const fmtNumber = (val) => {
  const num = getNumberVal(val);
  return (num || 0).toLocaleString();
};

// Keep dashboard drill-down filters in the URL. React navigation state is
// ephemeral and can be lost by reloads, redirects, or a second navigation.
const formatLocalDate = (value) => {
  if (!value) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (number) => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const fitzoneDrillDownUrl = (dateRange) => {
  const params = new URLSearchParams();
  if (dateRange?.preset) params.set("preset", dateRange.preset);

  const from = formatLocalDate(dateRange?.from);
  const to = formatLocalDate(dateRange?.to);
  if (from) params.set("from", from);
  if (to) params.set("to", to);

  const query = params.toString();
  return `/admin/fitzone-management${query ? `?${query}` : ""}`;
};

const KPI_CONFIG = [
  {
    key: "totalRevenue",
    label: "Revenue",
    description: "All-time, all plans",
    tone: "emerald",
    trendValue: "12%",
    isPositive: true,
    format: (data) => fmtMoney(getNumberVal(data?.totalRevenue)),
    isCurrency: true,
    onClick: (navigate) =>
      navigate("/admin/subscription-management/transactions"),
  },
  {
    key: "totalPrograms",
    label: "Total Programs",
    description: "Tap to manage",
    tone: "violet",
    trendValue: "4%",
    isPositive: true,
    format: (data) => fmtNumber(data?.totalPrograms),
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
    format: (data) => fmtNumber(data?.totalBlogs),
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
    format: (data) => fmtNumber(data?.totalFitzoneSessions),
    isCurrency: false,
    onClick: (navigate, dateRange) =>
      navigate(fitzoneDrillDownUrl(dateRange), { state: { dateRange } }),
  },
  {
    key: "missedStepGoals",
    label: "Missed Step Goals",
    description: "Users missing goals",
    tone: "rose",
    trendValue: "2%",
    isPositive: false,
    format: (data) => fmtNumber(data?.missedStepGoals),
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
    format: (data) => fmtNumber(data?.missedDietLogs),
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
    format: (data) => fmtNumber(data?.missedWaterLogs),
    isCurrency: false,
    onClick: (navigate, dateRange) =>
      navigate("/admin/users", {
        state: { filterId: "missed_water_logs", dateRange },
      }),
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
    format: (data) => fmtNumber(data?.expiringSoon),
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
  //   format: (data) => fmtNumber(data?.totalPublishedBlogs),
  //   isCurrency: false,
  //   onClick: (navigate) => navigate("/admin/blog-section/manage-blogs"),
  // },
];

const DESIRED_KPI_ORDER = [
  "Revenue",
  "Total Programs",
  "Total Blogs",
  "Fitzone Sessions",
  "Missed Step Goals",
  "Missed Diet Logs",
  "Missed Water Logs",
  "Expiring Soon"
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
          ? [...data]
              .sort((a, b) => {
                const indexA = DESIRED_KPI_ORDER.indexOf(a.label);
                const indexB = DESIRED_KPI_ORDER.indexOf(b.label);
                
                if (indexA === -1 && indexB === -1) return 0;
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;
                
                return indexA - indexB;
              })
              .map((kpi, idx) => {
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
              const valObj = data[kpi.key];
              const isObj = typeof valObj === 'object' && valObj !== null;
              
              const trendObj = data.trends?.[kpi.key];
              
              const trendStr = (isObj && valObj.trend) ? valObj.trend : trendObj?.trend;
              
              let backendIsPositive = kpi.isPositive;
              if (isObj && valObj.isPositive !== undefined) {
                backendIsPositive = valObj.isPositive;
              } else if (trendObj && trendObj.isPositive !== undefined) {
                backendIsPositive = trendObj.isPositive;
              }

              const tooltipData = kpi.hideTrend 
                ? null 
                : (isObj && valObj.previous !== undefined ? valObj : (trendObj || null));

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
                  isPositive={backendIsPositive}
                  trendExplanation={kpi.trendExplanation}
                  tooltipData={tooltipData}
                  onClick={() => kpi.onClick(navigate, dateRange)}
                />
              );
            })}
      </div>
    </div>
  );
};

export default SecondaryKpiRow;
