/**
 * @fileoverview Defines the advanced interface (IPromptEngine) for the PromptEngine in AgentOS.
 * The PromptEngine is a critical component responsible for dynamically constructing, formatting,
 * and managing prompts tailored to specific GMIs (via their personas), target AI models,
 * ongoing tasks, and various contextual factors (e.g., GMI mood, user skill level).
 *
 * This version explicitly includes support for contextual adaptation of prompts, allowing
 * different prompt elements (instructions, examples, etc.) to be selected or modified
 * based on the current execution context.
 * @module backend/agentos/core/llm/IPromptEngine
 */

import { ConversationMessage } from '../conversation/ConversationMessage';
import { ToolDefinition } from '../agents/tools/Tool';
import { IPersonaDefinition, ContextualPromptElementCriteria } from '../../cognitive_substrate/personas/IPersonaDefinition';
import { IWorkingMemory } from '../../cognitive_substrate/memory/IWorkingMemory';

/**
 * Defines the various components that can be assembled into a prompt.
 * This structure allows for rich and varied inputs to the prompt construction process.
 * Enhanced to better support dynamic elements.
 * @interface PromptComponents
 */
export interface PromptComponents {
  /**
   * The primary system-level instructions defining the agent's role, persona,
   * overall task, constraints, and desired output format.
   * Multiple system messages can be provided and will be intelligently combined or ordered.
   * These can be static or dynamically selected/modified based on `PromptExecutionContext`.
   * @type {Array<{ content: string; priority?: number; id?: string }>}
   * @optional
   */
  systemPrompts?: Array<{ content: string; priority?: number; id?: string }>;

  /**
   * The history of messages in the current conversation.
   * The engine will apply configured truncation and formatting rules.
   * @type {ConversationMessage[]}
   * @optional
   */
  conversationHistory?: ConversationMessage[];

  /**
   * The latest user input or query.
   * @type {string}
   * @optional
   */
  userInput?: string;

  /**
   * Contextual information retrieved from memory, RAG systems, or other sources.
   * Can be structured with metadata for more intelligent injection.
   * @type {Array<{ content: string; source?: string; score?: number; type?: 'document_chunk' | 'summary' | 'user_profile'; id?: string }>}
   * @optional
   */
  retrievedContext?: Array<{
    content: string;
    source?: string;
    score?: number;
    type?: 'document_chunk' | 'summary' | 'user_profile';
    id?: string;
  }>;

  /**
   * Schemas or descriptions of tools available to the agent for the current turn.
   * Used for models that support function/tool calling.
   * @type {ToolDefinition[]}
   * @optional
   */
  toolSchemas?: ToolDefinition[];

  /**
   * Specific instructions or data relevant to the current task or turn,
   * beyond the general system prompt or user input.
   * Can be static or dynamically selected.
   * @type {string | Record<string, any>}
   * @optional
   */
  taskSpecificData?: string | Record<string, any>;

  /**
   * Examples of desired input/output pairs for few-shot prompting.
   * The engine may select a subset based on relevance, `PromptExecutionContext`, or token limits.
   * These are static definitions; dynamic selection happens during `constructPrompt`.
   * @type {Array<{ input: string; output: string; criteria?: ContextualPromptElementCriteria; id?: string }>}
   * @optional
   */
  fewShotExamples?: Array<{
    input: string;
    output: string;
    /** Criteria for when this example is most applicable. */
    criteria?: ContextualPromptElementCriteria;
    id?: string;
  }>;

  /**
   * Custom placeholder values to be injected into prompt templates if used.
   * @type {Record<string, string | number | boolean>}
   * @optional
   */
  templateVariables?: Record<string, string | number | boolean>;

  /**
   * Explicit instructions on which tools the model MUST call, if supported by the model and provider.
   * @type {{ name: string; arguments?: Record<string, any>; } | Array<{ name: string; arguments?: Record<string, any>; }>}
   * @optional
   */
  forceToolCall?: { name: string; arguments?: Record<string, any>; } | Array<{ name: string; arguments?: Record<string, any>; }>;

  /**
   * Raw, pre-formatted message objects to be included in the prompt.
   * Use with caution, as these bypass some of the engine's formatting logic.
   * Useful for injecting messages from external systems or for very specific prompt structures.
   * @type {Array<Record<string, any>>}
   * @optional
   */
  rawMessages?: Array<Record<string, any>>;
}

