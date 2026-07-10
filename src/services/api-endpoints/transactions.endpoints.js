/*=============================================================
  TRANSACTIONS ENDPOINTS
  Source: APIs.md → Transactions
=============================================================*/
import { BASE_URL } from "./base.url";

const ADMIN = `${BASE_URL}/admin`;

// ──────────────────────── Transactions ──────────────────────────────────────────

export const TRANSACTION = {
  /** GET — Retrieve paginated list of all transactions */
  TRANSACTION_LIST: `${ADMIN}/get-transactions`,
}

// ──────────────────────── Subscription Plans ────────────────────────────────────

export const SUBSCRIPTION_PLAN = {
  /** GET — Retrieve all subscription plans */
  SUBSCRIPTION_PLAN_LIST: `${ADMIN}/get-subscription-plans`,

  /** POST — Update a subscription plan's details */
  SUBSCRIPTION_PLAN_UPDATE: (id) => `${ADMIN}/update-subscription-plan/${id}`,
}
