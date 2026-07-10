import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getReportedProfilesApi,
  getProfileForReviewApi,
  updateProfileStatusApi,
} from "../services/profile-review.api";

export const fetchReportedProfiles = createAsyncThunk(
  "profileReview/fetchReportedProfiles",
  async ({ page, limit, search, status, dateRange } = {}, { rejectWithValue }) => {
    try {
      const response = await getReportedProfilesApi(
        page,
        limit,
        search,
        status,
        dateRange,
      );

      if (response && response.success) {
        return {
          reports: response.data || [],
          pagination: {
            page: response.pagination?.page,
            limit: response.pagination?.limit,
            total: response.pagination?.total,
            totalPages: response.pagination?.totalPages,
          },
          kpiStats: {
            totalReports: response.kpiStats?.totalReports,
            newReports: response.kpiStats?.newReports,
            inProgressReports: response.kpiStats?.inProgressReports,
            resolvedReports: response.kpiStats?.resolvedReports,
            highPriorityReports: response.kpiStats?.highPriorityReports,
          },
        };
      }
      return rejectWithValue("Invalid response from server");
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to fetch reported profiles",
      );
    }
  },
);

export const fetchProfileForReview = createAsyncThunk(
  "profileReview/fetchProfileForReview",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await getProfileForReviewApi(userId);
      return res?.data;
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to fetch profile",
      );
    }
  },
);

export const performUpdateProfileStatus = createAsyncThunk(
  "profileReview/updateProfileStatus",
  async (
    {
      userId,
      action,
      reason,
      banDuration,
      suspendDuration,
      replyMessage,
      reportId,
      reportIds,
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await updateProfileStatusApi(userId, {
        action,
        reason,
        banDuration,
        suspendDuration,
        replyMessage,
        reportId,
        reportIds,
      });
      return {
        userId,
        message: res?.message || "Updated successfully",
      };
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to update status",
      );
    }
  },
);
const initialState = {
  list: [],
  pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  kpiStats: {
    totalReports: 0,
    newReports: 0,
    inProgressReports: 0,
    resolvedReports: 0,
    highPriorityReports: 0,
  },
  selected: null,
  loading: false,
  error: null,
  successMessage: null,
};
const profileReviewSlice = createSlice({
  name: "profileReview",
  initialState,
  reducers: {
    clearProfileReviewStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    resetSelectedProfile: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // list
      .addCase(fetchReportedProfiles.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchReportedProfiles.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload?.reports || [];
        s.pagination = a.payload?.pagination || initialState.pagination;
        s.kpiStats = { ...s.kpiStats, ...a.payload?.kpiStats };
      })
      .addCase(fetchReportedProfiles.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      // single
      .addCase(fetchProfileForReview.pending, (s) => {
        if (!s.selected) s.loading = true;
        s.error = null;
      })
      .addCase(fetchProfileForReview.fulfilled, (s, a) => {
        s.loading = false;
        s.selected = a.payload || null;
      })
      .addCase(fetchProfileForReview.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      // update
      .addCase(performUpdateProfileStatus.pending, (s) => {
        s.error = null;
        s.successMessage = null;
      })
      .addCase(performUpdateProfileStatus.fulfilled, (s, a) => {
        s.loading = false;
        s.successMessage = a.payload?.message || "Updated";
        // Optionally update selected/list state optimistically
        if (s.selected?.userId === a.payload?.userId) {
          // If approved/rejected, we might want to remove pending reports etc.
        }
      })
      .addCase(performUpdateProfileStatus.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });
  },
});
export const { clearProfileReviewStatus, resetSelectedProfile } =
  profileReviewSlice.actions;
export default profileReviewSlice.reducer;