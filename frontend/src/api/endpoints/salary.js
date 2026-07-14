import api from '../axios';

export const generateSalary = async (salaryData) => {
  return api.post('/salary/generate', salaryData);
};

export const getSalaries = async () => {
  const userVal = localStorage.getItem('user');
  const user = userVal ? JSON.parse(userVal) : {};
  const path = user.role === 'admin' ? '/salary' : '/salary/my';
  return api.get(path);
};
