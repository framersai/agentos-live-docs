// File: backend/agentos/core/conversation/ConversationManager.ts
/**
 * @fileoverview Manages the lifecycle of ConversationContext instances in AgentOS.
 * Responsible for creating, retrieving, storing (both in-memory and persistently
 * using Prisma), and managing active conversation states. It ensures conversations
 * can be rehydrated and maintained across sessions.
 *
 * @module backend/agentos/core/conversation/ConversationManager
 * @see ./ConversationContext.ts
 * @see ../../ai_utilities/IUtilityAI.ts
 * @see ../../../db.ts For Prisma client
 * @see ../../../prisma/schema.prisma For database schema
 */

import { ConversationContext, ConversationContextConfig } from './ConversationContext';
import { ConversationMessage as InternalConversationMessage, MessageRole, createConversationMessage } from './ConversationMessage';
import { IUtilityAI } from '../ai_utilities/IUtilityAI';
import { v4 as uuidv4 } from 'uuid';
import { GMIError, GMIErrorCode } from '../../../utils/errors';
import { PrismaClient, Conversation as PrismaConversation, ConversationMessage as PrismaConversationMessageModel } from '@prisma/client';

/**
 * Configuration for the ConversationManager.
 * Defines settings for managing conversation contexts, including persistence options.
 */
export interface ConversationManagerConfig {
  /** Default configuration for newly created ConversationContext instances. */
  defaultConversationContextConfig?: Partial<ConversationContextConfig>;
  /** Maximum number of active conversations to keep in memory. LRU eviction may apply. */
  maxActiveConversationsInMemory?: number;
  /**
   * Timeout in milliseconds for inactive conversations. If set, a cleanup process
   * might be implemented to evict conversations inactive for this duration. (Currently conceptual)
   * @default 3600000 (1 hour)
   */
  inactivityTimeoutMs?: number;
  /**
   * Controls whether Prisma is used for database persistence of conversations.
   * If true, a PrismaClient instance must be provided during initialization.
   * @default false
   */
  persistenceEnabled?: boolean;
}

// Helper type for Prisma message creation, ensuring proper JSON handling.
type PrismaMessageCreateInput = Omit<PrismaConversationMessageModel, 'id' | 'conversationId' | 'createdAt' | 'updatedAt'> & {
  id: string; // id is required for createMany if not autoincrement and not cuid()/uuid() by default on model
  conversationId: string;
  timestamp: Date; // Prisma expects Date, ConversationMessage uses number
  tool_calls?: object | null; // Prisma schema might use Json type
  metadata?: object | null;   // Prisma schema might use Json type
  multimodalData?: object | null;
  voiceSettings?: object | null;
};

/**
 * @class ConversationManager
 * @description Manages ConversationContext instances for AgentOS, handling their
 * creation, retrieval, in-memory caching, and persistent storage via Prisma.
 * This class is vital for maintaining conversational state across user sessions and
 * GMI interactions.
 */
export class ConversationManager {
  private config!: Required<ConversationManagerConfig>;
  private activeConversations: Map<string, ConversationContext>;
  private utilityAIService?: IUtilityAI;
  private prisma?: PrismaClient;
  private initialized: boolean = false;
  public readonly managerId: string;

  /**
   * Constructs a ConversationManager instance.
   * Initialization via `initialize()` is required before use.
   */
  constructor() {
    this.managerId = `conv-mgr-${uuidv4()}`;
    this.activeConversations = new Map();
  }

