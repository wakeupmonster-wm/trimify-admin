/*=============================================================
  TRANSACTIONS ENDPOINTS
  Source: APIs.md → Transactions
=============================================================*/
import { BASE_URL } from "./base.url";

const ADMIN = `${BASE_URL}/admin`;

// ──────────────────────── Transactions ──────────────────────────────────────────

export const TRANSACTION = {
  /** GET — Retrieve paginated list of all transactions */
  TRANSACTION_LIST: `${ADMIN}/transactions`,
}
