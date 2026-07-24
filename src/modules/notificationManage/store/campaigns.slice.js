import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  sendPushCampaignAPI,
  sendEmailCampaignAPI,
  getPushCampaignHistoryAPI,
  getEmailCampaignHistoryAPI,
  getCampaignHistoryAPI,
  getCampaignDeliveryReportAPI,
} from "../services/notification.services";

const extractDataAndPagination = (response) => {
  if (response && response.status === "success") {
    return {
      data: response.data?.data || response.data || response.campaigns || [],
      pagination: {
        page: response.pagination?.page || response.pagination?.current_page || response.data?.pagination?.current_page || 1,
        limit: response.pagination?.limit || 10,
        total: response.pagination?.total || response.data?.pagination?.total || 0,
        totalPages: response.pagination?.totalPages || response.pagination?.last_page || response.data?.pagination?.last_page || 1,
        pushCount: response.pagination?.pushCount || 0,
        emailCount: response.pagination?.emailCount || 0,
      },
    };
  }
  return response;
};

export const sendPushCampaign = createAsyncThunk(
  "campaigns/sendPush",
  async (data, { rejectWithValue }) => {
    try {
      const response = await sendPushCampaignAPI(data);
      if (response && (response.status === "success" || response.success)) {
        return response;
      }
      return rejectWithValue(response.message || "Failed to send push campaign");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to send push campaign");
    }
  }
);

export const sendEmailCampaign = createAsyncThunk(
  "campaigns/sendEmail",
  async (data, { rejectWithValue }) => {
    try {
      const response = await sendEmailCampaignAPI(data);
      if (response && (response.status === "success" || response.success)) {
        return response;
      }
      return rejectWithValue(response.message || "Failed to send email campaign");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to send email campaign");
    }
  }
);

export const fetchPushCampaignHistory = createAsyncThunk(
  "campaigns/fetchPushHistory",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getPushCampaignHistoryAPI(params);
      return extractDataAndPagination(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchEmailCampaignHistory = createAsyncThunk(
  "campaigns/fetchEmailHistory",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getEmailCampaignHistoryAPI(params);
      return extractDataAndPagination(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCampaignHistory = createAsyncThunk(
  "campaigns/fetchHistory",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getCampaignHistoryAPI(params);
      return extractDataAndPagination(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCampaignDeliveryReport = createAsyncThunk(
  "campaigns/fetchDeliveryReport",
  async ({ channel, id, params = {} }, { rejectWithValue }) => {
    try {
      const response = await getCampaignDeliveryReportAPI(channel, id, params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  pushHistory: [],
  emailHistory: [],
  campaignHistory: [],
  pushPagination: null,
  emailPagination: null,
  campaignPagination: null,
  campaignLogs: [],
  logsLoading: false,
  loading: false,
  isSending: false,
  error: null,
};

const campaignsSlice = createSlice({
  name: "campaigns",
  initialState,
  reducers: {
    clearCampaignLogs: (state) => {
      state.campaignLogs = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // sendPushCampaign
      .addCase(sendPushCampaign.pending, (state) => {
        state.isSending = true;
        state.error = null;
      })
      .addCase(sendPushCampaign.fulfilled, (state) => {
        state.isSending = false;
      })
      .addCase(sendPushCampaign.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload;
      })
      
      // sendEmailCampaign
      .addCase(sendEmailCampaign.pending, (state) => {
        state.isSending = true;
        state.error = null;
      })
      .addCase(sendEmailCampaign.fulfilled, (state) => {
        state.isSending = false;
      })
      .addCase(sendEmailCampaign.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload;
      })

      // fetchPushCampaignHistory
      .addCase(fetchPushCampaignHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPushCampaignHistory.fulfilled, (state, action) => {
        state.loading = false;
        const resData = action.payload;
        if (resData.data) {
          state.pushHistory = resData.data;
          state.pushPagination = resData.pagination || null;
        } else {
          state.pushHistory = resData.data?.data || resData.data || [];
          state.pushPagination = resData.data?.pagination || resData.pagination || null;
        }
      })
      .addCase(fetchPushCampaignHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchEmailCampaignHistory
      .addCase(fetchEmailCampaignHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmailCampaignHistory.fulfilled, (state, action) => {
        state.loading = false;
        const resData = action.payload;
        if (resData.data) {
          state.emailHistory = resData.data;
          state.emailPagination = resData.pagination || null;
        } else {
          state.emailHistory = resData.data?.data || resData.data || [];
          state.emailPagination = resData.data?.pagination || resData.pagination || null;
        }
      })
      .addCase(fetchEmailCampaignHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchCampaignHistory
      .addCase(fetchCampaignHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaignHistory.fulfilled, (state, action) => {
        state.loading = false;
        const resData = action.payload;
        if (resData.data) {
          state.campaignHistory = resData.data;
          state.campaignPagination = resData.pagination || null;
        } else {
          state.campaignHistory = resData.data?.data || resData.data || [];
          state.campaignPagination = resData.data?.pagination || resData.pagination || null;
        }
      })
      .addCase(fetchCampaignHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // fetchCampaignDeliveryReport
      .addCase(fetchCampaignDeliveryReport.pending, (state) => {
        state.logsLoading = true;
        state.error = null;
      })
      .addCase(fetchCampaignDeliveryReport.fulfilled, (state, action) => {
        state.logsLoading = false;
        state.campaignLogs = action.payload?.data?.deliveries || [];
      })
      .addCase(fetchCampaignDeliveryReport.rejected, (state, action) => {
        state.logsLoading = false;
        state.error = action.payload;
        state.campaignLogs = [];
      });
  },
});

export const { clearCampaignLogs } = campaignsSlice.actions;
export default campaignsSlice.reducer;
