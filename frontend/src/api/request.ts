import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

request.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default request;
