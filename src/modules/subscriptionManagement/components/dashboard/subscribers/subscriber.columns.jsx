import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreVertical,
  ArrowUpCircle,
  CalendarOff,
  ShieldOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STATUS_STYLE = {
  Active: "bg-emerald-50 text-emerald-600",
  Expired: "bg-amber-50 text-amber-600",
  Revoked: "bg-rose-50 text-rose-600",
};

const formatDate = (value) => {
  if (!value) return "-";
  try {
    return format(new Date(value), "dd MMM yyyy");
  } catch {
    return "-";
  }
};

// revoked_reason is derived server-side from the subscriber's latest
// transaction: "auto_refund"/"auto_dispute" mean the revoke was a side-effect
// of a payment refund/dispute, not an admin action; "manual_admin" means the
// admin actually pressed Revoke. Falls back to a humanized raw value for any
// future reason we don't know about yet.
const REVOKE_REASON_LABEL = {
  auto_refund: "Auto-revoked · Refund",
  auto_dispute: "Auto-revoked · Dispute",
  manual_admin: "Manually revoked",
};

const humanizeReason = (value) =>
  REVOKE_REASON_LABEL[value] ||
  String(value || "")
    .replace(/_/g, " ")
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");

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
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Email
      </div>
    ),
    size: 150,
    minSize: 150,
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="text-[11px] text-slate-600 font-medium truncate">
          {row.original.email || "-"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "plan_title",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Plan
      </div>
    ),
    size: 150,
    minSize: 150,
    cell: ({ row }) => (
      <div className="font-semibold text-slate-600 text-[11px]">
        {row.original.plan_title || "Unknown Plan"}
      </div>
    ),
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
        Expires
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
    accessorKey: "status",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Status
      </div>
    ),
    size: 150,
    minSize: 150,
    cell: ({ row }) => {
      const { status, revoked_reason } = row.original;
      return (
        <div className="flex flex-col items-start gap-1">
          <Badge
            className={cn(
              "text-[9px] font-black uppercase border-none shadow-none rounded-full px-2.5 py-0.5",
              STATUS_STYLE[status] || "bg-slate-100 text-slate-500",
            )}
          >
            {status}
          </Badge>
          {status === "Revoked" && revoked_reason && (
            <span className="text-[10px] font-medium text-slate-400 pl-0.5">
              {humanizeReason(revoked_reason)}
            </span>
          )}
        </div>
      );
    },
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
                <MoreVertical className="h-4 w-4 text-foreground/90" />
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
                className="gap-2 cursor-pointer py-1.5 rounded-lg focus:bg-app-primary2/10 focus:text-brand-blue font-semibold text-xs"
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
              </DropdownMenuItem>
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
