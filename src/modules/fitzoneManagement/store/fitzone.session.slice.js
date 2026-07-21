import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFitzoneSessionsAPI,
  addFitzoneSessionAPI,
  updateFitzoneSessionAPI,
  toggleFitzoneSessionStatusAPI,
  deleteFitzoneSessionAPI,
} from "../services/fitzone.session.services";

export const getFitzoneSessions = createAsyncThunk(
  "fitzoneSession/getFitzoneSessions",
  async ({ id, page, limit, search }, { rejectWithValue }) => {
    try {
      const response = await getFitzoneSessionsAPI(id, { page, limit, search });
      if (response && response.status === "success") {
         return {
          fitzone: response.fitzone || [],
          pagination: {
            page: response.pagination?.current_page || 1,
            limit: response.pagination?.per_page || 10,
            total: response.pagination?.total || 0,
            totalPages: response.pagination?.last_page || 1,
          },
        }
      }
      return rejectWithValue(response.message || "Failed to fetch sessions");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sessions",
      );
    }
  },
);

export const addFitzoneSession = createAsyncThunk(
  "fitzoneSession/addFitzoneSession",
  async (data, { rejectWithValue }) => {
    try {
      const response = await addFitzoneSessionAPI(data);
      if (response && response.status === "success") return response;
      return rejectWithValue(response.message || "Failed to add session");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add session",
      );
    }
  },
);

export const updateFitzoneSession = createAsyncThunk(
  "fitzoneSession/updateFitzoneSession",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateFitzoneSessionAPI(id, data);
      if (response && response.status === "success") return response;
      return rejectWithValue(response.message || "Failed to update session");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update session",
      );
    }
  },
);

export const toggleFitzoneSessionStatus = createAsyncThunk(
  "fitzoneSession/toggleFitzoneSessionStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await toggleFitzoneSessionStatusAPI(id, status);
      if (response && response.status === "success") return response;
      return rejectWithValue(
        response.message || "Failed to toggle session status",
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle session status",
      );
    }
  },
);

export const deleteFitzoneSession = createAsyncThunk(
  "fitzoneSession/deleteFitzoneSession",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteFitzoneSessionAPI(id);
      if (response && response.status === "success") return response;
      return rejectWithValue(response.message || "Failed to delete session");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete session",
      );
    }
  },
);

const fitzoneSessionSlice = createSlice({
  name: "fitzoneSession",
  initialState: {
    sessions: [],
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
      .addCase(getFitzoneSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFitzoneSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload.fitzone;
        state.pagination = action.payload.pagination
      })
      .addCase(getFitzoneSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default fitzoneSessionSlice.reducer;
