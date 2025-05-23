/**
 * @fileoverview This file implements the GMIManager (Generalized Mind Instance Manager),
 * a crucial component in AgentOS responsible for the lifecycle management of GMIs.
 *
 * The GMIManager orchestrates the creation, retrieval, activation, and deactivation
 * of GMI instances. It leverages a PersonaLoader to load persona definitions,
 * which are then used to configure GMIs. It also manages GMI sessions, ensuring
 * that users interact with consistent GMI states across multiple turns.
 *
 * Key responsibilities include:
 * - Loading and providing access to all available persona definitions.
 * - Instantiating new GMI instances with appropriate base configurations and dependencies.
 * - Reusing existing GMI instances for ongoing sessions to maintain context.
 * - Handling persona switching within a GMI instance.
 * - Managing conversation contexts in conjunction with a ConversationManager.
 * - Enforcing access controls based on user subscriptions and persona requirements.
 * - Cleaning up inactive GMI instances to conserve resources.
 * - Providing a centralized point for GMI lifecycle operations.
 *
 * @module backend/agentos/cognitive_substrate/GMIManager
 */

import { v4 as uuidv4 } from 'uuid';
import { IGMI, GMIBaseConfig, GMIOutput } from './IGMI'; // GMIOutput might be used in future extensions of GMIManager
import { GMI } from './GMI';
import { IPersonaDefinition } from './personas/IPersonaDefinition';
import { IPersonaLoader, PersonaLoaderConfig } from './personas/IPersonaLoader';
import { PersonaLoader } from './personas/PersonaLoader'; // Assuming basic FileSystem PersonaLoader
import { IAuthService } from '../../services/user_auth/AuthService';
import { ISubscriptionService, ISubscriptionTier } from '../../services/user_auth/SubscriptionService';
import { IWorkingMemory } from './memory/IWorkingMemory';
import { InMemoryWorkingMemory } from './memory/InMemoryWorkingMemory'; // Default if no other specified
// Consider an IWorkingMemoryFactory if different types of memory are needed per GMI.
import { ConversationManager } from '../core/conversation/ConversationManager';
import { ConversationContext } from '../core/conversation/ConversationContext';
import { PrismaClient } from '@prisma/client';

/**
 * Custom error class for GMIManager-specific operational errors.
 * @class GMIManagerError
 * @extends {Error}
 */
export class GMIManagerError extends Error {
  /**
   * The specific error code for this GMIManager error.
   * @type {string}
   */
  public readonly code: string;
  /**
   * Optional additional details or context for the error.
   * @type {any}
   * @optional
   */
  public readonly details?: any;

  /**
   * Creates an instance of GMIManagerError.
   * @param {string} message - The human-readable error message.
   * @param {string} code - A GMIManager-specific error code.
   * @param {any} [details] - Optional additional context or the underlying error.
   */
  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = 'GMIManagerError';
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, GMIManagerError.prototype);
  }
}


/**
 * Configuration options for the GMIManager.
 * @interface GMIManagerConfig
 */
export interface GMIManagerConfig {
  /**
   * Configuration for the PersonaLoader, specifying how and where to load persona definitions.
   * @example { personaSource: "./path/to/persona/definitions", loaderType: "file_system" }
   * @type {PersonaLoaderConfig}
   */
  personaLoaderConfig: PersonaLoaderConfig;

  /**
   * Default base configuration that will be passed to newly created GMI instances.
   * This should include shared dependencies like `providerManager`, `promptEngine`, etc.
   * The GMIManager will augment this with GMI-specific dependencies like `prisma`,
   * `authService`, `subscriptionService`, and `conversationManager` from its own injected dependencies.
   * @type {Omit<GMIBaseConfig, 'prisma' | 'authService' | 'subscriptionService' | 'conversationManager'>}
   */
  defaultGMIBaseConfig: Omit<GMIBaseConfig, 'prisma' | 'authService' | 'subscriptionService' | 'conversationManager'>;
  // Prisma etc. are injected directly into GMIManager and then passed to GMIBaseConfig.

  /**
   * Optional: Default inactivity threshold in minutes for GMI cleanup.
   * If a GMI (identified by its session) has no activity for this duration,
   * it becomes a candidate for deactivation by `cleanupInactiveGMIs`.
   * @type {number}
   * @optional
   * @default 60
   */
  defaultGMIInactivityCleanupMinutes?: number;
}

