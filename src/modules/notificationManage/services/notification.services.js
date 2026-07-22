import { apiConnector } from "@/services/axios/axios.connector";
import { NOTIFICATION, CAMPAIGNS } from "@/services/api-endpoints/notification.endpoints";

export const getNotificationListAPI = async (params = {}) => {
  return apiConnector("GET", NOTIFICATION.NOTIFICATION_LIST, null, null, params);
};

export const sendNotificationAPI = async (data) => {
  return apiConnector("POST", NOTIFICATION.NOTIFICATION_SEND, data);
};

export const sendPushCampaignAPI = async (data) => {
  return apiConnector("POST", CAMPAIGNS.PUSH_NOTIFICATION, data);
};

export const sendEmailCampaignAPI = async (data) => {
  return apiConnector("POST", CAMPAIGNS.EMAIL_NOTIFICATION, data);
};

export const getPushCampaignHistoryAPI = async (params = {}) => {
  return apiConnector("GET", CAMPAIGNS.PUSH_HISTORY, null, null, params);
};

export const getEmailCampaignHistoryAPI = async (params = {}) => {
  return apiConnector("GET", CAMPAIGNS.EMAIL_HISTORY, null, null, params);
};

export const getCampaignHistoryAPI = async (params = {}) => {
  return apiConnector("GET", CAMPAIGNS.CAMPAIGN_HISTORY, null, null, params);
};

// delivery report
export const getCampaignDeliveryReportAPI = async (channel, id, params = {}) => {
  const url = CAMPAIGNS.CAMPAIGN_DELIVERY_REPORT.replace(":channel", channel).replace(":id", id);
  return apiConnector("GET", url, null, null, params);
};