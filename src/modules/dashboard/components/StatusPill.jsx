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
        "inline-flex min-h-6 items-center gap-1.5 rounded-full border-none px-3 py-1 text-[11px] font-bold leading-none shadow-none uppercase transition-all duration-200 max-w-full w-fit whitespace-nowrap",
        config.bg,
        config.text
      )}
    >
      
      <span className="truncate">{status}</span>
    </Badge>
  );
};

export default StatusPill;
