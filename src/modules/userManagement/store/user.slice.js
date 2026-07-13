import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserManagementAPI } from "../services/user.services";

// Async Thunk for getting the users list
export const fetchUsersList = createAsyncThunk(
  "userManagement/fetchList",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getUserManagementAPI(params);

      if (response && response.status === "success") {
        return {
          users: response.users || [],
          pagination: {
            page: response.pagination?.current_page || 1,
            limit: 10, // default limit if not specified
            total: response.pagination?.total || 0,
            totalPages: response.pagination?.last_page || 1,
          },
        };
      }
      return rejectWithValue(response.message || "Failed to fetch users");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

const userManagementSlice = createSlice({
  name: "userManagement",
  initialState: {
    users: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  },
  reducers: {
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearUserState: (state) => {
      state.users = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersList.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsersList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, clearUserState } = userManagementSlice.actions;
export default userManagementSlice.reducer;
