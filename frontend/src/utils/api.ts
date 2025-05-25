/**
 * @file API Utility
 * @description Centralized Axios instance and API endpoint definitions for frontend-backend communication.
 * Handles base URL configuration, authentication token injection, and basic error interception.
 * All functions are designed to be type-safe and adhere to modern TypeScript practices.
 * @version 1.1.0 - Updated auth token key and STT endpoint paths. Added TTS API placeholder.
 */
import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

// Environment variables for API configuration.
// These should be set in your .env file and accessed via Vite's import.meta.env.
// Example: VITE_API_BASE_URL=http://localhost:3001
// @ts-ignore
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
// SHARED_PASSWORD is used as a fallback if no dynamic token is present.
// This is generally not recommended for production but can be useful for simplified auth in development.
// @ts-ignore
const SHARED_PASSWORD_FALLBACK: string = import.meta.env.VITE_SHARED_PASSWORD || 'password';

/**
 * Key used for storing the authentication token in localStorage/sessionStorage.
 * @constant {string}
 */
const AUTH_TOKEN_KEY: string = 'vcaAuthToken';

/**
 * Main Axios instance configured for the Voice Coding Assistant API.
 * It includes the base URL, a default timeout, and common headers.
 * Interceptors are attached for request and response handling.
 * @type {AxiosInstance}
 */
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000, // Increased timeout to 45 seconds for potentially long LLM responses
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Version': '1.2.0', // Example custom header for client version tracking
  },
});

console.log(`API Service Initialized. Base URL: ${API_BASE_URL}`);

/**
 * Retrieves the current authentication token from storage.
 * Prioritizes localStorage, then sessionStorage.
 * @returns {string | null} The authentication token or null if not found.
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Builds the Authorization header object.
 * Uses the stored token or falls back to the shared password mechanism if no token is found.
 * @returns {Record<string, string>} An object containing the Authorization header, or an empty object.
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  const effectiveToken = token || SHARED_PASSWORD_FALLBACK; // Fallback for simplified dev auth

  if (!effectiveToken) {
    console.warn("API: No authentication token or fallback password available.");
    return {};
  }
  return { 'Authorization': `Bearer ${effectiveToken}` };
};

// --- Axios Interceptors ---

/**
 * Request Interceptor:
 * Automatically injects the Authorization header into outgoing requests
 * if it's not already present. This ensures all API calls are authenticated.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (!config.headers.Authorization) {
      const authHeaders = getAuthHeaders();
      if (authHeaders.Authorization) {
        config.headers.Authorization = authHeaders.Authorization;
      }
    }
    // Log outgoing requests in development for debugging
    // @ts-ignore
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data || config.params || '');
    }
    return config;
  },
  (error: any): Promise<any> => {
    console.error('API Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor:
 * Handles global API response scenarios, particularly authentication errors (401).
 * If a 401 Unauthorized error is received, it clears any stored invalid tokens
 * and redirects the user to the login page.
 */
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Log successful responses in development
    // @ts-ignore
    if (import.meta.env.DEV) {
      // console.log(`API Response: ${response.status} from ${response.config.url}`, response.data);
    }
    return response;
  },
  (error: any): Promise<any> => {
    console.error(
      `API Response Error: Status ${error.response?.status} from ${error.config?.url}`,
      error.response?.data || error.message
    );

    if (error.response?.status === 401) {
      // Clear potentially invalid tokens
      localStorage.removeItem(AUTH_TOKEN_KEY);
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
      delete api.defaults.headers.common['Authorization']; // Clear from current Axios instance

      // Redirect to login if not already on the login page
      if (window.location.pathname !== '/login') {
        console.log('API: Unauthorized (401). Redirecting to login.');
        // Consider using Vue Router for navigation if this utility is used within a Vue app context
        // For simplicity here, using window.location
        window.location.href = '/login?sessionExpired=true';
      }
    }
    return Promise.reject(error);
  }
);

// --- API Endpoint Definitions ---

