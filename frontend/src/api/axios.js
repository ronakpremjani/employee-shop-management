import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

api.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error)
);

export default api;

