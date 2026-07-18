import React from "react";
import { DollarSign, Crown, UserCheck, UserMinus, CreditCard, PieChart as PieChartIcon, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ErrorState from "@/components/shared/ErrorState";
import DashboardOverviewSkeleton from "./DashboardOverviewSkeleton";
import RevenueTrendChart from "./overview/RevenueTrendChart";
import SubscriberGrowthChart from "./overview/SubscriberGrowthChart";
import PlanDistributionChart from "./overview/PlanDistributionChart";
import TopSellingPlansCard from "./overview/TopSellingPlansCard";
import RecentTransactionsCard from "./overview/RecentTransactionsCard";
// Moved here from the main Dashboard — plan/revenue breakdowns belong with
// the rest of subscription analytics.
import DonutStatCard from "@/modules/dashboard/components/DonutStatCard";
import KpiCard from "@/modules/dashboard/components/KpiCard";

function SectionLabel({ children, live }) {
  return (
    <div className="flex items-center gap-2">
      {live && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{children}</span>
    </div>
  );
}

export default function OverviewView({
  overview,
  overviewLoading,
  overviewError,
  charts,
  dailyPerformance,
  dashboardExtras,
  rangeLabel,
  onRetry,
}) {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard
            icon={DollarSign}
            label="Today's Revenue"
            value={`$${Number(overview.todaysRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            description="Successful transactions today"
          />
          <KpiCard
            icon={Crown}
            label="MRR"
            value={`$${Number(overview.mrr || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            description="Monthly recurring revenue"
            tone="amber"
          />
          <KpiCard
            icon={UserCheck}
            label="Active Subscribers"
            value={(overview.activeSubscribers || 0).toLocaleString()}
            description="Not revoked, not expired"
            tone="emerald"
          />
          <KpiCard
            icon={UserMinus}
            label="Churn"
            value={(dashboardExtras?.churn?.count || 0).toLocaleString()}
            description={`${dashboardExtras?.churn?.rate || "0%"} churn rate`}
            tone="rose"
          />
          <KpiCard
            icon={CreditCard}
            label="Failed Transactions"
            value={(dashboardExtras?.failedTransactions?.count || 0).toLocaleString()}
            description={rangeLabel ? `In ${rangeLabel.toLowerCase()}` : "Selected period"}
            tone="rose"
          />
        </div>
      )}

      <div className="space-y-3 pt-3">
        <div className="flex items-center gap-2">
          <SectionLabel>Trends</SectionLabel>
          <Badge variant="outline" className="text-[10px] font-bold text-brand-aqua border-brand-aqua/30 bg-brand-aqua/5 rounded-full px-2 py-0">
            {rangeLabel}
          </Badge>
        </div>

        {/* Revenue Trend / Subscriber Growth / Plan Distribution —
            temporarily disabled, not deleted. Flip back to `true` to restore. */}
        {false && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <RevenueTrendChart data={charts?.revenueTrend || []} />
            <SubscriberGrowthChart data={charts?.subscriberGrowth || []} />
          </div>
        )}
        {false && (
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <PlanDistributionChart data={charts?.planDistribution || []} />
          </div>
        )}

        {/* Users by Plan Type / Transaction Status — moved here from the
            main Dashboard's Composition section. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <DonutStatCard
            title="Users by Plan Type"
            subtitle="Monthly vs Quarterly"
            Icon={PieChartIcon}
            iconColor="text-brand-blue"
            iconBg="bg-blue-50"
            data={dashboardExtras?.pieCharts?.planType || []}
            footnote="Yearly plan isn't live in the catalog yet — this chart is ready to pick it up as soon as it has subscribers."
          />
          <DonutStatCard
            title="Transaction Status"
            subtitle="Success / failed / pending"
            Icon={Receipt}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50"
            data={dashboardExtras?.pieCharts?.txStatus || []}
          />
        </div>
      </div>

      {/* Daily Performance API is always "today" — never date-range scoped, so it's
          deliberately kept out of the "Trends" section above to avoid implying it
          responds to the date picker. */}
      <div className="space-y-3 pt-3">
        <SectionLabel live>Today</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <TopSellingPlansCard plans={dailyPerformance?.topSellingPlans || []} />
          <RecentTransactionsCard transactions={dailyPerformance?.recentTransactions || []} />
        </div>
      </div>
    </div>
  );
}
