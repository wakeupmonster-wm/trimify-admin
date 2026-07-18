/*=============================================================
  PROGRAM MANAGEMENT ENDPOINTS
  Source: APIs.md → Program Management
         APIs2.md → Program Management (Additional)
         APIs2.md → Program Introduction
=============================================================*/
import { BASE_URL } from "./base.url";

const ADMIN = `${BASE_URL}/admin`;

// ──────────────────────── Program CRUD ──────────────────────────────────────────

export const PROGRAM = {
  /** POST — Create a new health program */
  PROGRAM_ADD: `${ADMIN}/add-program`,

  /** GET — Retrieve paginated list of all programs */
  PROGRAM_LIST: `${ADMIN}/view-programs`,

  /** GET — Retrieve full details of a single program (for edit form) */
  PROGRAM_GET_BY_ID: (id) => `${ADMIN}/edit-program/${id}`,

  /** POST — Update an existing program */
  PROGRAM_UPDATE: (id) => `${ADMIN}/update-program/${id}`,

  /** DELETE — Permanently delete a program */
  PROGRAM_DELETE: (id) => `${ADMIN}/delete-program/${id}`,

  /** PATCH — Toggle a program's active/inactive status */
  PROGRAM_TOGGLE_STATUS: (id) => `${ADMIN}/toggle-status-program/${id}`,

  /** PATCH — Toggle food visibility for a program */
  PROGRAM_TOGGLE_FOOD_VISIBILITY: (id) => `${ADMIN}/toggle-status-food-visibility/${id}`,

  /** GET — Get the current food visibility state for a program */
  PROGRAM_GET_FOOD_VISIBILITY: (id) => `${ADMIN}/program-food-visibility/${id}`,

  /** POST — Replicate (clone) an existing program */
  PROGRAM_REPLICATE: (id) => `${ADMIN}/replicate-program/${id}`,

  /** GET — Retrieve list of users assigned to a program */
  PROGRAM_VIEW_ASSIGNED_USERS: (id) => `${ADMIN}/view-programassigneduser/${id}`,

  /** GET — Get the total duration (in days) of a program */
  PROGRAM_GET_DURATION: (id) => `${ADMIN}/getprogramduration/${id}`,
}

// ──────────────────────── Program Introduction ──────────────────────────────────

export const PROGRAM_INTRO = {
  /** GET — Retrieve the intro block for a specific program */
  PROGRAM_INTRO_GET: (id) => `${ADMIN}/program-intro/${id}`,

  /** POST — Create an intro block for a program */
  PROGRAM_INTRO_ADD: `${ADMIN}/program-intro`,

  /** POST — Update an existing program intro */
  PROGRAM_INTRO_UPDATE: (id) => `${ADMIN}/program-intro/update/${id}`,
}

// ──────────────────────── Food & Categories Management ────────────────────────

export const PROGRAM_FOOD = {
  /** GET — Retrieve all food categories (paginated) */
  FOOD_CATEGORY_LIST: `${ADMIN}/get-foodcategories`,

  /** GET — Retrieve all food categories (dropdown/unpaginated) */
  FOOD_CATEGORY_DROP: `${ADMIN}/get-foodcategoriesdrop`,

  /** POST — Add a new food category */
  FOOD_CATEGORY_ADD: `${ADMIN}/add-foodcategory`,

  /** POST — Update an existing food category */
  FOOD_CATEGORY_UPDATE: (id) => `${ADMIN}/update-foodcategory/${id}`,

  /** DELETE — Delete a food category */
  FOOD_CATEGORY_DELETE: (id) => `${ADMIN}/delete-foodcategory/${id}`,

  /** GET — Retrieve all food items for a program + category */
  FOOD_LIST: (programId, categoryId) => `${ADMIN}/get-food/${programId}/${categoryId}`,

  /** POST — Add a new food item */
  FOOD_ADD: `${ADMIN}/add-food`,

  /** POST — Update a food item */
  FOOD_UPDATE: (id) => `${ADMIN}/update-food/${id}`,

  /** PATCH — Toggle food approval status */
  FOOD_TOGGLE_STATUS: (id) => `${ADMIN}/toggle-status-approveunapprove/${id}`,

  /** DELETE — Delete a food item */
  FOOD_DELETE: (id) => `${ADMIN}/delete-food/${id}`,
}

// ──────────────────────── Diet Plan Management ────────────────────────────────

export const PROGRAM_DIET = {
  /** GET — Retrieve diet meals for a program */
  DIET_MEAL_LIST: (id) => `${ADMIN}/get-dietmeal/${id}`,

  /** POST — Add multiple diet meals to a day */
  DIET_MEAL_ADD: `${ADMIN}/add-dietmeal`,

  /** POST — Update a diet meal record */
  DIET_MEAL_UPDATE: (id) => `${ADMIN}/update-dietmeal/${id}`,

  /** DELETE — Delete a diet meal record */
  DIET_MEAL_DELETE: (id) => `${ADMIN}/delete-dietmeal/${id}`,

  /** GET — Get program duration in days */
  PROGRAM_DURATION: (id) => `${ADMIN}/getprogramduration/${id}`,

  /** GET — Search food/nutrition database */
  SEARCH_FOOD: `${ADMIN}/getsearchfood`,

  /** PATCH — Toggle diet meal status */
  DIET_MEAL_TOGGLE_STATUS: (id) => `${ADMIN}/toggle-status-diet-meal/${id}`,
}