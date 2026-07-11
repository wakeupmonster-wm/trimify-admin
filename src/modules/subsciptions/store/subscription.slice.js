// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   getConfigAPI,
//   updateConfigAPI,
//   listProductsAPI,
//   createProductAPI,
//   updateProductAPI,
//   listSubscribersAPI,
//   getUserDetailAPI,
//   manualGrantAPI,
//   grantConsumableAPI,
//   revokeSubscriptionAPI,
//   extendSubscriptionAPI,
//   getDashboardStatsAPI,
//   getSubscriptionStatsAPI,
//   listFeaturesAPI,
//   upsertFeatureAPI,
//   toggleFeatureAPI,
//   deleteFeatureAPI,
//   exportTransactionsCSVAPI,
// } from "../services/subscription.services";

// /*===================== ASYNC THUNKS =====================*/

// export const fetchDashboardStats = createAsyncThunk(
//   "subscription/fetchDashboardStats",
//   async (params, { rejectWithValue }) => {
//     try {
//       const response = await getDashboardStatsAPI(params);
//       if (response && response.success) return response.data;
//       return rejectWithValue(response.message || "Failed to fetch dashboard");
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Server Error");
//     }
//   },
// );

// export const fetchSubscriptionKPIs = createAsyncThunk(
//   "subscription/fetchSubscriptionKPIs",
//   async (params, { rejectWithValue }) => {
//     try {
//       const response = await getSubscriptionStatsAPI(params);
//       if (response && response.success) return response.data;
//       return rejectWithValue(response.message || "Failed to fetch stats");
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Server Error");
//     }
//   },
// );

// export const fetchConfig = createAsyncThunk(
//   "subscription/fetchConfig",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await getConfigAPI();
//       if (response && response.success) return response.data;
//       return rejectWithValue(response.message || "Failed to fetch config");
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Server Error");
//     }
//   },
// );

// export const saveConfig = createAsyncThunk(
//   "subscription/saveConfig",
//   async (data, { rejectWithValue }) => {
//     try {
//       const response = await updateConfigAPI(data);
//       if (response && response.success) return response.data;
//       return rejectWithValue(response.message || "Failed to update config");
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Server Error");
//     }
//   },
// );

// export const fetchProducts = createAsyncThunk(
//   "subscription/fetchProducts",
//   async ({ page, limit, type, isActive } = {}, { rejectWithValue }) => {
//     try {
//       const response = await listProductsAPI(page, limit, type, isActive);
//       if (response && response.success) {
//         return {
//           products: response.data || [],
//           pagination: response.pagination,
//         };
//       }
//       return rejectWithValue(response.message || "Failed to fetch products");
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Server Error");
//     }
//   },
// );

// export const createProduct = createAsyncThunk(
//   "subscription/createProduct",
//   async (data, { rejectWithValue }) => {
//     try {
//       const response = await createProductAPI(data);
//       if (response && response.success) return response.data;
//       return rejectWithValue(response.message || "Failed to create product");
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Server Error");
//     }
//   },
// );

// export const updateProduct = createAsyncThunk(
//   "subscription/updateProduct",
//   async ({ productKey, data }, { rejectWithValue }) => {
//     try {
//       const response = await updateProductAPI(productKey, data);
//       if (response && response.success) return response.data;
//       return rejectWithValue(response.message || "Failed to update product");
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Server Error");
//     }
//   },
// );

// export const fetchSubscribers = createAsyncThunk(
//   "subscription/fetchSubscribers",
//   async (
//     { page, limit, status, planType, platform, search } = {},
//     { rejectWithValue },
//   ) => {
//     try {
//       const response = await listSubscribersAPI(
//         page,
//         limit,
//         status,
//         planType,
//         platform,
//         search,
//       );
//       if (response && response.success) {
//         return {
//           subscribers: response.data || [],
//           pagination: response.pagination,
//         };
//       }
//       return rejectWithValue(response.message || "Failed to fetch subscribers");
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch subscribers",
//       );
//     }
//   },
// );