  /**
   * Initializes the ConversationManager with its configuration and dependencies.
   * This method sets up persistence if enabled and prepares the manager for operation.
   *
   * @async
   * @param {ConversationManagerConfig} config - Configuration for the manager.
   * @param {IUtilityAI} [utilityAIService] - Optional IUtilityAI instance, primarily
   * used by ConversationContext instances for features like summarization.
   * @param {PrismaClient} [prismaClient] - Optional Prisma client for database persistence.
   * Required if `config.persistenceEnabled` is true.
   * @returns {Promise<void>} A promise that resolves when initialization is complete.
   * @throws {GMIError} If configuration is invalid or dependencies are missing when required.
   */
  public async initialize(
    config: ConversationManagerConfig,
    utilityAIService?: IUtilityAI,
    prismaClient?: PrismaClient
  ): Promise<void> {
    if (this.initialized) {
      console.warn(`ConversationManager (ID: ${this.managerId}) already initialized. Re-initializing could lead to unexpected state if not handled carefully.`);
      // Potentially add logic to re-initialize or prevent re-initialization based on desired behavior.
      // For now, allow re-initialization but log a warning.
    }

    this.config = {
      defaultConversationContextConfig: config.defaultConversationContextConfig || {},
      maxActiveConversationsInMemory: config.maxActiveConversationsInMemory ?? 1000,
      inactivityTimeoutMs: config.inactivityTimeoutMs ?? 3600000, // 1 hour
      persistenceEnabled: config.persistenceEnabled ?? false,
      ...config,
    };

    this.utilityAIService = utilityAIService;
    this.prisma = this.config.persistenceEnabled ? prismaClient : undefined;

    if (this.config.persistenceEnabled && !this.prisma) {
      console.warn(`ConversationManager (ID: ${this.managerId}): Persistence is enabled in config, but no PrismaClient was provided. Persistence will be effectively disabled.`);
      this.config.persistenceEnabled = false; // Correct the state
    }

    this.initialized = true;
    console.log(`ConversationManager (ID: ${this.managerId}) initialized. Persistence: ${this.config.persistenceEnabled}. Max in-memory: ${this.config.maxActiveConversationsInMemory}.`);

    // Conceptual: Start periodic cleanup task for inactive conversations
    // if (this.config.inactivityTimeoutMs > 0 && this.config.maxActiveConversationsInMemory > 0) {
    //   // setInterval(() => this.cleanupInactiveConversations(), this.config.inactivityTimeoutMs / 2);
    //   console.log(`ConversationManager (ID: ${this.managerId}): Inactive conversation cleanup conceptualized (interval: ${this.config.inactivityTimeoutMs / 2}ms).`);
    // }
  }

