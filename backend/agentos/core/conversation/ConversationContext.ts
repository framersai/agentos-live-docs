// backend/agentos/core/conversation/ConversationContext.ts

import { ConversationMessage, MessageRole } from './ConversationMessage';
import { IUtilityAI, SummarizationOptions } from '../ai_utilities/IUtilityAI'; // Full import for type usage
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

/**
 * @fileoverview Manages the state, history, and metadata of a conversation in AgentOS.
 * It provides robust methods for adding messages, retrieving history with various strategies
 * (including AI-powered summarization if a utility service is provided),
 * and managing session-specific metadata. Designed for comprehensive state export.
 * @module agentos/core/conversation/ConversationContext
 */

/**
 * Configuration for the ConversationContext, allowing fine-grained control
 * over history management, summarization, and default behaviors.
 */
export interface ConversationContextConfig {
  /**
   * Maximum number of messages to keep in the active, verbatim history.
   * Older messages beyond this limit may be subjected to summarization or truncation.
   * @default 100
   */
  maxHistoryLengthMessages?: number;
  /**
   * If true, enables automatic summarization of older parts of the conversation
   * when history grows significantly beyond `maxHistoryLengthMessages`.
   * Requires an `IUtilityAI` service with summarization capabilities to be provided to the context.
   * @default false
   */
  enableAutomaticSummarization?: boolean;
  /**
   * Number of recent messages (tail) to always keep verbatim, even if summarization is active.
   * @default 10
   */
  messagesToKeepVerbatimTail?: number;
   /**
   * Number of initial messages (head) to always keep verbatim (e.g., initial system prompts, user setup).
   * These are preserved even if summarization is active for middle parts.
   * @default 2
   */
  messagesToKeepVerbatimHead?: number;
  /**
   * When summarization is active, this is the target number of older messages (from the "middle" section)
   * that will be grouped and summarized into a single `MessageRole.SUMMARY` message.
   * @default 20
   */
  summarizationChunkSize?: number;
  /** Default options passed to the `IUtilityAI` service for history summarization. */
  summarizationOptions?: SummarizationOptions;
  /**
   * Optional UtilityAI service instance for tasks like automatic history summarization.
   * Must be provided if `enableAutomaticSummarization` is true for summarization to occur.
   */
  utilityAI?: IUtilityAI;
  /**
   * Default language for the conversation (e.g., 'en-US', 'es-MX', 'auto').
   * This can influence TTS, STT, and some `IUtilityAI` functions (e.g., stop words, sentiment lexicons).
   * Can be overridden by session metadata 'currentLanguage'.
   * @default 'en-US'
   */
  defaultLanguage?: string;
  /**
   * The ID of the primary user associated with this conversation.
   * Crucial for personalization, memory systems, and logging.
   */
  userId?: string;
  /**
   * The ID of the primary/initial agent this conversation is with.
   * Can be updated via metadata if agent handoff occurs.
   */
  initialAgentId?: string;
}

/**
 * @class ConversationContext
 * Manages the messages, metadata, and overall state for a single conversation.
 * Supports robust history management including optional AI-powered summarization.
 * Designed for comprehensive state export via its `toJSON` method.
 */
export class ConversationContext {
  /** Unique, immutable identifier for this conversation session. */
  public readonly sessionId: string;
  /** Timestamp (Unix epoch ms) of when the conversation was initiated. */
  public readonly createdAt: number;
  /** The chronological list of all messages in the conversation, including original and summary messages. */
  private messages: ConversationMessage[];
  /** Configuration for this context instance, combining defaults with provided options. */
  private readonly config: Required<ConversationContextConfig>; // Make config readonly after construction
  /**
   * Arbitrary metadata associated with the conversation session
   * (e.g., user preferences, active agent ID, session tags, current agent mood, language).
   * This is a primary mechanism for personalization and dynamic behavior.
   */
  private sessionMetadata: Record<string, any>;
  /** Reference to the IUtilityAI service for tasks like summarization. */
  private readonly utilityAI?: IUtilityAI; // Make readonly after construction

