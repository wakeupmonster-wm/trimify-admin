import { apiConnector } from "@/services/axios/axios.connector";
import { BLOG_CATEGORIES, BLOG_POSTS } from "@/services/api-endpoints/blog.endpoints";

export const getBlogCategoriesAPI = async (params = {}) => {
  return apiConnector("GET", BLOG_CATEGORIES.BLOG_CATEGORY_LIST, null, null, params);
};

export const getBlogPostsAPI = async (params = {}) => {
  return apiConnector("GET", BLOG_POSTS.BLOG_POST_LIST, null, null, params);
};
