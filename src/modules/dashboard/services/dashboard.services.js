import { DASHBOARD_ENDPOINTS } from "@/services/api-endpoints/dashboard.endpoints";
import { apiConnector } from "@/services/axios/axios.connector";

export const dashboardAlertsAPI = () => {
  return apiConnector("GET", DASHBOARD_ENDPOINTS.ALERTS);
};

export const dashboardAllAPI = (dateRange) => {
  const params = {};
  if (dateRange?.preset) params.preset = dateRange.preset;
  if (dateRange?.preset === "custom") {
    const formatDt = (d) => {
      if (!d) return "";
      if (d instanceof Date) return d.toISOString().split("T")[0];
      return String(d).split("T")[0];
    };
    if (dateRange.from) params.from = formatDt(dateRange.from);
    if (dateRange.to) params.to = formatDt(dateRange.to);
  }
  return apiConnector("GET", DASHBOARD_ENDPOINTS.ALL, null, {}, params);
};

export const dashboardSummaryAPI = (dateRange) => {
  const params = {};
  if (dateRange?.preset) params.preset = dateRange.preset;
  if (dateRange?.from) params.from = dateRange.from;
  if (dateRange?.to) params.to = dateRange.to;
  return apiConnector("GET", DASHBOARD_ENDPOINTS.SUMMARY, null, {}, params);
};

export const dashboardContentChartsAPI = (dateRange) => {
  const params = {};
  if (dateRange?.preset) params.preset = dateRange.preset;
  if (dateRange?.from) params.from = dateRange.from;
  if (dateRange?.to) params.to = dateRange.to;
  return apiConnector("GET", DASHBOARD_ENDPOINTS.CONTENT_CHARTS, null, {}, params);
};

export const dashboardRevenueChartsAPI = (dateRange) => {
  const params = {};
  if (dateRange?.preset) params.preset = dateRange.preset;
  if (dateRange?.from) params.from = dateRange.from;
  if (dateRange?.to) params.to = dateRange.to;
  return apiConnector("GET", DASHBOARD_ENDPOINTS.REVENUE_CHARTS, null, {}, params);
};

export const dashboardEngagementChartsAPI = (dateRange) => {
  const params = {};
  if (dateRange?.preset) params.preset = dateRange.preset;
  if (dateRange?.from) params.from = dateRange.from;
  if (dateRange?.to) params.to = dateRange.to;
  return apiConnector("GET", DASHBOARD_ENDPOINTS.ENGAGEMENT_CHARTS, null, {}, params);
};

export const dashboardRecentActivityAPI = (dateRange) => {
  const params = {};
  if (dateRange?.preset) params.preset = dateRange.preset;
  if (dateRange?.from) params.from = dateRange.from;
  if (dateRange?.to) params.to = dateRange.to;
  return apiConnector("GET", DASHBOARD_ENDPOINTS.RECENT_ACTIVITY, null, {}, params);
};

export const dashboardConversionFunnelAPI = (dateRange) => {
  const params = {};
  if (dateRange?.preset) params.preset = dateRange.preset;
  if (dateRange?.from) params.from = dateRange.from;
  if (dateRange?.to) params.to = dateRange.to;
  return apiConnector("GET", DASHBOARD_ENDPOINTS.CONVERSION_FUNNEL, null, {}, params);
};

export const dashboardDemographicsChartsAPI = () => {
  return apiConnector("GET", DASHBOARD_ENDPOINTS.DEMOGRAPHICS_CHARTS);
};

export const dashboardFitzoneCompletionTrendAPI = (dateRange) => {
  const params = {};
  if (dateRange?.preset) params.preset = dateRange.preset;
  if (dateRange?.from) params.from = dateRange.from;
  if (dateRange?.to) params.to = dateRange.to;
  return apiConnector("GET", DASHBOARD_ENDPOINTS.FITZONE_COMPLETION_TREND, null, {}, params);
};
