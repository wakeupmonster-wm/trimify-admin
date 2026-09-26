import { apiConnector } from "@/services/axios/axios.connector";
import { AUTHENTICATION_ENDPOINTS } from "@/services/api-endpoints/admin-auth.endpoints";

export const adminLoginAPI = (data) => {
  return apiConnector("POST", AUTHENTICATION_ENDPOINTS.ADMIN_LOGIN, data);
};

export const adminForgotPasswordAPI = (data) => {
  return apiConnector("POST", AUTHENTICATION_ENDPOINTS.ADMIN_FORGOT_PASSWORD, data);
};

export const adminVerifyForgotOtpAPI = (data) => {
  return apiConnector("POST", AUTHENTICATION_ENDPOINTS.ADMIN_VERIFY_FORGOT_OTP, data);
};

export const adminResetPasswordAPI = (data) => {
  return apiConnector("POST", AUTHENTICATION_ENDPOINTS.ADMIN_RESET_PASSWORD, data);
};
