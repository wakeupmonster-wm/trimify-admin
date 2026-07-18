import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
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
    size: 100,
    minSize: 100,
    cell: ({ row }) => (
      <div className="px-1 text-left font-bold text-[11px] text-foreground/90">
        {row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: "updated_at",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Last Edit
      </div>
    ),
    size: 130,
    minSize: 130,
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
    size: 250,
    minSize: 250,
    cell: ({ row }) => (
      <span className="font-semibold text-slate-700 text-[11px] tracking-tight">
        {row.original.meal.Meal_title || "-"}
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
    size: 200,
    minSize: 200,
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
    size: 180,
    minSize: 180,
    cell: ({ row }) => {
      const isApproved =
        row.original.approval_status === "Approved" ||
        row.original.approval_status === 1 ||
        row.original.is_approved;
      return (
        <div className="flex justify-center">
          <div
            className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase ${
              isApproved ? "bg-[#28A745] text-white" : "bg-[#DC3545] text-white"
            }`}
          >
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
    size: 120,
    minSize: 120,
    cell: ({ row }) => {
      const isApproved =
        row.original.approval_status === "Approved" ||
        row.original.approval_status === 1 ||
        row.original.is_approved;
      return (
        <div className="flex justify-center">
          <Switch
            checked={isApproved}
            onCheckedChange={(val) =>
              handleAction && handleAction(row.original, "toggle", val)
            }
            className="data-[state=checked]:bg-brand-blue"
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
    size: 100,
    minSize: 100,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-slate-100/50 rounded-full"
              >
                <MoreVertical className="h-4 w-4 text-foreground/90" />
              </Button>
            </DropdownMenuTrigger>{" "}
            <DropdownMenuContent
              align="end"
              className="w-40 p-2 rounded-xl border-slate-200 shadow-sm"
            >
              <DropdownMenuLabel className="text-[10px] text-foreground/80 font-bold uppercase tracking-widest mb-1 px-2">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="gap-2 cursor-pointer py-1.5 rounded-lg hover:!bg-blue-50 focus:bg-brand-blue focus:text-brand-blue font-semibold text-xs "
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