// export const fetchUserDetail = createAsyncThunk(
//   "subscription/fetchUserDetail",
//   async (userId, { rejectWithValue }) => {
//     try {
//       if (!userId) throw new Error("User ID is required");
//       const response = await getUserDetailAPI(userId);
//       if (response && response.success) return response.data;
//       return rejectWithValue(response.message || "Failed to fetch user detail");
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || error.message || "Server Error",
//       );
//     }
//   },
// );

// export const grantSubscription = createAsyncThunk(
//   "subscription/grantSubscription",
//   async ({ userId, data }, { rejectWithValue }) => {
//     try {
//       const response = await manualGrantAPI(userId, data);
//       if (response && response.success) return response.data;
//       return rejectWithValue(
//         response.message || "Failed to grant subscription",
//       );
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Server Error");
//     }
//   },
// );

// export const grantConsumables = createAsyncThunk(
//   "subscription/grantConsumables",
//   async ({ userId, data }, { rejectWithValue }) => {
//     try {
//       const response = await grantConsumableAPI(userId, data);
//       if (response && response.success) return response;
//       return rejectWithValue(response.message || "Failed to grant consumables");
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Server Error");
//     }
//   },
// );

// export const revokeUserSubscription = createAsyncThunk(
//   "subscription/revokeSubscription",
//   async ({ userId, data }, { rejectWithValue }) => {
//     try {
//       const response = await revokeSubscriptionAPI(userId, data);
//       if (response && response.success) return response;
//       return rejectWithValue(response.message || "Failed to revoke");
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Server Error");
//     }
//   },
// );

// export const extendSubscription = createAsyncThunk(
//   "subscription/extendSubscription",
//   async ({ userId, data }, { rejectWithValue }) => {
//     try {
//       const response = await extendSubscriptionAPI(userId, data);
//       if (response && response.success) return response;
//       return rejectWithValue(
//         response.message || "Failed to extend subscription",
//       );
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Server Error");
//     }
//   },
// );

// export const fetchRevenueAnalytics = createAsyncThunk(
//   "subscription/fetchRevenueAnalytics",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await getDashboardStatsAPI();
//       if (response && response.success) return response.data;
//       return rejectWithValue("Failed to fetch revenue analytics");
//     } catch (error) {
//       return rejectWithValue("Error");
//     }
//   },
// );

// export const fetchCancellationAnalytics = createAsyncThunk(
//   "subscription/fetchCancellationAnalytics",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await getDashboardStatsAPI();
//       if (response && response.success) return response.data;
//       return rejectWithValue("Failed to fetch analytics");
//     } catch (error) {
//       return rejectWithValue("Error");
//     }
//   },
// );

// export const fetchAllTransactions = createAsyncThunk(
//   "subscription/fetchAllTransactions",
//   async (_, { rejectWithValue }) => {
//     return [];
//   },
// );

// export const exportTransactionsStream = createAsyncThunk(
//   "subscription/exportStream",
//   async (filters, { dispatch, rejectWithValue }) => {
//     try {
//       dispatch(setExportProgress(5));
//       const response = await exportTransactionsCSVAPI(filters);

//       if (!response.ok) throw new Error("Failed to connect to export stream");

//       const reader = response.body.getReader();
//       const decoder = new TextDecoder();
//       let csvData = "";

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;

//         const chunk = decoder.decode(value, { stream: true });

//         // Extract Progress
//         const progressRegex = /---PROG:(\d+)---/g;
//         let match;
//         while ((match = progressRegex.exec(chunk)) !== null) {
//           const progressValue = Number(match[1]);
//           dispatch(setExportProgress(progressValue));
//         }

//         // Sanitize data: remove markers AND the extra newlines added for safety
//         const cleanChunk = chunk.replace(/\n?---PROG:\d+---\n?/g, "");
//         csvData += cleanChunk;
//       }

//       dispatch(setExportProgress(100));
//       return csvData;
//     } catch (error) {
//       console.error("Export Stream Thunk Error:", error);
//       return rejectWithValue(error.message || "Streaming export failed");
//     }
//   },
// );

