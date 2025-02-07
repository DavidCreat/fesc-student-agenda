import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response?.status === 500) {
      console.error('Error del servidor:', error.response.data);
    }
    throw error;
  }
);

export { api }; 