  /**
   * Ensures that the manager has been initialized before performing operations.
   * @private
   * @throws {GMIError} If the manager is not initialized.
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new GMIError("ConversationManager is not initialized. Call initialize() first.", GMIErrorCode.NOT_INITIALIZED, { managerId: this.managerId });
    }
  }

  /**
   * Creates a new conversation context or retrieves an existing one.
   * If `conversationId` is provided:
   * - Tries to find it in the active (in-memory) cache.
   * - If not in cache and persistence is enabled, tries to load from the database.
   * - If not found in DB or persistence disabled, creates a new context with this ID.
   * If no `conversationId` is provided, a new one is generated.
   * Manages in-memory cache size by evicting the oldest conversation if capacity is reached.
   *
   * @async
   * @param {string} [conversationId] - Optional ID of an existing conversation.
   * @param {string} [userId] - ID of the user associated with the conversation.
   * @param {string} [gmiInstanceId] - ID of the GMI instance this conversation is for.
   * @param {string} [activePersonaId] - ID of the active persona for the conversation.
   * @param {Record<string, any>} [initialMetadata={}] - Initial metadata for a new conversation.
   * @param {Partial<ConversationContextConfig>} [overrideConfig] - Config overrides for a new context.
   * @returns {Promise<ConversationContext>} The created or retrieved ConversationContext.
   * @throws {GMIError} If GMI/User context is missing for a new conversation.
   */
  public async getOrCreateConversationContext(
    conversationId?: string,
    userId?: string,
    gmiInstanceId?: string,
    activePersonaId?: string,
    initialMetadata: Record<string, any> = {},
    overrideConfig?: Partial<ConversationContextConfig>
  ): Promise<ConversationContext> {
    this.ensureInitialized();
    const effectiveConversationId = conversationId || `conv_${uuidv4()}`;

    let context = this.activeConversations.get(effectiveConversationId);
    if (context) {
      // Update context identifiers if provided and different
      if (userId && context.userId !== userId) context.setMetadata('userId', userId);
      if (gmiInstanceId && context.gmiInstanceId !== gmiInstanceId) context.setMetadata('gmiInstanceId', gmiInstanceId);
      if (activePersonaId && context.activePersonaId !== activePersonaId) context.setMetadata('activePersonaId', activePersonaId);
      context.setMetadata('_lastAccessed', Date.now());
      return context;
    }

    if (this.config.persistenceEnabled && this.prisma) {
      const loadedContext = await this.loadConversationFromDB(effectiveConversationId);
      if (loadedContext) {
        if (this.activeConversations.size >= this.config.maxActiveConversationsInMemory) {
          await this.evictOldestConversation();
        }
        this.activeConversations.set(effectiveConversationId, loadedContext);
        loadedContext.setMetadata('_lastAccessed', Date.now());
        return loadedContext;
      }
    }

    // Create new context if not found in memory or DB (or if persistence disabled)
    const contextConfig: Partial<ConversationContextConfig> = {
      ...this.config.defaultConversationContextConfig,
      userId: userId || this.config.defaultConversationContextConfig?.userId,
      gmiInstanceId: gmiInstanceId || this.config.defaultConversationContextConfig?.gmiInstanceId,
      activePersonaId: activePersonaId || this.config.defaultConversationContextConfig?.activePersonaId,
      utilityAI: this.utilityAIService || this.config.defaultConversationContextConfig?.utilityAI,
      ...overrideConfig,
    };

    const newContext = new ConversationContext(effectiveConversationId, contextConfig, [], initialMetadata);
    newContext.setMetadata('_lastAccessed', Date.now());

    if (this.activeConversations.size >= this.config.maxActiveConversationsInMemory) {
      await this.evictOldestConversation();
    }
    this.activeConversations.set(effectiveConversationId, newContext);

    if (this.config.persistenceEnabled && this.prisma) {
      await this.saveConversationToDB(newContext).catch(err => {
        console.error(`ConversationManager (ID: ${this.managerId}): Failed to save newly created conversation ${effectiveConversationId} to DB:`, err);
        // Decide if this should throw or just log. For now, log and continue with in-memory.
      });
    }
    console.log(`ConversationManager (ID: ${this.managerId}): Created new conversation ${effectiveConversationId}.`);
    return newContext;
  }

  /**
   * Retrieves a conversation by its ID.
   * Tries in-memory cache first, then persistent storage if enabled.
   *
   * @async
   * @param {string} conversationId - The ID of the conversation to retrieve.
   * @returns {Promise<ConversationContext | undefined>} The conversation context or undefined if not found.
   */
  public async getConversation(conversationId: string): Promise<ConversationContext | undefined> {
    this.ensureInitialized();
    let context = this.activeConversations.get(conversationId);
    if (context) {
      context.setMetadata('_lastAccessed', Date.now());
      return context;
    }
    if (this.config.persistenceEnabled && this.prisma) {
      context = await this.loadConversationFromDB(conversationId);
      if (context) {
        if (this.activeConversations.size >= this.config.maxActiveConversationsInMemory) {
          await this.evictOldestConversation();
        }
        this.activeConversations.set(conversationId, context);
        context.setMetadata('_lastAccessed', Date.now());
        return context;
      }
    }
    return undefined;
  }

  /**
   * Saves a conversation context.
   * Updates it in the in-memory cache and persists to the database if enabled.
   *
   * @async
   * @param {ConversationContext} context - The conversation context to save.
   * @returns {Promise<void>}
   */
  public async saveConversation(context: ConversationContext): Promise<void> {
    this.ensureInitialized();
    if (!this.activeConversations.has(context.sessionId) && this.activeConversations.size >= this.config.maxActiveConversationsInMemory) {
      await this.evictOldestConversation();
    }
    context.setMetadata('_lastAccessed', Date.now());
    this.activeConversations.set(context.sessionId, context);

    if (this.config.persistenceEnabled && this.prisma) {
      await this.saveConversationToDB(context);
    }
  }

