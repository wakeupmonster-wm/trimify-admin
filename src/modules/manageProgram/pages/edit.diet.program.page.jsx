import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Check, X, CalendarCheck } from "lucide-react";
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
        setSelectedWeek(existing.week || "");
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

    const dayNum =
      (parseInt(selectedWeek) - 1) * 7 +
      (DAYS_OF_WEEK.indexOf(selectedDay) + 1);

    const payload = {
      program_id: id,
      day: dayNum,
      meal_ids: selectedMeals.map((m) => m.id),
      meal_type: selectedMealType,
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
      <div className="space-y-8">
        <Header>
          <PageHeader
            heading="Edit Diet Meal Plan"
            icon={<CalendarCheck className="w-9 h-9 text-white" />}
            color="bg-brand-blue shadow-blue-200"
            subheading="Modify the diet meal details for this plan."
          />
        </Header>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mx-auto w-full mb-6">
          <div className="bg-brand-blue text-white px-6 py-4 flex items-center justify-center">
            <h2 className="text-lg font-semibold tracking-wide">
              Edit Diet Meal
            </h2>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {/* Choose Week */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Choose Week
                </label>
                <select
                  className="w-full h-11 px-4 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-colors bg-white appearance-none cursor-pointer"
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                >
                  <option value="" disabled>
                    Select Week
                  </option>
                  {weeksOptions.map((w) => (
                    <option key={w} value={w}>
                      Week {w}
                    </option>
                  ))}
                </select>
              </div>

              {/* Choose Day */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Choose Day
                </label>
                <select
                  className="w-full h-11 px-4 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-colors bg-white appearance-none cursor-pointer"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                >
                  <option value="" disabled>
                    Select Day
                  </option>
                  {DAYS_OF_WEEK.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Choose Meal Type */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Choose Meal Type
                </label>
                <select
                  className="w-full h-11 px-4 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-colors bg-white appearance-none cursor-pointer"
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value)}
                >
                  <option value="" disabled>
                    Select Meal
                  </option>
                  {MEAL_TYPES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Food / Selected Food */}
              {selectedMeals.length > 0 ? (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Update New Food
                  </label>
                  <div className="w-full h-11 px-4 text-sm border border-slate-300 rounded-md flex items-center justify-between bg-white">
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
                <div className="space-y-2 relative">
                  <label className="text-sm font-semibold text-slate-700">
                    Search Food
                  </label>
                  <input
                    type="text"
                    placeholder="Search Food..."
                    className="w-full h-11 px-4 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-colors"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto">
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

            <div className="pb-8 flex justify-center border-b border-slate-100">
              <Button
                className="bg-brand-blue hover:bg-brand-hoverBlue text-white px-8 h-11 text-sm font-semibold shadow-sm w-48"
                onClick={handleUpdateDietMeal}
                disabled={loading}
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? "Updating..." : "Update Diet Meal"}
              </Button>
              <Button
                variant="outline"
                className="ml-4 px-8 h-11 text-sm font-semibold shadow-sm w-48"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default EditDietProgramPage;
