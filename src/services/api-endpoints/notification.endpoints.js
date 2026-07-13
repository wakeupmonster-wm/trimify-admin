/*=============================================================
  NOTIFICATION MANAGEMENT ENDPOINTS
  Source: APIs.md → Notification Management
=============================================================*/
import { BASE_URL } from "./base.url";

const ADMIN = `${BASE_URL}/admin`;

// ──────────────────────── Notifications ─────────────────────────────────────────

export const NOTIFICATION = {
  /** POST — Send a push notification to all users */
  NOTIFICATION_SEND: `${ADMIN}/send-notification`,
  
  /** GET — Retrieve list of sent notifications (paginated) */
  NOTIFICATION_LIST: `${ADMIN}/get-notification`,
}
