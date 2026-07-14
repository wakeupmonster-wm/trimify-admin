import { apiConnector } from "@/services/axios/axios.connector";
import { PROGRAM } from "@/services/api-endpoints/program.endpoints";

export const getProgramManagementAPI = async (params = {}) => {
  return apiConnector("GET", PROGRAM.PROGRAM_LIST, null, null, params);
};

export const addProgramAPI = async (formData) => {
  return apiConnector("POST", PROGRAM.PROGRAM_ADD, formData, {
    "Content-Type": "multipart/form-data",
  });
};

export const updateProgramAPI = async (id, formData) => {
  return apiConnector("POST", PROGRAM.PROGRAM_UPDATE(id), formData, {
    "Content-Type": "multipart/form-data",
  });
};

export const deleteProgramAPI = async (id) => {
  return apiConnector("DELETE", PROGRAM.PROGRAM_DELETE(id));
};

export const toggleProgramStatusAPI = async (id, status) => {
  return apiConnector("PATCH", PROGRAM.PROGRAM_TOGGLE_STATUS(id), { status });
};

export const toggleProgramFoodVisibilityAPI = async (id) => {
  return apiConnector("PATCH", PROGRAM.PROGRAM_TOGGLE_FOOD_VISIBILITY(id));
};
