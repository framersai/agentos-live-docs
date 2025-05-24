/**
 * @fileoverview Manages the state, history, and metadata of a single conversation in AgentOS.
 * It provides robust methods for adding messages, retrieving history with various strategies
 * (including AI-powered summarization if an IUtilityAI service is provided),
 * and managing session-specific metadata. Designed for comprehensive state export and import.
 *
 * @module backend/agentos/core/conversation/ConversationContext
 * @see ./ConversationMessage.ts
 * @see ../ai_utilities/IUtilityAI.ts
 */

import { ConversationMessage, MessageRole, createConversationMessage } from './ConversationMessage';
import { IUtilityAI, SummarizationOptions } from '../ai_utilities/IUtilityAI';
import { v4 as uuidv4 } from 'uuid';
import { GMIError, GMIErrorCode } from '../../../utils/errors';

// Constants for summarization logic
const DEFAULT_MAX_HISTORY_MESSAGES = 100;
const DEFAULT_VERBATIM_TAIL_COUNT = 10;
const DEFAULT_VERBATIM_HEAD_COUNT = 2;
const DEFAULT_SUMMARIZATION_CHUNK_SIZE = 20; // Messages to group for one summary
const MIN_MESSAGES_FOR_SUMMARIZATION_ATTEMPT = 5; // Don't try to summarize too few messages
const DEFAULT_SUMMARIZATION_OPTIONS: SummarizationOptions = { desiredLength: 'medium', method: 'abstractive_llm' };

/**
 * Configuration for the ConversationContext.
 */
export interface ConversationContextConfig {
  maxHistoryLengthMessages?: number;
  enableAutomaticSummarization?: boolean;
  messagesToKeepVerbatimTail?: number;
  messagesToKeepVerbatimHead?: number;
  summarizationChunkSize?: number;
  summarizationOptions?: SummarizationOptions;
  utilityAI?: IUtilityAI; // Injected instance
  defaultLanguage?: string;
  userId?: string;         // Associated User ID
  gmiInstanceId?: string;  // Associated GMI Instance ID
  activePersonaId?: string;// Associated Active Persona ID
}

/**
 * @class ConversationContext
 * Manages messages, metadata, and state for a single conversation.
 */
export class ConversationContext {
  public readonly sessionId: string;
  public readonly createdAt: number;
  private messages: ConversationMessage[];
  private readonly config: Required<ConversationContextConfig>;
  private sessionMetadata: Record<string, any>; // For dynamic metadata
  private readonly utilityAI?: IUtilityAI;
  private isSummarizing: boolean = false; // Lock to prevent concurrent summarization

