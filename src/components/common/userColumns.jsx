import {
  UserCheck,
  Unlock,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Ban,
  CirclePause,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { IconStarFilled } from "@tabler/icons-react";
import { useNavigate } from "react-router";
import dummyImg from "@/assets/web/dummyImg.webp";
import { toast } from "sonner";

// Helper for Completion Colors
const getCompletionColor = (val) => {
  if (val < 50) return "bg-slate-400/40";
  if (val <= 80) return "bg-slate-400/40";
  return "bg-slate-400/40";
};

export const userColumns = [
  // S/No Column
  {
    id: "sno",
    header: () => <div className="w-10 text-center">Sr.No.</div>,
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      const serialNumber = pageIndex * pageSize + row.index + 1;

      return (
        <div className="w-10 text-center font-bold text-[11px] text-foreground/90">
          {serialNumber}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  // USER Column
  {
    id: "user",
    accessorFn: (row) => row.profile?.nickname,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className={"text-[10px] pl-0.5 text-foreground/80 font-bold"}
      >
        USER
        <ArrowUpDown className="svg text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => {
      const user = row.original;
      const nickname = user.profile?.nickname || "unknown";
      // Added safety check for the photos array
      const avatar = user?.photos || dummyImg;

      return (
        <div className="flex items-center gap-3 w-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatar} alt={nickname} />
            <AvatarFallback>{nickname.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="capitalize font-bold text-foreground/80 text-[11px] 3xl:text-xs truncate max-w-[120px] block">
            {nickname}
          </span>
        </div>
      );
    },
  },
  // Phone Column
  {
    accessorKey: "account.phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.original.account?.phone;
      if (!phone)
        return <span className="text-slate-400 text-xs italic">-</span>;

      const copyToClipboard = () => {
        navigator.clipboard.writeText(phone);
        toast.success("Phone number copied!");
      };
      return (
        <div
          // onClick={copyToClipboard}
          className="flex items-center cursor-pointer gap-2 w-full text-[11px] 3xl:text-xs font-medium text-muted-foreground"
        >
          {/* <Phone className="w-3 h-3 text-muted-foreground shrink-0" /> */}
          {phone}
        </div>
      );
    },
  },
  // Email Columnn
  {
    accessorKey: "account.email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.original.account?.email;
      if (!email)
        return <span className="text-slate-400 text-xs italic">-</span>;
      const copyToClipboard = () => {
        navigator.clipboard.writeText(email);
        toast.success("Email copied!");
      };
      return (
        <div
          // onClick={copyToClipboard}
          className="flex items-center cursor-pointer gap-2 w-full text-[11px] 3xl:text-xs font-medium"
          title={email}
        >
          <Mail className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-[11px] 3xl:text-xs lowercase text-muted-foreground max-w-[90px] truncate block">
            {email}
          </span>
        </div>
      );
    },
  },
  // Age Column
  {
    id: "age",
    header: "Age",
    cell: ({ row }) => {
      const profile = row.original.profile;
      const dob = profile?.dob;

      // 1. Agar age field pehle se hai
      if (profile?.age)
        return (
          <span className="text-[11px] 3xl:text-xs font-medium text-foreground/80">
            {profile.age}
          </span>
        );

      // 2. Agar DOB hai toh calculate karein
      // if (dob) {
      //   const birthYear = new Date(dob).getFullYear();
      //   const currentYear = new Date().getFullYear();
      //   const calculatedAge = currentYear - birthYear;

      //   // Check if result is a valid number
      //   if (!isNaN(calculatedAge)) {
      //     return <span className="text-xs">{calculatedAge}</span>;
      //   }
      // }

      // 3. Kuch bhi nahi toh default dash
      return <span className="text-xs">-</span>;
    },
  },
  // Gender Column
  {
    id: "gender",
    header: "Gender",
    cell: ({ row }) => (
      <div className="w-max text-xs">{row.original.profile.gender || "-"}</div>
    ),
  },
  // Completion Column
  {
    id: "completion",
    header: "Completion",
    cell: ({ row }) => (
      <div className="w-[90px] flex flex-col gap-1">
        <span className="text-[11px] font-base">
          {row.original.profile.totalCompletion}%
        </span>
        <Progress
          value={row.original.profile.totalCompletion}
          className={`h-1.5 bg-slate-300 shadow-inner border border-gray-200`}
        />
      </div>
    ),
  },
  // Status Column
  {
    id: "status",
    accessorKey: "account.status",
    header: "Status",
    // Custom filter function to make sure it catches the exact text
    filterFn: "includesString",
    cell: ({ row }) => {
      const status = row.original.account?.status;
      return (
        <div className="flex gap-1">
          <Badge
            variant="outline"
            className={`uppercase px-2.5 py-0.5 3xl:px-3 3xl:py-1 flex items-center gap-1.5 w-max font-bold text-[10px] 3xl:text-xs rounded-full border-none shadow-none cursor-pointer hover:opacity-80 transition-opacity ${status === "active"
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-100/50"
              : status === "banned"
                ? "bg-red-500/10 text-red-600 border-red-100/50"
                : status === "suspended"
                  ? "bg-amber-500/10 text-amber-600 border-amber-100/50"
                  : "bg-slate-500/10 text-slate-600 border-slate-100/50"
              }`}
          >
            <span className="w-1 h-1 rounded-full bg-current" />
            {status}
          </Badge>
        </div>
      );
    },
  },
  // Plan Column
  {
    id: "premium",
    accessorKey: "account.isPremium",
    header: "Plan",
    cell: ({ row }) => {
      const isPremium = row.original.account?.isPremium;

      return isPremium ? (
        <Badge
          variant="premium"
          className="flex w-max items-center gap-1 px-2.5 py-0.5 text-[10px] 3xl:text-xs font-extrabold rounded-md shadow-none border-none uppercase"
        >
          <IconStarFilled size={10} /> PRO
        </Badge>
      ) : (
        <span className="text-foreground/60 font-bold text-[10px] 3xl:text-xs pl-1 uppercase">
          Free
        </span>
      );
    },
  },
  // Location Column
  {
    id: "city", // Manually set ID
    accessorKey: "location.city",
    header: "Location",
    cell: ({ row }) => {
      const city = row.original.location?.city;
      const country = row.original.location?.country;
      if (!city && !country)
        return (
          <span className="text-muted-foreground italic px-1.5 text-[11px]">
            Not set
          </span>
        );
      return (
        <span
          title={`${city || ""}${city && country ? ", " : ""}${country || ""}`}
          className="w-max capitalize text-[11px] 3xl:text-xs max-w-[90px] truncate block"
        >{`${city || ""}${city && country ? ", " : ""}${country || ""}`}</span>
      );
    },
  },
  // Joined Column
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-4 text-foreground/80 px-3 uppercase font-bold text-[10px]"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Joined At
        <ArrowUpDown className="svg text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-[10px]">
          {date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  // Actions Column
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const user = row.original;
      const userId = user._id;
      const navigate = useNavigate();
      const onBan = table.options.meta?.onBan;
      const onSuspend = table.options.meta?.onSuspend;
      const onUnban = table.options.meta?.onUnban;
      const onUnsuspend = table.options.meta?.onUnsuspend;
      const onNotify = table.options.meta?.onNotify;

      return (
        <div className="text-center">
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
              className="w-44 p-2 shadow-sm rounded-2xl border-slate-200"
            >
              <DropdownMenuLabel className="text-[10px] text-foreground/80 font-bold uppercase tracking-widest mb-1">
                User Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="gap-2 cursor-pointer py-2 rounded-xl focus:bg-brand-aqua/10 focus:text-brand-aqua text-slate-500 font-semibold text-xs"
                onClick={() =>
                  navigate(`/admin/management/users-management/view-profile`, {
                    state: { userId },
                  })
                }
              >
                <Eye className="w-4 h-4" />
                View Profile
              </DropdownMenuItem>
              {/* <DropdownMenuItem
                className="gap-2 cursor-pointer py-2 rounded-xl focus:bg-brand-aqua/10 focus:text-brand-aqua text-slate-500 font-semibold text-xs"
                onClick={() => {
                  if (onNotify) onNotify(user);
                }}
              >
                <Mail className="w-4 h-4" />
                Send Notification
              </DropdownMenuItem> */}

              {/* CONDITIONAL ACTIONS */}
              {user?.account?.status === "banned" ? (
                <DropdownMenuItem
                  className="gap-2 cursor-pointer py-2 rounded-xl font-semibold text-xs text-emerald-800 focus:bg-emerald-500/10 focus:text-emerald-500"
                  onClick={() => {
                    onUnban(user);
                  }}
                >
                  <UserCheck className="w-4 h-4" />
                  Unban User
                </DropdownMenuItem>
              ) : user?.account?.status === "suspended" ? (
                <DropdownMenuItem
                  className="gap-2 cursor-pointer py-2 rounded-xl font-semibold text-xs text-emerald-800 focus:bg-emerald-500/10 focus:text-emerald-500"
                  onClick={() => {
                    onUnsuspend(user);
                  }}
                >
                  <Unlock className="w-4 h-4" />
                  Unsuspend User
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer py-2 rounded-xl font-semibold text-xs text-red-800 focus:bg-red-500/10 focus:text-red-500"
                    onClick={() => {
                      onBan(user);
                    }}
                  >
                    <Ban className="w-4 h-4" />
                    Ban Account
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer py-2 rounded-xl font-semibold text-xs text-amber-800 focus:bg-amber-500/10 focus:text-amber-500"
                    onClick={() => {
                      onSuspend(user);
                    }}
                  >
                    <CirclePause className="w-4 h-4" />
                    Suspend Account
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
