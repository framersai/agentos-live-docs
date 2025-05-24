/**
 * @fileoverview This file implements the GMIManager (Generalized Mind Instance Manager),
 * a crucial component in AgentOS responsible for the lifecycle management of GMIs.
 *
 * The GMIManager orchestrates the creation, retrieval, activation, and deactivation
 * of GMI instances. It leverages an IPersonaLoader to load persona definitions,
 * which are then used to initialize GMIs. It manages GMI instances on a per-session
 * basis, ensuring users interact with appropriately configured and stateful GMI.
 *
 * Key responsibilities include:
 * - Loading and providing access to all available persona definitions.
 * - Assembling the complete GMIBaseConfig with all necessary service dependencies.
 * - Instantiating new GMI instances.
 * - Reusing existing GMI instances for ongoing sessions if the persona remains the same.
 * - Handling requests for different personas within a session by creating new GMI instances.
 * - Managing conversation contexts via an injected ConversationManager.
 * - Enforcing access controls based on user subscriptions and persona requirements.
 * - Cleaning up inactive GMI instances to conserve resources.
 *
 * @module backend/agentos/cognitive_substrate/GMIManager
 * @see ./IGMI.ts for GMI interface and GMIBaseConfig.
 * @see ./GMI.ts for GMI implementation.
 * @see ./personas/IPersonaDefinition.ts
 * @see ./personas/IPersonaLoader.ts
 * @see ../core/conversation/ConversationManager.ts
 */

import { v4 as uuidv4 } from 'uuid';
import { IGMI, GMIBaseConfig, UserContext } from './IGMI';
import { GMI } from './GMI';
import { IPersonaDefinition } from './personas/IPersonaDefinition';
import { IPersonaLoader, PersonaLoaderConfig } from './personas/IPersonaLoader';
import { PersonaLoader } from './personas/PersonaLoader'; // Default implementation
import { IAuthService } from '../../services/user_auth/AuthService';
import { ISubscriptionService, ISubscriptionTier, FeatureFlag } from '../../services/user_auth/SubscriptionService';
import { IWorkingMemory } from './memory/IWorkingMemory';
import { InMemoryWorkingMemory } from './memory/InMemoryWorkingMemory'; // Default working memory implementation
// TODO: Introduce IWorkingMemoryFactory for flexible working memory provisioning.
import { ConversationManager } from '../core/conversation/ConversationManager';
import { ConversationContext } from '../core/conversation/ConversationContext';
import { PrismaClient } from '@prisma/client'; // For user/subscription data, not directly passed to GMI core.
import { GMIError, GMIErrorCode } from '../../utils/errors';

// GMI Service Dependencies - these are passed to each GMI instance
import { IPromptEngine } from '../core/llm/IPromptEngine';
import { AIModelProviderManager } from '../core/llm/providers/AIModelProviderManager';
import { IUtilityAI } from '../core/ai_utilities/IUtilityAI';
import { IToolOrchestrator } from '../tools/IToolOrchestrator';
import { IRetrievalAugmentor } from '../rag/IRetrievalAugmentor';

/**
 * Custom error class for GMIManager-specific operational errors.
 * @class GMIManagerError
 * @extends {GMIError}
 */
export class GMIManagerError extends GMIError {
  /**
   * Creates an instance of GMIManagerError.
   * @param {string} message - The human-readable error message.
   * @param {GMIErrorCode | string} code - A GMIManager-specific or general GMIError code.
   * @param {any} [details] - Optional additional context or the underlying error.
   */
  constructor(message: string, code: GMIErrorCode | string, details?: any) {
    super(message, code as GMIErrorCode, details); // Cast code if it's a string for now
    this.name = 'GMIManagerError';
    Object.setPrototypeOf(this, GMIManagerError.prototype);
  }
}

/**
 * Configuration options for the GMIManager.
 * @interface GMIManagerConfig
 * @property {PersonaLoaderConfig} personaLoaderConfig - Configuration for loading persona definitions.
 * @property {number} [defaultGMIInactivityCleanupMinutes=60] - Default inactivity threshold for GMI cleanup.
 * @property {string} [defaultWorkingMemoryType="in_memory"] - Default type of working memory to provision.
 * (Future use with IWorkingMemoryFactory).
 */
