import api from '../axios';

export const checkIn = async () => {
  return api.post('/attendance/check-in');
};

export const checkOut = async () => {
  return api.put('/attendance/check-out');
};

export const getMyAttendance = async () => {
  return api.get('/attendance/my-attendance');
};

export const getAttendanceByUserId = async (userId) => {
  return api.get(`/attendance/user/${userId}`);
};
