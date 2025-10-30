/**
 * @fileoverview This file implements the GMIManager (Generalized Mind Instance Manager),
 * a crucial component in AgentOS responsible for the lifecycle management of GMIs.
 * (Existing JSDoc comments retained)
 * @module backend/agentos/cognitive_substrate/GMIManager
 */

import { v4 as uuidv4 } from 'uuid';
import { IGMI, GMIBaseConfig, UserContext, ReasoningEntryType } from './IGMI';
import { GMI } from './GMI';
import { IPersonaDefinition } from './personas/IPersonaDefinition';
import { IPersonaLoader, PersonaLoaderConfig } from './personas/IPersonaLoader';
import { PersonaLoader } from './personas/PersonaLoader';
import type { IAuthService, ISubscriptionService, ISubscriptionTier } from '../services/user_auth/types';
import { IWorkingMemory } from './memory/IWorkingMemory';
import { InMemoryWorkingMemory } from './memory/InMemoryWorkingMemory';
import { ConversationManager } from '../core/conversation/ConversationManager';
import { ConversationContext } from '../core/conversation/ConversationContext'; // Assuming this is the correct class
import { PrismaClient } from '@prisma/client';
import { GMIError, GMIErrorCode, createGMIErrorFromError } from '@agentos/core/utils/errors';

import { IPromptEngine } from '../core/llm/IPromptEngine';

import { AIModelProviderManager } from '../core/llm/providers/AIModelProviderManager';
import { IUtilityAI } from '../core/ai_utilities/IUtilityAI';

import { IToolOrchestrator } from '../core/tools/IToolOrchestrator';
import { IRetrievalAugmentor } from '../rag/IRetrievalAugmentor';
import { PersonaOverlayManager } from './persona_overlays/PersonaOverlayManager';
import type { PersonaStateOverlay, PersonaEvolutionContext } from './persona_overlays/PersonaOverlayTypes';
import type { PersonaEvolutionRule } from '../core/workflows/WorkflowTypes';

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
    super(message, code as GMIErrorCode, details);
    this.name = 'GMIManagerError';
    Object.setPrototypeOf(this, GMIManagerError.prototype);
  }
}

/**
 * Configuration options for the GMIManager.
 * @interface GMIManagerConfig
 */
export interface GMIManagerConfig {
  personaLoaderConfig: PersonaLoaderConfig;
  defaultGMIInactivityCleanupMinutes?: number;
  defaultWorkingMemoryType?: 'in_memory' | string;
  // This module augmentation is from the original file, assuming it's intended
  defaultGMIBaseConfigDefaults?: Partial<Pick<GMIBaseConfig, 'defaultLlmProviderId' | 'defaultLlmModelId' | 'customSettings'>>;
}

/**
 * Manages the lifecycle of Generalized Mind Instances (GMIs).
 */
export class GMIManager {
  private config!: Required<Omit<GMIManagerConfig, 'defaultGMIBaseConfigDefaults'>> & Pick<GMIManagerConfig, 'defaultGMIBaseConfigDefaults'>; // Ensure required props
  private personaLoader: IPersonaLoader;
  private allPersonaDefinitions: Map<string, IPersonaDefinition>;
  public activeGMIs: Map<string, IGMI>; // Keep public if gmiRoutes needs direct check, otherwise make private with getter
  public gmiSessionMap: Map<string, string>; // Same as above
  private readonly personaOverlayManager: PersonaOverlayManager;
  private readonly agencySeatOverlays: Map<string, PersonaStateOverlay>;

  private authService: IAuthService;
  private subscriptionService: ISubscriptionService;
  private prisma: PrismaClient;
  private conversationManager: ConversationManager;

  private promptEngine: IPromptEngine;
  private llmProviderManager: AIModelProviderManager;
  private utilityAI: IUtilityAI;
  private toolOrchestrator: IToolOrchestrator;
  private retrievalAugmentor?: IRetrievalAugmentor;