/**
 * The result of the prompt engine's formatting process.
 * This can be a string for simple completion models, an array of message objects
 * for chat models, or any other model-specific structured input.
 * @typedef FormattedPrompt
 */
export type FormattedPrompt = string | object[] | Record<string, any>; // 'object[]' often for ChatMessage[] like structures

/**
 * Information about the target AI model, used by the `PromptEngine` for formatting,
 * tokenization, truncation, and capability-aware prompt construction.
 * @interface ModelTargetInfo
 */
export interface ModelTargetInfo {
  /**
   * Unique identifier for the model (e.g., "gpt-4o", "claude-3-opus-20240229").
   * @type {string}
   */
  modelId: string;

  /**
   * Identifier of the provider for this model (e.g., "openai", "anthropic", "ollama").
   * @type {string}
   */
  providerId: string;

  /**
   * The type of prompt format the model expects (e.g., "openai_chat", "anthropic_messages", "raw_text").
   * This guides the final formatting of the prompt by the engine.
   * @type {string}
   */
  promptFormatType: string;

  /**
   * Maximum context window size in tokens for this model (prompt + completion).
   * @type {number}
   */
  maxTokens: number;

  /**
   * A suggested number of tokens to reserve for the model's output (generation).
   * The `PromptEngine` will subtract this from `maxTokens` to determine the budget for the input prompt.
   * @type {number}
   * @optional
   * @default 512 or a model-specific reasonable default
   */
  reservedOutputTokens?: number;

  /**
   * Information about how tools/functions are handled by this model.
   * @type {{ format: 'openai_tools' | 'anthropic_tools' | 'google_ai_function_calling' | 'json_schema' | 'xml_tags' | 'none'; strictSchema?: boolean; }}
   * @optional
   */
  toolSupport?: {
    /** The format expected by the model for tool definitions and invocations. */
    format: 'openai_tools' | 'anthropic_tools' | 'google_ai_function_calling' | 'json_schema' | 'xml_tags' | 'none';
    /** If true, the model strictly adheres to the provided JSON schema for tool arguments. */
    strictSchema?: boolean;
  };

  /**
   * Reference to, or name of, a tokenizer specifically for this model or model family.
   * If provided, the `PromptEngine` will use it for precise token counting.
   * @type {string}
   * @optional
   */
  tokenizerName?: string;

  /**
   * Known capabilities of the model.
   * @type {Array<'vision_input' | 'json_mode' | 'long_context' | string>}
   * @optional
   */
  capabilities?: Array<'vision_input' | 'json_mode' | 'long_context' | string>;
}

/**
 * Contains the current contextual information relevant for dynamic prompt construction.
 * This object is passed to the `PromptEngine` to enable adaptive prompt generation.
 * @interface PromptExecutionContext
 */
export interface PromptExecutionContext {
  /**
   * The currently active persona definition for the GMI.
   * The `PromptEngine` will use this to access `promptConfig.contextualElements`, `moodPrompts`, etc.
   * @type {IPersonaDefinition}
   */
  activePersona: IPersonaDefinition;

  /**
   * The GMI's working memory, providing access to dynamic state like current mood.
   * The `PromptEngine` should ideally receive specific, relevant values from working memory
   * rather than the whole IWorkingMemory object to maintain cleaner separation of concerns,
   * but passing the instance allows flexibility if many diverse states are needed.
   * @type {IWorkingMemory}
   */
  workingMemory: IWorkingMemory;

  /**
   * The current task hint, which can influence selection of contextual elements.
   * @type {string}
   * @optional
   */
  taskHint?: string;

  /**
   * The assessed skill level of the current user, if available.
   * This can be used to tailor examples or explanation depth.
   * @type {'beginner' | 'intermediate' | 'expert' | string}
   * @optional
   */
  userSkillLevel?: 'beginner' | 'intermediate' | 'expert' | string;

  /**
   * Current language for the interaction.
   * @type {string}
   * @optional
   * @example "en-US"
   */
  language?: string;

  /**
   * Any other arbitrary contextual data that might influence prompt construction.
   * @type {Record<string, any>}
   * @optional
   */
  customContext?: Record<string, any>;
}


