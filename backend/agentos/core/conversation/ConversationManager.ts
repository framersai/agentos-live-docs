// backend/agentos/core/conversation/ConversationManager.ts

import { ConversationContext, ConversationContextConfig } from './ConversationContext';
import { IUtilityAI } from '../ai_utilities/IUtilityAI.js'; // To inject into new contexts
import { v4 as uuidv4 } from 'uuid';

/**
 * @fileoverview Manages the lifecycle of ConversationContext instances in AgentOS.
 * Responsible for creating, retrieving, and potentially persisting conversation states.
 * @module agentos/core/conversation/ConversationManager
 */

/**
 * Configuration for the ConversationManager.
 */
export interface ConversationManagerConfig {
  /** Default configuration to apply to all new ConversationContext instances. */
  defaultConversationContextConfig?: Partial<ConversationContextConfig>;
  /**
   * Maximum number of active conversations to keep in memory.
   * If exceeded, older, inactive conversations might be evicted (if not persisted).
   * @default 1000
   */
  maxActiveConversationsInMemory?: number;
  /**
   * Inactivity timeout in milliseconds. If a conversation is inactive for this long,
   * it might be marked for eviction from memory or archival (if persistence is enabled).
   * @default 3600000 (1 hour)
   */
  inactivityTimeoutMs?: number;
  // Future: Persistence options (e.g., database type, connection string)
}

/**
 * @class ConversationManager
 * Manages ConversationContext instances for AgentOS.
 */
export class ConversationManager {
  private config!: Required<ConversationManagerConfig>;
  private activeConversations: Map<string, ConversationContext> = new Map();
  private utilityAIService?: IUtilityAI; // Default UtilityAI for new contexts
  private initialized: boolean = false;

  constructor() {}

