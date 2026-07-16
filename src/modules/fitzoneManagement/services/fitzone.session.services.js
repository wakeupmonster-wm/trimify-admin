import { apiConnector } from "@/services/axios/axios.connector";
import { FITZONE_SESSION } from "@/services/api-endpoints/fitzone.endpoints";

export const getFitzoneSessionsAPI = async (id) => {
  try {
    const response = await apiConnector(
      "GET",
      FITZONE_SESSION.FITZONE_SESSION_LIST(id),
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const addFitzoneSessionAPI = async (data) => {
  try {
    const response = await apiConnector(
      "POST",
      FITZONE_SESSION.FITZONE_SESSION_ADD,
      data,
      {
        "Content-Type": "multipart/form-data", // Assuming video/image upload
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateFitzoneSessionAPI = async (id, data) => {
  try {
    const response = await apiConnector(
      "POST",
      FITZONE_SESSION.FITZONE_SESSION_UPDATE(id),
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

export const toggleFitzoneSessionStatusAPI = async (id, status) => {
  try {
    const response = await apiConnector(
      "PATCH",
      FITZONE_SESSION.FITZONE_SESSION_TOGGLE_STATUS(id),
      { status },
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteFitzoneSessionAPI = async (id) => {
  try {
    const response = await apiConnector(
      "DELETE",
      FITZONE_SESSION.FITZONE_SESSION_DELETE(id),
    );
    return response;
  } catch (error) {
    throw error;
  }
};
