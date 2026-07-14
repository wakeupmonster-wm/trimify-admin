import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import { Apple, ArrowLeft, Send } from "lucide-react";
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
import { addNutrition } from "../store/nutrition.slice";

const AddNutritionPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      addNutrition({
        ...formData,
        protein: Number(formData.protein),
        carbs: Number(formData.carbs),
        calories: Number(formData.calories),
        fats: Number(formData.fats),
        Meal_Serving: Number(formData.Meal_Serving),
      })
    )
      .unwrap()
      .then(() => {
        navigate("/admin/data-management/nutrition-food");
      })
      .catch((error) => {
        console.error("Failed to add nutrition:", error);
      });
  };

  return (
    <Container>
      <div className="space-y-8">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PageHeader
              heading="Add Food"
              icon={<Apple className="w-9 h-9 text-white" />}
              color="bg-brand-blue shadow-brand-aqua/30"
              subheading="Add new nutrition food items and recipes."
            />

            <Button
              variant="outline"
              onClick={() => navigate("/admin/data-management/nutrition-food")}
              className="w-full md:w-auto flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to List
            </Button>
          </div>
        </Header>

        <div className="bg-white rounded-md shadow-sm border border-slate-300 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-semibold text-slate-700">Food Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter Food Title"
                  className="h-10 text-sm font-normal border-slate-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-xs font-semibold text-slate-700">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Enter Image URL"
                  className="h-10 text-sm font-normal border-slate-300"
                />
                <p className="text-[10px] text-slate-500">Note: Please upload the jpg image here</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="protein" className="text-xs font-semibold text-slate-700">Proteins (gm)</Label>
                <Input
                  id="protein"
                  name="protein"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.protein}
                  onChange={handleChange}
                  placeholder="Enter Proteins"
                  className="h-10 text-sm font-normal border-slate-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="carbs" className="text-xs font-semibold text-slate-700">Carbs (gm)</Label>
                <Input
                  id="carbs"
                  name="carbs"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.carbs}
                  onChange={handleChange}
                  placeholder="Enter Carbs"
                  className="h-10 text-sm font-normal border-slate-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="calories" className="text-xs font-semibold text-slate-700">Calories (kcal)</Label>
                <Input
                  id="calories"
                  name="calories"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.calories}
                  onChange={handleChange}
                  placeholder="Enter Calories"
                  className="h-10 text-sm font-normal border-slate-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fats" className="text-xs font-semibold text-slate-700">Fats (gm)</Label>
                <Input
                  id="fats"
                  name="fats"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.fats}
                  onChange={handleChange}
                  placeholder="Enter Fats"
                  className="h-10 text-sm font-normal border-slate-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-semibold text-slate-700">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter Description"
                className="min-h-[80px] text-sm resize-y font-normal border-slate-300"
              />
              <p className="text-[10px] text-slate-500">Character Count: {formData.description.length}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="Meal_Type" className="text-xs font-semibold text-slate-700">Meal Type</Label>
              <Select 
                value={formData.Meal_Type} 
                onValueChange={(val) => handleSelectChange(val, "Meal_Type")}
                required
              >
                <SelectTrigger className="h-10 text-sm font-normal border-slate-300">
                  <SelectValue placeholder="Select Meal Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ingredients">Ingredients</SelectItem>
                  <SelectItem value="Recipes">Recipes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meal_description" className="text-xs font-semibold text-slate-700">Meal Instructions</Label>
              <Textarea
                id="meal_description"
                name="meal_description"
                value={formData.meal_description}
                onChange={handleChange}
                placeholder="Enter Meal Instructions"
                className="min-h-[100px] text-sm resize-y font-normal border-slate-300"  
              />
              <p className="text-[10px] text-slate-500">
                Character Count: {formData.meal_description.length} Note: Please enter the meal instructions in list format.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meal_ingredients" className="text-xs font-semibold text-slate-700">Meal Ingredients</Label>
              <Textarea
                id="meal_ingredients"
                name="meal_ingredients"
                value={formData.meal_ingredients}
                onChange={handleChange}
                placeholder="Enter ingredients"
                className="min-h-[80px] text-sm resize-y font-normal border-slate-300"
              />
              <p className="text-[10px] text-slate-500">
                Character Count: {formData.meal_ingredients.length} Note: Please enter the meal ingredients in list format.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="Meal_Serving" className="text-xs font-semibold text-slate-700">Meal Serving</Label>
              <Input
                id="Meal_Serving"
                name="Meal_Serving"
                type="number"
                min="1"
                value={formData.Meal_Serving}
                onChange={handleChange}
                placeholder="Enter Meal Serving"
                className="h-10 text-sm font-normal border-slate-300"
                required
              />
            </div>

            <div className="flex justify-center pt-4 border-t">
              <Button
                type="submit"
                disabled={loading}
                className="w-full max-w-sm bg-brand-blue hover:bg-brand-hoverBlue text-white rounded-md h-10 flex items-center justify-center gap-2 font-medium"
              >
                <Send size={16} className="-ml-1" />
                Add Nutrition
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default AddNutritionPage;
