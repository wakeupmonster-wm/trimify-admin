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
  searchFoodItemsAPI,
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
            page: response.pagination?.current_page || response.pagination?.page || 1,
            limit: response.pagination?.per_page || 10, 
            total: response.pagination?.total || 0,
            totalPages: response.pagination?.totalPage || response.pagination?.last_page || 1,
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
      const errData = error.response?.data;
      // Laravel validation errors come as { errors: { field: ["msg"] } }
      if (errData?.errors) {
        const firstField = Object.keys(errData.errors)[0];
        const firstMsg = errData.errors[firstField]?.[0];
        if (firstMsg) return rejectWithValue(firstMsg);
      }
      return rejectWithValue(errData?.message || "Failed to add food category");
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
  async ({ programId, categoryId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await getFoodListAPI(programId, categoryId, params);
      if (response && response.status === "success") {
        return {
          foods: response.foods || [],
          pagination: {
            page: response.pagination?.current_page || response.pagination?.page || 1,
            limit: response.pagination?.per_page || 10,
            total: response.pagination?.total || 0,
            totalPages: response.pagination?.totalPage || response.pagination?.last_page || 1,
          },
        };
      }
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

export const searchFoodItems = createAsyncThunk(
  "manageFood/searchFoodItems",
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      // The search endpoint doesn't support a query param, so it always
      // returns the entire food catalog and we filter client-side. Fetch
      // that full list once per session and cache it, instead of re-hitting
      // the network on every keystroke of the (already debounced) search box.
      const cached = getState().manageFood.allFoodsCache;
      let allFoods = cached;
      if (!allFoods) {
        const response = await searchFoodItemsAPI();
        if (!response || response.status === "error" || response.status === false) {
          return rejectWithValue(response?.message || "Failed to search food items");
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
      return rejectWithValue(error.response?.data?.message || "Failed to search food items");
    }
  }
);

const manageFoodSlice = createSlice({
  name: "manageFood",
  initialState: {
    categories: [],
    dropdownCategories: [],
    foodSearchResults: [],
    allFoodsCache: null,
    foods: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    },
    foodsPagination: {
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
        state.foods = action.payload.foods || [];
        state.foodsPagination = action.payload.pagination;
      })
      .addCase(getFoodList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // search food
      .addCase(searchFoodItems.fulfilled, (state, action) => {
        state.foodSearchResults = action.payload.foods || [];
        state.allFoodsCache = action.payload.allFoods;
      })
      // addFoodCategory
      .addCase(addFoodCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFoodCategory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addFoodCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateFoodCategory
      .addCase(updateFoodCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFoodCategory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateFoodCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteFoodCategory
      .addCase(deleteFoodCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFoodCategory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteFoodCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // addFood
      .addCase(addFood.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFood.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addFood.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateFood
      .addCase(updateFood.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFood.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateFood.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteFood
      .addCase(deleteFood.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFood.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteFood.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // toggleFoodStatus
      .addCase(toggleFoodStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFoodStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(toggleFoodStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default manageFoodSlice.reducer;
