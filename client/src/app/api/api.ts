import axios from 'axios';

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5003/api',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example of an interceptor to add authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;