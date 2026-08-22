import { apiConnector } from "@/services/axios/axios.connector";
import { NUTRITION_ENDPOINTS } from "@/services/api-endpoints/nutrition.endpoints";
import { AI_FOOD_ENDPOINTS } from "@/services/api-endpoints/ai-food.endpoints";

export const getNutritionListAPI = async (params) => {
  return apiConnector("GET", NUTRITION_ENDPOINTS.NUTRITION_LIST, null, null, params);
};

export const addNutritionAPI = async (data) => {
  return apiConnector("POST", NUTRITION_ENDPOINTS.NUTRITION_ADD, data);
};

export const updateNutritionAPI = async (id, data) => {
  return apiConnector("POST", NUTRITION_ENDPOINTS.NUTRITION_UPDATE(id), data);
};

export const deleteNutritionAPI = async (id) => {
  return apiConnector("DELETE", NUTRITION_ENDPOINTS.NUTRITION_DELETE(id));
};

export const uploadNutritionAPI = async (data) => {
  return apiConnector("POST", NUTRITION_ENDPOINTS.NUTRITION_UPLOAD, data);
};

export const regenerateNutritionImageAPI = async (id, imagePrompt) => {
  return apiConnector(
    "POST",
    AI_FOOD_ENDPOINTS.REGENERATE_SAVED_IMAGE(id),
    imagePrompt ? { image_prompt: imagePrompt } : null,
  );
};

export const regenerateNutritionImageAudioAPI = async (id, audioBlob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");

  return apiConnector(
    "POST",
    AI_FOOD_ENDPOINTS.REGENERATE_SAVED_IMAGE_AUDIO(id),
    formData,
    { "Content-Type": "multipart/form-data" },
  );
};
