// File: backend/agentos/cognitive_substrate/IGMI.ts
/**
 * @fileoverview Defines the core interface (IGMI) for a Generalized Mind Instance,
 * its configuration, inputs, outputs, states, and related data structures.
 * The GMI is the central cognitive engine in AgentOS.
 * @module backend/agentos/cognitive_substrate/IGMI
 */

import { IPersonaDefinition, MetaPromptDefinition } from './personas/IPersonaDefinition'; // Added MetaPromptDefinition
import { IWorkingMemory } from './memory/IWorkingMemory';
import { IPromptEngine } from '../core/llm/IPromptEngine';
import { IRetrievalAugmentor } from '../rag/IRetrievalAugmentor';
import { AIModelProviderManager } from '../core/llm/AIModelProviderManager'; // Corrected path
import { IUtilityAI } from '../core/ai_utilities/IUtilityAI';
import { IToolOrchestrator } from '../tools/IToolOrchestrator';
import { ModelUsage, ChatMessage } from '../core/llm/providers/IProvider'; // Used ChatMessage

/**
 * Defines the possible moods a GMI can be in, influencing its behavior and responses.
 * These moods can be adapted based on interaction context or self-reflection.
 * @enum {string}
 */
export enum GMIMood {
  NEUTRAL = 'neutral',
  FOCUSED = 'focused',
  EMPATHETIC = 'empathetic',
  CURIOUS = 'curious',
  ASSERTIVE = 'assertive',
  ANALYTICAL = 'analytical',
  FRUSTRATED = 'frustrated',
  CREATIVE = 'creative',
}

/**
 * Defines the primary operational states of a GMI.
 * @enum {string}
 */
export enum GMIPrimeState {
  IDLE = 'idle',
  INITIALIZING = 'initializing',
  READY = 'ready',
  PROCESSING = 'processing',
  AWAITING_TOOL_RESULT = 'awaiting_tool_result',
  REFLECTING = 'reflecting',
  ERRORED = 'errored',
  SHUTTING_DOWN = 'shutting_down',
  SHUTDOWN = 'shutdown',
}

/**
 * Represents the contextual information about the user interacting with the GMI.
 * @interface UserContext
 */
export interface UserContext {
  userId: string;
  skillLevel?: string;
  preferences?: Record<string, any>;
  pastInteractionSummary?: string;
  currentSentiment?: string;
  [key: string]: any;
}

/**
 * Represents the contextual information about the task the GMI is currently handling.
 * @interface TaskContext
 */
export interface TaskContext {
  taskId: string;
  domain?: string;
  complexity?: string;
  goal?: string;
  status?: 'not_started' | 'in_progress' | 'blocked' | 'requires_clarification' | 'completed' | 'failed';
  requirements?: string;
  progress?: number;
  [key: string]: any;
}

/**
 * Describes a request from the LLM to call a specific tool/function.
 * @interface ToolCallRequest
 */
export interface ToolCallRequest {
  id: string;
  name: string;
  arguments: Record<string, any>;
}

/**
 * Represents the result of a tool execution, structured to be sent back to the LLM.
 * @interface ToolCallResult
 */
export interface ToolCallResult {
  toolCallId: string;
  toolName: string;
  output: any;
  isError?: boolean;
  errorDetails?: any;
}

/**
 * Payload for providing tool results, abstracting success/error.
 * @export
 * @interface ToolResultPayload
 */
export type ToolResultPayload =
  | { type: 'success'; result: any }
  | { type: 'error'; error: { code: string; message: string; details?: any } };


/**
 * Configuration for visual input data.
 * @export
 * @interface VisionInputData
 */
export interface VisionInputData {
    type: 'image_url' | 'base64';
    data: string; // URL string or base64 encoded string
    mimeType?: string; // e.g., 'image/jpeg', 'image/png'
    description?: string; // Optional description for the GMI
}

/**
 * Configuration for audio input data.
 * @export
 * @interface AudioInputData
 */
export interface AudioInputData {
    type: 'audio_url' | 'base64' | 'transcription';
    data: string; // URL string, base64 encoded string, or text transcription
    mimeType?: string; // e.g., 'audio/mpeg', 'audio/wav'; not applicable for 'transcription'
    languageCode?: string; // BCP-47 language code, e.g., 'en-US'
}

/**
 * Structure for aggregating cost and token usage.
 * @export
 * @interface CostAggregator
 */
export interface CostAggregator {
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
    totalCostUSD?: number;
    breakdown?: Array<{
        providerId: string;
        modelId: string;
        tokens: number;
        promptTokens: number;
        completionTokens: number;
        costUSD?: number;
    }>;
}


