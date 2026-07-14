import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getNutritionListAPI } from "../services/nutrition.services";

export const fetchNutritionList = createAsyncThunk(
  "dataManagement/fetchNutritionList",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getNutritionListAPI(params);

      if (response && response.status === "success") {
        return {
          nutrition: response.nutrition || [],
        };
      }
      return rejectWithValue(response?.message || "Failed to fetch nutrition data");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch nutrition data"
      );
    }
  }
);

const nutritionSlice = createSlice({
  name: "nutritionManagement",
  initialState: {
    nutrition: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearNutritionState: (state) => {
      state.nutrition = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNutritionList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNutritionList.fulfilled, (state, action) => {
        state.loading = false;
        state.nutrition = action.payload.nutrition;
      })
      .addCase(fetchNutritionList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearNutritionState } = nutritionSlice.actions;
export default nutritionSlice.reducer;
