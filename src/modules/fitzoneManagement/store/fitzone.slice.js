import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  getFitzoneManagementAPI,
  addFitzoneAPI,
  updateFitzoneAPI,
  toggleFitzoneStatusAPI,
  deleteFitzoneAPI
} from "../services/fitzone.services";

// Backend TODO: `GET /admin/view-fitzone` should return a `kpis` object
// alongside `fitzones`/`pagination`, aggregated over the FULL table —
// { totalFitzones, activeFitzones, inactiveFitzones, totalSessions }.
// Until the backend sends it, `kpis` stays null and the KPI row on
// FitzoneManagementPage renders a loading placeholder instead of a
// page-local (and therefore wrong) count.

// Fetch List
export const fetchFitzoneList = createAsyncThunk(
  "fitzoneManagement/fetchList",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getFitzoneManagementAPI(params);

      if (response && response.status === "success") {
        return {
          fitzones: response.fitzones || response.data || [],
          kpis: response.kpis || null,
          pagination: {
            page: response.pagination?.current_page || 1,
            limit: 50,
            total: response.pagination?.total || 0,
            totalPages: response.pagination?.last_page || 1,
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

// Add
export const addFitzone = createAsyncThunk(
  "fitzoneManagement/add",
  async (data, { rejectWithValue }) => {
    try {
      const response = await addFitzoneAPI(data);
      if (response && response.status === "success") {
        return response;
      }
      return rejectWithValue(response.message || "Failed to add fitzone");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add fitzone"
      );
    }
  }
);

// Update existing Fitzone
export const updateFitzone = createAsyncThunk(
  "fitzoneManagement/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateFitzoneAPI(id, data);
      
      if (response.status === "success" || response.message) {
        return response.data || data;
      }
      return rejectWithValue(response.message || "Failed to update fitzone");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update fitzone"
      );
    }
  }
);

// Toggle Status
export const toggleFitzoneStatus = createAsyncThunk(
  "fitzoneManagement/toggleStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await toggleFitzoneStatusAPI(id, { status });
      if (response && response.status === "success") {
        return { id, status: response.updated_status || status };
      }
      return rejectWithValue(response.message || "Failed to toggle status");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle status"
      );
    }
  }
);

// Delete
export const deleteFitzone = createAsyncThunk(
  "fitzoneManagement/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteFitzoneAPI(id);
      if (response && response.status === "success") {
        return id;
      }
      return rejectWithValue(response.message || "Failed to delete fitzone");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete fitzone"
      );
    }
  }
);

const fitzoneManagementSlice = createSlice({
  name: "fitzoneManagement",
  initialState: {
    fitzones: [],
    kpis: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 50,
      total: 0,
      totalPages: 1,
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
      // Fetch List
      .addCase(fetchFitzoneList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFitzoneList.fulfilled, (state, action) => {
        state.loading = false;
        state.fitzones = action.payload.fitzones;
        state.kpis = action.payload.kpis;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchFitzoneList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addFitzone.pending, (state) => {
        state.loading = true;
      })
      .addCase(addFitzone.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addFitzone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Fitzone
      .addCase(updateFitzone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFitzone.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.fitzones.findIndex((fz) => fz.id === action.payload.id);
          if (index !== -1) {
            state.fitzones[index] = { ...state.fitzones[index], ...action.payload };
          }
        }
      })
      .addCase(updateFitzone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle Status
      .addCase(toggleFitzoneStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const index = state.fitzones.findIndex((fz) => fz.id === id);
        if (index !== -1) {
          state.fitzones[index].status = status;
        }
      })

      // Delete
      .addCase(deleteFitzone.fulfilled, (state, action) => {
        const id = action.payload;
        state.fitzones = state.fitzones.filter((fz) => fz.id !== id);
        if (state.pagination.total > 0) state.pagination.total -= 1;
      });
  },
});

export const { setPage, clearFitzoneState } = fitzoneManagementSlice.actions;
export default fitzoneManagementSlice.reducer;
