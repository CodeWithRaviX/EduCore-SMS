import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  try {
    const savedUser = localStorage.getItem('educore_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      if (user.role) {
        config.headers['X-User-Role'] = user.role;
      }
    }
  } catch (e) {
    console.error('Error attaching auth headers:', e);
  }
  return config;
});

export default api;
