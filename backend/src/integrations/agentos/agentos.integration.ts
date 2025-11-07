import path from 'path';
import fs from 'fs';
import { Router } from 'express';
import {
  AgentOS,
  type AgentOSConfig,
  type AgentOSResponse,
  type AgentOSInput,
  type AgentOSOrchestratorConfig,
  type GMIManagerConfig,
  type PromptEngineConfig,
  type ToolOrchestratorConfig,
  type ToolPermissionManagerConfig,
  type ConversationManagerConfig,
  type StreamingManagerConfig,
  type AIModelProviderManagerConfig,
  type WorkflowDefinition,
  type WorkflowInstance,
  WorkflowStatus,
} from '@agentos/core';
import type { FileSystemPersonaLoaderConfig } from '@agentos/core/cognitive_substrate/personas/PersonaLoader';
import type {
  IAuthService as AgentOSAuthServiceInterface,
  ISubscriptionService,
} from '@agentos/core/services/user_auth/types';
import { createAgentOSAuthAdapter } from './agentos.auth-service.js';
import { createAgentOSSubscriptionAdapter } from './agentos.subscription-service.js';
import { createAgentOSRouter } from './agentos.routes.js';
import { createAgentOSStreamRouter } from './agentos.stream-router.js';
import { createAgentOSSqlClient } from './agentos.sql-client.js';
import { reloadDynamicPersonas } from './agentos.persona-registry.js';
import { createDefaultGuardrailStack } from './guardrails/index.js';

const isWorkflowStatus = (value: string): value is WorkflowStatus =>
  (Object.values(WorkflowStatus) as string[]).includes(value);

/**
 * AgentOS is still incubating inside the Voice Chat Assistant monorepo.
 * This integration layer keeps the heavy AgentOS runtime lazy-loaded and
 * ensures we only wire the routes + orchestrator when explicitly enabled.
 */
class AgentOSIntegration {
  private agentos?: AgentOS;
  private router?: Router;
  private initializing?: Promise<void>;

  public isEnabled(): boolean {
    return process.env.AGENTOS_ENABLED === 'true';
  }

  public async getRouter(): Promise<Router> {
    if (!this.isEnabled()) {
      throw new Error('AgentOS integration not enabled. Set AGENTOS_ENABLED=true to mount these routes.');
    }
    if (this.router) {
      return this.router;
    }

    await this.getAgentOS();
    this.router = Router();
    this.router.use(createAgentOSRouter());
    this.router.use(createAgentOSStreamRouter(this));
    return this.router;
  }

  public async processThroughAgentOS(input: AgentOSInput): Promise<AgentOSResponse[]> {
    const agentosInstance = await this.getAgentOS();
    const chunks: AgentOSResponse[] = [];
    for await (const chunk of agentosInstance.processRequest(input)) {
      chunks.push(chunk);
    }
    return chunks;
  }

  public async processThroughAgentOSStream(
    input: AgentOSInput,
    onChunk: (chunk: AgentOSResponse) => Promise<void> | void,
  ): Promise<void> {
    const agentosInstance = await this.getAgentOS();
    for await (const chunk of agentosInstance.processRequest(input)) {
      await onChunk(chunk);
    }
  }

  public async listWorkflowDefinitions(): Promise<WorkflowDefinition[]> {
    try {
      const agentosInstance = await this.getAgentOS();
      return agentosInstance.listWorkflowDefinitions();
    } catch (error) {
      // Return mock workflow definitions as fallback
      console.warn('Failed to fetch workflow definitions from AgentOS, returning mock data:', error);
      return [
        {
          id: 'research-and-publish',
          displayName: 'Research & Publish',
          description: 'Research a topic and publish findings to Telegram',
          category: 'productivity' as any,
          requiredExtensions: ['web-search', 'telegram']
        } as any,
        {
          id: 'monitor-and-alert',
          displayName: 'Monitor & Alert',
          description: 'Monitor web for updates and send alerts',
          category: 'automation' as any,
          requiredExtensions: ['web-search', 'telegram']
        } as any,
        {
          id: 'content-aggregation',
          displayName: 'Content Aggregation',
          description: 'Aggregate content from multiple sources',
          category: 'research' as any,
          requiredExtensions: ['web-search']
        } as any
      ];
    }
  }

