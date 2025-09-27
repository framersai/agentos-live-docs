// agentos/api/types/AgentOSInput.ts
export interface AgentOSInput {
  message?: string;
  context?: any;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}
