import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sendIndividualNotificationApi } from "../../notificationManagement/services/notification-management.api";
import {
  bannedUserAPI,
  deletePhotoApi,
  exportUsersApi,
  getALLUserListApi,
  getAllPendingVerificationsApi,
  getUserData,
  suspendUserAPI,
  unBannedUserAPI,
  updateUserProfileApi,
  verifyUserProfileApi,
  unsuspendUserAPI,
  updateNotificationAPI,
  getGhostingUserListApi,
} from "../services/user-management.operation";

export const fetchGhostingUsers = createAsyncThunk(
  "users/fetchGhosting",
  async (
    { page, limit, search, from, to, view, isPremium, gender },
    { rejectWithValue },
  ) => {
    try {
      const response = await getGhostingUserListApi(
        page,
        limit,
        search,
        from,
        to,
        view,
        isPremium,
        gender,
      );

      if (response && response.success) {
        return {
          users: response.data || [],
          pagination: {
            page: response.pagination.page,
            limit: response.pagination.limit,
            total: response.pagination.total,
            totalPages: response.pagination.totalPages,
          },
          kpiStats: {
            totalUsers: response.kpiStats.totalUsers,
            totalMatches: response.kpiStats.totalMatches,
            ghostedMatches: response.kpiStats.ghostedMatches,
            activeMatches: response.kpiStats.activeMatches,
            totalBlocks: response.kpiStats.totalBlocks,
          },
        };
      }
      return rejectWithValue(
        response.message || "Failed to fetch ghosting users",
      );
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  },
);

//  Pending This Fetch Users list API/.
export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (
    {
      page, limit, search, accountStatus, isPremium, last24Hours, gender,
      isDeactivated, isScheduledForDeletion, isGhosting, preset, from, to
    },
    { rejectWithValue },
  ) => {
    try {
      // Pass the new filters directly to your API function
      const response = await getALLUserListApi(
        page,
        limit,
        search,
        accountStatus,
        isPremium,
        last24Hours,
        gender,
        isDeactivated,
        isScheduledForDeletion,
        isGhosting,
        preset,
        from,
        to,
      );

      // console.log("response: ", response?.data);

      if (response && response.success) {
        return {
          users: response.data || [],
          pagination: {
            page: response.pagination.page,
            limit: response.pagination.limit,
            total: response.pagination.total,
            totalPages: response.pagination.totalPages,
          },
          kpiStats: {
            activeTotal: response?.kpiStats.activeTotal,
            premiumTotal: response.kpiStats.premiumTotal,
            bannedTotal: response.kpiStats.bannedTotal,
            suspendedTotal: response.kpiStats.suspendedTotal,
            totalUsers: response.kpiStats.totalUsers,
          },
        };
      }
      return rejectWithValue(response.message || "Failed to fetch users");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  },
);

export const fetchUserData = createAsyncThunk(
  "user/fetch",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getUserData(userId);

      if (response && response.success) {
        return {
          user: response.data || {},
        };
      }

      return rejectWithValue(response.message || "Failed to fetch user");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  },
);

export const fetchPendingVerifications = createAsyncThunk(
  "users/fetchPendingVerifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllPendingVerificationsApi();

      if (!response.success) {
        return rejectWithValue(
          response.message || "Failed to fetch pending verifications",
        );
      }

      return {
        items: response.data || [],
        count: response.count || 0,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  },
);
export const verifyUserProfile = createAsyncThunk(
  "users/verifyUserProfile",
  async ({ userId, action, reason }, { rejectWithValue }) => {
    try {
      const response = await verifyUserProfileApi(userId, {
        action,
        reason,
      });

      if (!response.success) {
        return rejectWithValue(response.message);
      }

      return { userId, action };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Verification failed",
      );
    }
  },
);

