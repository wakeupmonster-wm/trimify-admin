/*=============================================================
  ADMIN AUTH ENDPOINTS
  Source: APIs.md → Admin Auth
=============================================================*/
import { BASE_URL } from "./base.url";

const ADMIN = `${BASE_URL}/admin`;

// ── Authentication ────────────────────────────────────────
export const AUTHENTICATION_ENDPOINTS = {
  /** POST — Authenticate admin with email & password (triggers OTP) */
  ADMIN_LOGIN: `${ADMIN}/login`,

  // /** POST — Verify the OTP sent after login */
  // ADMIN_VERIFY_LOGIN_OTP: `${ADMIN}/verify-login-otp`,

  // /** POST — Invalidate the current admin session */
  // ADMIN_LOGOUT: `${ADMIN}/logout`,
};
