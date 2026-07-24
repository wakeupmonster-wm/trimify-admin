/*=============================================================
  USER MANAGEMENT ENDPOINTS
  Source: APIs.md → Users
=============================================================*/
import { BASE_URL } from "./base.url";

const ADMIN = `${BASE_URL}/admin`;

// ───────────── Users ─────────────────────────────────────────────────

export const USER = {
  /** GET — Retrieve paginated list of all app users (with plan & subAdmin relations) */
  USER_LIST: `${ADMIN}/users`,
  /** GET — Retrieve a single user's profile details */
  VIEW_USER_PROFILE: (id) => `${ADMIN}/view-user-profile/${id}`,
  /** GET — Retrieve user's transactions */
  USER_TRANSACTIONS: (id) => `${ADMIN}/users/${id}/transactions`,
  /** DELETE — Soft delete user */
  DELETE_USER: (id) => `${ADMIN}/users/${id}`,
}