  constructor(
    sessionId?: string,
    config: Partial<ConversationContextConfig> = {},
    initialMessages: ConversationMessage[] = [],
    initialMetadata: Record<string, any> = {}
  ) {
    this.sessionId = sessionId || `conv_ctx_${uuidv4()}`;
    this.createdAt = Date.now();

    // Ensure initial messages are valid and have IDs/timestamps
    this.messages = initialMessages.map(m => ({
      ...m,
      id: m.id || `msg_${uuidv4()}`,
      timestamp: m.timestamp || Date.now(),
    }));

    const defaultConfig: Required<Omit<ConversationContextConfig, 'utilityAI' | 'userId' | 'gmiInstanceId' | 'activePersonaId'>> & Partial<Pick<ConversationContextConfig, 'utilityAI' | 'userId' | 'gmiInstanceId' | 'activePersonaId'>> = {
      maxHistoryLengthMessages: DEFAULT_MAX_HISTORY_MESSAGES,
      enableAutomaticSummarization: false,
      messagesToKeepVerbatimTail: DEFAULT_VERBATIM_TAIL_COUNT,
      messagesToKeepVerbatimHead: DEFAULT_VERBATIM_HEAD_COUNT,
      summarizationChunkSize: DEFAULT_SUMMARIZATION_CHUNK_SIZE,
      summarizationOptions: { ...DEFAULT_SUMMARIZATION_OPTIONS },
      defaultLanguage: 'en-US',
    };
    
    this.config = {
        ...defaultConfig,
        ...config,
        // Ensure nested objects are also spread if they are partial in input config
        summarizationOptions: {
            ...defaultConfig.summarizationOptions,
            ...config.summarizationOptions,
        },
    } as Required<ConversationContextConfig>; // Cast after ensuring all defaults are set

    this.utilityAI = config.utilityAI || undefined; // Use injected instance
    this.sessionMetadata = { ...initialMetadata };

    // Initialize/override well-known metadata from config if provided
    if (this.config.userId) this.sessionMetadata.userId = this.config.userId;
    if (this.config.gmiInstanceId) this.sessionMetadata.gmiInstanceId = this.config.gmiInstanceId;
    if (this.config.activePersonaId) this.sessionMetadata.activePersonaId = this.config.activePersonaId;
    if (this.config.defaultLanguage && !this.sessionMetadata.currentLanguage) {
      this.sessionMetadata.currentLanguage = this.config.defaultLanguage;
    }


    if (this.config.enableAutomaticSummarization && !this.utilityAI) {
      console.warn(`ConversationContext (ID: ${this.sessionId}): enableAutomaticSummarization is true, but no IUtilityAI service was provided. Automatic summarization will be disabled.`);
      (this.config as any).enableAutomaticSummarization = false; // Correct internal state
    }
  }

  public addMessage(messageData: Omit<ConversationMessage, 'id' | 'timestamp'>): Readonly<ConversationMessage> {
    const newMessage = createConversationMessage(messageData.role, messageData.content, messageData);
    this.messages.push(newMessage);

    // Non-blocking call to manage history
    this.manageHistoryLength().catch(error => {
      console.error(`ConversationContext (ID: ${this.sessionId}): Error during manageHistoryLength after adding message:`, error);
      if (this.messages.length > this.config.maxHistoryLengthMessages) {
        this.truncateHistorySimple(this.config.maxHistoryLengthMessages);
      }
    });
    return Object.freeze({ ...newMessage });
  }

  public getHistory(limit?: number, excludeRoles?: MessageRole[]): Readonly<ConversationMessage>[] {
    let effectiveMessages = this.messages;
    if (excludeRoles && excludeRoles.length > 0) {
      const rolesToExclude = new Set(excludeRoles);
      effectiveMessages = effectiveMessages.filter(msg => !rolesToExclude.has(msg.role));
    }
    const actualLimit = limit !== undefined && limit > 0 ? limit : this.config.maxHistoryLengthMessages;
    return Object.freeze(effectiveMessages.slice(-actualLimit).map(m => ({ ...m })));
  }

  public getAllMessages(): Readonly<ConversationMessage>[] {
    return Object.freeze(this.messages.map(m => ({ ...m })));
  }

  public getMessageById(messageId: string): Readonly<ConversationMessage> | undefined {
    const message = this.messages.find(m => m.id === messageId);
    return message ? Object.freeze({ ...message }) : undefined;
  }

  public getLastMessage(): Readonly<ConversationMessage> | undefined {
    return this.messages.length > 0 ? Object.freeze({ ...this.messages[this.messages.length - 1] }) : undefined;
  }

  public getTurnNumber(): number {
    return this.messages.filter(msg => msg.role === MessageRole.USER).length;
  }