  /**
   * Initializes the ConversationManager.
   * @param {ConversationManagerConfig} config - Configuration for the manager.
   * @param {IUtilityAI} [utilityAIService] - Optional default IUtilityAI instance to inject into new ConversationContexts.
   */
  public async initialize(
    config: ConversationManagerConfig,
    utilityAIService?: IUtilityAI
  ): Promise<void> {
    if (this.initialized) {
      console.warn("ConversationManager already initialized.");
      return;
    }
    this.config = {
      defaultConversationContextConfig: {},
      maxActiveConversationsInMemory: 1000,
      inactivityTimeoutMs: 3600000,
      ...config,
    };
    this.utilityAIService = utilityAIService;
    this.initialized = true;
    console.log(`ConversationManager initialized. Max in-memory conversations: ${this.config.maxActiveConversationsInMemory}.`);
    // Future: Connect to persistence layer if configured
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error("ConversationManager is not initialized. Call initialize() first.");
    }
  }

  /**
   * Creates a new conversation session.
   * @param {string} [userId] - Optional ID of the user starting the conversation.
   * @param {string} [initialAgentId] - Optional ID of the agent to be initially active.
   * @param {Record<string, any>} [initialMetadata] - Optional initial metadata for the session.
   * @param {Partial<ConversationContextConfig>} [overrideConfig] - Config overrides for this specific context.
   * @returns {Promise<ConversationContext>} The newly created ConversationContext.
   */
  public async createConversation(
    userId?: string,
    initialAgentId?: string,
    initialMetadata: Record<string, any> = {},
    overrideConfig?: Partial<ConversationContextConfig>
  ): Promise<ConversationContext> {
    this.ensureInitialized();
    const sessionId = `sess_${uuidv4()}`;

    const contextConfig: Partial<ConversationContextConfig> = {
      ...(this.config.defaultConversationContextConfig || {}),
      userId: userId || this.config.defaultConversationContextConfig?.userId,
      initialAgentId: initialAgentId || this.config.defaultConversationContextConfig?.initialAgentId,
      utilityAI: this.utilityAIService || this.config.defaultConversationContextConfig?.utilityAI,
      ...(overrideConfig || {}),
    };

    const newContext = new ConversationContext(sessionId, contextConfig, [], initialMetadata);

    if (this.activeConversations.size >= this.config.maxActiveConversationsInMemory) {
      // Simple eviction: remove the oldest accessed (conceptual, needs lastAccess tracking)
      // For now, remove a random one if full (not ideal for production)
      const firstKey = this.activeConversations.keys().next().value;
      if (firstKey) {
        console.warn(`ConversationManager: Max in-memory conversations reached. Evicting session ${firstKey} to make space.`);
        this.activeConversations.delete(firstKey);
      }
    }
    this.activeConversations.set(sessionId, newContext);
    console.log(`ConversationManager: Created new conversation ${sessionId} for user ${userId || 'anonymous'}.`);
    return newContext;
  }

  /**
   * Retrieves an existing conversation by its session ID.
   * @param {string} sessionId - The ID of the conversation to retrieve.
   * @returns {Promise<ConversationContext | undefined>} The ConversationContext, or undefined if not found.
   */
  public async getConversation(sessionId: string): Promise<ConversationContext | undefined> {
    this.ensureInitialized();
    const context = this.activeConversations.get(sessionId);
    if (context) {
      // Update last accessed timestamp (conceptual)
      // context.setMetadata('_lastAccessed', Date.now());
      return context;
    }
    // Future: Attempt to load from persistence if not in memory
    // console.warn(`ConversationManager: Conversation ${sessionId} not found in active memory.`);
    return undefined;
  }

  /**
   * Saves the state of a conversation.
   * In this basic in-memory version, this might just ensure it's in the map.
   * For persistent storage, this would write to a database.
   * @param {ConversationContext} context - The conversation context to save.
   * @returns {Promise<void>}
   */
  public async saveConversation(context: ConversationContext): Promise<void> {
    this.ensureInitialized();
    if (!this.activeConversations.has(context.sessionId)) {
        if (this.activeConversations.size >= this.config.maxActiveConversationsInMemory) {
            // Eviction logic as in createConversation
            const firstKey = this.activeConversations.keys().next().value;
            if (firstKey) this.activeConversations.delete(firstKey);
        }
    }
    this.activeConversations.set(context.sessionId, context); // Ensure it's in the map / updated
    // Future: Persist context.toJSON() to a database
    // console.log(`ConversationManager: Conversation ${context.sessionId} state updated in memory.`);
  }

  /**
   * Deletes a conversation from active memory (and persistence if implemented).
   * @param {string} sessionId - The ID of the conversation to delete.
   * @returns {Promise<boolean>} True if deletion was successful (or session didn't exist), false on error.
   */
  public async deleteConversation(sessionId: string): Promise<boolean> {
    this.ensureInitialized();
    this.activeConversations.delete(sessionId);
    // Future: Delete from persistence layer
    console.log(`ConversationManager: Conversation ${sessionId} removed from active memory.`);
    return true;
  }

  /**
   * Lists currently active (in-memory) conversation session IDs.
   * @returns {Promise<string[]>}
   */
  public async listActiveConversationIds(): Promise<string[]> {
      this.ensureInitialized();
      return Array.from(this.activeConversations.keys());
  }

  /**
   * Periodically cleans up inactive conversations from memory (if persistence is not used, this means data loss).
   * This should be called by a separate cleanup task or scheduler.
   */
  public async cleanupInactiveConversations(): Promise<void> {
    this.ensureInitialized();
    const now = Date.now();
    let cleanedCount = 0;
    for (const [sessionId, context] of this.activeConversations.entries()) {
      const lastAccessed = context.getMetadata('_lastAccessed') || context.createdAt;
      if (now - lastAccessed > this.config.inactivityTimeoutMs) {
        // Future: if persisted, just remove from memory. If not, it's deleted.
        this.activeConversations.delete(sessionId);
        cleanedCount++;
        console.log(`ConversationManager: Cleaned up inactive conversation ${sessionId}.`);
      }
    }
    if (cleanedCount > 0) {
      console.log(`ConversationManager: Cleaned up ${cleanedCount} inactive conversations.`);
    }
  }
}