import { apiConnector } from "@/services/axios/axios.connector";
import { USER } from "@/services/api-endpoints/users.endpoints";

export const getUserManagementAPI = async (params = {}) => {
  return apiConnector("GET", USER.USER_LIST, null, null, params);
};

export const getSingleUserProfileAPI = async (id) => {
  return apiConnector("GET", USER.VIEW_USER_PROFILE(id));
};

export const getUserTransactionsAPI = async (id, params = {}) => {
  return apiConnector("GET", USER.USER_TRANSACTIONS(id), null, null, params);
};

export const deleteUserAPI = async (id) => {
  return apiConnector("DELETE", USER.DELETE_USER(id));
};

// ───────────── Per-user Fitzone Assignment CRUD ────────────────────

export const updateFitzoneAssignmentAPI = async (userId, categoryId, data) => {
  return apiConnector("PUT", USER.UPDATE_FITZONE_ASSIGNMENT(userId, categoryId), data);
};

export const deleteFitzoneAssignmentAPI = async (userId, categoryId) => {
  return apiConnector("DELETE", USER.DELETE_FITZONE_ASSIGNMENT(userId, categoryId));
};

export const addFitzoneAssignmentAPI = async (userId, data) => {
  return apiConnector("POST", USER.ADD_FITZONE_ASSIGNMENT(userId), data);
};

export const getAvailableFitzoneCategoriesAPI = async (userId) => {
  return apiConnector("GET", USER.AVAILABLE_FITZONE_CATEGORIES(userId));
};