  public clearHistory(options: { keepMetadata?: boolean; keepSystemMessages?: boolean; messagesToKeep?: ConversationMessage[] } = {}): void {
    const { keepMetadata = true, keepSystemMessages = true, messagesToKeep = [] } = options;
    
    let preservedMessages: ConversationMessage[] = [...messagesToKeep];
    if (keepSystemMessages) {
      this.messages.forEach(m => {
        if (m.role === MessageRole.SYSTEM && !preservedMessages.find(pm => pm.id === m.id)) {
          preservedMessages.push(m);
        }
      });
    }
    // Remove duplicates just in case
    this.messages = [...new Map(preservedMessages.map(item => [item.id, item])).values()];
    this.messages.sort((a,b) => a.timestamp - b.timestamp); // Re-sort if needed

    if (!keepMetadata) {
      const essentialMetadata = {
        userId: this.config.userId,
        gmiInstanceId: this.config.gmiInstanceId,
        activePersonaId: this.config.activePersonaId,
        currentLanguage: this.config.defaultLanguage,
      };
      this.sessionMetadata = Object.fromEntries(Object.entries(essentialMetadata).filter(([_,v]) => v !== undefined));
    }
    console.log(`ConversationContext (ID: ${this.sessionId}): History cleared with options. New length: ${this.messages.length}`);
  }

  public setMetadata(key: string, value: any): void {
    if (value === undefined) {
      delete this.sessionMetadata[key];
    } else {
      this.sessionMetadata[key] = value;
    }
  }

  public getMetadata(key: string): any | undefined {
    return this.sessionMetadata[key];
  }

  public getAllMetadata(): Readonly<Record<string, any>> {
    return Object.freeze({ ...this.sessionMetadata });
  }

  private async manageHistoryLength(): Promise<void> {
    if (this.isSummarizing || this.messages.length <= this.config.maxHistoryLengthMessages) {
      return;
    }

    if (this.config.enableAutomaticSummarization && this.utilityAI) {
      this.isSummarizing = true;
      try {
        const headCount = Math.max(0, this.config.messagesToKeepVerbatimHead);
        const tailCount = Math.max(0, this.config.messagesToKeepVerbatimTail);

        if (headCount + tailCount >= this.messages.length || headCount + tailCount >= this.config.maxHistoryLengthMessages) {
          this.truncateHistorySimple(this.config.maxHistoryLengthMessages);
          return;
        }

        const middleSection = this.messages.slice(headCount, this.messages.length - tailCount);
        if (middleSection.length > this.config.summarizationChunkSize && middleSection.length > MIN_MESSAGES_FOR_SUMMARIZATION_ATTEMPT) {
          const messagesToSummarize = middleSection.slice(0, this.config.summarizationChunkSize);
          const textToSummarize = messagesToSummarize
            .map(m => `${m.name || m.role}: ${m.content || (m.tool_calls ? '[Tool Call]' : '[Empty Content]')}`)
            .join('\n\n');

          // TODO: Add actual token counting via IUtilityAI if available, to decide if summarization is efficient
          const summaryContent = await this.utilityAI.summarize(textToSummarize, this.config.summarizationOptions);
          
          const summaryMessage = createConversationMessage(MessageRole.SUMMARY, summaryContent, {
              timestamp: messagesToSummarize[messagesToSummarize.length - 1].timestamp, // Anchor timestamp
              originalMessagesSummarizedCount: messagesToSummarize.length,
              metadata: {
                source: 'automatic_history_summary',
                modificationInfo: {
                    strategy: 'summarized',
                    originalMessageCount: messagesToSummarize.length,
                },
                summarizedMessageIds: messagesToSummarize.map(m => m.id),
              },
          });

          const headMessages = this.messages.slice(0, headCount);
          const tailMessages = this.messages.slice(this.messages.length - tailCount);
          const remainingMiddleAfterSummarizedChunk = middleSection.slice(this.config.summarizationChunkSize);
          
          this.messages = [...headMessages, summaryMessage, ...remainingMiddleAfterSummarizedChunk, ...tailMessages];
          console.log(`ConversationContext (ID: ${this.sessionId}): History summarized. New length: ${this.messages.length}`);

          // Recursively manage if still too long and further summarization is possible
          if (this.messages.length > this.config.maxHistoryLengthMessages && remainingMiddleAfterSummarizedChunk.length > MIN_MESSAGES_FOR_SUMMARIZATION_ATTEMPT) {
            await this.manageHistoryLength(); // Recursive call with safeguard in isSummarizing
          } else if (this.messages.length > this.config.maxHistoryLengthMessages) {
            this.truncateHistorySimple(this.config.maxHistoryLengthMessages); // Final truncation if summarization can't reduce further
          }
        } else {
            // Middle section not large enough for a new summarization chunk, try truncation
            this.truncateHistorySimple(this.config.maxHistoryLengthMessages);
        }
      } catch (error: any) {
        console.error(`ConversationContext (ID: ${this.sessionId}): Failed to summarize history: ${error.message}. Falling back to simple truncation.`, error);
        this.truncateHistorySimple(this.config.maxHistoryLengthMessages);
      } finally {
        this.isSummarizing = false;
      }
    } else { // Fallback to simple truncation if summarization not enabled/possible
      this.truncateHistorySimple(this.config.maxHistoryLengthMessages);
    }
  }

