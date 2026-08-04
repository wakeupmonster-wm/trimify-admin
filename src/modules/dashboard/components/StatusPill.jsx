import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Reserved status colors, consistent across every dashboard widget:
// Active/Success/Paid → green · Inactive/Failed/Churned → red ·
// Pending/Expiring Soon/Expired → amber · Revoked → grey.
const STATUS_STYLES = {
  active: { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  success: { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  paid: { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  inactive: { bg: "bg-red-500/10", text: "text-red-600" },
  failed: { bg: "bg-red-500/10", text: "text-red-600" },
  expired: { bg: "bg-amber-500/10", text: "text-amber-600" },
  churned: { bg: "bg-red-500/10", text: "text-red-600" },
  pending: { bg: "bg-amber-500/10", text: "text-amber-600" },
  "expiring soon": { bg: "bg-amber-500/10", text: "text-amber-600" },
  revoked: { bg: "bg-slate-500/10", text: "text-slate-600" },
};

const StatusPill = ({ status }) => {
  const key = String(status || "").toLowerCase();
  const config = STATUS_STYLES[key] || { bg: "bg-slate-500/10", text: "text-slate-600" };

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] font-bold px-2.5 py-0.5 rounded-full border-none shadow-none uppercase flex items-center gap-1.5 transition-all duration-200 max-w-full w-fit",
        config.bg,
        config.text
      )}
    >
      <span className="w-1 h-1 shrink-0 rounded-full bg-current" />
      <span className="truncate">{status}</span>
    </Badge>
  );
};

export default StatusPill;
