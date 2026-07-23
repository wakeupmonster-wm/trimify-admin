import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Ellipsis, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

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
    accessorKey: "user_id",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        User Id
      </div>
    ),
    size: 100,
    minSize: 80,
    cell: ({ row }) => (
      <div className="text-[11px] font-medium text-slate-700 tracking-tight break-all truncate min-w-0">
        {row.original.user_id || "-"}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        User Name
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
        Email Id
      </div>
    ),
    size: 180,
    minSize: 120,
    cell: ({ row }) => (
      <div
        className="text-[11px] font-medium text-slate-600 tracking-tight truncate min-w-0"
        title={row.original.email}
      >
        {row.original.email || "-"}
      </div>
    ),
  },
  {
    accessorKey: "mobileNo",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Contact No.
      </div>
    ),
    size: 100,
    minSize: 90,
    cell: ({ row }) => (
      <div className="text-[11px] font-medium text-slate-600 tracking-tight whitespace-nowrap">
        {row.original.mobileNo || "-"}
      </div>
    ),
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
      if (!plan || plan === "No-Active Plan") {
        return (
          <Badge
            variant="outline"
            className="bg-slate-100 text-slate-500 border-none font-semibold text-[10px] truncate max-w-full"
          >
            <span className="truncate">No-Active Plan</span>
          </Badge>
        );
      }
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-700 border-none font-semibold text-[10px] truncate max-w-full"
        >
          <span className="truncate">{plan}</span>
        </Badge>
      );
    },
  },
  {
    accessorKey: "planBuy",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-center">
        Plan Buy
      </div>
    ),
    size: 90,
    minSize: 85,
    cell: ({ row }) => {
      const dateValue = row.original.planBuy;
      if (
        !dateValue ||
        dateValue === "No" ||
        isNaN(new Date(dateValue).getTime())
      ) {
        return <div className="text-center text-slate-500 text-[11px]">No</div>;
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
        Plan Expiry
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
        return <div className="text-center text-slate-500 text-[11px]">No</div>;
      }
      return (
        <div className="text-center text-[11px] font-medium text-slate-700 tracking-tight whitespace-nowrap">
          {format(new Date(dateValue), "dd MMM yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "sub_admin",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Added by
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
      const rawStatus = String(row.original.status || "Active");
      const isActive =
        rawStatus.toLowerCase() === "active" ||
        rawStatus === "1" ||
        rawStatus.toLowerCase() === "true";
      const displayStatus = isActive ? "Active" : "Inactive";

      return (
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border-none",
              isActive
                ? "bg-emerald-100/70 text-emerald-700 hover:bg-emerald-100"
                : "bg-rose-100/70 text-rose-700 hover:bg-rose-100"
            )}
          >
            <span
              className={cn(
                "w-1 h-1 rounded-full",
                isActive ? "bg-emerald-600" : "bg-rose-600"
              )}
            />
            {displayStatus}
          </Badge>
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
            <DropdownMenuLabel className="text-[10px] text-foreground/80 font-bold uppercase tracking-widest mb-1 px-2">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="gap-2 cursor-pointer py-1.5 rounded-lg hover:!bg-blue-50 focus:bg-app-primary2 focus:text-app-primary2 font-semibold text-xs "
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
