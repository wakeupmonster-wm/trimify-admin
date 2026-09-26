/*=============================================================
  ADMIN AUTH ENDPOINTS
  Source: APIs.md → Admin Auth
=============================================================*/
import { BASE_URL } from "./base.url";

const ADMIN = `${BASE_URL}/admin`;

// ── Authentication ────────────────────────────────────────
export const AUTHENTICATION_ENDPOINTS = {
  /** POST — Authenticate admin with email & password */
  ADMIN_LOGIN: `${ADMIN}/login`,

  /** POST — Send OTP to admin email for password reset */
  ADMIN_FORGOT_PASSWORD: `${ADMIN}/forgot-password`,

  /** POST — Verify the 6-digit OTP sent to admin email */
  ADMIN_VERIFY_FORGOT_OTP: `${ADMIN}/verify-forgot-otp`,

  /** POST — Reset admin password with verified OTP */
  ADMIN_RESET_PASSWORD: `${ADMIN}/reset-password`,

  // /** POST — Invalidate the current admin session */
  // ADMIN_LOGOUT: `${ADMIN}/logout`,
};
