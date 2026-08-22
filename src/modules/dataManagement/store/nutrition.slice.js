import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getNutritionListAPI,
  addNutritionAPI,
  updateNutritionAPI,
  deleteNutritionAPI,
  uploadNutritionAPI,
  regenerateNutritionImageAPI,
  regenerateNutritionImageAudioAPI,
} from "../services/nutrition.services";

// Fetch List
export const fetchNutritionList = createAsyncThunk(
  "nutrition/fetchList",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getNutritionListAPI(params);
      if (response && response.status === "success") {
        return {
          nutrition: response.nutrition || [],
          pagination: {
            page: response.pagination?.current_page || 1,
            limit: 10,
            total: response.pagination?.total || 0,
            totalPages: response.pagination?.last_page || 1,
          },
        };
      }
      return rejectWithValue("Failed to fetch nutrition data");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch nutrition data"
      );
    }
  }
);

// Add
export const addNutrition = createAsyncThunk(
  "nutrition/add",
  async (data, { rejectWithValue }) => {
    try {
      const response = await addNutritionAPI(data);
      if (response && response.status === "success") {
        return response;
      }
      return rejectWithValue(response?.message || "Failed to add nutrition");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add nutrition"
      );
    }
  }
);

// Update
export const updateNutrition = createAsyncThunk(
  "nutrition/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateNutritionAPI(id, data);
      if (response && response.status === "success") {
        return response;
      }
      return rejectWithValue(response?.message || "Failed to update nutrition");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update nutrition"
      );
    }
  }
);

export const regenerateNutritionImage = createAsyncThunk(
  "nutrition/regenerateImage",
  async ({ id, imagePrompt }, { rejectWithValue }) => {
    try {
      const response = await regenerateNutritionImageAPI(id, imagePrompt);
      if (response && (response.status === "success" || response.success)) {
        return response;
      }
      return rejectWithValue(response?.message || "Failed to regenerate image");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to regenerate image",
      );
    }
  },
);

export const regenerateNutritionImageFromAudio = createAsyncThunk(
  "nutrition/regenerateImageFromAudio",
  async ({ id, audioBlob }, { rejectWithValue }) => {
    try {
      const response = await regenerateNutritionImageAudioAPI(id, audioBlob);
      if (response && (response.status === "success" || response.success)) {
        return response;
      }
      return rejectWithValue(
        response?.message || "Failed to regenerate image from audio",
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to regenerate image from audio",
      );
    }
  },
);

export const deleteNutrition = createAsyncThunk(
  "nutrition/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteNutritionAPI(id);
      if (response && (response.status === "success" || response.success)) {
        return id;
      }
      return rejectWithValue(response?.message || "Failed to remove nutrition");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove nutrition",
      );
    }
  },
);

// Upload (Bulk)
export const uploadNutrition = createAsyncThunk(
  "nutrition/upload",
  async (data, { rejectWithValue }) => {
    try {
      const response = await uploadNutritionAPI(data);
      if (response && response.status === "success") {
        return response;
      }
      return rejectWithValue(response?.message || "Failed to upload nutrition");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload nutrition"
      );
    }
  }
);

const initialState = {
  nutrition: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
};

const nutritionSlice = createSlice({
  name: "nutrition",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchNutritionList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNutritionList.fulfilled, (state, action) => {
        state.loading = false;
        state.nutrition = action.payload.nutrition;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchNutritionList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add
      .addCase(addNutrition.pending, (state) => {
        state.loading = true;
      })
      .addCase(addNutrition.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addNutrition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update
      .addCase(updateNutrition.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateNutrition.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateNutrition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Upload
      .addCase(uploadNutrition.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadNutrition.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadNutrition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default nutritionSlice.reducer;
