import React from "react";
import {
  PieChart as PieChartIcon,
  Receipt,
  TrendingUp,
  Wallet,
  Trophy,
} from "lucide-react";
import ErrorState from "@/components/shared/ErrorState";
import DashboardOverviewSkeleton from "./DashboardOverviewSkeleton";
// Moved here from the main Dashboard — plan/revenue breakdowns belong with
// the rest of subscription analytics.
import DonutStatCard from "@/modules/dashboard/components/DonutStatCard";
import KpiCard from "@/modules/dashboard/components/KpiCard";
import TrendChartCard from "@/modules/dashboard/components/TrendChartCard";
import DashboardTableCard from "@/modules/dashboard/components/DashboardTableCard";
import StatusPill from "@/modules/dashboard/components/StatusPill";
import { useNavigate } from "react-router-dom";
import { format, differenceInDays } from "date-fns";
import { APP_COLORS } from "@/config/theme.config";

const DUMMY_EXPIRING_USERS = [
  {
    id: 1765,
    name: "Priya Sharma",
    email: "demo.completeuser@trimify.com.au",
    plan: {
      id: 1,
      title: "Premium",
      price: "30.00",
      duration: "2",
    },
    plan_expiry: "2026-10-23 17:56:49",
    paid: 1,
    status: "Active",
    sub_admin: {
      name: "Self Registration",
    },
  },
];

