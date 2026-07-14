import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, Utensils } from "lucide-react";

const Pill = ({ label }) => (
  <span className="w-max inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide text-brand-aqua bg-brand-aqua/10">
    {label}
  </span>
);

export const getNutritionColumns = (onView) => [
  {
    id: "sno",
    header: () => (
      <div className="w-10 text-left text-[10px] font-bold uppercase tracking-wider">
        S.No
      </div>
    ),
    size: 70,
    minSize: 70,
    cell: ({ row, table }) => {
      const { pageIndex = 0, pageSize = 10 } = table.getState().pagination || {};
      return (
        <div className="w-10 text-left font-bold text-[11px] text-foreground/90">
          {pageIndex * pageSize + row.index + 1}
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
        Food Item
      </div>
    ),
    size: 320,
    minSize: 280,
    cell: ({ row }) => {
      const meal = row.original;
      const hasImage = meal.Meal_Image_url && meal.Meal_Image_url !== "none";
      return (
        <div className="flex items-center gap-3">
          {hasImage ? (
            <img
              src={meal.Meal_Image_url}
              alt={meal.Meal_title}
              className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <Utensils className="w-4 h-4 text-slate-400" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-slate-800 truncate">
              {meal.Meal_title || "-"}
            </p>
            {meal.Meal_Type && <Pill label={meal.Meal_Type} />}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "Meal_Calories_In_gm",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Calories
      </div>
    ),
    size: 110,
    minSize: 110,
    cell: ({ row }) => (
      <span className="text-[11px] font-semibold text-slate-700">
        {row.original.Meal_Calories_In_gm || "-"} kcal
      </span>
    ),
  },
  {
    id: "macros",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-left">
        Protein / Fats / Carbs (g)
      </div>
    ),
    size: 200,
    minSize: 200,
    cell: ({ row }) => {
      const meal = row.original;
      return (
        <span className="text-[11px] font-semibold text-slate-700">
          {meal.Meal_Protien_In_gm || 0} / {meal.Meal_Fats_In_gm || 0} /{" "}
          {meal.Meal_Carbs_In_gm || 0}
        </span>
      );
    },
  },
  {
    accessorKey: "Meal_Serving",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-center">
        Serving
      </div>
    ),
    size: 90,
    minSize: 90,
    cell: ({ row }) => (
      <div className="text-center text-[11px] font-semibold text-slate-700">
        {row.original.Meal_Serving ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "Meal_Status",
    header: () => (
      <div className="text-[10px] font-bold uppercase tracking-wider text-center">
        Status
      </div>
    ),
    size: 110,
    minSize: 110,
    cell: ({ row }) => {
      const isActive = row.original.Meal_Status === "Active";
      return (
        <div className="flex justify-center">
          <Badge
            className={cn(
              "text-[9px] font-black rounded-full px-2.5 py-0.5 border-none shadow-none uppercase tracking-widest",
              isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
            )}
          >
            {row.original.Meal_Status || "Inactive"}
          </Badge>
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
    size: 90,
    minSize: 90,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onView && onView(row.original)}
          className="h-8 w-8 text-slate-400 hover:text-brand-aqua hover:bg-brand-aqua/5 transition-all duration-300 rounded-lg"
        >
          <Eye size={14} />
        </Button>
      </div>
    ),
  },
];
