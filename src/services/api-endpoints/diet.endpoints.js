/*=============================================================
  DIET MEAL DATA ENDPOINTS
  Source: APIs.md → Nutrition / Diet Meal Data
         APIs2.md → Diet Meal Management
         APIs2.md → Diet Plan Management
=============================================================*/
import { BASE_URL } from "./base.url";

const ADMIN = `${BASE_URL}/admin`;

// ────────────── Diet Meal Data (Nutrition Database) ───────────────────
export const DIET_MEAL = {
  /** GET — Retrieve paginated list of diet meal data records */
  DIET_MEAL_DATA_LIST: `${ADMIN}/diet_meal_data`,

  /** PATCH — Toggle active/inactive status of a diet meal data record */
  DIET_MEAL_DATA_TOGGLE_STATUS: (id) => `${ADMIN}/toggle-status-Diet-Meal/${id}`,

  /** POST — Bulk upload diet meal data from a file (multipart/form-data) */
  DIET_MEAL_DATA_UPLOAD_FILE: `${ADMIN}/upload-diet-meal`,

  /** POST — Bulk insert multiple diet meal records from a JSON array */
  DIET_MEAL_DATA_BULK_ADD: `${ADMIN}/add-dietmealbulkupload`,
}


// ────────────── Nutrition (Bulk Food Upload Data) ───────────────────
export const NUTRITION = {
  /** GET — Retrieve list of nutrition/food records */
  NUTRITION_LIST: `${ADMIN}/nutrition`,
}


// ────────────── Diet Plan (Program Day Meal Assignments) ──────────────
export const DIET_PLAN = {
  /** GET — Retrieve all diet meal assignments for a specific program */
  DIET_PLAN_GET_BY_PROGRAM: (id) => `${ADMIN}/get-dietmeal/${id}`,

  /** POST — Assign multiple meals to a specific day in a program's diet plan */
  DIET_PLAN_ADD: `${ADMIN}/add-dietmeal`,

  /** POST — Update the meal assignments for a specific diet plan entry */
  DIET_PLAN_UPDATE: (id) => `${ADMIN}/update-dietmeal/${id}`,

  /** DELETE — Delete a diet plan day entry */
  DIET_PLAN_DELETE: (id) => `${ADMIN}/delete-dietmeal/${id}`,

  /** PATCH — Toggle active/inactive status of a diet plan meal entry */
  DIET_PLAN_TOGGLE_STATUS: (id) => `${ADMIN}/toggle-status-diet-meal/${id}`,

  /** GET — Search the food/nutrition database */
  DIET_PLAN_SEARCH_FOOD: `${ADMIN}/getsearchfood`,
}
