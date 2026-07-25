import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  getBlogCategoriesAPI, 
  getBlogPostsAPI,
  addBlogCategoryAPI,
  getBlogCategoryByIdAPI,
  getBlogCategoryDropdownAPI,
  updateBlogCategoryAPI,
  toggleBlogCategoryStatusAPI,
  deleteBlogCategoryAPI,
  addBlogPostAPI,
  updateBlogPostAPI,
  toggleBlogPostStatusAPI,
  toggleBlogPostVisibilityAPI,
  deleteBlogPostAPI
} from "../services/blog.services";

export const fetchBlogCategories = createAsyncThunk(
  "blogSection/fetchCategories",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getBlogCategoriesAPI(params);

      if (response && (response.success || response.status === "success")) {
        const pag = response.pagination || {};
        return {
          categories: response.blogs || response.data || response.categories || [],
          pagination: {
            page: pag.current_page || 1,
            limit: pag.per_page || 10,
            total: pag.total || 0,
            totalPages: pag.last_page || 0,
          },
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

      if (response && (response.success || response.status === "success")) {
        const pag = response.pagination || {};
        return {
          posts: response.blogs || response.data || response.posts || [],
          pagination: {
            page: pag.current_page || 1,
            limit: pag.per_page || 10,
            total: pag.total || 0,
            totalPages: pag.last_page || 0,
          },
        };
      }
      return rejectWithValue(response.message || "Failed to fetch blog posts");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch blog posts");
    }
  }
);

export const addBlogCategory = createAsyncThunk(
  "blogSection/addCategory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await addBlogCategoryAPI(data);
      if (response && (response.success || response.status === "success")) return response;
      return rejectWithValue(response.message || "Failed to add category");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add category");
    }
  }
);

export const getBlogCategoryById = createAsyncThunk(
  "blogSection/getCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getBlogCategoryByIdAPI(id);
      if (response && (response.success || response.status === "success")) return response.data;
      return rejectWithValue(response.message || "Failed to get category");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get category");
    }
  }
);

export const fetchBlogCategoryDropdown = createAsyncThunk(
  "blogSection/fetchCategoryDropdown",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getBlogCategoryDropdownAPI();
      if (response && (response.success || response.status === "success")) return response.blogcategories || response.data || response.categories || [];
      return rejectWithValue(response.message || "Failed to fetch categories");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch categories");
    }
  }
);

export const updateBlogCategory = createAsyncThunk(
  "blogSection/updateCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateBlogCategoryAPI(id, data);
      if (response && (response.success || response.status === "success")) return response;
      return rejectWithValue(response.message || "Failed to update category");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update category");
    }
  }
);

export const toggleBlogCategoryStatus = createAsyncThunk(
  "blogSection/toggleCategoryStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await toggleBlogCategoryStatusAPI(id, { status });
      if (response && (response.success || response.status === "success")) return { id, ...response };
      return rejectWithValue(response.message || "Failed to toggle status");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to toggle status");
    }
  }
);

export const deleteBlogCategory = createAsyncThunk(
  "blogSection/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteBlogCategoryAPI(id);
      if (response && (response.success || response.status === "success")) return id;
      return rejectWithValue(response.message || "Failed to delete category");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete category");
    }
  }
);

export const addBlogPost = createAsyncThunk(
  "blogSection/addPost",
  async (data, { rejectWithValue }) => {
    try {
      const response = await addBlogPostAPI(data);
      if (response && (response.success || response.status === "success")) return response;
      return rejectWithValue(response.message || "Failed to add blog post");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add post");
    }
  }
);

export const updateBlogPost = createAsyncThunk(
  "blogSection/updatePost",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateBlogPostAPI(id, data);
      if (response && (response.success || response.status === "success")) return response;
      return rejectWithValue(response.message || "Failed to update blog post");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update post");
    }
  }
);

export const toggleBlogPostStatus = createAsyncThunk(
  "blogSection/togglePostStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await toggleBlogPostStatusAPI(id);
      if (response && (response.success || response.status === "success")) return { id, ...response };
      return rejectWithValue(response.message || "Failed to toggle post status");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to toggle status");
    }
  }
);

