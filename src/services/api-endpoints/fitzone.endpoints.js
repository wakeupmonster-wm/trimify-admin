/*=============================================================
  FITZONE MANAGEMENT ENDPOINTS
  Source: APIs.md  → Fitzone Management
         APIs2.md → Fitzone Management (Additional)
         APIs2.md → Fitzone Workouts & Sessions
=============================================================*/
import { BASE_URL } from "./base.url";

const ADMIN = `${BASE_URL}/admin`;

// ───────────────── Fitzone CRUD ───────────────────────────────

export const FITZONE_CRUD = {
  /** POST — Create a new Fitzone */
  FITZONE_ADD: `${ADMIN}/add-fitzone`,

  /** GET — Retrieve paginated list of all Fitzones */
  FITZONE_LIST: `${ADMIN}/get-fitzones`,

  /** GET — Get the title of a specific Fitzone */
  FITZONE_GET_TITLE: (id) => `${ADMIN}/getworkouttitle/${id}`,

  /** PATCH — Toggle a Fitzone's active/inactive status */
  FITZONE_TOGGLE_STATUS: (id) => `${ADMIN}/toggle-status-fitzone/${id}`,

  /** DELETE — Permanently delete a Fitzone */
  FITZONE_DELETE: (id) => `${ADMIN}/delete-fitzone/${id}`  
}

// ──────────────────────── Fitzone Intro ──────────────────────────────

export const FITZONE_INTRO = {
  /** GET — Retrieve the intro block for a specific Fitzone */
  FITZONE_INTRO_GET: (id) => `${ADMIN}/fitzone-intro/${id}`,

  /** POST — Create an intro block for a Fitzone */
  FITZONE_INTRO_ADD: `${ADMIN}/fitzone-intro`,

  /** POST — Update an existing Fitzone intro */
  FITZONE_INTRO_UPDATE: (id) => `${ADMIN}/fitzone-intro/update/${id}`,
}

// ────────────────── Fitzone Workout Categories ──────────────────────────

export const FITZONE_WORKOUT_CATEGORY = {
  /** GET — Retrieve all workout categories for a Fitzone */
  FITZONE_WORKOUT_CATEGORY_LIST: (id) => `${ADMIN}/fitzone-workoutcat/${id}`,
  
  /** POST — Add a new workout category to a Fitzone */
  FITZONE_WORKOUT_CATEGORY_ADD: `${ADMIN}/add-workoutcat`,
  
  /** POST — Update a workout category */
  FITZONE_WORKOUT_CATEGORY_UPDATE: (id) => `${ADMIN}/update-workoutcat/${id}`,
}

// ────────────────── Fitzone Workouts ──────────────────────────

export const FITZONE_WORKOUT = {
/** GET — Retrieve all workouts within a workout category */
FITZONE_WORKOUT_LIST: (id) => `${ADMIN}/workout/${id}`,

/** POST — Add a new workout exercise to a category */
FITZONE_WORKOUT_ADD: `${ADMIN}/workout`,

/** PUT — Update an existing workout exercise */
FITZONE_WORKOUT_UPDATE: (id) => `${ADMIN}/workout-update/${id}`,

}

// ────────────────── Fitzone Sessions ──────────────────────────
export const FITZONE_SESSION = {
  /** GET — Retrieve all sessions for a Fitzone */
  FITZONE_SESSION_LIST: (id) => `${ADMIN}/fitzone-session/${id}`,
  
  /** POST — Create a new session for a Fitzone */
  FITZONE_SESSION_ADD: `${ADMIN}/add-fitzonesession`,
  
  /** POST — Update an existing Fitzone session */
  FITZONE_SESSION_UPDATE: (id) => `${ADMIN}/update-fitzonesession/${id}`,
  
  /** PATCH — Toggle a Fitzone session's active/inactive status */
  FITZONE_SESSION_TOGGLE_STATUS: (id) => `${ADMIN}/toggle-status-fitzonesession/${id}`,
  
  /** DELETE — Permanently delete a Fitzone session */
  FITZONE_SESSION_DELETE: (id) => `${ADMIN}/delete-fitzonesession/${id}`,
}

// ────────────────── Fitzone Workout-Session Relations ──────────────────────────
export const FITZONE_WORKOUT_SESSION = {
/** GET — Retrieve workout-to-session relation records for a session */
FITZONE_WORKOUT_SESSION_GET: (id) => `${ADMIN}/fitzone-workoutsession/${id}`,

/** PATCH — Toggle a work session's active/inactive status */
FITZONE_WORK_SESSION_TOGGLE_STATUS: (id) => `${ADMIN}/toggle-status-worksession/${id}`,

/** DELETE — Delete a work session record */
FITZONE_WORK_SESSION_DELETE: (id) => `${ADMIN}/delete-worksession/${id}`,
}
