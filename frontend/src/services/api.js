import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateMe: (data) => api.put('/auth/me', data),
};

// Users API (Admin)
export const usersAPI = {
  getAll: (role) => api.get('/users', { params: { role } }),
  getById: (id) => api.get(`/users/${id}`),
  getPending: () => api.get('/users/pending'),
  approve: (id) => api.patch(`/users/${id}/approve`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getStats: () => api.get('/users/stats'),
};

// Alumni API
export const alumniAPI = {
  getAll: (filters) => api.get('/alumni', { params: filters }),
  getByUserId: (userId) => api.get(`/alumni/user/${userId}`),
  getMyProfile: () => api.get('/alumni/profile/me'),
  updateMyProfile: (data) => api.put('/alumni/profile/me', data),
  toggleMentor: () => api.patch('/alumni/mentor/toggle'),
  getMentors: () => api.get('/alumni/mentors'),
  search: (query) => api.get('/alumni/search', { params: { q: query } }),
};

// Mentorship API
export const mentorshipAPI = {
  create: (data) => api.post('/mentorship', data),
  getMyRequests: () => api.get('/mentorship/my-requests'),
  getReceived: () => api.get('/mentorship/received'),
  updateStatus: (id, status) => api.patch(`/mentorship/${id}/status`, { status }),
  delete: (id) => api.delete(`/mentorship/${id}`),
  getStats: () => api.get('/mentorship/stats'),
};

// Announcements API
export const announcementsAPI = {
  getAll: () => api.get('/announcements'),
  getRecent: (limit) => api.get('/announcements/recent', { params: { limit } }),
  getById: (id) => api.get(`/announcements/${id}`),
  create: (data) => api.post('/announcements', data),
  update: (id, data) => api.put(`/announcements/${id}`, data),
  delete: (id) => api.delete(`/announcements/${id}`),
};

// Jobs API
export const jobsAPI = {
  getAll: (filters) => api.get('/jobs', { params: filters }),
  getById: (id) => api.get(`/jobs/${id}`),
  getMyJobs: () => api.get('/jobs/my/jobs'),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  toggle: (id) => api.patch(`/jobs/${id}/toggle`),
  search: (query) => api.get('/jobs/search', { params: { q: query } }),
  getStats: () => api.get('/jobs/admin/stats'),
};

export default api;
