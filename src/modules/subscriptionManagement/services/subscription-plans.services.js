import { apiConnector } from "@/services/axios/axios.connector";
import { SUBSCRIPTION_PLAN } from "@/services/api-endpoints/subscription-management.endpoints";

export const getSubscriptionPlansAPI = async (params = {}) => {
  return apiConnector("GET", SUBSCRIPTION_PLAN.LIST, null, null, params);
};

export const updateSubscriptionPlanAPI = async (id, data) => {
  return apiConnector("POST", SUBSCRIPTION_PLAN.UPDATE(id), data);
};
