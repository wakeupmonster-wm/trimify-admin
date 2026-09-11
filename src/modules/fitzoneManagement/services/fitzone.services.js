import { apiConnector } from "@/services/axios/axios.connector";
import { FITZONE_CRUD } from "@/services/api-endpoints/fitzone.endpoints";

export const getFitzoneManagementAPI = async (params = {}) => {
  return apiConnector("GET", FITZONE_CRUD.FITZONE_LIST, null, null, params);
};

export const addFitzoneAPI = async (data) => {
  return apiConnector("POST", FITZONE_CRUD.FITZONE_ADD, data);
};

export const updateFitzoneAPI = async (id, data) => {
  return apiConnector("POST", FITZONE_CRUD.FITZONE_UPDATE(id), data);
};

export const toggleFitzoneStatusAPI = async (id, statusData) => {
  return apiConnector("PATCH", FITZONE_CRUD.FITZONE_TOGGLE_STATUS(id), statusData);
};

export const deleteFitzoneAPI = async (id) => {
  return apiConnector("DELETE", FITZONE_CRUD.FITZONE_DELETE(id));
};

export const assignFitzoneToAllUsersAPI = async (id) => {
  return apiConnector("POST", FITZONE_CRUD.FITZONE_ASSIGN_ALL_USERS(id));
};

export const getFitzoneAssignmentRunsAPI = async (id) => {
  return apiConnector("GET", FITZONE_CRUD.FITZONE_ASSIGNMENT_RUNS(id));
};

export const getFitzoneAssignableUsersAPI = async (id, params = {}) => {
  return apiConnector("GET", FITZONE_CRUD.FITZONE_ASSIGNABLE_USERS(id), null, null, params);
};

export const assignFitzoneToSelectedUsersAPI = async (id, userIds) => {
  return apiConnector("POST", FITZONE_CRUD.FITZONE_ASSIGN_SELECTED_USERS(id), { user_ids: userIds });
};

export const unassignFitzoneUserAPI = async (id, userId) => {
  return apiConnector("POST", FITZONE_CRUD.FITZONE_UNASSIGN_USER(id), { user_id: userId });
};
