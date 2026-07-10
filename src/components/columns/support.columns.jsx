import {
  MoreHorizontal,
  Phone,
  Mail,
  ArrowUpDown,
  MessageSquare,
  Trash,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge"; // Assuming shadcn/ui
import { Button } from "@/components/ui/button";
import dummyImg from "@/assets/web/dummyImg.webp";
import { format, formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const supportColumns = (onAction, onPreview) => [
  {
    id: "sno",
    header: () => <div className="text-center">Sr.No.</div>,
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return (
        <div className="text-center font-bold text-[11px] text-foreground/90">
          {pageIndex * pageSize + row.index + 1}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "user",
    header: "Ticket Details",
    cell: ({ row, table }) => {
      const user = row.original.user;
      const avatar = user?.avatar || dummyImg;
      const nickname = user?.nickname || "-";
      const { setImageModal } = table.options.meta || {};

      return (
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-gray-100 overflow-hidden border flex-shrink-0">
            <img
              src={avatar} // Fallback image path
              alt="User Avatar"
              className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-200"
              onClick={() =>
                setImageModal?.({
                  open: true,
                  src: avatar,
                  title: `${nickname} Selfie`,
                })
              }
            />
          </div>

          {/* Text Labels */}
          <div className="flex flex-col min-w-0">
            <span className="capitalize font-bold text-foreground/90 text-[11px] truncate max-w-[120px] block">
              {nickname}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "user.phone",
    header: "Contact",
    cell: ({ row }) => {
      const phone = row.original.user?.phone;

      if (!phone)
        return <span className="text-slate-400 text-xs italic">-</span>;

      const copyToClipboard = () => {
        navigator.clipboard.writeText(phone);
        toast.success("Phone number copied!");
      };

      return (
        <div
          // onClick={copyToClipboard}
          className="flex items-center gap-2 w-full text-[11px] font-medium text-foreground/90"
        >
          <Phone className="w-3 h-3 text-foreground/90" />
          {phone}
        </div>
      );
    },
  },
  {
    accessorKey: "user.email",
    header: () => <div className="w-max text-center">Email Address</div>,
    cell: ({ row }) => {
      const email = row.original.user?.email;

      if (!email)
        return <span className="text-slate-400 text-xs italic">-</span>;

      const copyToClipboard = () => {
        navigator.clipboard.writeText(email);
        toast.success("Email address copied!");
      };

      return (
        <div
          // onClick={copyToClipboard}
          className="flex items-center cursor-pointer gap-2 w-full text-[11px] font-medium text-foreground/90"
        >
          <Mail className="w-3 h-3 text-foreground/90 shrink-0" />
          <span className="text-[11px] lowercase text-foreground/90 max-w-[120px] truncate block">
            {email}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "subject",
    header: () => <div className="w-max text-center">Subject</div>,
    cell: ({ row }) => (
      <div className="flex flex-col max-w-[250px]">
        <span
          className="font-bold text-[11px] text-foreground/90 truncate"
          title={row.getValue("subject")}
        >
          {row.getValue("subject") || "-"}
        </span>
      </div>
    ),
  },
  {
    id: "category",
    // accessorFn is great for complex data, but accessorKey: "category" works too
    accessorFn: (row) => row.category,
    header: ({ column }) => (
      <button
        className="flex items-center hover:text-gray-900 uppercase transition-colors"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Category
        <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />
      </button>
    ),
    cell: ({ row }) => {
      const category = row.getValue("category");
      
      const categoryColors = {
        General: "bg-emerald-500/10 text-emerald-600",
        Account: "bg-blue-500/10 text-blue-600",
        Dating: "bg-rose-500/10 text-rose-600",
        Subscriptions: "bg-indigo-500/10 text-indigo-600",
        Troubleshooting: "bg-amber-500/10 text-amber-600",
        "Security & Privacy": "bg-teal-500/10 text-teal-600",
        "Safety & Reporting": "bg-red-500/10 text-red-600",
        Other: "bg-zinc-500/10 text-zinc-600",
      };

      const colorClass = categoryColors[category] || "bg-slate-500/10 text-slate-600";

      return (
        <div className="flex flex-col max-w-[200px]">
          <Badge
            variant="outline"
            className={`w-max uppercase px-2.5 py-0.5 flex gap-1.5 font-bold text-[10px] rounded-full border-none shadow-none ${colorClass}`}
          >
            <span className="shrink-0 w-1 h-1 rounded-full bg-current" />
            <span className="truncate">{category || "Uncategorized"}</span>
          </Badge>
          {row.original.subCategory && (
            <span className="text-[9px] text-muted-foreground mt-1">
              {row.original.subCategory}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      // Standardize the status string
      const status = (row.original?.status || "open").toLowerCase();

      // Mapping styles to your specific ticket statuses
      const variants = {
        open: "bg-blue-500/10 text-blue-600",
        in_progress: "bg-amber-500/10 text-amber-600",
        resolved: "bg-emerald-500/10 text-emerald-600",
        closed: "bg-slate-500/10 text-slate-600",
      };

      return (
        <Badge
          variant="outline"
          className={`
          uppercase flex items-center gap-1.5 w-max font-bold text-[10px] rounded-full border-none shadow-none cursor-pointer hover:opacity-80 transition-opacity px-2.5 py-0.5
          ${variants[status] || "bg-gray-500/10 text-gray-600"}
        `}
        >
          <span className="w-1 h-1 rounded-full bg-current" />
          {/* Replaces underscores with spaces for "in progress" */}
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <button
        className="w-max flex items-center hover:text-gray-900 uppercase"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created At
        <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />
      </button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));

      return (
        <div className="flex flex-col min-w-24">
          <span className="text-[11px] font-medium text-foreground/90">
            {format(date, "dd MMM, yyyy")}
          </span>
          <span className="text-[10px] font-medium text-foreground/70">
            {date
              ? formatDistanceToNow(new Date(date), { addSuffix: true })
              : "-"}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="w-max text-center mr-4">Actions</div>,
    cell: ({ row, table }) => {
      const navigate = useNavigate();
      const ticket = row.original;
      const { setSelectedTicket, setConfirmConfig } = table.options?.meta || {};

      return (
        <div className="text-left">
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
                Ticket Actions
              </DropdownMenuLabel>

              <DropdownMenuItem
                className="gap-2 cursor-pointer rounded-xl py-2 focus:bg-brand-aqua/10 focus:text-brand-aqua text-slate-500 font-semibold text-xs"
                onClick={() =>
                  navigate(`/admin/management/support/view-ticket/${ticket._id}`, {
                    state: { ticketData: ticket },
                  })
                }
              >
                <Eye className="w-4 h-4" />
                View Ticket
              </DropdownMenuItem>

              {/* Update Status Action */}
              <DropdownMenuItem
                disabled={ticket.status === "closed" || ticket.status === "resolved"}
                className="gap-2 cursor-pointer rounded-xl py-2 text-xs font-semibold text-emerald-800 focus:bg-emerald-500/10 focus:text-emerald-600 transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
                onClick={() => setSelectedTicket?.(ticket)}
              >
                <MessageSquare className="h-4 w-4" />
                Update Status
              </DropdownMenuItem>

              {/* Delete Action */}
              <DropdownMenuItem
                className="gap-2 cursor-pointer rounded-xl py-2 text-xs font-semibold text-red-800 focus:bg-red-500/10 focus:text-red-500 transition-colors"
                onClick={() =>
                  setConfirmConfig?.({
                    isOpen: true,
                    ticketId: ticket._id,
                    nickname: ticket.user?.nickname || "this user",
                    action: "delete", // We add a 'delete' case here
                  })
                }
              >
                <Trash className="h-4 w-4" />
                Delete Ticket
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