/**
 * Manages the lifecycle of Generalized Mind Instances (GMIs).
 * It loads persona definitions, instantiates GMIs, handles session management,
 * and enforces access control based on user subscriptions.
 *
 * @class GMIManager
 */
export class GMIManager {
  private config: GMIManagerConfig;
  private personaLoader: IPersonaLoader;
  private allPersonaDefinitions: Map<string, IPersonaDefinition>; // Cache of all loaded personas
  private activeGMIs: Map<string, IGMI>; // Maps GMI Instance ID (session-bound) to GMI object
  private gmiSessionMap: Map<string, string>; // Maps external sessionId to internal GMI Instance ID

  // Injected Services
  private authService: IAuthService;
  private subscriptionService: ISubscriptionService;
  private prisma: PrismaClient;
  private conversationManager: ConversationManager;

  private isInitialized: boolean = false;

  /**
   * Creates an instance of GMIManager.
   * The manager is not fully operational until `initialize()` is called.
   *
   * @param {GMIManagerConfig} config - Configuration for the manager.
   * @param {ISubscriptionService} subscriptionService - Service for managing subscriptions and entitlements.
   * @param {IAuthService} authService - Service for authentication and user API keys.
   * @param {PrismaClient} prisma - The Prisma client instance for database operations.
   * @param {ConversationManager} conversationManager - Manager for conversation contexts.
   * @param {IPersonaLoader} [personaLoader] - Optional pre-configured persona loader. If not provided, a default FileSystem PersonaLoader will be instantiated.
   */
  constructor(
    config: GMIManagerConfig,
    subscriptionService: ISubscriptionService,
    authService: IAuthService,
    prisma: PrismaClient,
    conversationManager: ConversationManager,
    personaLoader?: IPersonaLoader // Allow injecting a specific loader
  ) {
    if (!config || !config.defaultGMIBaseConfig || !config.personaLoaderConfig) {
        throw new GMIManagerError('Invalid GMIManager configuration: defaultGMIBaseConfig and personaLoaderConfig are required.', 'GMM_CONSTRUCTOR_INVALID_CONFIG');
    }
    if (!subscriptionService || !authService || !prisma || !conversationManager) {
        throw new GMIManagerError('Invalid GMIManager constructor arguments: All service dependencies are required.', 'GMM_CONSTRUCTOR_MISSING_DEPS');
    }

    this.config = {
        ...config,
        defaultGMIInactivityCleanupMinutes: config.defaultGMIInactivityCleanupMinutes ?? 60,
    };
    this.subscriptionService = subscriptionService;
    this.authService = authService;
    this.prisma = prisma;
    this.conversationManager = conversationManager;

    this.personaLoader = personaLoader || new PersonaLoader(); // Use injected or default
    this.allPersonaDefinitions = new Map();
    this.activeGMIs = new Map();
    this.gmiSessionMap = new Map();
  }

