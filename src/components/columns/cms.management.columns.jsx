import { MoreVertical, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <div className="w-10 text-left text-[11px] font-bold text-foreground">
        S.No
      </div>
    ),
    size: 120,
    minSize: 120,
    cell: ({ row, table }) => {
      const { pageIndex = 0, pageSize = 10 } = table.getState().pagination || {};
      const serialNumber = pageIndex * pageSize + row.index + 1;
      return (
        <div className="w-14 text-left font-medium text-[11px] text-slate-700">
          {serialNumber}
        </div>
      );
    },
  },
  {
    accessorKey: "pageName",
    header: () => (
      <div className="text-[11px] font-bold text-foreground text-left">
        Page name
      </div>
    ),
    size: 150,
    minSize: 150,
    cell: ({ row }) => (
      <span className="text-[11px] font-medium text-slate-700">
        {row.getValue("pageName") || "-"}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center text-[11px] font-bold text-foreground">
        Action
      </div>
    ),
    size: 120,
    minSize: 120,
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
