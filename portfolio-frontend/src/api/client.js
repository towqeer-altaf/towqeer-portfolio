import axios from 'axios';
 
// Centralized Axios instance. All requests share the same base URL,
// so components never hardcode 'http://localhost:5000' again.
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});
 
// Attaches the admin token fresh on every request (instead of each
// component re-reading localStorage and rebuilding the header).
export const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
});
 
export default api;
 