  private isInitialized: boolean = false;
  public readonly managerId: string;

  constructor(
    config: GMIManagerConfig,
    subscriptionService: ISubscriptionService,
    authService: IAuthService,
    prisma: PrismaClient,
    conversationManager: ConversationManager,
    promptEngine: IPromptEngine,
    llmProviderManager: AIModelProviderManager,
    utilityAI: IUtilityAI,
    toolOrchestrator: IToolOrchestrator,
    retrievalAugmentor?: IRetrievalAugmentor,
    personaLoader?: IPersonaLoader,
  ) {
    this.managerId = `gmi-manager-${uuidv4()}`;
    if (!config || !config.personaLoaderConfig) {
      throw new GMIManagerError('Invalid GMIManager configuration: personaLoaderConfig is required.', GMIErrorCode.CONFIGURATION_ERROR, { providedConfig: config });
    }
    // Ensure required properties for config are set with defaults
    this.config = {
      personaLoaderConfig: config.personaLoaderConfig,
      defaultGMIInactivityCleanupMinutes: config.defaultGMIInactivityCleanupMinutes ?? 60,
      defaultWorkingMemoryType: config.defaultWorkingMemoryType ?? 'in_memory',
      defaultGMIBaseConfigDefaults: config.defaultGMIBaseConfigDefaults, // This can be undefined
    };

    this.subscriptionService = subscriptionService;
    this.authService = authService;
    this.prisma = prisma;
    this.conversationManager = conversationManager;
    this.promptEngine = promptEngine;
    this.llmProviderManager = llmProviderManager;
    this.utilityAI = utilityAI;
    this.toolOrchestrator = toolOrchestrator;
    this.retrievalAugmentor = retrievalAugmentor;
    this.personaLoader = personaLoader || new PersonaLoader(); // Default implementation
    this.allPersonaDefinitions = new Map();
    this.activeGMIs = new Map();
    this.gmiSessionMap = new Map();
    this.personaOverlayManager = new PersonaOverlayManager();
    this.agencySeatOverlays = new Map();

    this.validateGMIDependencies();
  }

  private validateGMIDependencies(): void {
    const check = (service: any, name: string, code: GMIErrorCode = GMIErrorCode.DEPENDENCY_ERROR) => {
        if (!service) throw new GMIManagerError(`${name} dependency is missing.`, code, { service: name });
    };
    check(this.subscriptionService, 'ISubscriptionService');
    check(this.authService, 'IAuthService');
    check(this.prisma, 'PrismaClient');
    check(this.conversationManager, 'ConversationManager');
    check(this.promptEngine, 'IPromptEngine');
    check(this.llmProviderManager, 'AIModelProviderManager');
    check(this.utilityAI, 'IUtilityAI');
    check(this.toolOrchestrator, 'IToolOrchestrator');
  }

  private getAgencySeatKey(agencyId: string, roleId: string): string {
    return `${agencyId}::${roleId}`;
  }

  /**
   * Clears overlay information for a given Agency seat.
   * @param agencyId - Agency identifier.
   * @param roleId - Role identifier within the agency.
   */
  public clearAgencyPersonaOverlay(agencyId: string, roleId: string): void {
    const key = this.getAgencySeatKey(agencyId, roleId);
    this.agencySeatOverlays.delete(key);
  }

  /**
   * Retrieves the overlay associated with an Agency seat if present.
   * @param agencyId - Agency identifier.
   * @param roleId - Agency role identifier.
   */
  public getAgencyPersonaOverlay(agencyId: string, roleId: string): PersonaStateOverlay | undefined {
    return this.agencySeatOverlays.get(this.getAgencySeatKey(agencyId, roleId));
  }

