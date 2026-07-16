import { apiConnector } from "@/services/axios/axios.connector";
import { FITZONE_WORKOUT_CATEGORY } from "@/services/api-endpoints/fitzone.endpoints";

export const getFitzoneCategoriesAPI = async (id) => {
  try {
    const response = await apiConnector(
      "GET",
      FITZONE_WORKOUT_CATEGORY.FITZONE_WORKOUT_CATEGORY_LIST(id),
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const addFitzoneCategoryAPI = async (data) => {
  try {
    const response = await apiConnector(
      "POST", FITZONE_WORKOUT_CATEGORY.FITZONE_WORKOUT_CATEGORY_ADD,
      data,
      {
        "Content-Type": "multipart/form-data", // Assuming image upload
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateFitzoneCategoryAPI = async (id, data) => {
  try {
    const response = await apiConnector(
      "POST", FITZONE_WORKOUT_CATEGORY.FITZONE_WORKOUT_CATEGORY_UPDATE(id),
      data,
      {
        "Content-Type": "multipart/form-data",
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteFitzoneCategoryAPI = async (id) => {
  try {
    const response = await apiConnector("DELETE",
      FITZONE_WORKOUT_CATEGORY.FITZONE_WORKOUT_CATEGORY_DELETE(id));
    return response;
  } catch (error) {
    throw error;
  }
};