export interface GMIManagerConfig {
  personaLoaderConfig: PersonaLoaderConfig;
  defaultGMIInactivityCleanupMinutes?: number;
  defaultWorkingMemoryType?: 'in_memory' | string; // For future factory use
}

/**
 * Manages the lifecycle of Generalized Mind Instances (GMIs).
 */
export class GMIManager {
  private config!: GMIManagerConfig;
  private personaLoader: IPersonaLoader;
  private allPersonaDefinitions: Map<string, IPersonaDefinition>; // persona.id -> IPersonaDefinition
  private activeGMIs: Map<string, IGMI>; // gmiInstanceId -> IGMI
  private gmiSessionMap: Map<string, string>; // external sessionId -> gmiInstanceId

  // GMIManager's own service dependencies
  private authService: IAuthService;
  private subscriptionService: ISubscriptionService;
  private prisma: PrismaClient; // Used by GMIManager for user/sub data, not passed to GMI directly
  private conversationManager: ConversationManager;

  // Service dependencies to be injected into each GMI via GMIBaseConfig
  private promptEngine: IPromptEngine;
  private llmProviderManager: AIModelProviderManager;
  private utilityAI: IUtilityAI;
  private toolOrchestrator: IToolOrchestrator;
  private retrievalAugmentor?: IRetrievalAugmentor; // Optional

  private isInitialized: boolean = false;
  public readonly managerId: string;

  /**
   * Creates an instance of GMIManager.
   * @param {GMIManagerConfig} config - Configuration for the manager.
   * @param {ISubscriptionService} subscriptionService - Service for subscriptions.
   * @param {IAuthService} authService - Service for authentication.
   * @param {PrismaClient} prisma - Prisma client.
   * @param {ConversationManager} conversationManager - Conversation manager.
   * @param {IPromptEngine} promptEngine - Prompt engineering engine.
   * @param {AIModelProviderManager} llmProviderManager - LLM provider manager.
   * @param {IUtilityAI} utilityAI - Utility AI service.
   * @param {IToolOrchestrator} toolOrchestrator - Tool orchestrator.
   * @param {IRetrievalAugmentor} [retrievalAugmentor] - Optional RAG system.
   * @param {IPersonaLoader} [personaLoader] - Optional custom persona loader.
   */
  constructor(
    config: GMIManagerConfig,
    // GMIManager's own service dependencies:
    subscriptionService: ISubscriptionService,
    authService: IAuthService,
    prisma: PrismaClient,
    conversationManager: ConversationManager,
    // Dependencies to be passed to GMI instances:
    promptEngine: IPromptEngine,
    llmProviderManager: AIModelProviderManager,
    utilityAI: IUtilityAI,
    toolOrchestrator: IToolOrchestrator,
    retrievalAugmentor?: IRetrievalAugmentor,
    personaLoader?: IPersonaLoader,
  ) {
    this.managerId = `gmi-manager-${uuidv4()}`;
    if (!config || !config.personaLoaderConfig) {
      throw new GMIManagerError('Invalid GMIManager configuration: personaLoaderConfig is required.', GMIErrorCode.CONFIG_ERROR, { providedConfig: config });
    }
    this.config = {
      ...config,
      defaultGMIInactivityCleanupMinutes: config.defaultGMIInactivityCleanupMinutes ?? 60,
    };

    // Store GMIManager's own dependencies
    this.subscriptionService = subscriptionService;
    this.authService = authService;
    this.prisma = prisma;
    this.conversationManager = conversationManager;

    // Store dependencies for GMI's GMIBaseConfig
    this.promptEngine = promptEngine;
    this.llmProviderManager = llmProviderManager;
    this.utilityAI = utilityAI;
    this.toolOrchestrator = toolOrchestrator;
    this.retrievalAugmentor = retrievalAugmentor;

    this.personaLoader = personaLoader || new PersonaLoader();
    this.allPersonaDefinitions = new Map();
    this.activeGMIs = new Map();
    this.gmiSessionMap = new Map();

    this.validateGMIDependencies();
  }