  private resolvePersonaWithAgencyOverlay(
    persona: IPersonaDefinition,
    agencyOptions?: GMIAgencyContextOptions,
  ): { persona: IPersonaDefinition; overlay?: PersonaStateOverlay; overlayChanged: boolean } {
    if (!agencyOptions?.agencyId || !agencyOptions.roleId) {
      return { persona, overlay: undefined, overlayChanged: false };
    }

    const key = this.getAgencySeatKey(agencyOptions.agencyId, agencyOptions.roleId);
    const existingOverlay = this.agencySeatOverlays.get(key);
    let overlayToApply = existingOverlay;
    let overlayChanged = false;

    if (agencyOptions.evolutionRules && agencyOptions.evolutionRules.length > 0) {
      const context: PersonaEvolutionContext = agencyOptions.evolutionContext ?? {
        workflowId: agencyOptions.workflowId ?? 'unknown_workflow',
        agencyId: agencyOptions.agencyId,
        roleId: agencyOptions.roleId,
      };
      const overlay = this.personaOverlayManager.applyRules({
        persona,
        rules: agencyOptions.evolutionRules,
        context,
        previousOverlay: existingOverlay,
      });
      this.agencySeatOverlays.set(key, overlay);
      overlayToApply = overlay;
      overlayChanged =
        !existingOverlay ||
        existingOverlay.appliedRules.join(',') !== overlay.appliedRules.join(',') ||
        JSON.stringify(existingOverlay.patchedDefinition) !== JSON.stringify(overlay.patchedDefinition);
    }

    if (!overlayToApply) {
      return { persona, overlay: undefined, overlayChanged: false };
    }

    const resolved = this.personaOverlayManager.resolvePersona(persona, overlayToApply);
    return { persona: resolved, overlay: overlayToApply, overlayChanged };
  }

/**
 * Options supplied when instantiating a GMI for an Agency seat.
 */
export interface GMIAgencyContextOptions {
  agencyId: string;
  roleId: string;
  workflowId?: string;
  evolutionRules?: PersonaEvolutionRule[];
  evolutionContext?: PersonaEvolutionContext;
}

  private async resolveUserTier(userId: string): Promise<ISubscriptionTier | null> {
    if (!userId || userId === 'anonymous_user') {
      return null;
    }
    return this.subscriptionService.getUserSubscription(userId);
  }

  private async resolveTierByName(tierName: string): Promise<ISubscriptionTier | null> {
    if (!tierName) {
      return null;
    }
    if (this.subscriptionService.listTiers) {
      const tiers = await this.subscriptionService.listTiers();
      return tiers.find(tier => tier.name === tierName) ?? null;
    }
    return null;
  }

  private async userMeetsPersonaTier(userId: string, persona: IPersonaDefinition): Promise<boolean> {
    if (!persona.minSubscriptionTier) {
      return true;
    }
    const userTier = await this.resolveUserTier(userId);
    if (!userTier) {
      return false;
    }
    const requiredTier = await this.resolveTierByName(persona.minSubscriptionTier);
    if (requiredTier) {
      return userTier.level >= requiredTier.level;
    }
    return userTier.name === persona.minSubscriptionTier;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.warn(`GMIManager (ID: ${this.managerId}) already initialized. Re-initializing persona definitions.`);
      this.allPersonaDefinitions.clear(); // Or a more selective refresh
    }
    try {
      await this.personaLoader.initialize(this.config.personaLoaderConfig);
      await this.loadAllPersonaDefinitions();
    } catch (error: any) {

      throw createGMIErrorFromError(error, GMIErrorCode.GMI_INITIALIZATION_ERROR, undefined, `GMIManager (ID: ${this.managerId}) initialization failed during persona loading.`);
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
    // ensureInitialized() could be called here, or assume it's part of the public API contract to call initialize() first.
    if (this.isInitialized) console.log(`GMIManager (ID: ${this.managerId}): Refreshing persona definitions...`);
    try {
      const loadedDefs = await this.personaLoader.loadAllPersonaDefinitions();
      this.allPersonaDefinitions.clear();
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

      throw createGMIErrorFromError(error, GMIErrorCode.PERSONA_LOAD_ERROR, undefined, `Failed to load persona definitions.`);
    }
  }

