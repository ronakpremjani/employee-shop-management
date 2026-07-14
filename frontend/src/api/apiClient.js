import axios from 'axios';
import toast from 'react-hot-toast';

// Create base axios instance connecting strictly to the backend port
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling (401, 403, 500)
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response ? error.response.status : null;
    const message = error.response?.data?.message || 'Something went wrong';

    if (status === 401) {
      // Clear token and user info from storage on 401
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error('Session expired or unauthorized. Please log in again.');
      
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    } else if (status === 403) {
      toast.error('Access Denied: You do not have permissions for this action.');
    } else if (status === 500) {
      toast.error(message || 'Internal Server Error.');
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
