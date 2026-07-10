import { Badge } from "@/components/ui/badge";
import { Edit, Trash, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export const getPrizeColumns = (onEdit, onDelete) => [
  {
    id: "serialNumber",
    header: "SR.No",
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      return (
        <span className="text-xs pl-2 font-semibold">
          {pageIndex * pageSize + row.index + 1}
        </span>
      );
    },
  },
  {
    accessorKey: "title",
    header: () => <div className="whitespace-nowrap uppercase">Title</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5 min-w-max">
        <span className="font-semibold text-foreground/90 text-xs whitespace-nowrap">
          {row.getValue("title")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "value",
    header: () => <div className="whitespace-nowrap uppercase">Value</div>,
    cell: ({ row }) => (
      <span className="font-semibold text-foreground/90 text-[11px] whitespace-nowrap block w-max">
        ${row.getValue("value")}
      </span>
    ),
  },
  {
    accessorKey: "spinWheelLabel",
    header: () => (
      <div className="whitespace-nowrap uppercase">Winner label</div>
    ),
    cell: ({ row }) => {
      const label = row.getValue("spinWheelLabel");

      if (!label) {
        return <span className="text-xs text-slate-400 font-mono">-</span>;
      }

      return (
        <div className="flex items-center min-w-max">
          <span className="text-[11px] font-semibold text-foreground/70 tracking-tight whitespace-nowrap">
            {label}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "supportiveItems",
    header: "Supportive Items",
    cell: ({ row }) => {
      const items = row.original.supportiveItems || [];

      if (items.length === 0) {
        return <span className="text-sm text-gray-400">-</span>;
      }

      return (
        <div className="flex items-center gap-1 whitespace-nowrap">
          {items.slice(0, 3).map((item, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 border-none transition-all duration-200 hover:bg-slate-200"
            >
              {item}
            </Badge>
          ))}

          {items.length > 3 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  onClick={() => onEdit(row.original)}
                  className="cursor-pointer"
                >
                  <Badge
                    variant="outline"
                    className="rounded-md px-2 py-0.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 border-indigo-100 transition-all duration-200 hover:scale-105 hover:bg-indigo-100"
                  >
                    +{items.length - 3}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{items.slice(3).join(", ")}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Click to edit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <button
        className="flex items-center uppercase hover:text-gray-900 transition-colors whitespace-nowrap"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="inline">Created</span>
        <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />
      </button>
    ),
    cell: ({ row }) => {
      const dateValue = row.getValue("createdAt");
      return (
        <div className="flex flex-col min-w-24">
          <span className="text-[11px] font-semibold text-foreground/90">
            {format(new Date(dateValue), "dd MMM, yyyy")}
          </span>
          <span className="text-[10px] font-medium text-foreground/70">
            {dateValue
              ? formatDistanceToNow(new Date(dateValue), { addSuffix: true })
              : "-"}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const prize = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-brand-aqua hover:bg-brand-aqua/10 rounded-full transition-colors"
            onClick={() => onEdit(prize)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            onClick={() => onDelete(prize._id, prize.title)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
