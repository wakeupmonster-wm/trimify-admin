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
    size: 250,
    minSize: 150,
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
              <MoreVertical className="h-4 w-4 text-foreground/90" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-40 p-2 rounded-xl border-slate-300/60 shadow-sm"
          >
            <DropdownMenuLabel className="text-[10px] 3xl:text-xs text-foreground/80 font-bold uppercase tracking-widest mb-1 px-2">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="gap-2 cursor-pointer py-1.5 rounded-lg hover:!bg-blue-50 focus:bg-app-primary2 focus:text-brand-blue font-semibold text-xs "
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
