import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProgramManagementAPI } from "../services/program.services";

const dummyData = [
  {
    id: 1,
    programName: "8 Week Maintenance Program",
    programDuration: "8 Week",
    status: true,
    foodVisibility: true,
  },
  {
    id: 2,
    programName: "12 Week Weight Loss Program Ve...",
    programDuration: "12 Week",
    status: true,
    foodVisibility: true,
  },
  {
    id: 3,
    programName: "12 Week Weight Loss Program",
    programDuration: "12 Week",
    status: true,
    foodVisibility: true,
  },
  {
    id: 4,
    programName: "4 Week Weight Loss Program",
    programDuration: "4 Week",
    status: true,
    foodVisibility: true,
  },
  {
    id: 5,
    programName: "Keto Diet",
    programDuration: "8 Week",
    status: true,
    foodVisibility: true,
  },
  {
    id: 6,
    programName: "Diabetes Diet",
    programDuration: "8 Week",
    status: false,
    foodVisibility: true,
  },
  {
    id: 7,
    programName: "6 Week Maintenance Program",
    programDuration: "6 Week",
    status: false,
    foodVisibility: true,
  }
];

// Async Thunk for getting the program list
export const fetchProgramList = createAsyncThunk(
  "manageProgram/fetchList",
  async (params = {}, { rejectWithValue }) => {
    return {
      programs: dummyData,
      pagination: {
        page: 1,
        limit: 10,
        total: dummyData.length,
        totalPages: 1,
      },
    };

    /*
    try {
      const response = await getProgramManagementAPI(params);

      if (response && response.success) {
        return {
          programs: response.data || response.programs || [],
          pagination: response.pagination || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          },
        };
      }
      return rejectWithValue(response.message || "Failed to fetch programs");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch programs"
      );
    }
    */
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
      });
  },
});

export const { setPage, clearProgramState } = manageProgramSlice.actions;
export default manageProgramSlice.reducer;
