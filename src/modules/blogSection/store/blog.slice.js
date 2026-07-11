import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getBlogCategoriesAPI, getBlogPostsAPI } from "../services/blog.services";

export const fetchBlogCategories = createAsyncThunk(
  "blogSection/fetchCategories",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getBlogCategoriesAPI(params);

      if (response && response.success) {
        return {
          categories: response.data || response.categories || [],
          pagination: response.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
        };
      }
      return rejectWithValue(response.message || "Failed to fetch categories");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch categories");
    }
  }
);

export const fetchBlogPosts = createAsyncThunk(
  "blogSection/fetchPosts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getBlogPostsAPI(params);

      if (response && response.success) {
        return {
          posts: response.data || response.blogs || response.posts || [],
          pagination: response.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
        };
      }
      return rejectWithValue(response.message || "Failed to fetch blog posts");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch blog posts");
    }
  }
);

const blogSectionSlice = createSlice({
  name: "blogSection",
  initialState: {
    categories: [],
    categoriesLoading: false,
    categoriesError: null,
    categoriesPagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    
    posts: [],
    postsLoading: false,
    postsError: null,
    postsPagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  },
  reducers: {
    setCategoryPage: (state, action) => {
      state.categoriesPagination.page = action.payload;
    },
    setPostPage: (state, action) => {
      state.postsPagination.page = action.payload;
    },
    clearBlogState: (state) => {
      state.categories = [];
      state.posts = [];
      state.categoriesError = null;
      state.postsError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Categories
      .addCase(fetchBlogCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchBlogCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload.categories;
        state.categoriesPagination = action.payload.pagination;
      })
      .addCase(fetchBlogCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.payload;
      })
      // Posts
      .addCase(fetchBlogPosts.pending, (state) => {
        state.postsLoading = true;
        state.postsError = null;
      })
      .addCase(fetchBlogPosts.fulfilled, (state, action) => {
        state.postsLoading = false;
        state.posts = action.payload.posts;
        state.postsPagination = action.payload.pagination;
      })
      .addCase(fetchBlogPosts.rejected, (state, action) => {
        state.postsLoading = false;
        state.postsError = action.payload;
      });
  },
});

export const { setCategoryPage, setPostPage, clearBlogState } = blogSectionSlice.actions;
export default blogSectionSlice.reducer;
