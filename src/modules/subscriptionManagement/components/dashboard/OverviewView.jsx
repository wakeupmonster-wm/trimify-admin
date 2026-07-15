import React, { useMemo } from "react";
import { DollarSign, Crown, UserCheck, Percent } from "lucide-react";
import StatsGrid from "@/components/common/stats.grid";
import { Badge } from "@/components/ui/badge";
import { colorMap, bgMap } from "@/constants/colors";
import ErrorState from "@/components/shared/ErrorState";
import DashboardOverviewSkeleton from "./DashboardOverviewSkeleton";
import RevenueTrendChart from "./overview/RevenueTrendChart";
import SubscriberGrowthChart from "./overview/SubscriberGrowthChart";
import PlanDistributionChart from "./overview/PlanDistributionChart";
import TopSellingPlansCard from "./overview/TopSellingPlansCard";
import RecentTransactionsCard from "./overview/RecentTransactionsCard";

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
  rangeLabel,
  onRetry,
}) {
  const stats = useMemo(() => {
    if (!overview) return [];
    return [
      {
        label: "Today's Revenue",
        val: `$${Number(overview.todaysRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        icon: <DollarSign size={22} />,
        color: "blue",
        description: "Successful transactions today",
      },
      {
        label: "MRR",
        val: `$${Number(overview.mrr || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        icon: <Crown size={22} />,
        color: "amber",
        description: "Monthly recurring revenue",
      },
      {
        label: "Active Subscribers",
        val: overview.activeSubscribers || 0,
        icon: <UserCheck size={22} />,
        color: "emerald",
        description: "Not revoked, not expired",
      },
      {
        label: "Conversion Rate",
        val: `${overview.conversionRate || 0}%`,
        icon: <Percent size={22} />,
        color: "aqua",
        description: "Active subscribers / total users",
      },
    ];
  }, [overview]);

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
      {stats.length > 0 && (
        <div className="space-y-3">
          <SectionLabel live>Live Snapshot</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatsGrid stats={stats} colorMap={colorMap} bgMap={bgMap} />
          </div>
        </div>
      )}

      <div className="space-y-3 pt-3">
        <div className="flex items-center gap-2">
          <SectionLabel>Trends</SectionLabel>
          <Badge variant="outline" className="text-[10px] font-bold text-brand-aqua border-brand-aqua/30 bg-brand-aqua/5 rounded-full px-2 py-0">
            {rangeLabel}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <RevenueTrendChart data={charts?.revenueTrend || []} />
          <SubscriberGrowthChart data={charts?.subscriberGrowth || []} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <PlanDistributionChart data={charts?.planDistribution || []} />
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
