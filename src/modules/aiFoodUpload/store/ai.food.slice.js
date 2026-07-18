import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  generateAiFoodAPI,
  getAiFoodBatchAPI,
  getAiFoodListAPI,
  updateAiFoodAPI,
  retryAiFoodAPI,
  regenerateAiFoodImageAPI,
  deleteAiFoodAPI,
  saveAiFoodAPI,
} from "../services/ai.food.services";

export const generateAiFood = createAsyncThunk(
  "aiFood/generate",
  async (foodNames, { rejectWithValue }) => {
    try {
      const response = await generateAiFoodAPI(foodNames);
      if (response && response.success) {
        return response.data;
      }
      return rejectWithValue(response?.message || "Failed to start generation");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to start generation",
      );
    }
  },
);

export const pollAiFoodBatch = createAsyncThunk(
  "aiFood/pollBatch",
  async (batchId, { rejectWithValue }) => {
    try {
      const response = await getAiFoodBatchAPI(batchId);
      if (response && response.success) {
        return response.data;
      }
      return rejectWithValue(response?.message || "Failed to fetch batch");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch batch",
      );
    }
  },
);

// Backend-persisted review dashboard — hydrates the table on mount/refresh
// so unsaved (non-approved) generations survive a page reload or navigation,
// since they only ever lived in memory before this.
export const fetchAiFoodList = createAsyncThunk(
  "aiFood/fetchList",
  async (params = { limit: 100 }, { rejectWithValue }) => {
    try {
      const response = await getAiFoodListAPI(params);
      if (response && response.success) {
        return response.data.items;
      }
      return rejectWithValue(response?.message || "Failed to fetch items");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch items",
      );
    }
  },
);

export const updateAiFoodItem = createAsyncThunk(
  "aiFood/updateItem",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateAiFoodAPI(id, data);
      if (response && response.success) {
        return { id, item: response.data };
      }
      return rejectWithValue(response?.message || "Failed to update item");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update item",
      );
    }
  },
);

export const retryAiFoodItem = createAsyncThunk(
  "aiFood/retryItem",
  async (id, { rejectWithValue }) => {
    try {
      const response = await retryAiFoodAPI(id);
      if (response && response.success) {
        return { id, item: response.data };
      }
      return rejectWithValue(response?.message || "Failed to retry item");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to retry item",
      );
    }
  },
);

export const regenerateAiFoodImage = createAsyncThunk(
  "aiFood/regenerateImage",
  async (id, { rejectWithValue }) => {
    try {
      const response = await regenerateAiFoodImageAPI(id);
      if (response && response.success) {
        return { id, item: response.data };
      }
      return rejectWithValue(response?.message || "Failed to regenerate image");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to regenerate image",
      );
    }
  },
);

export const deleteAiFoodItem = createAsyncThunk(
  "aiFood/deleteItem",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteAiFoodAPI(id);
      if (response && response.success) {
        return { id };
      }
      return rejectWithValue(response?.message || "Failed to remove item");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove item",
      );
    }
  },
);

export const saveAiFoodItems = createAsyncThunk(
  "aiFood/saveItems",
  async (ids, { rejectWithValue }) => {
    try {
      const response = await saveAiFoodAPI(ids);
      if (response && response.success) {
        return response.data.results;
      }
      return rejectWithValue(response?.message || "Failed to save items");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save items",
      );
    }
  },
);

const initialState = {
  batchIds: [],
  items: [],
  generateLoading: false,
  polling: false,
  listLoading: false,
  saveLoading: false,
  itemActionIds: [], // ids currently mid-action (retry/regenerate/delete/update)
  saveResults: null,
  error: null,
};

const upsertItems = (state, incoming = []) => {
  incoming.forEach((incomingItem) => {
    const idx = state.items.findIndex((item) => item.id === incomingItem.id);
    if (idx === -1) {
      state.items.push(incomingItem);
    } else {
      state.items[idx] = { ...state.items[idx], ...incomingItem };
    }
  });
};