/**
 * The comprehensive result of the prompt engine's operations.
 * Includes the formatted prompt, token counts, modification details, and any issues encountered.
 * @interface PromptEngineResult
 */
export interface PromptEngineResult {
  /**
   * The fully formatted prompt, ready to be sent to an LLM.
   * Its type (`string`, `object[]`, etc.) depends on `ModelTargetInfo.promptFormatType`.
   * @type {FormattedPrompt}
   */
  prompt: FormattedPrompt;

  /**
   * Actual token count of the generated prompt, if a tokenizer was available and used.
   * @type {number}
   * @optional
   */
  tokenCount?: number;

  /**
   * Estimated token count if an actual tokenizer was not available or if estimation was preferred.
   * @type {number}
   * @optional
   */
  estimatedTokenCount?: number;

  /**
   * Indicates if any content (history, context, examples) was truncated or summarized
   * by the `PromptEngine` to fit within the model's token limits.
   * @type {boolean}
   */
  wasTruncatedOrSummarized: boolean;

  /**
   * Provides details about which components were modified (truncated/summarized) and how.
   * Keys are component names (e.g., "conversationHistory", "retrievedContext").
   * Values describe the modification (e.g., strategy used, original vs. final token counts).
   * @type {Record<string, string | number | { strategy: string; originalTokens?: number; finalTokens?: number; itemsAffected?: number }>}
   * @optional
   */
  modificationDetails?: Record<string, string | number | {
    strategy: string;
    originalTokens?: number;
    finalTokens?: number;
    itemsAffected?: number;
  }>;

  /**
   * An array of warnings or errors encountered during the prompt construction process.
   * 'warning': Non-critical issue (e.g., minor truncation, fallback to default).
   * 'error': Critical issue that likely prevented successful prompt generation.
   * @type {Array<{ type: 'warning' | 'error'; message: string; component?: string; details?: any }>}
   * @optional
   */
  issues?: Array<{
    type: 'warning' | 'error';
    message: string;
    /** The prompt component related to the issue, if applicable. */
    component?: keyof PromptComponents | string;
    details?: any;
  }>;

  /**
   * Metadata about the prompt construction process.
   * Can include information like the template name used, specific dynamic elements selected, etc.
   * @type {Record<string, any>}
   * @optional
   */
  metadata?: Record<string, any>;

  /**
   * If tool schemas were part of the `PromptComponents` and the target model supports tools,
   * this field carries the tool definitions formatted precisely as the target model expects
   * (e.g., for OpenAI API's `tools` parameter, or Anthropic's XML format).
   * @type {any[]}
   * @optional
   */
  formattedToolSchemas?: any[];
}

/**
 * Configuration options for the `PromptEngine`.
 * These settings control default behaviors for truncation, summarization, and template usage.
 * @interface PromptEngineConfig
 */
export interface PromptEngineConfig {
  /**
   * Default strategy for truncating conversation history if it exceeds token limits.
   * - `FIFO`: First-In, First-Out (remove oldest messages).
   * - `LIFO`: Last-In, First-Out (remove messages preceding the most recent ones, less common for history).
   * - `SUMMARIZE_OLDEST`: Use `IUtilityAI` to summarize the oldest block of messages.
   * - `SUMMARIZE_MIDDLE`: Keep start and end, summarize middle messages.
   * - `TOKEN_BUDGET_PER_MESSAGE`: Allocate a token budget per message and truncate individual messages if needed (complex).
   * @type {'FIFO' | 'LIFO' | 'SUMMARIZE_OLDEST' | 'SUMMARIZE_MIDDLE' | 'TOKEN_BUDGET_PER_MESSAGE'}
   * @optional
   * @default 'FIFO'
   */
  defaultHistoryTruncationStrategy?: 'FIFO' | 'LIFO' | 'SUMMARIZE_OLDEST' | 'SUMMARIZE_MIDDLE' | 'TOKEN_BUDGET_PER_MESSAGE';

  /**
   * Default maximum number of messages (user/assistant turns) to retain in history.
   * Can be overridden by persona or request-specific settings.
   * @type {number}
   * @optional
   */
  defaultHistoryMaxMessages?: number;

