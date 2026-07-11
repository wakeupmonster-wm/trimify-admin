import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFitzoneManagementAPI } from "../services/fitzone.services";

// Async Thunk for getting the fitzone list
export const fetchFitzoneList = createAsyncThunk(
  "fitzoneManagement/fetchList",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getFitzoneManagementAPI(params);

      if (response && response.success) {
        return {
          fitzones: response.data || response.fitzones || [],
          pagination: response.pagination || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          },
        };
      }
      return rejectWithValue(response.message || "Failed to fetch fitzones");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch fitzones"
      );
    }
  }
);

const fitzoneManagementSlice = createSlice({
  name: "fitzoneManagement",
  initialState: {
    fitzones: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  },
  reducers: {
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearFitzoneState: (state) => {
      state.fitzones = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFitzoneList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFitzoneList.fulfilled, (state, action) => {
        state.loading = false;
        state.fitzones = action.payload.fitzones;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchFitzoneList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, clearFitzoneState } = fitzoneManagementSlice.actions;
export default fitzoneManagementSlice.reducer;