  /**
   * Initializes the GMIManager. This includes initializing the PersonaLoader
   * and loading all persona definitions. This method must be called before
   * the GMIManager can be used to create or manage GMIs.
   *
   * @async
   * @returns {Promise<void>}
   * @throws {GMIManagerError} If initialization fails (e.g., persona loading error).
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.warn('GMIManager is already initialized. Re-initializing may reload personas.');
      // Potentially clear existing state if re-initialization implies a reset
      this.allPersonaDefinitions.clear();
      // Active GMIs are not cleared here as they represent ongoing sessions.
      // A more sophisticated re-init might reconcile active GMIs with new persona defs.
    }

    try {
      await this.personaLoader.initialize(this.config.personaLoaderConfig);
      await this.loadAllPersonaDefinitions(); // Initial load
    } catch (error: any) {
      throw new GMIManagerError(
        `GMIManager initialization failed during persona loading: ${error.message}`,
        'GMM_INIT_PERSONA_LOAD_FAILED',
        error
      );
    }

    this.isInitialized = true;
    // console.log(`GMIManager initialized successfully. ${this.allPersonaDefinitions.size} persona definitions loaded.`);
  }

  /**
   * Ensures that the GMIManager has been properly initialized.
   * @private
   * @throws {GMIManagerError} If not initialized.
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new GMIManagerError(
        'GMIManager is not initialized. Call initialize() first.',
        'GMM_NOT_INITIALIZED'
      );
    }
  }

  /**
   * Loads (or reloads) all persona definitions using the configured PersonaLoader
   * and caches them internally.
   * @async
   * @returns {Promise<void>}
   * @throws {GMIManagerError} If persona loading fails.
   */
  public async loadAllPersonaDefinitions(): Promise<void> {
    // No explicit ensureInitialized() here, as this can be part of initialization itself.
    // However, if called externally post-init, initialization state should be valid.
    if (this.isInitialized) {
        // console.log("GMIManager: Refreshing persona definitions...");
    }
    try {
      const loadedDefs = await this.personaLoader.loadAllPersonaDefinitions();
      this.allPersonaDefinitions.clear();
      loadedDefs.forEach(persona => {
        if (persona && persona.id) {
          this.allPersonaDefinitions.set(persona.id, persona);
        } else {
          console.warn('GMIManager: Encountered an invalid persona definition (missing ID) during load. Skipping.');
        }
      });
      // console.log(`GMIManager: Successfully loaded/refreshed ${this.allPersonaDefinitions.size} persona definitions.`);
    } catch (error: any) {
      // Log the error but rethrow as a GMIManagerError to provide consistent error handling from this class.
      console.error(`GMIManager: Error loading persona definitions: ${error.message}`, error);
      throw new GMIManagerError(
        `Failed to load persona definitions: ${error.message}`,
        'GMM_PERSONA_LOAD_FAILURE',
        error
      );
    }
  }

  /**
   * Retrieves a cached persona definition by its ID.
   * @param {string} personaId - The ID of the persona.
   * @returns {IPersonaDefinition | undefined} The persona definition if found, otherwise undefined.
   */
  public getPersonaDefinition(personaId: string): IPersonaDefinition | undefined {
    this.ensureInitialized();
    return this.allPersonaDefinitions.get(personaId);
  }

  /**
   * Lists all available persona definitions, optionally filtering by user access.
   * Sensitive details (like full system prompts) are stripped from the returned definitions.
   *
   * @async
   * @param {string} [userId] - Optional. If provided, filters personas based on user's subscription tier
   * and persona's `minSubscriptionTier` and `isPublic` properties.
   * @returns {Promise<Partial<IPersonaDefinition>[]>} An array of partial persona definitions (metadata only).
   */
  public async listAvailablePersonas(userId?: string): Promise<Partial<IPersonaDefinition>[]> {
    this.ensureInitialized();
    let userTier: ISubscriptionTier | null = null;
    if (userId && userId !== 'anonymous_user') { // Assuming 'anonymous_user' is a special ID for unauthenticated
      userTier = await this.subscriptionService.getUserSubscriptionTier(userId);
    }

    const availablePersonas: Partial<IPersonaDefinition>[] = [];
    for (const persona of this.allPersonaDefinitions.values()) {
      let canAccess = persona.isPublic !== false; // Public by default if isPublic is undefined or true

      if (persona.minSubscriptionTier) {
        if (!userTier) { // User is anonymous or tier couldn't be fetched, and persona requires a tier
          canAccess = false;
        } else {
          const requiredTier = await this.subscriptionService.getTierByName(persona.minSubscriptionTier);
          if (!requiredTier || userTier.level < requiredTier.level) {
            canAccess = false;
          }
        }
      }
      // If persona.isPublic is explicitly false, it's not accessible unless other conditions met (e.g. ownership, specific grants - not implemented here)
      if (persona.isPublic === false && !persona.minSubscriptionTier) { // Private persona without specific tier access
          // Add more complex logic here if needed, e.g. checking user's direct entitlements to this persona
          // For now, if private and no tier, only accessible if userTier check above somehow grants it (which it wouldn't).
          // Essentially, isPublic:false without minSubscriptionTier means it's admin/owner only by default.
          // This example assumes tier matching is the primary way to access non-public personas.
      }


      if (canAccess) {
        availablePersonas.push(this.stripSensitivePersonaData(persona));
      }
    }
    return availablePersonas;
  }

