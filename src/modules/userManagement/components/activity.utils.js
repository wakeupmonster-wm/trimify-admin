import { Activity, Footprints, Droplet, Scale, Utensils, Dumbbell, ClipboardList } from "lucide-react";

export const ACTIVITY_META = {
  step_log: { label: "Step", icon: Footprints, className: "bg-emerald-50 text-emerald-600" },
  water_log: { label: "Water", icon: Droplet, className: "bg-app-primary2/5 text-app-primary2" },
  weight_log: { label: "Weight", icon: Scale, className: "bg-purple-50 text-purple-600" },
  food_log: { label: "Food", icon: Utensils, className: "bg-amber-50 text-amber-600" },
  fitzone_assigned: { label: "Fitzone", icon: Dumbbell, className: "bg-purple-50 text-purple-600" },
  program_assigned: { label: "Program", icon: ClipboardList, className: "bg-indigo-50 text-indigo-600" },
};

export function activityMeta(type) {
  return ACTIVITY_META[type] || { label: "Activity", icon: Activity, className: "bg-slate-50 text-slate-600" };
}

/**
 * Formats weight values: caps at 1 decimal place if trailing zero (e.g. 75.0, 72.1),
 * 2 decimal places otherwise (e.g. 75.25).
 */
export function formatWeightValue(val) {
  if (val === null || val === undefined || val === "") return "";
  const num = parseFloat(val);
  if (isNaN(num)) return String(val);
  const r2 = Math.round(num * 100) / 100;
  const r1 = Math.round(num * 10) / 10;
  return r2 === r1 ? num.toFixed(1) : num.toFixed(2);
}
