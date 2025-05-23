/**
 * @fileoverview This file defines the IGMI (Generalized Mind Instance) interface,
 * which serves as the core contract for all cognitive engines within AgentOS.
 * A GMI is responsible for embodying a persona, processing inputs, managing its
 * internal state and memory, orchestrating interactions with LLMs and tools,
 * and generating responses. This interface emphasizes adaptability, streaming,
 * and robust error handling.
 *
 * The IGMI interface is designed to be implemented by classes that can handle
 * complex cognitive loops, adapt to user feedback, manage persona-specific
 * configurations, and provide detailed tracing for observability.
 * @module backend/agentos/cognitive_substrate/IGMI
 */

import { IPersonaDefinition, PersonaStateOverride } from './personas/IPersonaDefinition';
import { IWorkingMemory } from './memory/IWorkingMemory';
import { AIModelProviderManager } from '../core/llm/providers/AIModelProviderManager';
import { PromptEngine } from '../core/llm/PromptEngine';
import { ToolExecutor } from '../tools/ToolExecutor';
import { IModelRouter } from '../core/llm/routing/IModelRouter';
import { ConversationContext, Message } from '../core/conversation/ConversationContext';
import { IAuthService } from '../../services/user_auth/AuthService';
import { ISubscriptionService } from '../../services/user_auth/SubscriptionService';
import { ConversationManager } from '../core/conversation/ConversationManager';
import { PrismaClient } from '@prisma/client'; // Assuming PrismaClient is used for some underlying operations

/**
 * Represents a segment of vision input data.
 * @interface VisionInputData
 */
export interface VisionInputData {
  /**
   * The type of vision data provided.
   * 'url': The data is a URL pointing to an image.
   * 'base64': The data is a base64 encoded image string.
   * @type {'url' | 'base64'}
   */
  type: 'url' | 'base64';

  /**
   * The actual vision data (URL string or base64 encoded image string).
   * @type {string}
   */
  data: string;

  /**
   * Optional media type of the image (e.g., 'image/jpeg', 'image/png').
   * Important for base64 encoded data.
   * @type {string}
   * @optional
   */
  mediaType?: string;

  /**
   * Optional description or caption for the image, which can aid the GMI's understanding.
   * @type {string}
   * @optional
   */
  description?: string;
}

/**
 * Represents a segment of audio input data.
 * @interface AudioInputData
 */
export interface AudioInputData {
  /**
   * The type of audio data provided.
   * 'url': The data is a URL pointing to an audio file.
   * 'base64': The data is a base64 encoded audio string.
   * 'transcription_id': An ID referencing a pre-transcribed audio segment.
   * @type {'url' | 'base64' | 'transcription_id'}
   */
  type: 'url' | 'base64' | 'transcription_id';

  /**
   * The actual audio data or reference ID.
   * @type {string}
   */
  data: string;

  /**
   * Optional media type of the audio (e.g., 'audio/wav', 'audio/mpeg').
   * Important for base64 encoded data or URLs if not inferable.
   * @type {string}
   * @optional
   */
  mediaType?: string;

  /**
   * Optional textual transcription of the audio, if already available.
   * Providing this can save a transcription step for the GMI.
   * @type {string}
   * @optional
   */
  transcription?: string;
}

/**
 * Represents user feedback provided to the GMI for adaptation.
 * @interface UserFeedback
 */
export interface UserFeedback {
  /**
   * Optional sentiment expressed by the user regarding a previous interaction or output.
   * @type {'positive' | 'negative' | 'neutral' | string}
   * @optional
   * @example "positive", "confusing_output", "too_verbose"
   */
  sentiment?: 'positive' | 'negative' | 'neutral' | string;

  /**
   * Optional explicit correction provided by the user for a previous output.
   * @type {string}
   * @optional
   */
  correction?: string;

  /**
   * Optional key-value pairs representing user preferences that should be remembered or applied.
   * @type {Record<string, any>}
   * @optional
   * @example { "preferred_language": "Python", "coding_style": "functional" }
   */
  preferences?: Record<string, any>;