  private validateGMIDependencies(): void {
    if (!this.subscriptionService) throw new GMIManagerError('ISubscriptionService dependency is missing.', GMIErrorCode.DEPENDENCY_ERROR, { service: 'ISubscriptionService'});
    if (!this.authService) throw new GMIManagerError('IAuthService dependency is missing.', GMIErrorCode.DEPENDENCY_ERROR, { service: 'IAuthService'});
    if (!this.prisma) throw new GMIManagerError('PrismaClient dependency is missing.', GMIErrorCode.DEPENDENCY_ERROR, { service: 'PrismaClient'});
    if (!this.conversationManager) throw new GMIManagerError('ConversationManager dependency is missing.', GMIErrorCode.DEPENDENCY_ERROR, { service: 'ConversationManager'});
    if (!this.promptEngine) throw new GMIManagerError('IPromptEngine dependency is missing.', GMIErrorCode.DEPENDENCY_ERROR, { service: 'IPromptEngine'});
    if (!this.llmProviderManager) throw new GMIManagerError('AIModelProviderManager dependency is missing.', GMIErrorCode.DEPENDENCY_ERROR, { service: 'AIModelProviderManager'});
    if (!this.utilityAI) throw new GMIManagerError('IUtilityAI dependency is missing.', GMIErrorCode.DEPENDENCY_ERROR, { service: 'IUtilityAI'});
    if (!this.toolOrchestrator) throw new GMIManagerError('IToolOrchestrator dependency is missing.', GMIErrorCode.DEPENDENCY_ERROR, { service: 'IToolOrchestrator'});
    // retrievalAugmentor is optional
  }


  /**
   * @inheritdoc
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.warn(`GMIManager (ID: ${this.managerId}) is already initialized. Re-initializing persona definitions.`);
      this.allPersonaDefinitions.clear();
    }

    try {
      await this.personaLoader.initialize(this.config.personaLoaderConfig);
      await this.loadAllPersonaDefinitions();
    } catch (error: any) {
      throw new GMIManagerError(
        `GMIManager (ID: ${this.managerId}) initialization failed during persona loading: ${error.message}`,
        GMIErrorCode.INITIALIZATION_FAILED,
        { underlyingError: error }
      );
    }

    this.isInitialized = true;
    console.log(`GMIManager (ID: ${this.managerId}) initialized. ${this.allPersonaDefinitions.size} persona definitions loaded.`);
  }

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new GMIManagerError(`GMIManager (ID: ${this.managerId}) is not initialized. Call initialize() first.`, GMIErrorCode.NOT_INITIALIZED);
    }
  }

  public async loadAllPersonaDefinitions(): Promise<void> {
    // No explicit ensureInitialized() here as it can be part of initialization itself.
    if (this.isInitialized) console.log(`GMIManager (ID: ${this.managerId}): Refreshing persona definitions...`);
    try {
      const loadedDefs = await this.personaLoader.loadAllPersonaDefinitions();
      this.allPersonaDefinitions.clear(); // Clear before repopulating
      loadedDefs.forEach(persona => {
        if (persona && persona.id) {
          this.allPersonaDefinitions.set(persona.id, persona);
        } else {
          console.warn(`GMIManager (ID: ${this.managerId}): Encountered an invalid persona definition (missing ID or null) during load. Skipping.`);
        }
      });
      console.log(`GMIManager (ID: ${this.managerId}): Successfully loaded/refreshed ${this.allPersonaDefinitions.size} persona definitions.`);
    } catch (error: any) {
      console.error(`GMIManager (ID: ${this.managerId}): Error loading persona definitions: ${error.message}`, error);
      throw new GMIManagerError(`Failed to load persona definitions: ${error.message}`, GMIErrorCode.PERSONA_LOAD_FAILED, error);
    }
  }

  public getPersonaDefinition(personaId: string): IPersonaDefinition | undefined {
    this.ensureInitialized();
    return this.allPersonaDefinitions.get(personaId);
  }

  public async listAvailablePersonas(userId?: string): Promise<Partial<IPersonaDefinition>[]> {
    this.ensureInitialized();
    let userTier: ISubscriptionTier | null = null;
    if (userId && userId !== 'anonymous_user') { // TODO: Define constant for anonymous_user
      userTier = await this.subscriptionService.getUserSubscriptionTier(userId);
    }

    const availablePersonas: Partial<IPersonaDefinition>[] = [];
    for (const persona of this.allPersonaDefinitions.values()) {
      let canAccess = persona.isPublic !== false; // Public by default
      if (persona.minSubscriptionTier) {
        if (!userTier) {
          canAccess = false;
        } else {
          const requiredTier = await this.subscriptionService.getTierByName(persona.minSubscriptionTier);
          if (!requiredTier || userTier.level < requiredTier.level) {
            canAccess = false;
          }
        }
      }
      // Add more complex access logic here if needed (e.g., direct user entitlements)

      if (canAccess) {
        availablePersonas.push(this.stripSensitivePersonaData(persona));
      }
    }
    return availablePersonas;
  }

  private stripSensitivePersonaData(persona: IPersonaDefinition): Partial<IPersonaDefinition> {
    const {
      baseSystemPrompt,
      defaultModelCompletionOptions,
      promptEngineConfigOverrides,
      embeddedTools, // Schemas might be large, definition of embedded tool itself is sensitive.
      metaPrompts,
      initialMemoryImprints,
      //Potentially sensitive parts of voiceConfig or avatarConfig if they contain keys/private URLs
      ...publicPersonaData
    } = persona;

    const stripped: Partial<IPersonaDefinition> = {
      ...publicPersonaData,
      toolIds: persona.toolIds, // Show what tools it *can* use by ID
      allowedCapabilities: persona.allowedCapabilities,
      // memoryConfig can be sensitive, only show high-level flags
      memoryConfig: persona.memoryConfig ? {
          enabled: persona.memoryConfig.enabled,
          ragConfig: persona.memoryConfig.ragConfig ? { enabled: persona.memoryConfig.ragConfig.enabled } : undefined,
          // Do not expose detailed dataSources or workingMemoryProcessing rules publicly
      } : undefined,
    };
    return stripped;
  }

  /**
   * Constructs the GMIBaseConfig for a new GMI instance.
   * @private
   */
  private assembleGMIBaseConfig(persona: IPersonaDefinition): GMIBaseConfig {
    // Create a new IWorkingMemory instance for this GMI
    // TODO: Use an IWorkingMemoryFactory based on persona or global config
    const workingMemory = new InMemoryWorkingMemory();

    return {
      workingMemory,
      promptEngine: this.promptEngine,
      llmProviderManager: this.llmProviderManager,
      utilityAI: this.utilityAI,
      toolOrchestrator: this.toolOrchestrator,
      retrievalAugmentor: this.retrievalAugmentor, // Can be undefined
      defaultLlmProviderId: persona.defaultModelCompletionOptions?.providerId || this.config.defaultGMIBaseConfigDefaults?.defaultLlmProviderId, // Hypothetical default path
      defaultLlmModelId: persona.defaultModelCompletionOptions?.modelId || this.config.defaultGMIBaseConfigDefaults?.defaultLlmModelId,
      customSettings: persona.customFields, // Pass persona's custom fields as GMI custom settings
    };
  }


