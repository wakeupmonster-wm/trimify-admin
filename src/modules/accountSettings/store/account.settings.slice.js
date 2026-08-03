import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  changePasswordAPI,
  updateEmailAPI,
  verifyEmailOtpAPI,
} from "../services/account.settings.services";

const initialState = {
  loading: false,
  error: null,
};

export const changePassword = createAsyncThunk(
  "accountSettings/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await changePasswordAPI(data);
      if (response?.status === "success") {
        return response;
      }
      return rejectWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.response || error);
    }
  }
);

export const updateEmail = createAsyncThunk(
  "accountSettings/updateEmail",
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateEmailAPI(data);
      if (response?.status === "success") {
        return response;
      }
      return rejectWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.response || error);
    }
  }
);

export const verifyEmailOtp = createAsyncThunk(
  "accountSettings/verifyEmailOtp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await verifyEmailOtpAPI(data);
      if (response?.status === "success") {
        return response;
      }
      return rejectWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.response || error);
    }
  }
);

const accountSettingsSlice = createSlice({
  name: "accountSettings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Email
      .addCase(updateEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify OTP
      .addCase(verifyEmailOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmailOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyEmailOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default accountSettingsSlice.reducer;