  public getPersonaDefinition(personaId: string): IPersonaDefinition | undefined {
    this.ensureInitialized();
    return this.allPersonaDefinitions.get(personaId);
  }

  public async listAvailablePersonas(userId?: string): Promise<Partial<IPersonaDefinition>[]> {
    this.ensureInitialized();
    const normalizedUserId = userId ?? 'anonymous_user';
    const availablePersonas: Partial<IPersonaDefinition>[] = [];
    for (const persona of this.allPersonaDefinitions.values()) {
      const isPublicPersona = persona.isPublic !== false;
      const meetsTierRequirement = await this.userMeetsPersonaTier(normalizedUserId, persona);
      if (isPublicPersona && meetsTierRequirement) {
        availablePersonas.push(this.stripSensitivePersonaData(persona));
      }
    }
    return availablePersonas;
  }

  private stripSensitivePersonaData(persona: IPersonaDefinition): Partial<IPersonaDefinition> {

    // Return type Partial<IPersonaDefinition> is compatible with array push.
    // The error might have been misleading or due to other type issues.
    const {
      baseSystemPrompt,
      // Assuming IPersonaDefinition has defaultModelId & defaultProviderId
      defaultModelId,
      defaultProviderId,
      defaultModelCompletionOptions,
      promptEngineConfigOverrides,
      embeddedTools,
      metaPrompts,
      initialMemoryImprints,
      contextualPromptElements, // Assuming added to IPersonaDefinition
      // Potentially sensitive parts of voiceConfig or avatarConfig if they contain keys/private URLs
      ...publicPersonaData
    } = persona;

    const stripped: Partial<IPersonaDefinition> = {
      ...publicPersonaData,
      toolIds: persona.toolIds,
      allowedCapabilities: persona.allowedCapabilities,
      memoryConfig: persona.memoryConfig ? {
        enabled: persona.memoryConfig.enabled,
        ragConfig: persona.memoryConfig.ragConfig ? { enabled: persona.memoryConfig.ragConfig.enabled } : undefined,
        // Do not expose detailed dataSources or workingMemoryProcessing rules publicly
      } : undefined,
    };
    return stripped;
  }

  private assembleGMIBaseConfig(persona: IPersonaDefinition): GMIBaseConfig {
    const workingMemory = new InMemoryWorkingMemory(); // TODO: Use a factory based on config

    // Assuming IPersonaDefinition is updated with these fields.
    return {
      workingMemory,
      promptEngine: this.promptEngine,
      llmProviderManager: this.llmProviderManager,
      utilityAI: this.utilityAI,
      toolOrchestrator: this.toolOrchestrator,
      retrievalAugmentor: this.retrievalAugmentor,
      defaultLlmProviderId: persona.defaultProviderId || this.config.defaultGMIBaseConfigDefaults?.defaultLlmProviderId,
      defaultLlmModelId: persona.defaultModelId || this.config.defaultGMIBaseConfigDefaults?.defaultLlmModelId,

      customSettings: persona.customFields,
    };
  }

