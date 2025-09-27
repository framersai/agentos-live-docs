// agentos/api/AgentOS.ts
import { AgentOSInput } from './types/AgentOSInput';
import { AgentOSResponse } from './types/AgentOSResponse';

export interface AgentOSConfig {
  apiKey?: string;
  baseURL?: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

export class AgentOS {
  private config: AgentOSConfig;
  private isInitialized: boolean = false;

  constructor(config: AgentOSConfig = {}) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Initialize the AgentOS system
    this.isInitialized = true;
    console.log('AgentOS initialized');
  }

  async processInput(input: AgentOSInput): Promise<AgentOSResponse> {
    if (!this.isInitialized) {
      throw new Error('AgentOS not initialized. Call initialize() first.');
    }

    // Process the input and return a response
    return {
      success: true,
      message: input.message || 'Message processed',
      data: {
        response: 'Response from AgentOS',
        timestamp: new Date().toISOString()
      }
    };
  }

  async shutdown(): Promise<void> {
    // Clean up resources
    this.isInitialized = false;
    console.log('AgentOS shutdown');
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

export default AgentOS;