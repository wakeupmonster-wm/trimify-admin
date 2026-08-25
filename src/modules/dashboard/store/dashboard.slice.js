import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dashboardAllAPI } from "../services/dashboard.services";
import {
  toCategoricalPie,
  toLabeledPie,
  buildFunnel,
  buildSecondaryKpis,
  buildAlerts,
} from "../utils/dashboardExtras.transform";
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
    case "custom": default: {
      const from = dateRange?.from ? new Date(dateRange.from) : subDays(new Date(), 7);
      const to = dateRange?.to ? new Date(dateRange.to) : new Date();
      return `${format(from, "MMM dd")} – ${format(to, "dd MMM, yyyy")}`;
    }
  }
}

// ─── Dashboard Data thunk (date-range aware) ───────────────────────────────────
// 🔄 SWAP POINT: When backend is ready, replace getDashboardData() with real API call
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
          fitzoneAssignmentDetails: fitzone?.assignmentDetails || [],
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

const initialState = {
  dashboardExtras: null,
  dashboardMeta: null,
  dateRange: null,
  activities: [],
  extrasLoading: false,
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
      });
  },
});

export const { clearDashboardError, setDashboardDateRange } = dashboardSlice.actions;
export default dashboardSlice.reducer;
