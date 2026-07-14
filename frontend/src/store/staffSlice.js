import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as staffApi from '../api/endpoints/staff';

const initialState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchStaffList = createAsyncThunk(
  'staff/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await staffApi.getAllStaff();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch staff');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch staff');
    }
  }
);

export const addStaffMember = createAsyncThunk(
  'staff/add',
  async (staffData, { rejectWithValue }) => {
    try {
      const response = await staffApi.createStaff(staffData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to create staff');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to create staff');
    }
  }
);

export const editStaffMember = createAsyncThunk(
  'staff/edit',
  async ({ id, staffData }, { rejectWithValue }) => {
    try {
      const response = await staffApi.updateStaff(id, staffData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to update staff');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to update staff');
    }
  }
);

export const deactivateStaffMember = createAsyncThunk(
  'staff/deactivate',
  async (id, { rejectWithValue }) => {
    try {
      const response = await staffApi.updateStaffStatus(id, { status: 'Inactive' });
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to deactivate staff');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to deactivate staff');
    }
  }
);

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    clearStaffError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch staff
      .addCase(fetchStaffList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchStaffList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add staff
      .addCase(addStaffMember.pending, (state) => {
        state.loading = true;
      })
      .addCase(addStaffMember.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(addStaffMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Edit staff
      .addCase(editStaffMember.pending, (state) => {
        state.loading = true;
      })
      .addCase(editStaffMember.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(editStaffMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Deactivate staff
      .addCase(deactivateStaffMember.pending, (state) => {
        state.loading = true;
      })
      .addCase(deactivateStaffMember.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deactivateStaffMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStaffError } = staffSlice.actions;
export default staffSlice.reducer;
