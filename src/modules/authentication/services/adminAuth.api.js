import { apiConnector } from "@/services/axios/axios.connector";
import { AUTHENTICATION_ENDPOINTS } from "@/services/api-endpoints/admin-auth.endpoints";

export const adminLoginAPI = (data) => {
  return apiConnector("POST", AUTHENTICATION_ENDPOINTS.ADMIN_LOGIN, data);
};
