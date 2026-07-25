import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  getProgramManagementAPI,
  addProgramAPI,
  updateProgramAPI,
  deleteProgramAPI,
  toggleProgramStatusAPI,
  toggleFoodVisibilityAPI,
  replicateProgramAPI,
  getProgramAssignedUsersAPI,
  getProgramFoodVisibilityAPI
} from "../services/program.services";

// Backend TODO: `GET /admin/view-programs` should return a `kpis` object
// alongside `programs`/`pagination`, aggregated over the FULL table —
// { totalPrograms, activePrograms, inactivePrograms, totalAssignedUsers }.
// `totalAssignedUsers` needs a new aggregate — today the assigned-user
// count only exists per-program via the "View User" drill-down
// (getProgramAssignedUsersAPI), there's no sum across all programs.
// Until the backend sends `kpis`, it stays null and the KPI row on
// ManageProgramPage renders a loading placeholder instead of a
// page-local (and therefore wrong) count.

// Fetch List
export const fetchProgramList = createAsyncThunk(
  "manageProgram/fetchList",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getProgramManagementAPI(params);
      if (response && response.status === "success") {
        return {
          programs: response.programs || [],
          kpis: response.kpis || null,
          pagination: {
            page: response.pagination?.current_page || response.pagination?.page || 1,
            limit: response.pagination?.per_page || 10,
            total: response.pagination?.total || 0,
            totalPages: response.pagination?.totalPage || response.pagination?.last_page || 1,
          },
        };
      }
      return rejectWithValue(response.message || "Failed to fetch programs");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch programs"
      );
    }
  }
);

// Add
export const addProgram = createAsyncThunk(
  "manageProgram/add",
  async (data, { rejectWithValue }) => {
    try {
      const response = await addProgramAPI(data);
      if (response && response.status === "success") {
        return response;
      }
      return rejectWithValue(response.message || "Failed to add program");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add program"
      );
    }
  }
);

// Update
export const updateProgram = createAsyncThunk(
  "manageProgram/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateProgramAPI(id, data);
      if (response && response.status === "success") {
        return response;
      }
      return rejectWithValue(response.message || "Failed to update program");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update program"
      );
    }
  }
);

// Toggle Status
export const toggleProgramStatus = createAsyncThunk(
  "manageProgram/toggleStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await toggleProgramStatusAPI(id, { status });
      if (response && response.status === "success") {
        return { id, status: response.updated_status };
      }
      return rejectWithValue(response.message || "Failed to toggle program status");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle program status"
      );
    }
  }
);

// Toggle Food Visibility
export const toggleFoodVisibility = createAsyncThunk(
  "manageProgram/toggleFoodVisibility",
  async (id, { rejectWithValue }) => {
    try {
      const response = await toggleFoodVisibilityAPI(id);
      if (response && response.status === "success") {
        return { id, newStatus: response.new_status };
      }
      return rejectWithValue(response.message || "Failed to toggle food visibility");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle food visibility"
      );
    }
  }
);

// Get Food Visibility
export const getProgramFoodVisibility = createAsyncThunk(
  "manageProgram/getProgramFoodVisibility",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getProgramFoodVisibilityAPI(id);
      if (response && response.status === "success") {
        return { id, isVisible: response.is_visible };
      }
      return rejectWithValue(response.message || "Failed to fetch food visibility");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch food visibility"
      );
    }
  }
);

// Replicate Program
export const replicateProgram = createAsyncThunk(
  "manageProgram/replicate",
  async (id, { rejectWithValue }) => {
    try {
      const response = await replicateProgramAPI(id);
      if (response && response.status === "success") {
        return response;
      }
      return rejectWithValue(response.message || "Failed to replicate program");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to replicate program"
      );
    }
  }
);

// Delete
export const deleteProgram = createAsyncThunk(
  "manageProgram/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteProgramAPI(id);
      if (response && response.status === "success") {
        return id;
      }
      return rejectWithValue(response.message || "Failed to delete program");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete program"
      );
    }
  }
);

// Fetch Assigned Users
export const fetchProgramAssignedUsers = createAsyncThunk(
  "manageProgram/fetchAssignedUsers",
  async ({ id, params }, { rejectWithValue }) => {
    try {
      const response = await getProgramAssignedUsersAPI(id, params);
      if (response && response.status === "success") {
        return {
          users: response.viewAssignedPrograms || [],
          pagination: {
            page: response.pagination?.current_page || 1,
            limit: response.pagination?.per_page || 10,
            total: response.pagination?.total || 0,
            totalPages: response.pagination?.last_page || 1,
          },
        };
      }
      return rejectWithValue(response.message || "Failed to fetch assigned users");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch assigned users"
      );
    }
  }
);


const manageProgramSlice = createSlice({
  name: "manageProgram",
  initialState: {
    programs: [],
    kpis: null,
    assignedUsers: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 50,
      total: 0,
      totalPages: 1,
    },
    usersPagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    },
    programFoodVisibility: {}, // store visibility by id
  },
  reducers: {
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearProgramState: (state) => {
      state.programs = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(fetchProgramList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgramList.fulfilled, (state, action) => {
        state.loading = false;
        state.programs = action.payload.programs;
        state.kpis = action.payload.kpis;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProgramList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add
      .addCase(addProgram.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProgram.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateProgram.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProgram.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Toggle Status
      // Toggle Program Status
      .addCase(toggleProgramStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleProgramStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { id, status } = action.payload;
        const index = state.programs.findIndex(prog => prog.id === id);
        if (index !== -1) {
          state.programs[index].status = status;
        }
      })
      .addCase(toggleProgramStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle Food Visibility
      .addCase(toggleFoodVisibility.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFoodVisibility.fulfilled, (state, action) => {
        state.loading = false;
        const { id, newStatus } = action.payload;
        const index = state.programs.findIndex(prog => prog.id === id);
        if (index !== -1) {
          state.programs[index].is_approve_nonapproved_foods_show = newStatus ? 1 : 0;
        }
        // Update the detail map if it exists
        if (state.programFoodVisibility[id] !== undefined) {
           state.programFoodVisibility[id] = newStatus ? 1 : 0;
        }
      })
      .addCase(toggleFoodVisibility.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Food Visibility
      .addCase(getProgramFoodVisibility.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProgramFoodVisibility.fulfilled, (state, action) => {
        state.loading = false;
        const { id, isVisible } = action.payload;
        state.programFoodVisibility[id] = isVisible;
      })
      .addCase(getProgramFoodVisibility.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Replicate Program
      .addCase(replicateProgram.pending, (state) => {
        state.loading = true;
      })
      .addCase(replicateProgram.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(replicateProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteProgram.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProgram.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        state.programs = state.programs.filter(prog => prog.id !== id);
        if (state.pagination.total > 0) state.pagination.total -= 1;
      })
      .addCase(deleteProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Assigned Users
      .addCase(fetchProgramAssignedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgramAssignedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedUsers = action.payload.users;
        state.usersPagination = action.payload.pagination;
      })
      .addCase(fetchProgramAssignedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, clearProgramState } = manageProgramSlice.actions;
export default manageProgramSlice.reducer;
