import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Eye, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export const getWinnerColumns = (page = 1, limit = 10, navigate) => [
  {
    id: "serialNumber",
    header: "SR.NO",
    cell: ({ row }) => (
      <div className="text-[11px] font-medium pl-2 text-foreground/90">
        {(page - 1) * limit + row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: () => (
      <div className="whitespace-nowrap uppercase font-bold text-[10px]">
        Campaign Name
      </div>
    ),
    cell: ({ row }) => {
      const title = row.original?.title;
      return (
        <div className="flex items-center gap-2 group min-w-max">
          <span className="font-semibold text-foreground/90 text-xs whitespace-nowrap">
            {title || "Untitled Campaign"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <button
        className="flex items-center hover:text-gray-900 uppercase transition-colors whitespace-nowrap font-bold text-[10px]"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Campaign Date
        <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />
      </button>
    ),
    cell: ({ row }) => {
      const dateValue = row.original?.date;

      if (!dateValue) {
        return <span className="text-sm text-slate-400 italic">—</span>;
      }

      const parsedDate = new Date(
        dateValue + (String(dateValue).includes("T") ? "" : "T12:00:00"),
      );
      return (
        <div className="flex flex-col whitespace-nowrap min-w-max">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-foreground/90">
              {format(new Date(parsedDate), "dd MMM, yyyy")}
            </span>
          </div>
          <span className="text-[10px] font-medium text-foreground/70">
            {format(new Date(parsedDate), "EEEE")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "prize.title",
    header: () => (
      <div className="whitespace-nowrap uppercase font-bold text-[10px]">
        Prize
      </div>
    ),
    cell: ({ row }) => {
      const prize = row.original.prize;
      return (
        <div className="flex flex-col whitespace-nowrap min-w-max">
          <div className="flex items-center gap-2 group">
            <span className="text-[11px] font-semibold text-foreground/90 whitespace-nowrap">
              {prize?.title || "No Prize"}
            </span>
          </div>
          {prize?.value && (
            <span className="text-[10px] font-medium text-foreground/70 whitespace-nowrap">
              Value: ${prize.value}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "winner",
    header: () => (
      <div className="whitespace-nowrap uppercase font-bold text-[10px]">
        Winner
      </div>
    ),
    cell: ({ row }) => {
      const winner = row.original.winner;
      const status = row.original.drawStatus;

      if (!winner) {
        return status === "COMPLETED" ? (
          <div className="flex items-center gap-1 text-amber-600 italic text-xs whitespace-nowrap">
            No Winner Found
          </div>
        ) : (
          <span className="text-xs text-gray-400 italic whitespace-nowrap">
            Waiting for draw...
          </span>
        );
      }
      return (
        <div className="flex items-center gap-2 group min-w-max">
          <div className="flex flex-col whitespace-nowrap">
            <span className="text-[11px] font-semibold text-foreground/90 whitespace-nowrap">
              {winner.email || "No Email"}
            </span>
            <span className="text-[10px] font-medium text-foreground/70 whitespace-nowrap">
              {winner.phone || ""}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "drawStatus",
    header: () => (
      <div className="whitespace-nowrap uppercase font-bold text-[10px]">
        Status
      </div>
    ),
    cell: ({ row }) => {
      const status = row.original.drawStatus;
      return (
        <Badge
          variant="outline"
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border-none shadow-none flex items-center gap-1.5 w-max whitespace-nowrap ${
            status === "COMPLETED"
              ? "bg-emerald-500/10 text-emerald-600"
              : status === "PENDING"
                ? "bg-amber-500/10 text-amber-600"
                : "bg-blue-500/10 text-blue-600"
          }`}
        >
          <span className="w-1 h-1 rounded-full bg-current" />
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="whitespace-nowrap uppercase font-bold text-[10px] text-center">
        Actions
      </div>
    ),
    cell: ({ row }) => {
      const winner = row.original?.winner;
      const status = row.original?.drawStatus;
      const hasWinner = status === "COMPLETED" && winner?._id;

      return (
        <div className="text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-slate-100/50 rounded-full"
                disabled={!hasWinner}
              >
                <MoreHorizontal
                  className={cn(
                    "h-4 w-4",
                    hasWinner ? "text-slate-500" : "text-slate-400",
                  )}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 p-2 shadow-sm rounded-2xl border-slate-200"
            >
              <DropdownMenuLabel className="text-[10px] text-foreground/80 font-bold uppercase tracking-widest mb-1">
                Winner Actions
              </DropdownMenuLabel>

              <DropdownMenuItem
                disabled={!hasWinner}
                className="gap-2 cursor-pointer py-2 rounded-xl focus:bg-brand-aqua/10 focus:text-brand-aqua text-slate-500 font-semibold text-xs"
                onClick={() => {
                  if (winner?._id) {
                    navigate(
                      "/admin/management/giveaway/view-profile",
                      {
                        state: { 
                          userId: winner._id,
                          from: window.location.pathname,
                        },
                      },
                    );
                  }
                }}
              >
                <Eye className="w-4 h-4" />
                View Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
