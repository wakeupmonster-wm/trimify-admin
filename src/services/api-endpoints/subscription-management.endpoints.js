/*=============================================================
  SUBSCRIPTION MANAGEMENT ENDPOINTS
  Two response envelope shapes across this domain:
    Shape A (SUBSCRIPTION_PLAN.*)     -> { status: "success"|"error", ... }
    Shape B (SUBSCRIPTION_DASHBOARD.*) -> { success: true|false, message, data }
=============================================================*/
import { BASE_URL } from "./base.url";

const ADMIN = `${BASE_URL}/admin`;

export const SUBSCRIPTION_PLAN = {
  /** GET — Paginated, searchable list of all subscription plans */
  LIST: `${ADMIN}/subscription`,

  /** POST — Updates only price + features on an existing plan */
  UPDATE: (id) => `${ADMIN}/update-subscription/${id}`,
};

export const SUBSCRIPTION_DASHBOARD = {
  /** GET — Today's revenue, MRR, active subscribers, conversion rate */
  OVERVIEW: `${ADMIN}/subscription/overview`,

  /** GET — revenueTrend, subscriberGrowth, planDistribution (accepts from/to) */
  CHARTS: `${ADMIN}/subscription/charts`,

  /** GET — topSellingPlans, recentTransactions (last 24h) */
  DAILY_PERFORMANCE: `${ADMIN}/subscription/daily-performance`,

  /** GET — Paginated/searchable/filterable subscriber list */
  SUBSCRIBERS: `${ADMIN}/subscription/subscribers`,

  /** PATCH — expire / revoke / upgrade a subscriber */
  MANAGE_SUBSCRIBER: (id) => `${ADMIN}/subscription/subscribers/${id}/manage`,

  /** GET — Paginated/filterable transactions list */
  TRANSACTIONS: `${ADMIN}/subscription/transactions`,

  /** GET — CSV stream (not JSON), same filters as TRANSACTIONS */
  TRANSACTIONS_EXPORT: `${ADMIN}/subscription/transactions/export`,

  /** GET — retentionTrend: month-wise activeUsers/churnedUsers (accepts months) */
  RETENTION_TREND: `${ADMIN}/subscription/retention-trend`,

  /** GET — subscribers whose plan expires within `days` (default 7) */
  EXPIRING_SOON: `${ADMIN}/subscription/subscribers/expiring-soon`,

  /** GET — signed-up-but-unpaid users older than `hours` (default 24) */
  ABANDONED_CHECKOUTS: `${ADMIN}/subscription/subscribers/abandoned-checkouts`,
};
