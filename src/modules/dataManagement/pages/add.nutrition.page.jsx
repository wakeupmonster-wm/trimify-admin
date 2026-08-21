import React, { useEffect, useRef, useState } from "react";
import CTAButton from "@/components/common/CTAButton";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import {
  Save,
  Loader2,
  ArrowLeft,
  Carrot,
  Info,
  ImageIcon,
  ClipboardList,
  Eye,
  Bot,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Header from "@/components/common/header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  addNutrition,
  regenerateNutritionImage,
  updateNutrition,
} from "../store/nutrition.slice";
import ConfirmModal from "@/components/common/ConfirmModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getNutritionListAPI } from "../services/nutrition.services";
import { toast } from "sonner";

const AddNutritionPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isEdit = Boolean(id);
  const editData = location.state?.editData || null;
  const { loading } = useSelector((state) => state.nutrition);

  const parseArrayToString = (val) => {
    try {
      if (typeof val === "string") {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => item.replace(/\r/g, "")).join("\n");
        }
      }
      return val || "";
    } catch {
      return val || "";
    }
  };

  const [errors, setErrors] = useState({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isAutoRegenerateOpen, setIsAutoRegenerateOpen] = useState(false);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [isImageRegenerating, setIsImageRegenerating] = useState(false);
  const pollTimeoutRef = useRef(null);
  const [formData, setFormData] = useState(() => ({
    title: isEdit ? editData?.Meal_title || editData?.title || "" : "",
    image: isEdit
      ? editData?.Meal_Image_url && editData.Meal_Image_url !== "none"
        ? editData.Meal_Image_url
        : editData?.image || ""
      : "",
    protein: isEdit
      ? editData?.Meal_Protien_In_gm || editData?.protein || ""
      : "",
    carbs: isEdit ? editData?.Meal_Carbs_In_gm || editData?.carbs || "" : "",
    calories: isEdit
      ? editData?.Meal_Calories_In_gm || editData?.calories || ""
      : "",
    fats: isEdit ? editData?.Meal_Fats_In_gm || editData?.fats || "" : "",
    description: isEdit
      ? editData?.Meal_Description || editData?.description || ""
      : "",
    Meal_Type: isEdit ? editData?.Meal_Type || editData?.meal_type || "" : "",
    meal_description: isEdit
      ? parseArrayToString(editData?.Meal_instructions) ||
        editData?.meal_description ||
        ""
      : "",
    meal_ingredients: isEdit
      ? parseArrayToString(editData?.Meal_ingredients) ||
        editData?.meal_ingredients ||
        ""
      : "",
    Meal_Serving: isEdit ? editData?.Meal_Serving || "" : "",
  }));

  useEffect(
    () => () => {
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
    },
    [],
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getImageUrlFromResponse = (response) =>
    response?.Meal_Image_url ||
    response?.image ||
    response?.data?.Meal_Image_url ||
    response?.data?.image ||
    response?.nutrition?.Meal_Image_url ||
    response?.nutrition?.image ||
    "";

  const applyGeneratedImage = (imageUrl) => {
    setFormData((current) => ({ ...current, image: imageUrl }));
    setErrors((current) => ({ ...current, image: "" }));
    setIsImageRegenerating(false);
    toast.success("Food image replaced successfully.");
  };

  const pollForGeneratedImage = async (previousImage, attempt = 0) => {
    try {
      const response = await getNutritionListAPI({
        search: formData.title,
        limit: 100,
      });
      const nutritionItems = response?.nutrition || response?.data || [];
      const item = nutritionItems.find(
        (nutrition) => String(nutrition.id) === String(id),
      );
      const generatedImage = getImageUrlFromResponse(item);

      if (generatedImage && generatedImage !== previousImage) {
        applyGeneratedImage(generatedImage);
        return;
      }
    } catch {
      // Keep polling: image generation may still be completing asynchronously.
    }

    if (attempt >= 11) {
      setIsImageRegenerating(false);
      toast.info(
        "Image generation is still processing. Reopen this item shortly to see the replacement.",
      );
      return;
    }

    await new Promise((resolve) => {
      pollTimeoutRef.current = setTimeout(resolve, 2500);
    });
    return pollForGeneratedImage(previousImage, attempt + 1);
  };

  const handleRegenerateImage = async (prompt) => {
    if (!id || isImageRegenerating) return;

    const previousImage = formData.image;
    setIsImageRegenerating(true);
    try {
      const response = await dispatch(
        regenerateNutritionImage({ id, imagePrompt: prompt }),
      ).unwrap();
      const generatedImage = getImageUrlFromResponse(response);

      if (generatedImage && generatedImage !== previousImage) {
        applyGeneratedImage(generatedImage);
      } else {
        toast.success("Generating a replacement image…");
        await pollForGeneratedImage(previousImage);
      }
    } catch (error) {
      setIsImageRegenerating(false);
      toast.error(error || "Failed to regenerate the food image.");
    }
  };

  const handleCustomRegenerate = () => {
    const prompt = imagePrompt.trim();
    if (!prompt) {
      toast.error("Describe the food image you want to generate.");
      return;
    }
    setIsPromptOpen(false);
    setImagePrompt("");
    handleRegenerateImage(prompt);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = "Food title is required";
    if (!formData.image?.trim()) newErrors.image = "Image URL is required";
    if (formData.protein === "" || formData.protein === null)
      newErrors.protein = "Proteins are required";
    if (formData.carbs === "" || formData.carbs === null)
      newErrors.carbs = "Carbs are required";
    if (formData.calories === "" || formData.calories === null)
      newErrors.calories = "Calories are required";
    if (formData.fats === "" || formData.fats === null)
      newErrors.fats = "Fats are required";
    if (!formData.description?.trim())
      newErrors.description = "Description is required";
    if (!formData.Meal_Type) newErrors.Meal_Type = "Meal Type is required";
    if (!formData.meal_description?.trim())
      newErrors.meal_description = "Meal Instructions are required";
    if (!formData.meal_ingredients?.trim())
      newErrors.meal_ingredients = "Meal Ingredients are required";
    if (formData.Meal_Serving === "" || formData.Meal_Serving === null)
      newErrors.Meal_Serving = "Meal Serving is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    setIsConfirmModalOpen(true);
  };

  const handleConfirmUpdate = () => {
    const payloadData = {
      ...formData,
      protein: Number(formData.protein),
      carbs: Number(formData.carbs),
      calories: Number(formData.calories),
      fats: Number(formData.fats),
      Meal_Serving: Number(formData.Meal_Serving),
    };

    if (!payloadData.image) {
      delete payloadData.image;
    }

    const action = isEdit
      ? updateNutrition({ id, data: payloadData })
      : addNutrition(payloadData);

    dispatch(action)
      .unwrap()
      .then(() => {
        navigate("/admin/data-management/nutrition-food");
      })
      .catch((error) => {
        console.error(
          `Failed to ${isEdit ? "update" : "add"} nutrition:`,
          error,
        );
      })
      .finally(() => {
        setIsConfirmModalOpen(false);
      });
  };

  return (
    <Container>
      <div className="w-full flex flex-col space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading={isEdit ? "Edit Nutrition Food" : "Add Nutrition Food"}
                icon={<Carrot className="w-6 h-6 text-white shrink-0" />}
                variant="primary"
                subheading={
                  isEdit
                    ? "Update existing nutrition food details."
                    : "Add new nutrition food items and recipes."
                }
              />
            </div>

            <div className="flex flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full max-w-max shrink-0 mt-2 sm:mt-4 md:mt-0 xl:mt-0">
              <CTAButton
                icon={ArrowLeft}
                label="Back"
                onClick={() => navigate(-1)}
              />
            </div>
          </div>
        </Header>

        <form onSubmit={handleSubmit} className="w-full min-w-0">
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
                  {formData.image ? (
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(true)}
                      className="w-full h-full block relative"
                      title="View full image"
                    >
                      <img
                        src={formData.image}
                        alt={formData.title || "Food Image"}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/400x400?text=Invalid+Image";
                        }}
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

                  {isEdit && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          aria-label="Generate or replace food image with AI"
                          disabled={isImageRegenerating}
                          className="absolute bottom-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-app-primary2 shadow-md transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isImageRegenerating ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Bot className="h-5 w-5" />
                          )}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-2">
                        <DropdownMenuItem
                          onClick={() => setIsAutoRegenerateOpen(true)}
                          className="cursor-pointer gap-2 text-xs font-medium hover:!bg-app-primary2/10"
                        >
                          <RefreshCcw className="h-4 w-4 text-slate-500" />
                          Auto Regenerate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setIsPromptOpen(true)}
                          className="cursor-pointer gap-2 text-xs font-medium hover:!bg-app-primary2/10"
                        >
                          <Sparkles className="h-4 w-4 text-app-primary2" />
                          Custom Prompt
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {isImageRegenerating && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white/70 px-6 text-center backdrop-blur-sm">
                      <div className="rounded-full bg-white p-4 shadow-lg">
                        <Loader2 className="h-6 w-6 animate-spin text-app-primary2" />
                      </div>
                      <p className="text-xs font-bold text-slate-700">
                        Generating your replacement image…
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 mt-2">
                  <Label htmlFor="image" className="text-xs font-bold text-slate-800 flex items-center gap-1.5 w-max h-5">
                    Image URL
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger type="button" className="cursor-help" onClick={(e) => e.preventDefault()}>
                          <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-slate-800 text-white border-none text-[11px] font-medium px-2.5 py-1.5">
                          Note: Please provide the jpg image URL here
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Enter Image URL"
                    readOnly={isEdit}
                    className={`h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 placeholder:font-normal font-medium ${errors.image ? "border-red-500" : "border-slate-300/60"}`}
                  />
                  {isEdit && (
                    <p className="text-[10px] font-medium text-slate-500">
                      Use the AI button on the image to replace this photo.
                    </p>
                  )}
                  {errors.image && (
                    <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">{errors.image}</p>
                  )}
                </div>
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

              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-semibold text-slate-700">Food Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter Food Title"
                  className={`h-10 text-xs focus-visible:ring-1 focus-visible:ring-app-primary2 placeholder:font-normal placeholder:text-xs ${errors.title ? "border-red-500" : "border-slate-300/60"}`}
                />
                {errors.title && <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="protein" className="text-xs font-semibold text-slate-700">Protein (gm)</Label>
                  <Input id="protein" name="protein" type="number" step="0.01" min="0" value={formData.protein} onChange={handleChange} placeholder="e.g. 25.5" className={`h-10 text-xs border-slate-300/60 placeholder:font-normal placeholder:text-xs ${errors.protein ? "border-red-500" : "border-slate-300/60"}`} />
                  {errors.protein && <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">{errors.protein}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="carbs" className="text-xs font-semibold text-slate-700">Carbs (gm)</Label>
                  <Input id="carbs" name="carbs" type="number" step="0.01" min="0" value={formData.carbs} onChange={handleChange} placeholder="e.g. 45.0" className={`h-10 text-xs border-slate-300/60 placeholder:font-normal placeholder:text-xs ${errors.carbs ? "border-red-500" : "border-slate-300/60"}`} />
                  {errors.carbs && <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">{errors.carbs}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="calories" className="text-xs font-semibold text-slate-700">Calories (kcal)</Label>
                  <Input id="calories" name="calories" type="number" step="0.01" min="0" value={formData.calories} onChange={handleChange} placeholder="e.g. 350" className={`h-10 text-xs border-slate-300/60 placeholder:font-normal placeholder:text-xs ${errors.calories ? "border-red-500" : "border-slate-300/60"}`} />
                  {errors.calories && <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">{errors.calories}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fats" className="text-xs font-semibold text-slate-700">Fats (gm)</Label>
                  <Input id="fats" name="fats" type="number" step="0.01" min="0" value={formData.fats} onChange={handleChange} placeholder="e.g. 12.0" className={`h-10 text-xs border-slate-300/60 placeholder:font-normal placeholder:text-xs ${errors.fats ? "border-red-500" : "border-slate-300/60"}`} />
                  {errors.fats && <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">{errors.fats}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="Meal_Type" className="text-xs font-semibold text-slate-700">Meal Type</Label>
                  <Select
                    key={`meal-type-${formData.Meal_Type}`}
                    value={formData.Meal_Type || undefined}
                    onValueChange={(val) => handleSelectChange(val, "Meal_Type")}
                  >
                    <SelectTrigger className={`h-10 text-xs border-slate-300/60 font-medium placeholder:text-xs ${errors.Meal_Type ? "border-red-500" : "border-slate-300/60"}`}>
                      <SelectValue placeholder="Select Meal Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ingredients">Ingredients</SelectItem>
                      <SelectItem value="recipes">Recipes</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.Meal_Type && <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">{errors.Meal_Type}</p>}
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="Meal_Serving" className="text-xs font-semibold text-slate-700">Meal Serving</Label>
                  <Input id="Meal_Serving" name="Meal_Serving" type="number" min="1" value={formData.Meal_Serving} onChange={handleChange} placeholder="e.g. 2" className={`h-10 text-xs border-slate-300/60 placeholder:font-normal placeholder:text-xs ${errors.Meal_Serving ? "border-red-500" : "border-slate-300/60"}`} />
                  {errors.Meal_Serving && <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">{errors.Meal_Serving}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-semibold text-slate-700">Description</Label>
                <div className="relative">
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description of the meal..."
                    maxLength={500}
                    rows={3}
                    className={`text-xs resize-y border-slate-300/60 placeholder:font-normal placeholder:text-xs p-3 pb-8 ${errors.description ? "border-red-500" : "border-slate-300/60"}`}
                  />
                  <div className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-medium pointer-events-none">
                    {formData.description?.length || 0} / 500
                  </div>
                </div>
                {errors.description && <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">{errors.description}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="meal_ingredients" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 w-max">
                  Ingredients (one per line)
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger type="button" className="cursor-help" onClick={(e) => e.preventDefault()}>
                        <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-slate-800 text-white border-none text-[11px] font-medium px-2.5 py-1.5">
                        Note: Please enter the meal ingredients in list format.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="relative">
                  <Textarea
                    id="meal_ingredients"
                    name="meal_ingredients"
                    value={formData.meal_ingredients}
                    onChange={handleChange}
                    placeholder={"e.g. 1 cup almond milk\n1 banana"}
                    maxLength={1000}
                    rows={4}
                    className={`text-xs resize-y border-slate-300/60 placeholder:font-normal placeholder:text-xs p-3 pb-8 ${errors.meal_ingredients ? "border-red-500" : "border-slate-300/60"}`}
                  />
                  <div className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-medium pointer-events-none">
                    {formData.meal_ingredients?.length || 0} / 1000
                  </div>
                </div>
                {errors.meal_ingredients && <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">{errors.meal_ingredients}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="meal_description" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 w-max">
                  Instructions (one per line)
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger type="button" className="cursor-help" onClick={(e) => e.preventDefault()}>
                        <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-slate-800 text-white border-none text-[11px] font-medium px-2.5 py-1.5">
                        Note: Please enter the meal instructions in list format.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="relative">
                  <Textarea
                    id="meal_description"
                    name="meal_description"
                    value={formData.meal_description}
                    onChange={handleChange}
                    placeholder={"e.g. Blend all ingredients\nServe chilled"}
                    maxLength={1000}
                    rows={4}
                    className={`text-xs resize-y border-slate-300/60 placeholder:font-normal placeholder:text-xs p-3 pb-8 ${errors.meal_description ? "border-red-500" : "border-slate-300/60"}`}
                  />
                  <div className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-medium pointer-events-none">
                    {formData.meal_description?.length || 0} / 1000
                  </div>
                </div>
                {errors.meal_description && <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">{errors.meal_description}</p>}
              </div>

            </div>
          </div>
          
          <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/data-management/nutrition-food")}
              className="w-full sm:w-auto rounded-md px-5 h-10 text-sm sm:text-xs font-semibold border-slate-300/60 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-app-primary2 hover:bg-app-primary3 text-white rounded-md px-5 h-10 flex items-center justify-center gap-2 text-sm sm:text-xs font-semibold transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  {isEdit ? "Updating..." : "Saving..."}
                </>
              ) : (
                <>
                  {isEdit ? "Update" : "Save"}
                  <Save className="w-4 sm:w-4 h-4 sm:h-4 shrink-0" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0">
          {formData.image && (
            <img
              src={formData.image}
              alt={formData.title || "Food Image"}
              className="w-full max-h-[75vh] object-contain bg-slate-50"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/400x400?text=Invalid+Image";
              }}
            />
          )}
          <div className="p-4 space-y-1">
            <p className="text-sm font-semibold text-slate-800">
              {formData.title || "Food Image"}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPromptOpen} onOpenChange={setIsPromptOpen}>
        <DialogContent className="max-w-lg gap-5 bg-white p-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">
              Custom Image Generation
            </h2>
            <p className="text-xs font-medium text-slate-500">
              Describe how the replacement image for {formData.title || "this food"} should look.
            </p>
          </div>
          <Textarea
            value={imagePrompt}
            onChange={(event) => setImagePrompt(event.target.value)}
            placeholder="For example: overhead photo of a fresh grilled chicken salad in natural light"
            maxLength={500}
            className="min-h-28 resize-none text-sm"
          />
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPromptOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCustomRegenerate}
              className="bg-app-primary2 text-white hover:bg-app-primary3"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Image
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={isAutoRegenerateOpen}
        onClose={() => setIsAutoRegenerateOpen(false)}
        onConfirm={() => {
          setIsAutoRegenerateOpen(false);
          handleRegenerateImage();
        }}
        title="Replace Food Image"
        message="Generate a new AI image for this food? The new image will replace the current one."
        confirmText="Regenerate"
        type="brand"
        loading={isImageRegenerating}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmUpdate}
        title={isEdit ? "Confirm Update" : "Confirm Creation"}
        message={
          isEdit
            ? "Are you sure you want to update this nutrition item's details?"
            : "Are you sure you want to create this new nutrition item?"
        }
        confirmText={isEdit ? "Update" : "Create"}
        type="brand"
        loading={loading}
      />
    </Container>
  );
};

export default AddNutritionPage;
