import React from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  AlertTriangle,
  Wallet,
  UserX,
  Users,
  ClipboardCheck,
  Dumbbell,
  Newspaper,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          icon={UserPlus}
          label="New Signups"
          value={data.newSignupsToday.toLocaleString()}
          description="Signed up today"
        />
        <KpiCard
          icon={AlertTriangle}
          label="Expiring Soon"
          value={data.expiringSoon.toLocaleString()}
          description="Next 7 days · tap to view"
          tone="amber"
          onClick={() => navigate("/admin/subscription-management/subscribers")}
        />
        <KpiCard
          icon={Wallet}
          label="Total Revenue"
          value={fmtMoney(data.totalRevenueAllTime)}
          description="All-time, all plans"
          tone="emerald"
          onClick={() => navigate("/admin/transaction-management")}
        />
        <KpiCard
          icon={UserX}
          label="Inactive Users"
          value={data.inactiveUsers.toLocaleString()}
          description="Currently inactive"
          tone="slate"
          onClick={() => navigate("/admin/users")}
        />
        <KpiCard
          icon={Users}
          label="Total Users"
          value={data.totalUsersAllTime.toLocaleString()}
          description="All-time platform total"
          onClick={() => navigate("/admin/users")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          icon={ClipboardCheck}
          label="Total Programs"
          value={data.totalPrograms.toLocaleString()}
          description="Tap to manage"
          tone="violet"
          onClick={() => navigate("/admin/manage-program")}
        />
        <KpiCard
          icon={Dumbbell}
          label="Fitzone Sessions"
          value={data.totalFitzoneSessions.toLocaleString()}
          description="Tap to manage"
          tone="rose"
          onClick={() => navigate("/admin/fitzone-management")}
        />
        <KpiCard
          icon={Newspaper}
          label="Total Blogs"
          value={data.totalBlogs.toLocaleString()}
          description="Tap to manage"
          tone="cyan"
          onClick={() => navigate("/admin/blog-section")}
        />
        <KpiCard
          icon={FileCheck2}
          label="Published Blogs"
          value={data.totalPublishedBlogs.toLocaleString()}
          description="Live on the app"
          tone="emerald"
          onClick={() => navigate("/admin/blog-section/manage-blogs")}
        />
        <KpiCard
          icon={ShieldCheck}
          label="Sub-Admins"
          value={data.totalSubAdmins.toLocaleString()}
          description="Tap to manage"
          tone="slate"
          onClick={() => navigate("/admin/sub-admin-management")}
        />
      </div>
    </div>
  );
};

export default SecondaryKpiRow;
