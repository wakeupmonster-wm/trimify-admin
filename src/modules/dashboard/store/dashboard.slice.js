import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  dashboardSummaryAPI,
  dashboardContentChartsAPI,
  dashboardRevenueChartsAPI,
  dashboardEngagementChartsAPI,
  dashboardRecentActivityAPI,
  dashboardConversionFunnelAPI,
  dashboardDemographicsChartsAPI,
  dashboardFitzoneCompletionTrendAPI,
  dashboardAlertsAPI,
} from "../services/dashboard.services";
import {
  getDailyPerformanceAPI,
  getRetentionTrendAPI,
  getExpiringSoonAPI,
  getAbandonedCheckoutsAPI,
} from "@/modules/subscriptionManagement/services/subscription-dashboard.services";
import {
  toCategoricalPie,
  toLabeledPie,
  buildFunnel,
  buildSecondaryKpis,
  buildAlerts,
} from "../utils/dashboardExtras.transform";
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
      for (let i = 6; i >= 0; i--) {
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
      const [
        summaryRes,
        demographicsRes,
        funnelRes,
        engagementRes,
        recentActivityRes,
        dailyPerfRes,
        fitzoneRes,
        retentionRes,
        expiringSoonRes,
        abandonedRes,
        contentRes,
        alertsRes,
      ] = await Promise.allSettled([
        dashboardSummaryAPI(dateRange),
        dashboardDemographicsChartsAPI(),
        dashboardConversionFunnelAPI(dateRange),
        dashboardEngagementChartsAPI(dateRange),
        dashboardRecentActivityAPI(dateRange),
        getDailyPerformanceAPI(),
        dashboardFitzoneCompletionTrendAPI(dateRange),
        getRetentionTrendAPI(),
        getExpiringSoonAPI({ limit: 10 }),
        getAbandonedCheckoutsAPI({ limit: 10 }),
        dashboardContentChartsAPI(dateRange),
        dashboardAlertsAPI(),
      ]);

      const pick = (res) => (res.status === "fulfilled" && res.value?.success ? res.value.data : null);

      const summary = pick(summaryRes);
      const demographics = pick(demographicsRes);
      const funnelData = pick(funnelRes);
      const engagement = pick(engagementRes);
      const recentActivity = pick(recentActivityRes);
      const dailyPerf = pick(dailyPerfRes);
      const fitzone = pick(fitzoneRes);
      const retention = pick(retentionRes);
      const expiringSoon = pick(expiringSoonRes);
      const abandoned = pick(abandonedRes);
      const content = pick(contentRes);
      const alerts = pick(alertsRes);

      return {
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
          activeVsChurned: retention?.retentionTrend || [],
          engagementDAU: engagement?.activeUsersTrend || [],
          fitzoneCompletion: fitzone?.fitzoneStatusTrend || [],
          fitzoneStatuses: fitzone?.statuses || [],
          planRevenue: dailyPerf?.topSellingPlans || [],
          popularPrograms: content?.popularPrograms || [],
        },
        tables: {
          recentTransactions: recentActivity?.recentTransactions || [],
          expiringSoon: expiringSoon?.subscribers || [],
          abandonedCheckouts: abandoned?.checkouts || [],
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
  stats: null,
  dashboardData: null,
  dashboardExtras: null,
  dashboardMeta: null,
  dateRange: null,
  activities: [],
  loading: false,
  dashboardLoading: false,
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
