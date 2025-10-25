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
 *
 * @interface ConversationManagerConfig
 * @property {Partial<ConversationContextConfig>} [defaultConversationContextConfig] - Default configuration for newly created ConversationContext instances.
 * @property {number} [maxActiveConversationsInMemory=1000] - Maximum number of active conversations to keep in memory. LRU eviction may apply.
 * @property {number} [inactivityTimeoutMs=3600000] - Timeout in milliseconds for inactive conversations. If set, a cleanup process
 * might be implemented to evict conversations inactive for this duration. (Currently conceptual)
 * @property {boolean} [persistenceEnabled=false] - Controls whether Prisma is used for database persistence of conversations.
 * If true, a PrismaClient instance must be provided during initialization.
 */
export interface ConversationManagerConfig {
  defaultConversationContextConfig?: Partial<ConversationContextConfig>;
  maxActiveConversationsInMemory?: number;
  inactivityTimeoutMs?: number;
  persistenceEnabled?: boolean;
}

/**
 * Defines the structure for creating Prisma ConversationMessage records, ensuring correct typing for JSON fields.
 * @private
 * @typedef {Object} PrismaMessageCreateInput
 * @property {string} id - The unique ID of the message.
 * @property {string} conversationId - The ID of the conversation this message belongs to.
 * @property {Date} timestamp - The timestamp of the message (Prisma expects Date).
 * @property {object | null} [tool_calls] - Tool calls associated with the message, stored as JSON.
 * @property {object | null} [metadata] - Metadata associated with the message, stored as JSON.
 * @property {object | null} [multimodalData] - Multimodal data associated with the message, stored as JSON.
 * @property {object | null} [voiceSettings] - Voice settings for the message, stored as JSON.
 */
