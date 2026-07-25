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
const SecondaryKpiRow = ({ data }) => {
  const navigate = useNavigate();
  if (!data) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Total Revenue"
          value={fmtMoney(data.totalRevenueAllTime)}
          description="All-time, all plans"
          tone="emerald"
          onClick={() => navigate("/admin/subscription-management/transactions")}
        />
        <KpiCard
          label="Total Users"
          value={data.totalUsersAllTime.toLocaleString()}
          description="All-time platform total"
          onClick={() => navigate("/admin/users")}
        />
        <KpiCard
          label="New Signups"
          value={data.newSignupsToday.toLocaleString()}
          description="Signed up today"
          onClick={() => navigate("/admin/users", { state: { filterId: "new_today" } })}
        />
        <KpiCard
          label="Expiring Soon"
          value={data.expiringSoon.toLocaleString()}
          description="Next 7 days · tap to view"
          tone="amber"
          onClick={() => navigate("/admin/subscription-management/subscribers", { state: { filterId: "expiring_soon" } })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Total Programs"
          value={data.totalPrograms.toLocaleString()}
          description="Tap to manage"
          tone="violet"
          onClick={() => navigate("/admin/manage-program")}
        />
        <KpiCard
          label="Fitzone Sessions"
          value={data.totalFitzoneSessions.toLocaleString()}
          description="Tap to manage"
          tone="rose"
          onClick={() => navigate("/admin/fitzone-management")}
        />
        <KpiCard
          label="Total Blogs"
          value={data.totalBlogs.toLocaleString()}
          description="Tap to manage"
          tone="cyan"
          onClick={() => navigate("/admin/blog-section")}
        />
        <KpiCard
          label="Published Blogs"
          value={data.totalPublishedBlogs.toLocaleString()}
          description="Live on the app"
          tone="emerald"
          onClick={() => navigate("/admin/blog-section/manage-blogs")}
        />
      </div>
    </div>
  );
};

export default SecondaryKpiRow;
