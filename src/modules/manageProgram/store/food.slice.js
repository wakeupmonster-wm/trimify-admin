import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFoodCategoriesAPI,
  getFoodCategoriesDropAPI,
  addFoodCategoryAPI,
  updateFoodCategoryAPI,
  deleteFoodCategoryAPI,
  getFoodListAPI,
  addFoodAPI,
  updateFoodAPI,
  toggleFoodStatusAPI,
  deleteFoodAPI,
} from "../services/food.services";

// ──────────────── Food Categories ────────────────

export const getFoodCategories = createAsyncThunk(
  "manageFood/getCategories",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getFoodCategoriesAPI(params);
     if (response && response.status === "success") {
        return {
          foodcategories: response.foodcategories || [],
          pagination: {
            page: response.pagination?.current_page || 1,
            limit: response.pagination?.per_page || 10,
            total: response.pagination?.total || 0,
            totalPages: response.pagination?.last_page || 1,
          },
        };
      }
      return rejectWithValue(response.message || "Failed to fetch food categories");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch food categories");
    }
  }
);

export const getFoodCategoriesDrop = createAsyncThunk(
  "manageFood/getFoodCategoriesDrop",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFoodCategoriesDropAPI();
      if (response && response.status === "success") {
        return response.foodcategories || response.data || [];
      }
      return rejectWithValue(response.message || "Failed to fetch categories drop");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch categories drop");
    }
  }
);

export const addFoodCategory = createAsyncThunk(
  "manageFood/addCategory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await addFoodCategoryAPI(data);
      if (response && response.status !== "error" && response.status !== false) return response;
      return rejectWithValue(response.message || "Failed to add food category");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add food category");
    }
  }
);

export const updateFoodCategory = createAsyncThunk(
  "manageFood/updateCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateFoodCategoryAPI(id, data);
      if (response && response.status !== "error" && response.status !== false) return response;
      return rejectWithValue(response.message || "Failed to update food category");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update food category");
    }
  }
);

export const deleteFoodCategory = createAsyncThunk(
  "manageFood/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteFoodCategoryAPI(id);
      if (response && response.status !== "error" && response.status !== false) return id;
      return rejectWithValue(response.message || "Failed to delete food category");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete food category");
    }
  }
);

// ──────────────── Food Items ────────────────

export const getFoodList = createAsyncThunk(
  "manageFood/getFoodList",
  async ({ programId, categoryId }, { rejectWithValue }) => {
    try {
      const response = await getFoodListAPI(programId, categoryId);
      if (response && response.status === "success") return response.foods;
      return rejectWithValue(response.message || "Failed to fetch foods");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch foods");
    }
  }
);

export const addFood = createAsyncThunk(
  "manageFood/addFood",
  async (data, { rejectWithValue }) => {
    try {
      const response = await addFoodAPI(data);
      if (response && response.status !== "error" && response.status !== false) return response;
      return rejectWithValue(response.message || "Failed to add food");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add food");
    }
  }
);

export const updateFood = createAsyncThunk(
  "manageFood/updateFood",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateFoodAPI(id, data);
      if (response && response.status !== "error" && response.status !== false) return response;
      return rejectWithValue(response.message || "Failed to update food");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update food");
    }
  }
);

export const toggleFoodStatus = createAsyncThunk(
  "manageFood/toggleFoodStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await toggleFoodStatusAPI(id, { status });
      if (response && response.status !== "error" && response.status !== false) return { id, status };
      return rejectWithValue(response.message || "Failed to toggle status");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to toggle status");
    }
  }
);

export const deleteFood = createAsyncThunk(
  "manageFood/deleteFood",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteFoodAPI(id);
      if (response && response.status !== "error" && response.status !== false) return id;
      return rejectWithValue(response.message || "Failed to delete food");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete food");
    }
  }
);

const manageFoodSlice = createSlice({
  name: "manageFood",
  initialState: {
    categories: [],
    dropdownCategories: [],
    foods: [],
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
      // get categories
      .addCase(getFoodCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFoodCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.foodcategories || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getFoodCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // get categories drop
      .addCase(getFoodCategoriesDrop.fulfilled, (state, action) => {
        state.dropdownCategories = action.payload || [];
      })
      // get foods
      .addCase(getFoodList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFoodList.fulfilled, (state, action) => {
        state.loading = false;
        state.foods = action.payload || [];
      })
      .addCase(getFoodList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      // ... Add/Update/Delete cases just set loading true/false/error in typical patterns
      // but to save boilerplate we rely on refetching lists after successful mutations.
  },
});

export default manageFoodSlice.reducer;