  /**
   * Default maximum number of tokens to allocate to the conversation history segment of the prompt.
   * @type {number}
   * @optional
   */
  defaultHistoryMaxTokens?: number;

  /**
   * Default options for history summarization if a summarization strategy is chosen.
   * Should align with `IUtilityAI.SummarizationOptions`.
   * @type {Partial<import('../ai_utilities/IUtilityAI').SummarizationOptions>}
   * @optional
   */
  historySummarizationOptions?: Partial<import('../ai_utilities/IUtilityAI').SummarizationOptions>;

  /**
   * Default strategy for truncating retrieved context (e.g., from RAG).
   * - `TOP_K_BY_SCORE`: Keep the top K items based on their retrieval score.
   * - `TRUNCATE_CONTENT`: Truncate the content of individual context items if they are too long.
   * - `REMOVE_LOW_SCORE`: Remove items below a certain score threshold.
   * - `SUMMARIZE_CHUNK`: Summarize individual context chunks if they are too verbose.
   * @type {'TOP_K_BY_SCORE' | 'TRUNCATE_CONTENT' | 'REMOVE_LOW_SCORE' | 'SUMMARIZE_CHUNK'}
   * @optional
   * @default 'TRUNCATE_CONTENT'
   */
  defaultContextTruncationStrategy?: 'TOP_K_BY_SCORE' | 'TRUNCATE_CONTENT' | 'REMOVE_LOW_SCORE' | 'SUMMARIZE_CHUNK';

  /**
   * Default maximum total tokens allocated for all retrieved context items.
   * @type {number}
   * @optional
   */
  defaultContextMaxTokens?: number;

  /**
   * Default options for context summarization if a summarization strategy is chosen.
   * Should align with `IUtilityAI.SummarizationOptions`.
   * @type {Partial<import('../ai_utilities/IUtilityAI').SummarizationOptions>}
   * @optional
   */
  contextSummarizationOptions?: Partial<import('../ai_utilities/IUtilityAI').SummarizationOptions>;

  /**
   * Path or identifier for a directory, database, or remote store containing prompt templates.
   * The `PromptEngine` will use this to load named templates.
   * @type {string}
   * @optional
   */
  templateStorePath?: string;

  /**
   * Name of the default prompt template to use if no specific template is requested
   * by the agent or task, and if the `ModelTargetInfo.promptFormatType` doesn't imply one.
   * @type {string}
   * @optional
   * @default "default_chat_format"
   */
  defaultTemplateName?: string;

  /**
   * If true (default), the `PromptEngine` will attempt to use a provided `ITokenizer`
   * for precise token counting and truncation. If false or no tokenizer is available,
   * it will fall back to estimations (e.g., based on character count).
   * @type {boolean}
   * @optional
   * @default true
   */
  useTokenizerIfAvailable?: boolean;

  /**
   * Identifier of the `IUtilityAI` service instance to be used by the `PromptEngine`
   * for tasks like summarization. If not provided and summarization is needed,
   * the engine might fall back to simpler truncation or skip summarization.
   * This is used if `IUtilityAI` is managed by a central registry and not directly injected.
   * @type {string}
   * @optional
   */
  utilityAIServiceId?: string;
}

/**
 * Interface for a Tokenizer utility that the `PromptEngine` can use for accurate
 * token counting and management. This abstracts the specific tokenizer implementation
 * (e.g., Tiktoken for OpenAI models, SentencePiece for others).
 * @interface ITokenizer
 */
export interface ITokenizer {
  /**
   * Encodes a string of text into a sequence of token IDs.
   * @param {string} text - The text to encode.
   * @returns {number[] | Uint32Array} The array of token IDs.
   * @throws {Error} If encoding fails.
   */
  encode(text: string): number[] | Uint32Array;

  /**
   * Decodes a sequence of token IDs back into a string of text.
   * @param {number[] | Uint32Array} tokens - The array of token IDs to decode.
   * @returns {string} The decoded text.
   * @throws {Error} If decoding fails.
   */
  decode(tokens: number[] | Uint32Array): string;

  /**
   * Counts the number of tokens in a given string of text.
   * @param {string} text - The text for which to count tokens.
   * @returns {number} The total number of tokens.
   * @throws {Error} If token counting fails.
   */
  countTokens(text: string): number;
}

