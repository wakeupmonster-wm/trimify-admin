import { apiConnector } from "@/services/axios/axios.connector";
import { FITZONE_CRUD } from "@/services/api-endpoints/fitzone.endpoints";

export const getFitzoneManagementAPI = async (params = {}) => {
  return apiConnector("GET", FITZONE_CRUD.FITZONE_LIST, null, null, params);
};
