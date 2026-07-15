import { apiConnector } from "@/services/axios/axios.connector";
import { FITZONE_INTRO } from "@/services/api-endpoints/fitzone.endpoints";

export const getFitzoneIntroAPI = async (id) => {
  try {
    const response = await apiConnector(
      "GET",
      FITZONE_INTRO.FITZONE_INTRO_GET(id),
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const addFitzoneIntroAPI = async (data) => {
  try {
    const response = await apiConnector(
      "POST",
      FITZONE_INTRO.FITZONE_INTRO_ADD,
      data,
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateFitzoneIntroAPI = async (id, data) => {
  try {
    const response = await apiConnector(
      "POST", // Usually updates are POST with laravel or PUT, but endpoint mapping says POST
      FITZONE_INTRO.FITZONE_INTRO_UPDATE(id),
      data,
    );
    return response;
  } catch (error) {
    throw error;
  }
};
