import { Switch } from "@/components/ui/switch";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const getManageCategoryColumns = (onAction) => [
  {
    id: "sno",
    header: () => (
      <div className="w-10 text-left text-[10px] font-bold uppercase tracking-wider">
        S.No
      </div>
    ),
    size: 50,
    minSize: 40,
    cell: ({ row, table }) => {
      const { pageIndex = 0, pageSize = 10 } = table.getState().pagination || {};
      const serialNumber = pageIndex * pageSize + row.index + 1;

      return (
        <div className="w-10 text-left font-bold text-[11px] text-foreground/90">
          {serialNumber}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Title
      </div>
    ),
    size: 200,
    minSize: 150,
    cell: ({ row }) => (
      <span className="text-[11px] font-medium text-slate-700 tracking-tight">
        {row.original.title || "-"}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Description
      </div>
    ),
    size: 350,
    minSize: 250,
    cell: ({ row }) => (
      <span className="text-slate-700 font-medium text-[11px] tracking-tight line-clamp-1">
        {row.original.description || "-"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-center">
        Status
      </div>
    ),
    size: 100,
    minSize: 80,
    cell: ({ row }) => {
      const isActive = row.original.status === "Active" || row.original.status === true;
      return (
        <div className="flex justify-center">
          <Switch
            checked={isActive}
            onCheckedChange={(checked) => onAction && onAction(row.original, "toggle-status", checked)}
            className="data-[state=checked]:bg-brand-blue"
          />
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
              <MoreVertical className="h-4 w-4 text-foreground/90" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 p-1.5 rounded-xl border-slate-200 shadow-sm">
            <DropdownMenuLabel className="text-[10px] text-foreground/80 font-bold uppercase tracking-widest mb-1 px-2">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="gap-2 cursor-pointer py-1.5 rounded-lg focus:bg-brand-aqua/10 focus:text-brand-aqua font-semibold text-xs"
              onClick={() => onAction && onAction(row.original, "edit")}
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 cursor-pointer py-1.5 rounded-lg text-red-600 focus:bg-red-50 focus:text-red-700 font-semibold text-xs"
              onClick={() => onAction && onAction(row.original, "delete")}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
