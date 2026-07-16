import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  RefreshCcw,
  ImageIcon,
  Trash2,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

const STATUS_META = {
  draft: { label: "Queued", className: "bg-slate-100 text-slate-600 border-slate-200" },
  processing: { label: "Generating…", className: "bg-blue-50 text-blue-600 border-blue-200" },
  pending_review: { label: "Ready for review", className: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  failed: { label: "Failed", className: "bg-red-50 text-red-600 border-red-200" },
  duplicate_skipped: { label: "Already exists", className: "bg-amber-50 text-amber-600 border-amber-200" },
  approved: { label: "Saved", className: "bg-emerald-100 text-emerald-700 border-emerald-300" },
};

const parseJsonList = (val) => {
  try {
    if (typeof val === "string") {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.join("\n");
    }
  } catch {
    // not JSON, fall through
  }
  return val || "";
};

const stringifyList = (val) =>
  JSON.stringify(
    val
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  );

const buildFields = (item) => ({
  Meal_Protien_In_gm: item.Meal_Protien_In_gm ?? "",
  Meal_Carbs_In_gm: item.Meal_Carbs_In_gm ?? "",
  Meal_Calories_In_gm: item.Meal_Calories_In_gm ?? "",
  Meal_Fats_In_gm: item.Meal_Fats_In_gm ?? "",
  Meal_Description: item.Meal_Description ?? "",
  Meal_Type: item.Meal_Type ?? "",
  Meal_Serving: item.Meal_Serving ?? "",
  Meal_ingredients: parseJsonList(item.Meal_ingredients),
  Meal_instructions: parseJsonList(item.Meal_instructions),
});

const AiFoodReviewCard = ({
  item,
  selected,
  onToggleSelect,
  onFieldSave,
  onRetry,
  onRegenerateImage,
  onRemove,
  isBusy,
}) => {
  const [fields, setFields] = useState(() => buildFields(item));
  // AI generation finishes asynchronously (draft/processing -> pending_review) after this
  // card has already mounted, so local field state has to be re-synced on that transition.
  const [syncedStatus, setSyncedStatus] = useState(item.status);
  if (item.status !== syncedStatus) {
    setSyncedStatus(item.status);
    setFields(buildFields(item));
  }

  const isEditable = item.status === "pending_review";
  const statusMeta = STATUS_META[item.status] || STATUS_META.draft;
  const isInFlight = item.status === "draft" || item.status === "processing";

  const handleChange = (name, value) => {
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlurSave = (name, originalValue) => {
    let value = fields[name];
    if (value === (originalValue ?? "")) return;

    let payloadValue = value;
    if (name === "Meal_ingredients" || name === "Meal_instructions") {
      payloadValue = stringifyList(value);
      if (payloadValue === (originalValue ?? "")) return;
    }
    if (
      ["Meal_Protien_In_gm", "Meal_Carbs_In_gm", "Meal_Calories_In_gm", "Meal_Fats_In_gm", "Meal_Serving"].includes(name)
    ) {
      payloadValue = value === "" ? "" : Number(value);
    }

    onFieldSave(item.id, { [name]: payloadValue });
  };

  if (item.status === "duplicate_skipped") {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50/60 p-4 flex items-center justify-between gap-3 opacity-80">
        <div className="flex items-center gap-2 min-w-0">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-700 truncate">{item.food_name}</p>
            <p className="text-xs text-amber-700">
              Already exists in the catalog
              {item.duplicate_of_id && (
                <>
                  {" — "}
                  <Link
                    to={`/admin/data-management/edit-nutrition/${item.duplicate_of_id}`}
                    className="underline hover:text-amber-900"
                  >
                    view existing item
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.id)}
          disabled={isBusy}
          className="text-slate-400 hover:text-red-600 shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-300 bg-white overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2 min-w-0">
          {isEditable && (
            <Checkbox
              checked={selected}
              onCheckedChange={() => onToggleSelect(item.id)}
            />
          )}
          <p className="text-sm font-bold text-slate-800 truncate">{item.food_name}</p>
        </div>
        <Badge variant="outline" className={statusMeta.className}>
          {isInFlight && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
          {item.status === "pending_review" && <CheckCircle2 className="w-3 h-3 mr-1" />}
          {statusMeta.label}
        </Badge>
      </div>

      {item.status === "failed" && (
        <div className="px-4 py-3 bg-red-50/60 border-b border-red-100 flex items-center justify-between gap-3">
          <p className="text-xs text-red-700 flex items-center gap-1.5 min-w-0">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{item.error_message || "Generation failed."}</span>
          </p>
          <Button
            type="button"
            size="sm"
            onClick={() => onRetry(item.id)}
            disabled={isBusy}
            className="bg-red-600 hover:bg-red-700 text-white shrink-0"
          >
            {isBusy ? <Spinner className="w-3.5 h-3.5" /> : <RefreshCcw className="w-3.5 h-3.5" />}
            Retry
          </Button>
        </div>
      )}

      {isInFlight && (
        <div className="px-4 py-8 flex flex-col items-center justify-center gap-2 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-xs font-medium">
            {item.nutrition_status === "success" ? "Fetching image…" : "Generating nutrition & image…"}
          </p>
        </div>
      )}

      {item.status === "pending_review" && (
        <div className="p-4 space-y-4">
          <div className="flex gap-4">
            <div className="w-28 h-28 shrink-0 rounded-md overflow-hidden bg-slate-100 border border-slate-200 relative">
              {item.Meal_Image_url ? (
                <img
                  src={item.Meal_Image_url}
                  alt={item.food_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}
              <button
                type="button"
                onClick={() => onRegenerateImage(item.id)}
                disabled={isBusy}
                title="Regenerate image"
                className="absolute bottom-1 right-1 bg-white/90 hover:bg-white rounded-full p-1.5 shadow border border-slate-200 disabled:opacity-50"
              >
                {isBusy ? (
                  <Spinner className="w-3 h-3" />
                ) : (
                  <RefreshCcw className="w-3 h-3 text-slate-600" />
                )}
              </button>
            </div>

            <div className="flex-1 min-w-0 grid grid-cols-2 gap-3">
              <NumberField label="Protein (gm)" name="Meal_Protien_In_gm" fields={fields} onChange={handleChange} onBlurSave={handleBlurSave} original={item.Meal_Protien_In_gm} />
              <NumberField label="Carbs (gm)" name="Meal_Carbs_In_gm" fields={fields} onChange={handleChange} onBlurSave={handleBlurSave} original={item.Meal_Carbs_In_gm} />
              <NumberField label="Calories (kcal)" name="Meal_Calories_In_gm" fields={fields} onChange={handleChange} onBlurSave={handleBlurSave} original={item.Meal_Calories_In_gm} />
              <NumberField label="Fats (gm)" name="Meal_Fats_In_gm" fields={fields} onChange={handleChange} onBlurSave={handleBlurSave} original={item.Meal_Fats_In_gm} />
            </div>
          </div>

          {item.Meal_Image_url && item.image_attribution_name && (
            <p className="text-[10px] text-slate-400">
              Photo by{" "}
              <a
                href={item.image_attribution_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-slate-600"
              >
                {item.image_attribution_name}
              </a>{" "}
              on Unsplash
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase">Meal Type</label>
              <Select
                value={fields.Meal_Type}
                onValueChange={(val) => {
                  handleChange("Meal_Type", val);
                  if (val !== (item.Meal_Type ?? "")) onFieldSave(item.id, { Meal_Type: val });
                }}
              >
                <SelectTrigger className="h-9 text-xs border-slate-300">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recipes">Recipes</SelectItem>
                  <SelectItem value="ingredients">Ingredients</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <NumberField label="Servings" name="Meal_Serving" fields={fields} onChange={handleChange} onBlurSave={handleBlurSave} original={item.Meal_Serving} />
          </div>

          <TextField
            label="Description"
            name="Meal_Description"
            fields={fields}
            onChange={handleChange}
            onBlurSave={handleBlurSave}
            original={item.Meal_Description}
            rows={2}
          />
          <TextField
            label="Ingredients (one per line)"
            name="Meal_ingredients"
            fields={fields}
            onChange={handleChange}
            onBlurSave={handleBlurSave}
            original={parseJsonList(item.Meal_ingredients)}
            rows={3}
          />
          <TextField
            label="Instructions (one per line)"
            name="Meal_instructions"
            fields={fields}
            onChange={handleChange}
            onBlurSave={handleBlurSave}
            original={parseJsonList(item.Meal_instructions)}
            rows={3}
          />

          <div className="flex justify-end pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item.id)}
              disabled={isBusy}
              className="text-slate-400 hover:text-red-600"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </Button>
          </div>
        </div>
      )}

      {item.status === "approved" && (
        <div className="px-4 py-3 text-xs text-emerald-700 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Saved to the food catalog.
        </div>
      )}
    </div>
  );
};

const NumberField = ({ label, name, fields, onChange, onBlurSave, original }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-semibold text-slate-500 uppercase">{label}</label>
    <Input
      type="number"
      step="0.01"
      min="0"
      value={fields[name]}
      onChange={(e) => onChange(name, e.target.value)}
      onBlur={() => onBlurSave(name, original)}
      className="h-9 text-xs border-slate-300"
    />
  </div>
);

const TextField = ({ label, name, fields, onChange, onBlurSave, original, rows }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-semibold text-slate-500 uppercase">{label}</label>
    <Textarea
      value={fields[name]}
      onChange={(e) => onChange(name, e.target.value)}
      onBlur={() => onBlurSave(name, original)}
      rows={rows}
      className="text-xs resize-y border-slate-300"
    />
  </div>
);

export default AiFoodReviewCard;
