import { Badge } from "@/components/ui/badge";
import { Eye, Ellipsis, Mail, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STATUS_BADGE_STYLE } from "@/config/theme.config";
import { format } from "date-fns";

export const getViewUserProgramColumns = (onAction) => [
  {
    accessorKey: "sno",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
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
        <div className="w-10 px-1 text-left font-bold text-[11px] text-foreground/90">
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
      <span className="capitalize font-bold text-slate-700 text-[11px] tracking-tight">
        {row.original.user?.name || "-"}
      </span>
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
      const email = row.original.user?.email;
      if (!email)
        return <span className="text-slate-400 text-[11px] italic">-</span>;
      return (
        <div
          className="flex items-center gap-2 w-full text-[11px] font-medium text-slate-700 tracking-tight"
          title={email}
        >
          <Mail className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="truncate max-w-44 block">{email}</span>
        </div>
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
    size: 100,
    minSize: 90,
    cell: ({ row }) => {
      const status = row.original.status || "Inactive";
      const style =
        STATUS_BADGE_STYLE[status.toLowerCase()] || STATUS_BADGE_STYLE.active;
      return (
        <div className="flex justify-start">
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
    accessorKey: "start_date",
    header: () => (
      <div className="text-[10px] px-1 font-bold uppercase tracking-wider text-left">
        Started
      </div>
    ),
    size: 100,
    minSize: 90,
    cell: ({ row }) => {
      const dateValue = row.original.start_date;
      if (!dateValue || isNaN(new Date(dateValue).getTime())) {
        return <div className="text-center text-slate-500 text-[11px]">—</div>;
      }
      return (
        <div className="text-left text-[11px] font-medium text-slate-700 tracking-tight whitespace-nowrap">
          {format(new Date(dateValue), "dd MMM yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "end_date",
    header: () => (
      <div className="text-[10px] px-1 font-bold uppercase tracking-wider text-left">
        Expired
      </div>
    ),
    size: 100,
    minSize: 90,
    cell: ({ row }) => {
      const dateValue = row.original.end_date;
      if (!dateValue || isNaN(new Date(dateValue).getTime())) {
        return <div className="text-center text-slate-500 text-[11px]">—</div>;
      }
      return (
        <div className="text-left text-[11px] font-medium text-slate-700 tracking-tight whitespace-nowrap">
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
    size: 100,
    minSize: 80,
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