  private truncateHistorySimple(targetMessageCount: number): void {
    const headCount = Math.max(0, this.config.messagesToKeepVerbatimHead);
    if (this.messages.length <= targetMessageCount) return;

    if (headCount >= targetMessageCount) {
      this.messages.splice(targetMessageCount);
    } else {
      const headMessages = this.messages.slice(0, headCount);
      const tailMessagesToKeepCount = targetMessageCount - headCount;
      // Ensure tailMessagesToKeepCount is not negative if targetMessageCount < headCount
      const actualTailCount = Math.max(0, tailMessagesToKeepCount);
      const tailMessages = this.messages.slice(-actualTailCount);
      this.messages = [...headMessages, ...tailMessages];
    }
    console.log(`ConversationContext (ID: ${this.sessionId}): History truncated simply. New length: ${this.messages.length}`);
  }

  public toJSON(): object {
    return {
      sessionId: this.sessionId,
      createdAt: this.createdAt,
      messages: this.messages,
      config: { // Serialize relevant config, not the utilityAI instance
        ...this.config,
        utilityAI: undefined, // Don't serialize instance
        utilityAIServiceId: this.utilityAI?.utilityId, // Store ID if available
      },
      sessionMetadata: this.sessionMetadata,
    };
  }

  public static fromJSON(jsonData: any, utilityAIProvider?: (serviceId?: string) => IUtilityAI | undefined): ConversationContext {
    if (!jsonData || !jsonData.sessionId || !Array.isArray(jsonData.messages) || !jsonData.config) {
      throw new GMIError("Invalid JSON data: Missing essential fields for ConversationContext deserialization.", GMIErrorCode.VALIDATION_ERROR, { dataKeys: Object.keys(jsonData || {}) });
    }

    let utilityAIInstance: IUtilityAI | undefined = undefined;
    if (utilityAIProvider) {
        utilityAIInstance = utilityAIProvider(jsonData.config.utilityAIServiceId);
    } else if (jsonData.config.utilityAIServiceId) {
        console.warn(`ConversationContext.fromJSON: Config contained utilityAIServiceId '${jsonData.config.utilityAIServiceId}' but no utilityAIProvider was given to resolve the instance.`);
    }
    
    const configForNewInstance: Partial<ConversationContextConfig> = {
      ...jsonData.config,
      utilityAI: utilityAIInstance, // Inject resolved instance
    };

    const context = new ConversationContext(
      jsonData.sessionId,
      configForNewInstance,
      jsonData.messages,
      jsonData.sessionMetadata
    );

    if (typeof jsonData.createdAt === 'number') {
      (context as { -readonly [P in 'createdAt']: number }).createdAt = jsonData.createdAt;
    }
    return context;
  }

  // Getter for direct properties derived from config or essential state
  public get userId(): string | undefined { return this.sessionMetadata.userId || this.config.userId; }
  public get gmiInstanceId(): string | undefined { return this.sessionMetadata.gmiInstanceId || this.config.gmiInstanceId; }
  public get activePersonaId(): string | undefined { return this.sessionMetadata.activePersonaId || this.config.activePersonaId; }
  public get currentLanguage(): string { return this.sessionMetadata.currentLanguage || this.config.defaultLanguage; }

}