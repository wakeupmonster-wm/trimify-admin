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
};
