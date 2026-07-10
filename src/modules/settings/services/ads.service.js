import { ADS_ENDPOINTS } from "@/services/api-endpoints/settings.endpoints";
import { apiConnector } from "@/services/axios/axios.connector";

export const getAdsConfigApi = () => {
  return apiConnector("GET", ADS_ENDPOINTS.GET_ADS_SETTINGS);
};

export const updateAdsConfigApi = (payload) => {
  return apiConnector("POST", ADS_ENDPOINTS.UPDATE_ADS_SETTINGS, payload);
};
