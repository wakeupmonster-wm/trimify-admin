import { apiConnector } from "@/services/axios/axios.connector";
import { SUBSCRIPTION_PLAN } from "@/services/api-endpoints/transactions.endpoints";

export const getSubscriptionPlansAPI = async (params = {}) => {
  return apiConnector("GET", SUBSCRIPTION_PLAN.SUBSCRIPTION_PLAN_LIST, null, null, params);
};
