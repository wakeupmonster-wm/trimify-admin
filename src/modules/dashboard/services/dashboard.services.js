import { DASHBOARD_ENDPOINTS } from "@/services/api-endpoints/dashboard.endpoints";
import { apiConnector } from "@/services/axios/axios.connector";

export const dashboardSummaryAPI = (dateRange) => {
  const params = {};
  if (dateRange?.from) params.from = dateRange.from;
  if (dateRange?.to) params.to = dateRange.to;
  return apiConnector("GET", DASHBOARD_ENDPOINTS.SUMMARY, null, {}, params);
};

export const dashboardContentChartsAPI = (dateRange) => {
  const params = {};
  if (dateRange?.from) params.from = dateRange.from;
  if (dateRange?.to) params.to = dateRange.to;
  return apiConnector("GET", DASHBOARD_ENDPOINTS.CONTENT_CHARTS, null, {}, params);
};

export const dashboardRevenueChartsAPI = (dateRange) => {
  const params = {};
  if (dateRange?.from) params.from = dateRange.from;
  if (dateRange?.to) params.to = dateRange.to;
  return apiConnector("GET", DASHBOARD_ENDPOINTS.REVENUE_CHARTS, null, {}, params);
};

export const dashboardEngagementChartsAPI = (dateRange) => {
  const params = {};
  if (dateRange?.from) params.from = dateRange.from;
  if (dateRange?.to) params.to = dateRange.to;
  return apiConnector("GET", DASHBOARD_ENDPOINTS.ENGAGEMENT_CHARTS, null, {}, params);
};

export const dashboardRecentActivityAPI = (dateRange) => {
  const params = {};
  if (dateRange?.from) params.from = dateRange.from;
  if (dateRange?.to) params.to = dateRange.to;
  return apiConnector("GET", DASHBOARD_ENDPOINTS.RECENT_ACTIVITY, null, {}, params);
};