  /**
   * Gets an existing GMI instance or creates a new one for a given user session and requested persona.
   * This method is central to managing GMI lifecycles and ensuring contextual continuity.
   * It handles GMI reuse, persona activation, and the loading or creation of associated
   * conversation contexts and working memories.
   *
   * @async
   * @param {string} userId - The ID of the user. For anonymous users, a consistent anonymous ID should be used.
   * @param {string} sessionId - A unique ID for the current user's session. This is the primary key for GMI instance management.
   * @param {string} requestedPersonaId - The ID of the persona to be activated for this GMI.
   * @param {string | undefined} conversationId - Optional ID of an existing conversation to load. If undefined, a new conversation context will be created.
   * @param {Record<string, string>} [userApiKeys] - Optional: User-provided API keys for LLM providers.
   * @returns {Promise<{gmi: IGMI, conversationContext: ConversationContext}>} An object containing the GMI instance and its associated ConversationContext.
   * @throws {GMIManagerError} If the requested persona is not found, access is denied due to subscription tier,
   * or if GMI or its dependencies (memory, context) fail to initialize.
   */
  public async getOrCreateGMIForSession(
    userId: string,
    sessionId: string,
    requestedPersonaId: string,
    conversationId?: string, // Can be undefined for a new conversation
    userApiKeys?: Record<string, string> // Not directly used by GMI/Manager config, but passed to GMI for calls
  ): Promise<{gmi: IGMI, conversationContext: ConversationContext}> {
    this.ensureInitialized();

    const personaDefinition = this.getPersonaDefinition(requestedPersonaId);
    if (!personaDefinition) {
      throw new GMIManagerError(
        `Persona '${requestedPersonaId}' not found. Cannot create or retrieve GMI.`,
        'GMM_PERSONA_NOT_FOUND',
        { requestedPersonaId }
      );
    }

    // Access control check based on subscription tier
    if (personaDefinition.minSubscriptionTier) {
      let userTier: ISubscriptionTier | null = null;
      if (userId !== 'anonymous_user') { // Implement proper anonymous user handling
        userTier = await this.subscriptionService.getUserSubscriptionTier(userId);
      }
      const requiredTier = await this.subscriptionService.getTierByName(personaDefinition.minSubscriptionTier);
      if (!requiredTier || !userTier || userTier.level < requiredTier.level) {
        throw new GMIManagerError(
          `Access denied: Persona '${requestedPersonaId}' requires subscription tier '${personaDefinition.minSubscriptionTier}' (level ${requiredTier?.level || 'N/A'}). User tier is '${userTier?.id || 'None'}' (level ${userTier?.level ?? 'N/A'}).`,
          'GMM_ACCESS_DENIED_TIER',
          { requestedPersonaId, requiredTierName: personaDefinition.minSubscriptionTier, userId, userTierName: userTier?.id }
        );
      }
    }

    let gmiInstanceId = this.gmiSessionMap.get(sessionId);
    let gmi: IGMI;
    let currentConversationContext: ConversationContext;
    let gmiBaseConfig = this.prepareGMIBaseConfig();


    if (gmiInstanceId && this.activeGMIs.has(gmiInstanceId)) {
      gmi = this.activeGMIs.get(gmiInstanceId)!;
      // console.log(`GMIManager: Reusing GMI instance ${gmiInstanceId} for session ${sessionId}.`);

      // Load or continue the conversation context.
      // The GMI already has a conversationContext instance; we ensure it's the correct one.
      // If conversationId is provided and different from gmi.conversationContext.id, it's a switch/load scenario.
      if (conversationId && gmi.conversationContext.id !== conversationId) {
          // This implies loading a different conversation into an existing GMI session.
          // This might require careful state management in GMI or a new GMI instance.
          // For simplicity now, we assume getOrCreateConversationContext handles finding or making the right one.
          // And if the GMI is being reused, its internal context should align or be updated.
          currentConversationContext = await this.conversationManager.getOrCreateConversationContext(
              conversationId, userId, sessionId, gmi.instanceId
          );
          // If context changed, GMI needs to be made aware.
          // GMI.initialize might be too heavy; perhaps a specific method GMI.setContext()
          // For now, we re-assign it. GMI's initialize uses the passed context.
          gmi.conversationContext = currentConversationContext;
      } else {
          currentConversationContext = gmi.conversationContext; // Use existing context
      }


      // If the GMI is active but needs to switch personas
      if (gmi.getCurrentPrimaryPersonaId() !== requestedPersonaId) {
        // console.log(`GMIManager: GMI ${gmiInstanceId} switching from persona ${gmi.getCurrentPrimaryPersonaId()} to ${requestedPersonaId}.`);
        try {
          await gmi.activatePersona(requestedPersonaId);
        } catch (error: any) {
          throw new GMIManagerError(
            `Failed to switch persona to '${requestedPersonaId}' on existing GMI ${gmiInstanceId}: ${error.message}`,
            'GMM_PERSONA_SWITCH_FAILED',
            { error, gmiInstanceId, targetPersonaId: requestedPersonaId }
          );
        }
      }
    } else {
      // Create a new GMI instance
      const newGmiInstanceId = uuidv4(); // This ID is for the GMI *instance*
      // console.log(`GMIManager: Creating new GMI instance ${newGmiInstanceId} for session ${sessionId} with persona ${requestedPersonaId}.`);

      // Create or load the conversation context *before* GMI initialization
      currentConversationContext = await this.conversationManager.getOrCreateConversationContext(
        conversationId, // If undefined, ConversationManager creates a new one
        userId,
        sessionId,
        newGmiInstanceId // Associate context with the new GMI instance ID
      );

      // Create working memory for the new GMI.
      // TODO: Implement IWorkingMemoryFactory for different memory types.
      const workingMemory: IWorkingMemory = new InMemoryWorkingMemory(); // Instance ID is set during IWorkingMemory.initialize

      gmi = new GMI(newGmiInstanceId, gmiBaseConfig);

      try {
        await gmi.initialize(
          personaDefinition,
          Array.from(this.allPersonaDefinitions.values()),
          workingMemory,
          currentConversationContext
        );
      } catch (error: any) {
        // Clean up potentially created context if GMI init fails.
        // await this.conversationManager.deleteConversationContext(currentConversationContext.id); // Requires careful thought.
        throw new GMIManagerError(
          `Failed to initialize new GMI instance ${newGmiInstanceId}: ${error.message}`,
          'GMM_GMI_INIT_FAILED',
          { error, newGmiInstanceId }
        );
      }

      this.activeGMIs.set(newGmiInstanceId, gmi);
      this.gmiSessionMap.set(sessionId, newGmiInstanceId);
    }

    // Ensure context metadata is up-to-date
    currentConversationContext.userId = userId;
    currentConversationContext.sessionId = sessionId;
    currentConversationContext.gmiInstanceId = gmi.instanceId;
    currentConversationContext.activePersonaId = gmi.getCurrentPrimaryPersonaId(); // Reflects current persona in GMI

    return { gmi, conversationContext: currentConversationContext };
  }


