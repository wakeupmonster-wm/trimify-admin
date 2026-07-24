import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getSubscriptionOverviewAPI,
  getSubscriptionChartsAPI,
  getDailyPerformanceAPI,
  getSubscribersAPI,
  manageSubscriberAPI,
  getTransactionsAPI,
  revokeTransactionAPI,
  exportTransactionsAPI,
  getRetentionTrendAPI,
  getExpiringSoonAPI,
} from "../services/subscription-dashboard.services";
// Reused from the main Dashboard module — "Users by Plan Type" / "Transaction
// Status" pies and the Churn / Failed Transactions KPIs moved here from the
// main Dashboard, so they need the same source endpoints + transforms.
import { dashboardSummaryAPI, dashboardRevenueChartsAPI, dashboardRecentActivityAPI } from "@/modules/dashboard/services/dashboard.services";
import { toCategoricalPie, toTransactionHealthPie } from "@/modules/dashboard/utils/dashboardExtras.transform";

// Shape B envelope: { success: true|false, message, data }

export const fetchOverview = createAsyncThunk(
  "subscriptionDashboard/fetchOverview",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSubscriptionOverviewAPI();
      if (response?.success) return response.data;
      return rejectWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCharts = createAsyncThunk(
  "subscriptionDashboard/fetchCharts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getSubscriptionChartsAPI(params);
      if (response?.success) return response.data;
      return rejectWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Pulls the pieces that moved over from the main Dashboard: plan-type /
// transaction-status pies (from revenue-charts) and Churn / Failed
// Transactions counts (from dashboard summary). Range-aware, same as fetchCharts.
export const fetchDashboardExtrasForSubscription = createAsyncThunk(
  "subscriptionDashboard/fetchDashboardExtras",
  async (dateRange, { rejectWithValue }) => {
    try {
      const [summaryRes, revenueRes, retentionRes, recentRes, expiringRes] = await Promise.allSettled([
        dashboardSummaryAPI(dateRange),
        dashboardRevenueChartsAPI(dateRange),
        getRetentionTrendAPI(dateRange),
        dashboardRecentActivityAPI(dateRange),
        getExpiringSoonAPI({ limit: 10 }),
      ]);
      const summary = summaryRes.status === "fulfilled" && summaryRes.value?.success ? summaryRes.value.data : null;
      const revenue = revenueRes.status === "fulfilled" && revenueRes.value?.success ? revenueRes.value.data : null;
      const retention = retentionRes.status === "fulfilled" && retentionRes.value?.success ? retentionRes.value.data : null;
      const recentActivity = recentRes.status === "fulfilled" && recentRes.value?.success ? recentRes.value.data : null;
      const expiringSoon = expiringRes.status === "fulfilled" && expiringRes.value?.success ? expiringRes.value.data : null;

      return {
        totalRevenue: summary?.totalRevenueAllTime || 0,
        churn: { count: summary?.churnCount || 0, rate: `${summary?.churnRate ?? 0}%` },
        failedTransactions: { count: summary?.failedTransactions || 0 },
        refundedTransactions: { count: summary?.refundedTransactions || 0, amount: summary?.refundedAmount || 0 },
        disputedTransactions: { count: summary?.disputedTransactions || 0 },
        expiringSoonCount: summary?.expiringSoonCount || 0,
        pieCharts: {
          planType: revenue?.planWiseSubscribers ? toCategoricalPie(revenue.planWiseSubscribers, "title", "total") : [],
          txStatus: revenue?.transactionStatus
            ? toTransactionHealthPie(revenue.transactionStatus, summary?.refundedTransactions, summary?.disputedTransactions)
            : [],
        },
        trends: {
          activeVsChurned: retention?.retentionTrend || [],
        },
        tables: {
          recentTransactions: recentActivity?.recentTransactions || [],
          expiringSoon: expiringSoon?.subscribers || [],
        },
      };
    } catch (err) {
      return rejectWithValue(err.message || "Server Error");
    }
  }
);

export const fetchDailyPerformance = createAsyncThunk(
  "subscriptionDashboard/fetchDailyPerformance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDailyPerformanceAPI();
      if (response?.success) return response.data;
      return rejectWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSubscribers = createAsyncThunk(
  "subscriptionDashboard/fetchSubscribers",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getSubscribersAPI(params);
      if (response?.success) return response.data;
      return rejectWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Manage endpoint clears the backend's overview/summary cache on success, so we
// re-fetch overview here rather than waiting out its 30s TTL.
export const manageSubscriber = createAsyncThunk(
  "subscriptionDashboard/manageSubscriber",
  async ({ id, ...body }, { rejectWithValue, dispatch }) => {
    try {
      const response = await manageSubscriberAPI(id, body);
      if (response?.success) {
        dispatch(fetchOverview());
        return { id };
      }
      return rejectWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  "subscriptionDashboard/fetchTransactions",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getTransactionsAPI(params);
      if (response?.success) return response.data;
      return rejectWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const revokeTransaction = createAsyncThunk(
  "subscriptionDashboard/revokeTransaction",
  async ({ id, ...body }, { rejectWithValue }) => {
    try {
      const response = await revokeTransactionAPI(id, body);
      if (response?.success) {
        return { id };
      }
      return rejectWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const exportTransactions = createAsyncThunk(
  "subscriptionDashboard/exportTransactions",
  async (params, { rejectWithValue }) => {
    try {
      const blob = await exportTransactionsAPI(params);
      return blob;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  overview: null,
  overviewLoading: false,
  overviewError: null,

  charts: null,
  chartsLoading: false,
  chartsError: null,
  chartsRequestId: null,

  dashboardExtras: null,
  dashboardExtrasLoading: false,
  dashboardExtrasError: null,
  dashboardExtrasRequestId: null,

  dailyPerformance: null,
  dailyPerformanceLoading: false,
  dailyPerformanceError: null,

  subscribers: [],
  subscribersCounts: { total: 0, active: 0, expired: 0, revoked: 0 },
  subscribersPagination: null,
  subscribersLoading: false,
  subscribersError: null,
  subscribersRequestId: null,

  manageLoading: false,
  manageError: null,

  transactions: [],
  transactionsSummary: { grossRevenue: 0, totalTransactions: 0 },
  transactionsPagination: null,
  transactionsLoading: false,
  transactionsError: null,
  transactionsRequestId: null,

  exportLoading: false,
  exportError: null,
};

const subscriptionDashboardSlice = createSlice({
  name: "subscriptionDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Overview
      .addCase(fetchOverview.pending, (state) => {
        state.overviewLoading = true;
        state.overviewError = null;
      })
      .addCase(fetchOverview.fulfilled, (state, action) => {
        state.overviewLoading = false;
        state.overview = action.payload;
      })
      .addCase(fetchOverview.rejected, (state, action) => {
        state.overviewLoading = false;
        state.overviewError = action.payload;
      })
      // Charts — request-id guarded so a slow, superseded date-range request
      // can't clobber a faster, more recent one (rapid preset switching).
      .addCase(fetchCharts.pending, (state, action) => {
        state.chartsLoading = true;
        state.chartsError = null;
        state.chartsRequestId = action.meta.requestId;
      })
      .addCase(fetchCharts.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.chartsRequestId) return;
        state.chartsLoading = false;
        state.charts = action.payload;
      })
      .addCase(fetchCharts.rejected, (state, action) => {
        if (action.meta.requestId !== state.chartsRequestId) return;
        state.chartsLoading = false;
        state.chartsError = action.payload;
      })
      // Dashboard extras (moved-over plan/tx pies + churn/failed-tx KPIs) —
      // request-id guarded, same pattern as charts.
      .addCase(fetchDashboardExtrasForSubscription.pending, (state, action) => {
        state.dashboardExtrasLoading = true;
        state.dashboardExtrasError = null;
        state.dashboardExtrasRequestId = action.meta.requestId;
      })
      .addCase(fetchDashboardExtrasForSubscription.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.dashboardExtrasRequestId) return;
        state.dashboardExtrasLoading = false;
        state.dashboardExtras = action.payload;
      })
      .addCase(fetchDashboardExtrasForSubscription.rejected, (state, action) => {
        if (action.meta.requestId !== state.dashboardExtrasRequestId) return;
        state.dashboardExtrasLoading = false;
        state.dashboardExtrasError = action.payload;
      })
      // Daily performance
      .addCase(fetchDailyPerformance.pending, (state) => {
        state.dailyPerformanceLoading = true;
        state.dailyPerformanceError = null;
      })
      .addCase(fetchDailyPerformance.fulfilled, (state, action) => {
        state.dailyPerformanceLoading = false;
        state.dailyPerformance = action.payload;
      })
      .addCase(fetchDailyPerformance.rejected, (state, action) => {
        state.dailyPerformanceLoading = false;
        state.dailyPerformanceError = action.payload;
      })
      // Subscribers — request-id guarded against rapid search/filter switching
      // resolving out of order.
      .addCase(fetchSubscribers.pending, (state, action) => {
        state.subscribersLoading = true;
        state.subscribersError = null;
        state.subscribersRequestId = action.meta.requestId;
      })
      .addCase(fetchSubscribers.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.subscribersRequestId) return;
        state.subscribersLoading = false;
        state.subscribers = action.payload.subscribers || [];
        state.subscribersCounts = action.payload.counts || initialState.subscribersCounts;
        state.subscribersPagination = action.payload.pagination || null;
      })
      .addCase(fetchSubscribers.rejected, (state, action) => {
        if (action.meta.requestId !== state.subscribersRequestId) return;
        state.subscribersLoading = false;
        state.subscribersError = action.payload;
      })
      // Manage subscriber
      .addCase(manageSubscriber.pending, (state) => {
        state.manageLoading = true;
        state.manageError = null;
      })
      .addCase(manageSubscriber.fulfilled, (state) => {
        state.manageLoading = false;
      })
      .addCase(manageSubscriber.rejected, (state, action) => {
        state.manageLoading = false;
        state.manageError = action.payload;
      })
      // Transactions — request-id guarded against rapid search/filter switching
      // resolving out of order.
      .addCase(fetchTransactions.pending, (state, action) => {
        state.transactionsLoading = true;
        state.transactionsError = null;
        state.transactionsRequestId = action.meta.requestId;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.transactionsRequestId) return;
        state.transactionsLoading = false;
        state.transactions = action.payload.transactions || [];
        state.transactionsSummary = {
          grossRevenue: action.payload.grossRevenue || 0,
          totalTransactions: action.payload.totalTransactions || 0,
        };
        state.transactionsPagination = action.payload.pagination || null;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        if (action.meta.requestId !== state.transactionsRequestId) return;
        state.transactionsLoading = false;
        state.transactionsError = action.payload;
      })
      // Revoke Transaction
      .addCase(revokeTransaction.pending, (state) => {
        // You could use a specific revoke loading state if needed, but we rely on transactionsLoading or just local state.
      })
      .addCase(revokeTransaction.fulfilled, (state) => {
        // Handled locally or refetched.
      })
      .addCase(revokeTransaction.rejected, (state, action) => {
        // Handled via toast in component.
      })
      // Export
      .addCase(exportTransactions.pending, (state) => {
        state.exportLoading = true;
        state.exportError = null;
      })
      .addCase(exportTransactions.fulfilled, (state) => {
        state.exportLoading = false;
      })
      .addCase(exportTransactions.rejected, (state, action) => {
        state.exportLoading = false;
        state.exportError = action.payload;
      });
  },
});

export default subscriptionDashboardSlice.reducer;
