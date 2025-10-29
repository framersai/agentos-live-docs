// File: backend/agentos/api/interfaces/IAgentOS.ts
/**
 * @fileoverview Defines the core interface for the public-facing AgentOS class.
 * This interface outlines the contract for interacting with the unified AgentOS platform,
 * emphasizing a streaming-first approach, robust error handling, comprehensive
 * interaction capabilities, and seamless persona/agent management.
 *
 * @module backend/agentos/api/interfaces/IAgentOS
 * @see ../types/AgentOSInput.ts For AgentOSInput definition.
 * @see ../types/AgentOSResponse.ts For AgentOSResponse definition.
 * @see ../../cognitive_substrate/personas/IPersonaDefinition.ts For IPersonaDefinition.
 * @see ../../core/conversation/ConversationContext.ts For ConversationContext.
 * @see ../AgentOS.ts For AgentOSConfig definition.
 */

import { AgentOSInput, UserFeedbackPayload } from '../types/AgentOSInput';
import { AgentOSResponse } from '../types/AgentOSResponse';
import { IPersonaDefinition } from '../../cognitive_substrate/personas/IPersonaDefinition';
import { ConversationContext } from '../../core/conversation/ConversationContext';
import { AgentOSConfig } from '../AgentOS'; // AgentOSConfig is defined in AgentOS.ts
import type {
  WorkflowDefinition,
  WorkflowInstance,
  WorkflowProgressUpdate,
  WorkflowStatus,
} from '../../core/workflows/WorkflowTypes';
import type { WorkflowQueryOptions, WorkflowTaskUpdate } from '../../core/workflows/storage/IWorkflowStore';

/**
 * @interface IAgentOS
 * @description
 * Defines the contract for the main AgentOS system service, serving as the single,
 * unified entry point for all interactions with the AI agent platform.
 * It abstracts the underlying GMI and orchestration complexities, providing
 * a clear and powerful API for client applications. This service is responsible
 * for initializing and managing all core AgentOS components.
 */
export interface IAgentOS {
  /**
   * Initializes the AgentOS system with all necessary configurations and dependencies.
   * This method must be called successfully before any other AgentOS operations can be performed.
   * It sets up core components like GMIManager, AgentOSOrchestrator, PromptEngine, ToolSystem,
   * ConversationManager, Authentication, and Subscription services.
   *
   * @public
   * @async
   * @param {AgentOSConfig} config - The comprehensive configuration object for AgentOS.
   * This object should contain all necessary settings for the various subsystems,
   * including paths, service instances, and operational parameters.
   * @returns {Promise<void>} A promise that resolves once AgentOS and all its
   * critical components are fully initialized and ready for operation.
   * @throws {Error} If initialization fails due to missing or invalid configurations,
   * or if essential dependencies cannot be established (e.g., database connection,
   * critical service instantiation). The specific error type may vary (e.g., AgentOSServiceError).
   */
  initialize(config: AgentOSConfig): Promise<void>;

  /**
   * Processes a user request or initiates an agent task. This is the primary method
   * for interacting with AgentOS, designed to be streaming-first. It returns an
   * async generator that yields chunks of response as the agent processes the input,
   * performs actions, and generates output.
   *
   * @public
   * @async
   * @generator
   * @param {AgentOSInput} input - The comprehensive input for the current turn,
   * including user text, multimodal data, persona preferences, and processing options.
   * @yields {AgentOSResponse} - A stream of `AgentOSResponse` chunks, representing
   * text deltas, system progress, tool call requests, UI commands, or the final response.
   * Each chunk provides contextual information like `streamId` and `gmiInstanceId`.
   * @returns {AsyncGenerator<AgentOSResponse, void, undefined>} An async generator that
   * yields `AgentOSResponse` chunks. The generator completes when the final response
   * chunk (with `isFinal: true`) is yielded.
   * @throws {Error} If AgentOS is not initialized or if a critical error occurs during
   * the initial processing of the request that prevents the stream from starting or
   * continuing meaningfully. Such errors might be yielded as an `AgentOSErrorChunk`
   * as the first and final item in the stream if the stream can still be established.
   */
  processRequest(input: AgentOSInput): AsyncGenerator<AgentOSResponse, void, undefined>;

  /**
   * Handles the result of a tool execution that was previously requested by an agent
   * (via an `AgentOSToolCallRequestChunk`). This method is typically called by an
   * external system or a dedicated tool execution service after the tool has completed its operation.
   * It feeds the result back into the relevant GMI instance for continued processing.
   * The GMI's subsequent actions and responses are then streamed back to the client.
   *
   * @public
   * @async
   * @generator
   * @param {string} streamId - The original stream ID associated with the initial `processRequest`
   * call that led to the tool invocation. This ID is crucial for correlating the tool result
   * back to the correct GMI instance and ongoing interaction.
   * @param {string} toolCallId - The unique ID of the specific tool call (from the `ToolCall` object
   * in the `AgentOSToolCallRequestChunk`) whose result is being provided.
   * @param {string} toolName - The name of the tool that was executed (e.g., "web_search").
   * @param {any} toolOutput - The raw output or result data from the tool execution.
   * The structure of this data is tool-specific and should be interpretable by the GMI.
   * @param {boolean} isSuccess - Indicates whether the tool execution was successful.
   * If `false`, `errorMessage` should ideally be provided to give context on the failure.
   * @param {string} [errorMessage] - An optional error message if `isSuccess` is false.
   * Provides context about why the tool execution failed.
   * @returns {AsyncGenerator<AgentOSResponse, void, undefined>} An async generator that yields
   * `AgentOSResponse` chunks representing the agent's continued thought process and response
   * after processing the tool result.
   * @throws {Error} If AgentOS is not initialized, or if the `streamId` or `toolCallId`
   * is invalid or cannot be associated with an active GMI interaction. Such errors may
   * also be yielded as an `AgentOSErrorChunk`.
   */
  handleToolResult(
    streamId: string,
    toolCallId: string,
    toolName: string,
    toolOutput: any,
    isSuccess: boolean,
    errorMessage?: string,
  ): AsyncGenerator<AgentOSResponse, void, undefined>;

