/*=============================================================
  AI BULK FOOD UPLOAD ENDPOINTS
  Source: AI_FOOD_UPLOAD_API_CONTRACT.md
=============================================================*/
import { BASE_URL } from "./base.url";

const ADMIN = `${BASE_URL}/admin`;

export const AI_FOOD_ENDPOINTS = {
  /** POST — Start generation for 1-50 food names */
  GENERATE: `${ADMIN}/ai-food/generate`,

  /** GET — Poll a batch's progress */
  BATCH: (batchId) => `${ADMIN}/ai-food/batch/${batchId}`,

  /** GET — List/search all generations (review dashboard) */
  LIST: `${ADMIN}/ai-food`,

  /** PUT — Edit a field before saving */
  UPDATE: (id) => `${ADMIN}/ai-food/${id}`,

  /** POST — Retry a failed item */
  RETRY: (id) => `${ADMIN}/ai-food/${id}/retry`,

  /** POST — Regenerate image for a pre-save (draft/review) item */
  REGENERATE_IMAGE: (id) => `${ADMIN}/ai-food/${id}/regenerate-image`,

  /** POST — Regenerate image for an already-saved catalog item */
  REGENERATE_SAVED_IMAGE: (id) => `${ADMIN}/nutrition/${id}/regenerate-image`,

  /** DELETE — Remove an item from the list */
  DELETE: (id) => `${ADMIN}/ai-food/${id}`,

  /** POST — Save selected items to the live catalog */
  SAVE: `${ADMIN}/ai-food/save`,
};
