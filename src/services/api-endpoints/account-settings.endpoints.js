/*=============================================================
  ACCOUNT SETTINGS ENDPOINTS
  Source: APIs.md → Account Settings
=============================================================*/
import { BASE_URL } from "./base.url";

const ADMIN = `${BASE_URL}/admin`;

// ── Account Settings ──────────────────────────────────────

export const ACCOUNT_SETTING = {
  /** POST — Change the logged-in admin's password */
  ACCOUNT_CHANGE_PASSWORD: `${ADMIN}/change-password`,
  
  /** POST — Request to update the admin's email address */
  ACCOUNT_UPDATE_EMAIL: `${ADMIN}/update-email`,

  /** POST — Verify OTP sent to the new email address */
  ACCOUNT_VERIFY_EMAIL_OTP: `${ADMIN}/verify-email-otp`,
}