import api from '../axios';

export const requestLeave = async (leaveData) => {
  return api.post('/leave', leaveData);
};

export const getLeaveRequests = async () => {
  return api.get('/leave');
};

export const updateLeaveStatus = async (id, statusData) => {
  return api.put(`/leave/${id}/status`, statusData);
};
