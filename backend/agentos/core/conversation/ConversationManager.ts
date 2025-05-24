/**
 * @fileoverview Manages the lifecycle of ConversationContext instances in AgentOS.
 * Responsible for creating, retrieving, storing (in-memory for now, extensible
 * for persistence), and managing active conversation states.
 *
 * @module backend/agentos/core/conversation/ConversationManager
 * @see ./ConversationContext.ts
 * @see ../ai_utilities/IUtilityAI.ts
 */

import { ConversationContext, ConversationContextConfig } from './ConversationContext';
import { IUtilityAI } from '../ai_utilities/IUtilityAI';
import { v4 as uuidv4 } from 'uuid';
import { GMIError, GMIErrorCode } from '../../../utils/errors';
import { PrismaClient, Conversation as PrismaConversation, Message as PrismaMessage } from '@prisma/client'; // For persistence
import { MessageRole } from './ConversationMessage'; // For mapping

/**
 * Configuration for the ConversationManager.
 */
export interface ConversationManagerConfig {
  defaultConversationContextConfig?: Partial<ConversationContextConfig>;
  maxActiveConversationsInMemory?: number;
  inactivityTimeoutMs?: number;
  persistenceEnabled?: boolean; // Controls if Prisma is used
}

// Helper type for Prisma message creation
type PrismaMessageCreateInput = Omit<PrismaMessage, 'id' | 'conversationId' | 'timestamp'> & {
    timestamp?: Date; // Prisma expects Date, ConversationMessage uses number
    tool_calls?: any; // Prisma schema might need adjustment for JSON `tool_calls`
    metadata?: any;   // Prisma schema might need adjustment for JSON `metadata`
};


/**
 * @class ConversationManager
 * Manages ConversationContext instances for AgentOS.
 */
export class ConversationManager {
  private config!: Required<ConversationManagerConfig>;
  private activeConversations: Map<string, ConversationContext>; // sessionId -> ConversationContext
  private utilityAIService?: IUtilityAI;
  private prisma?: PrismaClient; // Optional Prisma client for persistence
  private initialized: boolean = false;
  public readonly managerId: string;

  constructor() {
    this.managerId = `conv-mgr-${uuidv4()}`;
    this.activeConversations = new Map();
  }

