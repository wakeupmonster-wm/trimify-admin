/*=============================================================
  NOTIFICATION MANAGEMENT ENDPOINTS
  Source: APIs.md → Notification Management
=============================================================*/
import { BASE_URL } from "./base.url";

const ADMIN = `${BASE_URL}/admin`;

// ──────────────────────── Notifications ─────────────────────────────────────────

export const NOTIFICATION = {
  /** POST — Send a push notification to all users */
  NOTIFICATION_SEND: `${ADMIN}/add-notification`,
  
  /** GET — Retrieve list of sent notifications (paginated) */
  NOTIFICATION_LIST: `${ADMIN}/get-notification`,
}


export const CAMPAIGNS = {
  /** POST: Push notification */
  PUSH_NOTIFICATION: `${ADMIN}/campaigns/push`,

  /** POST: Email notification */
  EMAIL_NOTIFICATION: `${ADMIN}/campaigns/email`,

  /** GET: Push notification History */
  PUSH_HISTORY: `${ADMIN}/campaigns/push/history`,

  /** GET: Email notification History */
  EMAIL_HISTORY: `${ADMIN}/campaigns/email/history`,

  /** GET: Campaign history */
  CAMPAIGN_HISTORY: `${ADMIN}/campaigns/history`,

  /** GET: Campaign delivery report */
  CAMPAIGN_DELIVERY_REPORT: `${ADMIN}/campaigns/:channel/:id/delivery-report`,
};