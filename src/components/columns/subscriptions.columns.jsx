import { Badge } from "@/components/ui/badge"; // Assuming you use shadcn or similar
import { format, formatDistanceToNow } from "date-fns";
import { getProductDisplayName } from "@/utils/productDisplay";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  ArrowUpDown,
  Calendar,
  Monitor,
  MoreHorizontal,
  RefreshCcw,
  Smartphone,
  RefreshCwOff,
  Eye,
  Copy,
  MessagesSquare,
  Mail,
  Phone,
  Layers,
  Star,
} from "lucide-react";
import { IoLogoApple } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import dummyImg from "@/assets/web/dummyImg.webp";
import { GrAndroid } from "react-icons/gr";
import { AiFillAndroid } from "react-icons/ai";

export const subscriptionColumns = [
  {
    id: "sno",
    header: () => (
      <div className="w-12 min-w-[48px] text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
        Sr.No.
      </div>
    ),
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      const serialNumber = pageIndex * pageSize + row.index + 1;

      return <div className="w-10 text-center font-bold text-[11px] text-foreground/90">{serialNumber}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "user",
    accessorFn: (row) => row.user,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="min-w-[150px] justify-start px-0 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-transparent"
      >
        User
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const user = row.original?.user;
      // console.log("user: ", user);
      const nickname = user?.nickname || "unknown";
      const avatar = user?.avatar?.url || dummyImg;

      return (
        <div className="flex items-center gap-3 w-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatar} alt={nickname} />
            <AvatarFallback>
              {nickname.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="capitalize font-bold text-foreground/90 text-[11px] truncate">
            {nickname}
          </span>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "userId.email",
  //   header: "Subscriber",
  //   cell: ({ row }) => {
  //     const email = row.original?.user?.email || "-";
  //     const phone = row.original?.user?.phone || "-";

  //     const copyToClipboard = (text, type) => {
  //       navigator.clipboard.writeText(text);
  //       toast.success(`${type} copied!`, {
  //         style: { fontSize: "12px", padding: "8px" },
  //       });
  //     };

  //     return (
  //       <div className="flex flex-col gap-1 w-max">
  //         {/* Email Row */}
  //         <div className="flex items-center group">
  //           <Mail className="w-3.5 h-3.5 mr-2 text-slate-400" />
  //           <span className="font-semibold text-slate-700 truncate max-w-[180px]">
  //             {email}
  //           </span>
  //           <button
  //             onClick={() => copyToClipboard(email, "Email")}
  //             className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-brand-aqua"
  //           >
  //             <Copy className="w-3 h-3" />
  //           </button>
  //         </div>

  //         {/* Phone Row */}
  //         <div className="flex items-center text-[11px] text-slate-500">
  //           <Phone className="w-3 h-3 mr-2" />
  //           <span>{phone}</span>
  //         </div>
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "userId.email",
    header: () => (
      <div className="min-w-[200px] text-[10px] font-black uppercase tracking-widest text-slate-500">
        Email Address
      </div>
    ),
    cell: ({ row }) => {
      const email = row.original?.user?.email || "-";

      const copyEmail = () => {
        navigator.clipboard.writeText(email);
        toast.success("Email copied", { id: "email-copy" });
      };

      return (
        <div className="flex items-center group gap-2 w-max text-[11px]">
          <Mail className="w-3 h-3 text-foreground/90 shrink-0" />
          <span className="flex items-center gap-2 font-medium text-foreground/90 truncate">
            {email}
            <Copy
              // onClick={copyEmail}
              title="Copy Email"
              className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-foreground/50 hover:text-brand-aqua"
            />
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "userId.phone",
    header: () => (
      <div className="min-w-[150px] text-[10px] font-black uppercase tracking-widest text-slate-500">
        Phone Number
      </div>
    ),
    cell: ({ row }) => {
      const phone = row.original?.user?.phone || "-";

      const copyPhone = () => {
        navigator.clipboard.writeText(phone);
        toast.success("Phone copied", { id: "phone-copy" });
      };

      return (
        <div className="flex items-center group gap-2 w-max text-[11px]">
          <Phone className="w-3 h-3 text-foreground/90 shrink-0" />
          <span className="flex items-center gap-2 font-medium text-foreground/90 truncate">
            {phone}
            <Copy
              // onClick={copyPhone}
              title="Copy Phone"
              className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-foreground/50 hover:text-brand-aqua"
            />
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "planType",
    header: () => (
      <div className="min-w-[140px] text-[10px] font-black uppercase tracking-widest text-slate-500">
        Subscription Plan
      </div>
    ),
    cell: ({ row }) => {
      const plan = row.getValue("planType")?.toLowerCase();

      // Define styles and icons based on the plan duration
      const planConfig = {
        monthly: {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Calendar className="w-3 h-3" />,
          label: "Monthly",
        },
        yearly: {
          color: "bg-purple-50 text-purple-700 border-purple-200",
          icon: <Star className="w-3 h-3" />,
          label: "Yearly",
        },
        lifetime: {
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Layers className="w-3 h-3" />,
          label: "Lifetime",
        },
      };

      const variants = {
        monthly: "bg-blue-500/10 text-blue-600",
        yearly: "bg-purple-500/10 text-purple-600",
        lifetime: "bg-amber-500/10 text-amber-600",
      };

      return (
        <Badge
          variant="outline"
          className={cn(
            "flex items-center w-fit gap-1.5 px-2.5 py-0.5 rounded-full border-none shadow-none text-[10px] font-bold uppercase",
            variants[plan] || "bg-slate-500/10 text-slate-600",
          )}
        >
          <span className="w-1 h-1 rounded-full bg-current" />
          {planConfig[plan]?.label || (plan ? getProductDisplayName(plan) : "—")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="min-w-[100px] text-[10px] font-black uppercase tracking-widest text-slate-500">
        Status
      </div>
    ),
    cell: ({ row }) => {
      const rawStatus = row.getValue("status") || "";
      const status = rawStatus.toUpperCase(); // Normalization

      return (
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "uppercase flex items-center gap-1.5 w-max font-bold text-[10px] rounded-full border-none shadow-none cursor-pointer transition-opacity px-2.5 py-0.5",
              status === "ACTIVE"
                ? "bg-emerald-500/10 text-emerald-600"
                : status === "EXPIRED"
                  ? "bg-red-500/10 text-red-600"
                  : "bg-slate-500/10 text-slate-600",
            )}
          >
            <span className="w-1 h-1 rounded-full bg-current" />
            {status}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "platform",
    header: () => (
      <div className="min-w-[100px] text-[10px] font-black uppercase tracking-widest text-slate-500">
        Platform
      </div>
    ),
    cell: ({ row }) => {
      const platform = row.getValue("platform")?.toLowerCase();

      // Map icons to platforms
      const iconMap = {
        ios: <IoLogoApple className="w-3.5 h-3.5 mb-0.5" />,
        android: (
          <AiFillAndroid className="w-3.5 h-3.5 mb-0.5 text-green-600" />
        ),
        web: <Monitor className="w-3.5 h-3.5 mb-0.5" />,
      };

      const platformStyles = {
        ios: "bg-zinc-100 text-zinc-900 border-zinc-200",
        android: "bg-green-50 text-green-700 border-green-100",
        web: "bg-blue-50 text-blue-700 border-blue-100",
      };

      return (
        <div className="flex items-center">
          <span
            className={`
            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-bold tracking-tight uppercase
            ${platformStyles[platform] || "bg-slate-50 text-slate-600"}
          `}
          >
            {iconMap[platform] || <Smartphone className="w-3.5 h-3.5" />}
            {platform}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <button
        className="flex items-center min-w-[130px] hover:text-gray-900 transition-colors text-[10px] font-black uppercase tracking-widest text-slate-500"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Buy At
        <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />
      </button>
    ),
    cell: ({ row }) => {
      const dateValue = row.original?.createdAt;

      if (!dateValue) {
        return <span className="text-sm text-slate-400 italic">-</span>;
      }

      const date = new Date(dateValue);

      return (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-slate-900">
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <Calendar className="h-2.5 w-2.5 opacity-70" />
            <span>{format(date, "MMM dd, yyyy p")}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "expiresAt",
    header: ({ column }) => (
      <button
        className="flex items-center min-w-[130px] hover:text-gray-900 transition-colors text-[10px] font-black uppercase tracking-widest text-slate-500"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Expiry Date
        <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />
      </button>
    ),
    cell: ({ row }) => {
      const dateValue = row.original?.expiresAt;

      if (!dateValue) {
        return <span className="text-sm text-slate-400 italic">-</span>;
      }

      const date = new Date(dateValue);

      return (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-slate-900">
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <Calendar className="h-2.5 w-2.5 opacity-70" />
            <span>{format(date, "MMM dd, yyyy p")}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "autoRenew",
    header: () => (
      <div className="min-w-[100px] text-[10px] font-black uppercase tracking-widest text-slate-500">
        Auto-Renew
      </div>
    ),
    cell: ({ row }) => {
      const isAutoRenew = !!row.getValue("autoRenew");

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex justify-start items-center">
                <span
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-bold border transition-all ${
                    isAutoRenew
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : "bg-slate-50 text-slate-500 border-slate-200"
                  }`}
                >
                  {isAutoRenew ? (
                    <RefreshCcw className="w-3 h-3 animate-spin-slow" />
                  ) : (
                    <RefreshCwOff className="w-3 h-3" />
                  )}
                  {isAutoRenew ? "ENABLED" : "DISABLED"}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {isAutoRenew
                  ? "Subscription will renew automatically"
                  : "Manual renewal required"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  // Actions Column
  {
    id: "actions",
    header: () => (
      <div className="w-[80px] text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
        Actions
      </div>
    ),
    cell: ({ row }) => {
      const subscription = row.original;
      const navigate = useNavigate();

      const handleCopyId = (id) => {
        navigator.clipboard.writeText(id);
        toast.success("ID copied to clipboard", {
          icon: <MessagesSquare className="h-4 w-4 font-bold text-slate-600" />,
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
        });
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 text-slate-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44 p-2 shadow-sm rounded-2xl border-slate-200"
          >
            <DropdownMenuLabel className="text-[10px] text-foreground/80 font-bold uppercase tracking-widest mb-1">
              Subscription Options
            </DropdownMenuLabel>

            <DropdownMenuItem
              className="gap-2 cursor-pointer py-2 rounded-xl focus:bg-brand-aqua/10 focus:text-brand-aqua text-slate-500 font-semibold text-xs"
              onClick={() =>
                navigate(`/admin/management/subscription-management/view-subscription/${subscription?.user?.userId}`, {
                  state: { subscriptionData: subscription },
                })
              }
            >
              <Eye className="h-4 w-4" />
              <span>View Details</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="gap-2 cursor-pointer py-2 rounded-xl focus:bg-brand-aqua/10 focus:text-brand-aqua text-slate-500 font-semibold text-xs"
              onClick={() => handleCopyId(subscription._id)}
            >
              <Copy className="h-4 w-4" />
              <span>Copy Sub ID</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
