import { apiConnector } from "@/services/axios/axios.connector";
import { AI_FOOD_ENDPOINTS } from "@/services/api-endpoints/ai-food.endpoints";

export const generateAiFoodAPI = async (foodNames) => {
  return apiConnector("POST", AI_FOOD_ENDPOINTS.GENERATE, {
    food_names: foodNames,
  });
};

export const getAiFoodBatchAPI = async (batchId) => {
  return apiConnector("GET", AI_FOOD_ENDPOINTS.BATCH(batchId));
};

export const getAiFoodListAPI = async (params) => {
  return apiConnector("GET", AI_FOOD_ENDPOINTS.LIST, null, null, params);
};

export const updateAiFoodAPI = async (id, data) => {
  return apiConnector("PUT", AI_FOOD_ENDPOINTS.UPDATE(id), data);
};

export const retryAiFoodAPI = async (id) => {
  return apiConnector("POST", AI_FOOD_ENDPOINTS.RETRY(id));
};

export const regenerateAiFoodImageAPI = async (id, imagePrompt) => {
  return apiConnector(
    "POST",
    AI_FOOD_ENDPOINTS.REGENERATE_IMAGE(id),
    imagePrompt ? { image_prompt: imagePrompt } : null,
  );
};

export const regenerateAiFoodImageAudioAPI = async (id, audioBlob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  return apiConnector("POST", AI_FOOD_ENDPOINTS.REGENERATE_IMAGE_AUDIO(id), formData, {
    "Content-Type": "multipart/form-data",
  });
};

export const deleteAiFoodAPI = async (id) => {
  return apiConnector("DELETE", AI_FOOD_ENDPOINTS.DELETE(id));
};

export const saveAiFoodAPI = async (ids) => {
  return apiConnector("POST", AI_FOOD_ENDPOINTS.SAVE, { ids });
};
