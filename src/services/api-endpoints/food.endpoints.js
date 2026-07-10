/*=============================================================
  FOOD & CATEGORIES MANAGEMENT ENDPOINTS
  Source: APIs2.md → Food & Categories Management
=============================================================*/
import { BASE_URL } from "./base.url";

const ADMIN = `${BASE_URL}/admin`;

// ──────────────────────── Food Categories ───────────────────────────────────────

export const FOOD_CATEGORY = {
  /** GET — Retrieve paginated list of all food categories */
  FOOD_CATEGORY_LIST: `${ADMIN}/get-foodcategories`,

  /** GET — Retrieve all food categories as a flat dropdown list */
  FOOD_CATEGORY_DROPDOWN: `${ADMIN}/get-foodcategoriesdrop`,

  /** POST — Create a new food category */
  FOOD_CATEGORY_ADD: `${ADMIN}/add-foodcategory`,

  /** POST — Update an existing food category */
  FOOD_CATEGORY_UPDATE: (editId) => `${ADMIN}/update-foodcategory/${editId}`,

/** DELETE — Permanently delete a food category */
  FOOD_CATEGORY_DELETE: (id) => `${ADMIN}/delete-foodcategory/${id}`,
}

// ──────────────────────── Food Items ────────────────────────────────────────────

export const FOOD = {
  /** POST — Add a new food item to a program and category */
  FOOD_ADD: `${ADMIN}/add-food`,

  /** POST — Update an existing food item */
  FOOD_UPDATE: (id) => `${ADMIN}/update-food/${id}`,

  /** GET — Retrieve food items for a specific program and food category */
  FOOD_GET_BY_PROGRAM_CATEGORY: (programId, foodCategoryId) => `${ADMIN}/get-food/${programId}/${foodCategoryId}`,
  
  /** PATCH — Toggle food item approval status (Approved / Unapproved) */
  FOOD_TOGGLE_APPROVAL_STATUS: (id) => `${ADMIN}/toggle-status-approveunapprove/${id}`,
  
  /** DELETE — Permanently delete a food item */
  FOOD_DELETE: (id) => `${ADMIN}/delete-food/${id}`,
}
