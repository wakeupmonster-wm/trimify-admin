import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFitzoneIntroAPI,
  addFitzoneIntroAPI,
  updateFitzoneIntroAPI,
} from "../services/fitzone.intro.services";

export const getFitzoneIntro = createAsyncThunk(
  "fitzoneIntro/getFitzoneIntro",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getFitzoneIntroAPI(id);
      if (response && response.status === "success") {
        return {
          intro: {
            heading: response.heading,
            subheading: response.sub_heading,
            content: response.content,
          },
          pagination: {
            page: response.pagination?.current_page || 1,
            limit: response.pagination?.per_page || 10,
            total: response.pagination?.total || 0,
            totalPages: response.pagination?.last_page || 1,
          },
        }
      }
      return rejectWithValue(response.message || "Failed to fetch intro");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch intro",
      );
    }
  },
);

export const addFitzoneIntro = createAsyncThunk(
  "fitzoneIntro/addFitzoneIntro",
  async (data, { rejectWithValue }) => {
    try {
      const response = await addFitzoneIntroAPI(data);
      if (response && response.status === "success") return response;
      return rejectWithValue(response.message || "Failed to add intro");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add intro",
      );
    }
  },
);

export const updateFitzoneIntro = createAsyncThunk(
  "fitzoneIntro/updateFitzoneIntro",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateFitzoneIntroAPI(id, data);
      if (response && response.status === "success") return response;
      return rejectWithValue(response.message || "Failed to update intro");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update intro",
      );
    }
  },
);

const fitzoneIntroSlice = createSlice({
  name: "fitzoneIntro",
  initialState: {
    intro: {
      content: null,
      heading: null,
      subheading: null
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFitzoneIntro.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFitzoneIntro.fulfilled, (state, action) => {
        state.loading = false;
        state.intro = action.payload.intro || null;
        state.pagination = action.payload.pagination || null;
      })
      .addCase(getFitzoneIntro.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // addFitzoneIntro
      .addCase(addFitzoneIntro.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addFitzoneIntro.fulfilled, (state) => { state.loading = false; })
      .addCase(addFitzoneIntro.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // updateFitzoneIntro
      .addCase(updateFitzoneIntro.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateFitzoneIntro.fulfilled, (state) => { state.loading = false; })
      .addCase(updateFitzoneIntro.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
  },
});

export default fitzoneIntroSlice.reducer;