  /**
   * Optional reference to a specific message ID or interaction this feedback pertains to.
   * @type {string}
   * @optional
   */
  targetInteractionId?: string;

  /**
   * Any additional structured feedback data.
   * @type {any}
   * @optional
   */
  customData?: any;
}

/**
 * Input structure for a single turn of interaction with the GMI.
 * This comprehensive structure encapsulates all necessary information for the GMI
 * to process a user's request or continue an ongoing task.
 * @interface GMITurnInput
 */
export interface GMITurnInput {
  /**
   * The unique identifier for the user interacting with the GMI.
   * This is crucial for context, personalization, and access control.
   * @type {string}
   */
  userId: string;

  /**
   * The unique identifier for the current session. A session can span multiple turns.
   * @type {string}
   */
  sessionId: string;

  /**
   * The unique identifier for the conversation this turn belongs to.
   * A conversation can span multiple sessions if persisted and reloaded.
   * @type {string}
   * @optional // Might be undefined if it's the first turn of a new conversation
   */
  conversationId?: string;

  /**
   * The primary textual input from the user for this turn.
   * Can be null if the turn is driven by other inputs (e.g., tool result, system event).
   * @type {string | null}
   * @optional
   */
  textInput?: string | null;

  /**
   * An array of vision input data segments (e.g., images).
   * Allows for multimodal input where the GMI needs to process visual information.
   * @type {VisionInputData[]}
   * @optional
   */
  visionInputs?: VisionInputData[];

  /**
   * Audio input data for this turn.
   * The GMI might handle transcription internally or expect pre-transcribed text.
   * @type {AudioInputData}
   * @optional
   */
  audioInput?: AudioInputData;

  /**
   * User-provided API keys for specific LLM providers, allowing users to use their own quotas.
   * The keys are mapped by provider ID (e.g., "openai", "anthropic").
   * @type {Record<string, string>}
   * @optional
   */
  userApiKeys?: Record<string, string>;

  /**
   * A hint about the primary task or intent of this turn.
   * This can help the GMI in selecting appropriate models, tools, or reasoning strategies.
   * @type {string}
   * @optional
   * @example "code_generation", "data_analysis", "general_query", "summarize_document"
   */
  taskHint?: string;

  /**
   * Structured user feedback related to previous interactions, used for GMI adaptation.
   * @type {UserFeedback}
   * @optional
   */
  userFeedback?: UserFeedback;

  /**
   * If specified, instructs the GMI to attempt to switch to this persona ID.
   * @type {string}
   * @optional
   */
  explicitPersonaSwitchId?: string;

  /**
   * Allows for direct overrides of specific GMI/persona state variables in working memory
   * for the current turn. This is an advanced feature for fine-grained control.
   * @type {PersonaStateOverride[]}
   * @optional
   */
  personaStateOverrides?: PersonaStateOverride[];

  /**
   * Overrides for model selection for the current turn.
   * Allows users or systems to guide the GMI's choice of LLM.
   * @type {ModelSelectionOverrides}
   * @optional
   */
  modelSelectionOverrides?: ModelSelectionOverrides;

  /**
   * Arbitrary metadata that can be passed along with the input for custom processing or logging.
   * @type {Record<string, any>}
   * @optional
   */
  metadata?: Record<string, any>;
}

/**
 * Represents a request from the GMI to execute one or more tools.
 * @interface ToolCall
 */
export interface ToolCall {
  /**
   * A unique identifier for this specific tool call instance, generated by the LLM.
   * This ID is used to correlate the call with its result.
   * @type {string}
   */
  id: string;

  /**
   * The type of the tool call, typically 'function' for standard tool execution.
   * @type {'function'}
   */
  type: 'function'; // Currently, only 'function' type is standard.

  /**
   * Contains the details of the function to be called.
   * @type {{ name: string; arguments: Record<string, any>; }}
   */
  function: {
    /**
     * The name of the tool/function to be executed. This should match a registered tool ID.
     * @type {string}
     */
    name: string;
    /**
     * The arguments for the tool, parsed into a JavaScript object.
     * The LLM typically provides these as a JSON string, which should be parsed before this stage.
     * @type {Record<string, any>}
     */
    arguments: Record<string, any>;
  };
}

