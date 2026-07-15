import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFitzoneCategoriesAPI,
  addFitzoneCategoryAPI,
  updateFitzoneCategoryAPI,
  deleteFitzoneCategoryAPI,
} from "../services/fitzone.category.services";

export const getFitzoneCategories = createAsyncThunk(
  "fitzoneCategory/getFitzoneCategories",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getFitzoneCategoriesAPI(id);
      if (response && response.status === "success") {
         return {
          category: response.category || [],
          pagination: {
            page: response.pagination?.current_page || 1,
            limit: response.pagination?.per_page || 10,
            total: response.pagination?.total || 0,
            totalPages: response.pagination?.last_page || 1,
          },
        }
      }
      return rejectWithValue(response.message || "Failed to fetch categories");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories",
      );
    }
  },
);

export const addFitzoneCategory = createAsyncThunk(
  "fitzoneCategory/addFitzoneCategory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await addFitzoneCategoryAPI(data);
      if (response && response.status === "success") return response;
      return rejectWithValue(response.message || "Failed to add category");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add category",
      );
    }
  },
);

export const updateFitzoneCategory = createAsyncThunk(
  "fitzoneCategory/updateFitzoneCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateFitzoneCategoryAPI(id, data);
      if (response && response.status === "success") return response;
      return rejectWithValue(response.message || "Failed to update category");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update category",
      );
    }
  },
);

export const deleteFitzoneCategory = createAsyncThunk(
  "fitzoneCategory/deleteFitzoneCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteFitzoneCategoryAPI(id);
      if (response && response.status === "success") return response;
      return rejectWithValue(response.message || "Failed to delete category");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete category",
      );
    }
  },
);

const fitzoneCategorySlice = createSlice({
  name: "fitzoneCategory",
  initialState: {
    categories: [],
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
      .addCase(getFitzoneCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFitzoneCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.category;
        state.pagination = action.payload.pagination;
      })
      .addCase(getFitzoneCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default fitzoneCategorySlice.reducer;
