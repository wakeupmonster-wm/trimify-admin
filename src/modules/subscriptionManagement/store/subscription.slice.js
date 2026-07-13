import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSubscriptionPlansAPI } from "../services/subscription.services";

export const fetchSubscriptionPlans = createAsyncThunk(
  "subscription/fetchSubscriptionPlans",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getSubscriptionPlansAPI(params);
      
      if (response && response.status === "success") {
        return {
          plans: response.plans || [],
          pagination: {
            page: response.pagination?.current_page || 1,
            limit: 10, // default limit if not specified
            total: response.pagination?.total || 0,
            totalPages: response.pagination?.last_page || 1,
          },
        };
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  subscriptions: [],
  pagination: null,
  loading: false,
  error: null,
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
        const resData = action.payload;
        // Depending on axios connector, payload might be the full response data
        state.subscriptions = resData.plans;
        state.pagination = resData.pagination || null;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default subscriptionSlice.reducer;
