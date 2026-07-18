import React from "react";
import { useNavigate } from "react-router-dom";
import {
  IconTrendingDown,
  IconTrendingUp,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { UserPlus, Repeat, CreditCard } from "lucide-react";

const TrendBadge = ({ change }) => {
  if (!change) return null;
  const isUp = !change.startsWith("-");
  return (
    <div
      className={`flex items-center gap-1 font-bold text-[10px] border rounded-full py-1 px-2 shrink-0 ${
        isUp
          ? "text-emerald-600 bg-emerald-50 border-emerald-200"
          : "text-rose-600 bg-rose-50 border-rose-200"
      }`}
    >
      {isUp ? (
        <IconTrendingUp size={12} stroke={3} />
      ) : (
        <IconTrendingDown size={12} stroke={3} />
      )}
      {change}
    </div>
  );
};

const Card = ({ children, onClick, tone = "default" }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl p-5 transition-all duration-300 shadow-sm border hover:shadow-sm flex flex-col justify-between min-h-[128px] group ${
      onClick ? "cursor-pointer" : ""
    } ${
      tone === "warning"
        ? "border-amber-200 hover:border-amber-400"
        : tone === "danger"
          ? "border-rose-200 hover:border-rose-400"
          : "border-slate-300/60 hover:border-brand-blue"
    }`}
  >
    {children}
  </div>
);

/**
 * Second KPI row — the metrics TodayAtAGlance doesn't already cover:
 * signup velocity, active subscriptions, expiring-soon/churn/failed-tx
 * (all three "actionable" per the design brief — click through to the
 * closest existing filtered list).
 */
const SecondaryKpiRow = ({ data, selectedDate }) => {
  const navigate = useNavigate();
  if (!data) return null;

  const goTo = (route) => () =>
    navigate(route, {
      state: {
        preset: selectedDate?.preset,
        from: selectedDate?.from,
        to: selectedDate?.to,
      },
    });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card>
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold text-foreground/70">
            New Signups
          </p>
          <UserPlus className="w-4 h-4 text-brand-blue" />
        </div>
        <div>
          <h3 className="text-[26px] font-extrabold text-slate-900 tracking-tight leading-none mt-1 mb-3">
            {data.newSignups.month.toLocaleString()}
          </h3>
          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
            <span>
              Today <b className="text-slate-800">{data.newSignups.today}</b>
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>
              Week <b className="text-slate-800">{data.newSignups.week}</b>
            </span>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold text-foreground/70">
            Active Subscriptions
          </p>
          <TrendBadge change={data.activeSubscriptions.change} />
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Repeat className="w-4 h-4 text-brand-blue" />
          <h3 className="text-[26px] font-extrabold text-slate-900 tracking-tight leading-none">
            {data.activeSubscriptions.value.toLocaleString()}
          </h3>
        </div>
      </Card>

      <Card
        tone="warning"
        onClick={goTo("/admin/subscription-management/subscribers")}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold text-amber-700">Expiring Soon</p>
          <IconAlertTriangle size={16} className="text-amber-500" />
        </div>
        <div>
          <h3 className="text-[26px] font-extrabold text-amber-600 tracking-tight leading-none mt-1">
            {data.expiringSoon.count.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Next 7 days · tap to view
          </p>
        </div>
      </Card>

      <Card
        tone="danger"
        onClick={goTo("/admin/subscription-management/subscribers")}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold text-rose-700">Churn</p>
          <TrendBadge change={data.churn.change} />
        </div>
        <div>
          <h3 className="text-[26px] font-extrabold text-rose-600 tracking-tight leading-none mt-1">
            {data.churn.count.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            {data.churn.rate} churn rate · tap to view
          </p>
        </div>
      </Card>

      <Card tone="danger" onClick={goTo("/admin/transaction-management")}>
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold text-rose-700">
            Failed Transactions
          </p>
          <CreditCard className="w-4 h-4 text-rose-500" />
        </div>
        <div>
          <h3 className="text-[26px] font-extrabold text-rose-600 tracking-tight leading-none mt-1">
            {data.failedTransactions.count.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            tap to view list
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SecondaryKpiRow;
