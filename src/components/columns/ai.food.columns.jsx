import { Eye, ImageIcon, Loader2, CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const formatIngredients = (val) => {
  try {
    if (typeof val === "string") {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.join(", ");
    }
  } catch {
    // not JSON, fall through
  }
  return val || "";
};

const STATUS_META = {
  draft: {
    label: "Queued",
    className: "bg-slate-100 text-slate-600 border-slate-300/60",
  },
  processing: {
    label: "Generating…",
    className: "bg-blue-50 text-blue-600 border-blue-200",
  },
  pending_review: {
    label: "Ready for review",
    className: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  failed: {
    label: "Failed",
    className: "bg-red-50 text-red-600 border-red-200",
  },
  duplicate_skipped: {
    label: "Already exists",
    className: "bg-amber-50 text-amber-600 border-amber-200",
  },
  approved: {
    label: "Saved",
    className: "bg-emerald-100 text-emerald-700 border-emerald-300",
  },
};

export const getAiFoodColumns = ({ selectedIds, onToggleSelect, onView }) => [
  {
    id: "select",
    header: () => (
      <div className="w-[30px] text-center text-[10px] font-bold uppercase tracking-wider">
        Sel.
      </div>
    ),
    size: 36,
    minSize: 36,
    cell: ({ row }) => {
      const item = row.original;
      if (item.status !== "pending_review") {
        return <div className="w-[30px]" />;
      }
      return (
        <div className="w-[30px] flex justify-center">
          <Checkbox
            checked={selectedIds.includes(item.id)}
            onCheckedChange={() => onToggleSelect(item.id)}
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "sno",
    header: () => (
      <div className="w-[30px] text-center text-[10px] font-bold uppercase tracking-wider">
        SR.No
      </div>
    ),
    size: 40,
    minSize: 40,
    cell: ({ row, table }) => {
      const { pageIndex = 0, pageSize = 10 } =
        table.getState().pagination || {};
      const serialNumber = pageIndex * pageSize + row.index + 1;

      return (
        <div className="w-[30px] text-center font-bold text-[11px] text-foreground/90">
          {serialNumber}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Meal_Image_url",
    header: () => (
      <div className="w-[40px] text-[10px] font-bold uppercase tracking-wider text-center">
        Image
      </div>
    ),
    size: 40,
    minSize: 40,
    cell: ({ row }) => (
      <div className="w-[40px] flex justify-center">
        {row.original.Meal_Image_url ? (
          <img
            src={row.original.Meal_Image_url}
            alt="Food"
            className="w-8 h-8 rounded-md object-cover border"
          />
        ) : (
          <div className="w-8 h-8 rounded-md bg-slate-200 flex items-center justify-center text-slate-400">
            <ImageIcon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "food_name",
    header: () => (
      <div className="w-[140px] text-[10px] font-bold uppercase tracking-wider text-left">
        Food Name
      </div>
    ),
    size: 140,
    minSize: 140,
    cell: ({ row }) => (
      <div className="w-[140px] capitalize font-bold text-slate-700 text-[11px] tracking-tight truncate">
        {row.original.food_name || "-"}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="w-[110px] text-[10px] font-bold uppercase tracking-wider text-left">
        Status
      </div>
    ),
    size: 110,
    minSize: 110,
    cell: ({ row }) => {
      const item = row.original;
      const meta = STATUS_META[item.status] || STATUS_META.draft;
      const isInFlight =
        item.status === "draft" || item.status === "processing";
      return (
        <Badge
          variant="outline"
          className={`${meta.className} whitespace-nowrap`}
        >
          {isInFlight && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
          {item.status === "pending_review" && (
            <CheckCircle2 className="w-3 h-3 mr-1" />
          )}
          {meta.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "Meal_Type",
    header: () => (
      <div className="w-[70px] text-[10px] font-bold uppercase tracking-wider text-left">
        Meal Type
      </div>
    ),
    size: 70,
    minSize: 70,
    cell: ({ row }) => (
      <div className="w-[70px] text-[11px] font-medium text-slate-600 tracking-tight capitalize whitespace-nowrap">
        {row.original.Meal_Type || "-"}
      </div>
    ),
  },
  {
    accessorKey: "Meal_Calories_In_gm",
    header: () => (
      <div className="w-[60px] text-[10px] font-bold uppercase tracking-wider text-left">
        Calories
      </div>
    ),
    size: 60,
    minSize: 60,
    cell: ({ row }) => (
      <div className="w-[60px] text-[11px] font-medium text-slate-600 tracking-tight whitespace-nowrap">
        {row.original.Meal_Calories_In_gm
          ? `${row.original.Meal_Calories_In_gm} kcal`
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "Meal_Protien_In_gm",
    header: () => (
      <div className="w-[50px] text-[10px] font-bold uppercase tracking-wider text-left">
        Protein
      </div>
    ),
    size: 50,
    minSize: 50,
    cell: ({ row }) => (
      <div className="w-[50px] text-[11px] font-medium text-slate-600 tracking-tight whitespace-nowrap">
        {row.original.Meal_Protien_In_gm
          ? `${row.original.Meal_Protien_In_gm} gm`
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "Meal_ingredients",
    header: () => (
      <div className="w-[160px] text-[10px] font-bold uppercase tracking-wider text-left">
        Ingredients
      </div>
    ),
    size: 160,
    minSize: 160,
    cell: ({ row }) => (
      <div className="w-[160px] text-[11px] font-medium text-slate-600 tracking-tight truncate block">
        {formatIngredients(row.original.Meal_ingredients) || "Not Available"}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => (
      <div className="w-[50px] text-center text-[10px] font-bold uppercase tracking-wider">
        Action
      </div>
    ),
    size: 50,
    minSize: 50,
    cell: ({ row }) => (
      <div className="w-[50px] flex justify-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onView(row.original.id)}
          className="h-8 w-8 text-slate-400 hover:text-brand-blue hover:bg-app-primary5 rounded-full transition-colors"
          title="View"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