  /**
   * Retrieves an active GMI instance directly by its unique instance ID.
   * This is typically used by internal system components that operate on GMI instances directly.
   * @param {string} gmiInstanceId - The unique ID of the GMI instance.
   * @returns {IGMI | undefined} The GMI instance if active, otherwise undefined.
   */
  public getGMIByInstanceId(gmiInstanceId: string): IGMI | undefined {
    this.ensureInitialized();
    return this.activeGMIs.get(gmiInstanceId);
  }

  /**
   * Deactivates and removes a GMI instance associated with a given session ID.
   * This involves:
   * 1. Retrieving the GMI instance ID from the session map.
   * 2. Calling the GMI's `close()` method to release its resources (e.g., working memory connections).
   * 3. Removing the GMI from the active pool and session map.
   *
   * This method should be called when a user session ends or becomes inactive for a prolonged period.
   *
   * @async
   * @param {string} sessionId - The session ID whose associated GMI instance is to be deactivated.
   * @returns {Promise<boolean>} True if a GMI was found for the session and successfully deactivated, false otherwise.
   * @throws {GMIManagerError} If errors occur during GMI deactivation (e.g., GMI.close() fails).
   */
  public async deactivateGMIForSession(sessionId: string): Promise<boolean> {
    this.ensureInitialized();
    const gmiInstanceId = this.gmiSessionMap.get(sessionId);
    if (!gmiInstanceId) {
      // console.warn(`GMIManager: No active GMI found for session ${sessionId} to deactivate.`);
      return false;
    }

    const gmi = this.activeGMIs.get(gmiInstanceId);
    if (gmi) {
      // console.log(`GMIManager: Deactivating GMI instance ${gmiInstanceId} for session ${sessionId}.`);
      try {
        // Future: Consider snapshotting GMI state before closing if persistence is desired.
        // const snapshot = await gmi.createSnapshot();
        // await this.saveGMISnapshot(snapshot); // Example persistence step

        await gmi.close(); // Allow GMI to release its internal resources
      } catch (error: any) {
        console.error(`GMIManager: Error during gmi.close() for GMI ${gmiInstanceId}: ${error.message}`, error);
        // Decide if this error should prevent removal from maps. For now, proceed with cleanup.
        // throw new GMIManagerError(`Error deactivating GMI ${gmiInstanceId}: ${error.message}`, 'GMM_GMI_CLOSE_FAILED', error);
      } finally {
        this.activeGMIs.delete(gmiInstanceId);
        this.gmiSessionMap.delete(sessionId);
        // console.log(`GMIManager: GMI instance ${gmiInstanceId} (session ${sessionId}) deactivated and removed from active pool.`);
      }
      return true;
    } else {
      // Inconsistency: gmiInstanceId was in sessionMap but not in activeGMIs.
      console.warn(`GMIManager: GMI instance ID ${gmiInstanceId} (from session ${sessionId}) not found in activeGMIs map. Removing from session map.`);
      this.gmiSessionMap.delete(sessionId);
      return false;
    }
  }

