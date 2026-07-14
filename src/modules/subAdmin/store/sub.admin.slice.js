import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSubAdminManagementAPI } from "../services/sub.admin.services";

// Async Thunk for getting the list
export const fetchSubAdminList = createAsyncThunk(
  "subAdmin/fetchList",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getSubAdminManagementAPI(params);

      if (response && response.status === "success") {
        const list = response.subAdmins || [];
        const meta = response.pagination || {};

        return {
          subAdmins: list,
          pagination: {
            page: meta.current_page || params.page || 1,
            limit: params.limit || 10,
            total: meta.total ?? list.length,
            totalPages: meta.last_page || 1,
          },
        };
      }
      return rejectWithValue(response?.message || "Failed to fetch sub admins");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sub admins"
      );
    }
  }
);

const subAdminSlice = createSlice({
  name: "subAdmin",
  initialState: {
    subAdmins: [],
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
    clearSubAdminState: (state) => {
      state.subAdmins = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchSubAdminList
      .addCase(fetchSubAdminList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubAdminList.fulfilled, (state, action) => {
        state.loading = false;
        state.subAdmins = action.payload.subAdmins;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSubAdminList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, clearSubAdminState } = subAdminSlice.actions;
export default subAdminSlice.reducer;