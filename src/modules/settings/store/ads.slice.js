// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { getAdsConfigApi, updateAdsConfigApi } from "../services/ads.service";

// export const fetchAdsConfig = createAsyncThunk(
//   "settings/fetchAdsConfig",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await getAdsConfigApi();
//       if (response.success) {
//         return response.data;
//       }
//       return rejectWithValue(response.message || "Failed to fetch ads config");
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Something went wrong");
//     }
//   }
// );

// export const updateAdsConfig = createAsyncThunk(
//   "settings/updateAdsConfig",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const response = await updateAdsConfigApi(payload);
//       if (response.success) {
//         return response.data;
//       }
//       return rejectWithValue(response.message || "Failed to update ads config");
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Something went wrong");
//     }
//   }
// );

// const adsSlice = createSlice({
//   name: "adsSettings",
//   initialState: {
//     config: null,
//     loading: false,
//     error: null,
//     success: false,
//   },
//   reducers: {
//     resetAdsStatus: (state) => {
//       state.success = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAdsConfig.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAdsConfig.fulfilled, (state, action) => {
//         state.loading = false;
//         state.config = action.payload;
//       })
//       .addCase(fetchAdsConfig.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(updateAdsConfig.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(updateAdsConfig.fulfilled, (state, action) => {
//         state.loading = false;
//         state.config = action.payload;
//         state.success = true;
//       })
//       .addCase(updateAdsConfig.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { resetAdsStatus } = adsSlice.actions;
// export default adsSlice.reducer;
