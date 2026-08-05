import { apiConnector } from "@/services/axios/axios.connector";
import { FOOD_CATEGORY, FOOD } from "@/services/api-endpoints/food.endpoints";

// ──────────────── Food Categories ────────────────

export const getFoodCategoriesAPI = async (params = {}) => {
  return apiConnector("GET", FOOD_CATEGORY.FOOD_CATEGORY_LIST, null, null, params);
};

export const getFoodCategoriesDropAPI = async () => {
  return apiConnector("GET", FOOD_CATEGORY.FOOD_CATEGORY_DROPDOWN);
};

export const addFoodCategoryAPI = async (data) => {
  return apiConnector("POST", FOOD_CATEGORY.FOOD_CATEGORY_ADD, data);
};

export const updateFoodCategoryAPI = async (id, data) => {
  return apiConnector("POST", FOOD_CATEGORY.FOOD_CATEGORY_UPDATE(id), data);
};

export const deleteFoodCategoryAPI = async (id) => {
  return apiConnector("DELETE", FOOD_CATEGORY.FOOD_CATEGORY_DELETE(id));
};

// ──────────────── Food Items ────────────────

export const getFoodListAPI = async (programId, categoryId, params = {}) => {
  return apiConnector("GET", FOOD.FOOD_GET_BY_PROGRAM_CATEGORY(programId, categoryId), null, null, params);
};

export const addFoodAPI = async (data) => {
  return apiConnector("POST", FOOD.FOOD_ADD, data);
};

export const updateFoodAPI = async (id, data) => {
  return apiConnector("POST", FOOD.FOOD_UPDATE(id), data);
};

export const toggleFoodStatusAPI = async (id, data) => {
  return apiConnector("PATCH", FOOD.FOOD_TOGGLE_APPROVAL_STATUS(id), data);
};

export const deleteFoodAPI = async (id) => {
  return apiConnector("DELETE", FOOD.FOOD_DELETE(id));
};

export const searchFoodItemsAPI = async () => {
  return apiConnector("GET", FOOD.FOOD_GET_SEARCH);
};
