import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  getSubAdminManagementAPI, 
  addSubAdminAPI, 
  updateSubAdminAPI, 
  toggleSubAdminStatusAPI, 
  deleteSubAdminAPI 
} from "../services/sub.admin.services";

// Fetch List
export const fetchSubAdminList = createAsyncThunk(
  "subAdmin/fetchList",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getSubAdminManagementAPI(params);
      if (response && response.status === "success") {
        return {
          subAdmins: response.subAdmins || [],
          kpis: response.kpis || null,
          pagination: {
            page: response.pagination?.current_page || response.pagination?.page || 1,
            limit: response.pagination?.per_page || 10,
            total: response.pagination?.total || 0,
            totalPages: response.pagination?.totalPage || response.pagination?.last_page || 1,
          },
        };
      }
      return rejectWithValue("Failed to fetch sub admins");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sub admins"
      );
    }
  }
);

// Add
export const addSubAdmin = createAsyncThunk(
  "subAdmin/add",
  async (data, { rejectWithValue }) => {
    try {
      const response = await addSubAdminAPI(data);
      if (response && response.status === "success") {
        return response;
      }
      return rejectWithValue(response.message || "Failed to add sub admin");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add sub admin"
      );
    }
  }
);

// Update
export const updateSubAdmin = createAsyncThunk(
  "subAdmin/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateSubAdminAPI(id, data);
      if (response && response.status === "success") {
        return response;
      }
      return rejectWithValue(response.message || "Failed to update sub admin");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update sub admin"
      );
    }
  }
);

// Toggle Status
export const toggleSubAdminStatus = createAsyncThunk(
  "subAdmin/toggleStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await toggleSubAdminStatusAPI(id, { status });
      if (response && response.status === "success") {
        return { id, status: response.updated_status };
      }
      return rejectWithValue(response.message || "Failed to toggle status");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle status"
      );
    }
  }
);

// Delete
export const deleteSubAdmin = createAsyncThunk(
  "subAdmin/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteSubAdminAPI(id);
      if (response && response.status === "success") {
        return id;
      }
      return rejectWithValue(response.message || "Failed to delete sub admin");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete sub admin"
      );
    }
  }
);

const subAdminSlice = createSlice({
  name: "subAdmin",
  initialState: {
    subAdmins: [],
    kpis: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 50,
      total: 0,
      totalPages: 1,
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
        state.kpis = action.payload.kpis;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSubAdminList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle Add
      .addCase(addSubAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(addSubAdmin.fulfilled, (state) => {
        state.loading = false;
        // Let the component dispatch fetch again to get accurate pagination
      })
      .addCase(addSubAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle Update
      .addCase(updateSubAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSubAdmin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateSubAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle Toggle Status
      .addCase(toggleSubAdminStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleSubAdminStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { id, status } = action.payload;
        const index = state.subAdmins.findIndex(admin => admin.id === id || admin._id === id);
        if (index !== -1) {
          state.subAdmins[index].status = status;
        }
      })
      .addCase(toggleSubAdminStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle Delete
      .addCase(deleteSubAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSubAdmin.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        state.subAdmins = state.subAdmins.filter(admin => admin.id !== id && admin._id !== id);
        if (state.pagination.total > 0) state.pagination.total -= 1;
      })
      .addCase(deleteSubAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, clearSubAdminState } = subAdminSlice.actions;
export default subAdminSlice.reducer;