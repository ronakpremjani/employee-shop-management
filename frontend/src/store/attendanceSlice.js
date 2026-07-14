import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as attendanceApi from '../api/endpoints/attendance';

const initialState = {
  history: [],
  today: null,
  loading: false,
  error: null,
};

export const recordCheckIn = createAsyncThunk(
  'attendance/checkIn',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.checkIn();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Check-in failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Check-in failed');
    }
  }
);

export const recordCheckOut = createAsyncThunk(
  'attendance/checkOut',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.checkOut();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Check-out failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Check-out failed');
    }
  }
);

export const fetchMyAttendance = createAsyncThunk(
  'attendance/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getMyAttendance();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch attendance');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch attendance');
    }
  }
);

export const fetchUserAttendance = createAsyncThunk(
  'attendance/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getAttendanceByUserId(userId);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch attendance');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch attendance');
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearAttendanceError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Check-in
      .addCase(recordCheckIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(recordCheckIn.fulfilled, (state, action) => {
        state.loading = false;
        state.today = action.payload;
        state.history.unshift(action.payload);
      })
      .addCase(recordCheckIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check-out
      .addCase(recordCheckOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(recordCheckOut.fulfilled, (state, action) => {
        state.loading = false;
        state.today = action.payload;
        const index = state.history.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.history[index] = action.payload;
        } else {
          state.history.unshift(action.payload);
        }
      })
      .addCase(recordCheckOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch My Attendance
      .addCase(fetchMyAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
        
        // Find if there's checkin for today (using local calendar day matching to prevent timezone shifting)
        const localToday = new Date();
        const todayRecord = action.payload.find(record => {
          const recDate = new Date(record.date);
          return recDate.getFullYear() === localToday.getFullYear() &&
                 recDate.getMonth() === localToday.getMonth() &&
                 recDate.getDate() === localToday.getDate();
        });
        state.today = todayRecord || null;
      })
      .addCase(fetchMyAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch User Attendance (Admin view)
      .addCase(fetchUserAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchUserAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAttendanceError } = attendanceSlice.actions;
export default attendanceSlice.reducer;