  /**
  /**
   * Lists registered workflow definitions available via the extension manager.
   */
  listWorkflowDefinitions(): WorkflowDefinition[];

  /**
   * Starts a workflow instance using the specified definition and input payload.
   */
  startWorkflow(
    definitionId: string,
    input: AgentOSInput,
    options?: {
      workflowId?: string;
      conversationId?: string;
      createdByUserId?: string;
      context?: Record<string, unknown>;
      roleAssignments?: Record<string, string>;
      metadata?: Record<string, unknown>;
    },
  ): Promise<WorkflowInstance>;

  /**
   * Retrieves a workflow instance by its identifier.
   */
  getWorkflow(workflowId: string): Promise<WorkflowInstance | null>;

  /**
   * Lists workflow instances matching the provided filters.
   */
  listWorkflows(options?: WorkflowQueryOptions): Promise<WorkflowInstance[]>;

  /**
   * Retrieves workflow progress details, including recent events, since an optional timestamp.
   */
  getWorkflowProgress(workflowId: string, sinceTimestamp?: string): Promise<WorkflowProgressUpdate | null>;

  /**
   * Updates the high-level workflow status (e.g., cancel, complete).
   */
  updateWorkflowStatus(workflowId: string, status: WorkflowStatus): Promise<WorkflowInstance | null>;

  /**
   * Applies task-level updates to a workflow instance.
   */
  applyWorkflowTaskUpdates(workflowId: string, updates: WorkflowTaskUpdate[]): Promise<WorkflowInstance | null>;
   * Retrieves a list of all available persona definitions (agents) configured in the system.
   * This is useful for clients (e.g., frontend UIs) to display available agent options to users.
   * The returned persona definitions are partial, omitting sensitive internal details like
   * full system prompts or private configuration data.
   *
   * @public
   * @async
   * @param {string} [userId] - Optional. If provided, the list might be filtered
   * based on user permissions or subscription tiers, ensuring the user only sees
   * personas they are entitled to access. This relies on the `SubscriptionService`.
   * @returns {Promise<Partial<IPersonaDefinition>[]>} A promise that resolves to an array of
   * partial `IPersonaDefinition` objects, suitable for public display.
   * @throws {Error} If AgentOS is not initialized or if an error occurs during persona retrieval.
   */
  listAvailablePersonas(userId?: string): Promise<Partial<IPersonaDefinition>[]>;

  /**
   * Retrieves the full conversation history for a given conversation ID.
   * This method allows clients to fetch past interactions for display, analysis, or re-engagement.
   * Access control is applied based on the `userId` to ensure users can only
   * retrieve their own conversations or conversations they have explicit permission to access.
   *
   * @public
   * @async
   * @param {string} conversationId - The unique ID of the conversation to retrieve.
   * @param {string} userId - The ID of the user requesting the conversation history.
   * This is crucial for authorization checks.
   * @returns {Promise<ConversationContext | null>} A promise that resolves to the full
   * `ConversationContext` object for the specified conversation, including all its
   * messages and metadata. Returns `null` if the conversation is not found or
   * if the user lacks the necessary permissions to access it.
   * @throws {Error} If AgentOS is not initialized or if a database error occurs during retrieval.
   */
  getConversationHistory(conversationId: string, userId: string): Promise<ConversationContext | null>;

  /**
   * Allows the system to receive and process explicit user feedback outside of a direct
   * turn interaction (e.g., feedback submitted via a separate UI element like thumbs up/down,
   * or a detailed feedback form). This feedback is routed to the appropriate GMI for
   * potential adaptation and learning, and may also be logged for system analytics.
   *
   * @public
   * @async
   * @param {string} userId - The ID of the user providing the feedback.
   * @param {string} sessionId - The ID of the session the feedback pertains to, helping to
   * contextualize the feedback with a specific interaction flow or GMI instance.
   * @param {string} personaId - The ID of the GMI persona the feedback is about.
   * @param {UserFeedbackPayload} feedbackPayload - The structured feedback payload,
   * as defined in `AgentOSInput.ts`.
   * @returns {Promise<void>} A promise that resolves when the feedback has been accepted
   * and queued for processing by the relevant GMI or system component. This does not
   * guarantee immediate processing or adaptation.
   * @throws {Error} If AgentOS is not initialized, or if an error occurs during
   * the initial routing, validation, or acceptance of the feedback.
   */
  receiveFeedback(userId: string, sessionId: string, personaId: string, feedbackPayload: UserFeedbackPayload): Promise<void>;

  /**
   * Gracefully shuts down the AgentOS system and all its sub-components.
   * This method ensures that active GMI instances are properly deactivated,
   * any pending data is persisted (e.g., conversation states to the database),
   * and all system resources (like database connections, network listeners, file handles)
   * are released in an orderly fashion. This should be called during application shutdown
   * to prevent data loss, corruption, or resource leaks.
   *
   * @public
   * @async
   * @returns {Promise<void>} A promise that resolves when AgentOS and all its
   * associated services have been successfully shut down.
   * @throws {Error} If a critical error occurs during the shutdown sequence of one or more components.
   */
  shutdown(): Promise<void>;
}