  public async getOrCreateGMIForSession(
    userId: string,
    sessionId: string,
    requestedPersonaId: string,
    conversationIdInput?: string,
    preferredModelId?: string,
    preferredProviderId?: string,
    userApiKeys?: Record<string, string>,
    agencyOptions?: GMIAgencyContextOptions
  ): Promise<{ gmi: IGMI; conversationContext: ConversationContext }> {
    this.ensureInitialized();

    const personaDefinition = this.getPersonaDefinition(requestedPersonaId);
    if (!personaDefinition) {
      throw new GMIManagerError(`Persona '${requestedPersonaId}' not found.`, GMIErrorCode.PERSONA_NOT_FOUND, { requestedPersonaId });
    }

    const canAccessPersona = await this.userMeetsPersonaTier(userId, personaDefinition);
    if (!canAccessPersona) {
      throw new GMIManagerError(
        `Access denied: Persona '${requestedPersonaId}' requires tier '${personaDefinition.minSubscriptionTier}'.`,
        GMIErrorCode.PERMISSION_DENIED,
        { requestedPersonaId, userId }
      );
    }

    const { persona: effectivePersona, overlay, overlayChanged } = this.resolvePersonaWithAgencyOverlay(
      personaDefinition,
      agencyOptions,
    );

    let gmiInstanceId = this.gmiSessionMap.get(sessionId);
    let gmi: IGMI | undefined = gmiInstanceId ? this.activeGMIs.get(gmiInstanceId) : undefined;

    if (gmi && (gmi.getPersona().id !== requestedPersonaId || overlayChanged)) {
      console.log(
        `GMIManager (ID: ${this.managerId}): Persona refresh requested for session ${sessionId} (base '${requestedPersonaId}', overlayChanged=${overlayChanged}). Recreating GMI.`,
      );
      await this.deactivateGMIForSession(sessionId);
      gmi = undefined;
      gmiInstanceId = undefined;
    }

    let currentConversationContext: ConversationContext;

    if (gmi && gmiInstanceId) { // GMI exists for session and persona matches
      console.log(`GMIManager (ID: ${this.managerId}): Reusing GMI instance ${gmiInstanceId} for session ${sessionId}.`);
      currentConversationContext = await this.conversationManager.getOrCreateConversationContext(
        conversationIdInput || sessionId,
        userId,
        gmiInstanceId,
        personaDefinition.id
      );
    } else { // Create new GMI instance
      const newGmiInstanceId = `gmi-instance-${uuidv4()}`;
      console.log(`GMIManager (ID: ${this.managerId}): Creating new GMI instance ${newGmiInstanceId} for session ${sessionId} with persona ${requestedPersonaId}.`);

      const completeGMIBaseConfig = this.assembleGMIBaseConfig(effectivePersona);
      const newGMI = new GMI(newGmiInstanceId); // This is of type GMI

      try {
        await newGMI.initialize(effectivePersona, completeGMIBaseConfig);
      } catch (error: any) {

        throw createGMIErrorFromError(error, GMIErrorCode.GMI_INITIALIZATION_ERROR, { newGmiInstanceId },`Failed to initialize new GMI instance ${newGmiInstanceId}.`);
      }
      gmi = newGMI; // Assign to the IGMI typed variable

      this.activeGMIs.set(newGmiInstanceId, gmi);
      this.gmiSessionMap.set(sessionId, newGmiInstanceId);

      currentConversationContext = await this.conversationManager.getOrCreateConversationContext(
        conversationIdInput || sessionId,
        userId,
        newGmiInstanceId,
        personaDefinition.id
      );
    }
    
    // The logic above should ensure gmi is always assigned.
    if (!gmi) {
        // This case should ideally not be reached if logic is correct.
        throw new GMIManagerError("Failed to get or create GMI instance unexpectedly.", GMIErrorCode.INTERNAL_SERVER_ERROR, { sessionId, requestedPersonaId });
    }

    // Use ConversationContext's setMetadata or ensure properties are writable / set via config in constructor
    // ConversationContext.ts uses setMetadata for these based on its structure.
    // sessionId on ConversationContext is readonly and set at its construction by ConversationManager.
    if (preferredModelId) currentConversationContext.setMetadata('preferredModelId', preferredModelId);
    if (preferredProviderId) currentConversationContext.setMetadata('preferredProviderId', preferredProviderId);
    if (userApiKeys) currentConversationContext.setMetadata('userApiKeys', userApiKeys);
    if (currentConversationContext.getMetadata('userId') !== userId) currentConversationContext.setMetadata('userId', userId);
    if (currentConversationContext.getMetadata('gmiInstanceId') !== gmi.gmiId) currentConversationContext.setMetadata('gmiInstanceId', gmi.gmiId);
    if (currentConversationContext.getMetadata('activePersonaId') !== gmi.getPersona().id) currentConversationContext.setMetadata('activePersonaId', gmi.getPersona().id);
    if (agencyOptions?.agencyId) {
      currentConversationContext.setMetadata('agencyId', agencyOptions.agencyId);
      currentConversationContext.setMetadata('agencyRoleId', agencyOptions.roleId);
    }
    if (overlay) {
      currentConversationContext.setMetadata('agencyPersonaOverlay', overlay);
    }

    // Optionally save context if ConversationManager requires explicit saves after metadata changes
    // await this.conversationManager.saveConversation(currentConversationContext);

    return { gmi, conversationContext: currentConversationContext };
  }