  /**
   * Periodically cleans up inactive GMI instances to conserve resources.
   * An GMI is considered inactive if its associated conversation context has not been
   * updated within the `inactivityThresholdMinutes`.
   *
   * @async
   * @param {number} [inactivityThresholdMinutes] - GMIs inactive for longer than this duration (in minutes)
   * will be deactivated. Defaults to `config.defaultGMIInactivityCleanupMinutes`.
   * @returns {Promise<number>} The number of GMI instances that were cleaned up.
   */
  public async cleanupInactiveGMIs(inactivityThresholdMinutes?: number): Promise<number> {
    this.ensureInitialized();
    const threshold = inactivityThresholdMinutes ?? this.config.defaultGMIInactivityCleanupMinutes!;
    // console.log(`GMIManager: Starting cleanup of GMIs inactive for over ${threshold} minutes.`);

    let cleanedUpCount = 0;
    const now = Date.now();
    const thresholdMs = threshold * 60 * 1000;

    // Iterate over a copy of session IDs to avoid modification issues during iteration
    const sessionIdsSnapshot = Array.from(this.gmiSessionMap.keys());

    for (const sessionId of sessionIdsSnapshot) {
      const gmiInstanceId = this.gmiSessionMap.get(sessionId); // Re-fetch in case it was removed by another process
      if (!gmiInstanceId) continue;

      const gmi = this.activeGMIs.get(gmiInstanceId);
      if (!gmi) continue;

      try {
        // Use ConversationContext's last activity time as the primary indicator.
        const lastActiveTimestamp = await this.conversationManager.getLastActiveTimeForConversation(gmi.conversationContext.id);

        if (lastActiveTimestamp && (now - lastActiveTimestamp > thresholdMs)) {
          // console.log(`GMIManager cleanup: GMI ${gmiInstanceId} (session ${sessionId}, conversation ${gmi.conversationContext.id}) is inactive since ${new Date(lastActiveTimestamp).toISOString()}. Deactivating.`);
          await this.deactivateGMIForSession(sessionId); // Use session ID for deactivation
          cleanedUpCount++;
        } else if (!lastActiveTimestamp) {
          // console.warn(`GMIManager cleanup: Could not retrieve last active time for conversation ${gmi.conversationContext.id} (GMI ${gmiInstanceId}). Assuming it might be active or recently created.`);
          // Consider a default creation time or a grace period if lastActiveTimestamp is null for newly created contexts.
        }
      } catch (error: any) {
        console.error(`GMIManager cleanup: Error processing GMI ${gmiInstanceId} for session ${sessionId}: ${error.message}`, error);
      }
    }

    if (cleanedUpCount > 0) {
      // console.log(`GMIManager: Cleaned up ${cleanedUpCount} inactive GMI instances.`);
    } else {
      // console.log(`GMIManager: No inactive GMIs found for cleanup based on the ${threshold} minute threshold.`);
    }
    return cleanedUpCount;
  }

