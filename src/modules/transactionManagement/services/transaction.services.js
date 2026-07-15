import { apiConnector } from "@/services/axios/axios.connector";
import { TRANSACTION } from "@/services/api-endpoints/transactions.endpoints";

export const getTransactionsAPI = async (params = {}) => {
  return apiConnector("GET", TRANSACTION.TRANSACTION_LIST, null, null, params);
};
