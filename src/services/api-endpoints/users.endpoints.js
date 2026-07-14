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
}
