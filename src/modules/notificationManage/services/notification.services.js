import { apiConnector } from "@/services/axios/axios.connector";
import { NOTIFICATION } from "@/services/api-endpoints/notification.endpoints";

export const getNotificationListAPI = async (params = {}) => {
  return apiConnector("GET", NOTIFICATION.NOTIFICATION_LIST, null, null, params);
};

export const sendNotificationAPI = async (data) => {
  return apiConnector("POST", NOTIFICATION.NOTIFICATION_SEND, data);
};
