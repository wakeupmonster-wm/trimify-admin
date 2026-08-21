import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminLoginAPI } from "../services/adminAuth.api";
import axios from "axios";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await adminLoginAPI(credentials);
      
      // Fallbacks in case the API response structure differs slightly
      const success = response.success !== undefined ? response.success : (response.status === "success");
      const message = response.message;
      const data = response.data || response; // Sometimes data is at the root
      
      if (!success) {
        return rejectWithValue(message || "Invalid credentials");
      }

      const adminData = response.admin || data;

      const user = {
        id: adminData.id,
        name: adminData.name || adminData.nickname,
        email: adminData.email,
        role: adminData.role || "ADMIN",
        avatar: adminData.avatar,
        screen: response.screen,
        message,
      };

      // Safely access token depending on structure
      const token = data.auth?.accessToken || data.token || response.token || response.auth?.accessToken;

      // 🔐 Persist BOTH token + user
      if (token) {
        localStorage.setItem("access_Token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      
      localStorage.setItem("auth_user", JSON.stringify(user));

      return { user, token };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  }
);

export const requestOtpThunk = createAsyncThunk(
  "auth/requestOtp",
  async (data, { rejectWithValue }) => {
    try {
      // Mocked for now - hook up real API endpoint when available
      return { success: true, message: "OTP requested successfully" };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  }
);

export const verifyOtpThunk = createAsyncThunk(
  "auth/verifyOtp",
  async (data, { rejectWithValue }) => {
    try {
      // Mocked for now - hook up real API endpoint when available
      return { success: true, message: "OTP verified successfully" };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  }
);

/* =========== AUTH SLICE ================ */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    token: null,
    initialized: false, // 🔥 REQUIRED
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem("access_Token");
      localStorage.removeItem("auth_user");

      delete axios.defaults.headers.common["Authorization"];
    },

    // 🔥 RESTORE AUTH ON APP LOAD
    initializeAuth: (state) => {
      const token = localStorage.getItem("access_Token");
      const user = localStorage.getItem("auth_user");

      if (token && user) {
        state.isAuthenticated = true;
        state.token = token;
        state.user = JSON.parse(user);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      }
      state.initialized = true; // ✅ AUTH READY
    },
  },
  extraReducers: (builder) => {
    builder
      // Extra Reducers For Login Thunk
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // requestOtpThunk
      .addCase(requestOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOtpThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(requestOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // verifyOtpThunk
      .addCase(verifyOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