type PrismaMessageCreateInput = Omit<PrismaConversationMessageModel, 'conversationId' | 'createdAt' | 'updatedAt' > & {
  // id is part of Omit, but explicitly listed for clarity as it's required for createMany
  // conversationId is added separately in createMany
  timestamp: Date;
  tool_calls?: object | null;
  metadata?: object | null;
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
  /**
   * Configuration for the ConversationManager instance.
   * @private
   * @type {Required<ConversationManagerConfig>}
   */
  private config!: Required<ConversationManagerConfig>;

  /**
   * In-memory cache for active ConversationContext instances.
   * Key: Conversation ID (sessionId of ConversationContext).
   * Value: ConversationContext instance.
   * @private
   * @type {Map<string, ConversationContext>}
   */
  private activeConversations: Map<string, ConversationContext>;

  /**
   * Optional IUtilityAI service instance, passed to ConversationContexts.
   * @private
   * @type {IUtilityAI | undefined}
   */
  private utilityAIService?: IUtilityAI;

  /**
   * Optional PrismaClient instance for database interaction.
   * @private
   * @type {PrismaClient | undefined}
   */
  private prisma?: PrismaClient;

  /**
   * Flag indicating if the manager has been successfully initialized.
   * @private
   * @type {boolean}
   */
  private initialized: boolean = false;

  /**
   * Unique identifier for this ConversationManager instance.
   * @public
   * @readonly
   * @type {string}
   */
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
   * @public
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
      console.warn(`ConversationManager (ID: ${this.managerId}) already initialized. Consider if re-initialization is intended and its effects on state.`);
    }

    this.config = {
      defaultConversationContextConfig: config.defaultConversationContextConfig || {},
      maxActiveConversationsInMemory: config.maxActiveConversationsInMemory ?? 1000,
      inactivityTimeoutMs: config.inactivityTimeoutMs ?? 3600000, // 1 hour
      persistenceEnabled: config.persistenceEnabled ?? false,
      ...config, // Spread last to ensure explicit config values override defaults if provided
    };

    this.utilityAIService = utilityAIService;
    this.prisma = this.config.persistenceEnabled ? prismaClient : undefined;

    if (this.config.persistenceEnabled && !this.prisma) {
      console.warn(`ConversationManager (ID: ${this.managerId}): Persistence is enabled in config, but no PrismaClient was provided. Persistence will be effectively disabled.`);
      this.config.persistenceEnabled = false;
    }

    this.initialized = true;
    console.log(`ConversationManager (ID: ${this.managerId}) initialized. Persistence: ${this.config.persistenceEnabled}. Max in-memory: ${this.config.maxActiveConversationsInMemory}.`);
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
   * @public
   * @async
   * @param {string} [conversationId] - Optional ID of an existing conversation. This ID will also be used as the `ConversationContext.sessionId`.
   * @param {string} [userId] - ID of the user associated with the conversation.
   * @param {string} [gmiInstanceId] - ID of the GMI instance this conversation is for.
   * @param {string} [activePersonaId] - ID of the active persona for the conversation.
   * @param {Record<string, any>} [initialMetadata={}] - Initial metadata for a new conversation.
   * @param {Partial<ConversationContextConfig>} [overrideConfig] - Config overrides for a new context.
   * @returns {Promise<ConversationContext>} The created or retrieved ConversationContext.
   * @throws {GMIError} If essential parameters for creating a new context are missing or if an error occurs.
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
      // Update context identifiers if provided and different. These setters should exist on ConversationContext or be handled via setMetadata.
      if (userId && context.getMetadata('userId') !== userId) context.setMetadata('userId', userId);
      if (gmiInstanceId && context.getMetadata('gmiInstanceId') !== gmiInstanceId) context.setMetadata('gmiInstanceId', gmiInstanceId);
      if (activePersonaId && context.getMetadata('activePersonaId') !== activePersonaId) context.setMetadata('activePersonaId', activePersonaId);
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

    const contextConfig: ConversationContextConfig = {
      ...this.config.defaultConversationContextConfig,
      userId: userId || this.config.defaultConversationContextConfig?.userId,
      gmiInstanceId: gmiInstanceId || this.config.defaultConversationContextConfig?.gmiInstanceId,
      activePersonaId: activePersonaId || this.config.defaultConversationContextConfig?.activePersonaId,
      utilityAI: this.utilityAIService || this.config.defaultConversationContextConfig?.utilityAI,
      ...(overrideConfig || {}), // Apply overrides
    } as ConversationContextConfig; // Cast as fully required after merging

    const newContext = new ConversationContext(effectiveConversationId, contextConfig, [], initialMetadata);
    newContext.setMetadata('_lastAccessed', Date.now());

    if (this.activeConversations.size >= this.config.maxActiveConversationsInMemory) {
      await this.evictOldestConversation();
    }
    this.activeConversations.set(effectiveConversationId, newContext);

    if (this.config.persistenceEnabled && this.prisma) {
      await this.saveConversationToDB(newContext).catch(err => {
        console.error(`ConversationManager (ID: ${this.managerId}): Failed to save newly created conversation ${effectiveConversationId} to DB. It will only exist in memory. Error:`, err);
      });
    }
    console.log(`ConversationManager (ID: ${this.managerId}): Created new conversation ${effectiveConversationId}. UserID: ${userId}, GMI ID: ${gmiInstanceId}`);
    return newContext;
  }

  /**
   * Retrieves a conversation by its ID.
   * Tries in-memory cache first, then persistent storage if enabled.
   *
   * @public
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
      console.log(`ConversationManager (ID: ${this.managerId}): Cache miss for ${conversationId}. Attempting to load from DB.`);
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
    console.log(`ConversationManager (ID: ${this.managerId}): Conversation ${conversationId} not found in memory or DB.`);
    return undefined;
  }

  /**
   * Saves a conversation context.
   * Updates it in the in-memory cache and persists to the database if enabled.
   *
   * @public
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
   * @public
   * @async
   * @param {string} conversationId - The ID of the conversation to delete.
   * @returns {Promise<boolean>} True if deletion was successful or conversation didn't exist in the first place; false on DB error (excluding not found).
   */
  public async deleteConversation(conversationId: string): Promise<boolean> {
    this.ensureInitialized();
    const wasInMemory = this.activeConversations.delete(conversationId);

    if (this.config.persistenceEnabled && this.prisma) {
      try {
        await this.prisma.conversation.delete({ where: { id: conversationId } });
        console.log(`ConversationManager (ID: ${this.managerId}): Conversation ${conversationId} deleted from DB.`);
      } catch (error: any) {
        if (error.code === 'P2025') { // Prisma's "Record to delete does not exist"
          console.log(`ConversationManager (ID: ${this.managerId}): Conversation ${conversationId} not found in DB for deletion (or already deleted).`);
        } else {
          console.error(`ConversationManager (ID: ${this.managerId}): Error deleting conversation ${conversationId} from DB: ${error.message}`, error);
          return false; // Indicate a true DB error
        }
      }
    }
    console.log(`ConversationManager (ID: ${this.managerId}): Conversation ${conversationId} removed from active memory (was present: ${wasInMemory}).`);
    return true;
  }

  /**
   * Lists the IDs of all conversations currently active in memory.
   *
   * @public
   * @async
   * @returns {Promise<string[]>} An array of active conversation IDs.
   */
  public async listActiveConversationIds(): Promise<string[]> {
    this.ensureInitialized();
    return Array.from(this.activeConversations.keys());
  }

  /**
   * Retrieves summary information for contexts associated with a given session ID.
   * In the current design, `ConversationContext.sessionId` is the primary ID for a conversation.
   * If a "session" in a broader sense can encompass multiple distinct conversations,
   * this method would need adjustment or the Conversation model would need a `sessionId` field.
   * This implementation assumes `sessionId` refers to the `ConversationContext.sessionId`.
   *
   * @public
   * @async
   * @param {string} sessionId - The session ID (which is the conversation ID in this context).
   * @returns {Promise<Partial<ConversationContext>[]>} An array containing a partial representation
   * of the conversation context if found, otherwise an empty array.
   */
  public async listContextsForSession(sessionId: string): Promise<Partial<Pick<ConversationContext, 'sessionId' | 'createdAt'>>[]> {
    this.ensureInitialized();
    const context = this.activeConversations.get(sessionId);
    if (context) {
      return [{ sessionId: context.sessionId, createdAt: context.createdAt }];
    }
    // Optionally, try loading from DB if not in memory to provide info
    if (this.config.persistenceEnabled && this.prisma) {
        const dbConvo = await this.prisma.conversation.findUnique({
            where: { id: sessionId },
            select: { id: true, createdAt: true }
        });
        if (dbConvo) {
            return [{ sessionId: dbConvo.id, createdAt: dbConvo.createdAt.getTime() }];
        }
    }
    return [];
  }

  /**
   * Gets the last active time for a conversation, typically the timestamp of the last message or update.
   * Checks in-memory cache first, then persistent storage if enabled.
   *
   * @public
   * @async
   * @param {string} conversationId - The ID of the conversation.
   * @returns {Promise<number | undefined>} Timestamp of last activity (Unix epoch ms), or undefined if not found.
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
          select: { updatedAt: true } // 'updatedAt' is a good proxy for last activity
        });
        return convo?.updatedAt.getTime();
      } catch (error) {
        console.error(`ConversationManager (ID: ${this.managerId}): Error fetching 'updatedAt' for conversation ${conversationId} from DB:`, error);
        return undefined;
      }
    }
    return undefined;
  }

  /**
   * Evicts the oldest (Least Recently Used based on `_lastAccessed` metadata)
   * conversation from the in-memory cache.
   * If persistence is enabled, ensures the conversation is saved to DB before eviction.
   * @private
   * @async
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
      console.warn(`ConversationManager (ID: ${this.managerId}): Max in-memory conversations reached (${this.activeConversations.size}/${this.config.maxActiveConversationsInMemory}). Evicting conversation ${oldestSessionId}. Last accessed: ${new Date(oldestTimestamp).toISOString()}`);
      
      if (contextToEvict && this.config.persistenceEnabled && this.prisma) {
        try {
          await this.saveConversationToDB(contextToEvict);
          console.log(`ConversationManager (ID: ${this.managerId}): Successfully saved conversation ${oldestSessionId} to DB before eviction.`);
        } catch (error) {
          console.error(`ConversationManager (ID: ${this.managerId}): Failed to save conversation ${oldestSessionId} to DB before eviction. Data might be lost if not already persisted. Error:`, error);
        }
      }
      this.activeConversations.delete(oldestSessionId);
    }
  }

  /**
   * Saves a ConversationContext to the database using Prisma.
   * This is an upsert operation: creates if not exists, updates if exists.
   * Handles serialization of messages and metadata within a transaction.
   *
   * @async
   * @private
   * @param {ConversationContext} context - The ConversationContext to save.
   * @throws {GMIError} If the database operation fails.
   */
  private async saveConversationToDB(context: ConversationContext): Promise<void> {
    if (!this.prisma || !this.config.persistenceEnabled) return;
    
    const contextJSON = context.toJSON() as {
        sessionId: string;
        createdAt: number;
        messages: InternalConversationMessage[];
        config: any; // Contains utilityAIServiceId
        sessionMetadata: Record<string, any>;
    };

    try {
      await this.prisma.$transaction(async (tx) => {
        const conversationUpdateData = {
          userId: context.userId, // Assuming userId is a direct property or getter on ConversationContext
          gmiInstanceId: context.gmiInstanceId,
          title: (contextJSON.sessionMetadata?.title as string) || `Conversation from ${new Date(context.createdAt).toLocaleDateString()}`,
          language: context.currentLanguage,
          sessionDetails: contextJSON.sessionMetadata || {},
          isArchived: (contextJSON.sessionMetadata?.isArchived as boolean) ?? false,
          tags: (contextJSON.sessionMetadata?.tags as string[]) ?? [],
          updatedAt: new Date(),
        };

        await tx.conversation.upsert({
          where: { id: context.sessionId },
          update: conversationUpdateData,
          create: {
            id: context.sessionId,
            createdAt: new Date(context.createdAt),
            ...conversationUpdateData,
          },
        });

        await tx.conversationMessage.deleteMany({ where: { conversationId: context.sessionId } });

        if (contextJSON.messages && contextJSON.messages.length > 0) {
          const messagesToCreate = contextJSON.messages.map((msg): PrismaMessageCreateInput => {
            // Ensure complex objects are valid JSON or null for Prisma
            const serializeIfObject = (data: any): object | null => (typeof data === 'object' && data !== null) ? data : null;
            
            return {
              id: msg.id,
              role: msg.role.toString(),
              content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content), // Stringify if not already string
              timestamp: new Date(msg.timestamp), // Prisma 'createdAt' for message will be auto by DB
              tool_calls: serializeIfObject(msg.tool_calls),
              toolCallId: msg.tool_call_id,
              multimodalData: serializeIfObject((msg as any).multimodalData),
              audioUrl: (msg as any).audioUrl,
              audioTranscript: (msg as any).audioTranscript,
              voiceSettings: serializeIfObject((msg as any).voiceSettings),
              // Prisma model for ConversationMessage doesn't have 'name', 'originalMessagesSummarizedCount', or a generic 'metadata' field.
              // These would need schema changes or be stored within 'content' or 'sessionDetails' of the Conversation.
              // For now, fields not in Prisma's ConversationMessage model are omitted.
            };
          });

          // Batch create messages
          await tx.conversationMessage.createMany({
            data: messagesToCreate.map(m => ({...m, conversationId: context.sessionId })),
          });
        }
      });
      // console.debug(`ConversationManager (ID: ${this.managerId}): Conversation ${context.sessionId} successfully saved to DB.`);
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
   * @throws {GMIError} If the database operation fails or data inconsistency is detected.
   */
  private async loadConversationFromDB(conversationId: string): Promise<ConversationContext | undefined> {
    if (!this.prisma || !this.config.persistenceEnabled) return undefined;

    try {
      const convoData = await this.prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });

      if (!convoData) return undefined;

      const internalMessages: InternalConversationMessage[] = convoData.messages.map(dbMsg => {
        let parsedContent: InternalConversationMessage['content'];
        try {
           // Content in DB is always string (or stringified JSON). Try to parse if it's complex.
          if (dbMsg.content && (dbMsg.content.startsWith('{') && dbMsg.content.endsWith('}')) || (dbMsg.content.startsWith('[') && dbMsg.content.endsWith(']'))) {
            parsedContent = JSON.parse(dbMsg.content);
          } else {
            parsedContent = dbMsg.content;
          }
        } catch (e) {
          console.warn(`ConversationManager (ID: ${this.managerId}): Failed to parse content for message ${dbMsg.id} from DB as JSON, using as string. Content: "${dbMsg.content?.substring(0,100)}..."`);
          parsedContent = dbMsg.content;
        }

        // Reconstruct the internal ConversationMessage.
        // Ensure all fields from InternalConversationMessage are considered.
        // Fields not in PrismaConversationMessageModel (like 'name', 'originalMessagesSummarizedCount') need to be handled:
        // they won't be populated from DB unless schema changes or they were stored in a JSON 'metadata' field.
        const messageOptions: Partial<Omit<InternalConversationMessage, 'id' | 'timestamp' | 'role' | 'content'>> = {
            tool_calls: dbMsg.toolCalls ? (dbMsg.toolCalls as any) : undefined,
            tool_call_id: dbMsg.toolCallId || undefined,
            metadata: dbMsg.metadata ? (dbMsg.metadata as any) : undefined, // If Prisma model had a metadata field
            // Map multimodal and voice fields
            ...(dbMsg.multimodalData && { multimodalData: dbMsg.multimodalData as any }),
            ...((dbMsg as any).audioUrl && { audioUrl: (dbMsg as any).audioUrl }),
            ...((dbMsg as any).audioTranscript && { audioTranscript: (dbMsg as any).audioTranscript }),
            ...((dbMsg as any).voiceSettings && { voiceSettings: (dbMsg as any).voiceSettings as any }),
        };
        // Add 'name' if it were present in Prisma model or part of a JSON metadata field.
        // if (dbMsg.name) messageOptions.name = dbMsg.name;


        return createConversationMessage(
            dbMsg.role as MessageRole, // Ensure role string from DB is valid MessageRole
            parsedContent,
            {
                ...messageOptions, // Spread other properties
                id: dbMsg.id, // Use the ID from DB
                timestamp: dbMsg.createdAt.getTime(), // Use createdAt as the message timestamp
            }
        );
      });
      
      const sessionMetadataFromDB = convoData.sessionDetails as Record<string, any> || {};

      // Reconstruct the ConversationContextConfig that was active when this context was last saved, if stored.
      // Or, apply current defaults and allow overrides from sessionMetadata.
      const contextSpecificConfig = (sessionMetadataFromDB.contextConfigOverrides as Partial<ConversationContextConfig>) || {};
      const finalContextConfig: ConversationContextConfig = {
        ...this.config.defaultConversationContextConfig, // Start with manager defaults
        userId: convoData.userId || this.config.defaultConversationContextConfig?.userId,
        gmiInstanceId: convoData.gmiInstanceId || this.config.defaultConversationContextConfig?.gmiInstanceId,
        activePersonaId: (sessionMetadataFromDB.activePersonaId as string) || this.config.defaultConversationContextConfig?.activePersonaId,
        utilityAI: this.utilityAIService, // Always inject current utilityAI instance
        ...contextSpecificConfig, // Apply persisted context-specific overrides
      } as ConversationContextConfig; // Ensure all required fields are present

      // Use ConversationContext.fromJSON for robust rehydration
      const context = ConversationContext.fromJSON(
        {
          sessionId: convoData.id,
          createdAt: convoData.createdAt.getTime(),
          messages: internalMessages,
          config: { // This config is for fromJSON's internal use, not the full ConversationContextConfig
            ...finalContextConfig, // Pass full config for fromJSON to pick what it needs
            utilityAIServiceId: this.utilityAIService?.utilityId, // For fromJSON to potentially re-fetch if provider was different
          },
          sessionMetadata: sessionMetadataFromDB,
        },
        (serviceId) => { // utilityAIProvider function for fromJSON
            if (this.utilityAIService && serviceId === this.utilityAIService.utilityId) {
                return this.utilityAIService;
            }
            // Log if a different serviceId was stored but cannot be resolved now
            if (serviceId && (!this.utilityAIService || serviceId !== this.utilityAIService.utilityId)) {
                console.warn(`ConversationManager (ID: ${this.managerId}): Conversation ${conversationId} stored utilityAIServiceId '${serviceId}' which differs from current or is unavailable.`);
            }
            return this.utilityAIService; // Default to current manager's service
        }
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
   * If persistence is enabled, ensures all active conversations are saved to the database.
   * Clears the in-memory cache of conversations.
   *
   * @public
   * @async
   * @returns {Promise<void>}
   */
  public async shutdown(): Promise<void> {
    if (!this.initialized) {
        console.warn(`ConversationManager (ID: ${this.managerId}) shutdown called but was not initialized.`);
        return;
    }
    console.log(`ConversationManager (ID: ${this.managerId}): Shutting down...`);
    if (this.config.persistenceEnabled && this.prisma) {
      console.log(`ConversationManager (ID: ${this.managerId}): Saving all active conversations (${this.activeConversations.size}) before shutdown...`);
      let savedCount = 0;
      for (const context of this.activeConversations.values()) {
        try {
          await this.saveConversationToDB(context);
          savedCount++;
        } catch (error) {
          console.error(`ConversationManager (ID: ${this.managerId}): Error saving conversation ${context.sessionId} during shutdown:`, error);
        }
      }
      console.log(`ConversationManager (ID: ${this.managerId}): ${savedCount} active conversations processed for saving.`);
    }
    this.activeConversations.clear();
    this.initialized = false; // Mark as not initialized after cleanup
    console.log(`ConversationManager (ID: ${this.managerId}): Shutdown complete. In-memory cache cleared.`);
  }
}