import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Surface Laravel's actual validation/error message instead of axios's generic one
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    const firstFieldError = data?.errors
      ? Object.values(data.errors).flat()[0]
      : null;
    error.message = firstFieldError ?? data?.message ?? error.message;
    return Promise.reject(error);
  }
);

export default api;
