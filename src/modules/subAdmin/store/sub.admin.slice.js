import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { getSubAdminManagementAPI } from "../services/sub.admin.services";

const dummySubAdmins = [
  {
    _id: "1",
    createdAt: "2026-06-10T00:00:00.000Z",
    userName: "Rajat",
    emailId: "rajatkhoware2002@gmail.com",
    hospitalName: "Rajat Medical",
    designation: "Manager",
    country: "Australia",
    role: "WhiteListing User",
    status: true,
  },
  {
    _id: "2",
    createdAt: "2024-12-27T00:00:00.000Z",
    userName: "Omaid Zamani",
    emailId: "app@trimify.com.au",
    hospitalName: "DESA Consulting",
    designation: "Manager",
    country: "Australia",
    role: "Sub-Admin User",
    status: true,
  },
  {
    _id: "3",
    createdAt: "2024-12-27T00:00:00.000Z",
    userName: "Reception",
    emailId: "reception@desaconsulting.com.au",
    hospitalName: "DESA Consulting",
    designation: "Reception",
    country: "Australia",
    role: "Sub-Admin User",
    status: true,
  }
];

// Async Thunk for getting the list
export const fetchSubAdminList = createAsyncThunk(
  "subAdmin/fetchList",
  async (params = {}, { rejectWithValue }) => {
    // Returning dummy data based on the provided screenshot
    return {
      subAdmins: dummySubAdmins,
      pagination: {
        page: 1,
        limit: 10,
        total: dummySubAdmins.length,
        totalPages: 1,
      },
    };

    /*
    try {
      const response = await getSubAdminManagementAPI(params);

      if (response && response.success) {
        // Adjust these field names based on your actual API response structure
        return {
          subAdmins: response.data || response.subAdmins || [],
          pagination: response.pagination || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          },
        };
      }
      return rejectWithValue(response.message || "Failed to fetch sub admins");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sub admins"
      );
    }
    */
  }
);

const subAdminSlice = createSlice({
  name: "subAdmin",
  initialState: {
    subAdmins: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  },
  reducers: {
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearSubAdminState: (state) => {
      state.subAdmins = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchSubAdminList
      .addCase(fetchSubAdminList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubAdminList.fulfilled, (state, action) => {
        state.loading = false;
        state.subAdmins = action.payload.subAdmins;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSubAdminList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, clearSubAdminState } = subAdminSlice.actions;
export default subAdminSlice.reducer;