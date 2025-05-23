import axios from 'axios';

// Use relative path so proxy works: all requests go to /api/v1/*
const API_URL = '/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
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

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password, role) => 
    api.post('/auth/register', { name, email, password, role }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => 
    api.post('/auth/reset-password', { token, password }),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  setupMFA: () => api.post('/auth/mfa/setup'),
  verifyMFA: (code) => api.post('/auth/mfa/verify', { code }),
  verifyMFALogin: (code) => api.post('/auth/mfa/verify-login', { code }),
  disableMFA: () => api.post('/auth/mfa/disable')
};

// Events API
export const eventsAPI = {
  getAllEvents: () => api.get('/events'),
  getEvent: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => api.post('/events', eventData),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  getMyEvents: () => api.get('/events/my-events'),
  getEventAnalytics: (id) => api.get(`/events/${id}/analytics`)
};

// Bookings API
export const bookingsAPI = {
  createBooking: (eventId, ticketData) => 
    api.post('/bookings', { eventId, ...ticketData }),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getBooking: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.post(`/bookings/${id}/cancel`)
};

// User API
export const userAPI = {
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (currentPassword, newPassword) => 
    api.put('/users/change-password', { currentPassword, newPassword })
};

// Admin API
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  getAllEvents: () => api.get('/events/admin/events'),
  updateEventStatus: (id, status) => 
    api.put(`/events/admin/events/${id}/status`, status),
  updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`)
};

export default api;