// export const fetchRiskUsers = createAsyncThunk(
//   "subscription/fetchRiskUsers",
//   async (_, { rejectWithValue }) => {
//     return [];
//   },
// );

// /*===================== DYNAMIC FEATURES (NEW) =====================*/

// export const fetchFeatures = createAsyncThunk(
//   "subscription/fetchFeatures",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await listFeaturesAPI();
//       if (response && response.success) return response.data;
//       return rejectWithValue(response.message || "Failed to fetch features");
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Server Error");
//     }
//   },
// );

// export const upsertFeature = createAsyncThunk(
//   "subscription/upsertFeature",
//   async (data, { rejectWithValue }) => {
//     try {
//       const response = await upsertFeatureAPI(data);
//       if (response && response.success) return response.data;
//       return rejectWithValue(response.message || "Failed to save feature");
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Server Error");
//     }
//   },
// );

// export const toggleFeatureStatus = createAsyncThunk(
//   "subscription/toggleFeature",
//   async ({ key, isActive }, { rejectWithValue }) => {
//     try {
//       const response = await toggleFeatureAPI(key, isActive);
//       if (response && response.success) return response.data;
//       return rejectWithValue(response.message || "Failed to toggle feature");
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Server Error");
//     }
//   },
// );

// export const deleteFeature = createAsyncThunk(
//   "subscription/deleteFeature",
//   async (key, { rejectWithValue }) => {
//     try {
//       const response = await deleteFeatureAPI(key);
//       if (response && response.success) return { key, data: response.data };
//       return rejectWithValue(response.message || "Failed to delete feature");
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Server Error");
//     }
//   },
// );