  /**
   * Deletes a conversation from both in-memory cache and persistent storage (if enabled).
   *
   * @async
   * @param {string} conversationId - The ID of the conversation to delete.
   * @returns {Promise<boolean>} True if deletion was successful or conversation didn't exist; false on DB error.
   */
  public async deleteConversation(conversationId: string): Promise<boolean> {
    this.ensureInitialized();
    const wasInMemory = this.activeConversations.delete(conversationId);

    if (this.config.persistenceEnabled && this.prisma) {
      try {
        await this.prisma.conversation.delete({ where: { id: conversationId } });
        console.log(`ConversationManager (ID: ${this.managerId}): Conversation ${conversationId} deleted from DB.`);
      } catch (error: any) {
        // Prisma throws P2025 if record not found, which is acceptable for delete.
        if (error.code === 'P2025') {
          console.log(`ConversationManager (ID: ${this.managerId}): Conversation ${conversationId} not found in DB for deletion, or already deleted.`);
        } else {
          console.error(`ConversationManager (ID: ${this.managerId}): Error deleting conversation ${conversationId} from DB: ${error.message}`, error);
          return false; // Indicate DB error
        }
      }
    }
    console.log(`ConversationManager (ID: ${this.managerId}): Conversation ${conversationId} removed from active memory (was present: ${wasInMemory}).`);
    return true;
  }

  /**
   * Lists the IDs of all conversations currently active in memory.
   *
   * @async
   * @returns {Promise<string[]>} An array of active conversation IDs.
   */
  public async listActiveConversationIds(): Promise<string[]> {
    this.ensureInitialized();
    return Array.from(this.activeConversations.keys());
  }
  
  /**
   * Retrieves summary information for contexts associated with a given session ID.
   * Currently, one sessionId maps to one ConversationContext.
   *
   * @async
   * @param {string} sessionId - The session ID.
   * @returns {Promise<Partial<ConversationContext>[]>} An array of partial conversation context objects.
   */
  public async listContextsForSession(sessionId: string): Promise<Partial<ConversationContext>[]> {
    this.ensureInitialized();
    // In current model, one sessionId implies one ConversationContext if associated.
    // The manager uses conversationId as the primary key. If session implies multiple conversations, logic would change.
    // This method seems to intend listing conversations FOR a session.
    // A direct mapping session -> conversation is not maintained here, but ConversationContext holds sessionID.
    // Let's assume for now it lists based on finding active conversations that match the session ID in metadata.

    const matchingContexts: Partial<ConversationContext>[] = [];
    for (const context of this.activeConversations.values()) {
      // Assuming ConversationContext stores sessionId in its metadata if provided.
      // However, ConversationContext constructor now takes sessionId directly as its own ID.
      // So if a "session" can span multiple "conversations", this needs clarification.
      // If sessionId IS conversationId:
      if (context.sessionId === sessionId) {
         matchingContexts.push({ sessionId: context.sessionId, createdAt: context.createdAt });
      }
    }
    // If persistence is on, could also query DB for conversations associated with a session ID if schema supported it.
    // The current Prisma schema `Conversation` model does not have a direct `sessionId` field, but `gmiInstanceId` could be related.
    // And `ConversationContext` has `sessionId` as its own primary ID.

    return matchingContexts;
  }

  /**
   * Gets the last active time for a conversation.
   * Checks in-memory first, then database if persistence is enabled.
   *
   * @async
   * @param {string} conversationId - The ID of the conversation.
   * @returns {Promise<number | undefined>} Timestamp of last activity, or undefined if not found.
   */
  public async getLastActiveTimeForConversation(conversationId: string): Promise<number | undefined> {
    this.ensureInitialized();
    const context = this.activeConversations.get(conversationId);
    if (context) {
      const lastMessage = context.getLastMessage();
      return lastMessage?.timestamp || context.createdAt;
    }
    if (this.config.persistenceEnabled && this.prisma) {
      try {
        const convo = await this.prisma.conversation.findUnique({
          where: { id: conversationId },
          select: { updatedAt: true }
        });
        return convo?.updatedAt.getTime();
      } catch (error) {
        console.error(`ConversationManager (ID: ${this.managerId}): Error fetching updatedAt for ${conversationId} from DB:`, error);
        return undefined;
      }
    }
    return undefined;
  }

