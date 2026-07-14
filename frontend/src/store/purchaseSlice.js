import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as purchaseApi from '../api/endpoints/purchase';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const recordPurchase = createAsyncThunk(
  'purchase/record',
  async (purchaseData, { rejectWithValue }) => {
    try {
      const response = await purchaseApi.logPurchase(purchaseData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to log purchase');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to log purchase');
    }
  }
);

export const fetchPurchases = createAsyncThunk(
  'purchase/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await purchaseApi.getPurchases();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch purchases');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch purchases');
    }
  }
);

const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {
    clearPurchaseError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Record Purchase
      .addCase(recordPurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(recordPurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(recordPurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Purchases
      .addCase(fetchPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPurchaseError } = purchaseSlice.actions;
export default purchaseSlice.reducer;
