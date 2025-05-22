// frontend/src/utils/api.ts
import axios from 'axios';

// Get environment variables (Vite exposes them via import.meta.env)
// @ts-ignore
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
// @ts-ignore
const SHARED_PASSWORD = import.meta.env.VITE_SHARED_PASSWORD || 'password';

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth helper functions
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token') || SHARED_PASSWORD;
  
  if (!token) {
    console.warn("No authentication token available");
    return {};
  }
  
  return { 
    'Authorization': `Bearer ${token}` 
  };
};

// Set default auth header if token exists
const token = localStorage.getItem('token') || sessionStorage.getItem('token') || SHARED_PASSWORD;
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Request interceptor to add auth headers
api.interceptors.request.use(
  (config) => {
    // Add auth header if not already present
    if (!config.headers.Authorization) {
      const authHeaders = getAuthHeaders();
      if (authHeaders.Authorization) {
        config.headers.Authorization = authHeaders.Authorization;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid tokens
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      
      // Redirect to login if we're not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API endpoint functions
export const chatAPI = {
  sendMessage: (data: any) => api.post('/api/chat', data),
};

export const speechAPI = {
  transcribe: (audioData: FormData) => api.post('/api/speech', audioData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getStats: () => api.get('/api/speech'),
};

export const costAPI = {
  getCost: () => api.get('/api/cost'),
  resetCost: (data?: any) => api.post('/api/cost', data),
};

export const authAPI = {
  login: (credentials: { password: string; rememberMe?: boolean }) => 
    api.post('/api/auth', credentials),
};

export default api;