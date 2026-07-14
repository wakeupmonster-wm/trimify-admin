import { apiConnector } from "@/services/axios/axios.connector";
import { NUTRITION_ENDPOINTS } from "@/services/api-endpoints/nutrition.endpoints";

export const getNutritionListAPI = async (params) => {
  return apiConnector("GET", NUTRITION_ENDPOINTS.NUTRITION_LIST, null, null, params);
};

export const addNutritionAPI = async (data) => {
  return apiConnector("POST", NUTRITION_ENDPOINTS.NUTRITION_ADD, data);
};

export const updateNutritionAPI = async (id, data) => {
  return apiConnector("POST", NUTRITION_ENDPOINTS.NUTRITION_UPDATE(id), data);
};

export const uploadNutritionAPI = async (data) => {
  return apiConnector("POST", NUTRITION_ENDPOINTS.NUTRITION_UPLOAD, data);
};