/**
 * @namespace authAPI
 * @description Endpoints related to user authentication.
 */
export const authAPI = {
  /**
   * Authenticates a user with the provided password and "remember me" preference.
   * @param {object} credentials - User credentials.
   * @param {string} credentials.password - The user's password.
   * @param {boolean} [credentials.rememberMe=false] - If true, token is stored in localStorage, otherwise sessionStorage.
   * @returns {Promise<AxiosResponse<any>>} Promise resolving to the authentication response.
   * Expected response: `{ token: string, user: object, message: string }`
   */
  login: (credentials: { password: string; rememberMe?: boolean }): Promise<AxiosResponse<{token: string, user: any, message: string}>> =>
    api.post('/api/auth', credentials),

  /**
   * Checks the current authentication status of the user.
   * Relies on the Authorization header being set by interceptors.
   * @returns {Promise<AxiosResponse<any>>} Promise resolving to the authentication status.
   * Expected response: `{ authenticated: boolean, user?: object, message: string }`
   */
  checkStatus: (): Promise<AxiosResponse<{authenticated: boolean, user?: any}>> => api.get('/api/auth'),

   /**
   * Logs the user out. Clears authentication cookies/tokens on the backend.
   * @returns {Promise<AxiosResponse<any>>} Promise resolving to the logout confirmation.
   */
  logout: (): Promise<AxiosResponse<{message: string}>> => api.delete('/api/auth'),
};

/**
 * @typedef ChatMessagePayload
 * @property {Array<{role: string, content: string}>} messages - The array of messages for the chat.
 * @property {string} mode - The operational mode (e.g., "coding", "system_design").
 * @property {string} language - Preferred programming language.
 * @property {boolean} [generateDiagram] - Hint for diagram generation.
 * @property {string} [userId] - User identifier.
 * @property {string} [conversationId] - Conversation identifier.
 * @property {number} [maxHistoryMessages] - Number of message pairs for history.
 * @property {boolean} [interviewMode] - Flag for interview mode.
 */
export interface ChatMessagePayload {
  messages: Array<{role: string, content: string}>;
  mode: string;
  language: string;
  generateDiagram?: boolean;
  userId?: string;
  conversationId?: string;
  maxHistoryMessages?: number;
  interviewMode?: boolean;
}

/**
 * @typedef ChatResponseData
 * @property {string} content - The AI's response content.
 * @property {string} model - The model used for the response.
 * @property {object} [usage] - Token usage statistics.
 * @property {object} sessionCost - Current session cost details.
 * @property {number} costOfThisCall - Cost of this specific API call.
 * @property {string} conversationId - ID of the conversation.
 */
export interface ChatResponseData {
  content: string;
  model: string;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  sessionCost: any; // Define further if structure is known
  costOfThisCall: number;
  conversationId: string;
}


/**
 * @namespace chatAPI
 * @description Endpoints for AI chat interactions.
 */
export const chatAPI = {
  /**
   * Sends a message payload to the AI chat system.
   * @param {ChatMessagePayload} data - The chat message data.
   * @returns {Promise<AxiosResponse<ChatResponseData>>} Promise resolving to the AI's response.
   */
  sendMessage: (data: ChatMessagePayload): Promise<AxiosResponse<ChatResponseData>> =>
    api.post('/api/chat', data),
};

/**
 * @typedef TranscriptionResponse
 * @property {string} transcription - The transcribed text.
 * @property {number} [durationSeconds] - Duration of the audio.
 * @property {number} cost - Cost of the transcription.
 * @property {number} sessionCost - Current total session cost.
 */
export interface TranscriptionResponse {
    transcription: string;
    durationSeconds?: number;
    cost: number;
    sessionCost: number;
    // ... other potential fields like analysis, metadata
}

/**
 * @namespace speechAPI
 * @description Endpoints for Speech-to-Text (STT) services.
 */