  public getGMIByInstanceId(gmiInstanceId: string): IGMI | undefined {
    this.ensureInitialized();
    return this.activeGMIs.get(gmiInstanceId);
  }

  public async deactivateGMIForSession(sessionId: string): Promise<boolean> {
    this.ensureInitialized();
    const gmiInstanceId = this.gmiSessionMap.get(sessionId);
    if (!gmiInstanceId) {
        console.warn(`GMIManager (ID: ${this.managerId}): No GMI instance ID found for session ${sessionId} during deactivation attempt.`);
        return false;
    }

    const gmi = this.activeGMIs.get(gmiInstanceId);
    if (gmi) {
      console.log(`GMIManager (ID: ${this.managerId}): Deactivating GMI instance ${gmiInstanceId} for session ${sessionId}.`);
      try {
        await gmi.shutdown();
      } catch (error: any) {
        console.error(`GMIManager (ID: ${this.managerId}): Error during gmi.shutdown() for GMI ${gmiInstanceId}: ${error.message}`, error);
      } finally {
        this.activeGMIs.delete(gmiInstanceId);
        this.gmiSessionMap.delete(sessionId);
        console.log(`GMIManager (ID: ${this.managerId}): GMI instance ${gmiInstanceId} (session ${sessionId}) maps removed.`);
      }
      return true;
    } else {
      // GMI not in activeGMIs map, but was in gmiSessionMap. Clean up gmiSessionMap.
      console.warn(`GMIManager (ID: ${this.managerId}): GMI instance ${gmiInstanceId} for session ${sessionId} was in session map but not active map. Cleaning map.`);
      this.gmiSessionMap.delete(sessionId);
      return false;
    }
  }

