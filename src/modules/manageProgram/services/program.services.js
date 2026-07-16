import { apiConnector } from "@/services/axios/axios.connector";
import { PROGRAM } from "@/services/api-endpoints/program.endpoints";

export const getProgramManagementAPI = async (params = {}) => {
  return apiConnector("GET", PROGRAM.PROGRAM_LIST, null, null, params);
};

export const addProgramAPI = async (data) => {
  return apiConnector("POST", PROGRAM.PROGRAM_ADD, data);
};

export const updateProgramAPI = async (id, data) => {
  return apiConnector("POST", PROGRAM.PROGRAM_UPDATE(id), data);
};

export const deleteProgramAPI = async (id) => {
  return apiConnector("DELETE", PROGRAM.PROGRAM_DELETE(id));
};

export const toggleProgramStatusAPI = async (id, statusData) => {
  return apiConnector("PATCH", PROGRAM.PROGRAM_TOGGLE_STATUS(id), statusData);
};

export const toggleFoodVisibilityAPI = async (id) => {
  return apiConnector("PATCH", PROGRAM.PROGRAM_TOGGLE_FOOD_VISIBILITY(id));
};

export const replicateProgramAPI = async (id) => {
  return apiConnector("POST", PROGRAM.PROGRAM_REPLICATE(id));
};

export const getProgramAssignedUsersAPI = async (id, params = {}) => {
  return apiConnector("GET", PROGRAM.PROGRAM_VIEW_ASSIGNED_USERS(id), null, null, params);
};

export const getProgramFoodVisibilityAPI = async (id) => {
  return apiConnector("GET", PROGRAM.PROGRAM_GET_FOOD_VISIBILITY(id));
};
