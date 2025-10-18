// File: frontend/src/utils/api.ts
/**
 * @file API Utility
 * @description Centralized Axios instance and API endpoint definitions for frontend-backend communication.
 * Handles base URL configuration, authentication token injection, and basic error interception.
 * All functions are designed to be type-safe and adhere to modern TypeScript practices.
 * @version 1.4.1 - Corrected sendMessageStream callback references and ensured full file content.
 */
import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import type { PlanId } from '../../../shared/planCatalog';

// Environment variables for API configuration.
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Key used for storing the authentication token in localStorage or sessionStorage.
 * @constant {string}
 */
export const AUTH_TOKEN_KEY: string = 'vcaAuthToken';

/**
 * Main Axios instance for API communication.
 * Configured with a base URL, timeout, and default headers.
 * @type {AxiosInstance}
 */
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000, // 90 seconds timeout for potentially long operations
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Version': '1.4.1', // Updated client version
  },
});

console.log(`[API Service] Initialized. Base URL: ${api.defaults.baseURL}`);

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (!config.headers.Authorization) {
      const authHeaders = getAuthHeaders();
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
    const responseData = error.response?.data; // Renamed to avoid conflict in other scopes
    console.error(`[API Service] Response Error: Status ${status} from ${url}`, responseData || error.message);

    if (status === 401 && typeof window !== 'undefined') {
      const currentToken = getAuthToken();
      if (currentToken) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
        if (api.defaults.headers.common['Authorization']) {
            delete api.defaults.headers.common['Authorization'];
        }
        console.warn('[API Service] Unauthorized (401) with existing token. Cleared token. Redirecting to login.');
        if (window.location.pathname !== '/login' && !window.location.pathname.startsWith('/welcome')) {
          window.location.href = `/login?sessionExpired=true&reason=unauthorized&redirectTo=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        }
      } else {
        console.warn('[API Service] Unauthorized (401) but no token was present.');
      }
    }
    return Promise.reject(error);
  }
);

// --- Shared Type Definitions for API Payloads & Responses ---

export interface ILlmUsageFE {
  prompt_tokens: number | null;
  completion_tokens: number | null;
  total_tokens: number | null;
}

export interface ILlmToolCallFunctionFE {
  name: string;
  arguments: string; // JSON string
}

export interface ILlmToolCallFE {
  id: string;
  type: 'function';
  function: ILlmToolCallFunctionFE;
}

export interface LlmToolFE {
  type: 'function';
  function: {
    name: string;
    description?: string;
    parameters: object; // JSON Schema object
  };
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
  loginGlobal: (payload: { password: string; rememberMe?: boolean }): Promise<AxiosResponse<AuthResponseFE>> =>
    api.post('/auth/global', payload),
  loginStandard: (payload: { email: string; password: string; rememberMe?: boolean }): Promise<AxiosResponse<AuthResponseFE>> =>
    api.post('/auth/login', payload),
  register: (payload: { email: string; password: string }): Promise<AxiosResponse<AuthResponseFE>> =>
    api.post('/auth/register', payload),
  checkStatus: (): Promise<AxiosResponse<AuthResponseFE>> => api.get('/auth'),
  logout: (): Promise<AxiosResponse<LogoutResponseFE>> => api.delete('/auth'),
};

export interface BillingCheckoutResponseFE {
  checkoutUrl: string;
  checkoutSessionId: string;
}

export interface BillingCheckoutRequest {
  planId: PlanId;
  successUrl?: string;
  cancelUrl?: string;
  clientSessionId?: string;
}

export interface BillingCheckoutStatusResponseFE {
  status: 'created' | 'pending' | 'paid' | 'complete' | 'failed' | 'expired';
  planId: string;
  token?: string;
  user?: Record<string, any>;
}

export const billingAPI = {
  createCheckoutSession: (
    payload: BillingCheckoutRequest,
    options?: { token?: string },
  ): Promise<AxiosResponse<BillingCheckoutResponseFE>> => {
    const config: AxiosRequestConfig | undefined = options?.token
      ? { headers: { Authorization: `Bearer ${options.token}` } }
      : undefined;
    return api.post('/billing/checkout', payload, config);
  },
  getCheckoutStatus: (
    checkoutId: string,
    options?: { token?: string },
  ): Promise<AxiosResponse<BillingCheckoutStatusResponseFE>> => {
    const config: AxiosRequestConfig | undefined = options?.token
      ? { headers: { Authorization: `Bearer ${options.token}` } }
      : undefined;
    return api.get(`/billing/status/${checkoutId}`, config);
  },
};

export const rateLimitAPI = {
  getStatus: (): Promise<AxiosResponse<{ tier: string; used: number; remaining: number; limit: number; resetAt: string | Date | null }>> =>
    api.get('/rate-limit/status'),
};

export interface ChatMessageFE {
  role: 'user' | 'assistant' | 'system' | 'tool' | 'error';
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
  agentId?: string;
  systemPromptOverride?: string;
  tutorMode?: boolean;
  tutorLevel?: string;
  interviewMode?: boolean;
  stream?: boolean;
  personaOverride?: string | null;
  tool_response?: {
    tool_call_id: string;
    tool_name: string;
    output: string;
  };
  tools?: LlmToolFE[];
  tool_choice?: "none" | "auto" | { type: "function"; function: { name: string; } };
}

export interface PersonaUpdatePayloadFE {
  agentId: string;
  conversationId: string;
  persona: string | null;
  userId?: string;
}

export interface SessionCostDetailsFE {
  userId: string;
  sessionCost: number;
  costsByService: Record<string, {
    totalCost: number;
    count: number;
    details?: Array<{ model?: string; cost: number; timestamp: string}>
  }>;
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
  persona?: string | null;
}

export interface TextResponseDataFE extends BaseChatResponseDataFE {
  type?: 'text_response' | undefined;
  content: string | null;
  discernment?: 'RESPOND' | 'ACTION_ONLY' | 'IGNORE' | 'CLARIFY';
  message?: string;
  tool_calls?: ILlmToolCallFE[];
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

  updatePersona: (payload: PersonaUpdatePayloadFE): Promise<AxiosResponse<{ persona: string | null; agentId: string; conversationId: string }>> =>
    api.post('/chat/persona', payload),

  sendMessageStream: async (
    payloadData: ChatMessagePayloadFE, // Renamed 'data' to 'payloadData' to avoid conflict
    onChunkReceived: (chunk: string) => void,
    onStreamEnd: () => void,
    onStreamError: (error: Error) => void
  ): Promise<ChatResponseDataFE | undefined> => {
    const payload = { ...payloadData, stream: true };
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
          'X-Client-Version': '1.4.1', // Match current file version
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: `Request failed with status ${response.status}`, error: response.statusText }));
        throw new Error(`API Error: ${response.status} ${errorBody.message || errorBody.error || response.statusText}`);
      }
      if (!response.body) {
        throw new Error("Stream body is null, which is unexpected for a successful stream response.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finalResponseData: ChatResponseDataFE | undefined;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (buffer.trim()) {
            try {
              const finalDataObject = JSON.parse(buffer);
              finalResponseData = finalDataObject;
              if (finalDataObject && typeof finalDataObject === 'object' && finalDataObject.content) {
                onChunkReceived(finalDataObject.content); // CORRECTED: Use parameter name
              } else if (finalDataObject && typeof finalDataObject === 'object' && !finalDataObject.content) {
                console.info("[API Service] Stream ended with metadata (from buffer):", finalDataObject);
              } else {
                onChunkReceived(buffer); // CORRECTED: Use parameter name
              }
            } catch(e) { onChunkReceived(buffer); } // CORRECTED: Use parameter name
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
                onChunkReceived(parsedChunk.content); // CORRECTED: Use parameter name
              } else if (parsedChunk.type === 'tool_call_delta') {
                console.log("[API Service] Stream: Tool call delta received:", parsedChunk);
                // Future: Logic to accumulate tool_call_delta if required
              } else if (parsedChunk.type === 'final_response_metadata') {
                console.info("[API Service] Stream: Final response metadata:", parsedChunk);
              } else if (parsedChunk.content && typeof parsedChunk.content === 'string') {
                onChunkReceived(parsedChunk.content); // CORRECTED: Use parameter name
              } else {
                console.warn("[API Service] Stream: Received unknown JSON structure:", parsedChunk);
              }
            } catch (e) {
              console.warn('[API Service] Stream: Failed to parse JSON data event:', jsonData, e);
              if(jsonData && !line.startsWith("event:") && !line.startsWith("id:") && !line.startsWith(":")) {
                onChunkReceived(jsonData); // CORRECTED: Use parameter name
              }
            }
          } else if (line && !line.startsWith("event:") && !line.startsWith("id:") && !line.startsWith(":")) {
            console.warn("[API Service] Stream: Received non-SSE formatted line:", line);
            onChunkReceived(line); // CORRECTED: Use parameter name
          }
        }
      }
      if (onStreamEnd) onStreamEnd(); // CORRECTED: Use parameter name
      return finalResponseData;
    } catch (error: any) {
      console.error('[API Service] sendMessageStream encountered an error:', error);
      if (onStreamError) onStreamError(error); // CORRECTED: Use parameter name
      else throw error;
      return undefined;
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
  costsByService: SessionCostDetailsFE['costsByService'];
}

export const speechAPI = {
  transcribe: (audioData: FormData): Promise<AxiosResponse<TranscriptionResponseFE>> =>
    api.post('/stt', audioData, {
      headers: { 'Content-Type': 'multipart/form-data', ...getAuthHeaders() },
      timeout: 90000,
    }),
  getStats: (): Promise<AxiosResponse<SttStatsResponseFE>> => api.get('/stt/stats'),
};

export type TTSRequestPayloadFE = {
  text: string;
  voice?: string;
  model?: string;
  outputFormat?: 'mp3' | 'opus' | 'aac' | 'flac' | string;
  speed?: number;
  languageCode?: string;
  providerId?: string;
}

export interface TTSVoiceFE {
  id: string;
  name: string;
  lang?: string;
  gender?: string;
  provider?: string;
  isDefault?: boolean;
  description?: string;
}

export interface TTSAvailableVoicesResponseFE {
  voices: TTSVoiceFE[];
  count: number;
  message: string;
}

export const ttsAPI = {
  synthesize: (data: TTSRequestPayloadFE): Promise<AxiosResponse<Blob>> =>
    api.post('/tts', data, { responseType: 'blob', headers: { ...getAuthHeaders() } }),
  getAvailableVoices: (): Promise<AxiosResponse<TTSAvailableVoicesResponseFE>> =>
    api.get('/tts/voices', { headers: getAuthHeaders() }),
};

export interface ResetCostPayloadFE {
  action?: 'reset' | 'reset_global';
  userId?: string;
}

export interface ResetCostResponseFE {
  message: string;
  sessionCost: number;
  sessionStartTime: string;
  costsByService: Record<string, { totalCost: number; count: number }>;
  globalMonthlyCost?: number;
}

export const costAPI = {
  getSessionCost: (): Promise<AxiosResponse<SessionCostDetailsFE>> => api.get('/cost/session'),
  resetSessionCost: (data: ResetCostPayloadFE = { action: 'reset' }): Promise<AxiosResponse<ResetCostResponseFE>> =>
    api.post('/cost', data),
};

export interface DiagramRequestPayloadFE {
  description: string;
  type?: string;
  userId?: string;
}

export interface DiagramResponseFE {
  diagramCode: string;
  type: string;
  model: string;
  usage?: ILlmUsageFE;
  sessionCost: SessionCostDetailsFE;
  cost: number;
}

export const diagramAPI = {
  generate: (data: DiagramRequestPayloadFE): Promise<AxiosResponse<DiagramResponseFE>> =>
    api.post('/diagram', data),
};

export interface PromptResponseFE {
  content: string;
  message: string;
  filename: string;
}

export const promptAPI = {
  getPrompt: (filename: string): Promise<AxiosResponse<PromptResponseFE>> =>
    api.get(`/prompts/${filename}`),
};

export interface OrganizationMemberFE {
  id: string;
  userId: string;
  email: string | null;
  role: 'admin' | 'builder' | 'viewer';
  status: 'active' | 'invited' | 'suspended';
  seatUnits: number;
  dailyUsageCapUsd: number | null;
  createdAt: number;
  updatedAt: number;
  isSelf: boolean;
}

export interface OrganizationInviteFE {
  id: string;
  email: string;
  role: 'admin' | 'builder' | 'viewer';
  status: 'pending' | 'accepted' | 'revoked' | 'expired';
  createdAt: number;
  expiresAt: number | null;
  inviterUserId: string | null;
  acceptedAt: number | null;
  revokedAt: number | null;
  token?: string;
}

export interface OrganizationSummaryFE {
  id: string;
  name: string;
  slug: string | null;
  planId: string;
  ownerUserId: string;
  seatLimit: number;
  createdAt: number;
  updatedAt: number;
  stats: {
    activeSeats: number;
    pendingInvites: number;
    availableSeats: number;
  };
  membership: OrganizationMemberFE | null;
  permissions: {
    canInvite: boolean;
    canManageSeats: boolean;
    canModifyMembers: boolean;
    canLeave: boolean;
  };
  members: OrganizationMemberFE[];
  invites: OrganizationInviteFE[];
}

export const organizationAPI = {
  list: (): Promise<AxiosResponse<{ organizations: OrganizationSummaryFE[] }>> => api.get('/organizations'),
  create: (data: { name: string; seatLimit?: number; planId?: string; slug?: string | null }): Promise<AxiosResponse<{ organization: OrganizationSummaryFE }>> =>
    api.post('/organizations', data),
  update: (
    organizationId: string,
    data: { name?: string; seatLimit?: number },
  ): Promise<AxiosResponse<{ organization: OrganizationSummaryFE }>> =>
    api.patch(`/organizations/${organizationId}`, data),
  createInvite: (
    organizationId: string,
    data: { email: string; role?: 'admin' | 'builder' | 'viewer'; expiresAt?: number | null },
  ): Promise<AxiosResponse<{ organization: OrganizationSummaryFE; invite: OrganizationInviteFE }>> =>
    api.post(`/organizations/${organizationId}/invites`, data),
  revokeInvite: (
    organizationId: string,
    inviteId: string,
  ): Promise<AxiosResponse<{ organization: OrganizationSummaryFE }>> =>
    api.delete(`/organizations/${organizationId}/invites/${inviteId}`),
  updateMember: (
    organizationId: string,
    memberId: string,
    data: { role?: 'admin' | 'builder' | 'viewer'; dailyUsageCapUsd?: number | null; seatUnits?: number },
  ): Promise<AxiosResponse<{ organization: OrganizationSummaryFE }>> =>
    api.patch(`/organizations/${organizationId}/members/${memberId}`, data),
  removeMember: (
    organizationId: string,
    memberId: string,
  ): Promise<AxiosResponse<{ organization: OrganizationSummaryFE | null }>> =>
    api.delete(`/organizations/${organizationId}/members/${memberId}`),
  acceptInvite: (
    token: string,
  ): Promise<AxiosResponse<{ organization: OrganizationSummaryFE; invite: OrganizationInviteFE }>> =>
    api.post(`/organizations/invites/${token}/accept`, {}),
};

export interface ProviderStatusSummaryFE {
  available: boolean;
  reason?: string;
  hint?: string;
  envVar?: string;
}

export interface LlmStatusResponseFE {
  status: 'ready' | 'unavailable';
  ready: boolean;
  code?: string;
  message?: string;
  timestamp: string;
  providers: Record<string, ProviderStatusSummaryFE>;
}

export const systemAPI = {
  getLlmStatus: (): Promise<AxiosResponse<LlmStatusResponseFE>> => api.get('/system/llm-status'),
};

export default api;


