/*=============================================================
  DASHBOARD ENDPOINTS
  Source: APIs.md → Dashboard
         APIs2.md → Dashboard (Additional)
=============================================================*/
import { BASE_URL } from "./base.url";

const ADMIN = `${BASE_URL}/admin`;

// ── Core Dashboard Stats ──────────────────────────────────
export const DASHBOARD_ENDPOINTS = {
  SUMMARY: `${ADMIN}/dashboard/summary`,
  CONTENT_CHARTS: `${ADMIN}/dashboard/content-charts`,
  REVENUE_CHARTS: `${ADMIN}/dashboard/revenue-charts`,
  ENGAGEMENT_CHARTS: `${ADMIN}/dashboard/engagement-charts`,
  RECENT_ACTIVITY: `${ADMIN}/dashboard/recent-activity`,
}
