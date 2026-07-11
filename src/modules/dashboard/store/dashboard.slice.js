import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { advancedDashboardAPI, dashboardKPIAPI } from "../services/dashboard.services";
import { getDashboardData } from "../utils/dummyResponse";

// ─── Existing KPI thunk ────────────────────────────────────────────────────────

export const fetchDashboardKPIs = createAsyncThunk(
  "kpis/fetchDashboardKPIs",
  async (params, { rejectWithValue }) => {
    try {
      // const res = await dashboardKPIAPI(params);

      // if (res.success) {
      //   return res.data.kpis;
      // }
      
      // Return Dummy KPI Data
      const today = new Date();
      const visitorHistory = [];
      for(let i=6; i>=0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        visitorHistory.push({
          date: d.toISOString().split('T')[0],
          android: Math.floor(Math.random() * 500) + 100,
          ios: Math.floor(Math.random() * 300) + 50,
        });
      }

      return {
        visitorHistory,
        activeUsers24h: { value: 1250 }
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server Error");
    }
  },
);

// ─── Dashboard Data thunk (date-range aware) ───────────────────────────────────
// 🔄 SWAP POINT: When backend is ready, replace getDashboardData() with real API call
//    e.g., const res = await dashboardDataAPI(dateRange);

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (dateRange, { rejectWithValue }) => {
    try {
      // const preset = dateRange?.preset;
      // const res = await advancedDashboardAPI(preset, dateRange);
      const res = await getDashboardData(dateRange);

      if (res.success) {
        return { data: res.data, meta: res.meta, dateRange };
      }

      return rejectWithValue("Failed to fetch dashboard data");
    } catch (err) {
      return rejectWithValue(err.message || "Server Error");
    }
  },
);


const initialState = {
  stats: null,
  dashboardData: null,
  dashboardMeta: null,
  dateRange: null,
  activities: [],
  loading: false,
  dashboardLoading: false,
  error: null,
  lastUpdated: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
    setDashboardDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // KPI cases (existing)
      .addCase(fetchDashboardKPIs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardKPIs.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        // state.stats = null;
      })
      .addCase(fetchDashboardKPIs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Dashboard data cases (new)
      .addCase(fetchDashboardData.pending, (state) => {
        state.dashboardLoading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardData = action.payload.data;
        state.dashboardMeta = action.payload.meta;
        state.dateRange = action.payload.dateRange;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboardError, setDashboardDateRange } = dashboardSlice.actions;
export default dashboardSlice.reducer;