  /**
   * Creates a new ConversationContext instance.
   * @param {string} [sessionId] - Optional. A unique ID for the session. If not provided, one will be generated.
   * @param {Partial<ConversationContextConfig>} [config={}] - Optional configuration to override defaults.
   * @param {ConversationMessage[]} [initialMessages=[]] - Optional array of messages to initialize the context.
   * @param {Record<string, any>} [initialMetadata={}] - Optional initial session metadata.
   */
  constructor(
    sessionId?: string,
    config: Partial<ConversationContextConfig> = {},
    initialMessages: ConversationMessage[] = [],
    initialMetadata: Record<string, any> = {}
  ) {
    this.sessionId = sessionId || `sess_${uuidv4()}`;
    this.createdAt = Date.now();
    this.messages = initialMessages.map(m => ({ // Ensure messages are treated as new instances if pre-loaded
        ...m,
        id: m.id || `msg_${uuidv4()}`, // Ensure IDs if missing from initial set
        timestamp: m.timestamp || Date.now()
    }));

    const defaultConfig: Required<ConversationContextConfig> = {
      maxHistoryLengthMessages: 100,
      enableAutomaticSummarization: false,
      messagesToKeepVerbatimTail: 10,
      messagesToKeepVerbatimHead: 2,
      summarizationChunkSize: 20,
      summarizationOptions: { desiredLength: 'medium', method: 'abstractive_llm' },
      utilityAI: undefined,
      defaultLanguage: 'en-US',
      userId: undefined,
      initialAgentId: undefined,
      // Spread user config last to override defaults
      // Type assertion needed because Partial<ConversationContextConfig> might not satisfy all Required fields
      ...(config as Partial<Required<ConversationContextConfig>>),
    };
    this.config = defaultConfig;
    // Prioritize injected utilityAI from config over one potentially in defaultConfig structure (though it's undefined there)
    this.utilityAI = config.utilityAI || defaultConfig.utilityAI;
    this.sessionMetadata = { ...initialMetadata }; // Create a copy

    // Initialize dynamic state from config or metadata
    this.sessionMetadata.currentLanguage = this.sessionMetadata.currentLanguage || this.config.defaultLanguage;
    this.sessionMetadata.userId = this.sessionMetadata.userId || this.config.userId;
    this.sessionMetadata.currentAgentId = this.sessionMetadata.currentAgentId || this.config.initialAgentId;


    if (this.config.enableAutomaticSummarization && !this.utilityAI) {
      console.warn(`ConversationContext (ID: ${this.sessionId}): enableAutomaticSummarization is true, but no IUtilityAI service was provided. Automatic summarization will be disabled.`);
      // Ensure the config reflects this runtime state
      (this.config as any).enableAutomaticSummarization = false; // Modifying readonly for internal correction
    }
  }

