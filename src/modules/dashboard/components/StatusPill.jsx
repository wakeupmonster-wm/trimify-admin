import React from "react";

// Reserved status colors, consistent across every dashboard widget:
// Active/Success/Paid → green · Inactive/Failed/Expired/Churned → red ·
// Pending/Expiring Soon → amber · Revoked → grey.
const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-600 border-emerald-200",
  success: "bg-emerald-50 text-emerald-600 border-emerald-200",
  paid: "bg-emerald-50 text-emerald-600 border-emerald-200",
  inactive: "bg-red-50 text-red-600 border-red-200",
  failed: "bg-red-50 text-red-600 border-red-200",
  expired: "bg-red-50 text-red-600 border-red-200",
  churned: "bg-red-50 text-red-600 border-red-200",
  pending: "bg-amber-50 text-amber-600 border-amber-200",
  "expiring soon": "bg-amber-50 text-amber-600 border-amber-200",
  revoked: "bg-slate-100 text-slate-500 border-slate-300/60",
};

const StatusPill = ({ status }) => {
  const key = String(status || "").toLowerCase();
  const className =
    STATUS_STYLES[key] || "bg-slate-100 text-slate-500 border-slate-300/60";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${className}`}
    >
      {status}
    </span>
  );
};

export default StatusPill;
