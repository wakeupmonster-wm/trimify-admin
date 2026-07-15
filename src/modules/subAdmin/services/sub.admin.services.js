import { apiConnector } from "@/services/axios/axios.connector";
import { SUBADMIN_ENPOINTS } from "@/services/api-endpoints/subadmin.endpoints";

/*================= Sub Admin Management =====================*/

export const getSubAdminManagementAPI = async (params) => {
  return apiConnector("GET", SUBADMIN_ENPOINTS.SUBADMIN_LIST, null, null, params);
};

export const addSubAdminAPI = async (data) => {
  return apiConnector("POST", SUBADMIN_ENPOINTS.SUBADMIN_ADD, data);
};

export const updateSubAdminAPI = async (id, data) => {
  return apiConnector("POST", SUBADMIN_ENPOINTS.SUBADMIN_UPDATE(id), data);
};

export const toggleSubAdminStatusAPI = async (id, statusData) => {
  return apiConnector("PATCH", SUBADMIN_ENPOINTS.SUBADMIN_TOGGLE_STATUS(id), statusData);
};

export const deleteSubAdminAPI = async (id) => {
  return apiConnector("DELETE", SUBADMIN_ENPOINTS.SUBADMIN_DELETE(id));
};