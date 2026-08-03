import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import { Save, Loader2, ArrowLeft, Carrot, Info } from "lucide-react";
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
import { addNutrition, updateNutrition } from "../store/nutrition.slice";

const AddNutritionPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isEdit = Boolean(id);
  const editData = location.state?.editData || null;
  const { loading } = useSelector((state) => state.nutrition);

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    protein: "",
    carbs: "",
    calories: "",
    fats: "",
    description: "",
    Meal_Type: "",
    meal_description: "",
    meal_ingredients: "",
    Meal_Serving: "",
  });

  const parseArrayToString = (val) => {
    try {
      if (typeof val === "string") {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => item.replace(/\r/g, "")).join("\n");
        }
      }
      return val || "";
    } catch (e) {
      return val || "";
    }
  };

  console.log("editData: ", editData);

  useEffect(() => {
    if (isEdit && editData) {
      // const rawMealType = editData.Meal_Type || editData.meal_type || editData.type || "";
      // let formattedMealType = rawMealType;
      // if (rawMealType.toLowerCase().includes("ingredients")) formattedMealType = "Ingredients";
      // if (rawMealType.toLowerCase().includes("recipes")) formattedMealType = "Recipes";

      setFormData({
        title: editData.Meal_title || editData.title || "",
        image:
          editData.Meal_Image_url && editData.Meal_Image_url !== "none"
            ? editData.Meal_Image_url
            : editData.image || "",
        protein: editData.Meal_Protien_In_gm || editData.protein || "",
        carbs: editData.Meal_Carbs_In_gm || editData.carbs || "",
        calories: editData.Meal_Calories_In_gm || editData.calories || "",
        fats: editData.Meal_Fats_In_gm || editData.fats || "",
        description: editData.Meal_Description || editData.description || "",
        Meal_Type: editData.Meal_Type || editData.meal_type || "",
        meal_description:
          parseArrayToString(editData.Meal_instructions) ||
          editData.meal_description ||
          "",
        meal_ingredients:
          parseArrayToString(editData.Meal_ingredients) ||
          editData.meal_ingredients ||
          "",
        Meal_Serving: editData.Meal_Serving || "",
      });
    }
  }, [isEdit, editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = "Food title is required";
    if (!formData.image?.trim()) newErrors.image = "Image URL is required";
    if (formData.protein === "" || formData.protein === null) newErrors.protein = "Proteins are required";
    if (formData.carbs === "" || formData.carbs === null) newErrors.carbs = "Carbs are required";
    if (formData.calories === "" || formData.calories === null) newErrors.calories = "Calories are required";
    if (formData.fats === "" || formData.fats === null) newErrors.fats = "Fats are required";
    if (!formData.description?.trim()) newErrors.description = "Description is required";
    if (!formData.Meal_Type) newErrors.Meal_Type = "Meal Type is required";
    if (!formData.meal_description?.trim()) newErrors.meal_description = "Meal Instructions are required";
    if (!formData.meal_ingredients?.trim()) newErrors.meal_ingredients = "Meal Ingredients are required";
    if (formData.Meal_Serving === "" || formData.Meal_Serving === null) newErrors.Meal_Serving = "Meal Serving is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

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
              <Button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-slate-50 hover:bg-app-primary2 text-muted-foreground hover:text-white border border-slate-300/80 hover:border-none rounded-md px-2.5 h-10 flex items-center justify-center gap-1 text-xs font-semibold shadow-sm transition-all"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Back</span>
              </Button>
            </div>
          </div>
        </Header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-300/60 mx-auto w-full min-w-0 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="px-4 sm:px-6 pt-5 pb-6 space-y-5 sm:space-y-4 w-full min-w-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1.5">
                <Label
                  htmlFor="title"
                  className="text-xs font-bold text-slate-800 flex items-center h-5"
                >
                  Food Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter Food Title"
                  className={`h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium ${errors.title ? "border-red-500" : "border-slate-300/60"}`}
                />
                {errors.title && (
                  <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="image"
                  className="text-xs font-bold text-slate-800 flex items-center gap-1.5 w-max h-5"
                >
                  Image URL
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger
                        type="button"
                        className="cursor-help"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="bg-slate-800 text-white border-none text-[11px] font-medium px-2.5 py-1.5"
                      >
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
                  className={`h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium ${errors.image ? "border-red-500" : "border-slate-300/60"}`}
                />
                {errors.image && (
                  <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                    {errors.image}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="protein"
                  className="text-xs font-bold text-slate-800 flex items-center h-5"
                >
                  Proteins (gm)
                </Label>
                <Input
                  id="protein"
                  name="protein"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.protein}
                  onChange={handleChange}
                  placeholder="Enter Proteins"
                  className={`h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium ${errors.protein ? "border-red-500" : "border-slate-300/60"}`}
                />
                {errors.protein && (
                  <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                    {errors.protein}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="carbs"
                  className="text-xs font-bold text-slate-800 flex items-center h-5"
                >
                  Carbs (gm)
                </Label>
                <Input
                  id="carbs"
                  name="carbs"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.carbs}
                  onChange={handleChange}
                  placeholder="Enter Carbs"
                  className={`h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium ${errors.carbs ? "border-red-500" : "border-slate-300/60"}`}
                />
                {errors.carbs && (
                  <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                    {errors.carbs}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="calories"
                  className="text-xs font-bold text-slate-800 flex items-center h-5"
                >
                  Calories (kcal)
                </Label>
                <Input
                  id="calories"
                  name="calories"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.calories}
                  onChange={handleChange}
                  placeholder="Enter Calories"
                  className={`h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium ${errors.calories ? "border-red-500" : "border-slate-300/60"}`}
                />
                {errors.calories && (
                  <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                    {errors.calories}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="fats"
                  className="text-xs font-bold text-slate-800 flex items-center h-5"
                >
                  Fats (gm)
                </Label>
                <Input
                  id="fats"
                  name="fats"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.fats}
                  onChange={handleChange}
                  placeholder="Enter Fats"
                  className={`h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium ${errors.fats ? "border-red-500" : "border-slate-300/60"}`}
                />
                {errors.fats && (
                  <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                    {errors.fats}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="description"
                className="text-xs font-bold text-slate-800 flex items-center h-5"
              >
                Description
              </Label>
              <div className="relative">
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter Description"
                  maxLength={500}
                  className={`w-full min-h-[120px] text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium resize-none p-3 pb-8 ${errors.description ? "border-red-500" : "border-slate-300/60"}`}
                />
                <div className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-medium pointer-events-none">
                  {formData.description?.length || 0} / 500
                </div>
              </div>
              {errors.description && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="Meal_Type"
                className="text-xs font-bold text-slate-800 flex items-center h-5"
              >
                Meal Type
              </Label>
              <Select
                // Dynamic key lagane se state change hote hi UI sync ho jayega
                key={`meal-type-${formData.Meal_Type}`}
                value={formData.Meal_Type || undefined}
                onValueChange={(val) => handleSelectChange(val, "Meal_Type")}
              >
                <SelectTrigger
                  className={`h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium ${errors.Meal_Type ? "border-red-500" : "border-slate-300/60"}`}
                >
                  <SelectValue placeholder="Select Meal Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ingredients">Ingredients</SelectItem>
                  <SelectItem value="recipes">Recipes</SelectItem>
                </SelectContent>
              </Select>
              {errors.Meal_Type && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.Meal_Type}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="meal_description"
                className="text-xs font-bold text-slate-800 flex items-center gap-1.5 w-max h-5"
              >
                Meal Instructions
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger
                      type="button"
                      className="cursor-help"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="bg-slate-800 text-white border-none text-[11px] font-medium px-2.5 py-1.5"
                    >
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
                  placeholder="Enter Meal Instructions"
                  maxLength={1000}
                  className={`w-full min-h-[120px] text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium resize-none p-3 pb-8 ${errors.meal_description ? "border-red-500" : "border-slate-300/60"}`}
                />
                <div className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-medium pointer-events-none">
                  {formData.meal_description?.length || 0} / 1000
                </div>
              </div>
              {errors.meal_description && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.meal_description}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="meal_ingredients"
                className="text-xs font-bold text-slate-800 flex items-center gap-1.5 w-max h-5"
              >
                Meal Ingredients
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger
                      type="button"
                      className="cursor-help"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="bg-slate-800 text-white border-none text-[11px] font-medium px-2.5 py-1.5"
                    >
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
                  placeholder="Enter ingredients"
                  maxLength={1000}
                  className={`w-full min-h-[120px] text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium resize-none p-3 pb-8 ${errors.meal_ingredients ? "border-red-500" : "border-slate-300/60"}`}
                />
                <div className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-medium pointer-events-none">
                  {formData.meal_ingredients?.length || 0} / 1000
                </div>
              </div>
              {errors.meal_ingredients && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.meal_ingredients}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="Meal_Serving"
                className="text-xs font-bold text-slate-800 flex items-center h-5"
              >
                Meal Serving
              </Label>
              <Input
                id="Meal_Serving"
                name="Meal_Serving"
                type="number"
                min="1"
                value={formData.Meal_Serving}
                onChange={handleChange}
                placeholder="Enter Meal Serving"
                className={`h-10 text-sm focus-visible:ring-1 focus-visible:ring-app-primary2 font-medium ${errors.Meal_Serving ? "border-red-500" : "border-slate-300/60"}`}
              />
              {errors.Meal_Serving && (
                <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                  {errors.Meal_Serving}
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate("/admin/data-management/nutrition-food")
                }
                className="w-full sm:w-auto rounded-md px-5 h-10 text-sm sm:text-xs font-semibold border-slate-300/60 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-app-primary2 hover:bg-app-primary3 text-white rounded-md px-5 h-10 flex items-center justify-center gap-2 text-sm sm:text-xs font-semibold shadow-sm transition-all"
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
      </div>
    </Container>
  );
};

export default AddNutritionPage;
