import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFaqListAPI, addFaqAPI } from "../services/faq.services";

export const fetchFaqList = createAsyncThunk(
  "faq/fetchFaqList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getFaqListAPI(params);
      if (response && response.status === "success") {
        return {
          faqs: response.faqs || response.data?.faqs || [],
          pagination: {
            page: response.pagination?.current_page || response.data?.pagination?.current_page || 1,
            limit: 10,
            total: response.pagination?.total || response.data?.pagination?.total || 0,
            totalPages: response.pagination?.last_page || response.data?.pagination?.last_page || 1,
          },
        };
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addFaq = createAsyncThunk(
  "faq/addFaq",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await addFaqAPI(data);
      if (response && response.status === "success") {
        // Option to refresh list right after adding
        dispatch(fetchFaqList());
        return response;
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  faqs: [],
  pagination: null,
  loading: false,
  error: null,
};

const faqSlice = createSlice({
  name: "faqManagement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaqList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFaqList.fulfilled, (state, action) => {
        state.loading = false;
        const resData = action.payload;
        if (resData.faqs) {
          state.faqs = resData.faqs;
          state.pagination = resData.pagination || null;
        } else {
          state.faqs = resData.data?.data || resData.data || [];
          state.pagination = resData.data?.pagination || resData.pagination || null;
        }
      })
      .addCase(fetchFaqList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add FAQ handling
      .addCase(addFaq.pending, (state) => {
        state.loading = true;
      })
      .addCase(addFaq.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default faqSlice.reducer;