  /**
   * Adds a new message to the conversation history.
   * Automatically assigns a unique ID and timestamp.
   * Triggers history management (truncation/summarization) if applicable.
   * @param {Omit<ConversationMessage, 'id' | 'timestamp'>} messageData - Data for the new message.
   * The `role` and `content` (or `tool_calls`) are essential.
   * @returns {Readonly<ConversationMessage>} The complete, added message (as a read-only copy).
   */
  public addMessage(messageData: Omit<ConversationMessage, 'id' | 'timestamp'>): Readonly<ConversationMessage> {
    const newMessage: ConversationMessage = {
      id: `msg_${uuidv4()}`,
      timestamp: Date.now(),
      ...messageData,
    };
    // Ensure content consistency based on role
    if (newMessage.content === undefined) {
      if (newMessage.role === MessageRole.ASSISTANT && newMessage.tool_calls && newMessage.tool_calls.length > 0) {
        newMessage.content = null; // OpenAI allows null content if tool_calls are present
      } else if (newMessage.role !== MessageRole.ASSISTANT && newMessage.role !== MessageRole.TOOL) {
        newMessage.content = ""; // Default to empty string for user/system if undefined
      }
      // For TOOL role, content is the result, should not be undefined.
      // For ASSISTANT without tool_calls, content should not be undefined.
    }

    this.messages.push(newMessage);
    // Asynchronously manage history length if it involves AI summarization
    this.manageHistoryLength().catch(error => {
        console.error(`ConversationContext (ID: ${this.sessionId}): Error during manageHistoryLength:`, error);
        // Potentially fall back to simple truncation if summarization failed critically
        if (this.messages.length > this.config.maxHistoryLengthMessages) {
            this.truncateHistorySimple(this.config.maxHistoryLengthMessages);
        }
    });
    return Object.freeze({ ...newMessage }); // Return an immutable copy
  }

  /**
   * Retrieves a copy of the conversation history, potentially filtered or limited.
   * This method is suitable for display or general-purpose history access.
   * For prompt construction, the `PromptEngine` will typically request history and apply its own logic.
   *
   * @param {number} [limit] - Optional. Maximum number of recent messages to return.
   * If not provided, defaults to `config.maxHistoryLengthMessages`.
   * @param {MessageRole[]} [excludeRoles] - Optional. Roles to exclude from the returned history.
   * @returns {Readonly<ConversationMessage>[]} An array of read-only conversation messages.
   */
  public getHistory(limit?: number, excludeRoles?: MessageRole[]): Readonly<ConversationMessage>[] {
    let effectiveMessages = this.messages;
    if (excludeRoles && excludeRoles.length > 0) {
      const rolesToExclude = new Set(excludeRoles);
      effectiveMessages = effectiveMessages.filter(msg => !rolesToExclude.has(msg.role));
    }

    const actualLimit = limit !== undefined && limit > 0 ? limit : this.config.maxHistoryLengthMessages;
    
    return Object.freeze(effectiveMessages.slice(-actualLimit).map(m => ({ ...m })));
  }

  /**
   * Gets all messages, including those that might have been part of a summarization.
   * Useful for full conversation export or detailed logging.
   * @returns {Readonly<ConversationMessage>[]} A read-only array of all messages.
   */
  public getAllMessages(): Readonly<ConversationMessage>[] {
      return Object.freeze(this.messages.map(m => ({...m})));
  }

  /**
   * Gets the most recent message in the conversation.
   * @returns {Readonly<ConversationMessage> | undefined} A read-only copy of the last message, or undefined if empty.
   */
  public getLastMessage(): Readonly<ConversationMessage> | undefined {
    return this.messages.length > 0 ? Object.freeze({ ...this.messages[this.messages.length - 1] }) : undefined;
  }

  /**
   * Gets the current approximate turn number, typically based on user messages.
   * @returns {number} The turn number.
   */
  public getTurnNumber(): number {
    return this.messages.filter(msg => msg.role === MessageRole.USER).length;
  }

  /**
   * Clears messages from the conversation history based on provided options.
   * @param {object} [options] - Options for clearing history.
   * @param {boolean} [options.keepMetadata=true] - If true, session metadata is preserved.
   * @param {boolean} [options.keepSystemMessages=true] - If true, initial system messages are preserved.
   * @param {boolean} [options.keepPinnedMessages=false] - If true, messages with `metadata.isPinned=true` are preserved (future).
   */
  public clearHistory(options: { keepMetadata?: boolean; keepSystemMessages?: boolean; keepPinnedMessages?: boolean } = {}): void {
    const { keepMetadata = true, keepSystemMessages = true, keepPinnedMessages = false } = options;
    
    let messagesToKeep: ConversationMessage[] = [];
    if (keepSystemMessages) {
        messagesToKeep.push(...this.messages.filter(m => m.role === MessageRole.SYSTEM));
    }
    if (keepPinnedMessages) {
        messagesToKeep.push(...this.messages.filter(m => m.metadata?.isPinned === true && !messagesToKeep.find(mk => mk.id === m.id)));
    }
    // Remove duplicates if a system message was also pinned
    this.messages = [...new Map(messagesToKeep.map(item => [item.id, item])).values()];


    if (!keepMetadata) {
      this.sessionMetadata = {};
      this.setMetadata('currentLanguage', this.config.defaultLanguage);
      this.setMetadata('currentAgentId', this.config.initialAgentId);
      this.setMetadata('userId', this.config.userId);
    }
    // console.log(`ConversationContext (ID: ${this.sessionId}): History cleared with options:`, options);
  }

