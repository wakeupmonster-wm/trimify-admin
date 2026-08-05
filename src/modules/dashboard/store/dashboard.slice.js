import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  dashboardSummaryAPI,
  dashboardContentChartsAPI,
  dashboardRevenueChartsAPI,
  dashboardEngagementChartsAPI,
  dashboardRecentActivityAPI,
  dashboardAllAPI,
} from "../services/dashboard.services";
import {
  toCategoricalPie,
  toLabeledPie,
  buildFunnel,
  buildSecondaryKpis,
  buildAlerts,
} from "../utils/dashboardExtras.transform";
import { getMockDashboardData } from "../utils/mockDashboardData";
import { format, subDays } from "date-fns";

function getGlanceTitle(preset) {
  switch (preset) {
    case "today": return "Today at a glance";
    case "yesterday": return "Yesterday at a glance";
    case "last3": return "Last 3 days at a glance";
    case "last7": return "Last 7 days at a glance";
    case "last30": return "Last 30 days at a glance";
    case "last90": return "Last 90 days at a glance";
    case "thisMonth": return "This month at a glance";
    case "lastMonth": return "Last month at a glance";
    case "custom": default: return "Period at a glance";
  }
}

function getPeriodLabel(dateRange, preset) {
  switch (preset) {
    case "today": return "Today";
    case "yesterday": return "Yesterday";
    case "last3": return "Last 3 Days";
    case "last7": return "Last 7 Days";
    case "last30": return "Last 30 Days";
    case "last90": return "Last 90 Days";
    case "thisMonth": return "This Month";
    case "lastMonth": return "Last Month";
    case "custom": default: {
      const from = dateRange?.from ? new Date(dateRange.from) : subDays(new Date(), 7);
      const to = dateRange?.to ? new Date(dateRange.to) : new Date();
      return `${format(from, "MMM dd")} – ${format(to, "dd MMM, yyyy")}`;
    }
  }
}

