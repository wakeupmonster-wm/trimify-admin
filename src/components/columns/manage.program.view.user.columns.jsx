import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
    accessorKey: "user_id",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        User Id
      </div>
    ),
    size: 100,
    minSize: 80,
    cell: ({ row }) => (
      <span className="font-bold text-slate-700 text-[11px] tracking-tight">
        {row.original.user_id || "-"}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        User Name
      </div>
    ),
    size: 200,
    minSize: 150,
    cell: ({ row }) => (
      <span className="capitalize font-bold text-slate-700 text-[11px] tracking-tight">
        {row.original.user?.name || "-"}
      </span>
    ),
  },
  {
    accessorKey: "start_date",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Start Date
      </div>
    ),
    size: 120,
    minSize: 100,
    cell: ({ row }) => (
      <span className="font-medium text-slate-700 text-[11px] tracking-tight">
        {row.original.start_date || "-"}
      </span>
    ),
  },
  {
    accessorKey: "end_date",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        End Date
      </div>
    ),
    size: 120,
    minSize: 100,
    cell: ({ row }) => (
      <span className="font-medium text-slate-700 text-[11px] tracking-tight">
        {row.original.end_date || "-"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Status
      </div>
    ),
    size: 120,
    minSize: 100,
    cell: ({ row }) => {
      const status = row.original.status || "Inactive";
      const isActive = status === "Active";
      return (
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
            isActive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          <span
            className={`w-1 h-1 rounded-full ${
              isActive ? "bg-emerald-600" : "bg-rose-600"
            }`}
          />
          {status}
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
              className="gap-2 cursor-pointer py-1.5 rounded-lg hover:!bg-blue-50 focus:bg-app-primary2 focus:text-brand-blue font-semibold text-xs "
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
