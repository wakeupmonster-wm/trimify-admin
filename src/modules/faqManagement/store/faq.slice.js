import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFaqListAPI, addFaqAPI, updateFaqAPI, toggleStatusFaqAPI, deleteFaqAPI } from "../services/faq.services";

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
        dispatch(fetchFaqList());
        return response;
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateFaq = createAsyncThunk(
  "faq/updateFaq",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await updateFaqAPI(id, data);
      if (response && response.status === "success") {
        dispatch(fetchFaqList());
        return response;
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const toggleFaqStatus = createAsyncThunk(
  "faq/toggleFaqStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await toggleStatusFaqAPI(id, { status });
      return { id, status, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteFaq = createAsyncThunk(
  "faq/deleteFaq",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await deleteFaqAPI(id);
      if (response && response.status === "success") {
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
      })
      // Update FAQ handling
      .addCase(updateFaq.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateFaq.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle FAQ status
      .addCase(toggleFaqStatus.fulfilled, (state, action) => {
        const { id, updated_status } = action.payload;
        const index = state.faqs.findIndex(faq => faq.id === id);
        if (index !== -1 && updated_status) {
          state.faqs[index].status = updated_status;
        }
      })
      // Delete FAQ
      .addCase(deleteFaq.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFaq.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default faqSlice.reducer;
