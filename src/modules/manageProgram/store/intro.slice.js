import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProgramIntroAPI,
  addProgramIntroAPI,
  updateProgramIntroAPI,
} from "../services/intro.services";

// Get Program Intro
export const getProgramIntro = createAsyncThunk("manageIntro/getProgramIntro",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getProgramIntroAPI(id);
      if (response && response.status === "success") {
        return { id, intro: response.content };
      }
      return rejectWithValue(response.message || "Failed to fetch program intro");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch program intro"
      );
    }
  }
);

// Add Program Intro
export const addProgramIntro = createAsyncThunk("manageIntro/addProgramIntro",
  async (data, { rejectWithValue }) => {
    try {
      const response = await addProgramIntroAPI(data);
      if (response && response.status === "success") {
        return response;
      }
      return rejectWithValue(response.message || "Failed to add program intro");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add program intro"
      );
    }
  }
);

// Update Program Intro
export const updateProgramIntro = createAsyncThunk("manageIntro/updateProgramIntro",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateProgramIntroAPI(id, data);
      if (response && response.status === "success") {
        return response;
      }
      return rejectWithValue(response.message || "Failed to update program intro");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update program intro"
      );
    }
  }
);

const manageIntroSlice = createSlice({
  name: "manageIntro",
  initialState: {
    programIntros: {}, // store intros by program id
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Program Intro
      .addCase(getProgramIntro.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProgramIntro.fulfilled, (state, action) => {
        state.loading = false;
        const { id, intro } = action.payload;
        state.programIntros[id] = intro;
      })
      .addCase(getProgramIntro.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Program Intro
      .addCase(addProgramIntro.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProgramIntro.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addProgramIntro.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Program Intro
      .addCase(updateProgramIntro.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProgramIntro.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProgramIntro.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default manageIntroSlice.reducer;
