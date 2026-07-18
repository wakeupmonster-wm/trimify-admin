import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Sparkles,
  RefreshCcw,
  ImageIcon,
  Trash2,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Pencil,
  Eye,
} from "lucide-react";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import Header from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import {
  updateAiFoodItem,
  retryAiFoodItem,
  regenerateAiFoodImage,
  regenerateAiFoodImageFromAudio,
  deleteAiFoodItem,
  generateAiFood,
} from "../store/ai.food.slice";
import { useAiFoodPolling } from "../hooks/useAiFoodPolling";
import { getNutritionListAPI } from "@/modules/dataManagement/services/nutrition.services";
import AiFoodImagePromptPanel from "../components/AiFoodImagePromptPanel";

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

const BACK_TO_LIST = "/admin/data-management/ai-food-upload";

const AiFoodViewPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useAiFoodPolling();

  const itemId = Number(id);
  const item = useSelector((state) =>
    state.aiFood.items.find((i) => i.id === itemId),
  );
  const isBusy = useSelector((state) =>
    state.aiFood.itemActionIds.includes(itemId),
  );

  const [fields, setFields] = useState(() => (item ? buildFields(item) : {}));
  const [syncedStatus, setSyncedStatus] = useState(item?.status);
  if (item && item.status !== syncedStatus) {
    setSyncedStatus(item.status);
    setFields(buildFields(item));
  }

  const [previewOpen, setPreviewOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(item?.food_name || "");
  const [viewingExisting, setViewingExisting] = useState(false);

  // Tracks an image-only regenerate (icon button / prompt / audio) on an
  // item that already has its data — distinct from the initial draft ->
  // pending_review pipeline, since the backend flips status to "processing"
  // for both. Kept local so the whole review form doesn't disappear behind
  // a blocking full-page spinner just because the photo is being redone.
  const [imageRegenerating, setImageRegenerating] = useState(false);

  useEffect(() => {
    if (item && item.status !== "processing") {
      setImageRegenerating(false);
    }
  }, [item?.status]);

  if (!item) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
          <Sparkles className="w-10 h-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">
            This item isn't in your current review session anymore.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate(BACK_TO_LIST)}
            className="flex items-center gap-2 mt-2"
          >
            <ArrowLeft size={16} />
            Back to List
          </Button>
        </div>
      </Container>
    );
  }

  const statusMeta = STATUS_META[item.status] || STATUS_META.draft;
  const isInFlight = (item.status === "draft" || item.status === "processing") && !imageRegenerating;
  const showReviewForm = item.status === "pending_review" || (item.status === "processing" && imageRegenerating);

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
      [
        "Meal_Protien_In_gm",
        "Meal_Carbs_In_gm",
        "Meal_Calories_In_gm",
        "Meal_Fats_In_gm",
        "Meal_Serving",
      ].includes(name)
    ) {
      payloadValue = value === "" ? "" : Number(value);
    }

    dispatch(updateAiFoodItem({ id: item.id, data: { [name]: payloadValue } }))
      .unwrap()
      .catch((error) => toast.error(error || "Failed to save change."));
  };

  const handleRetry = () => {
    dispatch(retryAiFoodItem(item.id))
      .unwrap()
      .catch((error) => toast.error(error || "Failed to retry item."));
  };

  const handleRegenerateImage = () => {
    setImageRegenerating(true);
    dispatch(regenerateAiFoodImage({ id: item.id }))
      .unwrap()
      .then(() => toast.success("Regenerating image…"))
      .catch((error) => {
        setImageRegenerating(false);
        toast.error(error || "Failed to regenerate image.");
      });
  };

  // Fire-and-forget, same as the plain regenerate button — the response
  // doesn't carry the new image yet, useAiFoodPolling picks it up once the
  // item flips back out of "processing".
  const handleGenerateFromPrompt = (prompt) => {
    setImageRegenerating(true);
    dispatch(regenerateAiFoodImage({ id: item.id, imagePrompt: prompt }))
      .unwrap()
      .then(() => toast.success("Regenerating image from your prompt…"))
      .catch((error) => {
        setImageRegenerating(false);
        toast.error(error || "Failed to regenerate image.");
      });
  };

  const handleGenerateFromAudio = (audioBlob) => {
    setImageRegenerating(true);
    dispatch(regenerateAiFoodImageFromAudio({ id: item.id, audioBlob }))
      .unwrap()
      .then(() => toast.success("Regenerating image from your recording…"))
      .catch((error) => {
        setImageRegenerating(false);
        toast.error(error || "Couldn't process that recording — please try again.");
      });
  };

  // Doesn't cancel the backend job (fire-and-forget, no cancel endpoint) —
  // just stops blocking this screen on it. useAiFoodPolling still picks up
  // the result whenever it's ready, cancelled or not.
  const handleCancelRegenerate = () => {
    setImageRegenerating(false);
    toast.info("Stopped waiting — the image will still update automatically once it's ready.");
  };

  const handleRemove = () => {
    dispatch(deleteAiFoodItem(item.id))
      .unwrap()
      .then(() => {
        toast.success("Item removed.");
        navigate(BACK_TO_LIST);
      })
      .catch((error) => toast.error(error || "Failed to remove item."));
  };

  const startEditingName = () => {
    setNameDraft(item.food_name);
    setEditingName(true);
  };

  const submitRename = () => {
    const trimmed = nameDraft.trim();
    if (!trimmed || trimmed === item.food_name) {
      setEditingName(false);
      return;
    }
    dispatch(deleteAiFoodItem(item.id))
      .unwrap()
      .then(() => dispatch(generateAiFood([trimmed])).unwrap())
      .then(() => {
        toast.success("Regenerating with the corrected name…");
        navigate(BACK_TO_LIST);
      })
      .catch((error) => toast.error(error || "Failed to update the name."));
    setEditingName(false);
  };

  const handleViewExisting = async () => {
    if (!item.duplicate_of_id) return;
    setViewingExisting(true);
    try {
      const response = await getNutritionListAPI({
        search: item.food_name,
        limit: 10,
      });
      const match = (response?.nutrition || []).find(
        (n) => n.id === item.duplicate_of_id,
      );
      navigate(
        `/admin/data-management/edit-nutrition/${item.duplicate_of_id}`,
        {
          state: { editData: match || null },
        },
      );
      if (!match) {
        toast.error(
          "Loaded the item, but couldn't confirm the exact match — please double-check the fields.",
        );
      }
    } catch {
      toast.error(
        "Could not load the existing item. Please find it manually in the Nutrition Food list.",
      );
    } finally {
      setViewingExisting(false);
    }
  };

  return (
    <Container>
      <div className="space-y-6">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PageHeader
              heading={item.food_name}
              icon={<Sparkles className="w-9 h-9 text-white" />}
              color="bg-app-primary2 shadow-brand-blue"
              subheading={
                <Badge
                  variant="outline"
                  className={`${statusMeta.className} mt-0.5`}
                >
                  {isInFlight && (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  )}
                  {item.status === "pending_review" && (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  )}
                  {statusMeta.label}
                </Badge>
              }
            />

            <Button
              variant="outline"
              onClick={() => navigate(BACK_TO_LIST)}
              className="w-full md:w-auto flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to List
            </Button>
          </div>
        </Header>

        {item.status === "duplicate_skipped" && (
          <div className="bg-amber-50/60 border border-amber-200 rounded-md p-5 flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3 min-w-0">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  {item.error_message ||
                    "This item already exists in the catalog."}
                </p>
                {item.duplicate_of_id && (
                  <button
                    type="button"
                    onClick={handleViewExisting}
                    disabled={viewingExisting}
                    className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 underline decoration-amber-400 underline-offset-2 hover:text-amber-950 disabled:opacity-50"
                  >
                    {viewingExisting && <Spinner className="w-3 h-3" />}
                    View existing item
                  </button>
                )}
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleRemove}
              disabled={isBusy}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              {isBusy ? (
                <Spinner className="w-4 h-4" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Remove
            </Button>
          </div>
        )}

        {item.status === "failed" && (
          <div className="bg-red-50/60 border border-red-200 rounded-md p-5 space-y-3">
            <p className="text-sm text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {item.error_message || "Generation failed."}
            </p>

            {editingName ? (
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
                <Input
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitRename()}
                  placeholder="Corrected food name"
                  className="h-9 text-sm border-red-200 bg-white"
                  autoFocus
                />
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    onClick={submitRename}
                    disabled={isBusy || !nameDraft.trim()}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isBusy ? (
                      <Spinner className="w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Regenerate
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setEditingName(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={startEditingName}
                  disabled={isBusy}
                  className="border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800"
                >
                  <Pencil className="w-4 h-4" />
                  Edit name
                </Button>
                <Button
                  type="button"
                  onClick={handleRetry}
                  disabled={isBusy}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isBusy ? (
                    <Spinner className="w-4 h-4" />
                  ) : (
                    <RefreshCcw className="w-4 h-4" />
                  )}
                  Retry
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleRemove}
                  disabled={isBusy}
                  className="text-slate-400 hover:text-red-600 ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </Button>
              </div>
            )}
          </div>
        )}

        {isInFlight && (
          <div className="bg-white rounded-md shadow-sm border border-slate-300/60 py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm font-medium">
              {item.nutrition_status === "success"
                ? "Fetching image…"
                : "Generating nutrition & image…"}
            </p>
          </div>
        )}

        {item.status === "approved" && (
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-md p-5 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-semibold text-emerald-700">
              Saved to the food catalog.
            </p>
          </div>
        )}

        {showReviewForm && (
          <>
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
            <div className="bg-white rounded-md shadow-sm border border-slate-300 p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Photo</h3>
              <div className="aspect-square w-full rounded-md overflow-hidden bg-slate-100 border border-slate-200 relative group">
                {item.Meal_Image_url ? (
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    className="w-full h-full block"
                    title="View full image"
                  >
                    <img
                      src={item.Meal_Image_url}
                      alt={item.food_name}
                      className={`w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 ${imageRegenerating ? "opacity-40" : ""}`}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                      <Eye className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}
                {imageRegenerating && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/70">
                    <Loader2 className="w-6 h-6 text-brand-blue animate-spin" />
                    <p className="text-[11px] font-semibold text-slate-600">Regenerating…</p>
                    <button
                      type="button"
                      onClick={handleCancelRegenerate}
                      className="text-[11px] font-semibold text-slate-500 underline hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleRegenerateImage}
                  disabled={isBusy || imageRegenerating}
                  title="Regenerate image"
                  className="absolute bottom-2 right-2 bg-white/90 hover:bg-white rounded-full p-2 shadow border border-slate-200 disabled:opacity-50"
                >
                  {isBusy ? (
                    <Spinner className="w-3.5 h-3.5" />
                  ) : (
                    <RefreshCcw className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </button>
              </div>

                {item.Meal_Image_url && item.image_attribution_name && (
                  <p className="text-[11px] text-slate-400">
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

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemove}
                  disabled={isBusy}
                  className="w-full border-slate-300/60 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Item
                </Button>
              </div>

              <div className="bg-white rounded-md shadow-sm border border-slate-300/60 p-6 space-y-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider -mb-2">
                  Nutrition &amp; Details
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <NumberField
                    label="Protein (gm)"
                    name="Meal_Protien_In_gm"
                    fields={fields}
                    onChange={handleChange}
                    onBlurSave={handleBlurSave}
                    original={item.Meal_Protien_In_gm}
                  />
                  <NumberField
                    label="Carbs (gm)"
                    name="Meal_Carbs_In_gm"
                    fields={fields}
                    onChange={handleChange}
                    onBlurSave={handleBlurSave}
                    original={item.Meal_Carbs_In_gm}
                  />
                  <NumberField
                    label="Calories (kcal)"
                    name="Meal_Calories_In_gm"
                    fields={fields}
                    onChange={handleChange}
                    onBlurSave={handleBlurSave}
                    original={item.Meal_Calories_In_gm}
                  />
                  <NumberField
                    label="Fats (gm)"
                    name="Meal_Fats_In_gm"
                    fields={fields}
                    onChange={handleChange}
                    onBlurSave={handleBlurSave}
                    original={item.Meal_Fats_In_gm}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Meal Type
                    </label>
                    <Select
                      value={fields.Meal_Type}
                      onValueChange={(val) => {
                        handleChange("Meal_Type", val);
                        if (val !== (item.Meal_Type ?? "")) {
                          dispatch(
                            updateAiFoodItem({
                              id: item.id,
                              data: { Meal_Type: val },
                            }),
                          )
                            .unwrap()
                            .catch((error) =>
                              toast.error(error || "Failed to save change."),
                            );
                        }
                      }}
                    >
                      <SelectTrigger className="h-10 text-sm border-slate-300/60">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recipes">Recipes</SelectItem>
                        <SelectItem value="ingredients">Ingredients</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <NumberField
                    label="Servings"
                    name="Meal_Serving"
                    fields={fields}
                    onChange={handleChange}
                    onBlurSave={handleBlurSave}
                    original={item.Meal_Serving}
                    large
                  />
                </div>

                <TextField
                  label="Description"
                  name="Meal_Description"
                  fields={fields}
                  onChange={handleChange}
                  onBlurSave={handleBlurSave}
                  original={item.Meal_Description}
                  rows={3}
                />
                <TextField
                  label="Ingredients (one per line)"
                  name="Meal_ingredients"
                  fields={fields}
                  onChange={handleChange}
                  onBlurSave={handleBlurSave}
                  original={parseJsonList(item.Meal_ingredients)}
                  rows={4}
                />
                <TextField
                  label="Instructions (one per line)"
                  name="Meal_instructions"
                  fields={fields}
                  onChange={handleChange}
                  onBlurSave={handleBlurSave}
                  original={parseJsonList(item.Meal_instructions)}
                  rows={4}
                />
              </div>
            </div>

          <AiFoodImagePromptPanel
            onGenerateFromPrompt={handleGenerateFromPrompt}
            onGenerateFromAudio={handleGenerateFromAudio}
            onCancel={handleCancelRegenerate}
            busy={isBusy || imageRegenerating}
          />
          </>
        )}
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0">
          {item.Meal_Image_url && (
            <img
              src={item.Meal_Image_url}
              alt={item.food_name}
              className="w-full max-h-[75vh] object-contain bg-slate-50"
            />
          )}
          <div className="p-4 space-y-1">
            <p className="text-sm font-semibold text-slate-800">
              {item.food_name}
            </p>
            {item.image_attribution_name && (
              <p className="text-xs text-slate-400">
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
          </div>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

const NumberField = ({
  label,
  name,
  fields,
  onChange,
  onBlurSave,
  original,
}) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-700">{label}</label>
    <Input
      type="number"
      step="0.01"
      min="0"
      value={fields[name]}
      onChange={(e) => onChange(name, e.target.value)}
      onBlur={() => onBlurSave(name, original)}
      className="h-10 text-sm border-slate-300/60"
    />
  </div>
);

const TextField = ({
  label,
  name,
  fields,
  onChange,
  onBlurSave,
  original,
  rows,
}) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-700">{label}</label>
    <Textarea
      value={fields[name]}
      onChange={(e) => onChange(name, e.target.value)}
      onBlur={() => onBlurSave(name, original)}
      rows={rows}
      className="text-sm resize-y border-slate-300/60"
    />
  </div>
);

export default AiFoodViewPage;
