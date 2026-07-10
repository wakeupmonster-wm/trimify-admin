import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFakeProfilesApi,
  bulkCreateFakeProfilesApi,
  toggleFakeProfileStatusApi,
  deleteFakeProfileApi,
  listCitiesApi,
  addCityApi,
  deleteCityApi,
} from "../services/fake-profile.operation";

// ─── Fetch All (paginated, filtered, sorted) ───
export const fetchFakeProfiles = createAsyncThunk(
  "fakeProfiles/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getFakeProfilesApi(params);
      // console.log("🔍 Fake Profiles API Response:", response);

      if (response && response.success) {
        return {
          profiles: response.data || [],
          pagination: response.pagination || {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
          kpiStats: {
            totalProfiles: response.kpiStats?.totalProfiles || 0,
            activeTotal: response.kpiStats?.activeTotal || 0,
            deactivatedTotal: response.kpiStats?.deactivatedTotal || 0,
            menCount: response.kpiStats?.menCount || 0,
            womenCount: response.kpiStats?.womenCount || 0,
          },
        };
      }
      return rejectWithValue(
        response.message || "Failed to fetch fake profiles",
      );
    } catch (error) {
      console.error("❌ Fake Profiles API Error:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Server error",
      );
    }
  },
);

// ─── Bulk Create ───
export const bulkCreateFakeProfiles = createAsyncThunk(
  "fakeProfiles/bulkCreate",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await bulkCreateFakeProfilesApi(payload);
      if (response && response.success) {
        return response.data;
      }
      return rejectWithValue(
        response.message || "Failed to create fake profiles",
      );
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  },
);

// ─── Toggle Status ───
export const toggleFakeProfileStatus = createAsyncThunk(
  "fakeProfiles/toggleStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await toggleFakeProfileStatusApi(id);
      if (response && response.success) {
        return { id, data: response.data, message: response.message };
      }
      return rejectWithValue(
        response.message || "Failed to update profile status",
      );
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  },
);

// ─── Delete Single ───
export const deleteFakeProfile = createAsyncThunk(
  "fakeProfiles/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteFakeProfileApi(id);
      if (response && response.success) {
        return { id, message: response.message };
      }
      return rejectWithValue(response.message || "Failed to delete profile");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  },
);

// ─── City Management Thunks ───
export const fetchCities = createAsyncThunk(
  "fakeProfiles/fetchCities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await listCitiesApi();
      if (response && response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || "Failed to fetch cities");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  },
);

export const addCity = createAsyncThunk(
  "fakeProfiles/addCity",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await addCityApi(payload);
      if (response && response.success) {
        return response.data; // The newly created city
      }
      return rejectWithValue(response.message || "Failed to add city");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  },
);

export const deleteCustomCity = createAsyncThunk(
  "fakeProfiles/deleteCity",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteCityApi(id);
      if (response && response.success) {
        return { id, message: response.message };
      }
      return rejectWithValue(response.message || "Failed to delete city");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  },
);

const fakeProfileSlice = createSlice({
  name: "fakeProfiles",
  initialState: {
    items: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
    kpiStats: {
      totalProfiles: 0,
      activeTotal: 0,
      deactivatedTotal: 0,
      menCount: 0,
      womenCount: 0,
    },
    cities: [],
    citiesLoading: false,
    loading: false,
    bulkLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ─── FETCH ───
      .addCase(fetchFakeProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFakeProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.profiles;
        state.pagination = action.payload.pagination;
        state.kpiStats = action.payload.kpiStats;
      })
      .addCase(fetchFakeProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ─── BULK CREATE ───
      .addCase(bulkCreateFakeProfiles.pending, (state) => {
        state.bulkLoading = true;
        state.error = null;
      })
      .addCase(bulkCreateFakeProfiles.fulfilled, (state) => {
        state.bulkLoading = false;
        // We'll re-fetch after bulk create so no need to manually append
      })
      .addCase(bulkCreateFakeProfiles.rejected, (state, action) => {
        state.bulkLoading = false;
        state.error = action.payload;
      })
      // ─── TOGGLE STATUS ───
      .addCase(toggleFakeProfileStatus.fulfilled, (state, action) => {
        const profileId = action.payload.id;
        const index = state.items.findIndex(
          (item) => item.user?.profile?.id === profileId || item.user?._id === profileId,
        );
        if (index !== -1) {
          const oldStatus = state.items[index].user.account.status;
          
          // Smartly determine the new status. If backend response format changed, default to toggling oldStatus
          const newStatus = action.payload.data?.accountStatus || action.payload.data?.account?.status || action.payload.data?.status || (oldStatus === "active" ? "deactivated" : "active");
          
          state.items[index].user.account.status = newStatus;

          if (oldStatus !== newStatus) {
            if (newStatus === "active") {
              state.kpiStats.activeTotal = (state.kpiStats.activeTotal || 0) + 1;
              state.kpiStats.deactivatedTotal = Math.max(0, (state.kpiStats.deactivatedTotal || 0) - 1);
            } else if (newStatus === "deactivated") {
              state.kpiStats.deactivatedTotal = (state.kpiStats.deactivatedTotal || 0) + 1;
              state.kpiStats.activeTotal = Math.max(0, (state.kpiStats.activeTotal || 0) - 1);
            }
          }
        }
      })
      // ─── DELETE ───
      .addCase(deleteFakeProfile.fulfilled, (state, action) => {
        const profileId = action.payload.id;
        state.items = state.items.filter(
          (item) => item.user?.profile?.id !== profileId,
        );
        // Decrement total count
        if (state.pagination.total > 0) {
          state.pagination.total -= 1;
        }
      })
      // ─── FETCH CITIES ───
      .addCase(fetchCities.pending, (state) => {
        state.citiesLoading = true;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.citiesLoading = false;
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.citiesLoading = false;
        state.error = action.payload;
      })
      // ─── ADD CITY ───
      .addCase(addCity.fulfilled, (state, action) => {
        state.cities.push(action.payload);
      })
      // ─── DELETE CITY ───
      .addCase(deleteCustomCity.fulfilled, (state, action) => {
        state.cities = state.cities.filter((c) => c._id !== action.payload.id);
      });
  },
});

export default fakeProfileSlice.reducer;
