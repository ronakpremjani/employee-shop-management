import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as advanceApi from '../api/endpoints/advance';

const initialState = {
  requests: [],
  loading: false,
  error: null,
};

export const applyForAdvance = createAsyncThunk(
  'advance/apply',
  async (advanceData, { rejectWithValue }) => {
    try {
      const response = await advanceApi.requestAdvance(advanceData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to submit advance salary request');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to submit advance salary request');
    }
  }
);

export const fetchAdvanceRequests = createAsyncThunk(
  'advance/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await advanceApi.getAdvances();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch advance requests');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch advance requests');
    }
  }
);

export const changeAdvanceStatus = createAsyncThunk(
  'advance/changeStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await advanceApi.updateAdvanceStatus(id, { status });
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to update advance request status');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to update advance request status');
    }
  }
);

const advanceSlice = createSlice({
  name: 'advance',
  initialState,
  reducers: {
    clearAdvanceError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Apply Advance
      .addCase(applyForAdvance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyForAdvance.fulfilled, (state, action) => {
        state.loading = false;
        state.requests.unshift(action.payload);
      })
      .addCase(applyForAdvance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Advances
      .addCase(fetchAdvanceRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdvanceRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchAdvanceRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Change Status
      .addCase(changeAdvanceStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(changeAdvanceStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.requests.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
      })
      .addCase(changeAdvanceStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdvanceError } = advanceSlice.actions;
export default advanceSlice.reducer;
