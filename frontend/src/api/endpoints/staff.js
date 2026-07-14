import api from '../axios';

export const createStaff = async (staffData) => {
  return api.post('/staff', staffData);
};

export const updateStaff = async (id, staffData) => {
  return api.put(`/staff/${id}`, staffData);
};

export const updateStaffStatus = async (id, statusData) => {
  return api.put(`/staff/${id}/status`, statusData);
};

export const getAllStaff = async () => {
  return api.get('/staff');
};