/**
 * Base configuration required to initialize a GMI instance.
 * @interface GMIBaseConfig
 */
export interface GMIBaseConfig {
  workingMemory: IWorkingMemory;
  promptEngine: IPromptEngine;
  llmProviderManager: AIModelProviderManager;
  utilityAI: IUtilityAI;
  toolOrchestrator: IToolOrchestrator;
  retrievalAugmentor?: IRetrievalAugmentor;
  defaultLlmProviderId?: string;
  defaultLlmModelId?: string;
  customSettings?: Record<string, any>;
}

/**
 * Defines the type of interaction or input being provided to the GMI.
 * @enum {string}
 */
export enum GMIInteractionType {
  TEXT = 'text',
  MULTIMODAL_CONTENT = 'multimodal_content',
  TOOL_RESPONSE = 'tool_response',
  SYSTEM_MESSAGE = 'system_message',
  LIFECYCLE_EVENT = 'lifecycle_event',
}

/**
 * Represents a single turn of input to the GMI.
 * @interface GMITurnInput
 */
export interface GMITurnInput {
  interactionId: string;
  userId: string;
  sessionId?: string;
  type: GMIInteractionType;
  content: string | ToolCallResult | ToolCallResult[] | Record<string, any> | Array<Record<string, any>>;
  timestamp?: Date;
  userContextOverride?: Partial<UserContext>;
  taskContextOverride?: Partial<TaskContext>;
  metadata?: Record<string, any>;
}

/**
 * Defines the type of content in a `GMIOutputChunk`.
 * @enum {string}
 */
export enum GMIOutputChunkType {
  TEXT_DELTA = 'text_delta',
  TOOL_CALL_REQUEST = 'tool_call_request',
  REASONING_STATE_UPDATE = 'reasoning_state_update',
  FINAL_RESPONSE_MARKER = 'final_response_marker',
  ERROR = 'error',
  SYSTEM_MESSAGE = 'system_message',
  USAGE_UPDATE = 'usage_update',
  LATENCY_REPORT = 'latency_report',
  UI_COMMAND = 'ui_command', // Added to match GMI.ts usage
}

/**
 * Represents a chunk of output streamed from the GMI during turn processing.
 * @interface GMIOutputChunk
 */
export interface GMIOutputChunk {
  type: GMIOutputChunkType;
  content: any;
  chunkId?: string;
  interactionId: string;
  timestamp: Date;
  isFinal?: boolean;
  finishReason?: string;
  usage?: ModelUsage;
  errorDetails?: any;
  metadata?: Record<string, any>;
}

/**
 * Represents the complete, non-chunked output of a GMI turn or significant processing step (like after a tool result).
 * This interface can be expanded to include more fields as needed for a full response.
 * @export
 * @interface GMIOutput
 */
export interface GMIOutput {
    isFinal: boolean;
    responseText?: string | null;
    toolCalls?: ToolCallRequest[];
    uiCommands?: UICommand[]; // Using UICommand from IGMI.ts itself
    audioOutput?: AudioOutputConfig; // Using AudioOutputConfig from IGMI.ts itself
    imageOutput?: ImageOutputConfig; // Using ImageOutputConfig from IGMI.ts itself
    usage?: CostAggregator;
    reasoningTrace?: ReasoningTraceEntry[];
    error?: { code: string; message: string; details?: any };
    // Add other fields that constitute a complete GMI response if different from a chunk.
    // For now, making it structurally similar to what might be aggregated from chunks.
}

/**
 * Defines configuration for audio output (Text-to-Speech).
 * @export
 * @interface AudioOutputConfig
 */
export interface AudioOutputConfig {
    provider: string; // e.g., 'elevenlabs', 'browser_tts'
    voiceId?: string;
    textToSpeak: string; // The text that was or should be spoken
    url?: string; // URL to the generated audio file
    format?: string; // e.g., 'mp3', 'wav'
    languageCode?: string; // BCP-47
    customParams?: Record<string, any>;
}

/**
 * Defines configuration for generated image output.
 * @export
 * @interface ImageOutputConfig
 */
export interface ImageOutputConfig {
    provider?: string; // e.g., 'dall-e', 'stable-diffusion'
    promptUsed?: string;
    imageUrl?: string; // URL to the generated image
    base64Data?: string; // Base64 encoded image data
    format?: string; // e.g., 'png', 'jpeg'
    metadata?: Record<string, any>;
}

