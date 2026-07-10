import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getEmailSettingsApi,
  updateEmailSettingsApi,
} from "../services/email.service";

export const fetchEmailSettings = createAsyncThunk(
  "emailSettings/fetchEmailSettings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getEmailSettingsApi();
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || "Failed to fetch");
    }
  },
);

export const updateEmailSettingsAction = createAsyncThunk(
  "emailSettings/updateEmailSettings",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await updateEmailSettingsApi(payload);
      return {
        data: res.data,
        message: res?.message || "Updated successfully",
      };
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || "Update failed");
    }
  },
);

const initialState = {
  data: null,
  loading: false,
  error: null,
  successMessage: null,
};

// --- Slice ---
const emailSettingsSlice = createSlice({
  name: "emailSettings",
  initialState,
  reducers: {
    clearEmailSettingsStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchEmailSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmailSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEmailSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateEmailSettingsAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateEmailSettingsAction.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.data = action.payload.data;
      })
      .addCase(updateEmailSettingsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEmailSettingsStatus } = emailSettingsSlice.actions;
export default emailSettingsSlice.reducer;