  public async listAvailablePersonas(userId?: string) {
    try {
      const agentosInstance = await this.getAgentOS();
      return agentosInstance.listAvailablePersonas(userId);
    } catch (error) {
      // Return mock personas as fallback
      console.warn('Failed to fetch personas from AgentOS, returning mock data:', error);
      return [
        {
          id: 'researcher',
          name: 'Research Specialist',
          description: 'Expert at gathering and analyzing information',
          features: ['Web search', 'Fact checking', 'Research aggregation']
        },
        {
          id: 'communicator',
          name: 'Communications Manager',
          description: 'Handles external communications and publishing',
          features: ['Telegram messaging', 'Content formatting', 'Notification management']
        },
        {
          id: 'generalist',
          name: 'General Assistant',
          description: 'Versatile assistant for various tasks',
          features: ['Multi-tool usage', 'Task coordination', 'General problem solving']
        }
      ];
    }
  }

  public async listWorkflows(options?: { conversationId?: string; status?: string }): Promise<WorkflowInstance[]> {
    const agentosInstance = await this.getAgentOS();
    const statuses = options?.status && isWorkflowStatus(options.status) ? [options.status] : undefined;
    return agentosInstance.listWorkflows({
      conversationId: options?.conversationId,
      statuses,
    });
  }

