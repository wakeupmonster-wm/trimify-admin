import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Eye,
  ArrowUpDown,
  FileText,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dummyImg from "@/assets/web/dummyImg.webp";
import dummyID from "@/assets/web/dummyIDCard.webp";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { format, formatDistanceToNow } from "date-fns";

export const getKYCColumns = (onAction, onPreview, navigate) => [
  {
    id: "sno",
    header: () => (
      <div className="w-20 text-center text-[10px] font-bold uppercase tracking-wider ">
        SR.NO
      </div>
    ),
    size: 80,
    minSize: 80,
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      const serialNumber = pageIndex * pageSize + row.index + 1;

      return (
        <div className="w-20 text-center font-bold text-[11px] text-foreground/90">
          {serialNumber}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "user",
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
    size: 160,
    minSize: 140,
    cell: ({ row, table }) => {
      const avatar = row.original?.user?.avatar;
      const nickname = row.original?.user?.nickname || "-";

      // Access the modal function passed from the main component
      const { setImageModal } = table.options.meta || {};

      return (
        <div className="flex items-center gap-3">
          {/* Avatar with Click-to-Zoom logic */}
          <Avatar className="h-8 w-8 border-2 border-white shadow-sm shrink-0">
            <AvatarImage
              src={avatar || dummyImg}
              className="object-cover cursor-pointer hover:scale-110 transition-transform duration-200"
              onClick={() =>
                setImageModal?.({
                  open: true,
                  src: avatar || dummyImg,
                  title: `${nickname || "User"} Profile Photo`,
                })
              }
            />
            <AvatarFallback className="text-[10px] bg-slate-50 text-slate-400 font-bold">
              {nickname?.[0]}
            </AvatarFallback>
          </Avatar>

          <span className="capitalize font-bold text-slate-700 text-[11px] tracking-tight truncate max-w-[120px] block">
            {nickname}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "user.phone",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider ">
        Phone Number
      </div>
    ),
    size: 140,
    minSize: 120,
    cell: ({ row }) => {
      const phone = row.original.user?.phone;

      if (!phone)
        return <span className="text-slate-400 text-xs italic">-</span>;

      return (
        <div className="text-[11px] font-medium text-slate-600 tracking-tight">
          {phone}
        </div>
      );
    },
  },
  {
    accessorKey: "user.email",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider ">
        Email Address
      </div>
    ),
    size: 180,
    minSize: 160,
    cell: ({ row }) => {
      const email = row.original.user?.email;

      if (!email)
        return <span className="text-slate-400 text-xs italic">-</span>;

      return (
        <div className="text-[11px] font-medium text-slate-600 lowercase tracking-tight max-w-[150px] truncate">
          {email}
        </div>
      );
    },
  },
  {
    accessorKey: "verification.status",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider ">
        Status
      </div>
    ),
    size: 120,
    minSize: 100,
    cell: ({ row }) => {
      // console.log("row.original.verification: ", row.original.verification);
      const status = (
        row.original.verification?.status ||
        row.original.kycStatus ||
        "pending"
      ).toLowerCase();

      // Mapping styles to status
      const variants = {
        not_started: "bg-slate-500/10 text-slate-600",
        pending: "bg-amber-500/10 text-amber-600",
        approved: "bg-emerald-500/10 text-emerald-600",
        rejected: "bg-red-500/10 text-red-600",
      };

      // Agar status in variants mein se nahi hai (safety check)
      if (!variants[status]) return null;

      return (
        <Badge
          variant="outline"
          className={`
          uppercase flex items-center gap-1.5 w-max font-bold text-[10px] rounded-full border-none shadow-none cursor-pointer hover:opacity-80 transition-opacity px-2.5 py-0.5
          ${variants[status]}
        `}
        >
          <span className="w-1 h-1 rounded-full bg-current" />
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    // accessorKey: "createdAt",
    accessorKey: "verification.submittedAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 text-[10px]  font-bold uppercase tracking-wider hover:bg-transparent p-0"
      >
        Submitted At
        <ArrowUpDown className="svg text-muted-foreground" />
      </Button>
    ),
    size: 140,
    minSize: 120,
    cell: ({ row }) => {
      const dateValue =
        row.original.verification?.submittedAt || row.original.createdAt;

      if (!dateValue || isNaN(new Date(dateValue).getTime())) {
        return <span className="text-slate-400 text-xs">-</span>;
      }

      const date = new Date(dateValue);

      return (
        <div className="flex flex-col min-w-24">
          <span className="text-[11px] font-bold text-slate-700 tracking-tight">
            {format(date, "dd MMM, yyyy")}
          </span>
          <span className="text-[10px] font-medium text-slate-400">
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
        </div>
      );
    },
  },
  {
    id: "documents",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider ">
        Documents
      </div>
    ),
    size: 130,
    minSize: 120,
    cell: ({ row }) => {
      const { verification } = row.original;
      const hasDocs = verification?.docUrl || verification?.selfieUrl;
      const isApproved = verification?.status === "approved";

      return (
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-md shadow-none bg-white border border-brand-aqua/30 text-brand-aqua disabled:cursor-not-allowed hover:bg-brand-aqua hover:text-white transition-all font-semibold active:scale-95 px-4"
          disabled={!hasDocs && !isApproved}
          onClick={() =>
            onPreview({
              open: true,
              userId: row.original.userId,
              userName: row.original.user?.nickname,
              status: row.original.verification?.status,
              images: [
                { src: verification?.docUrl || dummyID, label: "ID Document" },
                {
                  src: verification?.selfieUrl || dummyImg,
                  label: "User Selfie",
                },
              ],
              title: `${row.original.user?.nickname || "User"}'s Documents`,
              multi: true, // Flag to tell the modal it's a multi-view
            })
          }
        >
          <FileText className="w-4 h-4" strokeWidth={1.5} />
          View Docs
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center text-[10px] font-bold uppercase tracking-wider ">
        Actions
      </div>
    ),
    size: 120,
    minSize: 80,
    cell: ({ row }) => {
      const user = row.original;
      const userId = user?.userId;

      const currentStatus = user?.verification?.status;

      // Status check
      const isProcessed =
        currentStatus === "approved" ||
        currentStatus === "rejected" ||
        currentStatus === "not_started";

      return (
        <div className="flex justify-center">
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
                KYC Actions
              </DropdownMenuLabel>

              {/* 1. VIEW DETAILS - Hamesha active rahega */}
              <DropdownMenuItem
                className="gap-2 cursor-pointer py-2 rounded-xl focus:bg-brand-aqua/10 focus:text-brand-aqua  font-semibold text-xs"
                onClick={() =>
                  navigate(`/admin/management/users-management/view-profile`, {
                    state: { userId },
                  })
                }
              >
                <Eye className="w-4 h-4" />
                View Profile
              </DropdownMenuItem>

              {/* 2. APPROVE - Disable agar process ho chuka hai ya already approved hai */}
              {/* <DropdownMenuItem
                className={cn(
                  "cursor-pointer rounded-lg gap-2 disabled:cursor-not-allowed text-emerald-800 focus:text-emerald-600 focus:bg-emerald-50",
                  isProcessed &&
                    "opacity-50 cursor-not-allowed pointer-events-none",
                )}
                disabled={isProcessed}
                onClick={() =>
                  !isProcessed &&
                  onAction(user.userId, "approve", user.nickname)
                }
              >
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-semibold text-xs">
                  {currentStatus === "approved"
                    ? "Already Approved"
                    : "Approve KYC"}
                </span>
              </DropdownMenuItem> */}

              {/* 2. APPROVE - Hidden if processed (except if rejected for re-approve) */}
              {(!isProcessed || currentStatus === "rejected") && (
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg gap-2 text-emerald-800 focus:text-emerald-600 focus:bg-emerald-50"
                  onClick={() =>
                    onAction(
                      user.userId,
                      currentStatus === "rejected" ? "re-approve" : "approve",
                      user.nickname,
                    )
                  }
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-semibold text-xs">
                    {currentStatus === "rejected" ? "Re-approve" : "Approve"}{" "}
                    KYC
                  </span>
                </DropdownMenuItem>
              )}

              {/* 3. REJECT - Disable agar process ho chuka hai */}
              {/* <DropdownMenuItem
                className={cn(
                  "cursor-pointer rounded-lg gap-2 text-red-800 focus:text-red-600 focus:bg-red-50",
                  isProcessed &&
                    "opacity-50 cursor-not-allowed pointer-events-none",
                )}
                disabled={isProcessed}
                onClick={() =>
                  !isProcessed &&
                  onAction(user.userId, "reject", "Document unclear")
                }
              >
                <XCircle className="h-4 w-4" />
                <span className="font-semibold text-xs">
                  {currentStatus === "rejected"
                    ? "Already Rejected"
                    : "Reject KYC"}
                </span>
              </DropdownMenuItem> */}

              {/* 3. REJECT - Hidden if processed */}
              {!isProcessed && (
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg gap-2 text-red-800 focus:text-red-600 focus:bg-red-50"
                  onClick={() => onAction(user.userId, "reject", user.nickname)}
                >
                  <XCircle className="h-4 w-4" />
                  <span className="font-semibold text-xs">Reject KYC</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