  /**
   * Sets or updates a piece of session-level metadata.
   * Special keys like 'currentLanguage', 'currentAgentId', 'userId', 'currentMood'
   * might have direct properties on the context for easier access or typed updates.
   * @param {string} key - The metadata key.
   * @param {any} value - The metadata value. If `undefined`, the key is removed from metadata.
   */
  public setMetadata(key: string, value: any): void {
    if (value === undefined) {
        delete this.sessionMetadata[key];
    } else {
        this.sessionMetadata[key] = value;
    }

    // Update direct properties for well-known metadata keys
    if (key === 'currentLanguage' && typeof value === 'string') {
        this.currentLanguage = value;
    } else if (key === 'currentAgentId' && typeof value === 'string') {
        this.currentAgentId = value;
    } else if (key === 'userId' && typeof value === 'string') {
        (this as any).userId = value; // Update if it was initially undefined
    }
    // Example for mood: if (key === 'currentMood') { /* agent.setMood(value) or emit event */ }
  }

  /**
   * Gets a piece of session-level metadata.
   * @param {string} key - The metadata key.
   * @returns {any | undefined} The metadata value, or undefined if the key doesn't exist.
   */
  public getMetadata(key: string): any | undefined {
    // Prioritize direct properties for well-known keys
    if (key === 'currentLanguage') return this.currentLanguage;
    if (key === 'currentAgentId') return this.currentAgentId;
    if (key === 'userId') return this.userId;
    return this.sessionMetadata[key];
  }

  /**
   * Retrieves all session metadata, including direct properties like language and agent ID.
   * @returns {Readonly<Record<string, any>>} A read-only copy of all session metadata.
   */
  public getAllMetadata(): Readonly<Record<string, any>> {
    return Object.freeze({
        ...this.sessionMetadata,
        currentLanguage: this.currentLanguage,
        currentAgentId: this.currentAgentId,
        userId: this.userId,
    });
  }