  /**
   * Evicts the oldest (Least Recently Used) conversation from the in-memory cache.
   * If persistence is enabled, ensures the conversation is saved before eviction.
   * @private
   */
  private async evictOldestConversation(): Promise<void> {
    if (this.activeConversations.size === 0) return;

    let oldestSessionId: string | undefined;
    let oldestTimestamp = Infinity;

    for (const [sessionId, context] of this.activeConversations.entries()) {
      const lastAccessed = (context.getMetadata('_lastAccessed') as number) || context.createdAt;
      if (lastAccessed < oldestTimestamp) {
        oldestTimestamp = lastAccessed;
        oldestSessionId = sessionId;
      }
    }

    if (oldestSessionId) {
      const contextToEvict = this.activeConversations.get(oldestSessionId);
      console.warn(`ConversationManager (ID: ${this.managerId}): Max in-memory conversations reached (${this.activeConversations.size}/${this.config.maxActiveConversationsInMemory}). Evicting session ${oldestSessionId}.`);
      if (contextToEvict && this.config.persistenceEnabled && this.prisma) {
        try {
          await this.saveConversationToDB(contextToEvict);
          console.log(`ConversationManager (ID: ${this.managerId}): Saved conversation ${oldestSessionId} before eviction.`);
        } catch (error) {
          console.error(`ConversationManager (ID: ${this.managerId}): Failed to save conversation ${oldestSessionId} to DB before eviction:`, error);
          // Decide if eviction should still proceed. For now, it will.
        }
      }
      this.activeConversations.delete(oldestSessionId);
    }
  }

