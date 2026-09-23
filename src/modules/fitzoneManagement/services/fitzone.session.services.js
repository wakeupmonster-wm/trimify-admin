import { apiConnector } from "@/services/axios/axios.connector";
import { FITZONE_SESSION } from "@/services/api-endpoints/fitzone.endpoints";

export const getFitzoneSessionsAPI = async (id, params = {}) => {
  return apiConnector(
    "GET",
    FITZONE_SESSION.FITZONE_SESSION_LIST(id),
    null,
    null,
    params,
  );
};

export const addFitzoneSessionAPI = async (data) => {
  return apiConnector(
    "POST",
    FITZONE_SESSION.FITZONE_SESSION_ADD,
    data,
    {
      "Content-Type": "multipart/form-data", // Assuming video/image upload
    },
    null,
    { timeout: 5 * 60 * 1000 },
  );
};

export const updateFitzoneSessionAPI = async (id, data) => {
  return apiConnector(
    "POST",
    FITZONE_SESSION.FITZONE_SESSION_UPDATE(id),
    data,
    {
      "Content-Type": "multipart/form-data",
    },
  );
};

export const toggleFitzoneSessionStatusAPI = async (id, status) => {
  return apiConnector(
    "PATCH",
    FITZONE_SESSION.FITZONE_SESSION_TOGGLE_STATUS(id),
    { status },
  );
};

export const deleteFitzoneSessionAPI = async (id) => {
  return apiConnector(
    "DELETE",
    FITZONE_SESSION.FITZONE_SESSION_DELETE(id),
  );
};
