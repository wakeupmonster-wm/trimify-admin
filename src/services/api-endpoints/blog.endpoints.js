/*=============================================================
  BLOG MANAGEMENT ENDPOINTS
  Source: APIs.md → Blog Management
         APIs2.md → Blog Management (Additional)
=============================================================*/
import { BASE_URL } from "./base.url";

const ADMIN = `${BASE_URL}/admin`;

// ── Blog Categories ───────────────────────────────────────

export const BLOG_CATEGORIES = {
/** POST — Create a new blog category */
  BLOG_CATEGORY_ADD: `${ADMIN}/add-blog-category`,
  
  /** GET — Retrieve paginated list of all blog categories */
  BLOG_CATEGORY_LIST: `${ADMIN}/get-blog-categories`,
  
  /** GET — Retrieve full details of a single blog category (for edit form) */
  BLOG_CATEGORY_GET_BY_ID: (id) => `${ADMIN}/edit-blog-category/${id}`,
  
  /** GET — Retrieve all blog categories as a flat dropdown list */
  BLOG_CATEGORY_DROPDOWN: `${ADMIN}/get-blogcategoriesdrop`,
  
  /** POST — Update an existing blog category */
  BLOG_CATEGORY_UPDATE: (id) => `${ADMIN}/update-blog-category/${id}`,
  
  /** PATCH — Toggle a blog category's active/inactive status */
  BLOG_CATEGORY_TOGGLE_STATUS: (id) => `${ADMIN}/toggle-status-blog-category/${id}`,
  
  /** DELETE — Permanently delete a blog category */
  BLOG_CATEGORY_DELETE: (id) => `${ADMIN}/delete-blog-category/${id}`,
}
  
// ────────── Blog Posts ──────────────────────────

export const BLOG_POSTS = {
  /** POST — Create a new blog post */
  BLOG_POST_ADD: `${ADMIN}/add-blog`,
  
  /** GET — Retrieve paginated list of all blog posts */
  BLOG_POST_LIST: `${ADMIN}/get-blogs`,
  
  /** POST — Update an existing blog post */
  BLOG_POST_UPDATE: (id) => `${ADMIN}/update-blog/${id}`,
  
  /** DELETE — Permanently delete a blog post */
  BLOG_POST_DELETE: (id) => `${ADMIN}/delete-blog/${id}`,
  
  /** PATCH — Toggle a blog post's active/inactive status */
  BLOG_POST_TOGGLE_STATUS: (id) => `${ADMIN}/toggle-status-blog/${id}`,
  
  /** PATCH — Toggle a blog post's public/private visibility */
  BLOG_POST_TOGGLE_VISIBILITY: (id) => `${ADMIN}/toggle-publish-private/${id}`,
}