export const exportUsersStream = createAsyncThunk(
  "users/exportStream",
  async (filters, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setExportProgress(5));
      // 1. Get the raw fetch response
      const response = await exportUsersApi(filters);

      if (!response.ok) throw new Error("Failed to connect to export stream");

      // 2. Initialize the reader for the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let csvData = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk of data
        const chunk = decoder.decode(value, { stream: true });

        // 3. Extract and Dispatch Progress
        const progressRegex = /---PROG:(\d+)---/g;
        let match;
        while ((match = progressRegex.exec(chunk)) !== null) {
          const progressValue = Number(match[1]);
          // Use the action creator directly from the slice
          dispatch(setExportProgress(progressValue));
        }

        // 4. Sanitize data: remove markers before appending to final CSV string
        const cleanChunk = chunk.replace(/---PROG:\d+---/g, "");
        csvData += cleanChunk;
      }

      dispatch(setExportProgress(100));
      return csvData;
    } catch (error) {
      console.error("Export Stream Thunk Error:", error);
      return rejectWithValue(error.message || "Streaming export failed");
    }
  },
);

export const bannedUserProfile = createAsyncThunk(
  "users/bannedUserProfile",
  async ({ userId, category, reason }, { rejectWithValue }) => {
    try {
      // Pass userId separately and group category/reason into the payload object
      const response = await bannedUserAPI({
        userId,
        payload: { category, reason },
      });

      if (!response.success) {
        return rejectWithValue(response.message);
      }

      return { userId, category, reason };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Ban failed");
    }
  },
);

// Thunk for Unbanning
export const unbanUserProfile = createAsyncThunk(
  "users/unbanUserProfile",
  async ({ userId, category, reason }, { rejectWithValue }) => {
    try {
      const response = await unBannedUserAPI(userId, { category, reason });
      if (!response.success) return rejectWithValue(response.message);
      return { userId, category, reason };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Unban failed");
    }
  },
);

export const suspendUserProfile = createAsyncThunk(
  "users/suspendUserProfile",
  async ({ userId, reason, durationHours }, { rejectWithValue }) => {
    try {
      const response = await suspendUserAPI({
        userId,
        payload: { reason, durationHours },
      });

      if (!response.success) return rejectWithValue(response.message);

      return { userId, reason, durationHours };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Suspension failed",
      );
    }
  },
);