// ─── Dashboard Data thunk (date-range aware) ───────────────────────────────────
// 🔄 SWAP POINT: When backend is ready, replace getDashboardData() with real API call
//    e.g., const res = await dashboardDataAPI(dateRange);

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (dateRange, { rejectWithValue }) => {
    try {
      const [summaryRes, contentRes, revenueRes, engagementRes, recentRes] = await Promise.allSettled([
        dashboardSummaryAPI(dateRange),
        dashboardContentChartsAPI(dateRange),
        dashboardRevenueChartsAPI(dateRange),
        dashboardEngagementChartsAPI(dateRange),
        dashboardRecentActivityAPI(dateRange)
      ]);

      return {
        data: {
          summaryData: summaryRes.status === "fulfilled" ? summaryRes.value?.data : null,
          contentChartsData: contentRes.status === "fulfilled" ? contentRes.value?.data : null,
          revenueChartsData: revenueRes.status === "fulfilled" ? revenueRes.value?.data : null,
          engagementChartsData: engagementRes.status === "fulfilled" ? engagementRes.value?.data : null,
          recentActivityData: recentRes.status === "fulfilled" ? recentRes.value?.data : null,
        },
        meta: { dateRange },
        dateRange
      };
    } catch (err) {
      return rejectWithValue(err.message || "Server Error");
    }
  },
);
// ─── Dashboard Extras thunk (secondary KPIs, pie charts, trends, tables, funnel) ──
// Pulls from every real endpoint the widgets below the primary summary need,
// then maps each response into the exact shape those widgets already render
// (see dashboardExtras.transform.js) — components never see the raw payload.
export const fetchDashboardExtras = createAsyncThunk(
  "dashboard/fetchDashboardExtras",
  async (dateRange, { rejectWithValue }) => {
    try {
      const res = await dashboardAllAPI(dateRange);

      if (!res?.success) {
        throw new Error(res?.message || "Failed to fetch dashboard data");
      }

      const { data } = res;

      const summary = data?.summary || {};
      const demographics = data?.demographics || {};
      const funnelData = data?.conversionFunnel || {};
      const engagement = data?.engagement || {};
      const recentActivity = data?.recentActivity || {};
      const fitzone = data?.fitzone || {};
      const content = data?.content || {};
      const alerts = data?.alerts || {};
      const abandoned = data?.abandonedCheckouts || [];

      const preset = dateRange?.preset || "today";

      return {
        title: data?.title || getGlanceTitle(preset),
        meta: res?.meta || {
          dateRange,
          preset,
          periodLabel: getPeriodLabel(dateRange, preset),
        },
        secondaryKpis: buildSecondaryKpis(summary),
        pieCharts: {
          userGoals: demographics?.goalDistribution
            ? toCategoricalPie(demographics.goalDistribution, "main_goal", "total")
            : [],
          gender: demographics?.genderDistribution
            ? toCategoricalPie(demographics.genderDistribution, "gender", "total")
            : [],
          dietPreference: demographics?.vegetarianSplit ? toLabeledPie(demographics.vegetarianSplit) : [],
        },
        trends: {
          engagementDAU: engagement?.activeUsersTrend || [],
          fitzoneCompletion: fitzone?.fitzoneStatusTrend || [],
          fitzoneStatuses: fitzone?.statuses || [],
          popularPrograms: content?.popularPrograms || [],
        },
        tables: {
          recentTransactions: recentActivity?.recentTransactions || [],
          abandonedCheckouts: abandoned || [],
          subAdminRoster: recentActivity?.subAdminRoster || [],
          unassignedUsers: recentActivity?.unassignedUsers ?? null,
          recentNotifications: recentActivity?.recentNotifications || [],
          recentUsers: recentActivity?.recentUsers || [],
        },
        funnel: buildFunnel(funnelData),
        alerts: buildAlerts(alerts),
      };
    } catch (err) {
      return rejectWithValue(err.message || "Server Error");
    }
  },
);

export const fetchMockDashboardData = createAsyncThunk(
  "dashboard/fetchMockDashboardData",
  async (dateRange, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return getMockDashboardData(dateRange);
    } catch (err) {
      return rejectWithValue(err.message || "Server Error");
    }
  }
);

const initialState = {
  dashboardData: null,
  dashboardExtras: null,
  mockData: null,
  dashboardMeta: null,
  dateRange: null,
  activities: [],
  dashboardLoading: false,
  extrasLoading: false,
  mockLoading: false,
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
      // Dashboard data cases
      .addCase(fetchDashboardData.pending, (state) => {
        state.dashboardLoading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardData = action.payload.data;
        state.dashboardMeta = action.payload.meta;
        state.dateRange = action.payload.dateRange;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.error = action.payload;
      })
      // Dashboard extras cases (new)
      .addCase(fetchDashboardExtras.pending, (state) => {
        state.extrasLoading = true;
      })
      .addCase(fetchDashboardExtras.fulfilled, (state, action) => {
        state.extrasLoading = false;
        state.dashboardExtras = action.payload;
        state.dashboardMeta = action.payload.meta;
        state.dateRange = action.payload.meta?.dateRange || state.dateRange;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchDashboardExtras.rejected, (state, action) => {
        state.extrasLoading = false;
        state.error = action.payload;
      })
      // Mock Dashboard data cases (new)
      .addCase(fetchMockDashboardData.pending, (state) => {
        state.mockLoading = true;
      })
      .addCase(fetchMockDashboardData.fulfilled, (state, action) => {
        state.mockLoading = false;
        state.mockData = action.payload.data;
        state.dashboardMeta = action.payload.meta;
        state.dateRange = action.payload.meta.dateRange;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchMockDashboardData.rejected, (state, action) => {
        state.mockLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboardError, setDashboardDateRange } = dashboardSlice.actions;
export default dashboardSlice.reducer;
