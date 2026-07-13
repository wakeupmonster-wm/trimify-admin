/*=============================================================
  FAQ MANAGEMENT ENDPOINTS
  Source: APIs.md → FAQ Management
=============================================================*/
import { BASE_URL } from "./base.url";

const ADMIN = `${BASE_URL}/admin`;

// ───────────────── FAQ CRUD ─────────────────────────────────

export const FAQ_CRUD = {
  /** POST — Create a new FAQ entry */
  FAQ_ADD: `${ADMIN}/add-faq`,

  /** GET — Retrieve all FAQ entries (paginated) */
  FAQ_LIST: `${ADMIN}/view-faqs`,

  /** POST — Update an existing FAQ entry */
  FAQ_UPDATE: (id) => `${ADMIN}/update-faq/${id}`,

  /** PATCH — Toggle a FAQ's active/inactive status */
  FAQ_TOGGLE_STATUS: (id) => `${ADMIN}/toggle-status-faq/${id}`,

  /** DELETE — Permanently delete a FAQ entry */
  FAQ_DELETE: (id) => `${ADMIN}/delete-faq/${id}`,
}
