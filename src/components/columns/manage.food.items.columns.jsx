import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Ellipsis, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const getManageFoodItemsColumns = (handleAction) => [
  {
    accessorKey: "sno",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
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
        <div className="px-1 text-left font-bold text-[11px] text-foreground/90">
          {serialNumber}
        </div>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Last Edit
      </div>
    ),
    size: 120,
    minSize: 100,
    cell: ({ row }) => {
      const date = row.original.updated_at
        ? new Date(row.original.updated_at)
        : new Date();
      return (
        <span className="font-medium text-slate-700 text-[11px]">
          {date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "Meal_title",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Food Name
      </div>
    ),
    size: 300,
    minSize: 250,
    cell: ({ row }) => (
      <span className="font-semibold text-slate-700 text-[11px] tracking-tight">
        {row.original.meal?.Meal_title || "-"}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Food Category
      </div>
    ),
    size: 150,
    minSize: 120,
    cell: ({ row }) => (
      <span className="font-medium text-slate-600 text-[11px]">
        {row.original.category?.name ||
          row.original.category?.title ||
          row.original.category_name ||
          "-"}
      </span>
    ),
  },
  {
    accessorKey: "approval_status",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-center">
        Approved / Non approved
      </div>
    ),
    size: 150,
    minSize: 120,
    cell: ({ row }) => {
      const isApproved =
        row.original.approval_status === "Approved" ||
        row.original.approval_status === 1 ||
        row.original.is_approved;
      return (
        <div className="flex justify-center">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
              isApproved
                ? "bg-emerald-100 text-emerald-800"
                : "bg-rose-100 text-rose-800"
            }`}
          >
            <span
              className={`w-1 h-1 rounded-full ${
                isApproved ? "bg-emerald-600" : "bg-rose-600"
              }`}
            />
            {isApproved ? "Approved" : "Non Approved"}
          </div>
        </div>
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
    minSize: 60,
    cell: ({ row }) => {
      const isActive =
        row.original.status === "Active" ||
        row.original.status === 1 ||
        row.original.is_active;
      return (
        <div className="flex justify-center">
          <Switch
            checked={isActive}
            onCheckedChange={(val) =>
              handleAction && handleAction(row.original, "toggle", val)
            }
            className="data-[state=checked]:bg-app-primary2"
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-center">
        Action
      </div>
    ),
    size: 80,
    minSize: 60,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-slate-100/50 rounded-full"
              >
                <Ellipsis className="h-4 w-4 text-foreground/90" />
              </Button>
            </DropdownMenuTrigger>{" "}
            <DropdownMenuContent
              align="end"
              className="w-36 p-2 rounded-xl border-slate-300/60 shadow-sm"
            >
              <DropdownMenuLabel className="text-[11px] 3xl:text-xs text-foreground/80 font-bold uppercase tracking-widest mb-1 px-2">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="gap-2 cursor-pointer py-1.5 rounded-lg  focus:bg-slate-100 focus:text-slate-900 font-semibold text-xs "
                onClick={() =>
                  handleAction && handleAction(row.original, "edit")
                }
              >
                <Edit className="w-3.5 h-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleAction && handleAction(row.original, "delete")
                }
                className="text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer rounded-lg py-2 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