/**
 * Represents the payload of a result from a tool execution.
 * @interface ToolResultPayload
 */
export interface ToolResultPayload {
  /**
   * Indicates whether the tool execution was successful or resulted in an error.
   * @type {'success' | 'error'}
   */
  type: 'success' | 'error';

  /**
   * The output data from the tool if the execution was successful.
   * The structure of this data is tool-dependent.
   * @type {any}
   * @optional
   */
  result?: any;

  /**
   * Details of the error if the tool execution failed.
   * @type {{ message: string; code?: string; details?: any; }}
   * @optional
   */
  error?: {
    message: string;
    code?: string; // Optional error code (e.g., 'TOOL_TIMEOUT', 'INVALID_ARGUMENTS')
    details?: any; // Additional structured error information
  };

  /**
   * Optional: The format of the `result` data (e.g., 'json', 'text', 'image_url').
   * @type {string}
   * @optional
   */
  contentType?: string;
}

/**
 * Represents a chunk of output data yielded by the GMI during streaming.
 * This is the primary mechanism for real-time communication from the GMI.
 * @interface GMIOutputChunk
 */
export type GMIOutputChunk =
  | {
      type: 'GMIResponseChunk';
      streamId: string;
      isFinal: false;
      gmiInstanceId: string;
      personaId: string;
      responseTextDelta?: string; // Delta of the textual response
      toolCallDelta?: Partial<ToolCall>; // Partial tool call information as it's streamed
      uiCommandDelta?: any; // Partial UI command
      usage?: ModelUsage; // Incremental usage for this chunk
      timestamp?: string; // Timestamp of this chunk generation
    }
  | {
      type: 'ToolCallRequest'; // Indicates LLM decided to call tools, GMI is now yielding them
      streamId: string;
      isFinal: false; // Not final for the turn, but final for this specific LLM interaction round
      gmiInstanceId: string;
      personaId: string;
      toolCalls: ToolCall[]; // Complete tool call objects
      responseText?: string | null; // Any text generated by LLM before deciding to call tools
      usage: CostAggregator; // Accumulated usage up to this point
      reasoningTrace: ReasoningTrace[];
    }
  | {
      type: 'ToolResultProcessed'; // Emitted after GMI processes a tool result internally before continuing thought
      streamId: string;
      isFinal: false;
      gmiInstanceId: string;
      personaId: string;
      toolCallId: string;
      toolName: string;
      status: 'success' | 'error';
      message?: string; // e.g., "Tool executed successfully, GMI is now processing the result."
    }
  | {
      type: 'SystemProgress'; // For GMI to report internal state or progress
      streamId: string;
      isFinal: false;
      gmiInstanceId: string;
      personaId: string;
      message: string;
      statusCode: string; // e.g., 'MODEL_SELECTED', 'PROMPT_CONSTRUCTED', 'ADAPTATION_COMPLETE'
      progressPercentage?: number; // Optional progress indicator (0-100)
      metadata?: Record<string, any>;
    }
  | {
      type: 'Error'; // A fatal error chunk, indicates the stream will terminate.
      streamId: string;
      isFinal: true;
      gmiInstanceId: string;
      personaId: string;
      error: { code: string; message: string; details?: any };
      usage: CostAggregator; // Usage up to the point of error
      reasoningTrace: ReasoningTrace[];
      responseText: null; // Explicitly null for error type
    }
  | {
      type: 'FinalResponse'; // The final conclusive output for the turn.
      streamId: string;
      isFinal: true;
      gmiInstanceId: string;
      personaId:string;
      responseText: string | null;
      toolCalls?: ToolCall[]; // If the final action was a tool call (less common for FinalResponse)
      uiCommands?: any[]; // Final UI commands
      audioOutput?: { textToSpeak: string; voiceConfig?: any };
      imageOutput?: VisionInputData; // e.g., if an image was generated
      usage: CostAggregator;
      reasoningTrace: ReasoningTrace[];
      error?: { code: string; message: string; details?: any }; // Non-fatal error or warning with the final response
      conversationContext?: ConversationContext; // Optional: include the updated conversation context state
    };


