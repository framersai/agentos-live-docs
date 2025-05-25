// File: frontend/src/services/chatApiService.ts
/**
 * @fileoverview Specialized service for chat interactions with AgentOS backend.
 * Handles Server-Sent Events streaming and converts responses to chat store format.
 * @module services/chatApiService
 */

import { apiService } from './apiService';

/**
 * Application error class for consistent error handling
 */
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * AgentOS input structure for chat requests
 */
export interface AgentOSChatInput {
  userId: string;
  sessionId: string;
  textInput: string;
  selectedPersonaId?: string;
  conversationId?: string;
  settings?: {
    mode?: string;
    language?: string;
    generateDiagrams?: boolean;
  };
}

/**
 * Streaming response chunk from AgentOS
 */
export interface AgentOSResponseChunk {
  type: string;
  streamId: string;
  gmiInstanceId: string;
  personaId: string;
  timestamp: string;
  isFinal: boolean;
  // Type-specific properties
  textDelta?: string;
  finalResponseText?: string;
  toolCall?: any;
  // Error properties
  code?: string;
  message?: string;
  details?: any;
}

/**
 * Chat service for interacting with AgentOS backend
 */
export class ChatApiService {
  /**
   * Sends a chat message and returns an async generator for streaming responses
   */
  async* sendMessage(input: AgentOSChatInput): AsyncGenerator<AgentOSResponseChunk, void, unknown> {
    const response = await fetch(`${apiService.axiosInstance.defaults.baseURL}/agentos/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiService.getAuthToken()}`,
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;
          
          // Parse SSE format
          if (line.startsWith('data: ')) {
            try {
              const data = line.slice(6);
              if (data === '[DONE]') return;
              
              const chunk: AgentOSResponseChunk = JSON.parse(data);
              yield chunk;
              
              if (chunk.isFinal) return;
            } catch (e) {
              console.warn('Failed to parse SSE data:', line, e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Converts streaming chunks to a complete chat message
   */
  async sendMessageAndCollect(input: AgentOSChatInput): Promise<{
    content: string;
    metadata?: any;
    cost?: number;
  }> {
    let content = '';
    let metadata: any = {};
    let cost = 0;

    for await (const chunk of this.sendMessage(input)) {
      switch (chunk.type) {
        case 'text_delta':
          content += chunk.textDelta || '';
          break;
        case 'final_response':
          content = chunk.finalResponseText || content;
          break;
        case 'metadata':
          metadata = { ...metadata, ...chunk };
          break;
        case 'cost_update':
          cost = (chunk as any).totalCost || cost;
          break;
        case 'error':
          throw new Error(chunk.message || 'Unknown error from AgentOS');
      }
    }

    return { content, metadata, cost };
  }
}

export const chatApiService = new ChatApiService();