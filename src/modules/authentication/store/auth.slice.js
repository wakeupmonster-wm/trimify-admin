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

      const user = {
        id: data.id,
        nickname: data.nickname || data.name,
        email: data.email,
        role: data.role || "ADMIN",
        avatar: data.avatar,
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
      });
  },
});

export const { logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