/**
 * Represents the fully aggregated output of a GMI turn after all streaming is complete.
 * This is the type returned by the generator when it's done.
 * Note: `GMIOutputChunk` now serves for both streaming chunks and the final resolved object
 * by using `isFinal: true` and specific `type` values like 'FinalResponse' or 'Error'.
 * This `GMIOutput` type can be considered a union of the possible terminal `GMIOutputChunk` types.
 */
export type GMIOutput = Extract<GMIOutputChunk, { isFinal: true }>;


/**
 * Represents a snapshot of the GMI's operational state.
 * This allows for persistence, migration, or debugging of GMI instances.
 * @interface IGMISnapshot
 */
export interface IGMISnapshot {
  /** The ID of the GMI instance this snapshot belongs to. */
  gmiInstanceId: string;
  /** ISO timestamp of when the snapshot was created. */
  timestamp: string;
  /** Version of the snapshot schema, for handling migrations. */
  version: string;
  /** ID of the GMI's currently active primary persona. */
  currentPrimaryPersonaId: string;
  /** List of IDs of all persona definitions known/available to the GMI at the time of snapshot. */
  availablePersonaIds: string[];
  /** A snapshot of the GMI's working memory contents. */
  workingMemorySnapshot: Record<string, any>;
  /** A snapshot of the GMI's conversation context. */
  conversationContextSnapshot: any; // Define a specific snapshot type for ConversationContext
  /** A snapshot of the GMI's reasoning trace for the current or last turn. */
  reasoningTraceSnapshot?: ReasoningTrace[];
  /** Current adaptive mood of the GMI, if applicable. */
  currentMood?: string;
  /** Any other relevant state information specific to the GMI implementation. */
  customState?: Record<string, any>;
}

/**
 * Represents a single step or event in the GMI's reasoning process for a turn.
 * Used for tracing, debugging, and understanding GMI behavior.
 * @interface ReasoningTrace
 */
export interface ReasoningTrace {
  /** Sequence number of this trace event within the turn. */
  sequence: number;
  /** Timestamp of the event. */
  timestamp: Date;
  /** Type of event (e.g., 'ModelSelection', 'PromptConstruction', 'ToolCall', 'Adaptation'). */
  event: string;
  /** Human-readable details or summary of the event. */
  details: string;
  /** Optional structured data associated with the event (e.g., selected model ID, prompt content, tool arguments). */
  data?: any;
}

/**
 * Aggregates cost and usage information for all model calls within a GMI turn.
 * @interface CostAggregator
 */
export interface CostAggregator {
  /** Total estimated cost in USD for all calls in the turn. */
  totalCostUSD: number;
  /** Array of usage details for each individual model call. */
  calls: Array<{
    providerId: string;
    modelId: string;
    usage: ModelUsage;
  }>;
}

/**
 * Base configuration and shared dependencies required by a GMI instance.
 * This is typically provided by the GMIManager when creating a GMI.
 * @interface GMIBaseConfig
 */
export interface GMIBaseConfig {
  /** Manages all available AI model providers. */
  providerManager: AIModelProviderManager;
  /** Engine for constructing prompts dynamically. */
  promptEngine: PromptEngine;
  /** Executor for running tools. */
  toolExecutor: ToolExecutor;
  /** Service for user authentication and API key management. */
  authService: IAuthService;
  /** Service for managing user subscriptions and entitlements. */
  subscriptionService: ISubscriptionService;
  /** Manages conversation contexts. */
  conversationManager: ConversationManager;
  /** Optional. Router for selecting models based on criteria. */
  modelRouter?: IModelRouter;
  /** Prisma client for database interactions, if needed by GMI or its components. */
  prisma?: PrismaClient; // Made optional, GMI itself might not always need direct DB access
  /** Any other global configurations or shared services. */
  [key: string]: any;
}

