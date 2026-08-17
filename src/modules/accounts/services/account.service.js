import { apiConnector } from "@/services/axios/axios.connector";
import { ACCOUNT_SETTING } from "@/services/api-endpoints/account-settings.endpoints";

export const getAdminAccountAPI = () => {
  return apiConnector("GET", ACCOUNT_SETTING.ACCOUNT_PROFILE);
};

export const patchAdminAccountAPI = (payload) => {
  return apiConnector("POST", ACCOUNT_SETTING.ACCOUNT_PROFILE_UPDATE, payload, {
    "Content-Type": "multipart/form-data",
  });
};

export const changePasswordAPI = async (data) => {
  return apiConnector("POST", ACCOUNT_SETTING.ACCOUNT_CHANGE_PASSWORD, data);
};

export const updateEmailAPI = async (data) => {
  return apiConnector("POST", ACCOUNT_SETTING.ACCOUNT_UPDATE_EMAIL, data);
};

export const verifyEmailOtpAPI = async (data) => {
  return apiConnector("POST", ACCOUNT_SETTING.ACCOUNT_VERIFY_EMAIL_OTP, data);
};