  public async getOrCreateGMIForSession(
    userId: string,
    sessionId: string,
    requestedPersonaId: string,
    conversationIdInput?: string, // Optional: ID of an existing conversation to load
    // userApiKeys?: Record<string, string> // These are handled by UserAPIKeyManager for providers
  ): Promise<{ gmi: IGMI; conversationContext: ConversationContext }> {
    this.ensureInitialized();

    const personaDefinition = this.getPersonaDefinition(requestedPersonaId);
    if (!personaDefinition) {
      throw new GMIManagerError(`Persona '${requestedPersonaId}' not found.`, GMIErrorCode.PERSONA_NOT_FOUND, { requestedPersonaId });
    }

    // Access control based on subscription
    if (personaDefinition.minSubscriptionTier) {
        const userTier = userId !== 'anonymous_user' ? await this.subscriptionService.getUserSubscriptionTier(userId) : null;
        const requiredTier = await this.subscriptionService.getTierByName(personaDefinition.minSubscriptionTier);
        if (!requiredTier || !userTier || userTier.level < requiredTier.level) {
            throw new GMIManagerError(`Access denied: Persona '${requestedPersonaId}' requires tier '${personaDefinition.minSubscriptionTier}'.`, GMIErrorCode.PERMISSION_DENIED, { requestedPersonaId, userId });
        }
    }

    let gmiInstanceId = this.gmiSessionMap.get(sessionId);
    let gmi: IGMI | undefined = gmiInstanceId ? this.activeGMIs.get(gmiInstanceId) : undefined;

    // If GMI exists for session but persona changed, deactivate old and create new
    if (gmi && gmi.getPersona().id !== requestedPersonaId) {
      console.log(`GMIManager (ID: ${this.managerId}): Persona switch requested for session ${sessionId} from '${gmi.getPersona().id}' to '${requestedPersonaId}'. Recreating GMI instance.`);
      await this.deactivateGMIForSession(sessionId); // Deactivate GMI tied to this session
      gmi = undefined; // Force creation of new GMI
      gmiInstanceId = undefined; // Clear old instance ID
    }

    let conversationContext: ConversationContext;

    if (gmi && gmiInstanceId) { // GMI exists for session and persona matches
      console.log(`GMIManager (ID: ${this.managerId}): Reusing GMI instance ${gmiInstanceId} for session ${sessionId}.`);
      // Ensure conversation context is correctly associated or loaded
      // GMI's internal conversation history will be used/managed by GMI.processTurnStream
      // The GMIManager ensures the ConversationManager has the right context.
      conversationContext = await this.conversationManager.getOrCreateConversationContext(
        conversationIdInput, // Use provided ID if exists, else manager creates/gets based on session
        userId,
        sessionId,
        gmiInstanceId // Associate with existing GMI instance
      );
      // GMI itself doesn't take conversationContext in initialize, it manages its history internally
    } else { // Create new GMI instance
      const newGmiInstanceId = `gmi-instance-${uuidv4()}`;
      console.log(`GMIManager (ID: ${this.managerId}): Creating new GMI instance ${newGmiInstanceId} for session ${sessionId} with persona ${requestedPersonaId}.`);

      const completeGMIBaseConfig = this.assembleGMIBaseConfig(personaDefinition);
      gmi = new GMI(newGmiInstanceId); // GMI constructor now only takes optional ID

      try {
        await gmi.initialize(personaDefinition, completeGMIBaseConfig);
      } catch (error: any) {
        throw new GMIManagerError(`Failed to initialize new GMI instance ${newGmiInstanceId}: ${error.message}`, GMIErrorCode.INITIALIZATION_FAILED, { underlyingError: error, newGmiInstanceId });
      }

      this.activeGMIs.set(newGmiInstanceId, gmi);
      this.gmiSessionMap.set(sessionId, newGmiInstanceId);

      conversationContext = await this.conversationManager.getOrCreateConversationContext(
        conversationIdInput, userId, sessionId, newGmiInstanceId
      );
    }
    
    // Ensure ConversationContext metadata is accurate for this interaction
    // This assumes ConversationContext has these mutable properties or a method to update them.
    // This logic might better sit in the service layer that calls GMIManager.
    // For now, we update it here.
    if(conversationContext.userId !== userId) conversationContext.userId = userId;
    if(conversationContext.sessionId !== sessionId) conversationContext.sessionId = sessionId;
    if(conversationContext.gmiInstanceId !== gmi.gmiId) conversationContext.gmiInstanceId = gmi.gmiId;
    if(conversationContext.activePersonaId !== gmi.getPersona().id) conversationContext.activePersonaId = gmi.getPersona().id;
    // await this.conversationManager.saveConversationContext(conversationContext); // If changes need saving

    return { gmi, conversationContext };
  }

