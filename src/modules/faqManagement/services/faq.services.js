import { apiConnector } from "@/services/axios/axios.connector";
import { FAQ_CRUD } from "@/services/api-endpoints/faq.endpoints";

export const getFaqListAPI = async (params = {}) => {
  return apiConnector("GET", FAQ_CRUD.FAQ_LIST, null, null, params);
};

export const addFaqAPI = async (data) => {
  return apiConnector("POST", FAQ_CRUD.FAQ_ADD, data);
};

export const updateFaqAPI = async (id, data) => {
  return apiConnector("PUT", FAQ_CRUD.FAQ_UPDATE(id), data);
};

export const toggleStatusFaqAPI = async (id, data) => {
  return apiConnector("PATCH", FAQ_CRUD.FAQ_TOGGLE_STATUS(id), data);
};

export const deleteFaqAPI = async (id) => {
  return apiConnector("DELETE", FAQ_CRUD.FAQ_DELETE(id));
};
