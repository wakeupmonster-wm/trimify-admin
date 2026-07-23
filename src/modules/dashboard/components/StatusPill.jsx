import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Reserved status colors, consistent across every dashboard widget:
// Active/Success/Paid → green · Inactive/Failed/Churned → red ·
// Pending/Expiring Soon/Expired → amber · Revoked → grey.
const STATUS_STYLES = {
  active: { bg: "bg-emerald-100/70 hover:bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-600" },
  success: { bg: "bg-emerald-100/70 hover:bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-600" },
  paid: { bg: "bg-emerald-100/70 hover:bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-600" },
  inactive: { bg: "bg-red-100/70 hover:bg-red-100", text: "text-red-700", dot: "bg-red-600" },
  failed: { bg: "bg-red-100/70 hover:bg-red-100", text: "text-red-700", dot: "bg-red-600" },
  expired: { bg: "bg-amber-100/70 hover:bg-amber-100", text: "text-amber-700", dot: "bg-amber-600" },
  churned: { bg: "bg-red-100/70 hover:bg-red-100", text: "text-red-700", dot: "bg-red-600" },
  pending: { bg: "bg-amber-100/70 hover:bg-amber-100", text: "text-amber-700", dot: "bg-amber-600" },
  "expiring soon": { bg: "bg-amber-100/70 hover:bg-amber-100", text: "text-amber-700", dot: "bg-amber-600" },
  revoked: { bg: "bg-slate-100/70 hover:bg-slate-100", text: "text-slate-700", dot: "bg-slate-500" },
};

const StatusPill = ({ status }) => {
  const key = String(status || "").toLowerCase();
  const config = STATUS_STYLES[key] || { bg: "bg-slate-100/70 hover:bg-slate-100", text: "text-slate-700", dot: "bg-slate-500" };

  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 px-2.5 rounded-xl border-transparent gap-1.5 font-semibold text-[10px] uppercase tracking-wider transition-colors shadow-none",
        config.bg,
        config.text
      )}
    >
      <span className={cn("h-1 w-1 rounded-full shrink-0", config.dot)} />
      {status}
    </Badge>
  );
};

export default StatusPill;
