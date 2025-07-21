// agentos/server/integration/SDKClient.ts
import axios, { AxiosInstance } from 'axios';
import { EventEmitter } from 'events';
import { io, Socket } from 'socket.io-client';
import { AgentOSInput, UserFeedbackPayload } from '../../api/types/AgentOSInput';
import { AgentOSResponse } from '../../api/types/AgentOSResponse';

export interface AgentOSClientConfig {
  baseURL: string;
  apiKey?: string;
  timeout?: number;
  retryAttempts?: number;
  websocketEnabled?: boolean;
}

export class AgentOSClient extends EventEmitter {
  private httpClient: AxiosInstance;
  private config: AgentOSClientConfig;
  private wsClient?: Socket;
  private userId?: string;
  private sessionId?: string;

  constructor(config: AgentOSClientConfig) {
    super();
    this.config = config;
    this.httpClient = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'x-agentos-api-key': config.apiKey }),
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.httpClient.interceptors.request.use(
      (config) => {
        console.log(`[AgentOS Client] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.httpClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.config && !error.config.__retryCount) {
          error.config.__retryCount = 0;
        }

        const shouldRetry = error.config.__retryCount < (this.config.retryAttempts || 3) &&
                           (error.response?.status === 429 || error.response?.status >= 500);

        if (shouldRetry) {
          error.config.__retryCount++;
          const delay = Math.pow(2, error.config.__retryCount) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.httpClient.request(error.config);
        }

        return Promise.reject(error);
      }
    );
  }

  // Authentication
  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  // Health check
  public async healthCheck(): Promise<any> {
    const response = await this.httpClient.get('/api/v1/health');
    return response.data;
  }

  // Persona management
  public async listPersonas(): Promise<any[]> {
    const response = await this.httpClient.get('/api/v1/personas');
    return response.data.data;
  }

  public async getPersona(personaId: string): Promise<any> {
    const response = await this.httpClient.get(`/api/v1/personas/${personaId}`);
    return response.data.data;
  }

  // Chat - Non-streaming
  public async sendMessage(input: Partial<AgentOSInput>): Promise<any> {
    const payload = {
      ...input,
      userId: this.userId,
      sessionId: this.sessionId || `session_${Date.now()}`,
    };

    const response = await this.httpClient.post('/api/v1/chat/message', payload);
    return response.data.data;
  }

  // Chat - Server-Sent Events streaming
  public async sendMessageStream(input: Partial<AgentOSInput>): Promise<EventTarget> {
    const payload = {
      ...input,
      userId: this.userId,
      sessionId: this.sessionId || `session_${Date.now()}`,
    };

    const response = await fetch(`${this.config.baseURL}/api/v1/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'x-agentos-api-key': this.config.apiKey }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const eventSource = new EventTarget();
    const reader = response.body?.getReader();
    
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    
    const readStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            eventSource.dispatchEvent(new CustomEvent('end'));
            break;
          }

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data.trim()) {
                try {
                  const parsedData = JSON.parse(data);
                  eventSource.dispatchEvent(new CustomEvent('chunk', { detail: parsedData }));
                } catch (e) {
                  console.warn('Failed to parse SSE data:', data);
                }
              }
            } else if (line.startsWith('event: ')) {
              const eventType = line.slice(7);
              if (eventType === 'end') {
                eventSource.dispatchEvent(new CustomEvent('end'));
                return;
              } else if (eventType === 'error') {
                eventSource.dispatchEvent(new CustomEvent('error', { detail: 'Stream error' }));
                return;
              }
            }
          }
        }
      } catch (error) {
        eventSource.dispatchEvent(new CustomEvent('error', { detail: error }));
      } finally {
        reader.releaseLock();
      }
    };

    readStream();
    return eventSource;
  }

  // WebSocket methods
  public connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.config.websocketEnabled) {
        reject(new Error('WebSocket is disabled'));
        return;
      }

      this.wsClient = io(this.config.baseURL, {
        transports: ['websocket'],
        timeout: this.config.timeout || 30000,
      });

      this.wsClient.on('connect', () => {
        console.log('[AgentOS Client] WebSocket connected');
        this.emit('connected');
        resolve();
      });

      this.wsClient.on('disconnect', (reason) => {
        console.log('[AgentOS Client] WebSocket disconnected:', reason);
        this.emit('disconnected', reason);
      });

      this.wsClient.on('connect_error', (error) => {
        console.error('[AgentOS Client] WebSocket connection error:', error);
        this.emit('error', error);
        reject(error);
      });

      this.wsClient.on('message', (message) => {
        this.handleWebSocketMessage(message);
      });
    });
  }

  public disconnectWebSocket(): void {
    if (this.wsClient) {
      this.wsClient.disconnect();
      this.wsClient = undefined;
    }
  }

  private handleWebSocketMessage(message: any): void {
    switch (message.type) {
      case 'text_delta':
        this.emit('text_delta', message.data);
        break;
      case 'system_progress':
        this.emit('system_progress', message.data);
        break;
      case 'tool_call_request':
        this.emit('tool_call_request', message.data);
        break;
      case 'final_response':
        this.emit('final_response', message.data);
        break;
      case 'error':
        this.emit('error', new Error(message.data.error || 'WebSocket error'));
        break;
      default:
        console.warn('[AgentOS Client] Unknown message type:', message.type);
    }
  }
}

// Simple wrapper for basic usage
export class SimpleAgentOSClient {
  private client: AgentOSClient;

  constructor(config: AgentOSClientConfig) {
    this.client = new AgentOSClient(config);
  }

  public async chat(message: string, personaId?: string): Promise<string> {
    const response = await this.client.sendMessage({
      textInput: message,
      selectedPersonaId: personaId,
    });

    const finalChunk = response.chunks.find((chunk: any) => chunk.type === 'final_response');
    return finalChunk?.finalResponseText || 'No response';
  }

  public async chatStream(
    message: string,
    onChunk: (chunk: any) => void,
    personaId?: string
  ): Promise<void> {
    const eventSource = await this.client.sendMessageStream({
      textInput: message,
      selectedPersonaId: personaId,
    });

    return new Promise((resolve, reject) => {
      eventSource.addEventListener('chunk', (event: any) => {
        onChunk(event.detail);
      });

      eventSource.addEventListener('end', () => {
        resolve();
      });

      eventSource.addEventListener('error', (event: any) => {
        reject(new Error(event.detail));
      });
    });
  }
}