  /**
   * @private
   * Asynchronously manages the length of the conversation history. If enabled and conditions are met,
   * it attempts to summarize the oldest part of the "middle" section of the conversation.
   * Falls back to simple truncation if summarization is not possible or fails.
   * This method is designed to be called after a new message is added.
   */
  private async manageHistoryLength(): Promise<void> {
    if (this.messages.length <= this.config.maxHistoryLengthMessages) {
      return; // No action needed if within limits
    }

    if (this.config.enableAutomaticSummarization && this.utilityAI) {
      const headCount = Math.max(0, this.config.messagesToKeepVerbatimHead);
      const tailCount = Math.max(0, this.config.messagesToKeepVerbatimTail);
      
      // Ensure head + tail doesn't exceed total messages or maxHistoryLengthMessages
      if (headCount + tailCount >= this.messages.length || headCount + tailCount >= this.config.maxHistoryLengthMessages) {
        this.truncateHistorySimple(this.config.maxHistoryLengthMessages);
        return;
      }

      const middleStartIndex = headCount;
      const middleEndIndex = this.messages.length - tailCount; // Exclusive index for slice
      const middleMessages = this.messages.slice(middleStartIndex, middleEndIndex);

      // Only proceed if there's a substantial middle part to summarize, exceeding the summarization chunk size.
      if (middleMessages.length > this.config.summarizationChunkSize) {
        const messagesToSummarize = middleMessages.slice(0, this.config.summarizationChunkSize);
        const textToSummarize = messagesToSummarize
          .map(m => `${m.name || m.role}: ${m.content || (m.tool_calls ? '[Tool Call]' : '[Empty Content]')}`)
          .join('\n');
        
        let tokenEstimate = textToSummarize.length / FALLBACK_AVG_CHARS_PER_TOKEN; // Fallback
        // A more accurate token count would ideally involve the tokenizer via PromptEngine or UtilityAI itself.
        // For now, we rely on character length as a proxy or assume UtilityAI handles input limits.

        if (tokenEstimate > MIN_TOKENS_FOR_SUMMARIZATION) { // MIN_TOKENS_FOR_SUMMARIZATION should be a constant
          try {
            const summaryContent = await this.utilityAI.summarize(
              textToSummarize,
              this.config.summarizationOptions
            );
            
            const summaryTokenCount = summaryContent.length / FALLBACK_AVG_CHARS_PER_TOKEN; // Estimate summary tokens

            const summaryMessage: ConversationMessage = {
              id: `sum_${uuidv4()}`,
              role: MessageRole.SUMMARY,
              content: summaryContent,
              timestamp: messagesToSummarize[messagesToSummarize.length - 1].timestamp,
              originalMessagesSummarizedCount: messagesToSummarize.length,
              metadata: {
                source: 'automatic_history_summary',
                tokenCount: Math.ceil(summaryTokenCount),
                modificationInfo: {
                  strategy: 'summarized',
                  originalMessageCount: messagesToSummarize.length,
                  // originalTokenCount could be summed from original messages if available
                },
                summarizedMessageIds: messagesToSummarize.map(m => m.id),
              },
            };
            
            const headMessages = this.messages.slice(0, headCount);
            const tailMessages = this.messages.slice(this.messages.length - tailCount);
            // The part of middleMessages that was *not* summarized
            const remainingMiddleMessages = middleMessages.slice(this.config.summarizationChunkSize); 
            
            this.messages = [...headMessages, summaryMessage, ...remainingMiddleMessages, ...tailMessages];
            // console.log(`ConversationContext (ID: ${this.sessionId}): History summarized. New length: ${this.messages.length}`);
            
            // Recursively call manageHistoryLength in case the new structure still exceeds max overall length,
            // or if more summarization chunks are needed from the remainingMiddleMessages.
            // Add a safeguard to prevent infinite loops if summarization doesn't reduce length enough.
            if (this.messages.length > this.config.maxHistoryLengthMessages) {
                 // console.debug(`ConversationContext (ID: ${this.sessionId}): Recursively managing history after summarization.`);
                 await this.manageHistoryLength(); // Call again
            }
            return; // Successfully summarized or attempted

          } catch (error) {
            console.error(`ConversationContext (ID: ${this.sessionId}): Failed to summarize history chunk:`, error);
            // Fallback to simple truncation if summarization fails for this chunk
          }
        }
      }
    }
    
    // If summarization was not enabled, not possible, failed, or if still too long after one pass:
    if (this.messages.length > this.config.maxHistoryLengthMessages) {
      this.truncateHistorySimple(this.config.maxHistoryLengthMessages);
    }
  }

