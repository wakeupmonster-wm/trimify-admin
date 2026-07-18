import { apiConnector } from "@/services/axios/axios.connector";
import { DIET_PLAN } from "@/services/api-endpoints/diet.endpoints";
import { PROGRAM_DIET } from "@/services/api-endpoints/program.endpoints";

// ──────────────── Diet Plan ────────────────

export const getDietMealsAPI = async (id, params = {}) => {
  return apiConnector("GET", DIET_PLAN.DIET_PLAN_GET_BY_PROGRAM(id), null, null, params);
};

export const addDietMealAPI = async (data) => {
  return apiConnector("POST", DIET_PLAN.DIET_PLAN_ADD, data);
};

export const updateDietMealAPI = async (id, data) => {
  return apiConnector("POST", DIET_PLAN.DIET_PLAN_UPDATE(id), data);
};

export const deleteDietMealAPI = async (id) => {
  return apiConnector("DELETE", DIET_PLAN.DIET_PLAN_DELETE(id));
};

export const getProgramDurationAPI = async (id) => {
  return apiConnector("GET", PROGRAM_DIET.PROGRAM_DURATION(id));
};

export const searchFoodAPI = async () => {
  return apiConnector("GET", DIET_PLAN.DIET_PLAN_SEARCH_FOOD);
};

export const toggleDietMealStatusAPI = async (id, data) => {
  return apiConnector("PATCH", DIET_PLAN.DIET_PLAN_TOGGLE_STATUS(id), data);
};
