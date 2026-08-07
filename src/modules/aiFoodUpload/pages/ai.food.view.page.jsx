import React, { useEffect, useState, useMemo } from "react";
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
  ClipboardList,
  Bot,
  Save,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  updateAiFoodItem,
  retryAiFoodItem,
  regenerateAiFoodImage,
  regenerateAiFoodImageFromAudio,
  deleteAiFoodItem,
  generateAiFood,
  saveAiFoodItems,
} from "../store/ai.food.slice";
import { useAiFoodPolling } from "../hooks/useAiFoodPolling";
import { getNutritionListAPI } from "@/modules/dataManagement/services/nutrition.services";
import AiFoodImagePromptPanel from "../components/AiFoodImagePromptPanel";
import AiFoodCustomRegenerateModal from "../components/AiFoodCustomRegenerateModal";
import ConfirmModal from "@/components/common/ConfirmModal";

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
  const saveLoading = useSelector((state) => state.aiFood.saveLoading);

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
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAutoRegenConfirmOpen, setIsAutoRegenConfirmOpen] = useState(false);
  const [hideOverlay, setHideOverlay] = useState(false);

  useEffect(() => {
    if (item && item.status !== "processing") {
      setImageRegenerating(false);
      setIsPromptModalOpen(false);
      setHideOverlay(false);
    }
  }, [item?.status]);

  const isDirty = useMemo(() => {
    if (!item) return false;
    const originalFields = buildFields(item);
    return Object.keys(fields).some(
      (key) => {
        let val1 = fields[key];
        let val2 = originalFields[key];
        if (typeof val1 === "string" && typeof val2 === "string") {
          return val1.trim() !== val2.trim();
        }
        return val1 !== val2;
      }
    );
  }, [fields, item]);

  if (!item) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
          <Sparkles className="w-10 h-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">
            This item isn't in your current review session anymore.
          </p>
          <Button
            type="button"
            onClick={() => navigate(BACK_TO_LIST)}
            className="bg-slate-50 hover:bg-app-primary2 text-muted-foreground hover:text-white border border-slate-300/80 hover:border-none rounded-md px-4 h-10 flex items-center justify-center gap-2 text-xs font-semibold shadow-sm transition-all mt-2"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Back </span>
          </Button>
        </div>
      </Container>
    );
  }

  const statusMeta = STATUS_META[item.status] || STATUS_META.draft;

  const isImageProcessing =
    imageRegenerating ||
    (item.status === "processing" && item.nutrition_status === "success");

  const showImageOverlay = isImageProcessing && !hideOverlay;

  const isInFlight =
    item.status === "draft" ||
    (item.status === "processing" && item.nutrition_status !== "success");

  const showReviewForm = !isInFlight;

  const handleChange = (name, value) => {
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdits = () => {
    const originalFields = buildFields(item);
    const data = {};
    let hasChanges = false;

    Object.keys(fields).forEach(key => {
      let val1 = fields[key];
      let val2 = originalFields[key];
      const isString = typeof val1 === "string" && typeof val2 === "string";
      if ((isString && val1.trim() !== val2.trim()) || (!isString && val1 !== val2)) {
        let value = fields[key];
        if (key === "Meal_ingredients" || key === "Meal_instructions") {
          value = stringifyList(value);
        } else if (
          [
            "Meal_Protien_In_gm",
            "Meal_Carbs_In_gm",
            "Meal_Calories_In_gm",
            "Meal_Fats_In_gm",
            "Meal_Serving",
          ].includes(key)
        ) {
          value = value === "" ? "" : Number(value);
        }
        data[key] = value;
        hasChanges = true;
      }
    });

    if (!hasChanges) return;

    dispatch(updateAiFoodItem({ id: item.id, data }))
      .unwrap()
      .then(() => toast.success("Changes saved successfully."))
      .catch((error) => toast.error(error || "Failed to save changes."));
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

  const confirmAutoRegen = () => {
    setIsAutoRegenConfirmOpen(false);
    handleRegenerateImage();
  };

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

  const handleCancelRegenerate = () => {
    setImageRegenerating(false);
    setHideOverlay(true);
    toast.info("Stopped waiting — the image will still update automatically once it's ready.");
  };

  const handleRemove = () => {
    dispatch(deleteAiFoodItem(item.id))
      .unwrap()
      .then(() => {
        setIsDeleteModalOpen(false);
        toast.success("Item removed.");
        navigate(BACK_TO_LIST);
      })
      .catch((error) => {
        setIsDeleteModalOpen(false);
        toast.error(error || "Failed to remove item.");
      });
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
      <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading={item.food_name}
                icon={<Sparkles className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading={
                  <Badge
                    variant="outline"
                    className={`${statusMeta.className} mt-0.5`}
                  >
                    {(isInFlight || isImageProcessing) && (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    )}
                    {item.status === "pending_review" && (
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                    )}
                    {statusMeta.label}
                  </Badge>
                }
              />
            </div>

            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full max-w-max shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
              <Button
                type="button"
                onClick={() => navigate(BACK_TO_LIST)}
                className="flex-1 bg-slate-50 hover:bg-app-primary2 text-muted-foreground hover:text-white border border-slate-300/80 hover:border-none rounded-md px-3 h-10 flex items-center justify-center gap-2 text-xs font-semibold shadow-sm transition-all"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Back </span>
              </Button>
              {item.status !== "approved" && !isInFlight && (
                <Button
                  onClick={handleSaveEdits}
                  disabled={isBusy || !isDirty}
                  className="flex-1 bg-app-primary2 hover:bg-app-primary3 text-white rounded-md px-4 h-10 flex items-center justify-center gap-2 text-xs font-semibold shadow-sm transition-all"
                >
                  {isBusy ? (
                    <Spinner className="w-4 h-4 shrink-0" />
                  ) : (
                    <Save className="w-4 h-4 shrink-0" />
                  )}
                  <span className="whitespace-nowrap">Save</span>
                </Button>
              )}
            </div>
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
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleViewExisting}
                      disabled={viewingExisting}
                      className="border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-800 h-8 px-3 text-xs"
                    >
                      {viewingExisting ? (
                        <Spinner className="w-3 h-3 mr-1" />
                      ) : (
                        <Pencil className="w-3 h-3 mr-1" />
                      )}
                      Update / Delete Existing
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(true)}
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
                  onClick={() => setIsDeleteModalOpen(true)}
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
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:lg:grid-cols-[1fr_400px] gap-6 items-start">
              {/* Image Card (Right Column on Desktop) */}
              <div className="flex flex-col gap-4 order-last lg:order-last">
                <Card className="border-slate-200 shadow-sm p-4 flex flex-col gap-4 bg-white rounded-xl">
                  <div className="flex items-center gap-2 px-1">
                    <ImageIcon className="w-[18px] h-[18px] text-[#1d5284]" />
                    <h3 className="text-sm font-bold text-[#1d5284] uppercase tracking-wide">
                      Photo
                    </h3>
                  </div>

                  <div className="relative rounded-xl overflow-hidden aspect-square bg-slate-100 group w-full border border-slate-100">
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
                          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${showImageOverlay ? "opacity-30 blur-sm" : ""}`}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all">
                          <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                        </div>
                      </button>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon className="w-12 h-12 opacity-50" />
                      </div>
                    )}

                    {/* Regenerate Action Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-[#1d5284] hover:bg-slate-50 transition-colors z-10"
                          disabled={isBusy || isImageProcessing}
                        >
                          <Bot className="w-5 h-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-2">
                        <DropdownMenuItem
                          onClick={() => setIsAutoRegenConfirmOpen(true)}
                          className="gap-2 text-xs 3xl:text-sm font-medium cursor-pointer hover:!bg-app-primary2/10"
                        >
                          <RefreshCcw className="w-4 h-4 text-slate-500" /> Auto
                          Regenerate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setIsPromptModalOpen(true)}
                          className="gap-2 text-xs 3xl:text-sm font-medium cursor-pointer hover:!bg-app-primary2/10"
                        >
                          <Sparkles className="w-4 h-4 text-app-primary2" />{" "}
                          Custom Regenerate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setIsDeleteModalOpen(true)}
                          className="gap-2 text-xs 3xl:text-sm font-medium text-red-600 focus:text-red-700 cursor-pointer hover:!bg-red-100"
                        >
                          <Trash2 className="w-4 h-4" /> Remove Entire Item
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {showImageOverlay && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/60 backdrop-blur-[2px] z-20">
                        <div className="bg-white p-4 rounded-full shadow-lg">
                          <Loader2 className="w-6 h-6 text-app-primary2 animate-spin" />
                        </div>
                        <p className="text-xs font-bold text-slate-700 bg-white/80 px-3 py-1 rounded-full">
                          {imageRegenerating ? "Regenerating image…" : "Generating image…"}
                        </p>
                        <button
                          type="button"
                          onClick={handleCancelRegenerate}
                          className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline"
                        >
                          Cancel waiting
                        </button>
                      </div>
                    )}
                  </div>

                  {item.Meal_Image_url && item.image_attribution_name && (
                    <div className="px-1 -mt-1">
                      <p className="text-[11px] text-slate-400 text-center">
                        Photo by{" "}
                        <a
                          href={item.image_attribution_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-medium hover:text-slate-600"
                        >
                          {item.image_attribution_name}
                        </a>{" "}
                        on Unsplash
                      </p>
                    </div>
                  )}
                </Card>
              </div>

              {/* Data Form (Left Column on Desktop) */}
              <div className="bg-white rounded-md shadow-sm border border-slate-300/60 hover:border-app-primary2/30 transition-colors p-6 space-y-6 order-first lg:order-first">
                <div className="flex items-center gap-2 -mb-2">
                  <ClipboardList className="w-3.5 h-3.5 text-app-primary2" />
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Nutrition &amp; Details
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <NumberField
                    label="Protein (gm)"
                    name="Meal_Protien_In_gm"
                    fields={fields}
                    onChange={handleChange}
                  />
                  <NumberField
                    label="Carbs (gm)"
                    name="Meal_Carbs_In_gm"
                    fields={fields}
                    onChange={handleChange}
                  />
                  <NumberField
                    label="Calories (kcal)"
                    name="Meal_Calories_In_gm"
                    fields={fields}
                    onChange={handleChange}
                  />
                  <NumberField
                    label="Fats (gm)"
                    name="Meal_Fats_In_gm"
                    fields={fields}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Meal Type
                    </label>
                    <Select
                      value={fields.Meal_Type}
                      onValueChange={(val) => handleChange("Meal_Type", val)}
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
                    large
                  />
                </div>

                <TextField
                  label="Description"
                  name="Meal_Description"
                  fields={fields}
                  onChange={handleChange}
                  rows={3}
                />
                <TextField
                  label="Ingredients (one per line)"
                  name="Meal_ingredients"
                  fields={fields}
                  onChange={handleChange}
                  rows={4}
                />
                <TextField
                  label="Instructions (one per line)"
                  name="Meal_instructions"
                  fields={fields}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>
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

      <AiFoodCustomRegenerateModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        foodName={item.food_name}
        onGenerateFromPrompt={(prompt) => {
          handleGenerateFromPrompt(prompt);
          setIsPromptModalOpen(false);
        }}
        onGenerateFromAudio={(audio) => {
          handleGenerateFromAudio(audio);
          setIsPromptModalOpen(false);
        }}
        busy={isBusy || isImageProcessing}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleRemove}
        title="Remove Item"
        message="Are you sure you want to completely remove this generated item? This action cannot be undone."
        confirmText="Remove"
        loading={isBusy}
        type="danger"
      />

      <ConfirmModal
        isOpen={isAutoRegenConfirmOpen}
        onClose={() => setIsAutoRegenConfirmOpen(false)}
        onConfirm={confirmAutoRegen}
        title="Auto Regenerate Image"
        message="Are you sure you want to auto regenerate this image? This will replace the current image with a newly generated one."
        confirmText="Regenerate"
        loading={isBusy || isImageProcessing}
        type="brand"
      />
    </Container>
  );
};

const NumberField = ({
  label,
  name,
  fields,
  onChange,
}) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-700">{label}</label>
    <Input
      type="number"
      step="0.01"
      min="0"
      value={fields[name]}
      onChange={(e) => onChange(name, e.target.value)}
      className="h-10 text-sm border-slate-300/60"
    />
  </div>
);

const TextField = ({
  label,
  name,
  fields,
  onChange,
  rows,
}) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-700">{label}</label>
    <Textarea
      value={fields[name]}
      onChange={(e) => onChange(name, e.target.value)}
      rows={rows}
      className="text-sm resize-y border-slate-300/60"
    />
  </div>
);

export default AiFoodViewPage;
