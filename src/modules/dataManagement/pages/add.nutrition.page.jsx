import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import { Apple, Save, Loader2 } from "lucide-react";
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

  useEffect(() => {
    if (isEdit && editData) {
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
        Meal_Type: editData.Meal_Type || "",
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

    const payloadData = {
      ...formData,
      protein: Number(formData.protein),
      carbs: Number(formData.carbs),
      calories: Number(formData.calories),
      fats: Number(formData.fats),
      Meal_Serving: Number(formData.Meal_Serving),
    };

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
      <div className="w-full flex flex-col space-y-5 sm:space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading={isEdit ? "Edit Food" : "Add Food"}
                icon={<Apple className="w-6 h-6 text-white shrink-0" />}
                color="bg-app-primary2 shadow-brand-blue"
                subheading={
                  isEdit
                    ? "Update existing nutrition food details."
                    : "Add new nutrition food items and recipes."
                }
              />
            </div>
          </div>
        </Header>

        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-300/60 mx-auto w-full min-w-0 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="px-4 sm:px-6 md:px-8 pt-5 pb-6 space-y-5 sm:space-y-6 w-full min-w-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1.5">
                <Label
                  htmlFor="title"
                  className="text-xs font-bold text-slate-800"
                >
                  Food Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter Food Title"
                  className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300/60"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="image"
                  className="text-xs font-bold text-slate-800"
                >
                  Image URL
                </Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Enter Image URL"
                  className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300/60"
                />
                <p className="text-[10px] text-slate-500 font-medium">
                  Note: Please provide the jpg image URL here
                </p>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="protein"
                  className="text-xs font-bold text-slate-800"
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
                  className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300/60"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="carbs"
                  className="text-xs font-bold text-slate-800"
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
                  className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300/60"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="calories"
                  className="text-xs font-bold text-slate-800"
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
                  className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300/60"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="fats"
                  className="text-xs font-bold text-slate-800"
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
                  className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300/60"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="description"
                className="text-xs font-bold text-slate-800"
              >
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter Description"
                className="min-h-[120px] text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300/60 resize-none p-3"
              />
              <div className="text-[10px] text-slate-500 font-medium">
                Character Count: {formData.description?.length || 0}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="Meal_Type"
                className="text-xs font-bold text-slate-800"
              >
                Meal Type
              </Label>
              <Select
                value={formData.Meal_Type}
                onValueChange={(val) => handleSelectChange(val, "Meal_Type")}
                required
              >
                <SelectTrigger className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300/60">
                  <SelectValue placeholder="Select Meal Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ingredients">Ingredients</SelectItem>
                  <SelectItem value="Recipes">Recipes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="meal_description"
                className="text-xs font-bold text-slate-800"
              >
                Meal Instructions
              </Label>
              <Textarea
                id="meal_description"
                name="meal_description"
                value={formData.meal_description}
                onChange={handleChange}
                placeholder="Enter Meal Instructions"
                className="min-h-[120px] text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300/60 resize-none p-3"
              />
              <div className="text-[10px] text-slate-500 font-medium">
                Character Count: {formData.meal_description?.length || 0}. Note:
                Please enter the meal instructions in list format.
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="meal_ingredients"
                className="text-xs font-bold text-slate-800"
              >
                Meal Ingredients
              </Label>
              <Textarea
                id="meal_ingredients"
                name="meal_ingredients"
                value={formData.meal_ingredients}
                onChange={handleChange}
                placeholder="Enter ingredients"
                className="min-h-[120px] text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300/60 resize-none p-3"
              />
              <div className="text-[10px] text-slate-500 font-medium">
                Character Count: {formData.meal_ingredients?.length || 0}. Note:
                Please enter the meal ingredients in list format.
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="Meal_Serving"
                className="text-xs font-bold text-slate-800"
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
                className="h-10 text-sm focus-visible:ring-1 focus-visible:ring-brand-blue font-medium border-slate-300/60"
                required
              />
            </div>

            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-slate-100 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate("/admin/data-management/nutrition-food")
                }
                className="w-full sm:w-auto rounded-md px-6 h-10 text-sm sm:text-xs font-semibold border-slate-300/60 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-app-primary2 hover:bg-app-primary5 text-white rounded-md px-6 h-10 flex items-center justify-center gap-2 text-sm sm:text-xs font-semibold shadow-sm transition-all"
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