// Thunk for Unsuspension (Reactivating)
export const unsuspendUserProfile = createAsyncThunk(
  "users/unsuspendUserProfile",
  async (args, { rejectWithValue }) => {
    try {
      const isObject = typeof args === "object";
      const userId = isObject ? args.userId : args;
      const category = isObject ? args.category : "Administrative";
      const reason = isObject ? args.reason : "Suspension lifted";

      const response = await unsuspendUserAPI({
        userId,
        payload: { category, reason },
      });
      if (!response.success) return rejectWithValue(response.message);
      return { userId, category, reason };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unsuspension failed",
      );
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  "users/updateProfile",
  async ({ userId, ...payload }, { rejectWithValue }) => {
    try {
      // Assuming you have this API method in your services
      const response = await updateUserProfileApi(userId, payload);

      if (!response.success) {
        return rejectWithValue(response.message || "Update failed");
      }

      // Return both the ID and the new data so the reducer knows who to update
      return { userId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  },
);

export const deleteUserPhoto = createAsyncThunk(
  "users/deletePhoto",
  async ({ userId, publicId }, { rejectWithValue }) => {
    try {
      const response = await deletePhotoApi(userId, publicId);

      if (!response.success) {
        return rejectWithValue(response.message || "Delete failed");
      }

      // Return these to update the local state without a refresh
      return { userId, publicId, updatedPhotos: response.data.profile.photos };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  },
);

export const updateNotification = createAsyncThunk(
  "users/updateNotification",
  async ({ userId, payload }, { rejectWithValue }) => {
    try {
      // Assuming you have this API method in your services
      const response = await updateNotificationAPI(userId, payload);

      if (!response.success) {
        return rejectWithValue(response.message || "Update failed");
      }

      // Return both the ID and the new data so the reducer knows who to update
      return { userId, payload };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  },
);

export const sendIndividualNotificationThunk = createAsyncThunk(
  "users/sendIndividualNotification",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await sendIndividualNotificationApi(payload);
      if (response && response.success) {
        return response;
      }
      return rejectWithValue(response.message || "Failed to send notification");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  },
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    items: [],
    user: null,
    userLoading: false,
    pendingVerifications: [],
    pendingCount: 0,
    loading: false,
    error: null,
    exportLoading: false,
    exportProgress: 0,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    kpiStats: {
      totalUsers: 0,
      activeTotal: 0,
      premiumTotal: 0,
      bannedTotal: 0,
      suspendedTotal: 0,
      totalMatches: 0,
      ghostedMatches: 0,
      activeMatches: 0,
      totalBlocks: 0,
    },
  },
  reducers: {
    setPagination: (state, action) => {
      state.pagination.page = action.payload.page;
      state.pagination.limit = action.payload.limit;
    },
    addUser: (state, action) => {
      state.items.unshift({
        ...action.payload,
        id: Date.now(),
        joined: new Date().toISOString().split("T")[0],
      });
    },
    deleteUser: (state, action) => {
      state.items = state.items.filter((user) => user.id !== action.payload);
    },
    updateUserStatus: (state, action) => {
      const user = state.items.find((u) => u.id === action.payload.id);
      if (user) user.status = action.payload.status;
    },
    setExportProgress: (state, action) => {
      state.exportProgress = action.payload;
    },
    clearSelectedUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* FETCH USER DATA LIST */
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.users;
        state.pagination = action.payload.pagination;
        state.kpiStats = action.payload.kpiStats;
        // console.log("items: ", state.items);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        if (action.error.name === "AbortError") {
          return; // Ignore aborted requests
        }
        state.loading = false;
        state.error = action.payload;
      })
      /* FETCH GHOSTING USERS */
      .addCase(fetchGhostingUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGhostingUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.users;
        state.pagination = action.payload.pagination;
        state.kpiStats = action.payload.kpiStats;
      })
      .addCase(fetchGhostingUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      /* FETCH USER DATA */
      .addCase(fetchUserData.pending, (state) => {
        // Only set userLoading = true if we don't have a user yet (initial load)
        // Background refreshes shouldn't trigger the full-page PreLoader
        if (!state.user) {
          state.userLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.userLoading = false;
        state.user = action.payload.user;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload;
      })
      /* PENDING USERVERIFICATION */
      .addCase(fetchPendingVerifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingVerifications.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingVerifications = action.payload.items;
        state.pendingCount = action.payload.count;
      })
      .addCase(fetchPendingVerifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      /* VERIFY USER PROFILE */
      .addCase(verifyUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, action: status, reason } = action.payload;

        // 1. Update List
        const userIndex = state.items.findIndex((u) => u._id === userId);
        if (userIndex !== -1) {
          state.items[userIndex].verification = {
            ...state.items[userIndex].verification,
            status: status === "approve" ? "approved" : "rejected",
            rejectionReason: reason || undefined,
          };
        }

        // 2. 🔥 Update Single View
        if (state.user && state.user._id === userId) {
          state.user.verification = {
            ...state.user.verification,
            status: status === "approve" ? "approved" : "rejected",
            rejectionReason: reason || undefined,
          };
        }
      })
      /* UPDATE USER PROFILE LIVE */
      .addCase(updateUserProfile.pending, (state) => {
        // Don't set loading = true — avoids full-page reload on profile actions
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        const { userId, ...updates } = action.payload;

        const deepMerge = (target, source) => {
          const result = { ...target };
          Object.keys(source).forEach((key) => {
            if (
              source[key] !== null &&
              typeof source[key] === "object" &&
              !Array.isArray(source[key])
            ) {
              result[key] = deepMerge(target[key] || {}, source[key]);
            } else {
              result[key] = source[key];
            }
          });
          return result;
        };

        const updateData = (target) => {
          const updatesWithoutProfile = { ...updates };
          delete updatesWithoutProfile.profile;

          // 1. Merge top-level updates (excluding profile for now)
          let newTarget = deepMerge(target, updatesWithoutProfile);

          // 2. Merge profile and hoist its fields if necessary
          if (updates.profile) {
            newTarget.profile = deepMerge(
              newTarget.profile || {},
              updates.profile,
            );

            // Hoist specific fields from profile to root if they exist
            ["settings", "discovery", "account"].forEach((field) => {
              if (updates.profile[field]) {
                newTarget[field] = deepMerge(
                  newTarget[field] || {},
                  updates.profile[field],
                );
              }
            });
          }
          return newTarget;
        };

        // 1. Update in the LIST
        const userIndex = state.items.findIndex(
          (u) => u._id === userId || u.id === userId,
        );
        if (userIndex !== -1) {
          state.items[userIndex] = updateData(state.items[userIndex]);
        }

        // 2. 🔥 UPDATE THE SINGLE VIEW
        if (
          state.user &&
          (state.user._id === userId || state.user.id === userId)
        ) {
          state.user = updateData(state.user);
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload;
      })
      /* DELETE USER PHOTO LIVE */
      .addCase(deleteUserPhoto.fulfilled, (state, action) => {
        const { userId, updatedPhotos } = action.payload;
        const userIndex = state.items.findIndex(
          (u) => u._id === userId || u.id === userId,
        );

        if (userIndex !== -1) {
          // Update the photos array with the new ordered list from the backend
          state.items[userIndex].photos = updatedPhotos;
        }
      })
      /* BANNED USER SUCCESS */

      .addCase(bannedUserProfile.pending, (state) => {
        state.error = null;
      })
      /* BANNED USER SUCCESS */
      .addCase(bannedUserProfile.fulfilled, (state, action) => {
        const { userId, category, reason } = action.payload;

        const userInList = state.items.find((u) => u._id === userId || u.id === userId);
        const singleUser = state.user && (state.user._id === userId || state.user.id === userId) ? state.user : null;
        
        const currentStatus = userInList?.accountStatus || userInList?.account?.status || singleUser?.accountStatus || singleUser?.account?.status;

        if (currentStatus && currentStatus !== "banned") {
          if (currentStatus === "active") state.kpiStats.activeTotal = Math.max(0, (state.kpiStats.activeTotal || 0) - 1);
          if (currentStatus === "suspended") state.kpiStats.suspendedTotal = Math.max(0, (state.kpiStats.suspendedTotal || 0) - 1);
          state.kpiStats.bannedTotal = (state.kpiStats.bannedTotal || 0) + 1;
        }

        const updateData = (target) => {
          target.accountStatus = "banned";
          if (target.account) {
            target.account.status = "banned";
            target.account.banDetails = {
              isBanned: true,
              reason: reason || "Manual ban by admin",
              category: category || "General",
              bannedAt: new Date().toISOString(),
            };
          }
        };

        if (userInList) updateData(userInList);
        if (singleUser) updateData(singleUser);
      })
      .addCase(bannedUserProfile.rejected, (state, action) => {
        state.error = action.payload;
      })
      /* UNBAN USER SUCCESS */
      .addCase(unbanUserProfile.pending, (state) => {
        // Don't set loading = true
      })
      /* UNBAN USER SUCCESS */
      .addCase(unbanUserProfile.fulfilled, (state, action) => {
        const { userId, category, reason } = action.payload;

        const userInList = state.items.find((u) => u._id === userId || u.id === userId);
        const singleUser = state.user && (state.user._id === userId || state.user.id === userId) ? state.user : null;
        
        const currentStatus = userInList?.accountStatus || userInList?.account?.status || singleUser?.accountStatus || singleUser?.account?.status;

        if (currentStatus && currentStatus !== "active") {
          if (currentStatus === "banned") state.kpiStats.bannedTotal = Math.max(0, (state.kpiStats.bannedTotal || 0) - 1);
          if (currentStatus === "suspended") state.kpiStats.suspendedTotal = Math.max(0, (state.kpiStats.suspendedTotal || 0) - 1);
          state.kpiStats.activeTotal = (state.kpiStats.activeTotal || 0) + 1;
        }

        const updateData = (target) => {
          target.accountStatus = "active";
          if (target.account) {
            target.account.status = "active";
            target.account.banDetails = {
              isBanned: false,
              unbannedAt: new Date().toISOString(),
              unbanReason: reason,
              unbanCategory: category,
            };
          }
        };

        if (userInList) updateData(userInList);
        if (singleUser) updateData(singleUser);
      })
      .addCase(unbanUserProfile.rejected, (state, action) => {
        state.error = action.payload;
      })
      /* SUSPEND USER SUCCESS */
      .addCase(suspendUserProfile.pending, (state) => {
        // Don't set loading = true
      })
      /* SUSPEND USER SUCCESS */
      .addCase(suspendUserProfile.fulfilled, (state, action) => {
        const { userId, reason, durationHours } = action.payload;

        const userInList = state.items.find((u) => u._id === userId || u.id === userId);
        const singleUser = state.user && (state.user._id === userId || state.user.id === userId) ? state.user : null;
        
        const currentStatus = userInList?.accountStatus || userInList?.account?.status || singleUser?.accountStatus || singleUser?.account?.status;

        if (currentStatus && currentStatus !== "suspended") {
          if (currentStatus === "active") state.kpiStats.activeTotal = Math.max(0, (state.kpiStats.activeTotal || 0) - 1);
          if (currentStatus === "banned") state.kpiStats.bannedTotal = Math.max(0, (state.kpiStats.bannedTotal || 0) - 1);
          state.kpiStats.suspendedTotal = (state.kpiStats.suspendedTotal || 0) + 1;
        }

        const updateData = (target) => {
          target.accountStatus = "suspended";
          if (target.account) target.account.status = "suspended";
          target.suspensionDetails = {
            isSuspended: true,
            reason,
            suspendedAt: new Date().toISOString(),
            suspendUntil: new Date(
              Date.now() + durationHours * 60 * 60 * 1000,
            ).toISOString(),
          };
        };

        if (userInList) updateData(userInList);
        if (singleUser) updateData(singleUser);
      })
      .addCase(suspendUserProfile.rejected, (state, action) => {
        state.error = action.payload;
      })
      /* BULK EXPORT USER DATA CSV FILE */
      .addCase(exportUsersStream.pending, (state) => {
        state.exportLoading = true;
        state.exportProgress = 0;
      })
      .addCase(exportUsersStream.fulfilled, (state) => {
        state.exportLoading = false;
        state.exportProgress = 100; // Keep at 100 for visual feedback
      })
      .addCase(exportUsersStream.rejected, (state) => {
        state.exportLoading = false;
      })
      .addCase(unsuspendUserProfile.pending, (state) => {
        // Don't set loading = true
      })
      .addCase(unsuspendUserProfile.fulfilled, (state, action) => {
        const { userId, category, reason } = action.payload;

        const userInList = state.items.find((u) => u._id === userId || u.id === userId);
        const singleUser = state.user && (state.user._id === userId || state.user.id === userId) ? state.user : null;
        
        const currentStatus = userInList?.accountStatus || userInList?.account?.status || singleUser?.accountStatus || singleUser?.account?.status;

        if (currentStatus && currentStatus !== "active") {
          if (currentStatus === "banned") state.kpiStats.bannedTotal = Math.max(0, (state.kpiStats.bannedTotal || 0) - 1);
          if (currentStatus === "suspended") state.kpiStats.suspendedTotal = Math.max(0, (state.kpiStats.suspendedTotal || 0) - 1);
          state.kpiStats.activeTotal = (state.kpiStats.activeTotal || 0) + 1;
        }

        const updateData = (target) => {
          target.accountStatus = "active";
          if (target.account) {
            target.account.status = "active";
          }
          // ✅ Clear suspension details and log reactivation
          target.suspensionDetails = {
            isSuspended: false,
            reason: null,
            suspendedAt: null,
            suspendUntil: null,
            reactivatedAt: new Date().toISOString(),
            reactivationReason: reason,
            reactivationCategory: category,
          };
        };

        if (userInList) updateData(userInList);
        if (singleUser) updateData(singleUser);
      })
      .addCase(unsuspendUserProfile.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateNotification.pending, (state) => {
        state.error = null;
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        state.error = null;

        const { userId, payload } = action.payload;

        const user = state.items.find(
          (u) => u._id === userId || u.id === userId,
        );
        if (user) {
          user.settings = {
            ...user.settings,
            notifications: {
              ...user.settings?.notifications,
              ...payload,
            },
          };
        }
        if (
          state.user &&
          (state.user._id === userId || state.user.id === userId)
        ) {
          state.user.settings = {
            ...state.user.settings,
            notifications: {
              ...state.user.settings?.notifications,
              ...payload,
            },
          };
        }
      })
      .addCase(updateNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setExportProgress,
  setPagination,
  addUser,
  deleteUser,
  updateUserStatus,
  clearSelectedUser,
} = userSlice.actions;
export default userSlice.reducer;
