import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { STATUS_BADGE_STYLE } from "@/config/theme.config";
import { Ellipsis, Eye, ShieldOff, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const formatDate = (value) => {
  if (!value) return "-";
  try {
    return format(new Date(value), "dd MMM yyyy");
  } catch {
    return "-";
  }
};

// revoked_reason is now a human-readable string from the backend
// derived from transactions.refund_requested_by / refund_reason.
// The backend returns values like 'Revoked by Admin', 'Disputed by Customer',
// 'Refunded (Dashboard)', 'Inconsistent state'. We use them as-is,
// with styling hints for the inconsistent state.
const REVOKED_REASON_STYLE = {
  "Inconsistent state": "text-amber-500",
};

const humanizeReason = (value) =>
  value || "";

export const getSubscriberColumns = (onAction) => [
  {
    id: "sno",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        SR.No
      </div>
    ),
    size: 100,
    minSize: 100,
    cell: ({ row, table }) => {
      const { pageIndex = 0, pageSize = 10 } =
        table.getState().pagination || {};
      return (
        <div className="text-left px-2 font-bold text-[11px] text-foreground/90">
          {pageIndex * pageSize + row.index + 1}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Subscriber Name
      </div>
    ),
    size: 150,
    minSize: 150,
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="font-bold text-slate-700 text-[11px] truncate">
          {row.original.name || "-"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: () => (
      <div className="text-[10px] px-1 font-bold uppercase tracking-wider text-left">
        Email
      </div>
    ),
    size: 150,
    minSize: 120,
    cell: ({ row }) => {
      const email = row.original.email;
      if (!email) return <span className="text-slate-400 text-[11px] italic">-</span>;
      return (
        <div
          className="flex items-center gap-2 w-full text-[11px] font-medium text-slate-600 tracking-tight"
          title={email}
        >
          <Mail className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="truncate max-w-40 block">{email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "plan_title",
    header: () => (
      <div className="text-[10px] px-1 font-bold uppercase tracking-wider text-left">
        Plan
      </div>
    ),
    size: 150,
    minSize: 150,
    cell: ({ row }) => {
      const plan = row.original.plan_title || "Unknown Plan";
      const isPremium = plan.toLowerCase().includes("premium");
      return (
        <Badge
          className={cn(
            "px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border-none shadow-none flex items-center gap-1.5 transition-all duration-200 max-w-max",
            isPremium
              ? "bg-amber-50 text-amber-600"
              : "bg-slate-100 text-slate-600"
          )}
        >
          <span className="w-1 h-1 shrink-0 rounded-full bg-current" />
          <span className="truncate">{plan}</span>
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="text-[10px] px-1 font-bold uppercase tracking-wider text-left">
        Status
      </div>
    ),
    size: 150,
    minSize: 150,
    cell: ({ row }) => {
      const { status, revoked_reason, revoked_detail } = row.original;
      return (
        <div className="flex flex-col items-start gap-1">
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] font-bold px-2.5 py-0.5 rounded-full border-none shadow-none uppercase flex items-center gap-1.5 transition-all duration-200 max-w-full w-fit",
              STATUS_BADGE_STYLE[status.toLowerCase()] ||
                STATUS_BADGE_STYLE.active,
            )}
          >
            <span className="w-1 h-1 shrink-0 rounded-full bg-current" />
            <span className="truncate">{status}</span>
          </Badge>
          {status === "Revoked" && revoked_reason && revoked_reason !== "Inconsistent state" && (
            <span className={cn(
              "text-[10px] font-medium pl-0.5",
              REVOKED_REASON_STYLE[revoked_reason] || "text-slate-400"
            )}>
              {humanizeReason(revoked_reason)}
            </span>
          )}
          {status === "Revoked" && revoked_detail && (
            <span className="text-[9px] font-medium text-slate-400 pl-0.5 italic max-w-[140px] truncate" title={revoked_detail}>
              "{revoked_detail}"
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "started_at",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Started
      </div>
    ),
    size: 150,
    minSize: 150,
    cell: ({ row }) => (
      <div className="text-slate-600 text-[11px] font-medium whitespace-nowrap">
        {formatDate(row.original.started_at)}
      </div>
    ),
  },
  {
    accessorKey: "expires_at",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Expired
      </div>
    ),
    size: 150,
    minSize: 150,
    cell: ({ row }) => (
      <div className="text-slate-600 text-[11px] font-medium whitespace-nowrap">
        {formatDate(row.original.expires_at)}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center text-[10px] font-bold uppercase tracking-wider">
        Action
      </div>
    ),
    size: 150,
    minSize: 150,
    cell: ({ row }) => {
      const sub = row.original;
      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-slate-100/50 rounded-full"
              >
                <Ellipsis className="h-4 w-4 text-foreground/90" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 p-1.5 rounded-xl border-slate-300/60 shadow-sm"
            >
              <DropdownMenuLabel className="text-[10px] text-foreground/80 font-bold uppercase tracking-widest mb-1 px-2">
                Manage
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="gap-2 cursor-pointer py-1.5 rounded-lg focus:bg-app-primary2/10 focus:text-app-primary2 font-semibold text-xs"
                onClick={() => onAction(sub, "view")}
              >
                <Eye className="w-3.5 h-3.5" />
                View User
              </DropdownMenuItem>
              
              {/* <DropdownMenuItem
                className="gap-2 cursor-pointer py-1.5 rounded-lg focus:bg-app-primary2/10 focus:text-app-primary2 font-semibold text-xs"
                onClick={() => onAction(sub, "upgrade")}
              >
                <ArrowUpCircle className="w-3.5 h-3.5" />
                Upgrade Plan
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={sub.status === "Expired"}
                className="gap-2 cursor-pointer py-1.5 rounded-lg text-amber-600 focus:bg-amber-50 focus:text-amber-700 font-semibold text-xs disabled:opacity-40"
                onClick={() => onAction(sub, "expire")}
              >
                <CalendarOff className="w-3.5 h-3.5" />
                Mark Expired
              </DropdownMenuItem> */}
              <DropdownMenuItem
                disabled={sub.status === "Revoked"}
                className="gap-2 cursor-pointer py-1.5 rounded-lg text-red-600 focus:bg-red-50 focus:text-red-700 font-semibold text-xs disabled:opacity-40"
                onClick={() => onAction(sub, "revoke")}
              >
                <ShieldOff className="w-3.5 h-3.5" />
                Revoke Access
              </DropdownMenuItem>
             
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