export const toggleBlogPostVisibility = createAsyncThunk(
  "blogSection/togglePostVisibility",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await toggleBlogPostVisibilityAPI(id, { status });
      if (response && (response.success || response.status === "success")) return { id, ...response };
      return rejectWithValue(response.message || "Failed to toggle post visibility");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to toggle visibility");
    }
  }
);

export const deleteBlogPost = createAsyncThunk(
  "blogSection/deletePost",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteBlogPostAPI(id);
      if (response && (response.success || response.status === "success")) return id;
      return rejectWithValue(response.message || "Failed to delete blog post");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete post");
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
      })
      // Category mutations
      // addBlogCategory
      .addCase(addBlogCategory.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(addBlogCategory.fulfilled, (state) => {
        state.categoriesLoading = false;
      })
      .addCase(addBlogCategory.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.payload;
      })
      // updateBlogCategory
      .addCase(updateBlogCategory.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(updateBlogCategory.fulfilled, (state) => {
        state.categoriesLoading = false;
      })
      .addCase(updateBlogCategory.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.payload;
      })
      // toggleBlogCategoryStatus
      .addCase(toggleBlogCategoryStatus.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(toggleBlogCategoryStatus.fulfilled, (state) => {
        state.categoriesLoading = false;
      })
      .addCase(toggleBlogCategoryStatus.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.payload;
      })
      // deleteBlogCategory
      .addCase(deleteBlogCategory.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(deleteBlogCategory.fulfilled, (state) => {
        state.categoriesLoading = false;
      })
      .addCase(deleteBlogCategory.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.payload;
      })
      // getBlogCategoryById
      .addCase(getBlogCategoryById.pending, (state) => {
      state.categoriesLoading = true;
      state.categoriesError = null;
      })
      .addCase(getBlogCategoryById.fulfilled, (state) => {
        state.categoriesLoading = false;
      })
      .addCase(getBlogCategoryById.rejected, (state, action) => {
        state.categoriesLoading = false;
      state.categoriesError = action.payload;
      })
      // fetchBlogCategoryDropdown
      .addCase(fetchBlogCategoryDropdown.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchBlogCategoryDropdown.fulfilled, (state) => {
        state.categoriesLoading = false;
      })
      .addCase(fetchBlogCategoryDropdown.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.payload;
      })

      // Post mutations
      // addBlogPost
      .addCase(addBlogPost.pending, (state) => {
        state.postsLoading = true;
        state.postsError = null;
      })
      .addCase(addBlogPost.fulfilled, (state) => {
        state.postsLoading = false;
      })
      .addCase(addBlogPost.rejected, (state, action) => {
        state.postsLoading = false;
        state.postsError = action.payload;
      })
      // updateBlogPost
      .addCase(updateBlogPost.pending, (state) => {
        state.postsLoading = true;
        state.postsError = null;
      })
      .addCase(updateBlogPost.fulfilled, (state) => {
        state.postsLoading = false;
      })
      .addCase(updateBlogPost.rejected, (state, action) => {
        state.postsLoading = false;
        state.postsError = action.payload;
      })
    // toggleBlogPostStatus
      .addCase(toggleBlogPostStatus.pending, (state) => {
        state.postsLoading = true;
        state.postsError = null;
      })
      .addCase(toggleBlogPostStatus.fulfilled, (state) => {
        state.postsLoading = false;
      })
      .addCase(toggleBlogPostStatus.rejected, (state, action) => {
        state.postsLoading = false;
        state.postsError = action.payload;
      })
      // toggleBlogPostVisibility
      .addCase(toggleBlogPostVisibility.pending, (state) => {
        state.postsLoading = true;
        state.postsError = null;
      })
      .addCase(toggleBlogPostVisibility.fulfilled, (state) => {
        state.postsLoading = false;
      })
      .addCase(toggleBlogPostVisibility.rejected, (state, action) => {
        state.postsLoading = false;
        state.postsError = action.payload;
      })
      // deleteBlogPost
      .addCase(deleteBlogPost.pending, (state) => {
        state.postsLoading = true;
        state.postsError = null;
      })
      .addCase(deleteBlogPost.fulfilled, (state) => {
        state.postsLoading = false;
      })
      .addCase(deleteBlogPost.rejected, (state, action) => {
        state.postsLoading = false;
        state.postsError = action.payload;
      });
  },
});

export const { setCategoryPage, setPostPage, clearBlogState } = blogSectionSlice.actions;
export default blogSectionSlice.reducer;
