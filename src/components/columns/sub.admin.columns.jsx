import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";

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
        <div className="w-10 text-center font-bold text-[11px] text-foreground/90">
          {serialNumber}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
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
    cell: ({ row }) => (
      <span className="text-[11px] font-medium text-slate-600 tracking-tight whitespace-nowrap">
        {row.original.email || "-"}
      </span>
    ),
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
    size: 100,
    minSize: 90,
    cell: ({ row }) => (
      <span className="capitalize text-[11px] font-medium text-slate-600 tracking-tight whitespace-nowrap">
        {row.original.designation || "-"}
      </span>
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
    accessorKey: "role",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Role
      </div>
    ),
    size: 80,
    minSize: 80,
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
          className="data-[state=checked]:bg-brand-blue"
        />
      </div>
    ),
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
              <MoreVertical className="h-4 w-4 text-foreground/90" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-36 p-1.5 rounded-xl border-slate-200 shadow-sm"
          >
            <DropdownMenuLabel className="text-[10px] text-foreground/80 font-bold uppercase tracking-widest mb-1 px-2">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="gap-2 cursor-pointer py-1.5 rounded-lg focus:bg-brand-aqua/10 focus:text-brand-aqua font-semibold text-xs"
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
