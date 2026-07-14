import api from '../axios';

export const logPurchase = async (purchaseData) => {
  return api.post('/purchase', purchaseData);
};

export const getPurchases = async () => {
  const userVal = localStorage.getItem('user');
  const user = userVal ? JSON.parse(userVal) : {};
  const path = user.role === 'admin' ? '/purchase' : '/purchase/my';
  return api.get(path);
};
