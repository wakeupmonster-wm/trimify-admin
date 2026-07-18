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
import { Save, X, CalendarCheck } from "lucide-react";
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

  console.log("dietMeals: ", dietMeals);

  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    if (dietMeals.length > 0 && dietId && !dataLoaded) {
      const existing = dietMeals.find((m) => m.id.toString() === dietId);
      if (existing) {
        setSelectedWeek(existing.week ? existing.week.toString() : "");
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
    }
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  const handleRemoveMeal = (mealId) => {
    setSelectedMeals(selectedMeals.filter((m) => m.id !== mealId));
  };

  const handleUpdateDietMeal = async () => {
    if (!selectedWeek || !selectedDay || !selectedMealType) {
      toast.error("Please select week, day, and meal type.");
      return;
    }
    if (selectedMeals.length === 0) {
      toast.error("Please select at least one food.");
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

  const weeksOptions = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <Container>
      <div className="space-y-6">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PageHeader
              heading="Edit Diet Meal Plan"
              icon={<CalendarCheck className="w-9 h-9 text-white" />}
              color="bg-app-primary2 shadow-blue-200"
              subheading="Modify the diet meal details for this plan."
            />
          </div>
        </Header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-300/60">
          <div className="px-6 md:px-8 pt-5 pb-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Choose Week */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-800">
                  Choose Week
                </Label>
                <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                  <SelectTrigger className="w-full h-10 px-4 text-sm border border-slate-300/60 rounded-md focus:ring-1 focus:ring-brand-blue transition-colors bg-white font-medium">
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
              </div>

              {/* Choose Day */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-800">
                  Choose Day
                </Label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger className="w-full h-10 px-4 text-sm border border-slate-300/60 rounded-md focus:ring-1 focus:ring-brand-blue transition-colors bg-white font-medium">
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
              </div>

              {/* Choose Meal Type */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-800">
                  Choose Meal Type
                </Label>
                <Select
                  value={selectedMealType}
                  onValueChange={setSelectedMealType}
                >
                  <SelectTrigger className="w-full h-10 px-4 text-sm border border-slate-300/60 rounded-md focus:ring-1 focus:ring-brand-blue transition-colors bg-white font-medium">
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
                    <button
                      onClick={() => handleRemoveMeal(selectedMeals[0].id)}
                      className="text-slate-400 hover:text-red-500 shrink-0 ml-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
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
                    className="w-full h-10 px-4 text-sm border border-slate-300/60 rounded-md focus-visible:ring-1 focus-visible:ring-brand-blue transition-colors font-medium"
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
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <Button
                variant="outline"
                className="rounded-md px-6 py-2.5 h-auto text-xs font-semibold border-slate-300/60"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                className="bg-app-primary2 hover:bg-app-primary5 text-white rounded-md px-6 py-2.5 h-auto text-xs font-semibold flex items-center gap-2 shadow-sm"
                onClick={handleUpdateDietMeal}
                disabled={loading}
              >
                <Save size={16} />
                {loading ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default EditDietProgramPage;