  /**
   * Initializes the ConversationManager.
   * @param {ConversationManagerConfig} config - Configuration for the manager.
   * @param {IUtilityAI} [utilityAIService] - Optional IUtilityAI instance for new ConversationContexts.
   * @param {PrismaClient} [prismaClient] - Optional Prisma client for database persistence.
   */
  public async initialize(
    config: ConversationManagerConfig,
    utilityAIService?: IUtilityAI,
    prismaClient?: PrismaClient
  ): Promise<void> {
    if (this.initialized) {
      console.warn(`ConversationManager (ID: ${this.managerId}) already initialized.`);
      return;
    }
    this.config = {
      defaultConversationContextConfig: {},
      maxActiveConversationsInMemory: 1000,
      inactivityTimeoutMs: 3600000, // 1 hour
      persistenceEnabled: false,
      ...config,
    };
    this.utilityAIService = utilityAIService;
    this.prisma = this.config.persistenceEnabled ? prismaClient : undefined;

    if (this.config.persistenceEnabled && !this.prisma) {
        console.warn(`ConversationManager (ID: ${this.managerId}): Persistence is enabled in config, but no PrismaClient was provided. Persistence will be disabled.`);
        (this.config as any).persistenceEnabled = false;
    }

    this.initialized = true;
    console.log(`ConversationManager (ID: ${this.managerId}) initialized. Persistence: ${this.config.persistenceEnabled}.`);
    // TODO: Start periodic cleanup task if needed:
    // if (this.config.inactivityTimeoutMs > 0) {
    //   setInterval(() => this.cleanupInactiveConversations(), this.config.inactivityTimeoutMs / 2);
    // }
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new GMIError("ConversationManager is not initialized. Call initialize() first.", GMIErrorCode.NOT_INITIALIZED, { managerId: this.managerId });
    }
  }

  /**
   * Creates a new conversation context or retrieves an existing one if `sessionId` is provided and found.
   * If `sessionId` is provided but not found, it attempts to load from persistence if enabled,
   * otherwise creates a new one with that ID. If no `sessionId` is provided, a new one is generated.
   *
   * @param {string} [sessionId] - Optional ID of an existing session.
   * @param {string} [userId] - ID of the user.
   * @param {string} [gmiInstanceId] - ID of the GMI instance this conversation is for.
   * @param {string} [activePersonaId] - ID of the active persona.
   * @param {Record<string, any>} [initialMetadata] - Initial metadata.
   * @param {Partial<ConversationContextConfig>} [overrideConfig] - Config overrides.
   * @returns {Promise<ConversationContext>} The created or retrieved ConversationContext.
   */
  public async getOrCreateConversationContext(
    sessionId?: string,
    userId?: string,
    gmiInstanceId?: string,
    activePersonaId?: string,
    initialMetadata: Record<string, any> = {},
    overrideConfig?: Partial<ConversationContextConfig>
  ): Promise<ConversationContext> {
    this.ensureInitialized();
    const effectiveSessionId = sessionId || `conv_${uuidv4()}`; // Use provided or generate new

    let context = this.activeConversations.get(effectiveSessionId);
    if (context) {
      // Update context identifiers if provided and different (e.g., user re-associated with session)
      if(userId && context.userId !== userId) context.setMetadata('userId', userId);
      if(gmiInstanceId && context.gmiInstanceId !== gmiInstanceId) context.setMetadata('gmiInstanceId', gmiInstanceId);
      if(activePersonaId && context.activePersonaId !== activePersonaId) context.setMetadata('activePersonaId', activePersonaId);
      // context.setMetadata('_lastAccessed', Date.now()); // Conceptual: for LRU eviction
      return context;
    }

    // Try to load from persistence if enabled and sessionId was provided
    if (sessionId && this.config.persistenceEnabled && this.prisma) {
      const loadedContext = await this.loadConversationFromDB(sessionId);
      if (loadedContext) {
        if (this.activeConversations.size >= this.config.maxActiveConversationsInMemory) {
          this.evictOldestConversation();
        }
        this.activeConversations.set(sessionId, loadedContext);
        return loadedContext;
      }
    }

    // Create new context
    const contextConfig: Partial<ConversationContextConfig> = {
      ...(this.config.defaultConversationContextConfig || {}),
      userId: userId || this.config.defaultConversationContextConfig?.userId,
      gmiInstanceId: gmiInstanceId || this.config.defaultConversationContextConfig?.gmiInstanceId,
      activePersonaId: activePersonaId || this.config.defaultConversationContextConfig?.activePersonaId,
      utilityAI: this.utilityAIService || this.config.defaultConversationContextConfig?.utilityAI,
      ...(overrideConfig || {}),
    };

    const newContext = new ConversationContext(effectiveSessionId, contextConfig, [], initialMetadata);

    if (this.activeConversations.size >= this.config.maxActiveConversationsInMemory) {
      this.evictOldestConversation();
    }
    this.activeConversations.set(effectiveSessionId, newContext);

    if (this.config.persistenceEnabled && this.prisma) {
      await this.saveConversationToDB(newContext); // Save new context immediately
    }
    console.log(`ConversationManager (ID: ${this.managerId}): Created/retrieved conversation ${effectiveSessionId}.`);
    return newContext;
  }


  public async getConversation(sessionId: string): Promise<ConversationContext | undefined> {
    this.ensureInitialized();
    let context = this.activeConversations.get(sessionId);
    if (context) {
      // context.setMetadata('_lastAccessed', Date.now()); // For LRU
      return context;
    }
    if (this.config.persistenceEnabled && this.prisma) {
      context = await this.loadConversationFromDB(sessionId);
      if (context) {
        if (this.activeConversations.size >= this.config.maxActiveConversationsInMemory) {
          this.evictOldestConversation();
        }
        this.activeConversations.set(sessionId, context);
        return context;
      }
    }
    return undefined;
  }

  public async saveConversation(context: ConversationContext): Promise<void> {
    this.ensureInitialized();
    // Always update in-memory map (even if it's the same instance, ensures it's "active")
    if (!this.activeConversations.has(context.sessionId) && this.activeConversations.size >= this.config.maxActiveConversationsInMemory) {
        this.evictOldestConversation();
    }
    this.activeConversations.set(context.sessionId, context);

    if (this.config.persistenceEnabled && this.prisma) {
      await this.saveConversationToDB(context);
    }
  }

  public async deleteConversation(sessionId: string): Promise<boolean> {
    this.ensureInitialized();
    this.activeConversations.delete(sessionId);
    if (this.config.persistenceEnabled && this.prisma) {
      try {
        await this.prisma.conversation.delete({ where: { id: sessionId } });
        // Related messages are cascade deleted by Prisma schema usually
        console.log(`ConversationManager (ID: ${this.managerId}): Conversation ${sessionId} deleted from DB.`);
      } catch (error: any) {
        console.error(`ConversationManager (ID: ${this.managerId}): Error deleting conversation ${sessionId} from DB: ${error.message}`, error);
        return false;
      }
    }
    console.log(`ConversationManager (ID: ${this.managerId}): Conversation ${sessionId} removed from active memory.`);
    return true;
  }

  public async listActiveConversationIds(): Promise<string[]> {
    this.ensureInitialized();
    return Array.from(this.activeConversations.keys());
  }

  public async listContextsForSession(sessionId: string): Promise<Partial<ConversationContext>[]> {
    this.ensureInitialized();
    // In current model, one sessionId maps to one ConversationContext.
    // If a session could have multiple "threads" or contexts, this would be different.
    const context = this.activeConversations.get(sessionId);
    return context ? [ { sessionId: context.sessionId, createdAt: context.createdAt, /* other safe fields */ } ] : [];
  }

  public async getLastActiveTimeForConversation(sessionId: string): Promise<number | undefined> {
    this.ensureInitialized();
    const context = this.activeConversations.get(sessionId);
    if (context) {
        const lastMessage = context.getLastMessage();
        return lastMessage?.timestamp || context.createdAt;
    }
    // If persisted, could fetch from DB
    if (this.config.persistenceEnabled && this.prisma) {
        const convo = await this.prisma.conversation.findUnique({
            where: { id: sessionId },
            select: { updatedAt: true } // Assuming Prisma schema has updatedAt
        });
        return convo?.updatedAt.getTime();
    }
    return undefined;
}


  private evictOldestConversation(): void {
    // Simple LRU: find conversation with oldest '_lastAccessed' metadata or oldest 'createdAt'.
    // This is a basic implementation. A more robust one would use a proper LRU cache structure.
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
      console.warn(`ConversationManager (ID: ${this.managerId}): Max in-memory conversations reached. Evicting session ${oldestSessionId}.`);
      // If persistence is enabled, ensure it's saved before eviction from memory map.
      // This is implicitly handled by calling `saveConversation` before eviction if needed.
      this.activeConversations.delete(oldestSessionId);
    }
  }

  private async saveConversationToDB(context: ConversationContext): Promise<void> {
    if (!this.prisma || !this.config.persistenceEnabled) return;
    const contextJSON = context.toJSON() as any; // Get full serializable state

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.conversation.upsert({
          where: { id: context.sessionId },
          update: {
            userId: context.userId,
            gmiInstanceId: context.gmiInstanceId,
            activePersonaId: context.activePersonaId,
            metadata: contextJSON.sessionMetadata || {},
            // `updatedAt` will be auto-updated by Prisma
          },
          create: {
            id: context.sessionId,
            createdAt: new Date(context.createdAt),
            userId: context.userId,
            gmiInstanceId: context.gmiInstanceId,
            activePersonaId: context.activePersonaId,
            metadata: contextJSON.sessionMetadata || {},
          },
        });

        // Delete existing messages for this conversation before upserting new batch
        // This is a simple way to sync; more granular upsert is complex for ordered lists
        await tx.message.deleteMany({ where: { conversationId: context.sessionId }});

        if (contextJSON.messages && contextJSON.messages.length > 0) {
          const messagesToCreate: PrismaMessageCreateInput[] = contextJSON.messages.map((msg: any) => ({
            id: msg.id,
            role: msg.role.toUpperCase(), // Prisma enum might be uppercase
            content: msg.content,
            timestamp: new Date(msg.timestamp),
            name: msg.name,
            tool_calls: msg.tool_calls ? JSON.parse(JSON.stringify(msg.tool_calls)) : undefined, // Ensure it's valid JSON for Prisma
            tool_call_id: msg.tool_call_id,
            originalMessagesSummarizedCount: msg.originalMessagesSummarizedCount,
            metadata: msg.metadata ? JSON.parse(JSON.stringify(msg.metadata)) : undefined,
          }));
          await tx.message.createMany({
            data: messagesToCreate.map(m => ({...m, conversationId: context.sessionId })),
          });
        }
      });
      // console.debug(`ConversationManager (ID: ${this.managerId}): Conversation ${context.sessionId} saved to DB.`);
    } catch (error: any) {
      console.error(`ConversationManager (ID: ${this.managerId}): Error saving conversation ${context.sessionId} to DB: ${error.message}`, error);
      throw new GMIError(`Failed to save conversation ${context.sessionId} to database.`, GMIErrorCode.DATABASE_ERROR, { underlyingError: error.toString() });
    }
  }

  private async loadConversationFromDB(sessionId: string): Promise<ConversationContext | undefined> {
    if (!this.prisma || !this.config.persistenceEnabled) return undefined;

    try {
      const convoData = await this.prisma.conversation.findUnique({
        where: { id: sessionId },
        include: { messages: { orderBy: { timestamp: 'asc' } } },
      });

      if (!convoData) return undefined;

      const messages: ConversationMessage[] = convoData.messages.map(dbMsg => ({
        id: dbMsg.id,
        role: dbMsg.role.toLowerCase() as MessageRole, // Map DB enum to ConversationMessage enum
        content: dbMsg.content,
        timestamp: dbMsg.timestamp.getTime(),
        name: dbMsg.name || undefined,
        tool_calls: dbMsg.tool_calls ? (dbMsg.tool_calls as any) : undefined, // Prisma returns JSON type as JsonValue
        tool_call_id: dbMsg.tool_call_id || undefined,
        originalMessagesSummarizedCount: dbMsg.originalMessagesSummarizedCount || undefined,
        metadata: dbMsg.metadata ? (dbMsg.metadata as any) : undefined,
      }));

      // Reconstruct config for the context, including injecting utilityAI if available
      const contextConfig: Partial<ConversationContextConfig> = {
        ...(this.config.defaultConversationContextConfig || {}),
        userId: convoData.userId || undefined,
        gmiInstanceId: convoData.gmiInstanceId || undefined,
        activePersonaId: convoData.activePersonaId || undefined,
        utilityAI: this.utilityAIService || this.config.defaultConversationContextConfig?.utilityAI,
        // Other config flags like summarization options should be part of default or persisted with ConversationContext itself if they were dynamic
      };
      
      const context = new ConversationContext(
          convoData.id,
          contextConfig,
          messages,
          convoData.metadata as Record<string, any> || {}
      );
      // Restore createdAt from DB
      (context as { -readonly [P in 'createdAt']: number }).createdAt = convoData.createdAt.getTime();

      console.log(`ConversationManager (ID: ${this.managerId}): Conversation ${sessionId} loaded from DB.`);
      return context;
    } catch (error: any) {
      console.error(`ConversationManager (ID: ${this.managerId}): Error loading conversation ${sessionId} from DB: ${error.message}`, error);
      throw new GMIError(`Failed to load conversation ${sessionId} from database.`, GMIErrorCode.DATABASE_ERROR, { underlyingError: error.toString() });
    }
  }


  public async shutdown(): Promise<void> {
    this.ensureInitialized();
    console.log(`ConversationManager (ID: ${this.managerId}): Shutting down...`);
    // If persistence is enabled, ensure all active conversations are saved
    if (this.config.persistenceEnabled && this.prisma) {
      for (const context of this.activeConversations.values()) {
        try {
          await this.saveConversationToDB(context);
        } catch (error) {
          console.error(`ConversationManager (ID: ${this.managerId}): Error saving conversation ${context.sessionId} during shutdown:`, error);
        }
      }
    }
    this.activeConversations.clear();
    this.initialized = false;
    console.log(`ConversationManager (ID: ${this.managerId}): Shutdown complete.`);
  }
}