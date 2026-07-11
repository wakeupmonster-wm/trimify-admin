import { apiConnector } from "@/services/axios/axios.connector";
import { USER } from "@/services/api-endpoints/users.endpoints";

export const getUserManagementAPI = async (params = {}) => {
  return apiConnector("GET", USER.USER_LIST, null, null, params);
};
