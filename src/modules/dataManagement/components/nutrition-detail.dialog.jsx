import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Utensils } from "lucide-react";

const parseJsonList = (value) => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map((item) => String(item).trim()) : [];
  } catch {
    return [];
  }
};

export const NutritionDetailDialog = ({ meal, open, onOpenChange }) => {
  if (!meal) return null;

  const ingredients = parseJsonList(meal.Meal_ingredients);
  const instructions = parseJsonList(meal.Meal_instructions);
  const hasImage = meal.Meal_Image_url && meal.Meal_Image_url !== "none";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{meal.Meal_title}</DialogTitle>
          {meal.Meal_Description && (
            <DialogDescription>{meal.Meal_Description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-5">
          {hasImage ? (
            <img
              src={meal.Meal_Image_url}
              alt={meal.Meal_title}
              className="w-full h-40 object-cover rounded-lg border border-slate-200"
            />
          ) : (
            <div className="w-full h-24 rounded-lg bg-slate-100 flex items-center justify-center">
              <Utensils className="w-6 h-6 text-slate-400" />
            </div>
          )}

          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Calories", value: `${meal.Meal_Calories_In_gm || 0} kcal` },
              { label: "Protein", value: `${meal.Meal_Protien_In_gm || 0} g` },
              { label: "Fats", value: `${meal.Meal_Fats_In_gm || 0} g` },
              { label: "Carbs", value: `${meal.Meal_Carbs_In_gm || 0} g` },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-slate-50 py-2 px-1">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wide">
                  {item.label}
                </p>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>

          {ingredients.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                Ingredients
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {ingredients.map((item, idx) => (
                  <li key={idx} className="text-[13px] text-slate-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {instructions.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                Instructions
              </h4>
              <ol className="list-decimal list-inside space-y-1">
                {instructions.map((item, idx) => (
                  <li key={idx} className="text-[13px] text-slate-700">
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
