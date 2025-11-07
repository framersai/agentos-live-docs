import { io, Socket } from 'socket.io-client';

interface Extension {
  id: string;
  name: string;
  package: string;
  version: string;
  description: string;
  category: string;
  verified?: boolean;
  installed?: boolean;
  tools?: string[];
}

interface Tool {
  id: string;
  name: string;
  description: string;
  extension: string;
  inputSchema?: any;
  outputSchema?: any;
  hasSideEffects?: boolean;
}

class AgentOSClient {
  private socket: Socket | null = null;
  private baseUrl: string;

  constructor() {
    const devDefault = (typeof window !== 'undefined' && window.location && window.location.port === '5175')
      ? 'http://localhost:3001'
      : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
    this.baseUrl = import.meta.env.VITE_API_URL || devDefault;
  }

  // ... existing methods ...

  async sendMessage(
    personaId: string,
    message: string,
    sessionId?: string,
    includeTools = true,
    includeGuardrails = false
  ) {
    const response = await fetch(`${this.baseUrl}/api/agentos/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'agentos-workbench-user',
        personaId,
        input: message,
        conversationId: sessionId || `session_${Date.now()}`,
        includeTools,
        includeGuardrails
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response;
  }

  async streamMessage(
    personaId: string,
    message: string,
    sessionId?: string,
    includeTools = true,
    includeGuardrails = false,
    onChunk?: (chunk: any) => void,
    onComplete?: () => void,
    onError?: (error: Error) => void,
    opts?: { model?: string; workflowRequest?: any; agencyRequest?: any }
  ) {
    try {
      // Use GET SSE via stream router by default
      const params = new URLSearchParams({
        userId: 'agentos-workbench-user',
        mode: personaId, // stream router uses `mode` as selectedPersonaId
        conversationId: sessionId || `session_${Date.now()}`,
        messages: JSON.stringify([{ role: 'user', content: message }]),
      });
      if (opts?.model) params.set('model', opts.model);
      if (opts?.workflowRequest) params.set('workflowRequest', JSON.stringify(opts.workflowRequest));
      if (opts?.agencyRequest) params.set('agencyRequest', JSON.stringify(opts.agencyRequest));
      const url = `${this.baseUrl}/api/agentos/stream?${params.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'text/event-stream' }
      });

