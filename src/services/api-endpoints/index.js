/*=============================================================
  API ENDPOINTS — BARREL EXPORT
  Trimify Admin API v1.0.0

  Usage:
    import { ADMIN_LOGIN, PROGRAM_LIST, FITZONE_ADD } from "@/services/api-endpoints";

  Source of truth:
    - public/docs/APIs.md
    - public/docs/APIs2.md
=============================================================*/

export * from "./base.url";

// ── Auth & Account ────────────────────────────────────────
export * from "./admin-auth.endpoints";
export * from "./account-settings.endpoints";

// ── Admin Users ───────────────────────────────────────────
export * from "./subadmin.endpoints";
export * from "./users.endpoints";

// ── Dashboard ─────────────────────────────────────────────
export * from "./dashboard.endpoints";

// ── CMS & Content ─────────────────────────────────────────
export * from "./cms.endpoints";
export * from "./faq.endpoints";
export * from "./notification.endpoints";

// ── Blog ──────────────────────────────────────────────────
export * from "./blog.endpoints";

// ── Programs ──────────────────────────────────────────────
export * from "./program.endpoints";

// ── Food & Diet ───────────────────────────────────────────
export * from "./food.endpoints";
export * from "./diet.endpoints";

// ── Fitzone ───────────────────────────────────────────────
export * from "./fitzone.endpoints";

// ── Transactions ──────────────────────────────────────────
export * from "./transactions.endpoints";
