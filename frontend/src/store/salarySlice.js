import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as salaryApi from '../api/endpoints/salary';

const initialState = {
  history: [],
  loading: false,
  error: null,
};

export const runGenerateSalary = createAsyncThunk(
  'salary/generate',
  async (salaryData, { rejectWithValue }) => {
    try {
      const response = await salaryApi.generateSalary(salaryData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to generate salary');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to generate salary');
    }
  }
);

export const fetchSalaries = createAsyncThunk(
  'salary/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await salaryApi.getSalaries();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch salaries');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch salaries');
    }
  }
);

const salarySlice = createSlice({
  name: 'salary',
  initialState,
  reducers: {
    clearSalaryError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Generate Salary
      .addCase(runGenerateSalary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(runGenerateSalary.fulfilled, (state, action) => {
        state.loading = false;
        state.history.unshift(action.payload);
      })
      .addCase(runGenerateSalary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Salaries
      .addCase(fetchSalaries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalaries.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchSalaries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSalaryError } = salarySlice.actions;
export default salarySlice.reducer;