// /*===================== SLICE =====================*/
// const subscriptionSlice = createSlice({
//   name: "subscription",
//   initialState: {
//     dashboardStats: null,
//     dashboardLoading: false,
//     subscriptionStats: null,
//     statsLoading: false,
//     subscribers: [],
//     subscribersLoading: false,
//     pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
//     userDetail: null,
//     userDetailLoading: false,
//     products: [],
//     productsLoading: false,
//     productsPagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
//     config: null,
//     dynamicFeatures: [], // New state for dynamic management
//     featuresLoading: false,
//     configLoading: false,
//     // Analytics Support
//     revenueAnalytic: {
//       revenue: {},
//       daily: [],
//       byPlan: [],
//       byPlatform: [],
//       period: {},
//     },
//     riskUsers: [],
//     cancelAnalytics: { total: 0, daily: [] },
//     allTransactions: [],
//     loading: false, // Legacy selector compatibility
//     dateRange: null,
//     exportLoading: false,
//     exportProgress: 0,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearUserDetail: (state) => {
//       state.userDetail = null;
//     },
//     setSubscriptionDateRange: (state, action) => {
//       state.dateRange = action.payload;
//     },
//     clearSubscriptionState: (state) => {
//       state.dashboardStats = null;
//       state.subscribers = [];
//       state.products = [];
//       state.config = null;
//     },
//     setExportProgress: (state, action) => {
//       state.exportProgress = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Dashboard
//       .addCase(fetchDashboardStats.pending, (state) => {
//         state.dashboardLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchDashboardStats.fulfilled, (state, action) => {
//         state.dashboardLoading = false;
//         state.dashboardStats = action.payload;
//       })
//       .addCase(fetchDashboardStats.rejected, (state, action) => {
//         state.dashboardLoading = false;
//         state.error = action.payload;
//       })
//       // Subscription Stats
//       .addCase(fetchSubscriptionKPIs.pending, (state) => {
//         state.statsLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchSubscriptionKPIs.fulfilled, (state, action) => {
//         state.statsLoading = false;
//         state.subscriptionStats = action.payload;
//       })
//       .addCase(fetchSubscriptionKPIs.rejected, (state, action) => {
//         state.statsLoading = false;
//         state.error = action.payload;
//       })
//       // Config
//       .addCase(fetchConfig.pending, (state) => {
//         state.configLoading = true;
//       })
//       .addCase(fetchConfig.fulfilled, (state, action) => {
//         state.configLoading = false;
//         state.config = action.payload;
//       })
//       .addCase(fetchConfig.rejected, (state, action) => {
//         state.configLoading = false;
//         state.error = action.payload;
//       })
//       .addCase(saveConfig.pending, (state) => {
//         state.actionLoading = true;
//       })
//       .addCase(saveConfig.fulfilled, (state, action) => {
//         state.actionLoading = false;
//         state.config = action.payload;
//       })
//       .addCase(saveConfig.rejected, (state, action) => {
//         state.actionLoading = false;
//         state.error = action.payload;
//       })
//       // Products
//       .addCase(fetchProducts.pending, (state) => {
//         state.productsLoading = true;
//       })
//       .addCase(fetchProducts.fulfilled, (state, action) => {
//         state.productsLoading = false;
//         state.products = action.payload.products;
//         state.productsPagination = action.payload.pagination;
//       })
//       .addCase(fetchProducts.rejected, (state, action) => {
//         state.productsLoading = false;
//         state.error = action.payload;
//       })
//       .addCase(createProduct.pending, (state) => {
//         state.actionLoading = true;
//       })
//       .addCase(createProduct.fulfilled, (state, action) => {
//         state.actionLoading = false;
//         state.products = [action.payload, ...state.products];
//       })
//       .addCase(createProduct.rejected, (state, action) => {
//         state.actionLoading = false;
//         state.error = action.payload;
//       })
//       .addCase(updateProduct.pending, (state) => {
//         state.actionLoading = true;
//       })
//       .addCase(updateProduct.fulfilled, (state, action) => {
//         state.actionLoading = false;
//         const idx = state.products.findIndex(
//           (p) => p.productKey === action.payload.productKey,
//         );
//         if (idx !== -1) state.products[idx] = action.payload;
//       })
//       .addCase(updateProduct.rejected, (state, action) => {
//         state.actionLoading = false;
//         state.error = action.payload;
//       })
//       // Subscribers
//       .addCase(fetchSubscribers.pending, (state) => {
//         state.subscribersLoading = true;
//       })
//       .addCase(fetchSubscribers.fulfilled, (state, action) => {
//         state.subscribersLoading = false;
//         state.subscribers = action.payload.subscribers;
//         state.pagination = action.payload.pagination;
//       })
//       .addCase(fetchSubscribers.rejected, (state, action) => {
//         state.subscribersLoading = false;
//         state.error = action.payload;
//       })
//       // User Detail
//       .addCase(fetchUserDetail.pending, (state) => {
//         state.userDetailLoading = true;
//       })
//       .addCase(fetchUserDetail.fulfilled, (state, action) => {
//         state.userDetailLoading = false;
//         state.userDetail = action.payload;
//       })
//       .addCase(fetchUserDetail.rejected, (state, action) => {
//         state.userDetailLoading = false;
//         state.error = action.payload;
//       })
//       // Actions
//       .addCase(grantSubscription.pending, (state) => {
//         state.actionLoading = true;
//       })
//       .addCase(grantSubscription.fulfilled, (state) => {
//         state.actionLoading = false;
//       })
//       .addCase(grantSubscription.rejected, (state, action) => {
//         state.actionLoading = false;
//         state.error = action.payload;
//       })
//       .addCase(grantConsumables.pending, (state) => {
//         state.actionLoading = true;
//       })
//       .addCase(grantConsumables.fulfilled, (state, action) => {
//         state.actionLoading = false;
//         const { type, quantity } = action.meta.arg.data;
//         if (state.userDetail?.wallet) {
//           if (type === "SUPER_KEEN") {
//             state.userDetail.wallet.superKeensBalance =
//               (state.userDetail.wallet.superKeensBalance || 0) +
//               Number(quantity);
//           } else if (type === "BOOST") {
//             state.userDetail.wallet.boostsBalance =
//               (state.userDetail.wallet.boostsBalance || 0) + Number(quantity);
//           }
//         }
//       })
//       .addCase(grantConsumables.rejected, (state, action) => {
//         state.actionLoading = false;
//         state.error = action.payload;
//       })
//       .addCase(revokeUserSubscription.pending, (state) => {
//         state.actionLoading = true;
//       })
//       .addCase(revokeUserSubscription.fulfilled, (state) => {
//         state.actionLoading = false;
//       })
//       .addCase(revokeUserSubscription.rejected, (state, action) => {
//         state.actionLoading = false;
//         state.error = action.payload;
//       })
//       .addCase(extendSubscription.pending, (state) => {
//         state.actionLoading = true;
//       })
//       .addCase(extendSubscription.fulfilled, (state) => {
//         state.actionLoading = false;
//       })
//       .addCase(extendSubscription.rejected, (state, action) => {
//         state.actionLoading = false;
//         state.error = action.payload;
//       })
//       // Analytics Mappings
//       .addCase(fetchRevenueAnalytics.fulfilled, (state, action) => {
//         const data = action.payload;
//         state.revenueAnalytic = {
//           revenue: {
//             total: data.kpis.todayRevenue * 30,
//             net: data.kpis.todayRevenue * 25,
//           }, // Simulated
//           daily: (data.revenueTrend || []).map((d) => ({
//             ...d,
//             revenue: d.dailyRevenue,
//           })),
//           byPlatform: data.platformMix || [],
//           period: { start: new Date(), end: new Date() },
//         };
//       })
//       .addCase(fetchCancellationAnalytics.fulfilled, (state, action) => {
//         state.cancelAnalytics = { total: 0, daily: [] };
//       })
//       .addCase(fetchAllTransactions.fulfilled, (state, action) => {
//         state.allTransactions = action.payload;
//       })
//       .addCase(fetchRiskUsers.fulfilled, (state, action) => {
//         state.riskUsers = action.payload;
//       })
//       // Dynamic Features
//       .addCase(fetchFeatures.pending, (state) => {
//         state.featuresLoading = true;
//       })
//       .addCase(fetchFeatures.fulfilled, (state, action) => {
//         state.featuresLoading = false;
//         state.dynamicFeatures = action.payload;
//       })
//       .addCase(fetchFeatures.rejected, (state, action) => {
//         state.featuresLoading = false;
//         state.error = action.payload;
//       })
//       .addCase(upsertFeature.pending, (state) => {
//         state.actionLoading = true;
//       })
//       .addCase(upsertFeature.fulfilled, (state, action) => {
//         state.actionLoading = false;
//         state.dynamicFeatures = action.payload; // Backend returns the full updated list
//       })
//       .addCase(upsertFeature.rejected, (state, action) => {
//         state.actionLoading = false;
//         state.error = action.payload;
//       })
//       .addCase(toggleFeatureStatus.fulfilled, (state, action) => {
//         const idx = state.dynamicFeatures.findIndex(
//           (f) => f.key === action.payload.key,
//         );
//         if (idx !== -1) state.dynamicFeatures[idx] = action.payload;
//       })
//       .addCase(deleteFeature.fulfilled, (state, action) => {
//         state.dynamicFeatures = action.payload.data; // Backend returns updated list
//       })
//       // Export Stream
//       .addCase(exportTransactionsStream.pending, (state) => {
//         state.exportLoading = true;
//         state.exportProgress = 0;
//       })
//       .addCase(exportTransactionsStream.fulfilled, (state) => {
//         state.exportLoading = false;
//         state.exportProgress = 100;
//       })
//       .addCase(exportTransactionsStream.rejected, (state) => {
//         state.exportLoading = false;
//         state.exportProgress = 0;
//       });
//   },
// });

// export const {
//   clearError,
//   clearUserDetail,
//   clearSubscriptionState,
//   setSubscriptionDateRange,
//   setExportProgress,
// } = subscriptionSlice.actions;
// export default subscriptionSlice.reducer;