export default function OverviewView({
  overview,
  overviewLoading,
  overviewError,
  dailyPerformance,
  dashboardExtras,
  rangeLabel,
  dateRange,
  onRetry,
}) {
  // Build serialisable from/to strings for navigation state
  const navDateRange = dateRange
    ? {
        from: format(dateRange.from, "yyyy-MM-dd"),
        to: format(dateRange.to, "yyyy-MM-dd"),
      }
    : null;
  const navigate = useNavigate();

  if (overviewLoading && !overview) return <DashboardOverviewSkeleton />;

  if (overviewError && !overview) {
    return (
      <div className="px-3 md:px-6 py-6">
        <ErrorState
          error="We couldn't load the subscription overview."
          fetchVisitorData={onRetry}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3 px-3 md:px-6 py-6 mb-8">
      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Today's Revenue"
            value={`$${Number(dashboardExtras?.todaysRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            description="Revenue collected today"
            onClick={() =>
              navigate("/admin/subscription-management/transactions")
            }
          />
          <KpiCard
            label="MRR"
            value={`$${Number(overview.mrr || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            description="Current monthly recurring revenue"
            tone="amber"
            onClick={() =>
              navigate("/admin/subscription-management/transactions")
            }
          />
          <KpiCard
            label="Active Subscribers"
            value={(overview.activeSubscribers || 0).toLocaleString()}
            description="Currently active subscribers"
            tone="emerald"
            onClick={() =>
              navigate("/admin/subscription-management/subscribers", {
                state: { filterId: "active" },
              })
            }
          />
          <KpiCard
            label="Churn"
            value={(dashboardExtras?.churn?.count || 0).toLocaleString()}
            description={`Expired plan subscribers (${dashboardExtras?.churn?.rate || "0%"} rate)`}
            tone="rose"
            onClick={() =>
              navigate("/admin/subscription-management/subscribers", {
                state: { filterId: "canceled" },
              })
            }
          />
          <KpiCard
            label="Failed Transactions"
            value={(
              dashboardExtras?.failedTransactions?.count || 0
            ).toLocaleString()}
            description={
              rangeLabel ? `In ${rangeLabel.toLowerCase()}` : "Selected period"
            }
            tone="rose"
            onClick={() =>
              navigate("/admin/subscription-management/transactions", {
                state: { filterId: "failed", dateRange: navDateRange },
              })
            }
          />
          <KpiCard
            label="Refunded"
            value={(
              dashboardExtras?.refundedTransactions?.count || 0
            ).toLocaleString()}
            description={`$${Number(dashboardExtras?.refundedTransactions?.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} refunded in ${rangeLabel ? rangeLabel.toLowerCase() : "selected period"}`}
            tone="violet"
            onClick={() =>
              navigate("/admin/subscription-management/transactions", {
                state: { filterId: "refunded", dateRange: navDateRange },
              })
            }
          />
          <KpiCard
            label="Disputed"
            value={(
              dashboardExtras?.disputedTransactions?.count || 0
            ).toLocaleString()}
            description={
              rangeLabel ? `In ${rangeLabel.toLowerCase()}` : "Selected period"
            }
            tone="amber"
            onClick={() =>
              navigate("/admin/subscription-management/transactions", {
                state: { filterId: "disputed", dateRange: navDateRange },
              })
            }
          />
          <KpiCard
            label="Expiring Soon"
            value={(dashboardExtras?.expiringSoonCount || 0).toLocaleString()}
            description="Within next 7 days"
            tone="cyan"
            onClick={() =>
              navigate("/admin/subscription-management/subscribers", {
                state: { filterId: "expiring_soon" },
              })
            }
          />
        </div>
      )}

      <div className="space-y-5 pt-3">
        <div className="flex flex-col items-start gap-1">
          <h2 className="text-base font-bold text-slate-900">Trends</h2>
          <p className="text-[11px] font-medium text-slate-500 leading-none">
            Change over time, grouped to match the selected date range (
            {rangeLabel})
          </p>
        </div>

        {/* Users by Plan Type / Transaction Health — moved here from the
            main Dashboard's Composition section. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <DonutStatCard
            title="Users by Plan Type"
            subtitle="Monthly vs Quarterly"
            Icon={PieChartIcon}
            iconColor="text-slate-600"
            iconBg="bg-slate-100/50"
            data={
              dashboardExtras?.pieCharts?.planType?.length > 0
                ? dashboardExtras.pieCharts.planType
                : [
                    { label: "Premium", value: 0, color: "#007FC0" },
                    { label: "Basic", value: 0, color: "#3399D1" },
                  ]
            }
            footnote="Yearly plan isn't live in the catalog yet — this chart is ready to pick it up as soon as it has subscribers."
          />
          <DonutStatCard
            title="Transaction Health"
            subtitle="Success / Failed / Refunded / Disputed / Pending"
            Icon={Receipt}
            iconColor="text-slate-600"
            iconBg="bg-slate-100/50"
            data={dashboardExtras?.pieCharts?.txStatus || []}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 pt-3">
          <TrendChartCard
            title="Active vs Churned Users"
            subtitle="Month-wise comparison"
            Icon={TrendingUp}
            iconColor="text-slate-600"
            iconBg="bg-slate-100/50"
            tooltipText="Churned figures are approximate — a user who churned and later renewed no longer shows up as churned that month."
            data={dashboardExtras?.trends?.activeVsChurned || []}
            xKey="month"
            series={[
              {
                key: "activeUsers",
                label: "Active",
                color: APP_COLORS[0],
                type: "area",
              },
              {
                key: "churnedUsers",
                label: "Churned",
                color: APP_COLORS[2],
                type: "area",
              },
            ]}
          />

          <TrendChartCard
            title="Plan-wise Revenue"
            subtitle="Revenue contribution per plan"
            Icon={Wallet}
            iconColor="text-slate-600"
            iconBg="bg-slate-100/50"
            data={dailyPerformance?.topSellingPlans || []}
            xKey="title"
            series={[
              {
                key: "revenue",
                label: "Revenue",
                color: "#007FC0", // Primary Blue
                type: "bar",
              },
            ]}
          />
        </div>
      </div>

      {/* Daily Performance API is always "today" — never date-range scoped, so it's
          deliberately kept out of the "Trends" section above to avoid implying it
          responds to the date picker. */}
      <div className="space-y-5 pt-3">
        <div className="flex flex-col items-start gap-1">
          <h2 className="text-base font-bold text-slate-900">
            Platform Activity
          </h2>
          <p className="text-[11px] font-medium text-slate-500 leading-none">
            Daily performance metrics for today
          </p>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 items-stretch">
          <TrendChartCard
            title="Top Selling Plans"
            subtitle="Ranked by units sold"
            Icon={Trophy}
            iconColor="text-slate-600"
            iconBg="bg-slate-100/50"
            data={dailyPerformance?.topSellingPlans || []}
            xKey="title"
            series={[
              {
                key: "total_sold",
                label: "Units Sold",
                color: "#007FC0",
                type: "bar",
              },
            ]}
          />

          <DashboardTableCard
            title="Recent Transactions"
            subtitle="Latest transactions"
            Icon={Receipt}
            iconColor="text-slate-600"
            iconBg="bg-slate-100/50"
            rows={dashboardExtras?.tables?.recentTransactions || []}
            emptyMessage="No transactions yet."
            actionLabel="View"
            onAction={(row) =>
              navigate(`/admin/users/view-user/${row.user_id || row.id}`, {
                state: { from: "/admin/subscription-management/dashboard" },
              })
            }
            columns={[
              {
                key: "sno",
                label: "SR.No",
                width: "w-[5%]",
                render: (_, idx) => (
                  <span className="font-bold text-[11px] text-slate-700">
                    {idx + 1}
                  </span>
                ),
              },
              { key: "user_name", label: "User", width: "w-[26%]" },
              {
                key: "plan_title",
                label: "Plan",
                width: "w-[18%]",
                render: (r) => {
                  const title = r.plan_title || "Unknown Plan";
                  const lower = title.toLowerCase();
                  let colorClass = "text-slate-600";

                  if (lower.includes("premium"))
                    colorClass = "text-app-primary2";
                  else if (lower.includes("basic") || lower.includes("starter"))
                    colorClass = "text-app-primary3";
                  else if (lower.includes("super"))
                    colorClass = "text-orange-500";
                  else if (lower.includes("pro") || lower.includes("plus"))
                    colorClass = "text-purple-500";

                  return (
                    <div
                      className={`font-bold text-[10px] 3xl:text-[11px] uppercase tracking-wider whitespace-nowrap ${colorClass}`}
                    >
                      {title}
                    </div>
                  );
                },
              },
              {
                key: "amount",
                label: "Amount",
                width: "w-[10%]",
                render: (r) => `$${Number(r.amount).toLocaleString()}`,
              },
              {
                key: "status",
                label: "Status",
                width: "w-[20%]",
                render: (r) => <StatusPill status={r.status} />,
              },
              {
                key: "created_at",
                label: "Date",
                width: "w-[18%]",
                align: "center",
                render: (r) => format(new Date(r.created_at), "MMM dd, HH:mm"),
              },
            ]}
          />

          <div className="xl:col-span-2">
            <DashboardTableCard
              title="Users Nearing Plan Expiry"
              subtitle="Renewal follow-up list"
              Icon={TrendingUp}
              iconColor="text-slate-600"
              iconBg="bg-slate-100/50"
              rows={
                dashboardExtras?.tables?.expiringSoon?.length
                  ? dashboardExtras.tables.expiringSoon
                  : DUMMY_EXPIRING_USERS
              }
              emptyMessage="No plans expiring soon."
              actionLabel="View"
              onAction={(row) =>
                navigate(`/admin/users/view-user/${row.user_id || row.id}`, {
                  state: { from: "/admin/subscription-management/dashboard" },
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
                {
                  key: "plan_title",
                  label: "Plan",
                  width: "w-[25%]",
                  render: (r) => {
                    const title =
                      r.plan?.title || r.plan_title || "Unknown Plan";
                    const lower = title.toLowerCase();
                    let colorClass = "text-slate-600";

                    if (lower.includes("premium"))
                      colorClass = "text-app-primary2";
                    else if (
                      lower.includes("basic") ||
                      lower.includes("starter")
                    )
                      colorClass = "text-app-primary3";
                    else if (lower.includes("super"))
                      colorClass = "text-orange-500";
                    else if (lower.includes("pro") || lower.includes("plus"))
                      colorClass = "text-purple-500";

                    return (
                      <div
                        className={`font-bold text-[10px] 3xl:text-[11px] uppercase tracking-wider whitespace-nowrap ${colorClass}`}
                      >
                        {title}
                      </div>
                    );
                  },
                },
                {
                  key: "expires_at",
                  label: "Expiry",
                  width: "w-[20%]",
                  render: (r) => {
                    const expiryDate = r.expires_at || r.plan_expiry;
                    return expiryDate
                      ? format(new Date(expiryDate), "MMM dd, yyyy")
                      : "N/A";
                  },
                },
                {
                  key: "days_left",
                  label: "Days Left",
                  width: "w-[15%]",
                  render: (r) => {
                    const expiryDate = r.expires_at || r.plan_expiry;
                    const daysLeft =
                      r.days_left !== undefined
                        ? r.days_left
                        : expiryDate
                          ? differenceInDays(new Date(expiryDate), new Date())
                          : 0;
                    return (
                      <span
                        className={`font-bold ${daysLeft <= 3 ? "text-red-600" : "text-amber-600"}`}
                      >
                        {daysLeft}d
                      </span>
                    );
                  },
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
