import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/authSlice';
import staffReducer from '../store/staffSlice';
import attendanceReducer from '../store/attendanceSlice';
import leaveReducer from '../store/leaveSlice';
import advanceReducer from '../store/advanceSlice';
import purchaseReducer from '../store/purchaseSlice';
import salaryReducer from '../store/salarySlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    staff: staffReducer,
    attendance: attendanceReducer,
    leave: leaveReducer,
    advance: advanceReducer,
    purchase: purchaseReducer,
    salary: salaryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
