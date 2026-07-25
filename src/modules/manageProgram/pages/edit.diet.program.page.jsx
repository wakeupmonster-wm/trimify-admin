import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Loader2, X, ArrowLeft } from "lucide-react";
import { IoFastFoodOutline } from "react-icons/io5";
import { toast } from "sonner";
import {
  getProgramDuration,
  searchFood,
  updateDietMeal,
  getDietMeals,
} from "../store/diet.slice";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks"];

const EditDietProgramPage = () => {
  const { id, dietId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { dietMeals, programDuration, foodSearchResults, loading } =
    useSelector((state) => state.manageDiet);
  // console.log("dietMeals: ", dietMeals);

  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const [dataLoaded, setDataLoaded] = useState(false);

  const searchTimeoutRef = useRef(null);

  // Fetch duration and meals if necessary
  useEffect(() => {
    if (id) {
      dispatch(getProgramDuration(id));
      if (!dietMeals || dietMeals.length === 0) {
        dispatch(getDietMeals(id));
      }
    }
  }, [dispatch, id, dietMeals.length]);

  // Pre-fill data
  useEffect(() => {
    if (dietMeals && dietMeals.length > 0 && dietId && !dataLoaded) {
      const existing = dietMeals.find((m) => m.id.toString() === dietId);
      if (existing) {
        setSelectedWeek(existing.week ? String(existing.week) : "");
        setSelectedDay(existing.day || "");
        setSelectedMealType(existing.meal || "");
        if (existing.diet_meal_data) {
          setSelectedMeals([
            {
              id: existing.food,
              title:
                existing.diet_meal_data.Meal_title ||
                existing.diet_meal_data.name ||
                "Food Item",
            },
          ]);
        }
        setDataLoaded(true);
      }
    }
  }, [dietMeals, dietId, dataLoaded]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (val.trim()) {
      setIsDropdownOpen(true);
      searchTimeoutRef.current = setTimeout(() => {
        dispatch(searchFood({ query: val }));
      }, 300);
    } else {
      setIsDropdownOpen(false);
    }
  };

  const handleSelectMeal = (meal) => {
    if (!selectedMeals.some((m) => m.id === meal.id)) {
      setSelectedMeals([...selectedMeals, meal]);
      if (errors.selectedMeals)
        setErrors((prev) => ({ ...prev, selectedMeals: "" }));
    }
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  const handleRemoveMeal = (mealId) => {
    setSelectedMeals(selectedMeals.filter((m) => m.id !== mealId));
  };

  const handleUpdateDietMeal = async () => {
    const newErrors = {};
    if (!selectedWeek) newErrors.selectedWeek = "Please select a week.";
    if (!selectedDay) newErrors.selectedDay = "Please select a day.";
    if (!selectedMealType)
      newErrors.selectedMealType = "Please select a meal type.";
    if (selectedMeals.length === 0)
      newErrors.selectedMeals = "Please select at least one food.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      program_id: id,
      week: selectedWeek,
      day: selectedDay,
      food: selectedMeals[0].id,
      meal: selectedMealType,
    };

    const resultAction = await dispatch(
      updateDietMeal({ id: dietId, data: payload }),
    );

    if (updateDietMeal.fulfilled.match(resultAction)) {
      toast.success("Diet meal updated successfully!");
      navigate(-1);
    } else {
      toast.error(resultAction.payload || "Failed to update diet meal.");
    }
  };

  const maxWeeks = programDuration ? parseInt(programDuration, 10) : 8;
  const computedMaxWeeks = Math.max(
    maxWeeks,
    selectedWeek ? parseInt(selectedWeek, 10) : 0,
  );
  const weeksOptions = Array.from(
    { length: computedMaxWeeks },
    (_, i) => i + 1,
  );

  return (
    <Container>
      <div className="w-full flex flex-col space-y-5 sm:space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-row xl:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <PageHeader
                heading="Edit Diet Meal Plan"
                icon={
                  <IoFastFoodOutline className="w-6 h-6 text-white shrink-0" />
                }
                variant="primary"
                subheading="Edit the diet meal details for this plan."
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

        <div className="bg-white rounded-xl shadow-sm border border-slate-300/60 overflow-hidden mx-auto w-full">
          <div className="px-4 sm:px-6 pt-5 pb-6 space-y-4 w-full min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Choose Week */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-800">
                  Choose Week
                </Label>
                <Select
                  value={selectedWeek}
                  onValueChange={(val) => {
                    setSelectedWeek(val);
                    if (errors.selectedWeek)
                      setErrors((prev) => ({ ...prev, selectedWeek: "" }));
                  }}
                >
                  <SelectTrigger className="w-full h-10 px-4 text-sm border border-slate-300/60 rounded-md focus:ring-1 focus:ring-app-primary2 transition-colors bg-white font-medium">
                    <SelectValue placeholder="Select Week" />
                  </SelectTrigger>
                  <SelectContent>
                    {weeksOptions.map((w) => (
                      <SelectItem key={w} value={w.toString()}>
                        Week {w}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.selectedWeek && (
                  <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                    {errors.selectedWeek}
                  </p>
                )}
              </div>

              {/* Choose Day */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-800">
                  Choose Day
                </Label>
                <Select
                  value={selectedDay}
                  onValueChange={(val) => {
                    setSelectedDay(val);
                    if (errors.selectedDay)
                      setErrors((prev) => ({ ...prev, selectedDay: "" }));
                  }}
                >
                  <SelectTrigger className="w-full h-10 px-4 text-sm border border-slate-300/60 rounded-md focus:ring-1 focus:ring-app-primary2 transition-colors bg-white font-medium">
                    <SelectValue placeholder="Select Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.selectedDay && (
                  <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                    {errors.selectedDay}
                  </p>
                )}
              </div>

              {/* Choose Meal Type */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-800">
                  Choose Meal Type
                </Label>
                <Select
                  value={selectedMealType}
                  onValueChange={(val) => {
                    setSelectedMealType(val);
                    if (errors.selectedMealType)
                      setErrors((prev) => ({ ...prev, selectedMealType: "" }));
                  }}
                >
                  <SelectTrigger className="w-full h-10 px-4 text-sm border border-slate-300/60 rounded-md focus:ring-1 focus:ring-app-primary2 transition-colors bg-white font-medium">
                    <SelectValue placeholder="Select Meal" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEAL_TYPES.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.selectedMealType && (
                  <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                    {errors.selectedMealType}
                  </p>
                )}
              </div>

              {/* Search Food / Selected Food */}
              {selectedMeals.length > 0 ? (
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-800">
                    Update New Food
                  </Label>
                  <div className="w-full h-10 px-4 text-sm border border-slate-300/60 rounded-md flex items-center justify-between bg-white font-medium">
                    <span className="truncate">
                      {selectedMeals[0].title ||
                        selectedMeals[0].name ||
                        selectedMeals[0].Meal_title}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => handleRemoveMeal(selectedMeals[0].id)}
                      className="text-slate-400 hover:text-red-500 hover:bg-transparent shrink-0 ml-2 h-6 w-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 relative">
                  <Label className="text-xs font-bold text-slate-800">
                    Search Food
                  </Label>
                  <Input
                    type="text"
                    placeholder="Search Food..."
                    className="w-full h-10 px-4 text-sm border border-slate-300/60 rounded-md focus-visible:ring-1 focus-visible:ring-app-primary2 transition-colors font-medium"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300/60 rounded-md shadow-lg max-h-60 overflow-auto">
                      {loading ? (
                        <div className="p-3 text-sm text-slate-500 text-center">
                          Searching...
                        </div>
                      ) : foodSearchResults && foodSearchResults.length > 0 ? (
                        <ul className="py-1">
                          {foodSearchResults.map((food) => (
                            <li
                              key={food.id}
                              className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm flex items-center justify-between"
                              onClick={() => handleSelectMeal(food)}
                            >
                              <span>
                                {food.title || food.name || food.Meal_title}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-3 text-sm text-slate-500 text-center">
                          No foods found.
                        </div>
                      )}
                    </div>
                  )}
                  {errors.selectedMeals && (
                    <p className="text-red-500 text-[10px] 3xl:text-[11px] mt-1">
                      {errors.selectedMeals}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-slate-100 w-full">
              <Button
                variant="outline"
                className="w-full sm:w-auto rounded-md px-5 h-10 text-xs font-semibold border-slate-300/60 hover:bg-slate-50"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                className="w-full sm:w-auto bg-app-primary2 hover:bg-app-primary3 text-white rounded-md px-6 h-10 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
                onClick={handleUpdateDietMeal}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    Updating...
                  </>
                ) : (
                  <>
                    Update
                    <Save className="w-4 h-4 shrink-0" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default EditDietProgramPage;
