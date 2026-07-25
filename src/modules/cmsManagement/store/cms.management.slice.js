import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiConnector } from "@/services/axios/axios.connector";
import { CMS_MANAGEMENT } from "@/services/api-endpoints/cms.endpoints";

// ── GET CMS Pages ──
export const fetchCmsPages = createAsyncThunk(
  "cmsManagement/fetchCmsPages",
  async ({ page = 1, search = "" }, { rejectWithValue }) => {
    try {
      const response = await apiConnector(
        "GET", 
        CMS_MANAGEMENT.CMS_GET_PAGES, 
        null, 
        null, 
        { page, search }
      );
      
      // Since apiConnector unwraps response.data, we just return it
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch CMS pages"
      );
    }
  }
);

// ── Toggle CMS Status ──
export const toggleCmsStatus = createAsyncThunk(
  "cmsManagement/toggleCmsStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await apiConnector(
        "PATCH",
        CMS_MANAGEMENT.CMS_TOGGLE_STATUS(id),
        { status }
      );
      return { id, ...response };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to toggle status"
      );
    }
  }
);

// ── Update CMS Content ──
export const updateCmsContent = createAsyncThunk(
  "cmsManagement/updateCmsContent",
  async ({ id, page_name, description }, { rejectWithValue }) => {
    try {
      const response = await apiConnector(
        "PUT",
        CMS_MANAGEMENT.CMS_UPDATE_CONTENT(id),
        { page_name, description }
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to update CMS page content"
      );
    }
  }
);

const initialState = {
  data: [],
  pagination: { current_page: 1, last_page: 1, total: 0 },
  loading: false,
  error: null,
};

const cmsManagementSlice = createSlice({
  name: "cmsManagement",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── Fetch CMS Pages
    builder.addCase(fetchCmsPages.pending, (state) => {
      state.loading = true;
      state.error = null;
    }).addCase(fetchCmsPages.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload.Cms || [];
      state.pagination = action.payload.pagination || initialState.pagination;
    }).addCase(fetchCmsPages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    // ── Toggle CMS Status
    .addCase(toggleCmsStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(toggleCmsStatus.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.data.findIndex((page) => page.id === action.payload.id);
      if (index !== -1 && action.payload.updated_status) {
        state.data[index].status = action.payload.updated_status;
      }
    })
    .addCase(toggleCmsStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    // ── Update CMS Content
    .addCase(updateCmsContent.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateCmsContent.fulfilled, (state) => {
      state.loading = false;
    })
    .addCase(updateCmsContent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
  },
});

export const { clearError } = cmsManagementSlice.actions;
export default cmsManagementSlice.reducer;
