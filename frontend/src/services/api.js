import axios from 'axios';

const API_URL = 'https://walletapp-89se.onrender.com/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });
        localStorage.setItem('access_token', response.data.access);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (err) {
        // Refresh token has expired, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  getUserDetails: () => api.get('/auth/user/'),
};

export const accountAPI = {
  getAll: () => api.get('/api/accounts/'),
  getOne: (id) => api.get(`/api/accounts/${id}/`),
  create: (data) => api.post('/api/accounts/', data),
  update: (id, data) => api.put(`/api/accounts/${id}/`, data),
  delete: (id) => api.delete(`/api/accounts/${id}/`),
};

export const categoryAPI = {
  getAll: () => api.get('/api/categories/'),
  getOne: (id) => api.get(`/api/categories/${id}/`),
  create: (data) => api.post('/api/categories/', data),
  update: (id, data) => api.put(`/api/categories/${id}/`, data),
  delete: (id) => api.delete(`/api/categories/${id}/`),
};

export const transactionAPI = {
  getAll: (params) => api.get('/api/transactions/', { params }),
  getOne: (id) => api.get(`/api/transactions/${id}/`),
  create: (data) => api.post('/api/transactions/', data),
  update: (id, data) => api.put(`/api/transactions/${id}/`, data),
  delete: (id) => api.delete(`/api/transactions/${id}/`),
  getReport: (params) => api.get('/api/transactions/generate_report/', 
    { params: {
    start_date: params.start_date,
    end_date: params.end_date
  } }),
  getVisualizationData: (params) => api.get('/api/transactions/visualization_data/', { params }),
};

export const budgetAPI = {
  getAll: () => api.get('/api/budgets/'),
  getOne: (id) => api.get(`/api/budgets/${id}/`),
  create: (data) => api.post('/api/budgets/', data),
  update: (id, data) => api.put(`/api/budgets/${id}/`, data),
  delete: (id) => api.delete(`/api/budgets/${id}/`),
  getProgress: (id) => api.get(`/api/budgets/${id}/progress/`),
};

export default api;