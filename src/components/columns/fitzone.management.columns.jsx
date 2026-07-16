import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const getFitzoneManagementColumns = (onAction) => [
  {
    id: "sno",
    header: () => (
      <div className="w-10 text-left text-[10px] font-bold uppercase tracking-wider">
        SR.No
      </div>
    ),
    size: 100,
    minSize: 100,
    cell: ({ row, table }) => {
      const { pageIndex = 0, pageSize = 10 } =
        table.getState().pagination || {};
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
    accessorKey: "fitzoneName",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Fitzone Name
      </div>
    ),
    size: 350,
    minSize: 350,
    cell: ({ row }) => (
      <span className="text-[11px] font-medium text-slate-700 tracking-tight">
        {row.original.title || "-"}
      </span>
    ),
  },
  {
    id: "manage",
    header: () => (
      <div className="text-[10px] text-left font-bold uppercase tracking-wider">
        Manage
      </div>
    ),
    size: 300,
    minSize: 300,
    cell: ({ row }) => (
      <div className="flex">
        <Button
          onClick={() => onAction && onAction(row.original, "open-program")}
          className="bg-brand-blue hover:bg-brand-hoverBlue text-white h-7 px-4 text-[10px] font-medium rounded shadow-sm"
        >
          Open Program
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-center">
        Status
      </div>
    ),
    size: 300,
    minSize: 300,
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
      <div className="text-center text-[10px] font-bold uppercase tracking-wider">
        Action
      </div>
    ),
    size: 200,
    minSize: 200,
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
            className="w-36 p-1.5 rounded-xl border-slate-200 shadow-sm"
          >
            <DropdownMenuLabel className="text-[10px] text-foreground/80 font-bold uppercase tracking-widest mb-1 px-2">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="gap-2 cursor-pointer py-1.5 rounded-lg focus:bg-brand-blue focus:text-brand-blue font-semibold text-xs"
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