/**
 * Defines a command for the UI, to be interpreted by the client.
 * @export
 * @interface UICommand
 */
export interface UICommand {
    commandId: string; // e.g., 'render_block', 'show_notification', 'navigate_to'
    targetElementId?: string; // Optional: ID of a UI element to target
    payload: Record<string, any>; // Data for the command
    metadata?: Record<string, any>;
}


/**
 * Types of entries that can appear in a GMI's reasoning trace.
 * @enum {string}
 */
export enum ReasoningEntryType {
  LIFECYCLE = 'LIFECYCLE',
  INTERACTION_START = 'INTERACTION_START',
  INTERACTION_END = 'INTERACTION_END',
  STATE_CHANGE = 'STATE_CHANGE',
  PROMPT_CONSTRUCTION_START = 'PROMPT_CONSTRUCTION_START',
  PROMPT_CONSTRUCTION_DETAIL = 'PROMPT_CONSTRUCTION_DETAIL',
  PROMPT_CONSTRUCTION_COMPLETE = 'PROMPT_CONSTRUCTION_COMPLETE',
  LLM_CALL_START = 'LLM_CALL_START',
  LLM_CALL_COMPLETE = 'LLM_CALL_COMPLETE',
  LLM_RESPONSE_CHUNK = 'LLM_RESPONSE_CHUNK',
  LLM_USAGE = 'LLM_USAGE',
  TOOL_CALL_REQUESTED = 'TOOL_CALL_REQUESTED',
  TOOL_PERMISSION_CHECK_START = 'TOOL_PERMISSION_CHECK_START',
  TOOL_PERMISSION_CHECK_RESULT = 'TOOL_PERMISSION_CHECK_RESULT',
  TOOL_ARGUMENT_VALIDATION = 'TOOL_ARGUMENT_VALIDATION',
  TOOL_EXECUTION_START = 'TOOL_EXECUTION_START',
  TOOL_EXECUTION_RESULT = 'TOOL_EXECUTION_RESULT',
  RAG_QUERY_START = 'RAG_QUERY_START',
  RAG_QUERY_DETAIL = 'RAG_QUERY_DETAIL',
  RAG_QUERY_RESULT = 'RAG_QUERY_RESULT',
  RAG_INGESTION_START = 'RAG_INGESTION_START',
  RAG_INGESTION_DETAIL = 'RAG_INGESTION_DETAIL', // Added this
  RAG_INGESTION_COMPLETE = 'RAG_INGESTION_COMPLETE',
  SELF_REFLECTION_TRIGGERED = 'SELF_REFLECTION_TRIGGERED',
  SELF_REFLECTION_START = 'SELF_REFLECTION_START',
  SELF_REFLECTION_DETAIL = 'SELF_REFLECTION_DETAIL',
  SELF_REFLECTION_COMPLETE = 'SELF_REFLECTION_COMPLETE',
  SELF_REFLECTION_SKIPPED = 'SELF_REFLECTION_SKIPPED', // Added this
  MEMORY_LIFECYCLE_EVENT_RECEIVED = 'MEMORY_LIFECYCLE_EVENT_RECEIVED',
  MEMORY_LIFECYCLE_NEGOTIATION_START = 'MEMORY_LIFECYCLE_NEGOTIATION_START',
  MEMORY_LIFECYCLE_RESPONSE_SENT = 'MEMORY_LIFECYCLE_RESPONSE_SENT',
  HEALTH_CHECK_REQUESTED = 'HEALTH_CHECK_REQUESTED',
  HEALTH_CHECK_RESULT = 'HEALTH_CHECK_RESULT',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

/**
 * A single entry in the GMI's reasoning trace, providing an auditable log of its operations.
 * @interface ReasoningTraceEntry
 */
export interface ReasoningTraceEntry {
  timestamp: Date;
  type: ReasoningEntryType;
  message: string;
  details?: Record<string, any>;
}

/**
 * The complete reasoning trace for a GMI instance or a specific turn.
 * @interface ReasoningTrace
 */
export interface ReasoningTrace {
  gmiId: string;
  personaId: string;
  turnId?: string;
  entries: ReasoningTraceEntry[];
}

/**
 * Represents an event related to memory lifecycle management that the GMI needs to be aware of or act upon.
 * @interface MemoryLifecycleEvent
 */
export interface MemoryLifecycleEvent {
  eventId: string;
  timestamp: Date;
  type: 'EVICTION_PROPOSED' | 'ARCHIVAL_PROPOSED' | 'DELETION_PROPOSED' | 'SUMMARY_PROPOSED' | 'RETENTION_REVIEW_PROPOSED' | 'NOTIFICATION' | 'EVALUATION_PROPOSED';
  gmiId: string;
  personaId?: string;
  itemId: string;
  dataSourceId: string;
  category?: string;
  itemSummary: string;
  reason: string;
  proposedAction: LifecycleAction;
  negotiable: boolean;
  metadata?: Record<string, any>;
}

/**
 * Defines the possible actions a GMI can take or that can be proposed/taken regarding a memory item.
 * @enum {string}
 */
export type LifecycleAction =
  | 'ALLOW_ACTION'
  | 'PREVENT_ACTION'
  | 'DELETE'
  | 'ARCHIVE'
  | 'SUMMARIZE_AND_DELETE'
  | 'SUMMARIZE_AND_ARCHIVE'
  | 'RETAIN_FOR_DURATION'
  | 'MARK_AS_CRITICAL'
  | 'NO_ACTION_TAKEN'
  | 'ACKNOWLEDGE_NOTIFICATION';


/**
 * The GMI's response to a `MemoryLifecycleEvent`.
 * @interface LifecycleActionResponse
 */
export interface LifecycleActionResponse {
  gmiId: string;
  eventId: string;
  actionTaken: LifecycleAction;
  rationale?: string;
  requestedRetentionDuration?: string;
  metadata?: Record<string, any>;
}

/**
 * A report on the GMI's health, including its sub-components.
 * @interface GMIHealthReport
 */
export interface GMIHealthReport {
  gmiId: string;
  personaId: string;
  timestamp: Date;
  overallStatus: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' | 'ERROR';
  currentState: GMIPrimeState;
  memoryHealth?: {
    overallStatus: 'OPERATIONAL' | 'DEGRADED' | 'ERROR' | 'LIMITED';
    workingMemoryStats?: { itemCount: number; [key: string]: any };
    ragSystemStats?: { isHealthy: boolean; details?: any };
    lifecycleManagerStats?: { isHealthy: boolean; details?: any };
    issues?: Array<{ severity: 'critical' | 'warning' | 'info'; description: string; component: string; details?: any }>;
  };
  dependenciesStatus?: Array<{
    componentName: string;
    status: 'HEALTHY' | 'UNHEALTHY' | 'DEGRADED' | 'UNKNOWN';
    details?: any;
  }>;
  recentErrors?: ReasoningTraceEntry[];
  uptimeSeconds?: number;
  activeTurnsProcessed?: number;
}


/**
 * @interface IGMI
 * @description Defines the contract for a Generalized Mind Instance (GMI).
 */
export interface IGMI {
  readonly gmiId: string;
  readonly creationTimestamp: Date;

