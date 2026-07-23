import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_STYLE = {
  success: "bg-emerald-50 text-emerald-600",
  failed: "bg-rose-50 text-rose-600",
  pending: "bg-amber-50 text-amber-600",
  refunded: "bg-violet-50 text-violet-600",
  disputed: "bg-orange-50 text-orange-600",
};

export const getTransactionColumns = () => [
  {
    id: "sno",
    header: () => <div className="text-[10px] font-bold uppercase tracking-wider text-left">SR.No</div>,
    size: 100,
    minSize: 100,
    cell: ({ row, table }) => {
      const { pageIndex = 0, pageSize = 10 } = table.getState().pagination || {};
      return <div className="text-left px-2 font-bold text-[11px] text-foreground/90">{pageIndex * pageSize + row.index + 1}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "created_at",
    header: () => <div className="text-[10px] font-bold uppercase tracking-wider text-left">Date</div>,
    size: 150,
    minSize: 150,
    cell: ({ row }) => {
      const value = row.original.created_at;
      if (!value) return "-";
      const date = new Date(value);
      return (
        <div>
          <p className="text-xs font-semibold whitespace-nowrap">{format(date, "dd MMM yyyy")}</p>
          <p className="text-[10px] text-slate-400 font-semibold">{format(date, "hh:mm a")}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "user_name",
    header: () => <div className="text-[10px] font-bold uppercase tracking-wider text-left">User Name</div>,
    size: 150,
    minSize: 150,
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="font-bold text-slate-700 text-[11px] truncate">{row.original.user_name || "-"}</p>
      </div>
    ),
  },
  {
    accessorKey: "user_email",
    header: () => <div className="text-[10px] font-bold uppercase tracking-wider text-left">Email</div>,
    size: 150,
    minSize: 150,
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="text-[11px] text-slate-600 font-medium truncate">{row.original.user_email || "-"}</p>
      </div>
    ),
  },
  {
    accessorKey: "plan_title",
    header: () => <div className="text-[10px] font-bold uppercase tracking-wider text-left">Plan</div>,
    size: 200,
    minSize: 200,
    cell: ({ row }) => <div className="font-semibold text-slate-600 text-[11px]">{row.original.plan_title || "Unknown Plan"}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-[10px] font-bold uppercase tracking-wider text-left">Amount</div>,
    size: 150,
    minSize: 150,
    cell: ({ row }) => (
      <div className="text-[13px] font-black text-slate-900 tabular-nums">
        ${Number(row.original.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-[10px] font-bold uppercase tracking-wider text-left">Status</div>,
    size: 120,
    minSize: 120,
    cell: ({ row }) => {
      const rawStatus = row.original.status || "Unknown";
      let config = {
        bg: "bg-slate-100/70",
        text: "text-slate-700",
        dot: "bg-slate-500",
        hover: "hover:bg-slate-100",
      };
      
      const s = rawStatus.toLowerCase();
      if (s === "success" || s === "active") {
        config = {
          bg: "bg-emerald-100/70",
          text: "text-emerald-700",
          dot: "bg-emerald-600",
          hover: "hover:bg-emerald-100",
        };
      } else if (s === "pending") {
        config = {
          bg: "bg-amber-100/70",
          text: "text-amber-700",
          dot: "bg-amber-600",
          hover: "hover:bg-amber-100",
        };
      } else if (s === "failed" || s === "revoked") {
        config = {
          bg: "bg-rose-100/70",
          text: "text-rose-700",
          dot: "bg-rose-600",
          hover: "hover:bg-rose-100",
        };
      }

      return (
        <Badge
          variant="outline"
          className={cn(
            "flex w-max items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border-none",
            config.bg,
            config.text,
            config.hover
          )}
        >
          <span className={cn("w-1 h-1 rounded-full", config.dot)} />
          {rawStatus}
        </Badge>
      );
    },
  },
];
