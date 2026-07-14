import api from '../axios';

export const requestAdvance = async (advanceData) => {
  return api.post('/advance-salary', advanceData);
};

export const getAdvances = async () => {
  const userVal = localStorage.getItem('user');
  const user = userVal ? JSON.parse(userVal) : {};
  const path = user.role === 'admin' ? '/advance-salary' : '/advance-salary/my';
  return api.get(path);
};

export const updateAdvanceStatus = async (id, { status }) => {
  const action = status === 'Approved' ? 'approve' : 'reject';
  return api.put(`/advance-salary/${id}/${action}`);
};
