import { apiConnector } from "@/services/axios/axios.connector";
import { BLOG_CATEGORIES, BLOG_POSTS } from "@/services/api-endpoints/blog.endpoints";

export const getBlogCategoriesAPI = async (params = {}) => {
  return apiConnector("GET", BLOG_CATEGORIES.BLOG_CATEGORY_LIST, null, null, params);
};

export const getBlogPostsAPI = async (params = {}) => {
  return apiConnector("GET", BLOG_POSTS.BLOG_POST_LIST, null, null, params);
};

// ── Blog Categories Services ──

export const addBlogCategoryAPI = async (data) => {
  return apiConnector("POST", BLOG_CATEGORIES.BLOG_CATEGORY_ADD, data);
};

export const getBlogCategoryByIdAPI = async (id) => {
  return apiConnector("GET", BLOG_CATEGORIES.BLOG_CATEGORY_GET_BY_ID(id));
};

export const getBlogCategoryDropdownAPI = async () => {
  return apiConnector("GET", BLOG_CATEGORIES.BLOG_CATEGORY_DROPDOWN);
};

export const updateBlogCategoryAPI = async (id, data) => {
  return apiConnector("POST", BLOG_CATEGORIES.BLOG_CATEGORY_UPDATE(id), data);
};

export const toggleBlogCategoryStatusAPI = async (id) => {
  return apiConnector("PATCH", BLOG_CATEGORIES.BLOG_CATEGORY_TOGGLE_STATUS(id));
};

export const deleteBlogCategoryAPI = async (id) => {
  return apiConnector("DELETE", BLOG_CATEGORIES.BLOG_CATEGORY_DELETE(id));
};

// ── Blog Posts Services ──

export const addBlogPostAPI = async (data) => {
  return apiConnector("POST", BLOG_POSTS.BLOG_POST_ADD, data);
};

export const updateBlogPostAPI = async (id, data) => {
  return apiConnector("POST", BLOG_POSTS.BLOG_POST_UPDATE(id), data);
};

export const toggleBlogPostStatusAPI = async (id) => {
  return apiConnector("PATCH", BLOG_POSTS.BLOG_POST_TOGGLE_STATUS(id));
};

export const toggleBlogPostVisibilityAPI = async (id, data) => {
  return apiConnector("PATCH", BLOG_POSTS.BLOG_POST_TOGGLE_VISIBILITY(id), data);
};

export const deleteBlogPostAPI = async (id) => {
  return apiConnector("DELETE", BLOG_POSTS.BLOG_POST_DELETE(id));
};
