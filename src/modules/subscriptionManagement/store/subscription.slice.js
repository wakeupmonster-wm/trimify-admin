import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getSubscriptionPlansAPI,
  updateSubscriptionPlanAPI,
} from "../services/subscription-plans.services";

// Shape A envelope: { status: "success" | "error", ... }

export const fetchSubscriptionPlans = createAsyncThunk(
  "subscriptionManagement/fetchSubscriptionPlans",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getSubscriptionPlansAPI(params);
      if (response?.status === "success") {
        return {
          plans: response.plans || [],
          pagination: {
            page: response.pagination?.current_page || 1,
            total: response.pagination?.total || 0,
            totalPages: response.pagination?.last_page || 1,
          },
        };
      }
      return rejectWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateSubscriptionPlan = createAsyncThunk(
  "subscriptionManagement/updateSubscriptionPlan",
  async ({ id, price, features }, { rejectWithValue }) => {
    try {
      const response = await updateSubscriptionPlanAPI(id, { price, features });
      if (response?.status === "success") {
        return response.data;
      }
      return rejectWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  plans: [],
  pagination: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
};

const subscriptionSlice = createSlice({
  name: "subscriptionManagement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload.plans;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSubscriptionPlan.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateSubscriptionPlan.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updated = action.payload;
        const idx = state.plans.findIndex((p) => p.id === updated.id);
        if (idx !== -1) state.plans[idx] = { ...state.plans[idx], ...updated };
      })
      .addCase(updateSubscriptionPlan.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
  },
});

export default subscriptionSlice.reducer;
