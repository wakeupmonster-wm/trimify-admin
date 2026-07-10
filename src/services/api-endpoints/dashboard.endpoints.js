/*=============================================================
  DASHBOARD ENDPOINTS
  Source: APIs.md → Dashboard
         APIs2.md → Dashboard (Additional)
=============================================================*/
import { BASE_URL } from "./base.url";

const ADMIN = `${BASE_URL}/admin`;

// ── Core Dashboard Stats ──────────────────────────────────
export const DASHBOARD_ENDPOINTS = {
  /** GET — Retrieve sub-admin count for the dashboard */
  DASHBOARD_SUBADMIN_COUNT: `${ADMIN}/subadmin-count`,

  /** GET — Retrieve user count for the dashboard */
  DASHBOARD_USER_COUNT: `${ADMIN}/user-count`,

  /** GET — Retrieve blog post count for the dashboard */
  DASHBOARD_BLOG_COUNT: `${ADMIN}/blog`,

  /** GET — Retrieve program count for the dashboard */
  DASHBOARD_PROGRAM_COUNT: `${ADMIN}/manageprogram`,

  /** GET — Retrieve Fitzone session count for the dashboard */
  DASHBOARD_FITZONE_SESSION_COUNT: `${ADMIN}/fitzonesession`,
}
