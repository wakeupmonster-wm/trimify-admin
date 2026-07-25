import { Activity, Footprints, Droplet, Scale, Utensils, Dumbbell, ClipboardList } from "lucide-react";

export const ACTIVITY_META = {
  step_log: { label: "Step", icon: Footprints, className: "bg-blue-50 text-blue-600" },
  water_log: { label: "Water", icon: Droplet, className: "bg-sky-50 text-sky-600" },
  weight_log: { label: "Weight", icon: Scale, className: "bg-amber-50 text-amber-600" },
  food_log: { label: "Food", icon: Utensils, className: "bg-emerald-50 text-emerald-600" },
  fitzone_assigned: { label: "Fitzone", icon: Dumbbell, className: "bg-purple-50 text-purple-600" },
  program_assigned: { label: "Program", icon: ClipboardList, className: "bg-indigo-50 text-indigo-600" },
};

export function activityMeta(type) {
  return ACTIVITY_META[type] || { label: "Activity", icon: Activity, className: "bg-slate-50 text-slate-500" };
}