  initialize(persona: IPersonaDefinition, config: GMIBaseConfig): Promise<void>;
  getPersona(): IPersonaDefinition;
  getGMIId(): string;
  getCurrentState(): GMIPrimeState;
  processTurnStream(turnInput: GMITurnInput): AsyncGenerator<GMIOutputChunk, void, undefined>;

  /**
   * Handles the result of a tool execution and continues processing.
   * This method is called after an LLM-requested tool has been executed externally (or by ToolOrchestrator)
   * and its result needs to be fed back to the GMI/LLM.
   *
   * @async
   * @param {string} toolCallId - The ID of the original tool call request.
   * @param {string} toolName - The name of the tool that was executed.
   * @param {ToolResultPayload} resultPayload - The result of the tool execution (success or error).
   * @param {string} userId - The ID of the user for context.
   * @param {Record<string, string>} [userApiKeys] - Optional user-specific API keys for LLM providers.
   * @returns {Promise<GMIOutput>} A promise that resolves to the GMI's complete output after processing the tool result.
   * This output might include further text, new tool calls, or a final response.
   * @throws {GMIError} If an error occurs during processing of the tool result.
   */
  handleToolResult(
    toolCallId: string,
    toolName: string,
    resultPayload: ToolResultPayload,
    userId: string,
    userApiKeys?: Record<string, string>
  ): Promise<GMIOutput>;


  getReasoningTrace(): Readonly<ReasoningTrace>;
  _triggerAndProcessSelfReflection(): Promise<void>;
  onMemoryLifecycleEvent(event: MemoryLifecycleEvent): Promise<LifecycleActionResponse>;
  analyzeAndReportMemoryHealth(): Promise<GMIHealthReport['memoryHealth']>;
  getOverallHealth(): Promise<GMIHealthReport>;
  shutdown(): Promise<void>;
}