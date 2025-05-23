// backend/agentos/api/interfaces/IAgentOS.ts

import { AgentOSInput } from '../types/AgentOSInput';
import { AgentOSResponse } from '../types/AgentOSResponse';
import { IPersonaDefinition } from '../../cognitive_substrate/personas/IPersonaDefinition';

/**
 * @fileoverview Defines the core interface for the public-facing AgentOS class.
 * This interface outlines the contract for interacting with the unified AgentOS platform,
 * emphasizing a streaming-first approach and seamless persona/agent management.
 * @module backend/agentos/api/interfaces/IAgentOS
 */

/**
 * @interface IAgentOS
 * @description
 * Defines the contract for the main AgentOS system, serving as the single,
 * unified entry point for all interactions with the AI agent platform.
 * It abstracts the underlying GMI and orchestration complexities.
 */
export interface IAgentOS {
  /**
   * Initializes the AgentOS system. This method is crucial for setting up
   * all necessary dependencies, loading configurations, and preparing the
   * system for operation. It should be called once at application startup.
   *
   * @async
   * @param {Object} config - The configuration object for AgentOS.
   * (This will be defined more concretely in a separate `AgentOSConfig` type/file.)
   * @returns {Promise<void>} A promise that resolves when AgentOS is fully initialized.
   * @throws {Error} If initialization fails due to missing configurations or dependencies.
   */
  initialize(config: any): Promise<void>; // TODO: Define AgentOSConfig type for 'config'

  /**
   * Processes a user request or initiates an agent task. This is the primary method
   * for interacting with AgentOS, designed to be streaming-first. It returns an
   * async generator that yields chunks of response as the agent processes the input,
   * performs actions, and generates output.
   *
   * @async
   * @generator
   * @param {AgentOSInput} input - The comprehensive input for the current turn,
   * including user text, multimodal data, persona preferences, and processing options.
   * @yields {AgentOSResponse} - A stream of `AgentOSResponse` chunks, representing
   * text deltas, system progress, tool call requests, UI commands, or the final response.
   * @returns {AsyncGenerator<AgentOSResponse, void, void>} An async generator that
   * yields `AgentOSResponse` chunks. The generator completes when the final response
   * chunk (with `isFinal: true`) is yielded.
   * @throws {Error} If a critical error occurs during the initial processing of the request
   * that prevents the stream from starting or continuing meaningfully.
   */
  processRequest(input: AgentOSInput): AsyncGenerator<AgentOSResponse>;

  /**
   * Handles the result of a tool execution that was previously requested by an agent.
   * This method is typically called by the `AgentOSOrchestrator` after an external
   * tool execution has completed, feeding the result back into the GMI for further processing.
   * This is also a streaming operation, as the agent will likely continue its thought process
   * and generate a response based on the tool's outcome.
   *
   * @async
   * @generator
   * @param {string} streamId - The original stream ID associated with the tool call.
   * This allows AgentOS to link the tool result back to the correct ongoing GMI instance.
   * @param {string} toolCallId - The unique ID of the specific tool call whose result is being provided.
   * @param {string} toolName - The name of the tool that was executed.
   * @param {any} toolOutput - The raw output or result from the tool execution.
   * @param {boolean} isSuccess - Indicates whether the tool execution was successful.
   * @param {string} [errorMessage] - An optional error message if `isSuccess` is false.
   * @returns {AsyncGenerator<AgentOSResponse, void, void>} An async generator that yields
   * `AgentOSResponse` chunks representing the agent's continued thought process and response
   * after processing the tool result.
   */
  handleToolResult(
    streamId: string,
    toolCallId: string,
    toolName: string,
    toolOutput: any,
    isSuccess: boolean,
    errorMessage?: string,
  ): AsyncGenerator<AgentOSResponse>;

  /**
   * Retrieves a list of all available persona definitions (agents) configured in the system.
   * This is useful for clients (e.g., frontend UIs) to display available options to users.
   *
   * @async
   * @param {string} [userId] - Optional. If provided, the list might be filtered
   * based on user permissions or subscription tiers.
   * @returns {Promise<IPersonaDefinition[]>} A promise that resolves to an array of
   * `IPersonaDefinition` objects, potentially with sensitive details omitted.
   */
  listAvailablePersonas(userId?: string): Promise<Partial<IPersonaDefinition>[]>;

  /**
   * Retrieves the full conversation history for a given conversation ID.
   *
   * @async
   * @param {string} conversationId - The unique ID of the conversation.
   * @param {string} userId - The ID of the user associated with the conversation.
   * @returns {Promise<ConversationContext | null>} A promise that resolves to the
   * `ConversationContext` object for the specified conversation, or `null` if not found.
   */
  getConversationHistory(conversationId: string, userId: string): Promise<any | null>; // TODO: Replace any with ConversationContext

  /**
   * Allows the system to receive and process explicit user feedback outside of a direct
   * turn interaction. This can be used for passive feedback collection or asynchronous
   * adaptation triggers.
   *
   * @async
   * @param {string} userId - The ID of the user providing feedback.
   * @param {string} sessionId - The ID of the session the feedback relates to.
   * @param {string} personaId - The ID of the persona being given feedback about.
   * @param {any} feedbackPayload - The structured feedback payload.
   * @returns {Promise<void>} A promise that resolves when the feedback has been processed.
   */
  receiveFeedback(userId: string, sessionId: string, personaId: string, feedbackPayload: any): Promise<void>;

  /**
   * Shuts down the AgentOS system and releases all its resources.
   * This should be called gracefully upon application shutdown.
   *
   * @async
   * @returns {Promise<void>} A promise that resolves when all resources are released.
   */
  shutdown(): Promise<void>;
}