  public getGMIByInstanceId(gmiInstanceId: string): IGMI | undefined {
    this.ensureInitialized();
    return this.activeGMIs.get(gmiInstanceId);
  }

  public async deactivateGMIForSession(sessionId: string): Promise<boolean> {
    this.ensureInitialized();
    const gmiInstanceId = this.gmiSessionMap.get(sessionId);
    if (!gmiInstanceId) return false;

    const gmi = this.activeGMIs.get(gmiInstanceId);
    if (gmi) {
      console.log(`GMIManager (ID: ${this.managerId}): Deactivating GMI instance ${gmiInstanceId} for session ${sessionId}.`);
      try {
        await gmi.shutdown(); // Use GMI's shutdown method
      } catch (error: any) {
        console.error(`GMIManager (ID: ${this.managerId}): Error during gmi.shutdown() for GMI ${gmiInstanceId}: ${error.message}`, error);
        // Still proceed to remove from maps to prevent reuse of a potentially broken GMI
      } finally {
        this.activeGMIs.delete(gmiInstanceId);
        this.gmiSessionMap.delete(sessionId);
        console.log(`GMIManager (ID: ${this.managerId}): GMI instance ${gmiInstanceId} (session ${sessionId}) deactivated.`);
      }
      return true;
    } else {
      this.gmiSessionMap.delete(sessionId); // Clean up map inconsistency
      return false;
    }
  }

