/*=============================================================
  SUBADMIN MANAGEMENT ENDPOINTS
  Source: APIs.md → SubAdmin Management
=============================================================*/
import { BASE_URL } from "./base.url";

const ADMIN = `${BASE_URL}/admin`;

// ──────────────────────── SubAdmin CRUD ─────────────────────────────────────────

export const SUBADMIN_ENPOINTS = {
  /** POST — Create a new sub-admin account */
  SUBADMIN_ADD: `${ADMIN}/add-subadmin`,

  /** GET — Retrieve the list of all sub-admins */
  SUBADMIN_LIST: `${ADMIN}/view-subadmin`,

  /** POST — Update an existing sub-admin's details */
  SUBADMIN_UPDATE: (id) => `${ADMIN}/update-subadmin/${id}`,

  /** PATCH — Toggle a sub-admin's active/inactive status */
  SUBADMIN_TOGGLE_STATUS: (id) => `${ADMIN}/toggle-status-subadmin/${id}`,

  /** DELETE — Permanently delete a sub-admin */
  SUBADMIN_DELETE: (id) => `${ADMIN}/delete-subadmin/${id}`,
}
