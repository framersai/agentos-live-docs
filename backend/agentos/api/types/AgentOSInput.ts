// agentos/api/types/AgentOSInput.ts

export interface AgentOSPersonaMetadata {
  personaId: string;
  label: string;
  category: string;
  promptKey: string;
  promptPath: string;
  toolsetIds: string[];
}

export interface AgentOSProcessingOptions {
  streamUICommands?: boolean;
  preferredModelId?: string;
  temperature?: number;
}

export interface AgentOSInput {
  userId: string;
  sessionId: string;
  textInput: string | null;
  conversationId?: string;
  selectedPersonaId?: string;
  personaMetadata?: AgentOSPersonaMetadata;
  userApiKeys?: Record<string, string>;
  options?: AgentOSProcessingOptions;
}
