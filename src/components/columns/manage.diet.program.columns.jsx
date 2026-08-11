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
import { minLength, minSize } from "zod";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const getManageDietProgramColumns = (handleAction) => [
  {
    accessorKey: "sno",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        SR.No
      </div>
    ),
    size: 60,
    minSize: 50,
    cell: ({ row }) => (
      <div className="text-left px-1 font-bold text-[11px] text-foreground/90">
        {row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Create Date
      </div>
    ),
    size: 100,
    minSize: 80,
    cell: ({ row }) => {
      const date =
        row.original.created_at || row.original.updated_at
          ? new Date(row.original.created_at || row.original.updated_at)
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
    accessorKey: "food",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Food
      </div>
    ),
    size: 200,
    minSize: 140,
    cell: ({ row }) => (
      <span className="font-semibold text-slate-700 text-[11px] tracking-tight line-clamp-1">
        {row.original.diet_meal_data?.Meal_title || "-"}
      </span>
    ),
  },
  {
    accessorKey: "image",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Image
      </div>
    ),
    size: 100,
    minSize: 60,
    cell: ({ row }) => {
      const imageUrl = row.original.diet_meal_data?.Meal_Image_url;
      return (
        <div className="flex items-center">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Meal" 
              className="w-10 h-10 object-cover rounded shadow-sm bg-slate-100"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <span className="font-medium text-slate-400 text-[11px] italic">
              No Image
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "week",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Week
      </div>
    ),
    size: 100,
    minSize: 80,
    cell: ({ row }) => (
      <span className="font-medium text-slate-600 text-[11px]">
        Week {row.original.week || "-"}
      </span>
    ),
  },
  {
    accessorKey: "mealType",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Meal Type
      </div>
    ),
    size: 100,
    minSize: 80,
    cell: ({ row }) => (
      <span className="font-medium text-slate-600 text-[11px]">
        {row.original.meal || "-"}
      </span>
    ),
  },
  {
    accessorKey: "mealDay",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Meal Day
      </div>
    ),
    size: 100,
    minSize: 80,
    cell: ({ row }) => (
      <span className="font-medium text-slate-600 text-[11px]">
        {row.original.day || "-"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-center">
        Status
      </div>
    ),
    size: 100,
    minSize: 80,
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
            className="data-[state=checked]:bg-app-cardGreen"
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
    minSize: 80,
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
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-36 p-2 rounded-xl border-slate-300/60 shadow-sm"
            >
              <DropdownMenuLabel className="text-[10px] text-foreground/80 font-bold uppercase tracking-widest mb-1 px-2">
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
