import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatAppDate } from "@/lib/utils";

export const getCmsManagementColumns = (onAction) => [
  {
    id: "sno",
    header: () => (
      <div className="w-8 text-left text-[10px] 3xl:text-xs font-bold text-foreground">
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
        <div className="w-9 px-1 text-left font-medium text-[11px] 3xl:text-xs text-slate-700">
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
    size: 200,
    minSize: 150,
    cell: ({ row }) => (
      <span className="text-[11px] 3xl:text-xs font-medium text-slate-700">
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
    size: 380,
    minSize: 300,
    cell: ({ row }) => {
      const description = row.getValue("description") || "-";
      return (
        <div
          className="text-[11px] 3xl:text-xs font-medium max-w-80 text-slate-700 line-clamp-2"
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
    size: 180,
    minSize: 100,
    cell: ({ row }) => (
      <div className="text-[11px] 3xl:text-xs font-medium text-slate-700">
        {row.original.created_at
          ? formatAppDate(row.original.created_at)
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
      <div className="text-[11px] 3xl:text-xs font-medium text-slate-700">
        {row.original.updated_at
          ? formatAppDate(row.original.updated_at)
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="text-left px-1 text-[10px] 3xl:text-xs font-bold text-foreground">
        Status
      </div>
    ),
    size: 100,
    minSize: 80,
    cell: ({ row }) => {
      const rawStatus = (row.original.status || "Unknown").replace(/\.+$/, "");
      let config = {
        bg: "bg-slate-100/70",
        text: "text-slate-700",
        hover: "hover:bg-slate-100",
      };

      const s = String(rawStatus).toLowerCase().trim();
      let displayStatus = rawStatus;

      if (s === "active" || s === "1" || s === "true") {
        config = {
          bg: "bg-emerald-100/70",
          text: "text-emerald-700",
          hover: "hover:bg-emerald-100",
        };
        if (s === "1" || s === "true") displayStatus = "Active";
      } else if (s === "inactive" || s === "0" || s === "false") {
        config = {
          bg: "bg-rose-100/70",
          text: "text-rose-700",
          hover: "hover:bg-rose-100",
        };
        if (s === "0" || s === "false") displayStatus = "Inactive";
      }

      return (
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className={cn(
              "flex w-max items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border-none",
              config.bg,
              config.text,
              config.hover,
            )}
          >
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
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-600 hover:text-app-primary2 hover:bg-app-primary2/10 rounded-full transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onAction && onAction(row.original, "edit");
          }}
          title="View"
          aria-label="View"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