  /**
   * @private
   * Simple FIFO truncation: removes the oldest messages (excluding configured head messages)
   * to meet the `targetMessageCount`.
   * @param {number} targetMessageCount - The desired number of messages to remain.
   */
  private truncateHistorySimple(targetMessageCount: number): void {
    const headCount = Math.max(0, this.config.messagesToKeepVerbatimHead);
    if (this.messages.length <= targetMessageCount) return;

    if (headCount >= targetMessageCount) { // Edge case: only head messages or fewer should remain
        this.messages = this.messages.slice(0, targetMessageCount);
    } else {
        const headMessages = this.messages.slice(0, headCount);
        const tailMessagesToKeepCount = targetMessageCount - headCount;
        const tailMessages = this.messages.slice(-tailMessagesToKeepCount); // Get the most recent N messages for the tail
        this.messages = [...headMessages, ...tailMessages];
    }
    // console.log(`ConversationContext (ID: ${this.sessionId}): History truncated (simple). New length: ${this.messages.length}`);
  }

  /**
   * Serializes the entire conversation context to a JSON-compatible object.
   * This is crucial for the "exportable agent state" and "singularity" concepts.
   * @returns {object} A serializable representation of the context.
   */
  public toJSON(): object {
    return {
      sessionId: this.sessionId,
      createdAt: this.createdAt,
      messages: this.messages, // Messages are already serializable due to ConversationMessage structure
      config: {
        ...this.config,
        utilityAI: undefined, // Do not serialize the utilityAI instance itself, only its ID if needed
        utilityAIServiceId: this.config.utilityAI?.utilityId || this.config.utilityAIServiceId,
      },
      sessionMetadata: this.sessionMetadata,
      // Direct properties like currentLanguage are part of sessionMetadata for serialization
    };
  }

  /**
   * Deserializes and creates a ConversationContext instance from a JSON object.
   * @param {any} jsonData - The JSON object (typically from `toJSON()`).
   * @param {IUtilityAI} [utilityAIInstance] - Optional. An `IUtilityAI` instance to re-inject if the
   * original context used one (e.g., for continued automatic summarization).
   * @returns {ConversationContext} A new ConversationContext instance.
   * @throws {Error} If jsonData is not a valid or recognized representation.
   */
  public static fromJSON(jsonData: any, utilityAIInstance?: IUtilityAI): ConversationContext {
    if (!jsonData || !jsonData.sessionId || !jsonData.messages || !jsonData.config) {
      throw new Error("Invalid JSON data: Missing essential fields for ConversationContext deserialization.");
    }

    // Reconstruct config, potentially injecting the live utilityAI instance
    const configForNewInstance: Partial<ConversationContextConfig> = {
      ...jsonData.config,
    };
    if (utilityAIInstance) {
      configForNewInstance.utilityAI = utilityAIInstance;
    } else if (jsonData.config.utilityAIServiceId) {
      // If only ID was stored, the deserializing environment would need to look up
      // the utilityAI instance by this ID from a service registry.
      // For now, we just log a warning if an ID was present but no instance is given.
      console.warn(`ConversationContext.fromJSON: config contained utilityAIServiceId '${jsonData.config.utilityAIServiceId}' but no IUtilityAI instance was provided for re-injection. Summarization may be inactive.`);
    }


    const context = new ConversationContext(
      jsonData.sessionId,
      configForNewInstance,
      jsonData.messages, // Assuming messages in JSON are valid ConversationMessage[]
      jsonData.sessionMetadata
    );

    // Restore readonly `createdAt` if present in jsonData
    if (typeof jsonData.createdAt === 'number') {
      (context as { -readonly [P in keyof ConversationContext]: ConversationContext[P] }).createdAt = jsonData.createdAt;
    }
    
    // Other direct properties are typically handled by constructor via metadata or config.
    // Ensure currentLanguage, userId, currentAgentId are consistent with how they are stored/retrieved.
    context.setMetadata('currentLanguage', jsonData.sessionMetadata?.currentLanguage || jsonData.config?.defaultLanguage);
    context.setMetadata('userId', jsonData.sessionMetadata?.userId || jsonData.config?.userId);
    context.setMetadata('currentAgentId', jsonData.sessionMetadata?.currentAgentId || jsonData.config?.initialAgentId);


    return context;
  }
}