  /**
   * Prepares the GMIBaseConfig by combining the default configuration with
   * manager-injected dependencies.
   * @private
   * @returns {GMIBaseConfig} The fully prepared base configuration for a GMI.
   */
  private prepareGMIBaseConfig(): GMIBaseConfig {
    // Ensures that GMI instances receive all necessary shared services.
    return {
      ...this.config.defaultGMIBaseConfig, // Spread defaults first
      prisma: this.prisma,                 // Add/override with manager's instances
      authService: this.authService,
      subscriptionService: this.subscriptionService,
      conversationManager: this.conversationManager,
      // providerManager, promptEngine, toolExecutor, modelRouter are already in defaultGMIBaseConfig
    };
  }

  /**
   * Helper to strip sensitive or overly detailed data from persona definitions
   * before exposing them (e.g., in a public list of available personas).
   * This is crucial for security and for keeping API responses concise.
   * @private
   * @param {IPersonaDefinition} persona - The full persona definition.
   * @returns {Partial<IPersonaDefinition>} A copy with sensitive/large fields removed or summarized.
   */
  private stripSensitivePersonaData(persona: IPersonaDefinition): Partial<IPersonaDefinition> {
    // Create a new object with only the desired publicly exposable fields.
    const {
      // Fields to OMIT from public listing:
      baseSystemPrompt,
      defaultModelCompletionOptions,
      // modelTargetPreferences, // Might be okay to show high-level preferences, but not detailed costs
      promptEngineConfigOverrides,
      embeddedTools, // Definitions can be large and reveal implementation
      metaPrompts, // Internal reasoning details
      initialMemoryImprints, // Potentially sensitive initial state

      // Fields to INCLUDE (or summarize):
      ...publicPersonaData
    } = persona;

    // Optionally, summarize or transform some fields instead of omitting entirely
    const stripped: Partial<IPersonaDefinition> = {
      ...publicPersonaData, // Includes id, name, description, version, etc.
      // Example of summarizing a complex field:
      toolIds: persona.toolIds, // Just the IDs, not full definitions.
      allowedCapabilities: persona.allowedCapabilities,
      strengths: persona.strengths,
      // Ensure memoryConfig, if exposed, doesn't leak sensitive details of dataSources
      memoryConfig: persona.memoryConfig ? {
          enabled: persona.memoryConfig.enabled,
          ragConfig: persona.memoryConfig.ragConfig ? {
              enabled: persona.memoryConfig.ragConfig.enabled,
              defaultRetrievalStrategy: persona.memoryConfig.ragConfig.defaultRetrievalStrategy,
              dataSources: persona.memoryConfig.ragConfig.dataSources?.map(ds => ({ id: ds.id, isEnabled: ds.isEnabled, displayName: ds.displayName, priority: ds.priority})), // only names/ids
          } : undefined,
      } : undefined,
    };
    return stripped;
  }

  /**
   * Shuts down the GMIManager, deactivating all active GMIs and releasing resources.
   * This should be called during application graceful shutdown.
   * @async
   * @returns {Promise<void>}
   */
  public async shutdown(): Promise<void> {
    // console.log('GMIManager: Initiating shutdown. Deactivating all active GMIs...');
    this.isInitialized = false; // Prevent further operations

    const sessionIdsToDeactivate = Array.from(this.gmiSessionMap.keys());
    for (const sessionId of sessionIdsToDeactivate) {
      try {
        await this.deactivateGMIForSession(sessionId);
      } catch (error: any) {
        console.error(`GMIManager: Error deactivating GMI for session ${sessionId} during shutdown: ${error.message}`, error);
      }
    }
    this.activeGMIs.clear();
    this.gmiSessionMap.clear();
    this.allPersonaDefinitions.clear();

    // console.log('GMIManager: All active GMIs processed. Shutdown complete.');
  }
}