import { axiosInstance } from "@/services/axios/axios.instance";
import { apiConnector } from "@/services/axios/axios.connector";
import { SUBSCRIPTION_DASHBOARD } from "@/services/api-endpoints/subscription-management.endpoints";

export const getSubscriptionOverviewAPI = async () => {
  return apiConnector("GET", SUBSCRIPTION_DASHBOARD.OVERVIEW);
};

export const getSubscriptionChartsAPI = async (params = {}) => {
  return apiConnector("GET", SUBSCRIPTION_DASHBOARD.CHARTS, null, null, params);
};

export const getDailyPerformanceAPI = async () => {
  return apiConnector("GET", SUBSCRIPTION_DASHBOARD.DAILY_PERFORMANCE);
};

export const getSubscribersAPI = async (params = {}) => {
  return apiConnector("GET", SUBSCRIPTION_DASHBOARD.SUBSCRIBERS, null, null, params);
};

export const manageSubscriberAPI = async (id, data) => {
  return apiConnector("PATCH", SUBSCRIPTION_DASHBOARD.MANAGE_SUBSCRIBER(id), data);
};

export const getTransactionsAPI = async (params = {}) => {
  return apiConnector("GET", SUBSCRIPTION_DASHBOARD.TRANSACTIONS, null, null, params);
};

// Not JSON — streams a CSV file. Bypasses apiConnector's response.data unwrap
// interceptor by requesting a blob directly so we get the raw file body.
export const exportTransactionsAPI = async (params = {}) => {
  return axiosInstance({
    method: "GET",
    url: SUBSCRIPTION_DASHBOARD.TRANSACTIONS_EXPORT,
    params,
    responseType: "blob",
  });
};

export const getRetentionTrendAPI = async (params = {}) => {
  return apiConnector("GET", SUBSCRIPTION_DASHBOARD.RETENTION_TREND, null, null, params);
};

export const getExpiringSoonAPI = async (params = {}) => {
  return apiConnector("GET", SUBSCRIPTION_DASHBOARD.EXPIRING_SOON, null, null, params);
};

export const getAbandonedCheckoutsAPI = async (params = {}) => {
  return apiConnector("GET", SUBSCRIPTION_DASHBOARD.ABANDONED_CHECKOUTS, null, null, params);
};
