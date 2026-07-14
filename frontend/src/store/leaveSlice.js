import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as leaveApi from '../api/endpoints/leave';

const initialState = {
  requests: [],
  loading: false,
  error: null,
};

export const applyForLeave = createAsyncThunk(
  'leave/apply',
  async (leaveData, { rejectWithValue }) => {
    try {
      const response = await leaveApi.requestLeave(leaveData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to submit leave request');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to submit leave request');
    }
  }
);

export const fetchLeaveRequests = createAsyncThunk(
  'leave/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await leaveApi.getLeaveRequests();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch leave requests');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch leave requests');
    }
  }
);

export const changeLeaveStatus = createAsyncThunk(
  'leave/changeStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await leaveApi.updateLeaveStatus(id, { status });
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to update leave status');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to update leave status');
    }
  }
);

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    clearLeaveError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Apply Leave
      .addCase(applyForLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyForLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.requests.unshift(action.payload);
      })
      .addCase(applyForLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Leaves
      .addCase(fetchLeaveRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Change status
      .addCase(changeLeaveStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(changeLeaveStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.requests.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
      })
      .addCase(changeLeaveStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLeaveError } = leaveSlice.actions;
export default leaveSlice.reducer;
