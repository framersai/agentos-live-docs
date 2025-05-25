// File: frontend/src/utils/api.ts
import axios from 'axios';

/**
 * API utility module for the Voice Coding Assistant frontend.
 * Provides centralized HTTP client configuration and API endpoint abstractions.
 * 
 * This module handles:
 * - Axios instance configuration with proper base URL and interceptors
 * - Authentication token management and header injection
 * - Request/response interceptors for error handling and logging
 * - Typed API endpoint functions for type safety
 * 
 * @fileoverview Core API communication layer for frontend-backend interaction
 * @version 1.0.0
 */

// **FIXED PORTS:** Updated to use correct port configuration
// Frontend: 3000, Backend: 3001
// @ts-ignore - Vite environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
// @ts-ignore - Vite environment variables  
const SHARED_PASSWORD = import.meta.env.VITE_SHARED_PASSWORD || 'password';
 
/**
 * Main Axios instance configured for the Voice Coding Assistant API.
 * Includes base URL, timeout, and default headers.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Temporary debug log - remove in production
console.log("API_BASE_URL:", API_BASE_URL);

/**
 * Retrieves authentication headers for API requests.
 * Checks localStorage, sessionStorage, and falls back to shared password.
 * 
 * @returns {object} Object containing Authorization header or empty object
 */
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

// Set default auth header if token exists on initialization
const token = localStorage.getItem('token') || sessionStorage.getItem('token') || SHARED_PASSWORD;
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

/**
 * Request interceptor to ensure all requests include authentication headers.
 * Automatically adds Authorization header if not present.
 */
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
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for handling authentication errors and token cleanup.
 * Automatically redirects to login on 401 errors and clears invalid tokens.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Response Error:', error.response?.status, error.message);
    
    if (error.response?.status === 401) {
      // Clear invalid tokens
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      
      // Redirect to login if we're not already there
      if (!window.location.pathname.includes('/login')) {
        console.log('Redirecting to login due to 401 error');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication API endpoints.
 * Handles user login and authentication status checks.
 */
export const authAPI = {
  /**
   * Authenticate user with password and optional remember me option.
   * 
   * @param credentials - Object containing password and rememberMe flag
   * @returns Promise resolving to authentication response
   */
  login: (credentials: { password: string; rememberMe?: boolean }) => 
    api.post('/api/auth', credentials),
    
  /**
   * Check current authentication status.
   * 
   * @returns Promise resolving to authentication status
   */
  checkStatus: () => api.get('/api/auth'),
};

/**
 * Chat API endpoints.
 * Handles AI chat interactions and message sending.
 */
export const chatAPI = {
  /**
   * Send a message to the AI chat system.
   * 
   * @param data - Chat message data including content, mode, etc.
   * @returns Promise resolving to AI response
   */
  sendMessage: (data: any) => api.post('/api/chat', data),
};

/**
 * Speech API endpoints.
 * Handles audio transcription and speech statistics.
 */
export const speechAPI = {
  /**
   * Transcribe audio data using Whisper API.
   * 
   * @param audioData - FormData containing audio file
   * @returns Promise resolving to transcription result
   */
  transcribe: (audioData: FormData) => api.post('/api/speech', audioData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  /**
   * Get speech processing statistics.
   * 
   * @returns Promise resolving to speech stats
   */
  getStats: () => api.get('/api/speech'),
};

/**
 * Cost tracking API endpoints.
 * Handles session cost monitoring and management.
 */
export const costAPI = {
  /**
   * Get current session cost information.
   * 
   * @returns Promise resolving to cost data
   */
  getCost: () => api.get('/api/cost'),
  
  /**
   * Reset session cost counter.
   * 
   * @param data - Optional reset parameters
   * @returns Promise resolving to reset confirmation
   */
  resetCost: (data?: any) => api.post('/api/cost', data),
};

/**
 * Diagram API endpoints.
 * Handles diagram generation and rendering.
 */
export const diagramAPI = {
  /**
   * Generate diagram from description or data.
   * 
   * @param data - Diagram generation parameters
   * @returns Promise resolving to diagram data
   */
  generate: (data: any) => api.post('/api/diagram', data),
};

export default api;