const aiFoodSlice = createSlice({
  name: "aiFood",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Generate
      .addCase(generateAiFood.pending, (state) => {
        state.generateLoading = true;
        state.error = null;
      })
      .addCase(generateAiFood.fulfilled, (state, action) => {
        state.generateLoading = false;
        if (!state.batchIds.includes(action.payload.batch_id)) {
          state.batchIds.push(action.payload.batch_id);
        }
        upsertItems(state, action.payload.items);
      })
      .addCase(generateAiFood.rejected, (state, action) => {
        state.generateLoading = false;
        state.error = action.payload;
      })

      // Poll batch
      .addCase(pollAiFoodBatch.pending, (state) => {
        state.polling = true;
      })
      .addCase(pollAiFoodBatch.fulfilled, (state, action) => {
        state.polling = false;
        upsertItems(state, action.payload.items);
      })
      .addCase(pollAiFoodBatch.rejected, (state, action) => {
        state.polling = false;
        state.error = action.payload;
      })

      // Fetch list (hydrate from backend)
      .addCase(fetchAiFoodList.pending, (state) => {
        state.listLoading = true;
      })
      .addCase(fetchAiFoodList.fulfilled, (state, action) => {
        state.listLoading = false;
        upsertItems(state, action.payload);
      })
      .addCase(fetchAiFoodList.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload;
      })

      // Update item
      .addCase(updateAiFoodItem.pending, (state, action) => {
        state.itemActionIds.push(action.meta.arg.id);
      })
      .addCase(updateAiFoodItem.fulfilled, (state, action) => {
        state.itemActionIds = state.itemActionIds.filter(
          (id) => id !== action.payload.id,
        );
        if (action.payload.item) upsertItems(state, [action.payload.item]);
      })
      .addCase(updateAiFoodItem.rejected, (state, action) => {
        state.itemActionIds = state.itemActionIds.filter(
          (id) => id !== action.meta.arg.id,
        );
        state.error = action.payload;
      })

      // Retry item
      .addCase(retryAiFoodItem.pending, (state, action) => {
        state.itemActionIds.push(action.meta.arg);
      })
      .addCase(retryAiFoodItem.fulfilled, (state, action) => {
        state.itemActionIds = state.itemActionIds.filter(
          (id) => id !== action.payload.id,
        );
        if (action.payload.item) {
          upsertItems(state, [action.payload.item]);
        } else {
          const item = state.items.find((it) => it.id === action.payload.id);
          if (item) item.status = "processing";
        }
      })
      .addCase(retryAiFoodItem.rejected, (state, action) => {
        state.itemActionIds = state.itemActionIds.filter(
          (id) => id !== action.meta.arg,
        );
        state.error = action.payload;
      })

      // Regenerate image
      .addCase(regenerateAiFoodImage.pending, (state, action) => {
        state.itemActionIds.push(action.meta.arg);
      })
      .addCase(regenerateAiFoodImage.fulfilled, (state, action) => {
        state.itemActionIds = state.itemActionIds.filter(
          (id) => id !== action.payload.id,
        );
        if (action.payload.item) {
          upsertItems(state, [action.payload.item]);
        } else {
          const item = state.items.find((it) => it.id === action.payload.id);
          if (item) item.image_status = "pending";
        }
      })
      .addCase(regenerateAiFoodImage.rejected, (state, action) => {
        state.itemActionIds = state.itemActionIds.filter(
          (id) => id !== action.meta.arg,
        );
        state.error = action.payload;
      })

      // Delete item
      .addCase(deleteAiFoodItem.pending, (state, action) => {
        state.itemActionIds.push(action.meta.arg);
      })
      .addCase(deleteAiFoodItem.fulfilled, (state, action) => {
        state.itemActionIds = state.itemActionIds.filter(
          (id) => id !== action.payload.id,
        );
        state.items = state.items.filter(
          (item) => item.id !== action.payload.id,
        );
      })
      .addCase(deleteAiFoodItem.rejected, (state, action) => {
        state.itemActionIds = state.itemActionIds.filter(
          (id) => id !== action.meta.arg,
        );
        state.error = action.payload;
      })

      // Save items
      .addCase(saveAiFoodItems.pending, (state) => {
        state.saveLoading = true;
        state.saveResults = null;
      })
      .addCase(saveAiFoodItems.fulfilled, (state, action) => {
        state.saveLoading = false;
        state.saveResults = action.payload;
        const savedIds = action.payload
          .filter((r) => r.outcome === "saved" || r.outcome === "already_saved")
          .map((r) => r.id);
        state.items = state.items.map((item) =>
          savedIds.includes(item.id) ? { ...item, status: "approved" } : item,
        );
      })
      .addCase(saveAiFoodItems.rejected, (state, action) => {
        state.saveLoading = false;
        state.error = action.payload;
      });
  },
});

export default aiFoodSlice.reducer;
