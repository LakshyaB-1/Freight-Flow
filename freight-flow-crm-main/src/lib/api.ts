import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; companyName?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: { companyName?: string; notificationPreferences?: object }) =>
    api.put('/auth/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/password', data),
};

// Shipments API
export const shipmentsApi = {
  getAll: (params?: { status?: string; search?: string; page?: number; limit?: number }) =>
    api.get('/shipments', { params }),
  getOne: (id: string) => api.get(`/shipments/${id}`),
  create: (data: object) => api.post('/shipments', data),
  update: (id: string, data: object) => api.put(`/shipments/${id}`, data),
  delete: (id: string) => api.delete(`/shipments/${id}`),
  bulkImport: (shipments: object[]) => api.post('/shipments/bulk', { shipments }),
  getStats: () => api.get('/shipments/stats'),
};

// Documents API
export const documentsApi = {
  getByShipment: (shipmentId: string) => api.get(`/documents/${shipmentId}`),
  upload: (shipmentId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/documents/${shipmentId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id: string) => api.delete(`/documents/${id}`),
  getDownloadUrl: (id: string) => `${API_URL}/documents/download/${id}`,
};

// Timeline API
export const timelineApi = {
  getByShipment: (shipmentId: string) => api.get(`/timeline/${shipmentId}`),
  add: (shipmentId: string, data: { eventType: string; description: string; oldStatus?: string; newStatus?: string }) =>
    api.post(`/timeline/${shipmentId}`, data),
};

// Users API (Admin)
export const usersApi = {
  getAll: () => api.get('/users'),
  updateRole: (id: string, role: string) => api.put(`/users/${id}/role`, { role }),
  toggleStatus: (id: string) => api.put(`/users/${id}/status`),
  delete: (id: string) => api.delete(`/users/${id}`),
};

export default api;