  public async cleanupInactiveGMIs(inactivityThresholdMinutes?: number): Promise<number> {
    this.ensureInitialized();
    const threshold = inactivityThresholdMinutes ?? this.config.defaultGMIInactivityCleanupMinutes!;
    console.log(`GMIManager (ID: ${this.managerId}): Starting cleanup of GMIs inactive for over ${threshold} minutes.`);
    let cleanedUpCount = 0;
    const now = Date.now();
    const thresholdMs = threshold * 60 * 1000;

    const sessionIdsSnapshot = Array.from(this.gmiSessionMap.keys());

    for (const sessionId of sessionIdsSnapshot) {
      const gmiInstanceId = this.gmiSessionMap.get(sessionId);
      if (!gmiInstanceId) continue;

      const gmi = this.activeGMIs.get(gmiInstanceId);
      if (!gmi) continue; // Should not happen if maps are consistent

      try {
        // Get the conversation ID associated with this GMI instance.
        // This assumes a GMI is primarily tied to one "main" conversation for its session activity.
        // If ConversationManager stores last activity per GMI instance or Session ID directly, that's better.
        // For now, we query ConversationManager based on what it knows about the session.
        const contexts = await this.conversationManager.listContextsForSession(sessionId);
        let lastActivityOverall = 0;
        if (contexts.length > 0) {
            // Find the most recent activity across all conversations tied to the session
            for (const ctx of contexts) {
                const lastActiveTimestamp = await this.conversationManager.getLastActiveTimeForConversation(ctx.id);
                if (lastActiveTimestamp && lastActiveTimestamp > lastActivityOverall) {
                    lastActivityOverall = lastActiveTimestamp;
                }
            }
        } else {
            // No conversation contexts found for the session; consider GMI creation time or a grace period.
            // This GMI might be idle since creation.
            lastActivityOverall = gmi.creationTimestamp.getTime(); // Fallback to creation time.
        }


        if (lastActivityOverall > 0 && (now - lastActivityOverall > thresholdMs)) {
          console.log(`GMIManager (ID: ${this.managerId}): GMI ${gmiInstanceId} (session ${sessionId}) inactive since ${new Date(lastActivityOverall).toISOString()}. Deactivating.`);
          await this.deactivateGMIForSession(sessionId);
          cleanedUpCount++;
        }
      } catch (error: any) {
        console.error(`GMIManager (ID: ${this.managerId}): Error processing GMI ${gmiInstanceId} for session ${sessionId} during cleanup: ${error.message}`, error);
      }
    }

    console.log(`GMIManager (ID: ${this.managerId}): Cleanup finished. ${cleanedUpCount} inactive GMI instances deactivated.`);
    return cleanedUpCount;
  }

  public async shutdown(): Promise<void> {
    console.log(`GMIManager (ID: ${this.managerId}): Initiating shutdown. Deactivating all active GMIs...`);
    this.isInitialized = false;

    const sessionIdsToDeactivate = Array.from(this.gmiSessionMap.keys());
    for (const sessionId of sessionIdsToDeactivate) {
      try {
        await this.deactivateGMIForSession(sessionId);
      } catch (error: any) {
        console.error(`GMIManager (ID: ${this.managerId}): Error deactivating GMI for session ${sessionId} during manager shutdown: ${error.message}`, error);
      }
    }
    this.activeGMIs.clear();
    this.gmiSessionMap.clear();
    this.allPersonaDefinitions.clear();
    console.log(`GMIManager (ID: ${this.managerId}): Shutdown complete.`);
  }
}

// Placeholder for hypothetical defaultGMIBaseConfigDefaults in GMIManagerConfig if used.
declare module './GMIManager' { // Using module augmentation if these defaults are truly static parts of config
    interface GMIManagerConfig {
        defaultGMIBaseConfigDefaults?: Partial<Pick<GMIBaseConfig, 'defaultLlmProviderId' | 'defaultLlmModelId' | 'customSettings'>>;
    }
}