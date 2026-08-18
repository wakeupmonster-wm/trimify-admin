import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserManagementAPI, getSingleUserProfileAPI, deleteUserAPI } from "../services/user.services";

// Backend TODO: `GET /admin/users` should return a `kpis` object alongside
// `users`/`pagination`, aggregated over the FULL table (not just the current
// page) — { totalUsers, activeUsers, inactiveUsers, newSignupsToday }.
// Until the backend sends it, `kpis` stays null and the KPI row on
// UsersManagementPage renders a loading placeholder instead of a
// page-local (and therefore wrong) count.

// Async Thunk for getting the users list
export const fetchUsersList = createAsyncThunk(
  "userManagement/fetchList",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getUserManagementAPI(params);

      if (response && response.status === "success") {
        return {
          users: response.users || [],
          kpis: response.kpis || null,
          pagination: {
            page: response.pagination?.current_page || response.pagination?.page || 1,
            limit: response.pagination?.per_page || 10,
            total: response.pagination?.total || 0,
            totalPages: response.pagination?.totalPage || response.pagination?.last_page || 1,
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

export const fetchSingleUserProfile = createAsyncThunk(
  "userManagement/fetchSingleUserProfile",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getSingleUserProfileAPI(id);
      if (response && (response.status === "success" || response.id)) {
        return response.user || response.data || response;
      }
      return rejectWithValue(response.message || "Failed to fetch user profile");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user profile"
      );
    }
  }
);

export const deleteUserThunk = createAsyncThunk(
  "userManagement/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteUserAPI(id);
      if (response?.status === "success" || response?.data?.success || response?.status === 200 || response?.status === 204) {
        return id;
      }
      return rejectWithValue(response?.data?.message || response?.message || "Failed to delete user");
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || "Failed to delete user"
      );
    }
  }
);

const userManagementSlice = createSlice({
  name: "userManagement",
  initialState: {
    users: [],
    kpis: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    currentUser: null,
    currentUserLoading: false,
    currentUserError: null,
  },
  reducers: {
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearUserState: (state) => {
      state.users = [];
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.currentUserError = null;
      state.currentUserLoading = false;
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
        state.kpis = action.payload.kpis;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsersList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSingleUserProfile.pending, (state) => {
        state.currentUserLoading = true;
        state.currentUserError = null;
      })
      .addCase(fetchSingleUserProfile.fulfilled, (state, action) => {
        state.currentUserLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchSingleUserProfile.rejected, (state, action) => {
        state.currentUserLoading = false;
        state.currentUserError = action.payload;
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  },
});

export const { setPage, clearUserState, clearCurrentUser } = userManagementSlice.actions;
export default userManagementSlice.reducer;
