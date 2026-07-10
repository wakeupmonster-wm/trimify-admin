import {
  MoreHorizontal,
  ArrowUpDown,
  Eye,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router";
import dummyImg from "@/assets/web/dummyImg.webp";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { IconStarFilled } from "@tabler/icons-react";

export const fakeProfileColumns = (handleToggleStatus, handleDelete) => [
  // Sr.No.
  {
    id: "sno",
    header: () => (
      <div className="w-20 text-center text-[10px] font-bold uppercase tracking-wider">
        SR.NO
      </div>
    ),
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      const serialNumber = pageIndex * pageSize + row.index + 1;
      return (
        <div className="w-20 text-center font-bold text-[11px] text-foreground/90">
          {serialNumber}
        </div>
      );
    },
    size: 80,
    minSize: 60,
    maxSize: 60,
    enableSorting: false,
  },
  // User (Avatar + Nickname)
  {
    id: "user",
    accessorFn: (row) => row.user?.profile?.nickname,
    size: 120,
    minSize: 180,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 text-[10px] font-bold uppercase tracking-wider hover:bg-transparent p-0"
      >
        User
        <ArrowUpDown className="svg text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => {
      const profile = row.original.user?.profile;
      const photos = row.original.user?.photos;
      const nickname = profile?.nickname || "Unknown";
      const avatar = photos?.[0]?.url || dummyImg;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border-2 border-white shadow-sm shrink-0">
            <AvatarImage src={avatar} alt={nickname} />
            <AvatarFallback className="bg-brand-aqua/10 text-brand-aqua text-[10px] font-bold">
              {nickname.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="capitalize font-bold text-slate-700 text-[11px] tracking-tight truncate max-w-[120px]">
            {nickname}
          </span>
        </div>
      );
    },
  },
  {
    id: "phone",
    accessorKey: "user.account.phone",
    size: 150,
    minSize: 120,
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider">
        Phone
      </div>
    ),
    cell: ({ row }) => {
      const phone = row.original.user?.account?.phone || "-";
      const copyToClipboard = () => {
        navigator.clipboard.writeText(phone);
        toast.success("Phone number copied!");
      };
      return (
        <div
          className="text-[11px] font-medium text-slate-600 tracking-tight"
          title={phone}
        >
          {phone}
        </div>
      );
    },
  },
  {
    id: "email",
    accessorKey: "user.account.email",
    size: 200,
    minSize: 180,
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider">
        Email
      </div>
    ),
    cell: ({ row }) => {
      const email = row.original.user?.account?.email || "-";
      const copyToClipboard = () => {
        navigator.clipboard.writeText(email);
        toast.success("Email copied!");
      };
      return (
        <div
          className="text-[11px] font-medium text-slate-600 lowercase tracking-tight max-w-[140px] truncate"
          title={email}
        >
          {email}
        </div>
      );
    },
  },
  {
    // Gender
    id: "gender",
    accessorKey: "user.profile.gender",
    size: 120,
    minSize: 90,
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider">
        Gender
      </div>
    ),
    cell: ({ row }) => {
      const gender = row.original.user?.profile?.gender || "-";
      return (
        <span className="text-[11px] font-bold text-slate-700 capitalize tracking-tight">
          {gender}
        </span>
      );
    },
  },
  {
    // Age
    id: "age",
    accessorKey: "user.profile.age",
    size: 100,
    minSize: 70,
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider">Age</div>
    ),
    cell: ({ row }) => {
      const age = row.original.user?.profile?.age || "-";
      return (
        <span className="text-[11px] font-bold text-slate-700">{age}</span>
      );
    },
  },
  {
    // City
    id: "city",
    size: 120,
    minSize: 100,
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider">City</div>
    ),
    cell: ({ row }) => {
      const city = row.original.user?.location?.city || "-";
      return (
        <span className="text-[11px] font-bold text-slate-700 capitalize tracking-tight">
          {city}
        </span>
      );
    },
  },
  {
    // Plan
    id: "premium",
    accessorKey: "user.account.isPremium",
    size: 100,
    minSize: 80,
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider">
        Plan
      </div>
    ),
    cell: ({ row }) => {
      const isPremium = row.original.user?.account?.isPremium;

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
  {
    // Status
    id: "status",
    accessorKey: "account.status",
    size: 120,
    minSize: 100,
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider">
        Status
      </div>
    ),
    // Custom filter function to make sure it catches the exact text
    filterFn: "includesString",
    cell: ({ row }) => {
      const status = row.original.user?.account?.status || "deactivated";
      return (
        <div className="flex gap-1">
          <Badge
            variant="outline"
            className={`uppercase px-2.5 py-0.5 flex items-center gap-1.5 w-max font-bold text-[10px] rounded-full shadow-none border-none cursor-pointer transition-opacity ${status === "active"
              ? "bg-emerald-500/10 text-emerald-600"
              : status === "banned"
                ? "bg-red-500/10 text-red-600 border-red-100/50"
                : status === "suspended"
                  ? "bg-amber-500/10 text-amber-600"
                  : "bg-slate-500/10 text-slate-600"
              }`}
          >
            <span className="w-1 h-1 rounded-full bg-current" />
            {status}
          </Badge>
        </div>
      );
    },
  },
  {
    // Actions
    id: "actions",
    size: 80,
    minSize: 80,
    header: () => (
      <div className="w-20 text-center text-[10px] font-bold uppercase tracking-wider">
        Actions
      </div>
    ),
    cell: ({ row }) => {
      // The correct ID per backend: user.profile.id
      const navigate = useNavigate();
      const profileId = row.original.user?.profile?.id;
      const status = row.original.user?.account?.status;
      const userId = profileId;

      return (
        <div className="flex justify-center">
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
                Profile Actions
              </DropdownMenuLabel>

              <DropdownMenuItem
                className="gap-2 cursor-pointer py-2 rounded-xl focus:bg-brand-aqua/10 focus:text-brand-aqua text-slate-500 font-semibold text-xs"
                onClick={() =>
                  navigate(`/admin/management/users-management/view-profile`, {
                    state: { userId, source: "fake-profiles" },
                  })
                }
              >
                <Eye className="w-4 h-4" />
                View Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleToggleStatus(profileId, status)}
                className={cn(
                  "gap-2 cursor-pointer py-2 rounded-xl font-semibold text-xs transition-colors",
                  status === "active"
                    ? "text-red-800 focus:bg-red-500/10 focus:text-red-500"
                    : "text-emerald-800 focus:bg-emerald-500/10 focus:text-emerald-500",
                )}
              >
                {status === "active" ? (
                  <>
                    <ToggleRight className="h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <ToggleLeft className="h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(profileId)}
                className="gap-2 cursor-pointer py-2 rounded-xl font-semibold text-xs text-red-800 focus:bg-red-500/10 focus:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete Permanently
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
