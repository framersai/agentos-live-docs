// File: frontend/src/utils/api.ts
/**
 * @file API Utility
 * @description Centralized Axios instance and API endpoint definitions for frontend-backend communication.
 * Handles base URL configuration, authentication token injection, and basic error interception.
 * All functions are designed to be type-safe and adhere to modern TypeScript practices.
 * @version 1.3.7 - Finalized JSDocs, type definitions, and export consistency.
 */
import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

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
    'X-Client-Version': '1.3.7', // Current client version
  },
});

console.log(`[API Service] Initialized. Base URL: ${api.defaults.baseURL}`);

/**
 * Retrieves the authentication token from localStorage or sessionStorage.
 * Prefers localStorage if the token exists in both.
 * @returns {string | null} The authentication token, or null if not found.
 */
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Constructs authentication headers if a token is available.
 * @returns {Record<string, string>} An object containing the Authorization header if a token exists, otherwise an empty object.
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
};

/**
 * Axios request interceptor.
 * Automatically adds the Authorization header to requests if a token is available
 * and the header is not already set. This prevents overriding auth headers
 * if they are manually set for a specific request.
 */
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

/**
 * Axios response interceptor.
 * Handles global error responses, particularly 401 Unauthorized errors by clearing
 * the authentication token and redirecting to the login page if a token was present.
 */
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: any): Promise<any> => {
    const status = error.response?.status;
    const url = error.config?.url;
    const data = error.response?.data;
    console.error(`[API Service] Response Error: Status ${status} from ${url}`, data || error.message);

    if (status === 401 && typeof window !== 'undefined') {
      const currentToken = getAuthToken();
      if (currentToken) { // Only act if a token was present and failed
        localStorage.removeItem(AUTH_TOKEN_KEY);
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
        if (api.defaults.headers.common['Authorization']) {
            delete api.defaults.headers.common['Authorization'];
        }
        console.warn('[API Service] Unauthorized (401) with existing token. Cleared token. Redirecting to login.');
        // Avoid redirect loop if already on login or related public pages
        if (window.location.pathname !== '/login' && !window.location.pathname.startsWith('/welcome')) {
          window.location.href = `/login?sessionExpired=true&reason=unauthorized&redirectTo=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        }
      } else {
        console.warn('[API Service] Unauthorized (401) but no token was present. This could be a public route with server-side auth issues or an inconsistent frontend state.');
      }
    }
    return Promise.reject(error);
  }
);

// --- Shared Type Definitions for API Payloads & Responses ---

/**
 * Represents LLM usage details including prompt, completion, and total tokens.
 */
export interface ILlmUsageFE {
  /** Number of tokens in the prompt. Null if not applicable. */
  prompt_tokens: number | null;
  /** Number of tokens in the completion. Null if not applicable. */
  completion_tokens: number | null;
  /** Total number of tokens used. Null if not applicable. */
  total_tokens: number | null;
}

/**
 * Describes the function to be called as part of an LLM tool call.
 */
export interface ILlmToolCallFunctionFE {
  /** The name of the function to be invoked. */
  name: string;
  /** A JSON string representing the arguments to pass to the function. */
  arguments: string;
}

/**
 * Represents a tool call requested by the LLM, typically a function call.
 */
export interface ILlmToolCallFE {
  /** A unique identifier for this specific tool call. */
  id: string;
  /** The type of the tool call, usually 'function'. */
  type: 'function';
  /** The function invocation details. */
  function: ILlmToolCallFunctionFE;
}

/**
 * Defines the structure of the response for authentication (login/status check) operations.
 */
export interface AuthResponseFE {
  /** The JWT authentication token, present on successful login. */
  token?: string;
  /** Information about the authenticated user. */
  user: { id: string; [key: string]: any }; // Allows for additional user properties
  /** A server-provided message (e.g., "Login successful"). */
  message: string;
  /** Boolean indicating if the user is successfully authenticated. */
  authenticated?: boolean;
}

/**
 * Defines the structure of the response for logout operations.
 */
export interface LogoutResponseFE {
  /** A server-provided message confirming logout. */
  message: string;
}

/**
 * Provides API methods related to user authentication.
 */
export const authAPI = {
  /**
   * Attempts to log in a user with the provided credentials.
   * @param {object} credentials - The user's login credentials.
   * @param {string} credentials.password - The user's password.
   * @param {boolean} [credentials.rememberMe] - If true, suggests the token should be stored persistently (e.g., localStorage vs sessionStorage).
   * @returns {Promise<AxiosResponse<AuthResponseFE>>} A promise resolving to the server's authentication response.
   */
  login: (credentials: { password: string; rememberMe?: boolean }): Promise<AxiosResponse<AuthResponseFE>> =>
    api.post('/auth', credentials),
  /**
   * Checks the current authentication status of the user with the server.
   * @returns {Promise<AxiosResponse<AuthResponseFE>>} A promise resolving to the server's response regarding authentication status.
   */
  checkStatus: (): Promise<AxiosResponse<AuthResponseFE>> => api.get('/auth'),
  /**
   * Logs out the currently authenticated user.
   * @returns {Promise<AxiosResponse<LogoutResponseFE>>} A promise resolving to the server's logout confirmation.
   */
  logout: (): Promise<AxiosResponse<LogoutResponseFE>> => api.delete('/auth'),
};

/**
 * Represents a single message within a chat conversation, suitable for frontend display and API communication.
 */
export interface ChatMessageFE {
  /** The role of the entity that produced the message. */
  role: 'user' | 'assistant' | 'system' | 'tool';
  /** The textual content of the message. Can be null if the message contains tool calls. */
  content: string | null;
  /** Optional Unix timestamp (milliseconds) of when the message was created or received. */
  timestamp?: number;
  /** Optional identifier for the agent or system component that generated this message. */
  agentId?: string;
  /** If this message is a response from a tool, this is the ID of the tool call it pertains to. */
  tool_call_id?: string;
  /** If the assistant requests tool calls, they are listed here. */
  tool_calls?: ILlmToolCallFE[];
  /** If the role is 'tool', this is the name of the tool. */
  name?: string;
}

/**
 * Extends {@link ChatMessageFE} with additional properties for messages processed for history or memory systems.
 */
export interface ProcessedHistoryMessageFE extends ChatMessageFE {
  /** Optional unique identifier for the message in the processed history. */
  id?: string;
  /** An estimated token count for the message, useful for context window management. */
  estimatedTokenCount?: number;
  /** Potentially processed or summarized tokens from the message content. */
  processedTokens?: string[];
  /** A score indicating the relevance of this message to the current context. */
  relevanceScore?: number;
}
/**
 * Defines the payload structure for sending chat messages to the API.
 */
export interface ChatMessagePayloadFE {
  /** An array of {@link ChatMessageFE} objects representing the current conversation turn. */
  messages: ChatMessageFE[];
  /** Optional array of {@link ProcessedHistoryMessageFE} for providing extended context or memory. */
  processedHistory?: ProcessedHistoryMessageFE[];
  /** The operational mode for the chat (e.g., 'general', 'code-python', 'tutor'). */
  mode: string;
  /** Optional preferred programming language, relevant for coding or technical modes. */
  language?: string;
  /** If true, requests the backend to attempt generating a diagram related to the conversation. */
  generateDiagram?: boolean;
  /** Optional identifier for the user initiating the chat. */
  userId?: string;
  /** Optional identifier for the current conversation, for stateful interactions. */
  conversationId?: string;
  /** Optional string to override or augment the default system prompt. */
  systemPromptOverride?: string;
  /** If true, activates tutor mode with specific LLM behavior. */
  tutorMode?: boolean;
  /** Specifies the difficulty or interaction level if tutorMode is active. */
  tutorLevel?: string;
  /** If true, activates interview simulation mode. */
  interviewMode?: boolean;
  /** If true, requests the response to be streamed. */
  stream?: boolean;
  /** If the last assistant message was a tool call, this object provides the tool's output. */
  tool_response?: {
    tool_call_id: string;
    tool_name: string;
    output: string;
  };
}

/**
 * Contains detailed cost breakdown for a user's session, including overall cost and service-specific costs.
 */
export interface SessionCostDetailsFE {
  /** The unique identifier for the user. */
  userId: string;
  /** The total accumulated cost for the current user session. */
  sessionCost: number;
  /** A record of costs broken down by different services (e.g., LLM, STT, TTS). */
  costsByService: Record<string, {
    totalCost: number;
    count: number;
    details?: Array<{ model?: string; cost: number; timestamp: string}>
  }>;
  /** ISO 8601 timestamp indicating when the current session started. */
  sessionStartTime: string;
  /** The number of API calls or billable entries made during the session. */
  entryCount: number;
  /** The user's total accumulated cost for the current global billing period (e.g., monthly). */
  globalMonthlyCost: number;
  /** The configured cost threshold for notifications or limits. */
  threshold: number;
  /** Boolean indicating if the user's cost has reached or exceeded the threshold. */
  isThresholdReached: boolean;
}

/**
 * Base interface for chat response data, containing fields common to all chat response types.
 */
interface BaseChatResponseDataFE {
  /** The identifier of the LLM model used to generate the response. */
  model: string;
  /** Token usage statistics for the API call. See {@link ILlmUsageFE}. */
  usage?: ILlmUsageFE;
  /** Updated session cost details after this API call. See {@link SessionCostDetailsFE}. */
  sessionCost: SessionCostDetailsFE;
  /** The cost incurred by this specific API call. */
  costOfThisCall: number;
  /** The identifier for the current conversation. */
  conversationId: string;
}

/**
 * Represents a standard text-based response from the chat API.
 */
export interface TextResponseDataFE extends BaseChatResponseDataFE {
  /** Discriminator for the response type, typically 'text_response' or omitted. */
  type?: 'text_response' | undefined;
  /** The textual content of the assistant's message. */
  content: string | null;
  /** An optional field indicating the server's interpretation or suggested next step (e.g., 'RESPOND', 'IGNORE'). */
  discernment?: 'RESPOND' | 'ACTION_ONLY' | 'IGNORE' | 'CLARIFY';
  /** An optional supplementary message from the server. */
  message?: string;
}

/**
 * Represents a response from the chat API where the assistant is requesting a function/tool call.
 */
export interface FunctionCallResponseDataFE extends BaseChatResponseDataFE {
  /** Discriminator for the response type, must be 'function_call_data'. */
  type: 'function_call_data';
  /** The name of the tool or function the assistant wants to invoke. */
  toolName: string;
  /** The arguments for the tool/function call, usually as a record or JSON object. */
  toolArguments: Record<string, any>;
  /** The unique identifier for this tool call instance. */
  toolCallId: string;
  /** Server's discernment, often 'TOOL_CALL_PENDING' for function calls. */
  discernment?: 'TOOL_CALL_PENDING';
  /** Optional text from the assistant that might precede or explain the tool call. */
  assistantMessageText?: string | null;
}

/**
 * A union type representing all possible structures for chat API response data.
 */
export type ChatResponseDataFE = TextResponseDataFE | FunctionCallResponseDataFE;

/**
 * Provides API methods for chat-related interactions.
 */
export const chatAPI = {
  /**
   * Sends a chat message payload to the backend and expects a single, complete response.
   * @param {ChatMessagePayloadFE} data - The chat payload including messages, mode, and other context.
   * @returns {Promise<AxiosResponse<ChatResponseDataFE>>} A promise resolving to the server's chat response.
   */
  sendMessage: (data: ChatMessagePayloadFE): Promise<AxiosResponse<ChatResponseDataFE>> =>
    api.post('/chat', data),

  /**
   * Sends a chat message payload and handles a streamed response from the server.
   * This method uses the `fetch` API to properly handle Server-Sent Events (SSE).
   * @param {ChatMessagePayloadFE} data - The chat payload. `stream` property will be overridden to true.
   * @param {(chunk: string) => void} onChunkReceived - Callback function invoked for each text chunk received from the stream.
   * @param {() => void} onStreamEnd - Callback function invoked when the stream has successfully ended.
   * @param {(error: Error) => void} onStreamError - Callback function invoked if an error occurs during streaming.
   * @returns {Promise<void>} A promise that resolves once the stream processing is initiated. Errors during streaming are passed to `onStreamError`.
   */
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
          'X-Client-Version': '1.3.7', // Updated client version
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Attempt to parse error body as JSON, otherwise use status text
        const errorBody = await response.json().catch(() => ({ message: `Request failed with status ${response.status}`, error: response.statusText }));
        throw new Error(`API Error: ${response.status} ${errorBody.message || errorBody.error || response.statusText}`);
      }
      if (!response.body) {
        throw new Error("Stream body is null, which is unexpected for a successful stream response.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (buffer.trim()) { // Process any remaining data in the buffer
            try {
                const finalDataObject = JSON.parse(buffer);
                if (finalDataObject && typeof finalDataObject === 'object' && finalDataObject.content) {
                    onChunkReceived(finalDataObject.content);
                } else if (finalDataObject && typeof finalDataObject === 'object' && !finalDataObject.content) {
                    console.info("[API Service] Stream ended with metadata (from buffer):", finalDataObject);
                } else { // Not JSON or no content field
                    onChunkReceived(buffer);
                }
            } catch(e) { // Not JSON
                onChunkReceived(buffer);
            }
          }
          break; // Stream finished
        }
        buffer += decoder.decode(value, { stream: true });
        let newlineIndex;
        // Process buffer line by line (SSE events are newline-terminated)
        while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
          const line = buffer.substring(0, newlineIndex).trim();
          buffer = buffer.substring(newlineIndex + 1); // Remaining part of the buffer
          
          if (line.startsWith('data: ')) {
            const jsonData = line.substring('data: '.length);
            try {
              const parsedChunk = JSON.parse(jsonData);
              // Handle different types of streamed data based on a 'type' field
              if (parsedChunk.type === 'chunk' && typeof parsedChunk.content === 'string') {
                onChunkReceived(parsedChunk.content);
              } else if (parsedChunk.type === 'tool_call_delta') {
                console.log("[API Service] Stream: Tool call delta received:", parsedChunk);
                // TODO: Implement frontend handling for tool_call_delta if required
              } else if (parsedChunk.type === 'final_response_metadata') {
                console.info("[API Service] Stream: Final response metadata received:", parsedChunk);
                // This metadata could be passed to onStreamEnd or a dedicated callback
              } else if (parsedChunk.content && typeof parsedChunk.content === 'string') { 
                // Fallback for chunks that have content but might miss a 'type' field
                onChunkReceived(parsedChunk.content);
              } else {
                console.warn("[API Service] Stream: Received unknown JSON structure in data event:", parsedChunk);
              }
            } catch (e) {
              console.warn('[API Service] Stream: Failed to parse JSON data event:', jsonData, e);
              // If JSON parsing fails but it's a data line, pass raw content if it's not an SSE control line
              if(jsonData && !line.startsWith("event:") && !line.startsWith("id:") && !line.startsWith(":")) {
                onChunkReceived(jsonData);
              }
            }
          } else if (line && !line.startsWith("event:") && !line.startsWith("id:") && !line.startsWith(":")) {
            // Lines that are not 'data:', 'event:', 'id:', or SSE comments (starting with ':')
            // This could be an error or an unexpected format.
            console.warn("[API Service] Stream: Received non-SSE formatted line:", line);
            onChunkReceived(line); // Pass as a raw chunk, might be useful for debugging
          }
        }
      }
      if (onStreamEnd) onStreamEnd();
    } catch (error: any) {
      console.error('[API Service] sendMessageStream encountered an error:', error);
      if (onStreamError) onStreamError(error);
      else throw error; // Re-throw if no specific error handler is provided
    }
  },
};

/**
 * Defines the structure of the response from Speech-to-Text (STT) transcription services.
 */
export interface TranscriptionResponseFE {
  /** The transcribed text output from the STT service. */
  transcription: string;
  /** Optional duration of the transcribed audio in seconds. */
  durationSeconds?: number;
  /** The cost incurred for this specific transcription request. */
  cost: number;
  /** Updated session cost details after this STT request. See {@link SessionCostDetailsFE}. */
  sessionCost: SessionCostDetailsFE;
  /** Optional message from the server related to the transcription. */
  message?: string;
  /** Optional additional analysis performed on the audio or transcription (e.g., sentiment). */
  analysis?: any;
  /** Optional metadata associated with the transcription process or result. */
  metadata?: any;
}

/**
 * Defines the structure of the response containing STT and TTS related statistics and configurations.
 */
export interface SttStatsResponseFE {
  /** The identifier of the currently configured STT provider (e.g., 'whisper_api'). */
  sttProvider: string;
  /** The identifier of the default TTS provider. */
  defaultTtsProvider: string;
  /** An array of identifiers for all available TTS providers. */
  availableTtsProviders: string[];
  /** Information string about the cost per minute for Whisper STT. */
  whisperCostPerMinute: string;
  /** Information string about OpenAI TTS costs. */
  openAITTSCostInfo: string;
  /** The default model used for OpenAI TTS (e.g., 'tts-1'). */
  openaiTtsDefaultModel: string;
  /** The default voice used for OpenAI TTS (e.g., 'alloy'). */
  openaiTtsDefaultVoice: string;
  /** The default speed/rate for OpenAI TTS. */
  openaiTtsDefaultSpeed: number;
  /** The user's current session cost. */
  currentSessionCost: number;
  /** The configured threshold for session costs. */
  sessionCostThreshold: number;
}

/**
 * Provides API methods related to Speech-to-Text (STT) services.
 */
export const speechAPI = {
  /**
   * Sends audio data to the backend for transcription.
   * @param {FormData} audioData - The audio data, typically encapsulated in a FormData object.
   * @returns {Promise<AxiosResponse<TranscriptionResponseFE>>} A promise resolving to the transcription results.
   */
  transcribe: (audioData: FormData): Promise<AxiosResponse<TranscriptionResponseFE>> =>
    api.post('/stt', audioData, {
      headers: { 'Content-Type': 'multipart/form-data', ...getAuthHeaders() }, // Auth headers added manually here for FormData
      timeout: 90000, // Extended timeout for potentially large audio file uploads and processing
    }),
  /**
   * Retrieves statistics and configuration details related to STT and TTS services from the backend.
   * @returns {Promise<AxiosResponse<SttStatsResponseFE>>} A promise resolving to the STT/TTS stats.
   */
  getStats: (): Promise<AxiosResponse<SttStatsResponseFE>> => api.get('/stt/stats'), // Auth headers applied by interceptor
};

/**
 * Defines the payload for Text-to-Speech (TTS) synthesis requests sent to the backend.
 * This type should be used by services like `voice.settings.service.ts` when calling `ttsAPI.synthesize`.
 */
export type TTSRequestPayloadFE = {
  /** The text content to be synthesized into speech. */
  text: string;
  /**
   * Optional voice identifier. The interpretation depends on the backend TTS provider.
   * For OpenAI, this could be a voice name (e.g., 'alloy', 'shimmer').
   * If `voice.settings.service.ts` sends provider-prefixed IDs (e.g., "openai_alloy"),
   * the backend API must be designed to parse or handle these prefixed IDs accordingly.
   */
  voice?: string;
  /**
   * Optional TTS model identifier (e.g., 'tts-1', 'tts-1-hd' for OpenAI).
   */
  model?: string;
  /** Optional desired output audio format (e.g., 'mp3', 'opus'). Defaults to backend's preference. */
  outputFormat?: 'mp3' | 'opus' | 'aac' | 'flac' | string;
  /** Optional speech speed or rate. The range and interpretation are provider-specific. */
  speed?: number;
  /** Optional BCP 47 language code, if required by the backend for voice/language disambiguation. */
  languageCode?: string;
  /** Optional identifier for a specific TTS provider if the backend routes to multiple providers. */
  providerId?: string;
}

/**
 * Represents a Text-to-Speech (TTS) voice option, as provided by the backend or detected in the browser.
 */
export interface TTSVoiceFE {
  /**
   * A unique identifier for the voice.
   * For browser-native voices, this is typically the `SpeechSynthesisVoice.voiceURI`.
   * For backend-provided voices (e.g., OpenAI), this is the voice or model name (e.g., 'alloy', 'tts-1').
   */
  id: string;
  /** The human-readable display name of the voice. */
  name: string;
  /** Optional BCP 47 language code associated with the voice (e.g., 'en-US', 'es-ES'). */
  lang?: string;
  /** Optional gender of the voice, if specified by the provider. */
  gender?: string;
  /** Identifier for the TTS provider (e.g., 'browser', 'openai', or a custom backend provider ID). */
  provider?: string;
  /** Optional flag indicating if this is a default voice for its language or provider. */
  isDefault?: boolean;
  /** Optional descriptive text for the voice. */
  description?: string;
}

/**
 * Defines the structure of the response when fetching available TTS voices from the backend.
 */
export interface TTSAvailableVoicesResponseFE {
  /** An array of {@link TTSVoiceFE} objects representing the available voices. */
  voices: TTSVoiceFE[];
  /** The total number of voices available. */
  count: number;
  /** A server-provided message, e.g., "Successfully retrieved voices." */
  message: string;
}

/**
 * Provides API methods related to Text-to-Speech (TTS) services.
 */
export const ttsAPI = {
  /**
   * Sends text to the backend to be synthesized into speech.
   * @param {TTSRequestPayloadFE} data - The payload containing the text and synthesis options.
   * @returns {Promise<AxiosResponse<Blob>>} A promise resolving to the synthesized audio data as a Blob.
   */
  synthesize: (data: TTSRequestPayloadFE): Promise<AxiosResponse<Blob>> =>
    api.post('/tts', data, { responseType: 'blob', headers: { ...getAuthHeaders() } }), // Auth headers added manually
  /**
   * Retrieves a list of available TTS voices from the backend.
   * @returns {Promise<AxiosResponse<TTSAvailableVoicesResponseFE>>} A promise resolving to the list of available voices.
   */
  getAvailableVoices: (): Promise<AxiosResponse<TTSAvailableVoicesResponseFE>> =>
    api.get('/tts/voices', { headers: getAuthHeaders() }), // Auth headers added manually
};


/**
 * Defines the payload for resetting user session costs or global monthly costs.
 */
export interface ResetCostPayloadFE {
  /** The reset action to perform. 'reset' for current user's session, 'reset_global' for system-wide monthly costs (admin only). */
  action?: 'reset' | 'reset_global';
  /** Optional user ID. Required if an admin is resetting a specific user's session cost, otherwise defaults to current user. */
  userId?: string;
}

/**
 * Defines the structure of the response after a cost reset operation.
 */
export interface ResetCostResponseFE {
  /** A confirmation message from the server. */
  message: string;
  /** The user's session cost after the reset (typically 0 for a session reset). */
  sessionCost: number;
  /** ISO 8601 timestamp of the new session start time. */
  sessionStartTime: string;
  /** The user's costs categorized by service after the reset. */
  costsByService: Record<string, { totalCost: number; count: number }>;
  /** The global monthly cost after a 'reset_global' action (admin only). */
  globalMonthlyCost?: number;
}

/**
 * Provides API methods for managing and querying costs.
 */
export const costAPI = {
  /**
   * Retrieves the current session cost details for the authenticated user.
   * Auth is applied by the global Axios interceptor.
   * @returns {Promise<AxiosResponse<SessionCostDetailsFE>>} A promise resolving to the current session cost details.
   */
  getSessionCost: (): Promise<AxiosResponse<SessionCostDetailsFE>> => api.get('/cost'),
  /**
   * Resets costs based on the provided payload. Defaults to resetting the current user's session cost.
   * Auth is applied by the global Axios interceptor.
   * @param {ResetCostPayloadFE} [data={ action: 'reset' }] - The payload specifying the reset action and target.
   * @returns {Promise<AxiosResponse<ResetCostResponseFE>>} A promise resolving to the response after the cost reset.
   */
  resetSessionCost: (data: ResetCostPayloadFE = { action: 'reset' }): Promise<AxiosResponse<ResetCostResponseFE>> =>
    api.post('/cost', data),
};

/**
 * Defines the payload for requesting diagram generation.
 */
export interface DiagramRequestPayloadFE {
  /** A textual description of the diagram to be generated by the LLM. */
  description: string;
  /** Optional type or format of the diagram (e.g., "mermaid-flowchart", "plantuml-sequence", "graphviz-dot"). */
  type?: string;
  /** Optional user ID, primarily for backend tracking or context. */
  userId?: string;
}

/**
 * Defines the structure of the response for diagram generation requests.
 */
export interface DiagramResponseFE {
  /** The generated diagram code in the specified or inferred format (e.g., Mermaid syntax). */
  diagramCode: string;
  /** The type of diagram that was generated. */
  type: string;
  /** The identifier of the model used for generating the diagram. */
  model: string;
  /** LLM token usage details for this diagram generation. See {@link ILlmUsageFE}. */
  usage?: ILlmUsageFE;
  /** Updated session cost details after this operation. See {@link SessionCostDetailsFE}. */
  sessionCost: SessionCostDetailsFE;
  /** The cost incurred specifically for generating this diagram. */
  cost: number;
}

/**
 * Provides API methods for diagram generation services.
 */
export const diagramAPI = {
  /**
   * Sends a description to the backend to generate a diagram.
   * Auth is applied by the global Axios interceptor.
   * @param {DiagramRequestPayloadFE} data - The payload containing the diagram description and optional type.
   * @returns {Promise<AxiosResponse<DiagramResponseFE>>} A promise resolving to the generated diagram and related information.
   */
  generate: (data: DiagramRequestPayloadFE): Promise<AxiosResponse<DiagramResponseFE>> =>
    api.post('/diagram', data),
};

/**
 * Interface for the response when fetching a prompt.
 */
export interface PromptResponseFE {
  /** The content of the prompt, typically a markdown string. */
  content: string;
  /** A message from the server, e.g., "Prompt retrieved successfully." */
  message: string;
  /** The filename of the retrieved prompt. */
  filename: string;
}

/**
 * Provides API methods for retrieving prompts.
 */
export const promptAPI = {
  /**
   * Fetches the content of a specific prompt file from the backend.
   * @param {string} filename - The name of the prompt file (e.g., 'coding_interviewer.md').
   * @returns {Promise<AxiosResponse<PromptResponseFE>>} A promise resolving to the prompt content.
   */
  getPrompt: (filename: string): Promise<AxiosResponse<PromptResponseFE>> =>
    api.get(`/prompts/${filename}`),
};


/**
 * Default export of the configured Axios instance (`api`).
 * This can be used for making one-off API calls that are not covered by the structured API objects (e.g., `authAPI`, `chatAPI`).
 * Interceptors for authentication and error handling will still apply.
 */
export default api;