  public async startWorkflow(options: {
    definitionId: string;
    userId: string;
    conversationId?: string;
    workflowId?: string;
    context?: Record<string, unknown>;
    roleAssignments?: Record<string, string>;
    metadata?: Record<string, unknown>;
    agencyRequest?: Record<string, unknown>;
  }): Promise<WorkflowInstance> {
    const agentosInstance = await this.getAgentOS();

    const conversationId =
      options.conversationId && options.conversationId.trim().length > 0
        ? options.conversationId
        : `workflow-session-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const agentosInput: AgentOSInput = {
      userId: options.userId,
      sessionId: conversationId,
      conversationId,
      textInput: null,
      selectedPersonaId: options.definitionId,
      options: {
        streamUICommands: true,
      },
    };

    if (options.agencyRequest && typeof options.agencyRequest === 'object') {
      (agentosInput as any).agencyRequest = options.agencyRequest;
    }

    return agentosInstance.startWorkflow(options.definitionId, agentosInput, {
      workflowId: options.workflowId,
      conversationId,
      createdByUserId: options.userId,
      context: options.context,
      roleAssignments: options.roleAssignments,
      metadata: options.metadata,
    });
  }

  public async getWorkflow(workflowId: string): Promise<WorkflowInstance | null> {
    const agentosInstance = await this.getAgentOS();
    return agentosInstance.getWorkflow(workflowId);
  }

  public async cancelWorkflow(workflowId: string, reason?: string): Promise<WorkflowInstance | null> {
    const agentosInstance = await this.getAgentOS();
    const updated = await agentosInstance.updateWorkflowStatus(workflowId, WorkflowStatus.CANCELLED);
    if (updated && reason) {
      console.info('[AgentOS][Workflow] Cancelled workflow', { workflowId, reason });
    }
    return updated;
  }

  private async getAgentOS(): Promise<AgentOS> {
    if (this.agentos) {
      return this.agentos;
    }
    if (!this.initializing) {
      this.initializing = this.initializeAgentOS();
    }
    await this.initializing;
    if (!this.agentos) {
      throw new Error('AgentOS initialization failed.');
    }
    return this.agentos;
  }

  private async initializeAgentOS(): Promise<void> {
    ensureAgentOSEnvDefaults();
    await reloadDynamicPersonas();
    const config = await buildEmbeddedAgentOSConfig();
    const agentos = new AgentOS();
    await agentos.initialize(config);
    this.agentos = agentos;
  }
}

const resolveDefaultPersonaDir = (): string => {
  const overridePath = process.env.AGENTOS_PERSONA_PATH;
  if (overridePath) {
    const resolved = path.resolve(process.cwd(), overridePath);
    if (fs.existsSync(resolved)) {
      return resolved;
    }
    console.warn(`[AgentOS] Configured AGENTOS_PERSONA_PATH '${resolved}' does not exist.`);
  }

  const candidates = [
    path.resolve(process.cwd(), 'agentos', 'cognitive_substrate', 'personas', 'definitions'),
    path.resolve(process.cwd(), 'packages', 'agentos', 'src', 'cognitive_substrate', 'personas', 'definitions'),
    path.resolve(process.cwd(), '..', 'packages', 'agentos', 'src', 'cognitive_substrate', 'personas', 'definitions'),
    path.resolve(process.cwd(), '..', 'agentos', 'cognitive_substrate', 'personas', 'definitions'),
    path.resolve(process.cwd(), '..', 'backend', 'agentos', 'cognitive_substrate', 'personas', 'definitions'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  console.warn('[AgentOS] Persona definitions directory not found. Using default path with expectation that it will be created.');
  return candidates[0];
};

const agentOSIntegration = new AgentOSIntegration();

export const isAgentOSEnabled = (): boolean => agentOSIntegration.isEnabled();

export const getAgentOSRouter = async (): Promise<Router> => agentOSIntegration.getRouter();

export const agentosService = agentOSIntegration;

/**
 * Builds an AgentOS configuration that stores conversation state via the shared
 * SQL storage adapter (through the AgentOS Prisma shim) and honours existing
 * environment variable configuration.
 */
async function buildEmbeddedAgentOSConfig(): Promise<AgentOSConfig> {
  const gmiManagerConfig: GMIManagerConfig = {
    personaLoaderConfig: {
      loaderType: 'file_system',
      personaDefinitionPath: resolveDefaultPersonaDir(),
    } as FileSystemPersonaLoaderConfig,
    defaultGMIInactivityCleanupMinutes: Number(process.env.AGENTOS_GMI_INACTIVITY_MINUTES ?? 60),
    defaultWorkingMemoryType: 'in_memory',
    defaultGMIBaseConfigDefaults: {
      defaultLlmProviderId: process.env.AGENTOS_DEFAULT_PROVIDER_ID || 'openai',
      defaultLlmModelId: process.env.AGENTOS_DEFAULT_MODEL_ID || 'gpt-4o-mini',
    },
  };

  const orchestratorConfig: AgentOSOrchestratorConfig = {
    maxToolCallIterations: Number(process.env.AGENTOS_MAX_TOOL_CALL_ITERATIONS ?? 4),
    defaultAgentTurnTimeoutMs: Number(process.env.AGENTOS_TURN_TIMEOUT_MS ?? 120_000),
    enableConversationalPersistence: process.env.AGENTOS_ENABLE_PERSISTENCE === 'true',
  };

  const promptEngineConfig: PromptEngineConfig = {
    defaultTemplateName: 'openai_chat',
    availableTemplates: {},
    tokenCounting: {
      strategy: 'estimated',
      estimationModel: 'gpt-3.5-turbo',
    },
    historyManagement: {
      defaultMaxMessages: Number(process.env.AGENTOS_MAX_MESSAGES ?? 40),
      maxTokensForHistory: Number(process.env.AGENTOS_MAX_CONTEXT_TOKENS ?? 8192),
      summarizationTriggerRatio: 0.8,
      preserveImportantMessages: true,
    },
    contextManagement: {
      maxRAGContextTokens: Number(process.env.AGENTOS_RAG_CONTEXT_TOKENS ?? 1500),
      summarizationQualityTier: 'balanced',
      preserveSourceAttributionInSummary: true,
    },
    contextualElementSelection: {
      maxElementsPerType: {},
      defaultMaxElementsPerType: 3,
      priorityResolutionStrategy: 'highest_first',
      conflictResolutionStrategy: 'skip_conflicting',
    },
    performance: {
      enableCaching: true,
      cacheTimeoutSeconds: 120,
    },
    debugging: process.env.NODE_ENV === 'development' ? { logConstructionSteps: false } : undefined,
  };

  const toolOrchestratorConfig: ToolOrchestratorConfig = {
    orchestratorId: 'embedded-tool-orchestrator',
    defaultToolCallTimeoutMs: Number(process.env.AGENTOS_TOOL_TIMEOUT_MS ?? 30_000),
    maxConcurrentToolCalls: Number(process.env.AGENTOS_MAX_CONCURRENT_TOOLS ?? 8),
    logToolCalls: process.env.NODE_ENV !== 'production',
    globalDisabledTools: [],
    toolRegistrySettings: {
      allowDynamicRegistration: true,
      persistRegistry: false,
    },
  };

  const toolPermissionManagerConfig: ToolPermissionManagerConfig = {
    strictCapabilityChecking: false,
    logToolCalls: process.env.NODE_ENV !== 'production',
    toolToSubscriptionFeatures: {},
  };

  const conversationManagerConfig: ConversationManagerConfig = {
    defaultConversationContextConfig: {
      maxHistoryLengthMessages: Number(process.env.AGENTOS_MAX_MESSAGES ?? 100),
      enableAutomaticSummarization: true,
      summarizationOptions: {
        desiredLength: 'medium',
        method: 'abstractive_llm',
      },
    },
    maxActiveConversationsInMemory: Number(process.env.AGENTOS_MAX_ACTIVE_CONVERSATIONS ?? 100),
    inactivityTimeoutMs: Number(process.env.AGENTOS_INACTIVITY_TIMEOUT_MS ?? 3_600_000),
    persistenceEnabled: true,
  };

  const streamingManagerConfig: StreamingManagerConfig = {
    maxConcurrentStreams: Number(process.env.AGENTOS_MAX_CONCURRENT_STREAMS ?? 100),
    defaultStreamInactivityTimeoutMs: Number(process.env.AGENTOS_STREAM_INACTIVITY_TIMEOUT_MS ?? 300_000),
    maxClientsPerStream: Number(process.env.AGENTOS_MAX_CLIENTS_PER_STREAM ?? 5),
    onClientSendErrorBehavior: 'log_and_continue',
  };

  const openAiBaseUrl = process.env.AGENTOS_OPENAI_BASE_URL || 'https://api.openai.com/v1';

  const modelProviderManagerConfig: AIModelProviderManagerConfig = {
    providers: [
      {
        providerId: 'openai',
        enabled: Boolean(process.env.OPENAI_API_KEY),
        isDefault: true,
        config: {
          apiKey: process.env.OPENAI_API_KEY || 'missing-openai-key',
          baseURL: openAiBaseUrl,
          defaultModelId: process.env.AGENTOS_DEFAULT_MODEL_ID || 'gpt-4o-mini',
        },
      },
    ],
  };

  const prismaClient = await createAgentOSSqlClient();

  // Enable guardrails by default in non-dev environments (or via AGENTOS_ENABLE_GUARDRAILS=true)
  const guardrailService = (process.env.AGENTOS_ENABLE_GUARDRAILS === 'true' || process.env.NODE_ENV === 'production')
    ? createDefaultGuardrailStack()
    : undefined;

  return {
    gmiManagerConfig,
    orchestratorConfig,
    promptEngineConfig,
    toolOrchestratorConfig,
    toolPermissionManagerConfig,
    conversationManagerConfig,
    streamingManagerConfig,
    modelProviderManagerConfig,
    defaultPersonaId: process.env.AGENTOS_DEFAULT_PERSONA_ID || 'default_assistant_persona',
    prisma: prismaClient,
    authService: createAgentOSAuthAdapter(),
    subscriptionService: createAgentOSSubscriptionAdapter(),
    utilityAIService: undefined,
    guardrailService,
  };
}

function ensureAgentOSEnvDefaults(): void {
  process.env.JWT_SECRET ??= process.env.AUTH_JWT_SECRET ?? 'agentos-development-secret-change-me';
  process.env.API_KEY_ENCRYPTION_KEY_HEX ??=
    process.env.AGENTOS_API_KEY_ENCRYPTION_KEY_HEX ??
    '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  process.env.AGENTOS_DATABASE_URL ??= 'file:./agentos-dev.db';
}