/**
 * Type alias for the function signature of a prompt template.
 * A template function takes processed messages, tool schemas, model info, and execution context,
 * and returns the final FormattedPrompt.
 */
export type PromptTemplateFunction = (
  processedContent: {
    messages: IntermediateMessage[]; // Using the internal IntermediateMessage structure
    toolSchemas?: ToolDefinition[];
  },
  modelInfo: ModelTargetInfo,
  executionContext: PromptExecutionContext
) => FormattedPrompt;


/**
 * Interface for an advanced PromptEngine capable of dynamic, contextual prompt assembly.
 * @interface IPromptEngine
 */
export interface IPromptEngine {
  /**
   * Initializes the `PromptEngine` with its configuration and optional dependencies
   * like a tokenizer and a utility AI service.
   *
   * @async
   * @param {PromptEngineConfig} config - Configuration for the `PromptEngine`.
   * @param {ITokenizer} [tokenizer] - Optional. An instance of `ITokenizer` for accurate token counting.
   * @param {import('../ai_utilities/IUtilityAI').IUtilityAI} [utilityAI] - Optional. An instance of an `IUtilityAI` service for tasks like summarization.
   * @returns {Promise<void>}
   * @throws {Error} If initialization fails (e.g., invalid config, failure to load templates).
   */
  initialize(
    config: PromptEngineConfig,
    tokenizer?: ITokenizer,
    utilityAI?: import('../ai_utilities/IUtilityAI').IUtilityAI
  ): Promise<void>;

  /**
   * Constructs a fully formatted prompt ready for an LLM, based on provided components,
   * target model information, and the current execution context.
   * This method handles dynamic selection of prompt elements (e.g., examples, instructions
   * from `IPersonaDefinition.promptConfig.contextualElements`), templating, token budgeting,
   * truncation, and summarization.
   *
   * @async
   * @param {Partial<PromptComponents>} components - The various pieces of content (system prompts, history, user input, RAG context, tools) to assemble.
   * @param {ModelTargetInfo} modelTargetInfo - Information about the target LLM (e.g., context window, prompt format, tool support).
   * @param {PromptExecutionContext} executionContext - Current contextual information (active persona, working memory state like mood, task hint, user skill) used for dynamic prompt adaptation.
   * @param {string} [templateName] - Optional name of a specific prompt template to use. If not provided, uses defaults from `PromptEngineConfig` or `ModelTargetInfo`.
   * @returns {Promise<PromptEngineResult>} An object containing the final formatted prompt, token counts, modification details, and any issues.
   * @throws {Error} If critical errors occur during prompt construction (e.g., inability to meet token budget even after modifications).
   */
  constructPrompt(
    components: Partial<PromptComponents>,
    modelTargetInfo: ModelTargetInfo,
    executionContext: PromptExecutionContext,
    templateName?: string
  ): Promise<PromptEngineResult>;

  /**
   * Estimates or accurately calculates the token count for a given piece of text or a set of prompt components,
   * considering the specified target model. This is useful for planning and pre-validation.
   * Note: This method typically provides a raw token count without applying complex assembly,
   * truncation, or summarization logic that `constructPrompt` would perform.
   *
   * @async
   * @param {string | Partial<PromptComponents>} textOrComponents - The text string or a partial `PromptComponents` object to tokenize.
   * @param {ModelTargetInfo} modelTargetInfo - Information about the target model, crucial for selecting the correct tokenizer or estimation method.
   * @returns {Promise<number>} The estimated or actual token count.
   * @throws {Error} If tokenization fails for the given model.
   */
  getTokenCount(
    textOrComponents: string | Partial<PromptComponents>,
    modelTargetInfo: ModelTargetInfo
  ): Promise<number>;

  /**
   * Registers a custom prompt template function with the engine.
   * This allows for extending the engine's templating capabilities at runtime.
   *
   * @async
   * @param {string} templateName - The unique name for this template.
   * @param {PromptTemplateFunction} templateFunction - The function that takes processed components and context, returning a `FormattedPrompt`.
   * @returns {Promise<void>}
   * @throws {Error} If the templateName is already registered (unless overwrite is supported and intended).
   */
  registerPromptTemplate(
    templateName: string,
    templateFunction: PromptTemplateFunction
  ): Promise<void>;
}