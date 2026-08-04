import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Ellipsis, Eye, Mail, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { STATUS_BADGE_STYLE } from "@/config/theme.config";

export const getUserManagementColumns = (onAction) => [
  {
    id: "sno",
    header: () => (
      <div className="w-8 sm:w-10 text-left text-[10px] font-bold uppercase tracking-wider">
        SR.No
      </div>
    ),
    size: 50,
    minSize: 50,
    cell: ({ row, table }) => {
      const { pageIndex = 0, pageSize = 10 } =
        table.getState().pagination || {};
      const serialNumber = pageIndex * pageSize + row.index + 1;

      return (
        <div className="w-8 sm:w-10 px-1 text-left font-bold text-[11px] text-foreground/90">
          {serialNumber}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Username
      </div>
    ),
    size: 160,
    minSize: 120,
    cell: ({ row }) => (
      <div className="capitalize font-bold text-slate-700 text-[11px] tracking-tight break-words line-clamp-2">
        {row.original.name || "-"}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Email Address
      </div>
    ),
    size: 180,
    minSize: 120,
    cell: ({ row }) => {
      const email = row.original.email;
      if (!email) return <div className="text-slate-400 text-[11px] italic">-</div>;
      return (
        <div
          className="flex items-center gap-2 w-full text-[11px] font-medium text-slate-600 tracking-tight"
          title={email}
        >
          <Mail className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="truncate max-w-36 block">{email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "mobileNo",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Contact Number
      </div>
    ),
    size: 110,
    minSize: 100,
    cell: ({ row }) => {
      const phone = row.original.mobileNo;
      if (!phone) return <div className="text-slate-400 text-[11px] italic">-</div>;
      return (
        <div className="flex items-center gap-2 w-full text-[11px] font-medium text-slate-600 tracking-tight whitespace-nowrap">
          <Phone className="w-3 h-3 text-slate-500 shrink-0" />
          {phone}
        </div>
      );
    },
  },
  {
    accessorKey: "plan",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Active Plan
      </div>
    ),
    size: 160,
    minSize: 130,
    cell: ({ row }) => {
      const plan = row.original?.plan?.title;
      const isNoPlan = !plan || plan === "No-Active Plan";
      return (
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] font-bold px-2.5 py-0.5 rounded-full border-none shadow-none uppercase flex items-center gap-1.5 transition-all duration-200 max-w-full w-fit",
            isNoPlan
              ? "bg-slate-500/10 text-slate-600"
              : "bg-emerald-500/10 text-emerald-600",
          )}
        >
          <span className="w-1 h-1 shrink-0 rounded-full bg-current" />
          <span className="truncate">{isNoPlan ? "No-Active Plan" : plan}</span>
        </Badge>
      );
    },
  },
  {
    accessorKey: "sub_admin",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Added By
      </div>
    ),
    size: 140,
    minSize: 120,
    cell: ({ row }) => {
      const addedBy = row.original.sub_admin
        ? row.original.sub_admin.name || row.original.sub_admin
        : "-";
      return (
        <div className="capitalize text-[11px] font-medium text-slate-600 tracking-tight line-clamp-2 break-words">
          {addedBy}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-center">
        Status
      </div>
    ),
    size: 80,
    minSize: 75,
    cell: ({ row }) => {
      let status = row.original.status || "Active";
      if (row.original.revoked_at) status = "Revoked";
      const style =
        STATUS_BADGE_STYLE[status.toLowerCase()] || STATUS_BADGE_STYLE.active;
      return (
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] font-bold px-2.5 py-0.5 rounded-full border-none shadow-none uppercase flex items-center gap-1.5 transition-all duration-200 max-w-full w-fit",
              style,
            )}
          >
            <span className="w-1 h-1 shrink-0 rounded-full bg-current" />
            <span className="truncate">{status}</span>
          </Badge>
        </div>
      );
    },
  },
  {
    id: "boughtOn",
    accessorFn: (row) => row.transactions?.[0]?.created_at || null,
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-center">
        Started
      </div>
    ),
    size: 90,
    minSize: 85,
    cell: ({ row }) => {
      const dateValue = row.original.transactions?.[0]?.created_at;
      if (!dateValue || isNaN(new Date(dateValue).getTime())) {
        return <div className="text-center text-slate-500 text-[11px]">—</div>;
      }
      return (
        <div className="text-center text-[11px] font-medium text-slate-700 tracking-tight whitespace-nowrap">
          {format(new Date(dateValue), "dd MMM yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "plan_expiry",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-center">
        Expired
      </div>
    ),
    size: 90,
    minSize: 85,
    cell: ({ row }) => {
      const dateValue = row.original.plan_expiry;
      if (
        !dateValue ||
        dateValue === "No" ||
        isNaN(new Date(dateValue).getTime())
      ) {
        return <div className="text-center text-slate-500 text-[11px]">—</div>;
      }
      return (
        <div className="text-center text-[11px] font-medium text-slate-700 tracking-tight whitespace-nowrap">
          {format(new Date(dateValue), "dd MMM yyyy")}
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
    size: 60,
    minSize: 60,
    cell: ({ row }) => (
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
            className="w-36 p-2 rounded-xl border-slate-300/60 shadow-sm"
          >
            <DropdownMenuLabel className="text-[11px] 3xl:text-xs text-foreground/80 font-bold uppercase tracking-widest mb-1 px-2">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="gap-2 cursor-pointer py-1.5 rounded-lg  focus:bg-slate-100 focus:text-slate-900 font-semibold text-xs "
              onClick={() => onAction && onAction(row.original, "view")}
            >
              <Eye className="w-3.5 h-3.5" />
              View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
