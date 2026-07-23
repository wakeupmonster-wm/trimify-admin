import { Ellipsis, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const getCmsManagementColumns = (onAction) => [
  {
    id: "sno",
    header: () => (
      <div className="w-10 text-left text-[10px] 3xl:text-xs font-bold text-foreground">
        SR.No
      </div>
    ),
    size: 60,
    minSize: 50,
    cell: ({ row, table }) => {
      const { pageIndex = 0, pageSize = 10 } =
        table.getState().pagination || {};
      const serialNumber = pageIndex * pageSize + row.index + 1;
      return (
        <div className="w-14 text-left font-medium text-[10px] 3xl:text-xs text-slate-700">
          {serialNumber}
        </div>
      );
    },
  },
  {
    accessorKey: "pageName",
    header: () => (
      <div className="text-[10px] 3xl:text-xs font-bold text-foreground text-left">
        Page name
      </div>
    ),
    size: 250,
    minSize: 150,
    cell: ({ row }) => (
      <span className="text-[10px] 3xl:text-xs font-medium text-slate-700">
        {row.getValue("pageName") || "-"}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: () => (
      <div className="text-[10px] 3xl:text-xs font-bold text-foreground text-left">
        Description
      </div>
    ),
    size: 350,
    minSize: 300,
    cell: ({ row }) => {
      const description = row.getValue("description") || "-";
      return (
        <div
          className="text-[10px] 3xl:text-xs font-medium text-slate-700 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      );
    },
  },
  {
    accessorKey: "created_at",
    header: () => (
      <div className="text-[10px] 3xl:text-xs font-bold text-foreground text-left">
        Created At
      </div>
    ),
    size: 150,
    minSize: 100,
    cell: ({ row }) => (
      <div className="text-[10px] 3xl:text-xs font-medium text-slate-700">
        {row.original.created_at
          ? dayjs(row.original.created_at).format("DD MMM YYYY")
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "updated_at",
    header: () => (
      <div className="text-[10px] 3xl:text-xs font-bold text-foreground text-left">
        Updated At
      </div>
    ),
    size: 150,
    minSize: 100,
    cell: ({ row }) => (
      <div className="text-[10px] 3xl:text-xs font-medium text-slate-700">
        {row.original.updated_at
          ? dayjs(row.original.updated_at).format("DD MMM YYYY")
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="text-center text-[10px] 3xl:text-xs font-bold text-foreground">
        Status
      </div>
    ),
    size: 100,
    minSize: 80,
    cell: ({ row }) => {
      const rawStatus = row.original.status || "Unknown";
      let config = {
        bg: "bg-slate-100/70",
        text: "text-slate-700",
        dot: "bg-slate-500",
        hover: "hover:bg-slate-100",
      };

      const s = String(rawStatus).toLowerCase();
      let displayStatus = rawStatus;

      if (s === "active" || s === "1" || s === "true") {
        config = {
          bg: "bg-emerald-100/70",
          text: "text-emerald-700",
          dot: "bg-emerald-600",
          hover: "hover:bg-emerald-100",
        };
        if (s === "1" || s === "true") displayStatus = "Active";
      } else if (s === "inactive" || s === "0" || s === "false") {
        config = {
          bg: "bg-rose-100/70",
          text: "text-rose-700",
          dot: "bg-rose-600",
          hover: "hover:bg-rose-100",
        };
        if (s === "0" || s === "false") displayStatus = "Inactive";
      }

      return (
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className={cn(
              "flex w-max items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border-none",
              config.bg,
              config.text,
              config.hover,
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
            {displayStatus}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center text-[10px] 3xl:text-xs font-bold text-foreground">
        Action
      </div>
    ),
    size: 120,
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
            <DropdownMenuLabel className="text-[10px] 3xl:text-xs text-foreground/80 font-bold uppercase tracking-widest mb-1 px-2">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="gap-2 cursor-pointer py-1.5 rounded-lg hover:!bg-blue-50 focus:bg-app-primary2 focus:text-app-primary2 font-semibold text-xs "
              onClick={() => onAction && onAction(row.original, "edit")}
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
