import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpDown,
  Eye,
  Info,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dummyImg from "@/assets/web/dummyImg.webp";
import { IoFlagSharp } from "react-icons/io5";
import { format, formatDistanceToNow } from "date-fns";

export const reportColumns = (navigate) => [
  {
    id: "sno",
    header: () => (
      <div className="w-20 text-center text-[10px] font-bold uppercase tracking-wider ">
        SR.NO
      </div>
    ),
    size: 80,
    minSize: 100,
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      const serialNumber = pageIndex * pageSize + row.index + 1;

      return (
        <div className="w-20 text-center font-bold text-[11px] text-foreground/90">
          {serialNumber}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nickname",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider ">
        User Profile
      </div>
    ),
    size: 130,
    minSize: 140,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <img
          src={row.original.profilePhoto || dummyImg}
          className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
          alt="avatar"
        />
        <span className="capitalize font-bold text-[11px] text-slate-700 truncate max-w-[120px] block">
          {row.getValue("nickname")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "reportCount",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider ">
        Reports
      </div>
    ),
    size: 130,
    minSize: 90,
    cell: ({ row }) => {
      const count = row.getValue("reportCount"); // Extract value once for cleaner code

      return (
        <Badge
          variant="outline"
          className="gap-1.5 w-max font-bold  px-0 border-transparent text-[11px]"
        >
          <IoFlagSharp className="w-3 h-3 text-rose-400" />
          {count} report
          {count !== 1 ? "s" : ""}
        </Badge>
      );
    },
  },
  {
    accessorKey: "lastReportedAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 text-[10px] font-bold uppercase tracking-wider  hover:text-slate-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Last Reported
        <ArrowUpDown className="svg text-muted-foreground" />
      </Button>
    ),
    size: 130,
    minSize: 120,
    cell: ({ row }) => {
      const dateValue = row.getValue("lastReportedAt");
      if (!dateValue || isNaN(new Date(dateValue).getTime())) {
        return <span className="text-slate-400 text-xs">-</span>;
      }

      const date = new Date(dateValue);

      return (
        <div className="flex flex-col min-w-24">
          <span className="text-[11px] font-bold text-slate-700 tracking-tight">
            {format(date, "dd MMM, yyyy")}
          </span>
          <span className="text-[10px] font-medium text-slate-400">
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider ">
        Status
      </div>
    ),
    size: 130,
    minSize: 100,
    cell: ({ row }) => {
      const rawStatus = row.getValue("status");
      let status = rawStatus;
      if (rawStatus === "new") {
        status = "pending";
      } else if (rawStatus === "in_progress") {
        status = "In progress";
      }

      const colors = {
        resolved: "bg-emerald-500/10 text-emerald-600",
        pending: "bg-amber-500/10 text-amber-600",
        "In progress": "bg-blue-500/10 text-blue-600",
      };
      return (
        <Badge
          variant="outline"
          className={cn(
            "uppercase flex items-center gap-1.5 w-max font-bold text-[10px] rounded-full border-none shadow-none transition-opacity px-2.5 py-0.5",
            colors[status] || "bg-slate-500/10",
          )}
        >
          <span className="w-1 h-1 rounded-full bg-current" />
          {status.replace(/_/g, " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "reportCount",
    id: "reportCountDisplay", // Unique ID
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider ">
        Priority
      </div>
    ),
    size: 80,
    minSize: 90,
    cell: ({ row }) => {
      const count = row.getValue("reportCount");
      const severity = row.original?.severity;

      if (severity === "high") {
        return (
          <Badge className="text-[10px] font-bold text-red-600 px-0 border-transparent bg-transparent shadow-none">
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
            HIGH
          </Badge>
        );
      }

      if (severity === "medium") {
        return (
          <Badge className="text-[10px] font-bold text-amber-600 px-0 border-transparent bg-transparent shadow-none">
            <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
            MEDIUM
          </Badge>
        );
      }

      return (
        <Badge className="text-[10px] font-bold text-blue-600 px-0 border-transparent bg-transparent shadow-none">
          <Info className="w-3.5 h-3.5 mr-1.5" />
          LOW
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center text-[10px] font-bold uppercase tracking-wider ">
        Actions
      </div>
    ),
    size: 100,
    minSize: 100,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8  hover:text-brand-aqua hover:bg-slate-100 data-[state=open]:bg-slate-100 rounded-2xl transition-colors"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 p-2 shadow-sm rounded-2xl border-slate-200"
            >
              <DropdownMenuLabel className="text-[10px] text-foreground/80 font-bold uppercase tracking-widest mb-1">
                Report Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="gap-2 cursor-pointer py-2 rounded-xl focus:bg-brand-aqua/10 focus:text-brand-aqua  font-semibold text-xs transition-colors"
                onClick={() => navigate(`/admin/management/profile-reports/review/${row.original?.userId}`)}
              >
                <Eye className="w-4 h-4" />
                Review Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
