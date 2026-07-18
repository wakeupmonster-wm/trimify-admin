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

export const getFaqManagementColumns = (onAction) => [
  {
    id: "sno",
    header: () => (
      <div className="w-10 text-left text-[11px] font-bold text-foreground">
        SR.No
      </div>
    ),
    size: 80,
    minSize: 80,
    cell: ({ row, table }) => {
      const { pageIndex = 0, pageSize = 10 } =
        table.getState().pagination || {};
      const serialNumber = pageIndex * pageSize + row.index + 1;
      return (
        <div className="w-10 px-1 text-left font-medium text-[11px] text-slate-700">
          {serialNumber}
        </div>
      );
    },
  },
  {
    accessorKey: "question",
    header: () => (
      <div className="text-[11px] font-bold text-foreground text-left">
        Question
      </div>
    ),
    size: 250,
    minSize: 250,
    cell: ({ row }) => (
      <span className="text-[11px] font-medium text-slate-700">
        {row.getValue("question") || "-"}
      </span>
    ),
  },
  {
    accessorKey: "answer",
    header: () => (
      <div className="text-[11px] font-bold text-foreground text-left">
        Answer
      </div>
    ),
    size: 350,
    minSize: 350,
    cell: ({ row }) => (
      <span className="text-[11px] font-medium text-slate-700 line-clamp-1">
        {row.getValue("answer") || "-"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="text-[11px] font-bold text-foreground text-center">
        Status
      </div>
    ),
    size: 100,
    minSize: 100,
    cell: ({ row }) => {
      const isActive =
        row.original.status === "Active" || row.original.status === true;
      return (
        <div className="flex justify-center">
          <Switch
            checked={isActive}
            onCheckedChange={(checked) =>
              onAction && onAction(row.original, "toggle-status", checked)
            }
            className="data-[state=checked]:bg-brand-blue"
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center text-[11px] font-bold text-foreground">
        Action
      </div>
    ),
    size: 100,
    minSize: 100,
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
          <DropdownMenuContent
            align="end"
            className="w-40 p-2 rounded-xl border-slate-200 shadow-sm"
          >
            <DropdownMenuLabel className="text-[10px] text-foreground/80 font-bold uppercase tracking-widest mb-1 px-2">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="gap-2 cursor-pointer py-1.5 rounded-lg hover:!bg-blue-50 focus:bg-brand-blue focus:text-brand-blue font-semibold text-xs "
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
