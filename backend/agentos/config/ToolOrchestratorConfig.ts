// config/ToolOrchestratorConfig.ts
export interface ToolOrchestratorConfig {
    orchestratorId: string;
    defaultToolCallTimeoutMs: number;
    maxConcurrentToolCalls: number;
    logToolCalls: boolean;
    globalDisabledTools: string[];
    toolRegistrySettings: {
      allowDynamicRegistration: boolean;
      persistRegistry: boolean;
    };
  }