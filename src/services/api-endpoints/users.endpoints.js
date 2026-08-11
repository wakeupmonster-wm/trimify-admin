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

  // ───────────── Per-user Fitzone Assignment CRUD ────────────────────
  /** PUT — Update a fitzone assignment (category or status) */
  UPDATE_FITZONE_ASSIGNMENT: (userId, categoryId) => `${ADMIN}/users/${userId}/fitzone-assignments/${categoryId}`,
  /** DELETE — Remove a fitzone assignment */
  DELETE_FITZONE_ASSIGNMENT: (userId, categoryId) => `${ADMIN}/users/${userId}/fitzone-assignments/${categoryId}`,
  /** POST — Add a new fitzone assignment */
  ADD_FITZONE_ASSIGNMENT: (userId) => `${ADMIN}/users/${userId}/fitzone-assignments`,
  /** GET — Get available (unassigned) fitzone categories */
  AVAILABLE_FITZONE_CATEGORIES: (userId) => `${ADMIN}/users/${userId}/available-fitzone-categories`,
}
