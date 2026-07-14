import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserManagementAPI } from "../services/user.services";

// Maps the raw /admin/users API shape to the fields the users table columns expect
const mapUser = (u) => ({
  id: u.id,
  userId: u.user_id,
  userName: u.name,
  emailId: u.email,
  contactNo: u.mobileNo,
  activePlan: u.plan?.plan_name || u.plan?.name || "No-Active Plan",
  planBuy: u.plan?.start_date || u.plan?.purchased_at || "No",
  planExpiry: u.plan?.end_date || u.plan?.expires_at || "No",
  addedBy: u.subAdmin?.name || "",
  status: u.status,
});

// Async Thunk for getting the users list
export const fetchUsersList = createAsyncThunk(
  "userManagement/fetchList",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getUserManagementAPI(params);

      if (response && response.status === "success") {
        const list = response.users || [];
        const meta = response.pagination || {};

        return {
          users: list.map(mapUser),
          pagination: {
            page: meta.current_page || params.page || 1,
            limit: params.limit || 10,
            total: meta.total ?? list.length,
            totalPages: meta.last_page || 1,
          },
        };
      }
      return rejectWithValue(response?.message || "Failed to fetch users");
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
