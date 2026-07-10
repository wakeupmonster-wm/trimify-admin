/*=============================================================
  CMS MANAGEMENT ENDPOINTS
  Source: APIs.md → CMS Management
=============================================================*/
import { BASE_URL } from "./base.url";

const ADMIN = `${BASE_URL}/admin`;

// ── CMS Pages ─────────────────────────────────────────────

export const CMS_MANAGEMENT = {
  /** GET — Retrieve all CMS page records */
  CMS_GET_PAGES: `${ADMIN}/get-cms`,

  /** POST — Update the content of a specific CMS page */
  CMS_UPDATE_CONTENT: (id) => `${ADMIN}/update-cms/${id}`,

  /** PATCH — Toggle a CMS page's active/inactive status */
  CMS_TOGGLE_STATUS: (id) => `${ADMIN}/toggle-status-cms/${id}`,
}
