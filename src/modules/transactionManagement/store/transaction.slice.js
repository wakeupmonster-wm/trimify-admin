import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTransactionsAPI } from "../services/transaction.services";

export const fetchTransactionsList = createAsyncThunk(
  "transaction/fetchTransactionsList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getTransactionsAPI(params);
      
      if (response && response.status === "success") {
        return {
          transactions: response.transactions || [],
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
  transactions: [],
  pagination: null,
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: "transactionManagement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionsList.fulfilled, (state, action) => {
        state.loading = false;
        const resData = action.payload;
        state.transactions = resData.transactions || [];
        state.pagination = resData.pagination || {
          total: resData.data?.total || 0,
          page: resData.data?.current_page || 1,
          limit: resData.data?.per_page || 10,
        };
      })
      .addCase(fetchTransactionsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default transactionSlice.reducer;