/**
 * Overrides for model selection parameters, allowing external input to influence
 * which model the GMI chooses for a particular task.
 * @interface ModelSelectionOverrides
 */
export interface ModelSelectionOverrides {
  /**
   * Explicitly request a specific model ID. If provided, the GMI will try to use this model,
   * subject to availability and persona constraints.
   * @type {string}
   * @optional
   */
  preferredModelId?: string;

  /**
   * Explicitly request a model from a specific provider ID.
   * Useful in conjunction with `preferredModelId` or `modelFamily`.
   * @type {string}
   * @optional
   */
  preferredProviderId?: string;

  /**
   * Request a model from a specific family (e.g., "gpt-4", "claude-3").
   * The GMI will select the best available model from this family.
   * @type {string}
   * @optional
   */
  modelFamily?: string;

  /**
   * Specify a minimum quality tier for the model.
   * @type {'fastest' | 'balanced' | 'best'}
   * @optional
   */
  minQualityTier?: 'fastest' | 'balanced' | 'best';

  /**
   * Override the temperature setting for the LLM call.
   * @type {number}
   * @optional
   */
  temperature?: number;

  /**
   * Override the maximum number of tokens to generate.
   * @type {number}
   * @optional
   */
  maxTokens?: number;

  /**
   * Override the top_p (nucleus sampling) parameter.
   * @type {number}
   * @optional
   */
  topP?: number;

  /**
   * List of capabilities the selected model absolutely must have for this turn.
   * @type {string[]}
   * @optional
   * @example ["tool_use", "vision_input"]
   */
  requiredCapabilities?: string[];
}


/**
 * Interface for a Generalized Mind Instance (GMI).
 * Defines the contract for the core cognitive engine of AgentOS.
 * @interface IGMI
 */
export interface IGMI {
  /**
   * Unique identifier for this GMI instance.
   * @readonly
   * @type {string}
   */
  readonly instanceId: string;

  /**
   * The conversation context associated with this GMI instance.
   * This holds the history of interactions and other contextual data for the current conversation.
   * @type {ConversationContext}
   */
  conversationContext: ConversationContext;


  /**
   * Initializes the GMI instance with its foundational persona, a list of all available personas
   * it might switch to, its working memory, and its conversation context.
   * This method must be called before the GMI can process any turns.
   *
   * @async
   * @param {IPersonaDefinition} initialPersona - The persona definition to activate initially.
   * @param {IPersonaDefinition[]} availablePersonas - All persona definitions known to the system,
   * allowing the GMI to potentially switch personas later.
   * @param {IWorkingMemory} workingMemory - The working memory instance for this GMI to use.
   * @param {ConversationContext} conversationContext - The conversation context for this GMI.
   * @returns {Promise<void>} A promise that resolves upon successful initialization.
   * @throws {Error} If initialization fails (e.g., invalid persona, memory setup issues).
   */
  initialize(
    initialPersona: IPersonaDefinition,
    availablePersonas: IPersonaDefinition[],
    workingMemory: IWorkingMemory,
    conversationContext: ConversationContext
  ): Promise<void>;

  /**
   * Retrieves the ID of the currently active primary persona for this GMI.
   *
   * @returns {string} The ID of the current primary persona.
   * @throws {Error} If no persona is currently active.
   */
  getCurrentPrimaryPersonaId(): string;

  /**
   * Retrieves the full definition of the currently active primary persona.
   *
   * @returns {IPersonaDefinition | undefined} The active persona definition, or undefined if none is active.
   */
  getCurrentPersonaDefinition(): IPersonaDefinition | undefined;

  /**
   * Activates a specific persona for the GMI. This involves loading the persona's
   * configuration, applying initial memory imprints, and potentially clearing
   * session-specific adaptations if switching from a different persona.
   *
   * @async
   * @param {string} personaId - The ID of the persona to activate.
   * @returns {Promise<void>} A promise that resolves when the persona is successfully activated.
   * @throws {Error} If the persona with the given ID is not found or activation fails.
   */
  activatePersona(personaId: string): Promise<void>;

