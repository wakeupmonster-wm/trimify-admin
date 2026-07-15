import { apiConnector } from "@/services/axios/axios.connector";
import { FITZONE_CRUD } from "@/services/api-endpoints/fitzone.endpoints";

export const getFitzoneManagementAPI = async (params = {}) => {
  return apiConnector("GET", FITZONE_CRUD.FITZONE_LIST, null, null, params);
};

export const addFitzoneAPI = async (data) => {
  return apiConnector("POST", FITZONE_CRUD.FITZONE_ADD, data);
};

export const toggleFitzoneStatusAPI = async (id, statusData) => {
  return apiConnector("PATCH", FITZONE_CRUD.FITZONE_TOGGLE_STATUS(id), statusData);
};

export const deleteFitzoneAPI = async (id) => {
  return apiConnector("DELETE", FITZONE_CRUD.FITZONE_DELETE(id));
};
