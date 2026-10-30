import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`,
});

export const assetUrl = (fileUrl) => {
  if (!fileUrl) return '';
  if (/^https?:\/\//i.test(fileUrl)) return fileUrl;
  return new URL(fileUrl, new URL(api.defaults.baseURL).origin).toString();
};

export default api;
 