import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getNotificationListAPI, sendNotificationAPI } from "../services/notification.services";

export const fetchNotificationList = createAsyncThunk(
  "notification/fetchNotificationList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getNotificationListAPI(params);
      
      if (response && response.status === "success") {
        return {
          notifications: response.notification || response.data?.notification || [],
          pagination: {
            page: response.pagination?.current_page || response.data?.pagination?.current_page || 1,
            limit: 10, // default limit
            total: response.pagination?.total || response.data?.pagination?.total || 0,
            totalPages: response.pagination?.last_page || response.data?.pagination?.last_page || 1,
          },
        };
      }
      // Fallback if structure differs slightly
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const sendNotification = createAsyncThunk(
  "notification/sendNotification",
  async (data, { rejectWithValue }) => {
    try {
      const response = await sendNotificationAPI(data);
      if (response && response.status === "success") {
        return response;
      }
      return rejectWithValue(response.message || "Failed to send notification");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send notification"
      );
    }
  }
);

const initialState = {
  notifications: [],
  pagination: null,
  loading: false,
  isSending: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notificationManage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationList.fulfilled, (state, action) => {
        state.loading = false;
        const resData = action.payload;
        // Map from standard formatting if returned nicely above, else fallback
        if (resData.notifications) {
           state.notifications = resData.notifications;
           state.pagination = resData.pagination || null;
        } else {
           state.notifications = resData.data?.data || resData.data || [];
           state.pagination = resData.data?.pagination || resData.pagination || null;
        }
      })
      .addCase(fetchNotificationList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendNotification.pending, (state) => {
        state.isSending = true;
        state.error = null;
      })
      .addCase(sendNotification.fulfilled, (state) => {
        state.isSending = false;
      })
      .addCase(sendNotification.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload;
      });
  },
});

export default notificationSlice.reducer;
