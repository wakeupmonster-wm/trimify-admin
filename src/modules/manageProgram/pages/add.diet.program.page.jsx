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
  addDietMeal,
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

const AddDietProgramPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { programDuration, foodSearchResults, loading } = useSelector(
    (state) => state.manageDiet,
  );

  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeals, setSelectedMeals] = useState([]); // Store array of selected meal objects
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (id) {
      dispatch(getProgramDuration(id));
    }
  }, [dispatch, id]);

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

  const handleAddDietMeal = async () => {
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

    const resultAction = await dispatch(addDietMeal(payload));
    if (addDietMeal.fulfilled.match(resultAction)) {
      toast.success("Diet meal added successfully!");
      navigate(-1);
    } else {
      toast.error(resultAction.payload || "Failed to add diet meal.");
    }
  };

  const weeksOptions = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <Container>
      <div className="w-full flex flex-col space-y-5 sm:space-y-6 min-w-0">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 min-w-0 w-full">
              <PageHeader
                heading="Add Diet Meal Plan"
                icon={<CalendarCheck className="w-6 h-6 text-white shrink-0" />}
                color="bg-app-primary2 shadow-blue-200"
                subheading="Add a new diet meal to this plan."
              />
            </div>
          </div>
        </Header>

        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-300/60 overflow-hidden mx-auto w-full">
          <div className="px-4 sm:px-6 md:px-8 pt-5 pb-6 space-y-6">
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
                    Selected Food
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

            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
              <Button
                variant="outline"
                className="w-full sm:w-auto rounded-md px-6 h-10 text-xs font-semibold border-slate-300/60"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                className="w-full sm:w-auto bg-app-primary2 hover:bg-app-primary5 text-white rounded-md px-6 h-10 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
                onClick={handleAddDietMeal}
                disabled={loading}
              >
                <Save size={16} />
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AddDietProgramPage;
