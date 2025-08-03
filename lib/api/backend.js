import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service for connecting to Express backend
export const backendAPI = {
  // Health check
  health: () => api.get('/health'),
  
  // Registrations
  registrations: {
    getAll: () => api.get('/api/registrations'),
    getById: (id) => api.get(`/api/registrations/${id}`),
    create: (data) => api.post('/api/registrations', data),
    update: (id, data) => api.put(`/api/registrations/${id}`, data),
    delete: (id) => api.delete(`/api/registrations/${id}`),
  },
  
  // Abstracts
  abstracts: {
    getAll: (params = {}) => api.get('/api/abstracts', { params }),
    getById: (id) => api.get(`/api/abstracts/${id}`),
    create: (data) => api.post('/api/abstracts', data),
    update: (id, data) => api.put(`/api/abstracts/${id}`, data),
    updateStatus: (id, status) => api.patch(`/api/abstracts/${id}/status`, { status }),
    delete: (id) => api.delete(`/api/abstracts/${id}`),
    getByTrack: (track) => api.get(`/api/abstracts/track/${track}`),
    getStats: () => api.get('/api/abstracts/stats/overview'),
  },
  
  // Reviews
  reviews: {
    getAll: () => api.get('/api/reviews'),
    getById: (id) => api.get(`/api/reviews/${id}`),
    create: (data) => api.post('/api/reviews', data),
    update: (id, data) => api.put(`/api/reviews/${id}`, data),
    delete: (id) => api.delete(`/api/reviews/${id}`),
    getByAbstract: (abstractId) => api.get(`/api/reviews/abstract/${abstractId}`),
    getByReviewer: (email) => api.get(`/api/reviews/reviewer/${email}`),
    getStats: () => api.get('/api/reviews/stats/overview'),
  },
  
  // Sessions
  sessions: {
    getAll: () => api.get('/api/sessions'),
    getById: (id) => api.get(`/api/sessions/${id}`),
    create: (data) => api.post('/api/sessions', data),
    update: (id, data) => api.put(`/api/sessions/${id}`, data),
    delete: (id) => api.delete(`/api/sessions/${id}`),
  },
  
  // Activities
  activities: {
    getAll: () => api.get('/api/activities'),
    getById: (id) => api.get(`/api/activities/${id}`),
    create: (data) => api.post('/api/activities', data),
    update: (id, data) => api.put(`/api/activities/${id}`, data),
    delete: (id) => api.delete(`/api/activities/${id}`),
  },
  
  // Speakers
  speakers: {
    getAll: () => api.get('/api/speakers'),
    getById: (id) => api.get(`/api/speakers/${id}`),
    create: (data) => api.post('/api/speakers', data),
    update: (id, data) => api.put(`/api/speakers/${id}`, data),
    delete: (id) => api.delete(`/api/speakers/${id}`),
  },
  
  // Announcements
  announcements: {
    getAll: () => api.get('/api/announcements'),
    getById: (id) => api.get(`/api/announcements/${id}`),
    create: (data) => api.post('/api/announcements', data),
    update: (id, data) => api.put(`/api/announcements/${id}`, data),
    delete: (id) => api.delete(`/api/announcements/${id}`),
  },
};

export default backendAPI;
