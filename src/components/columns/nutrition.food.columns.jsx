import { MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const getNutritionFoodColumns = (onAction) => [
  {
    id: "sno",
    header: () => (
      <div className="text-center text-[10px] font-bold uppercase tracking-wider">
        SR.No
      </div>
    ),
    size: 40,
    minSize: 30,
    cell: ({ row, table }) => {
      const { pageIndex = 0, pageSize = 10 } =
        table.getState().pagination || {};
      const serialNumber = pageIndex * pageSize + row.index + 1;

      return (
        <div className="text-center font-bold text-[11px] text-foreground/90">
          {serialNumber}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Meal_title",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Food Name
      </div>
    ),
    size: 100,
    minSize: 80,
    cell: ({ row }) => (
      <div className="capitalize font-bold text-slate-700 text-[11px] tracking-tight truncate">
        {row.original.Meal_title || "-"}
      </div>
    ),
  },
  {
    accessorKey: "Meal_Protien_In_gm",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Protein
      </div>
    ),
    size: 40,
    minSize: 30,
    cell: ({ row }) => (
      <div className="text-[11px] font-medium text-slate-600 tracking-tight whitespace-nowrap">
        {row.original.Meal_Protien_In_gm || "-"} gm
      </div>
    ),
  },
  {
    accessorKey: "Meal_Carbs_In_gm",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Carbs
      </div>
    ),
    size: 40,
    minSize: 30,
    cell: ({ row }) => (
      <div className="text-[11px] font-medium text-slate-600 tracking-tight whitespace-nowrap">
        {row.original.Meal_Carbs_In_gm || "-"} gm
      </div>
    ),
  },
  {
    accessorKey: "Meal_Calories_In_gm",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Calories
      </div>
    ),
    size: 40,
    minSize: 30,
    cell: ({ row }) => (
      <div className="text-[11px] font-medium text-slate-600 tracking-tight whitespace-nowrap">
        {row.original.Meal_Calories_In_gm || "-"} kcal
      </div>
    ),
  },
  {
    accessorKey: "Meal_Fats_In_gm",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Fats
      </div>
    ),
    size: 40,
    minSize: 30,
    cell: ({ row }) => (
      <div className="text-[11px] font-medium text-slate-600 tracking-tight whitespace-nowrap">
        {row.original.Meal_Fats_In_gm || "-"} gm
      </div>
    ),
  },
  {
    accessorKey: "Meal_Image_url",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-center">
        Image
      </div>
    ),
    size: 40,
    minSize: 30,
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.original.Meal_Image_url ? (
          <img
            src={row.original.Meal_Image_url}
            alt="Food"
            className="w-8 h-8 rounded-md object-cover border"
          />
        ) : (
          <div className="w-8 h-8 rounded-md bg-slate-200 flex items-center justify-center text-[10px] text-slate-500">
            No img
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "Meal_Type",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Meal Type
      </div>
    ),
    size: 50,
    minSize: 40,
    cell: ({ row }) => (
      <div className="text-[11px] font-medium text-slate-600 tracking-tight whitespace-nowrap">
        {row.original.Meal_Type || "-"}
      </div>
    ),
  },
  {
    accessorKey: "Meal_ingredients",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Ingredients
      </div>
    ),
    size: 80,
    minSize: 60,
    cell: ({ row }) => (
      <div className="w-[80px] md:w-[120px] max-w-[150px] text-[11px] font-medium text-slate-600 tracking-tight truncate inline-block align-bottom">
        {row.original.Meal_ingredients || "Not Available"}
      </div>
    ),
  },
  {
    accessorKey: "Meal_instructions",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Instructions
      </div>
    ),
    size: 120,
    minSize: 80,
    cell: ({ row }) => (
      <div className="w-[80px] md:w-[120px] max-w-[150px] text-[11px] font-medium text-slate-600 tracking-tight truncate inline-block align-bottom">
        {row.original.Meal_instructions || "Not Available"}
      </div>
    ),
  },
  {
    accessorKey: "Meal_Description",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Description
      </div>
    ),
    size: 120,
    minSize: 80,
    cell: ({ row }) => (
      <div className="w-[80px] md:w-[120px] max-w-[150px] text-[11px] font-medium text-slate-600 tracking-tight truncate inline-block align-bottom">
        {row.original.Meal_Description || "Not Available"}
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
    size: 50,
    minSize: 40,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 text-slate-400 hover:text-brand-blue hover:bg-app-primary5 rounded-full transition-colors"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 p-2 rounded-xl border-slate-300/60 shadow-sm"
            >
              <DropdownMenuLabel className="text-[10px] text-foreground/80 font-bold uppercase tracking-widest mb-1 px-2">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="gap-2 cursor-pointer py-1.5 rounded-lg hover:!bg-blue-50 focus:bg-app-primary2 focus:text-brand-blue font-semibold text-xs "
                onClick={() => onAction && onAction(row.original, "edit")}
              >
                <Edit className="w-3.5 h-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onAction(row.original, "delete")}
                className="text-xs font-medium cursor-pointer py-2 text-red-600 focus:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
