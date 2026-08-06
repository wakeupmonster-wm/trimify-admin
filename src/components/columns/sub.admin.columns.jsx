import { Button } from "@/components/ui/button";
import { Ellipsis, Edit, Trash2, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// const DESIGNATION_COLORS = [
//   "bg-emerald-500/10 text-emerald-600",
//   "bg-blue-500/10 text-blue-600",
//   "bg-amber-500/10 text-amber-600",
//   "bg-purple-500/10 text-purple-600",
//   "bg-rose-500/10 text-rose-600",
//   "bg-indigo-500/10 text-indigo-600",
//   "bg-cyan-500/10 text-cyan-600",
//   "bg-pink-500/10 text-pink-600",
// ];

// const getDesignationColor = (designation) => {
//   if (!designation || designation === "-")
//     return "bg-slate-500/10 text-slate-600";
//   let hash = 0;
//   for (let i = 0; i < designation.length; i++) {
//     hash = designation.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   const index = Math.abs(hash) % DESIGNATION_COLORS.length;
//   return DESIGNATION_COLORS[index];
// };

export const getSubAdminColumns = (onAction) => [
  {
    id: "sno",
    header: () => (
      <div className="w-10 text-center text-[10px] font-bold uppercase tracking-wider">
        SR.No
      </div>
    ),
    size: 60,
    minSize: 50,
    cell: ({ row, table }) => {
      const { pageIndex = 0, pageSize = 10 } =
        table.getState().pagination || {};
      const serialNumber = pageIndex * pageSize + row.index + 1;

      return (
        <div className="w-10 text-left px-1 font-bold text-[11px] text-foreground/90">
          {serialNumber}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "userName",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        User Name
      </div>
    ),
    size: 130,
    minSize: 130,
    cell: ({ row }) => (
      <div className="capitalize font-bold text-slate-700 text-[11px] tracking-tight whitespace-nowrap">
        {row.original.name || "-"}
      </div>
    ),
  },
  {
    accessorKey: "emailId",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Email ID
      </div>
    ),
    size: 140,
    minSize: 140,
    cell: ({ row }) => {
      const email = row.original.email;
      if (!email)
        return <span className="text-slate-400 text-[11px] italic">-</span>;
      return (
        <div
          className="flex items-center gap-2 w-full text-[11px] font-medium text-slate-600 tracking-tight"
          title={email}
        >
          <Mail className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="truncate max-w-36 block">{email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "hospital",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Hospital/Clinic Name
      </div>
    ),
    size: 120,
    minSize: 120,
    cell: ({ row }) => (
      <span className="text-[11px] font-medium text-slate-600 tracking-tight whitespace-nowrap">
        {row.original.hospital || "-"}
      </span>
    ),
  },
  {
    accessorKey: "designation",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Designation
      </div>
    ),
    size: 120,
    minSize: 110,
    cell: ({ row }) => {
      const designation = row.original.designation;
      const isMissing = !designation || designation === "-";
      // const colorClass = getDesignationColor(designation);
      return (
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] font-bold px-2.5 py-0.5 rounded-full border-none shadow-none uppercase flex items-center gap-1.5 transition-all duration-200 max-w-full w-fit",
            // colorClass,
            isMissing
              ? "bg-slate-500/10 text-slate-600"
              : "bg-emerald-500/10 text-emerald-600"
          )}
        >
          <span className="w-1 h-1 shrink-0 rounded-full bg-current" />
          <span className="truncate capitalize">
            {isMissing ? "Not Assigned" : designation}
          </span>
        </Badge>
      );
    },
  },
  {
    accessorKey: "role",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Role
      </div>
    ),
    size: 110,
    minSize: 100,
    cell: ({ row }) => {
      const roleVal = row.original.role;
      let displayRole = "-";
      if (roleVal == 1) {
        displayRole = "WhiteListing User";
      } else if (roleVal == 0) {
        displayRole = "Sub-Admin User";
      } else if (roleVal) {
        displayRole = roleVal;
      }
      return (
        <span className="text-[11px] font-medium text-slate-600 tracking-tight whitespace-nowrap">
          {displayRole}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-center">
        Status
      </div>
    ),
    size: 80,
    minSize: 70,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Switch
          checked={
            row.original.status === "Active" || row.original.status === true
          }
          onCheckedChange={(checked) =>
            onAction && onAction(row.original, "toggle-status", checked)
          }
          className="data-[state=checked]:bg-app-primary2"
        />
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Country
      </div>
    ),
    size: 80,
    minSize: 80,
    cell: ({ row }) => (
      <span className="capitalize text-[11px] font-medium text-slate-600 tracking-tight whitespace-nowrap">
        {row.original.location || "-"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Created At
      </div>
    ),
    size: 100,
    minSize: 100,
    cell: ({ row }) => {
      const dateValue = row.original.created_at;
      if (!dateValue || isNaN(new Date(dateValue).getTime())) {
        return <span className="text-slate-400 text-xs">-</span>;
      }
      return (
        <div className="text-[11px] font-medium text-slate-700 tracking-tight whitespace-nowrap">
          {format(new Date(dateValue), "dd MMM yyyy")}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center text-[10px] font-bold uppercase tracking-wider">
        Action
      </div>
    ),
    size: 60,
    minSize: 60,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-slate-100/50 rounded-full"
            >
              <Ellipsis className="h-4 w-4 text-foreground/90" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-36 p-2 rounded-xl border-slate-300/60 shadow-sm"
          >
            <DropdownMenuLabel className="text-[11px] 3xl:text-xs text-foreground/80 font-bold uppercase tracking-widest mb-1 px-2">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="gap-2 cursor-pointer py-1.5 rounded-lg  focus:bg-slate-100 focus:text-slate-900 font-semibold text-xs "
              onClick={() => onAction && onAction(row.original, "edit")}
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 cursor-pointer py-1.5 rounded-lg text-red-600 focus:bg-red-50 focus:text-red-700 font-semibold text-xs"
              onClick={() => onAction && onAction(row.original, "delete")}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
