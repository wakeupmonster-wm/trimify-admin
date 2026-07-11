// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import * as notifyAPI from "../services/notification-management.api";

// export const notificationHistory = createAsyncThunk(
//   "notificationManagement/notificationHistory",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const response = await notifyAPI.notificationHistoryApi(payload);
//       // console.log("response: ", response?.data);

//       if (response && response.success) {
//         return {
//           history: response.data || [],
//           pagination: {
//             page: response.pagination.page,
//             limit: response.pagination.limit,
//             total: response.pagination.total,
//             totalPages: response.pagination.totalPages,
//             pushCount: response.pagination.pushCount,
//             emailCount: response.pagination.emailCount,
//           },
//         };
//       }
//       return rejectWithValue(response.message || "Failed to fetch users");
//     } catch (e) {
//       return rejectWithValue(
//         e.response?.data?.message || "Failed to fetch notification history",
//       );
//     }
//   },
// );

// export const broadcastNotification = createAsyncThunk(
//   "notificationManagement/broadcastNotification",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const res = await notifyAPI.broadcastNotificationApi(payload);
//       if (res && res.success === false) {
//         return rejectWithValue(res.message || "Failed to send broadcast");
//       }
//       return res;
//     } catch (e) {
//       return rejectWithValue(
//         e.response?.data?.message || e.message || "Failed to send broadcast",
//       );
//     }
//   },
// );

// export const sendNotificationToPremiumUsers = createAsyncThunk(
//   "notificationManagement/sendNotificationToPremiumUsers",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const res = await notifyAPI.sendNotificationToPremiumUsersApi(payload);
//       if (res && res.success === false) {
//         return rejectWithValue(res.message || "Failed to send to premium users");
//       }
//       return res;
//     } catch (e) {
//       return rejectWithValue(
//         e.response?.data?.message || e.message || "Failed to send to premium users",
//       );
//     }
//   },
// );

// export const createPremiumExpiryCampaign = createAsyncThunk(
//   "notificationManagement/createPremiumExpiryCampaign",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const res = await notifyAPI.createPremiumExpiryCampaignApi(payload);
//       if (res && res.success === false) {
//         return rejectWithValue(res.message || "Failed to create expiry campaign");
//       }
//       return res;
//     } catch (e) {
//       return rejectWithValue(
//         e.response?.data?.message || e.message || "Failed to create expiry campaign",
//       );
//     }
//   },
// );

// export const sendEmailCampaign = createAsyncThunk(
//   "notificationManagement/sendEmailCampaign",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const res = await notifyAPI.sendEmailCampaignApi(payload);
//       if (res && res.success === false) {
//         return rejectWithValue(res.message || "Failed to send email campaign");
//       }
//       return res;
//     } catch (e) {
//       return rejectWithValue(
//         e.response?.data?.message || e.message || "Failed to send email campaign",
//       );
//     }
//   },
// );

// export const getEmailCampaignLogs = createAsyncThunk(
//   "notificationManagement/getEmailCampaignLogs",
//   async (campaignId, { rejectWithValue }) => {
//     try {
//       const res = await notifyAPI.getEmailCampaignLogsApi(campaignId);
//       if (res.success === false) return rejectWithValue(res.message);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   },
// );

// export const sendSingleUserNotification = createAsyncThunk(
//   "notificationManagement/sendSingleUserNotification",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const mappedPayload = {
//         userId: payload.userId,
//         title: payload.subject,
//         message: payload.message,
//         channels: [payload.channel],
//       };
//       const res = await notifyAPI.sendIndividualNotificationApi(mappedPayload);
//       if (res && res.success === false) {
//         return rejectWithValue(res.message || "Failed to send notification");
//       }
//       return res;
//     } catch (e) {
//       return rejectWithValue(
//         e.response?.data?.message || e.message || "Failed to send notification",
//       );
//     }
//   },
// );

// const notificationManagementSlice = createSlice({
//   name: "notificationManagement",
//   initialState: {
//     loading: false,
//     error: null,
//     successMessage: null,
//     history: [],
//     campaignLogs: [],
//     pagination: {
//       page: 1,
//       limit: 10,
//       total: 0,
//       totalPages: 0,
//     },
//   },
//   reducers: {
//     clearNotificationStatus: (state) => {
//       state.error = null;
//       state.successMessage = null;
//     },
//     clearCampaignLogs: (state) => {
//       state.campaignLogs = [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       /*========= History Cases ============*/
//       .addCase(notificationHistory.pending, (s) => {
//         s.loading = true;
//         s.error = null;
//         // s.successMessage = null;
//       })
//       .addCase(notificationHistory.fulfilled, (s, a) => {
//         s.loading = false;
//         s.history = a.payload.history || [];
//         s.pagination = a.payload.pagination || [];
//       })
//       .addCase(notificationHistory.rejected, (s, a) => {
//         s.loading = false;
//         s.error = a.payload;
//       })
//       /*========= Broadcast Cases ============*/
//       .addCase(broadcastNotification.pending, (s) => {
//         s.loading = true;
//         s.error = null;
//         // s.successMessage = null;
//       })
//       .addCase(broadcastNotification.fulfilled, (s, a) => {
//         s.loading = false;
//         s.successMessage = a.payload?.message || "Broadcast sent";
//       })
//       .addCase(broadcastNotification.rejected, (s, a) => {
//         s.loading = false;
//         s.error = a.payload;
//       })
//       /*========= Email Cases ============*/
//       .addCase(sendEmailCampaign.pending, (s) => {
//         s.loading = true;
//         s.error = null;
//       })
//       .addCase(sendEmailCampaign.fulfilled, (s, a) => {
//         s.loading = false;
//         s.successMessage = a.payload?.message;
//       })
//       .addCase(sendEmailCampaign.rejected, (s, a) => {
//         s.loading = false;
//         s.error = a.payload;
//       })
//       /*========= Send Notificaition Premium ============*/
//       .addCase(sendNotificationToPremiumUsers.pending, (s) => {
//         s.loading = true;
//         s.error = null;
//         s.successMessage = null;
//       })
//       .addCase(sendNotificationToPremiumUsers.fulfilled, (s, a) => {
//         s.loading = false;
//         s.successMessage = a.payload?.message || "Sent to premium users";
//       })
//       .addCase(sendNotificationToPremiumUsers.rejected, (s, a) => {
//         s.loading = false;
//         s.error = a.payload;
//       })
//       /*========= Create Premium Campaign Expiry ============*/
//       .addCase(createPremiumExpiryCampaign.pending, (s) => {
//         s.loading = true;
//         s.error = null;
//         s.successMessage = null;
//       })
//       .addCase(createPremiumExpiryCampaign.fulfilled, (s, a) => {
//         s.loading = false;
//         s.successMessage =
//           a.payload?.message || "Premium expiry campaign created";
//       })
//       .addCase(createPremiumExpiryCampaign.rejected, (s, a) => {
//         s.loading = false;
//         s.error = a.payload;
//       })
//       .addCase(getEmailCampaignLogs.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getEmailCampaignLogs.fulfilled, (state, action) => {
//         state.loading = false;
//         state.campaignLogs = action.payload;
//       })
//       .addCase(getEmailCampaignLogs.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       /*========= Send Single User Notification ============*/
//       .addCase(sendSingleUserNotification.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(sendSingleUserNotification.fulfilled, (state, action) => {
//         state.loading = false;
//         state.successMessage = action.payload?.message || "Notification sent successfully";
//       })
//       .addCase(sendSingleUserNotification.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearNotificationStatus, clearCampaignLogs } = notificationManagementSlice.actions;
// export default notificationManagementSlice.reducer;
