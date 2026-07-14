import { apiConnector } from "@/services/axios/axios.connector";
import { NUTRITION } from "@/services/api-endpoints/diet.endpoints";

export const getNutritionListAPI = async (params = {}) => {
  return apiConnector("GET", NUTRITION.NUTRITION_LIST, null, null, params);
};
