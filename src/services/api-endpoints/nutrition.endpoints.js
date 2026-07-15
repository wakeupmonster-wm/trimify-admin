/*=============================================================
  NUTRITION / DIET MEAL DATA ENDPOINTS
  Source: APIs.md → 9. Nutrition / Diet Meal Data
=============================================================*/
import { BASE_URL } from "./base.url";

const ADMIN = `${BASE_URL}/admin`;

export const NUTRITION_ENDPOINTS = {
  /** GET — Retrieve a paginated list of all active nutrition/meal records */
  NUTRITION_LIST: `${ADMIN}/nutrition`,

  /** POST — Create a new nutrition/meal record */
  NUTRITION_ADD: `${ADMIN}/add-nutrition`,

  /** POST — Update an existing nutrition/meal record by its ID */
  NUTRITION_UPDATE: (id) => `${ADMIN}/update-nutrition/${id}`,

  /** POST — Bulk imports nutrition records */
  NUTRITION_UPLOAD: `${ADMIN}/upload-nutrition`,
};
