import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProgramManagementAPI,
  addProgramAPI,
  updateProgramAPI,
  deleteProgramAPI,
  toggleProgramStatusAPI,
  toggleProgramFoodVisibilityAPI,
} from "../services/program.services";

// Maps the raw /admin/view-programs API shape to the fields the programs table columns expect
const mapProgram = (p) => ({
  id: p.id,
  programName: p.title,
  programDuration: p.duration,
  description: p.description,
  image: p.image,
  status: p.status,
  foodVisibility: !!p.is_approve_nonapproved_foods_show,
});

// Async Thunk for getting the program list
export const fetchProgramList = createAsyncThunk(
  "manageProgram/fetchList",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getProgramManagementAPI(params);

      if (response && response.status === "success") {
        const list = response.programs || [];
        const meta = response.pagination || {};

        return {
          programs: list.map(mapProgram),
          pagination: {
            page: meta.current_page || params.page || 1,
            limit: params.limit || 10,
            total: meta.total ?? list.length,
            totalPages: meta.last_page || 1,
          },
        };
      }
      return rejectWithValue(response?.message || "Failed to fetch programs");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch programs"
      );
    }
  }
);

// Async Thunk for creating a new program
export const addProgram = createAsyncThunk(
  "manageProgram/add",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await addProgramAPI(formData);
      if (response && response.status === "success") {
        return mapProgram(response.data);
      }
      return rejectWithValue(response?.message || "Failed to add program");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add program"
      );
    }
  }
);

// Async Thunk for updating an existing program
export const updateProgram = createAsyncThunk(
  "manageProgram/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await updateProgramAPI(id, formData);
      if (response && response.status === "success") {
        return mapProgram(response.data);
      }
      return rejectWithValue(response?.message || "Failed to update program");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update program"
      );
    }
  }
);

// Async Thunk for deleting a program
export const deleteProgram = createAsyncThunk(
  "manageProgram/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteProgramAPI(id);
      if (response && response.status === "success") {
        return id;
      }
      return rejectWithValue(response?.message || "Failed to delete program");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete program"
      );
    }
  }
);

// Async Thunk for toggling a program's active/inactive status
export const toggleProgramStatus = createAsyncThunk(
  "manageProgram/toggleStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await toggleProgramStatusAPI(id, status);
      if (response && response.status === "success") {
        return { id, status: response.updated_status };
      }
      return rejectWithValue(response?.message || "Failed to update status");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);

// Async Thunk for toggling a program's unapproved-food visibility flag
export const toggleProgramFoodVisibility = createAsyncThunk(
  "manageProgram/toggleFoodVisibility",
  async (id, { rejectWithValue }) => {
    try {
      const response = await toggleProgramFoodVisibilityAPI(id);
      if (response && response.status === "success") {
        return { id, foodVisibility: !!response.new_status };
      }
      return rejectWithValue(
        response?.message || "Failed to update food visibility"
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update food visibility"
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
    actionLoading: false,
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
    clearProgramState: (state) => {
      state.programs = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // List
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
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(addProgram.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(addProgram.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateProgram.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateProgram.fulfilled, (state, action) => {
        state.actionLoading = false;
        const idx = state.programs.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.programs[idx] = action.payload;
      })
      .addCase(updateProgram.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteProgram.fulfilled, (state, action) => {
        state.programs = state.programs.filter((p) => p.id !== action.payload);
      })
      // Toggle status
      .addCase(toggleProgramStatus.fulfilled, (state, action) => {
        const idx = state.programs.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.programs[idx].status = action.payload.status;
      })
      // Toggle food visibility
      .addCase(toggleProgramFoodVisibility.fulfilled, (state, action) => {
        const idx = state.programs.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.programs[idx].foodVisibility = action.payload.foodVisibility;
      });
  },
});

export const { setPage, clearProgramState } = manageProgramSlice.actions;
export default manageProgramSlice.reducer;
