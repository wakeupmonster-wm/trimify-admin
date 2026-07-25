import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDietMealsAPI,
  addDietMealAPI,
  updateDietMealAPI,
  deleteDietMealAPI,
  getProgramDurationAPI,
  searchFoodAPI,
  toggleDietMealStatusAPI,
} from "../services/diet.services";

// ──────────────── Diet Meals ────────────────

export const getDietMeals = createAsyncThunk(
  "manageDiet/getDietMeals",
  async (arg, { rejectWithValue }) => {
    try {
      const id = typeof arg === "object" && arg !== null ? arg.id : arg;
      const params = typeof arg === "object" && arg !== null ? arg.params : {};
      const response = await getDietMealsAPI(id, params);
      if (response && response.status !== "error" && response.status !== false) {
        return {
          diet: response.diet || [],
          pagination: {
            page: response.pagination?.current_page || 1,
            limit: response.pagination?.per_page || 10,
            total: response.pagination?.total || 0,
            totalPages: response.pagination?.last_page || 1,
          },
        }
      }
      return rejectWithValue(response.message || "Failed to fetch diet meals");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch diet meals");
    }
  }
);

export const addDietMeal = createAsyncThunk(
  "manageDiet/addDietMeal",
  async (data, { rejectWithValue }) => {
    try {
      const response = await addDietMealAPI(data);
      if (response && response.status !== "error" && response.status !== false) return response;
      return rejectWithValue(response.message || "Failed to assign meals");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to assign meals");
    }
  }
);

export const updateDietMeal = createAsyncThunk(
  "manageDiet/updateDietMeal",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateDietMealAPI(id, data);
      if (response && response.status !== "error" && response.status !== false) return response;
      return rejectWithValue(response.message || "Failed to update diet meal");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update diet meal");
    }
  }
);

export const deleteDietMeal = createAsyncThunk(
  "manageDiet/deleteDietMeal",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteDietMealAPI(id);
      if (response && response.status !== "error" && response.status !== false) return id;
      return rejectWithValue(response.message || "Failed to delete diet meal");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete diet meal");
    }
  }
);

export const toggleDietMealStatus = createAsyncThunk(
  "manageDiet/toggleDietMealStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await toggleDietMealStatusAPI(id, { status });
      if (response && response.status !== "error" && response.status !== false) return { id, status };
      return rejectWithValue(response.message || "Failed to toggle diet meal status");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to toggle diet meal status");
    }
  }
);

// ──────────────── Duration & Utilities ────────────────

export const getProgramDuration = createAsyncThunk(
  "manageDiet/getProgramDuration",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getProgramDurationAPI(id);
      if (response && response.status !== "error" && response.status !== false) {
        return response.duration;
      }
      return rejectWithValue(response.message || "Failed to fetch duration");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch duration");
    }
  }
);

export const searchFood = createAsyncThunk(
  "manageDiet/searchFood",
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      // The search endpoint doesn't support a query param, so it always
      // returns the entire food catalog and we filter client-side. Fetch
      // that full list once per session and cache it, instead of re-hitting
      // the network on every keystroke of the (already debounced) search box.
      const cached = getState().manageDiet.allFoodsCache;
      let allFoods = cached;
      if (!allFoods) {
        const response = await searchFoodAPI();
        if (!response || response.status === "error" || response.status === false) {
          return rejectWithValue(response?.message || "Failed to search food");
        }
        allFoods = response.searchfood || response.data || [];
      }

      let foods = allFoods;
      if (params.query) {
        const lowerQuery = params.query.toLowerCase();
        foods = foods.filter((f) => {
          const foodName = f.title || f.name || f.Meal_title || "";
          return foodName.toLowerCase().includes(lowerQuery);
        });
      }
      return { foods, allFoods };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to search food");
    }
  }
);

const manageDietSlice = createSlice({
  name: "manageDiet",
  initialState: {
    dietMeals: [],
    programDuration: 0,
    foodSearchResults: [],
    allFoodsCache: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get diet meals
      .addCase(getDietMeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDietMeals.fulfilled, (state, action) => {
        state.loading = false;
        state.dietMeals = action.payload.diet || [];
        state.pagination = action.payload.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
        };
      })
      .addCase(getDietMeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // get duration
      .addCase(getProgramDuration.fulfilled, (state, action) => {
        state.programDuration = action.payload || 0;
      })
      // search food
      .addCase(searchFood.fulfilled, (state, action) => {
        state.foodSearchResults = action.payload.foods || [];
        state.allFoodsCache = action.payload.allFoods;
      });
  },
});

export default manageDietSlice.reducer;