      if (!response.ok) {
        throw new Error('Failed to start stream');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data && data !== '{}') {
              try {
                const chunk = JSON.parse(data);
                onChunk?.(chunk);
              } catch (e) {
                console.error('Failed to parse SSE chunk:', e);
              }
            }
          } else if (line.startsWith('event: done')) {
            onComplete?.();
            return;
          } else if (line.startsWith('event: error')) {
            // Find the next data line for error details
            const errorLine = lines.find(l => l.startsWith('data: '));
            if (errorLine) {
              try {
                const errorData = JSON.parse(errorLine.slice(6));
                onError?.(new Error(errorData.message || 'Stream error'));
              } catch {
                onError?.(new Error('Stream error'));
              }
            }
            return;
          }
        }
      }
    } catch (error) {
      onError?.(error as Error);
      throw error;
    }
  }

  async listPersonas(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/api/agentos/personas?userId=agentos-workbench-user`);
    if (!response.ok) {
      throw new Error('Failed to fetch personas');
    }
    const data = await response.json();
    // Handle both array response and object with personas field
    return Array.isArray(data) ? data : (data.personas || []);
  }

  async listWorkflows(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/api/agentos/workflows/definitions`);
    if (!response.ok) {
      throw new Error('Failed to fetch workflows');
    }
    const data = await response.json();
    // Handle both array response and object with definitions field
    return Array.isArray(data) ? data : (data.definitions || []);
  }

  // Alias for backwards compatibility
  async listWorkflowDefinitions(): Promise<any[]> {
    return this.listWorkflows();
  }

  async executeAgency(
    agencyId: string,
    input: any
  ): Promise<Response> {
    const response = await fetch(`${this.baseUrl}/api/agentos/agency/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agencyId,
        input,
        userId: 'agentos-workbench-user'
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to execute agency');
    }

    return response;
  }

  // New Extension Methods

  async getExtensions(): Promise<Extension[]> {
    const response = await fetch(`${this.baseUrl}/api/agentos/extensions`);
    if (!response.ok) {
      throw new Error('Failed to fetch extensions');
    }
    const data = await response.json();
    // Extensions endpoint returns array directly
    return Array.isArray(data) ? data : [];
  }

  async getAvailableTools(): Promise<Tool[]> {
    const response = await fetch(`${this.baseUrl}/api/agentos/extensions/tools`);
    if (!response.ok) {
      throw new Error('Failed to fetch available tools');
    }
    const data = await response.json();
    // Tools endpoint returns array directly
    return Array.isArray(data) ? data : [];
  }

  async installExtension(packageName: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/agentos/extensions/install`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ package: packageName }),
    });

    if (!response.ok) {
      throw new Error('Failed to install extension');
    }
  }

  async executeTool(toolId: string, input: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/agentos/tools/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        toolId,
        input,
        userId: 'agentos-workbench-user'
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to execute tool');
    }

    return response.json();
  }

  async startAgencyWorkflow(input: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/agentos/agency/workflow/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workflowId: 'research-and-report',
        input,
        userId: 'agentos-workbench-user'
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to start agency workflow');
    }

    return response.json();
  }

  // Diagnostics
  async getLlmStatus(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/system/llm-status`);
    if (!response.ok) throw new Error('Failed to fetch LLM status');
    return response.json();
  }

  async getAvailableModels(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/api/agentos/models`);
    if (!response.ok) throw new Error('Failed to fetch models');
    const data = await response.json();
    return data.models || [];
  }

  // Open a streaming connection to AgentOS
  openAgentOSStream(
    params: {
      sessionId: string;
      personaId: string;
      messages: Array<{ role: string; content: string }>;
      workflowRequest?: any;
      agencyRequest?: any;
      model?: string;
    },
    handlers: {
      onChunk?: (chunk: any) => void;
      onDone?: () => void;
      onError?: (error: Error) => void;
    }
  ): () => void {
    // Create an AbortController for cancellation (future use)
    const abortController = new AbortController();
    
    // Start the stream via GET SSE
    this.streamMessage(
      params.personaId,
      params.messages[params.messages.length - 1].content,
      params.sessionId,
      true, // includeTools
      false, // includeGuardrails
      handlers.onChunk,
      handlers.onDone, // onComplete
      handlers.onError,
      { model: params.model, workflowRequest: params.workflowRequest, agencyRequest: params.agencyRequest }
    );
    
    // Return cleanup function
    return () => {
      abortController.abort();
    };
  }

  // WebSocket methods for real-time communication
  connectWebSocket(onMessage?: (data: any) => void): Socket {
    if (!this.socket) {
      this.socket = io(this.baseUrl);

      this.socket.on('connect', () => {
        console.log('Connected to AgentOS WebSocket');
      });

      this.socket.on('message', (data) => {
        onMessage?.(data);
      });

      this.socket.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    }

    return this.socket;
  }

  disconnectWebSocket() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const agentosClient = new AgentOSClient();

// Export individual methods for direct import (bound to instance)
export const sendMessage = agentosClient.sendMessage.bind(agentosClient);
export const streamMessage = agentosClient.streamMessage.bind(agentosClient);
export const openAgentOSStream = agentosClient.openAgentOSStream.bind(agentosClient);
export const listPersonas = agentosClient.listPersonas.bind(agentosClient);
export const listWorkflows = agentosClient.listWorkflows.bind(agentosClient);
export const listWorkflowDefinitions = agentosClient.listWorkflowDefinitions.bind(agentosClient);
export const executeAgency = agentosClient.executeAgency.bind(agentosClient);

// Export agency-specific utilities
export { streamAgencyWorkflow, type AgentRoleConfig, type AgencyStreamInput } from './agencyClient';
export const getExtensions = agentosClient.getExtensions.bind(agentosClient);
export const getAvailableTools = agentosClient.getAvailableTools.bind(agentosClient);
export const installExtension = agentosClient.installExtension.bind(agentosClient);
export const executeTool = agentosClient.executeTool.bind(agentosClient);
export const startAgencyWorkflow = agentosClient.startAgencyWorkflow.bind(agentosClient);
export const connectWebSocket = agentosClient.connectWebSocket.bind(agentosClient);
export const disconnectWebSocket = agentosClient.disconnectWebSocket.bind(agentosClient);
export const getLlmStatus = agentosClient.getLlmStatus.bind(agentosClient);
export const getAvailableModels = agentosClient.getAvailableModels.bind(agentosClient);