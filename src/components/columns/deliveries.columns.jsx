import {
  CheckCircle,
  Loader2,
  MoreHorizontal,
  Eye,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const getDeliveryColumns = (onMarkDelivered, deliveryLoading) => [
  {
    id: "serialNumber",
    header: () => <div className="text-center">SR.No</div>,
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      return (
        <div className="text-center font-semibold text-[11px] text-foreground/90">
          {pageIndex * pageSize + row.index + 1}
        </div>
      );
    },
  },
  {
    accessorKey: "profile",
    header: () => (
      <div className="whitespace-nowrap uppercase font-bold text-[10px]">
        Winner
      </div>
    ),
    cell: ({ row }) => {
      const profile = row.original.profile;
      return (
        <div className="flex items-center gap-2 group min-w-max">
          <span className="font-semibold text-foreground/90 text-xs whitespace-nowrap">
            {profile?.nickname || "-"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "user",
    header: () => (
      <div className="whitespace-nowrap uppercase font-bold text-[10px]">
        Email
      </div>
    ),
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex items-center gap-2 group min-w-max">
          <span className="font-semibold text-foreground/90 text-xs whitespace-nowrap">
            {user?.email || user?.phone || "-"}
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
        <div className="flex items-center gap-2 group min-w-max">
          <span className="font-semibold text-foreground/90 text-xs whitespace-nowrap">
            {prize?.title || "-"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "campaign.date",
    header: ({ column }) => (
      <button
        className="flex items-center uppercase hover:text-gray-900 font-bold transition-colors whitespace-nowrap"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="hidden sm:inline">Campaign Date</span>
        <span className="sm:hidden">Date</span>
        <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />
      </button>
    ),
    cell: ({ row }) => {
      const dateValue = row.original.campaign?.date;

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
  // {
  //   accessorKey: "giftCardExpiryDate",
  //   header: "Expiry",
  //   cell: ({ row }) => {
  //     const { deliveryStatus, giftCardExpiryDate: expiry } = row.original;

  //     if (deliveryStatus === "PENDING" || !expiry) {
  //       return (
  //         <span className="text-sm font-medium text-slate-400 italic">—</span>
  //       );
  //     }
  //     const expiryDate = new Date(expiry);
  //     const expired = isPast(expiryDate);
  //     return expired ? (
  //       <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-[10px] font-bold gap-1 whitespace-nowrap">
  //         <AlertTriangle className="h-3 w-3 shrink-0" />
  //         <span className="hidden sm:inline">Expired</span>
  //         <span className="sm:hidden">Exp</span>
  //       </Badge>
  //     ) : (
  //       <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold gap-1 whitespace-nowrap">
  //         <ShieldCheck className="h-3 w-3 shrink-0" />
  //         <span>{format(expiryDate, "dd MMM yyyy")}</span>
  //       </Badge>
  //     );
  //   },
  // },
  {
    accessorKey: "deliveryStatus",
    header: () => (
      <div className="whitespace-nowrap uppercase font-bold text-[10px]">
        Status
      </div>
    ),
    cell: ({ row }) => {
      const { deliveryStatus, claimedAt } = row.original;

      if (deliveryStatus === "DELIVERED") {
        return (
          <Badge
            variant="outline"
            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border-none shadow-none flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 w-fit"
          >
            <span className="w-1 h-1 rounded-full bg-current" />
            <span className="hidden sm:inline">Delivered</span>
            <span className="sm:hidden">Done</span>
          </Badge>
        );
      }
      if (!claimedAt) {
        return (
          <Badge
            variant="outline"
            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border-none shadow-none flex items-center gap-1.5 bg-slate-500/10 text-slate-600 w-fit"
          >
            <span className="w-1 h-1 rounded-full bg-current" />
            <span className="hidden sm:inline">Not Claimed</span>
            <span className="sm:hidden">Pending</span>
          </Badge>
        );
      }

      if (deliveryStatus === "REVEALED") {
        return (
          <Badge
            variant="outline"
            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border-none shadow-none flex items-center gap-1.5 bg-amber-500/10 text-amber-600 w-fit"
          >
            <span className="w-1 h-1 rounded-full bg-current" />
            <span>REVEALED</span>
          </Badge>
        );
      }

      if (deliveryStatus === "PENDING") {
        return (
          <Badge
            variant="outline"
            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border-none shadow-none flex items-center gap-1.5 bg-blue-500/10 text-blue-600 w-fit"
          >
            <span className="w-1 h-1 rounded-full bg-current" />
            <span>Processing</span>
          </Badge>
        );
      }

      return null;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-left">Action</div>,
    cell: ({ row }) => {
      const d = row?.original;
      const isLoading = deliveryLoading[d._id];
      const navigate = useNavigate();

      const canDeliver = ["REVEALED", "PENDING"].includes(d.deliveryStatus);

      return (
        <div className="text-left">
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
                Delivery Actions
              </DropdownMenuLabel>

              {/* Mark Delivered Action */}
              <DropdownMenuItem
                disabled={!canDeliver || isLoading}
                className={cn(
                  "gap-2 cursor-pointer py-2 rounded-xl focus:bg-emerald-500/10 focus:text-emerald-600 text-slate-500 font-semibold text-xs",
                  canDeliver && "text-emerald-700",
                  (!canDeliver || isLoading) && "opacity-50 cursor-not-allowed"
                )}
                onClick={(e) => {
                  if (!canDeliver || isLoading) {
                    e.preventDefault();
                    return;
                  }
                  onMarkDelivered(d._id);
                }}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                Mark Delivered
              </DropdownMenuItem>

              <DropdownMenuItem
                className="gap-2 cursor-pointer py-2 rounded-xl focus:bg-brand-aqua/10 focus:text-brand-aqua text-slate-500 font-semibold text-xs"
                onClick={() =>
                  navigate("/admin/management/giveaway/view-profile", {
                    state: { userId: d?.user?._id, from: window.location.pathname },
                  })
                }
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
