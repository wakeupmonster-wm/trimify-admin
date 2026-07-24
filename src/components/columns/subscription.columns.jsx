import React from "react";
import { Button } from "@/components/ui/button";
import { Ellipsis, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export const getSubscriptionColumns = (onAction) => [
  {
    id: "sno",
    header: () => (
      <div className="w-10 text-center text-[10px] font-bold uppercase tracking-wider">
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
        <div className="w-10 text-left px-2 font-bold text-[11px] text-foreground/90">
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
        Plan Title
      </div>
    ),
    size: 120,
    minSize: 80,
    cell: ({ row }) => (
      <div className="capitalize font-bold text-slate-700 text-[11px] tracking-tight whitespace-nowrap">
        {row.original.title || "-"}
      </div>
    ),
  },
  {
    accessorKey: "duration",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Duration
      </div>
    ),
    size: 120,
    minSize: 80,
    cell: ({ row }) => (
      <div className="capitalize font-medium text-slate-600 text-[11px] tracking-tight whitespace-nowrap">
        {row.original.duration ? `${row.original.duration} Months` : "-"}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Price
      </div>
    ),
    size: 120,
    minSize: 80,
    cell: ({ row }) => (
      <div className="font-medium text-slate-600 text-[11px] tracking-tight whitespace-nowrap">
        {row.original.price ? `$${row.original.price}` : "-"}
      </div>
    ),
  },
  {
    accessorKey: "subtitle",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Sub Title
      </div>
    ),
    size: 150,
    minSize: 100,
    cell: ({ row }) => (
      <div className="font-medium text-slate-600 text-[11px] tracking-tight whitespace-nowrap">
        {row.original.subtitle || "-"}
      </div>
    ),
  },
  {
    accessorKey: "features",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Features
      </div>
    ),
    size: 200,
    minSize: 150,
    cell: ({ row }) => (
      <div className="font-medium text-slate-600 text-[11px] tracking-tight truncate max-w-[250px]">
        {row.original.features || "-"}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center text-[10px] font-bold uppercase tracking-wider">
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
            <DropdownMenuLabel className="text-[10px] text-foreground/80 font-bold uppercase tracking-widest mb-1 px-2">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="gap-2 cursor-pointer py-1.5 rounded-lg  focus:bg-slate-100 focus:text-slate-900 font-semibold text-xs "
              onClick={() => onAction && onAction(row.original, "edit")}
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </DropdownMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <DropdownMenuItem
                    disabled
                    className="gap-2 py-1.5 rounded-lg text-red-600/50 font-semibold text-xs cursor-not-allowed"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </DropdownMenuItem>
                </span>
              </TooltipTrigger>
              <TooltipContent side="left" className="text-xs max-w-[200px]">
                Plan deletion isn't supported by the API yet.
              </TooltipContent>
            </Tooltip>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
