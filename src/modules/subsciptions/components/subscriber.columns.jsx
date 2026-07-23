import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import { getProductDisplayName } from "@/utils/productDisplay";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Copy,
  XCircle,
  RefreshCcw,
} from "lucide-react";
import { AiFillAndroid, AiFillApple } from "react-icons/ai";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dummyImg from "@/assets/web/dummyImg.webp";
import { cn } from "@/lib/utils";
import { LiaUserTieSolid } from "react-icons/lia";
import { PiDevicesDuotone } from "react-icons/pi";
import { FaUserTie } from "react-icons/fa6";

export const getSubscriberColumns = (navigate) => [
  {
    id: "sno",
    size: 100,
    header: () => (
      <div className="text-center px-4 text-[10px] font-bold uppercase">
        Sr.No
      </div>
    ),
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return (
        <div className="text-center font-bold text-[11px] text-foreground/80">
          {pageIndex * pageSize + row.index + 1}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "user.nickname",
    size: 200,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="justify-start text-[10px] font-bold uppercase px-2"
      >
        Subscriber
        <ArrowUpDown className="svg text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => {
      const data = row.original;
      const user = data?.user || data?.userId || data?.userInfo || data;

      const avatar =
        user?.photo && user.photo !== "null"
          ? user.photo
          : user?.avatar?.url || user?.avatar || dummyImg;

      const name =
        user?.nickname ||
        user?.fullName ||
        user?.name ||
        user?.email ||
        user?.phone ||
        "Unknown User";

      const subLabel = user?.email || user?.phone || "No contact";

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border border-slate-100 shadow-sm rounded-full">
            <AvatarImage src={avatar} className="object-cover" />
            <AvatarFallback className="bg-app-primary2 text-app-primary2 text-[10px] font-black">
              {String(name).charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-bold text-foreground/90 truncate tracking-tight capitalize">
              {name}
            </span>
            <span className="text-[10px] font-medium text-foreground/70 truncate tracking-tight">
              {subLabel}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "planType",
    size: 100,
    header: () => (
      <div className="text-left pl-1 text-[10px] font-bold uppercase">Plan</div>
    ),
    cell: ({ row }) => {
      const plan = row.original?.planType;
      return (
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] font-bold px-2.5 py-0.5 rounded-full border-none shadow-none uppercase",
            plan?.includes("MONTH") || plan?.includes("MONTHLY")
              ? "bg-blue-500/10 text-blue-600"
              : plan?.includes("YEAR") || plan?.includes("YEARLY")
                ? "bg-purple-500/10 text-purple-600"
                : "bg-amber-500/10 text-amber-600",
          )}
        >
          {plan ? getProductDisplayName(plan) : "—"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "platform",
    size: 100,
    header: "Platform",
    cell: ({ row }) => {
      const platform = row.original?.platform?.toLowerCase();
      let icon = <PiDevicesDuotone className="size-3.5" />;
      let style = "text-slate-600 border-slate-300/60 bg-slate-50";

      if (platform === "ios") {
        icon = <AiFillApple className="size-3.5" />;
        style = "text-slate-900 border-slate-300/60 bg-slate-100";
      } else if (platform === "android") {
        icon = <AiFillAndroid className="size-3.5" />;
        style = "text-emerald-600 border-emerald-100 bg-emerald-50";
      } else if (platform === "admin_granted" || platform === "admin") {
        icon = <FaUserTie className="size-3.5" />;
        style = "text-app-primary2 border-app-primary2 bg-app-primary2";
      }

      return (
        <div className="ml-2">
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] font-black rounded-lg px-1.5 py-3 h-6 gap-1 shadow-none border",
              style,
            )}
          >
            {icon}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    size: 80,
    header: "Status",
    cell: ({ row }) => {
      const status = row.original?.status;
      const isExpired = row.original?.isExpired;

      let style = "bg-slate-500/10 text-slate-400";
      let label = status;

      if (status === "ACTIVE" && !isExpired) {
        style = "bg-emerald-500/10 text-emerald-600";
      } else if (isExpired) {
        style = "bg-rose-500/10 text-rose-600";
        label = "EXPIRED";
      } else if (status === "REVOKED") {
        style = "bg-rose-500/10 text-rose-600";
      }

      return (
        <div className="flex justify-start">
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] font-bold px-2.5 py-0.5 rounded-full border-none shadow-none uppercase flex items-center gap-1.5",
              style,
            )}
          >
            <span className="w-1 h-1 rounded-full bg-current" />
            {label}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "startedAt",
    size: 140,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="justify-start text-[10px] font-bold uppercase p-0"
      >
        Started
        <ArrowUpDown className="svg text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.original?.startedAt;
      const isValidDate = (d) => d instanceof Date && !isNaN(d.getTime());
      const parsedDate = date ? new Date(date) : null;
      const isValid = parsedDate && isValidDate(parsedDate);

      return (
        <div className="flex flex-col -gap-1.5 min-w-24">
          <span className="text-[11px] font-medium text-foreground/90">
            {isValid ? format(parsedDate, "dd MMM, yyyy") : "-"}
          </span>
          <span className="text-[10px] font-medium text-foreground/70">
            {isValid
              ? formatDistanceToNow(parsedDate, { addSuffix: true })
              : "-"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "expiresAt",
    size: 140,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="justify-start text-[10px] font-bold uppercase p-0"
      >
        Expires
        <ArrowUpDown className="svg text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.original?.expiresAt;
      const isExpired = row.original?.isExpired;
      const isValidDate = (d) => d instanceof Date && !isNaN(d.getTime());
      const parsedDate = date ? new Date(date) : null;
      const isValid = parsedDate && isValidDate(parsedDate);

      return (
        <div className="flex flex-col -gap-1.5 min-w-24">
          <span
            className={cn(
              "text-[11px] font-medium",
              isExpired ? "text-rose-600" : "text-foreground/90",
            )}
          >
            {isValid ? format(parsedDate, "dd MMM, yyyy") : "-"}
          </span>
          <span className="text-[10px] font-medium text-foreground/70">
            {isValid
              ? formatDistanceToNow(parsedDate, { addSuffix: true })
              : "-"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "autoRenew",
    size: 110,
    header: () => (
      <div className="text-[10px] font-bold uppercase text-center">
        Auto-Renew
      </div>
    ),
    cell: ({ row }) => {
      const autoRenew = row.original?.autoRenew;
      return (
        <div className="flex justify-center">
          {autoRenew ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold shadow-none uppercase">
              <RefreshCcw className="size-3" /> YES
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-400 text-[10px] font-bold uppercase">
              <XCircle className="size-3" /> NO
            </div>
          )}
        </div>
      );
    },
  },
  // {
  //   accessorKey: "source",
  //   size: 110,
  //   header: "Source",
  //   cell: ({ row }) => {
  //     const source = row.original?.source;
  //     const platform = row.original?.platform?.toLowerCase();

  //     let label = source || "STORE";
  //     let style = "bg-blue-500/10 text-blue-600";
  //     let icon = <LuStore className="size-3" />;

  //     if (!source) {
  //       if (platform === "admin_granted" || platform === "admin") {
  //         label = "ADMIN";
  //       } else {
  //         label = "STORE";
  //       }
  //     }

  //     if (label === "ADMIN") {
  //       style = "bg-app-primary2 text-app-primary2";
  //       icon = <LiaUserTieSolid className="size-4" />;
  //     } else if (label === "GIVEAWAY") {
  //       style = "bg-amber-500/10 text-amber-600";
  //       icon = <Gift className="size-3" />;
  //     }

  //     return (
  //       <Badge
  //         variant="outline"
  //         className={cn(
  //           "text-[10px] font-bold px-2.5 py-0.5 h-6 gap-1.5 shadow-none border-none rounded-full uppercase",
  //           style,
  //         )}
  //       >
  //         <span className="w-1 h-1 rounded-full bg-current" />
  //         {label}
  //       </Badge>
  //     );
  //   },
  // },
  {
    id: "actions",
    size: 80,
    header: () => (
      <div className="text-right pr-4 text-[10px] font-bold uppercase">
        Actions
      </div>
    ),
    cell: ({ row }) => {
      const sub = row.original;
      return (
        <div className="text-right pr-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-slate-100/50 rounded-full"
              >
                <MoreHorizontal className="h-4 w-4 text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 p-2 shadow-sm rounded-2xl border-slate-300/60"
            >
              <DropdownMenuLabel className="text-[10px] text-foreground/80 font-bold uppercase tracking-widest mb-1">
                Subscription Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="gap-2 cursor-pointer py-2 rounded-xl focus:bg-app-primary2 focus:text-app-primary2 text-slate-500 font-semibold text-xs"
                onClick={() => {
                  const targetId =
                    sub.user?._id || sub.userId?._id || sub.userId;
                  if (targetId)
                    navigate(
                      `/admin/management/subscription-management/view-subscription/${targetId}`,
                    );
                  else toast.error("User ID not found");
                }}
              >
                <Eye className="w-4 h-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 cursor-pointer py-2 rounded-xl focus:bg-app-primary2 focus:text-app-primary2 text-slate-500 font-semibold text-xs"
                onClick={() => {
                  navigator.clipboard.writeText(sub._id);
                  toast.success("Subscription ID copied");
                }}
              >
                <Copy className="w-4 h-4" />
                Copy Sub ID
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
