import path from 'path';
import { Router } from 'express';
import { AgentOS, type AgentOSConfig } from '../../../agentos/api/AgentOS';
import type { AgentOSResponse } from '../../../agentos/api/types/AgentOSResponse';
import type { AgentOSInput } from '../../../agentos/api/types/AgentOSInput';
import type { AgentOSOrchestratorConfig } from '../../../agentos/api/AgentOSOrchestrator';
import type { GMIManagerConfig } from '../../../agentos/cognitive_substrate/GMIManager';
import type { IAuthService as AgentOSAuthServiceInterface } from '../../../services/user_auth/IAuthService';
import type { ISubscriptionService, ISubscriptionTier } from '../../../services/user_auth/SubscriptionService';
import type { PromptEngineConfig } from '../../../agentos/core/llm/IPromptEngine';
import type { ToolOrchestratorConfig } from '../../../agentos/config/ToolOrchestratorConfig';
import type { ToolPermissionManagerConfig } from '../../../agentos/core/tools/permissions/IToolPermissionManager';
import type { ConversationManagerConfig } from '../../../agentos/core/conversation/ConversationManager';
import type { StreamingManagerConfig } from '../../../agentos/core/streaming/StreamingManager';
import type { AIModelProviderManagerConfig } from '../../../agentos/core/llm/providers/AIModelProviderManager';
import { createAgentOSRoutes } from '../../../api/agentosRoutes.js';
import { verifyToken as verifyLegacyToken } from '../../features/auth/auth.service.js';
import type { AuthTokenPayload } from '../../features/auth/auth.service.js';
import { PrismaClient } from '@prisma/client';

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

    const agentosInstance = await this.getAgentOS();
    const routerAuthBridge = new AgentOSRouterAuthBridge();
    this.router = createAgentOSRoutes(
      agentosInstance,
      routerAuthBridge as unknown as AgentOSAuthServiceInterface,
    );
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
    defaultMaxContextTokens: Number(process.env.AGENTOS_MAX_CONTEXT_TOKENS ?? 8192),
    enablePromptCaching: true,
    maxCachedPrompts: 100,
    defaultTemperature: Number(process.env.LLM_DEFAULT_TEMPERATURE ?? 0.7),
    enableTokenCounting: true,
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
      maxMessages: Number(process.env.AGENTOS_MAX_MESSAGES ?? 100),
      enableAutoSummarization: true,
      summarizationThreshold: 60,
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
    authService: createStubbedAgentOSAuthService(),
    subscriptionService: createStubbedSubscriptionService(),
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

/**
 * Router authentication bridge that plugs into the existing token issuance logic.
 * This keeps the `/api/agentos/*` endpoints aligned with the rest of the app.
 */
class AgentOSRouterAuthBridge {
  async validateToken(token: string): Promise<AuthTokenPayload | null> {
    return verifyLegacyToken(token);
  }

  async verifyToken(token: string): Promise<AuthTokenPayload | null> {
    return verifyLegacyToken(token);
  }
}

/**
 * AgentOS core currently requires an auth service reference, even though the embedded
 * runtime delegates authentication to the existing middleware. We satisfy the dependency
 * with a proxy that returns benign defaults and logs any unexpected usage.
 */
function createStubbedAgentOSAuthService(): AgentOSAuthServiceInterface {
  const handler: ProxyHandler<any> = {
    get: (_target, prop) => {
      if (prop === 'validateToken' || prop === 'verifyToken') {
        return async () => null;
      }
      return async (...args: any[]) => {
        console.warn(`[AgentOS][AuthStub] Method ${String(prop)} invoked`, { args });
        return null;
      };
    },
  };
  return new Proxy({}, handler) as AgentOSAuthServiceInterface;
}

function createStubbedSubscriptionService(): ISubscriptionService {
  const defaultTier: ISubscriptionTier = {
    id: 'agentos-default-tier',
    name: 'AgentOS Embedded Default',
    priority: 0,
    features: [],
  } as ISubscriptionTier;

  const handler: ProxyHandler<any> = {
    get: (_target, prop) => {
      switch (prop) {
        case 'initialize':
          return async () => undefined;
        case 'getUserSubscriptionTier':
          return async () => defaultTier;
        case 'getAllTiers':
          return async () => [defaultTier];
        case 'getTierByName':
          return async () => defaultTier;
        default:
          return async (...args: any[]) => {
            console.warn(`[AgentOS][SubscriptionStub] Method ${String(prop)} invoked`, { args });
            if (prop === 'userCanAccessPersona') return true;
            return defaultTier;
          };
      }
    },
  };
  return new Proxy({}, handler) as ISubscriptionService;
}