export const speechAPI = {
  /**
   * Transcribes audio data using the configured STT service on the backend (e.g., Whisper).
   * @param {FormData} audioData - FormData object containing the audio file (e.g., under the key 'audio').
   * @returns {Promise<AxiosResponse<TranscriptionResponse>>} Promise resolving to the transcription result.
   */
  transcribe: (audioData: FormData): Promise<AxiosResponse<TranscriptionResponse>> =>
    api.post('/api/stt', audioData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000, // Longer timeout for potentially large audio files
    }),

  /**
   * Retrieves statistics related to STT processing from the backend.
   * This might include pricing, supported formats, etc.
   * @returns {Promise<AxiosResponse<any>>} Promise resolving to speech statistics.
   */
  getStats: (): Promise<AxiosResponse<any>> => api.get('/api/stt/stats'),
};

/**
 * @typedef TTSRequestPayload
 * @property {string} text - Text to synthesize.
 * @property {string} [voice] - Preferred voice ID.
 * @property {string} [model] - TTS model (e.g., "tts-1", "tts-1-hd").
 * @property {string} [outputFormat] - Desired audio output format (e.g., "mp3", "opus").
 */
export interface TTSRequestPayload {
    text: string;
    voice?: string;
    model?: string;
    outputFormat?: 'mp3' | 'opus' | 'aac' | 'flac' | string;
    // Add other ITtsOptions as needed, e.g. speakingRate
}

/**
 * @namespace ttsAPI
 * @description Endpoints for Text-to-Speech (TTS) services (backend-driven).
 */
export const ttsAPI = {
  /**
   * Synthesizes speech from text using a backend TTS service.
   * The response is expected to be an audio blob.
   * @param {TTSRequestPayload} data - The TTS request payload.
   * @returns {Promise<AxiosResponse<Blob>>} Promise resolving to an audio Blob.
   */
  synthesize: (data: TTSRequestPayload): Promise<AxiosResponse<Blob>> =>
    api.post('/api/tts', data, {
        responseType: 'blob', // Expecting binary audio data
    }),

  /**
   * Lists available TTS voices from the backend service.
   * @returns {Promise<AxiosResponse<Array<{id: string, name: string, lang?: string}>>>} Promise resolving to a list of voices.
   */
  getAvailableVoices: (): Promise<AxiosResponse<Array<{id: string, name: string, lang?: string}>>> =>
    api.get('/api/tts/voices'),
};


/**
 * @namespace costAPI
 * @description Endpoints for managing and tracking API usage costs.
 */
export const costAPI = {
  /**
   * Retrieves the current session's cost information from the backend.
   * @returns {Promise<AxiosResponse<any>>} Promise resolving to cost data.
   * Expected: `{ sessionCost: number, costsByService: object, ... }`
   */
  getCost: (): Promise<AxiosResponse<any>> => api.get('/api/cost'),

  /**
   * Resets the session cost counter on the backend.
   * @param {object} [data] - Optional parameters for the reset action (e.g., `{ action: 'reset', userId: '...' }`).
   * @returns {Promise<AxiosResponse<any>>} Promise resolving to the reset confirmation.
   */
  resetCost: (data?: { action?: string; userId?: string }): Promise<AxiosResponse<any>> =>
    api.post('/api/cost', data),
};

/**
 * @namespace diagramAPI
 * @description Endpoints for generating diagrams.
 */
export const diagramAPI = {
  /**
   * Sends a description to the backend to generate diagram code (e.g., Mermaid).
   * @param {object} data - Diagram generation parameters.
   * @param {string} data.description - Textual description of the diagram.
   * @param {string} [data.type="mermaid"] - Type of diagram to generate.
   * @param {string} [data.userId] - User identifier.
   * @returns {Promise<AxiosResponse<any>>} Promise resolving to diagram data.
   * Expected: `{ diagramCode: string, type: string, model: string, ... }`
   */
  generate: (data: { description: string; type?: string; userId?: string }): Promise<AxiosResponse<any>> =>
    api.post('/api/diagram', data),
};

export default api;