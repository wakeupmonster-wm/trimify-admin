import React from "react";
import { PieChart as PieChartIcon, Receipt, TrendingUp, Wallet, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { format } from "date-fns";

export default function OverviewView({
  overview,
  overviewLoading,
  overviewError,
  charts,
  dailyPerformance,
  dashboardExtras,
  rangeLabel,
  dateRange,
  onRetry,
}) {
  // Build serialisable from/to strings for navigation state
  const navDateRange = dateRange
    ? { from: format(dateRange.from, "yyyy-MM-dd"), to: format(dateRange.to, "yyyy-MM-dd") }
    : null;
  const navigate = useNavigate();

  if (overviewLoading && !overview) return <DashboardOverviewSkeleton />;

  if (overviewError && !overview) {
    return (
      <div className="px-3 md:px-6 py-6">
        <ErrorState error="We couldn't load the subscription overview." fetchVisitorData={onRetry} />
      </div>
    );
  }

  return (
    <div className="space-y-3 px-3 md:px-6 py-6">
      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Total Revenue"
            value={`$${Number(dashboardExtras?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            description="All-time, all plans"
            onClick={() => navigate("/admin/subscription-management/transactions")}
          />
          <KpiCard
            label="MRR"
            value={`$${Number(overview.mrr || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            description="Monthly recurring revenue"
            tone="amber"
            onClick={() => navigate("/admin/subscription-management/transactions")}
          />
          <KpiCard
            label="Active Subscribers"
            value={(overview.activeSubscribers || 0).toLocaleString()}
            description="Not revoked, not expired"
            tone="emerald"
            onClick={() => navigate("/admin/subscription-management/subscribers", { state: { filterId: "active" } })}
          />
          <KpiCard
            label="Churn"
            value={(dashboardExtras?.churn?.count || 0).toLocaleString()}
            description={`${dashboardExtras?.churn?.rate || "0%"} churn rate`}
            tone="rose"
            onClick={() => navigate("/admin/subscription-management/subscribers", { state: { filterId: "canceled" } })}
          />
          <KpiCard
            label="Failed Transactions"
            value={(dashboardExtras?.failedTransactions?.count || 0).toLocaleString()}
            description={rangeLabel ? `In ${rangeLabel.toLowerCase()}` : "Selected period"}
            tone="rose"
            onClick={() => navigate("/admin/subscription-management/transactions", { state: { filterId: "failed", dateRange: navDateRange } })}
          />
          <KpiCard
            label="Refunded"
            value={(dashboardExtras?.refundedTransactions?.count || 0).toLocaleString()}
            description={`$${Number(dashboardExtras?.refundedTransactions?.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} refunded`}
            tone="violet"
            onClick={() => navigate("/admin/subscription-management/transactions", { state: { filterId: "refunded", dateRange: navDateRange } })}
          />
          <KpiCard
            label="Disputed"
            value={(dashboardExtras?.disputedTransactions?.count || 0).toLocaleString()}
            description={rangeLabel ? `In ${rangeLabel.toLowerCase()}` : "Selected period"}
            tone="amber"
            onClick={() => navigate("/admin/subscription-management/transactions", { state: { filterId: "disputed", dateRange: navDateRange } })}
          />
          <KpiCard
            label="Expiring Soon"
            value={(dashboardExtras?.expiringSoonCount || 0).toLocaleString()}
            description="Plans renewing soon"
            tone="cyan"
            onClick={() => navigate("/admin/subscription-management/subscribers", { state: { filterId: "expiring_soon" } })}
          />
        </div>
      )}

      <div className="space-y-3 pt-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] font-bold text-brand-aqua border-brand-aqua/30 bg-brand-aqua/5 rounded-full px-2 py-0">
            {rangeLabel}
          </Badge>
        </div>

        {/* Users by Plan Type / Transaction Health — moved here from the
            main Dashboard's Composition section. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <DonutStatCard
            title="Users by Plan Type"
            subtitle="Monthly vs Quarterly"
            Icon={PieChartIcon}
            iconColor="text-slate-600"
            iconBg="bg-slate-100/50"
            data={dashboardExtras?.pieCharts?.planType || []}
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
                color: "#15B097",
                type: "line",
              },
              {
                key: "churnedUsers",
                label: "Churned",
                color: "#FF5252",
                type: "line",
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
      <div className="space-y-3 pt-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] font-bold text-brand-aqua border-brand-aqua/30 bg-brand-aqua/5 rounded-full px-2 py-0">
            Platform Activity
          </Badge>
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
            subtitle="Latest 10"
            Icon={Receipt}
            iconColor="text-slate-600"
            iconBg="bg-slate-100/50"
            rows={dashboardExtras?.tables?.recentTransactions || []}
            emptyMessage="No transactions yet."
            columns={[
              { key: "user_name", label: "User" },
              { key: "plan_title", label: "Plan", render: (r) => r.plan_title || "Unknown Plan" },
              { key: "amount", label: "Amount", render: (r) => `$${Number(r.amount).toLocaleString()}` },
              { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
              { key: "created_at", label: "Date", render: (r) => format(new Date(r.created_at), "MMM dd, HH:mm") },
            ]}
          />

          <div className="xl:col-span-2">

          <DashboardTableCard
            title="Users Nearing Plan Expiry"
            subtitle="Renewal follow-up list"
            Icon={TrendingUp}
            iconColor="text-slate-600"
            iconBg="bg-slate-100/50"
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
              { key: "plan_title", label: "Plan", width: "w-[25%]", render: (r) => r.plan_title || "Unknown Plan" },
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
          </div>
        </div>
      </div>
    </div>
  );
}
