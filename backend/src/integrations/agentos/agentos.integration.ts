import path from 'path';
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
} from '@agentos/core';
import type {
  IAuthService as AgentOSAuthServiceInterface,
  ISubscriptionService,
} from '@agentos/core/services/user_auth/types';
import { PrismaClient } from '@agentos/core/stubs/prismaClient';
import { createAgentOSAuthAdapter } from './agentos.auth-service.js';
import { createAgentOSSubscriptionAdapter } from './agentos.subscription-service.js';
import { createAgentOSRouter } from './agentos.routes.js';
import { createAgentOSStreamRouter } from './agentos.stream-router.js';

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
    this.router.use(createAgentOSStreamRouter());
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
    const config = buildEmbeddedAgentOSConfig();
    const agentos = new AgentOS();
    await agentos.initialize(config);
    this.agentos = agentos;
  }
}

const DEFAULT_PERSONA_DIR = path.resolve(
  process.cwd(),
  'backend',
  'agentos',
  'cognitive_substrate',
  'personas',
  'definitions',
);

const agentOSIntegration = new AgentOSIntegration();

export const isAgentOSEnabled = (): boolean => agentOSIntegration.isEnabled();

export const getAgentOSRouter = async (): Promise<Router> => agentOSIntegration.getRouter();

export const agentosService = agentOSIntegration;

/**
 * Builds a lightweight AgentOSConfig that relies on in-memory data stores and
 * the standard Voice Chat Assistant environment variables.
 */
function buildEmbeddedAgentOSConfig(): AgentOSConfig {
  const gmiManagerConfig: GMIManagerConfig = {
    personaLoaderConfig: {
      personaSource: process.env.AGENTOS_PERSONA_PATH || DEFAULT_PERSONA_DIR,
      loaderType: 'file_system',
    },
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
    persistenceEnabled: false,
  };

  const streamingManagerConfig: StreamingManagerConfig = {
    maxConcurrentStreams: Number(process.env.AGENTOS_MAX_CONCURRENT_STREAMS ?? 100),
    defaultStreamInactivityTimeoutMs: Number(process.env.AGENTOS_STREAM_INACTIVITY_TIMEOUT_MS ?? 300_000),
    maxClientsPerStream: Number(process.env.AGENTOS_MAX_CLIENTS_PER_STREAM ?? 5),
    onClientSendErrorBehavior: 'log_and_continue',
  };

  const modelProviderManagerConfig: AIModelProviderManagerConfig = {
    providers: [
      {
        providerId: 'openai',
        enabled: Boolean(process.env.OPENAI_API_KEY),
        isDefault: true,
        config: {
          apiKey: process.env.OPENAI_API_KEY || 'missing-openai-key',
          baseURL: process.env.AGENTOS_OPENAI_BASE_URL,
          defaultModelId: process.env.AGENTOS_DEFAULT_MODEL_ID || 'gpt-4o-mini',
        },
      },
    ],
  };

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
    prisma: createPrismaStub(),
    authService: createAgentOSAuthAdapter(),
    subscriptionService: createAgentOSSubscriptionAdapter(),
    utilityAIService: undefined,
  };
}

function ensureAgentOSEnvDefaults(): void {
  process.env.JWT_SECRET ??= process.env.AUTH_JWT_SECRET ?? 'agentos-development-secret-change-me';
  process.env.API_KEY_ENCRYPTION_KEY_HEX ??=
    process.env.AGENTOS_API_KEY_ENCRYPTION_KEY_HEX ??
    '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  process.env.AGENTOS_DATABASE_URL ??= 'file:./agentos-dev.db';
}

/**
 * The real AgentOS runtime relies on Prisma for persistence, but the embedded
 * runtime uses SQLite via better-sqlite. We provide a very small stub that
 * satisfies the PrismaClient contract while logging accidental usages.
 */
function createPrismaStub() {
  return new PrismaClient();
}

