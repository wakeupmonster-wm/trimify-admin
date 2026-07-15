import { apiConnector } from "@/services/axios/axios.connector";
import { FAQ_CRUD } from "@/services/api-endpoints/faq.endpoints";

export const getFaqListAPI = async (params = {}) => {
  return apiConnector("GET", FAQ_CRUD.FAQ_LIST, null, null, params);
};

export const addFaqAPI = async (data) => {
  return apiConnector("POST", FAQ_CRUD.FAQ_ADD, data);
};
