import axios from 'axios';

// Decoupled API utility configured to speak directly to your Express backend
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Points to your backend server port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to automatically attach your secure admin token to outgoing requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;