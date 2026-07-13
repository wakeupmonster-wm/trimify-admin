import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  getProgramManagementAPI,
  addProgramAPI,
  updateProgramAPI,
  deleteProgramAPI,
  toggleProgramStatusAPI,
  toggleFoodVisibilityAPI,
  replicateProgramAPI
} from "../services/program.services";

// Fetch List
export const fetchProgramList = createAsyncThunk(
  "manageProgram/fetchList",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getProgramManagementAPI(params);
      if (response && response.status === "success") {
        return {
          programs: response.programs || [],
          pagination: {
            page: response.pagination?.current_page || 1,
            limit: 50, // default limit if not specified
            total: response.pagination?.total || 0,
            totalPages: response.pagination?.last_page || 1,
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

const manageProgramSlice = createSlice({
  name: "manageProgram",
  initialState: {
    programs: [],
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
      .addCase(toggleProgramStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const index = state.programs.findIndex(prog => prog.id === id);
        if (index !== -1) {
          state.programs[index].status = status;
        }
      })

      // Toggle Food Visibility
      .addCase(toggleFoodVisibility.fulfilled, (state, action) => {
        const { id, newStatus } = action.payload;
        const index = state.programs.findIndex(prog => prog.id === id);
        if (index !== -1) {
          state.programs[index].is_approve_nonapproved_foods_show = newStatus ? 1 : 0;
        }
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
      .addCase(deleteProgram.fulfilled, (state, action) => {
        const id = action.payload;
        state.programs = state.programs.filter(prog => prog.id !== id);
        if (state.pagination.total > 0) state.pagination.total -= 1;
      });
  },
});

export const { setPage, clearProgramState } = manageProgramSlice.actions;
export default manageProgramSlice.reducer;