  /**
   * Processes a single turn of interaction. This is an asynchronous generator that
   * yields chunks of the GMI's output in real-time (e.g., text deltas, tool call requests).
   * The generator completes by yielding a final `GMIOutput` object that summarizes the turn.
   *
   * @async
   * @generator
   * @param {GMITurnInput} input - The comprehensive input for the current turn.
   * @yields {GMIOutputChunk} Successive chunks of the GMI's processing output.
   * @returns {AsyncGenerator<GMIOutputChunk, GMIOutput, undefined>} The generator,
   * which on completion (return) provides the final `GMIOutput` for the turn.
   */
  processTurnStream(input: GMITurnInput): AsyncGenerator<GMIOutputChunk, GMIOutput, undefined>;

  /**
   * Handles the result of an external tool execution that was previously requested by the GMI.
   * After processing the tool result, the GMI may continue its reasoning process, potentially
   * leading to further LLM calls or a final response. This method produces a single,
   * conclusive `GMIOutput` for this tool result processing step.
   *
   * @async
   * @param {string} toolCallId - The ID of the original tool call request.
   * @param {string} originalToolName - The name of the tool that was executed.
   * @param {ToolResultPayload} toolResultPayload - The structured payload containing the tool's output or error.
   * @param {string} userId - The ID of the user context for this operation.
   * @param {Record<string, string>} [userApiKeys] - Optional user-provided API keys for subsequent LLM calls.
   * @param {ModelSelectionOverrides} [modelSelectionOverrides] - Optional overrides for model selection for the LLM call processing the tool result.
   * @returns {Promise<GMIOutput>} The GMI's output after processing the tool result. This could be a
   * `FinalResponse` or another `ToolCallRequest` if the GMI decides to call another tool.
   */
  handleToolResult(
    toolCallId: string,
    originalToolName: string,
    toolResultPayload: ToolResultPayload,
    userId: string,
    userApiKeys?: Record<string, string>,
    modelSelectionOverrides?: ModelSelectionOverrides
  ): Promise<GMIOutput>; // Returns a single GMIOutput, not a stream.

  /**
   * Allows the GMI to adapt its internal state (e.g., mood, preferences stored in working memory)
   * based on explicit user feedback.
   *
   * @async
   * @param {UserFeedback} feedback - The structured feedback provided by the user.
   * @param {string} userId - The ID of the user providing the feedback (for context).
   * @returns {Promise<void>} A promise that resolves when the adaptation has been processed.
   */
  adapt(feedback: UserFeedback, userId: string): Promise<void>;

  /**
   * Creates a snapshot of the GMI's current operational state. This includes
   * the active persona, working memory, conversation context, and other relevant state.
   *
   * @async
   * @returns {Promise<IGMISnapshot>} A promise that resolves with the snapshot object.
   * @throws {Error} If snapshot creation fails.
   */
  createSnapshot(): Promise<IGMISnapshot>;

  /**
   * Restores the GMI's internal state from a previously created snapshot.
   * This will rehydrate the working memory, conversation context, and reactivate
   * the correct persona.
   *
   * @async
   * @param {IGMISnapshot} snapshot - The snapshot object to restore from.
   * @param {IPersonaDefinition[]} availablePersonas - All persona definitions known to the system,
   * needed to ensure the snapshot's persona can be re-activated.
   * @param {IWorkingMemory} workingMemory - The working memory instance to restore into.
   * @param {ConversationContext} conversationContext - The conversation context to restore into.
   * @returns {Promise<void>} A promise that resolves when the state has been restored.
   * @throws {Error} If restoration fails (e.g., snapshot incompatibility, missing persona).
   */
  restoreFromSnapshot(
    snapshot: IGMISnapshot,
    availablePersonas: IPersonaDefinition[],
    workingMemory: IWorkingMemory, // Pass instances to restore into
    conversationContext: ConversationContext
  ): Promise<void>;

  /**
   * Gracefully closes the GMI instance, releasing any held resources such as
   * connections to memory stores or other services.
   *
   * @async
   * @returns {Promise<void>} A promise that resolves when the GMI is closed.
   */
  close(): Promise<void>;
}