// File: frontend/src/utils/api.ts
/**
 * @file API Utility
 * @description Centralized Axios instance and API endpoint definitions for frontend-backend communication.
 * Handles base URL configuration, authentication token injection, and basic error interception.
 * All functions are designed to be type-safe and adhere to modern TypeScript practices.
 * @version 1.3.5 - Refined auth header logic to only send valid JWTs.
 */
import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

// Environment variables for API configuration.
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
// const SHARED_PASSWORD_FALLBACK: string = import.meta.env.VITE_SHARED_PASSWORD || 'password'; // Fallback for dev mode token removed for clarity

/**
 * Key used for storing the authentication token.
 * @constant {string}
 */
export const AUTH_TOKEN_KEY: string = 'vcaAuthToken';

/**
 * Main Axios instance for API communication.
 * @type {AxiosInstance}
 */
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000, // Increased timeout for potentially long operations
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Version': '1.3.5', 
  },
});

console.log(`[API Service] Initialized. Base URL: ${api.defaults.baseURL}`);

/**
 * @function getAuthToken
 * @description Retrieves the authentication token from localStorage or sessionStorage.
 * @returns {string | null} The token, or null if not found.
 */
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * @function getAuthHeaders
 * @description Constructs authentication headers. Only includes Authorization if a valid token exists.
 * @returns {Record<string, string>} Authentication headers.
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  if (token) { // Only add Authorization header if a token actually exists
    return { 'Authorization': `Bearer ${token}` };
  }
  return {}; // Return empty object if no token, allowing public requests
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Only add Authorization header if it's not already present AND a valid token exists.
    // This prevents overriding specific auth headers if set manually for a particular request.
    if (!config.headers.Authorization) {
      const authHeaders = getAuthHeaders(); // This now only returns a header if a valid token is found
      if (authHeaders.Authorization) {
        config.headers.Authorization = authHeaders.Authorization;
      }
    }
    return config;
  },
  (error: any): Promise<any> => {
    console.error('[API Service] Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: any): Promise<any> => {
    const status = error.response?.status;
    const url = error.config?.url;
    const data = error.response?.data;
    console.error(`[API Service] Response Error: Status ${status} from ${url}`, data || error.message);

    if (status === 401 && typeof window !== 'undefined') {
      const currentToken = getAuthToken(); // Check if a token was present
      if (currentToken) { // Only clear and redirect if there was a token that failed
        localStorage.removeItem(AUTH_TOKEN_KEY);
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
        delete api.defaults.headers.common['Authorization']; // Also clear from default instance headers if set
        console.warn('[API Service] Unauthorized (401) with existing token. Clearing token and redirecting to login.');
        // Avoid redirect loop if already on login or public page
        if (window.location.pathname !== '/login' && !window.location.pathname.startsWith('/welcome')) {
          window.location.href = `/login?sessionExpired=true&reason=unauthorized&redirectTo=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        }
      } else {
        console.warn('[API Service] Unauthorized (401) but no token was present. Frontend auth state might be inconsistent or this is a public route with server-side auth issues.');
      }
    }
    return Promise.reject(error);
  }
);

// --- Shared Type Definitions for API Payloads & Responses ---
// (ILlmUsageFE, ILlmToolCallFunctionFE, ILlmToolCallFE, AuthResponseFE, LogoutResponseFE - remain the same)
// (ChatMessageFE, ProcessedHistoryMessageFE, ChatMessagePayloadFE - remain the same)
// (SessionCostDetailsFE, BaseChatResponseDataFE, TextResponseDataFE, FunctionCallResponseDataFE, ChatResponseDataFE - remain the same)
// (TranscriptionResponseFE, SttStatsResponseFE - remain the same)
// (TTSRequestPayloadFE, TTSVoiceFE, TTSAvailableVoicesResponseFE - remain the same)
// (ResetCostPayloadFE, ResetCostResponseFE - remain the same)
// (DiagramRequestPayloadFE, DiagramResponseFE - remain the same)

export interface ILlmUsageFE {
  prompt_tokens: number | null;
  completion_tokens: number | null;
  total_tokens: number | null;
}

export interface ILlmToolCallFunctionFE {
  name: string;
  arguments: string;
}

export interface ILlmToolCallFE {
  id: string;
  type: 'function';
  function: ILlmToolCallFunctionFE;
}

export interface AuthResponseFE {
  token?: string;
  user: { id: string; [key: string]: any };
  message: string;
  authenticated?: boolean;
}

export interface LogoutResponseFE {
  message: string;
}

export const authAPI = {
  login: (credentials: { password: string; rememberMe?: boolean }): Promise<AxiosResponse<AuthResponseFE>> =>
    api.post('/auth', credentials),
  checkStatus: (): Promise<AxiosResponse<AuthResponseFE>> => api.get('/auth'),
  logout: (): Promise<AxiosResponse<LogoutResponseFE>> => api.delete('/auth'),
};

export interface ChatMessageFE {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string | null;
  timestamp?: number;
  agentId?: string;
  tool_call_id?: string;
  tool_calls?: ILlmToolCallFE[];
  name?: string;
}

export interface ProcessedHistoryMessageFE extends ChatMessageFE {
  id?: string;
  estimatedTokenCount?: number;
  processedTokens?: string[];
  relevanceScore?: number;
}
export interface ChatMessagePayloadFE {
  messages: ChatMessageFE[];
  processedHistory?: ProcessedHistoryMessageFE[];
  mode: string;
  language?: string;
  generateDiagram?: boolean;
  userId?: string;
  conversationId?: string;
  systemPromptOverride?: string;
  tutorMode?: boolean;
  tutorLevel?: string;
  interviewMode?: boolean;
  stream?: boolean;
  tool_response?: {
    tool_call_id: string;
    tool_name: string;
    output: string;
  };
}

export interface SessionCostDetailsFE {
  userId: string;
  sessionCost: number;
  costsByService: Record<string, { totalCost: number; count: number; details?: Array<{ model?: string; cost: number; timestamp: string}> }>;
  sessionStartTime: string;
  entryCount: number;
  globalMonthlyCost: number;
  threshold: number;
  isThresholdReached: boolean;
}

interface BaseChatResponseDataFE {
  model: string;
  usage?: ILlmUsageFE;
  sessionCost: SessionCostDetailsFE;
  costOfThisCall: number;
  conversationId: string;
}

export interface TextResponseDataFE extends BaseChatResponseDataFE {
  type?: 'text_response' | undefined;
  content: string | null;
  discernment?: 'RESPOND' | 'ACTION_ONLY' | 'IGNORE' | 'CLARIFY';
  message?: string;
}

export interface FunctionCallResponseDataFE extends BaseChatResponseDataFE {
  type: 'function_call_data';
  toolName: string;
  toolArguments: Record<string, any>;
  toolCallId: string;
  discernment?: 'TOOL_CALL_PENDING';
  assistantMessageText?: string | null;
}

export type ChatResponseDataFE = TextResponseDataFE | FunctionCallResponseDataFE;

export const chatAPI = {
  sendMessage: (data: ChatMessagePayloadFE): Promise<AxiosResponse<ChatResponseDataFE>> =>
    api.post('/chat', data),
  sendMessageStream: async (
    data: ChatMessagePayloadFE,
    onChunkReceived: (chunk: string) => void,
    onStreamEnd: () => void,
    onStreamError: (error: Error) => void
  ): Promise<void> => {
    const payload = { ...data, stream: true };
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
          'X-Client-Version': '1.3.5',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: response.statusText, error: response.statusText }));
        throw new Error(`API Error: ${response.status} ${errorBody.message || errorBody.error || response.statusText}`);
      }
      if (!response.body) throw new Error("Stream body is null.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (buffer.trim()) {
            try {
                const finalDataObject = JSON.parse(buffer);
                if (finalDataObject && typeof finalDataObject === 'object' && !finalDataObject.content) {
                    console.info("[API Service] Stream ended with metadata:", finalDataObject);
                } else if (finalDataObject && finalDataObject.content) {
                     onChunkReceived(finalDataObject.content);
                } else {
                    onChunkReceived(buffer);
                }
            } catch(e) {
                onChunkReceived(buffer);
            }
          }
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
          const line = buffer.substring(0, newlineIndex).trim();
          buffer = buffer.substring(newlineIndex + 1);
          if (line.startsWith('data: ')) {
            const jsonData = line.substring('data: '.length);
            try {
              const parsedChunk = JSON.parse(jsonData);
              if (parsedChunk.type === 'chunk' && typeof parsedChunk.content === 'string') {
                onChunkReceived(parsedChunk.content);
              } else if (parsedChunk.type === 'tool_call_delta') {
                console.log("Tool call delta:", parsedChunk); // Placeholder for actual delta handling
              } else if (parsedChunk.type === 'final_response_metadata') {
                console.info("[API Service] Stream received final metadata:", parsedChunk);
              }
            } catch (e) {
              console.warn('[API Service] Failed to parse JSON chunk from stream:', jsonData, e);
              if(jsonData && !line.startsWith("event:") && !line.startsWith("id:") && !line.startsWith(":")) {
                      // Attempt to pass raw data if not typical SSE control line
                 onChunkReceived(jsonData); 
                  }
            }
          } else if (line) {
            // Handle non-SSE formatted lines if necessary, or log them
            if (!line.startsWith("event:") && !line.startsWith("id:") && !line.startsWith(":")) {
                 onChunkReceived(line); // Pass as a raw chunk
            }
          }
        }
      }
      if (onStreamEnd) onStreamEnd();
    } catch (error: any) {
      console.error('[API Service] sendMessageStream error:', error);
      if (onStreamError) onStreamError(error);
      else throw error; // Re-throw if no custom error handler
    }
  },
};


export interface TranscriptionResponseFE {
  transcription: string;
  durationSeconds?: number;
  cost: number;
  sessionCost: SessionCostDetailsFE;
  message?: string;
  analysis?: any;
  metadata?: any;
}

export interface SttStatsResponseFE {
  sttProvider: string;
  defaultTtsProvider: string;
  availableTtsProviders: string[];
  whisperCostPerMinute: string;
  openAITTSCostInfo: string;
  openaiTtsDefaultModel: string;
  openaiTtsDefaultVoice: string;
  openaiTtsDefaultSpeed: number;
  currentSessionCost: number;
  sessionCostThreshold: number;
}


export const speechAPI = {
  transcribe: (audioData: FormData): Promise<AxiosResponse<TranscriptionResponseFE>> =>
    api.post('/stt', audioData, {
      headers: { 'Content-Type': 'multipart/form-data', ...getAuthHeaders() },
      timeout: 90000, // Increased timeout for potentially large audio files
    }),
  getStats: (): Promise<AxiosResponse<SttStatsResponseFE>> => api.get('/stt/stats'),
};

export interface TTSRequestPayloadFE {
  text: string;
  voice?: string; // For OpenAI, this is a voice name like 'alloy'; for browser, it's a voiceURI
  model?: string; // e.g., 'tts-1', 'tts-1-hd' for OpenAI
  outputFormat?: 'mp3' | 'opus' | 'aac' | 'flac' | string;
  speed?: number;
  // Pitch and volume are usually client-side for browser; OpenAI TTS doesn't support pitch.
  languageCode?: string; // Useful for some backend providers, less so for browser if voiceURI is specific
  providerId?: string; // Helps backend determine routing if not obvious from voice ID
}

export interface TTSVoiceFE {
  id: string; // For browser: voiceURI. For OpenAI: voice name (e.g., 'alloy')
  name: string;
  lang?: string;
  gender?: string;
  provider?: string; // 'browser' or 'openai' or other backend provider id
  isDefault?: boolean;
}

export interface TTSAvailableVoicesResponseFE {
    voices: TTSVoiceFE[];
    count: number;
    message: string;
}

export const ttsAPI = {
  synthesize: (data: TTSRequestPayloadFE): Promise<AxiosResponse<Blob>> =>
    api.post('/tts', data, { responseType: 'blob', ...getAuthHeaders() }), // Ensure auth for usage tracking if needed
  getAvailableVoices: (): Promise<AxiosResponse<TTSAvailableVoicesResponseFE>> =>
    api.get('/tts/voices', { headers: getAuthHeaders() }), // Auth if listing voices has cost or is protected
};


export interface ResetCostPayloadFE {
  action?: 'reset' | 'reset_global';
  userId?: string; // Optional: for admin resetting specific user
}

export interface ResetCostResponseFE {
  message: string;
  sessionCost: number;
  sessionStartTime: string;
  costsByService: Record<string, { totalCost: number; count: number }>;
  globalMonthlyCost?: number; // Only if global reset
}

export const costAPI = {
  getSessionCost: (): Promise<AxiosResponse<SessionCostDetailsFE>> => api.get('/cost'), // Auth applied by interceptor
  resetSessionCost: (data: ResetCostPayloadFE = { action: 'reset' }): Promise<AxiosResponse<ResetCostResponseFE>> =>
    api.post('/cost', data), // Auth applied by interceptor
};

export interface DiagramRequestPayloadFE {
  description: string;
  type?: string; // e.g., "mermaid-flowchart", "mermaid-sequence"
  userId?: string; // For backend tracking
}

export interface DiagramResponseFE {
  diagramCode: string;
  type: string;
  model: string;
  usage?: ILlmUsageFE;
  sessionCost: SessionCostDetailsFE;
  cost: number; // Cost of this specific diagram generation
}

export const diagramAPI = {
  generate: (data: DiagramRequestPayloadFE): Promise<AxiosResponse<DiagramResponseFE>> =>
    api.post('/diagram', data), // Auth applied by interceptor
};

export default api;