  public async cleanupInactiveGMIs(inactivityThresholdMinutes?: number): Promise<number> {
    this.ensureInitialized();
    const threshold = inactivityThresholdMinutes ?? this.config.defaultGMIInactivityCleanupMinutes;
    console.log(`GMIManager (ID: ${this.managerId}): Starting cleanup of GMIs inactive for over ${threshold} minutes.`);
    let cleanedUpCount = 0;
    const now = Date.now();
    const thresholdMs = threshold * 60 * 1000;

    // Iterate over a copy of session IDs to allow modification of the map during iteration
    const sessionIdsSnapshot = Array.from(this.gmiSessionMap.keys());

    for (const sessionId of sessionIdsSnapshot) {
      const gmiInstanceId = this.gmiSessionMap.get(sessionId);
      if (!gmiInstanceId) continue;

      const gmi = this.activeGMIs.get(gmiInstanceId);
      if (!gmi) { // Should not happen if maps are consistent, but guard it
        this.gmiSessionMap.delete(sessionId); // Clean up inconsistent map entry
        continue;
      }

      try {
        const contextsSummary = await this.conversationManager.listContextsForSession(sessionId);
        let lastActivityOverall = 0;

        if (contextsSummary.length > 0) {
          for (const ctxSummary of contextsSummary) {
            if (!ctxSummary.sessionId) {
              continue;
            }
            const lastActiveTimestamp = await this.conversationManager.getLastActiveTimeForConversation(ctxSummary.sessionId);
            if (lastActiveTimestamp && lastActiveTimestamp > lastActivityOverall) {
              lastActivityOverall = lastActiveTimestamp;
            }
          }
        } else {
          // No conversation contexts found, use GMI creation time.
          lastActivityOverall = gmi.creationTimestamp.getTime();
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
    this.isInitialized = false; // Mark as not initialized first

    const sessionIdsToDeactivate = Array.from(this.gmiSessionMap.keys());
    for (const sessionId of sessionIdsToDeactivate) {
      try {
        await this.deactivateGMIForSession(sessionId);
      } catch (error: any) {
        console.error(`GMIManager (ID: ${this.managerId}): Error deactivating GMI for session ${sessionId} during manager shutdown: ${error.message}`, error);
      }
    }
    // Ensure maps are cleared even if individual deactivations had issues
    this.activeGMIs.clear();
    this.gmiSessionMap.clear();
    this.allPersonaDefinitions.clear();
    console.log(`GMIManager (ID: ${this.managerId}): Shutdown complete.`);
  }

  /**
   * Placeholder for processing user feedback. This functionality needs a proper design:
   * - Where is feedback stored? (e.g., Prisma table)
   * - How does it influence GMI behavior? (e.g., fine-tuning, prompt adjustments, RAG updates)
   * - Should it be handled by GMIManager, or directly by the GMI instance?
   * For now, this is a conceptual placeholder.
   *
   * @param {string} userId - The ID of the user providing feedback.
   * @param {string} sessionId - The session ID related to the feedback.
   * @param {string} personaId - The persona ID related to the feedback.
   * @param {any} feedbackData - The actual feedback content.
   * @returns {Promise<void>}
   */
  public async processUserFeedback(userId: string, sessionId: string, personaId: string, feedbackData: any): Promise<void> {
    this.ensureInitialized();
    console.log(`GMIManager (ID: ${this.managerId}): Received feedback for User: ${userId}, Session: ${sessionId}, Persona: ${personaId}`, feedbackData);
    // TODO: Implement actual feedback processing logic.
    // This might involve:
    // 1. Storing feedback in a database (e.g., using this.prisma).
    // 2. Retrieving the relevant GMI instance or ConversationContext.
    // 3. If GMI has a method like `gmi.applyFeedback(feedbackData)`, call it.
    // 4. Triggering asynchronous learning or adaptation processes.
    // For now, just logging.
    this.addTraceEntryToRelevantGMI(sessionId, ReasoningEntryType.DEBUG, 'User feedback received by manager.', { userId, feedbackData });
  }

  /**
   * Helper to add a trace entry to a GMI associated with a session, if found.
   * @private
   */
  private addTraceEntryToRelevantGMI(sessionId: string, type: ReasoningEntryType, message: string, details?: Record<string, any>): void {
    const gmiInstanceId = this.gmiSessionMap.get(sessionId);
    if (gmiInstanceId) {
        const gmi = this.activeGMIs.get(gmiInstanceId) as GMI | undefined;
        if (gmi && typeof (gmi as any)['addTraceEntry'] === 'function') {
            const entryDetails = details ?? {};
            (gmi as any)['addTraceEntry'](type, message, entryDetails);
        }
    }
  }
}

// Module augmentation for GMIManagerConfig from original file (if it exists in that path)
// This should ideally be in a .d.ts file or directly in this file if preferred.
// Assuming it's correctly placed and working in the user's setup.
/*
declare module './GMIManager' {
  interface GMIManagerConfig {
    defaultGMIBaseConfigDefaults?: Partial<Pick<GMIBaseConfig, 'defaultLlmProviderId' | 'defaultLlmModelId' | 'customSettings'>>;
  }
}
*/