  /**
   * Saves a ConversationContext to the database using Prisma.
   * This is an upsert operation: creates if not exists, updates if exists.
   * Handles serialization of messages and metadata.
   *
   * @async
   * @private
   * @param {ConversationContext} context - The ConversationContext to save.
   * @throws {GMIError} If the database operation fails.
   */
  private async saveConversationToDB(context: ConversationContext): Promise<void> {
    if (!this.prisma || !this.config.persistenceEnabled) return;
    const contextJSON = context.toJSON() as any; // Full serializable state

    try {
      await this.prisma.$transaction(async (tx) => {
        // Upsert Conversation record
        await tx.conversation.upsert({
          where: { id: context.sessionId },
          update: {
            userId: context.userId,
            gmiInstanceId: context.gmiInstanceId,
            // activePersonaId: context.activePersonaId, // Prisma schema for Conversation doesn't have activePersonaId directly
            title: (contextJSON.sessionMetadata?.title as string) || `Conversation from ${new Date(context.createdAt).toLocaleDateString()}`,
            language: context.currentLanguage,
            sessionDetails: contextJSON.sessionMetadata || {}, // Store all metadata here
            updatedAt: new Date(), // Ensure updatedAt is fresh
          },
          create: {
            id: context.sessionId,
            createdAt: new Date(context.createdAt),
            updatedAt: new Date(),
            userId: context.userId,
            gmiInstanceId: context.gmiInstanceId,
            title: (contextJSON.sessionMetadata?.title as string) || `New Conversation (${context.sessionId.substring(0,8)})`,
            language: context.currentLanguage,
            sessionDetails: contextJSON.sessionMetadata || {},
          },
        });

        // Delete existing messages and re-insert to ensure order and consistency
        await tx.conversationMessage.deleteMany({ where: { conversationId: context.sessionId } });

        if (contextJSON.messages && contextJSON.messages.length > 0) {
          const messagesToCreate: PrismaMessageCreateInput[] = contextJSON.messages.map((msg: InternalConversationMessage) => {
            // Ensure complex objects like tool_calls and metadata are Prisma-compatible (JSON)
            const toolCallsForDb = msg.tool_calls ? JSON.parse(JSON.stringify(msg.tool_calls)) : null;
            const metadataForDb = msg.metadata ? JSON.parse(JSON.stringify(msg.metadata)) : null;
            const multimodalDataForDb = (msg as any).multimodalData ? JSON.parse(JSON.stringify((msg as any).multimodalData)) : null; // Assuming multimodalData on InternalConversationMessage
            const voiceSettingsForDb = (msg as any).voiceSettings ? JSON.parse(JSON.stringify((msg as any).voiceSettings)) : null;


            return {
              id: msg.id, // Assuming msg.id is a string UUID
              conversationId: context.sessionId,
              role: msg.role.toString(), // Store enum as string
              content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content), // Stringify non-string content
              timestamp: new Date(msg.timestamp),
              // name: msg.name, // Prisma schema for ConversationMessage doesn't have 'name'
              tool_calls: toolCallsForDb,
              toolCallId: msg.tool_call_id, // Corrected from tool_call_id
              // originalMessagesSummarizedCount: msg.originalMessagesSummarizedCount, // Not in Prisma schema
              metadata: metadataForDb, // Not directly in Prisma schema, map to a specific field or ignore
              multimodalData: multimodalDataForDb, // Prisma schema has this
              audioUrl: (msg as any).audioUrl, // Prisma schema has this
              audioTranscript: (msg as any).audioTranscript, // Prisma schema has this
              voiceSettings: voiceSettingsForDb, // Prisma schema has this
            };
          });
          await tx.conversationMessage.createMany({
            data: messagesToCreate,
          });
        }
      });
      // console.debug(`ConversationManager (ID: ${this.managerId}): Conversation ${context.sessionId} saved to DB.`);
    } catch (error: any) {
      console.error(`ConversationManager (ID: ${this.managerId}): Error saving conversation ${context.sessionId} to DB: ${error.message}`, error);
      throw new GMIError(`Failed to save conversation ${context.sessionId} to database.`, GMIErrorCode.DATABASE_ERROR, { underlyingError: error.message, stack: error.stack });
    }
  }

  /**
   * Loads a ConversationContext from the database using Prisma.
   * Reconstructs the ConversationContext instance along with its messages and metadata.
   *
   * @async
   * @private
   * @param {string} conversationId - The ID of the conversation to load.
   * @returns {Promise<ConversationContext | undefined>} The loaded ConversationContext or undefined if not found.
   * @throws {GMIError} If the database operation fails.
   */
  private async loadConversationFromDB(conversationId: string): Promise<ConversationContext | undefined> {
    if (!this.prisma || !this.config.persistenceEnabled) return undefined;

    try {
      const convoData = await this.prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { createdAt: 'asc' } } }, // Order by createdAt to maintain sequence
      });

      if (!convoData) return undefined;

      const internalMessages: InternalConversationMessage[] = convoData.messages.map(dbMsg => {
        let parsedContent: InternalConversationMessage['content'];
        try {
          // Attempt to parse if it looks like JSON, otherwise use as string
          if (dbMsg.content && (dbMsg.content.startsWith('{') || dbMsg.content.startsWith('['))) {
            parsedContent = JSON.parse(dbMsg.content);
          } else {
            parsedContent = dbMsg.content;
          }
        } catch (e) {
          parsedContent = dbMsg.content; // Fallback to string if parsing fails
        }
        
        return createConversationMessage(
            dbMsg.role as MessageRole, // Assuming roles align or need mapping
            parsedContent,
            {
                id: dbMsg.id,
                timestamp: dbMsg.createdAt.getTime(), // Use createdAt from DB message as timestamp
                // name: dbMsg.name, // Not in Prisma schema for ConversationMessage
                tool_calls: dbMsg.toolCalls ? (dbMsg.toolCalls as any) : undefined,
                tool_call_id: dbMsg.toolCallId || undefined,
                // originalMessagesSummarizedCount: dbMsg.originalMessagesSummarizedCount, // Not in schema
                metadata: dbMsg.metadata ? (dbMsg.metadata as any) : undefined, // Not in schema, map from convoData.sessionDetails?
                // Multimodal and voice fields from Prisma model need to be mapped here
                ...(dbMsg.multimodalData && { multimodalData: dbMsg.multimodalData as any }),
                ...(dbMsg.audioUrl && { audioUrl: dbMsg.audioUrl }),
                ...(dbMsg.audioTranscript && { audioTranscript: dbMsg.audioTranscript }),
                ...(dbMsg.voiceSettings && { voiceSettings: dbMsg.voiceSettings as any }),
            }
        );
      });
      
      const contextConfigOverrides: Partial<ConversationContextConfig> = {
        userId: convoData.userId || undefined,
        gmiInstanceId: convoData.gmiInstanceId || undefined,
        // activePersonaId should be part of sessionDetails if needed for context rehydration.
        // For example: (convoData.sessionDetails as any)?.activePersonaId
        utilityAI: this.utilityAIService, // Inject the manager's utilityAI service
        // Other flags like summarization options might come from defaultConversationContextConfig or be persisted in sessionDetails
        ...(this.config.defaultConversationContextConfig || {}),
        ...((convoData.sessionDetails as any)?.contextConfigOverrides || {}), // if context-specific config was persisted
      };

      // The ConversationContext constructor expects sessionId, config, initialMessages, initialMetadata
      // convoData.sessionDetails already holds initialMetadata effectively
      const context = ConversationContext.fromJSON(
        { // Reconstruct the JSON structure ConversationContext.fromJSON expects
          sessionId: convoData.id,
          createdAt: convoData.createdAt.getTime(),
          messages: internalMessages, // Pass the mapped InternalConversationMessage[]
          config: { // Reconstruct config for fromJSON
            ...contextConfigOverrides,
            utilityAIServiceId: this.utilityAIService?.utilityId, // Pass serviceId if available
          },
          sessionMetadata: convoData.sessionDetails as Record<string, any> || {},
        },
        (serviceId) => serviceId === this.utilityAIService?.utilityId ? this.utilityAIService : undefined
      );
      
      console.log(`ConversationManager (ID: ${this.managerId}): Conversation ${conversationId} loaded from DB with ${internalMessages.length} messages.`);
      return context;
    } catch (error: any) {
      console.error(`ConversationManager (ID: ${this.managerId}): Error loading conversation ${conversationId} from DB: ${error.message}`, error);
      throw new GMIError(`Failed to load conversation ${conversationId} from database.`, GMIErrorCode.DATABASE_ERROR, { underlyingError: error.message, stack: error.stack });
    }
  }

  /**
   * Shuts down the ConversationManager.
   * If persistence is enabled, ensures all active conversations are saved.
   * Clears the in-memory cache.
   *
   * @async
   * @returns {Promise<void>}
   */
  public async shutdown(): Promise<void> {
    if (!this.initialized) {
        console.warn(`ConversationManager (ID: ${this.managerId}) shutdown called but not initialized.`);
        return;
    }
    console.log(`ConversationManager (ID: ${this.managerId}): Shutting down...`);
    if (this.config.persistenceEnabled && this.prisma) {
      console.log(`ConversationManager (ID: ${this.managerId}): Saving all active conversations before shutdown...`);
      let savedCount = 0;
      for (const context of this.activeConversations.values()) {
        try {
          await this.saveConversationToDB(context);
          savedCount++;
        } catch (error) {
          console.error(`ConversationManager (ID: ${this.managerId}): Error saving conversation ${context.sessionId} during shutdown:`, error);
        }
      }
      console.log(`ConversationManager (ID: ${this.managerId}): ${savedCount} active conversations saved.`);
    }
    this.activeConversations.clear();
    this.initialized = false; // Mark as not initialized after cleanup
    console.log(`ConversationManager (ID: ${this.managerId}): Shutdown complete.`);
  }
}