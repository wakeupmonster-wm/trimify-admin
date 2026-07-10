import {
  MoreHorizontal,
  Eye,
  Edit,
  PlayCircle,
  PauseCircle,
  Trash2,
  ArrowUpDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator as Separator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { format } from "date-fns";

export const campaignColumns = (
  handleEdit,
  handleDelete,
  handleDisable,
  handleActivate,
  handleView,
  page = 1,
  limit = 10,
) => [
  {
    id: "serialNumber",
    header: "SR.No",
    cell: ({ row }) => {
      return (
        <span className="text-[11px] pl-2 font-semibold text-foreground/90">
          {(page - 1) * limit + row.index + 1}
        </span>
      );
    },
  },
  {
    accessorKey: "title",
    header: () => (
      <div className="whitespace-nowrap uppercase">Campaign Name</div>
    ),
    cell: ({ row }) => {
      const title = row.original?.title;
      return (
        <div className="flex items-center gap-2.5 group min-w-max">
          <span className="text-xs font-semibold text-slate-900 whitespace-nowrap">
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
        className="flex items-center uppercase hover:text-gray-900 transition-colors whitespace-nowrap"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="inline whitespace-nowrap">Campaign Date</span>
        <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />
      </button>
    ),
    cell: ({ row }) => {
      const dateValue = row.original?.date;

      if (!dateValue) {
        return <span className="text-sm text-slate-400 italic">—</span>;
      }

      // Robust date parsing for ISO or date-only strings
      const parsedDate = new Date(
        dateValue + (String(dateValue).includes("T") ? "" : "T12:00:00"),
      );
      return (
        <div className="flex flex-col whitespace-nowrap min-w-max">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-900">
              {format(new Date(parsedDate), "dd MMM, yyyy")}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 ml-0 font-medium">
            {format(new Date(parsedDate), "EEEE")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "prize.title",
    header: () => <div className="whitespace-nowrap uppercase">Prize</div>,
    cell: ({ row }) => {
      const prize = row.original.prize;
      return (
        <div className="flex items-center gap-2.5 min-w-max">
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-semibold text-slate-900 whitespace-nowrap">
              {prize?.title || "-"}
            </span>
            {prize?.spinWheelLabel && (
              <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                {prize.spinWheelLabel}
              </span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "drawStatus",
    header: () => <div className="whitespace-nowrap uppercase">Status</div>,
    cell: ({ row }) => {
      const { drawStatus, isActive } = row.original;

      const displayStatus =
        drawStatus === "COMPLETED"
          ? "COMPLETED"
          : isActive
            ? "ACTIVE"
            : "DISABLED";

      return (
        <Badge
          variant="outline"
          className={cn(
            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border-none shadow-none flex items-center gap-1.5 w-max whitespace-nowrap transition-colors",
            displayStatus === "COMPLETED"
              ? "bg-emerald-500/10 text-emerald-600"
              : displayStatus === "ACTIVE"
                ? "bg-brand-aqua/10 text-brand-aqua"
                : displayStatus === "DISABLED"
                  ? "bg-slate-500/10 text-slate-600"
                  : "bg-amber-500/10 text-amber-600",
          )}
        >
          <span className="w-1 h-1 rounded-full bg-current" />
          {displayStatus}
        </Badge>
      );
    },
  },
  {
    accessorKey: "winner",
    header: () => <div className="whitespace-nowrap uppercase">Winner</div>,
    cell: ({ row }) => {
      const winner = row.original.winner;
      const hasWinner = winner && (winner.email || winner.phone);

      if (!hasWinner) {
        return (
          <span className="text-[11px] text-slate-400 italic whitespace-nowrap">
            No winner yet
          </span>
        );
      }

      return (
        <div className="flex flex-col whitespace-nowrap min-w-max">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-900">
              {winner.email || winner.phone}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="w-max text-center mr-4 text-[10px] font-bold uppercase">
        Actions
      </div>
    ),
    cell: ({ row }) => {
      const campaign = row.original;
      const campaignId = campaign._id || campaign.id;
      const isCompleted = campaign.drawStatus === "COMPLETED";
      const hasWinner = Boolean(
        campaign.winner && (campaign.winner.email || campaign.winner.phone),
      );

      // Show Disable only for non-completed, active campaigns
      const canDisable = !isCompleted && campaign.isActive;
      // Show Activate only for non-completed, disabled campaigns
      const canActivate = !isCompleted && !campaign.isActive;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-slate-100/50 rounded-full"
            >
              <MoreHorizontal className="h-4 w-4 text-foreground/90" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44 p-2 shadow-sm rounded-2xl border-slate-200"
          >
            <DropdownMenuLabel className="text-[10px] text-foreground/80 font-bold uppercase tracking-widest mb-1">
              Campaign Actions
            </DropdownMenuLabel>

            {/* View Campaign */}
            <DropdownMenuItem
              className="gap-2 cursor-pointer py-2 rounded-xl focus:bg-brand-aqua/10 focus:text-brand-aqua text-slate-500 font-semibold text-xs"
              onClick={() => handleView(campaign)}
            >
              <Eye className="w-4 h-4 text-brand-aqua" />
              View Campaign
            </DropdownMenuItem>

            {/* Edit Campaign */}
            <DropdownMenuItem
              className={cn(
                "gap-2 cursor-pointer py-2 rounded-xl focus:bg-blue-500/10 focus:text-blue-600 text-slate-500 font-semibold text-xs",
                (isCompleted || hasWinner) && "opacity-50 cursor-not-allowed"
              )}
              onClick={(e) => {
                if (isCompleted || hasWinner) {
                  e.preventDefault();
                  return;
                }
                handleEdit(campaign);
              }}
              disabled={isCompleted || hasWinner}
            >
              <Edit className="w-4 h-4 text-blue-500" />
              Edit Campaign
            </DropdownMenuItem>

            <Separator className="my-1" />

            {/* Activate Campaign - shown when disabled */}
            {canActivate && (
              <DropdownMenuItem
                className="gap-2 cursor-pointer py-2 rounded-xl text-emerald-800 focus:bg-emerald-500/10 focus:text-emerald-600 font-semibold text-xs"
                onClick={() => handleActivate(campaignId, campaign?.title, campaign?.date)}
              >
                <PlayCircle className="w-4 h-4 text-emerald-600" />
                Activate Campaign
              </DropdownMenuItem>
            )}

            {/* Disable Campaign - shown when active */}
            {canDisable && (
              <DropdownMenuItem
                className="gap-2 cursor-pointer py-2 rounded-xl text-amber-800 focus:bg-amber-500/10 focus:text-amber-600 font-semibold text-xs"
                onClick={() => handleDisable(campaignId, campaign?.title, campaign?.date)}
              >
                <PauseCircle className="w-4 h-4 text-amber-600" />
                Disable Campaign
              </DropdownMenuItem>
            )}

            {/* Delete */}
            <DropdownMenuItem
              className={cn(
                "gap-2 cursor-pointer py-2 rounded-xl text-red-800 focus:bg-red-500/10 focus:text-red-600 font-semibold text-xs",
                hasWinner && "opacity-50 cursor-not-allowed",
              )}
              onClick={(e) => {
                if (hasWinner) {
                  e.preventDefault();
                  return;
                }
                handleDelete(campaignId, campaign?.title, campaign?.date);
              }}
              disabled={hasWinner}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              {hasWinner ? "Cannot Delete" : "Delete Campaign"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
