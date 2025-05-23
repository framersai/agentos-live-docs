// backend/agentos/core/orchestration/IAgentOrchestrator.ts

import { ConversationContext } from '../conversation/ConversationContext';
import { AgentOutput } from '../agents/IAgent';
import { IAgent } from '../agents/IAgent'; // For type hinting
import { AgentOrchestratorDependencies } from './AgentOrchestrator'; // Import the concrete dependencies interface

/**
 * @fileoverview Defines the interface for an Agent Orchestrator in AgentOS.
 * The orchestrator manages the lifecycle of an agent's interaction for a given
 * user query or task, handling turns, tool calls, and potential agent handoffs.
 * @module agentos/core/orchestration/IAgentOrchestrator
 */

/**
 * Configuration options for the AgentOrchestrator.
 */
export interface AgentOrchestratorConfig {
  /** Maximum number of sequential tool calls allowed in a single agent turn to prevent loops. @default 5 */
  maxToolCallIterations?: number;
  /** Default timeout in milliseconds for an agent's `processTurn` or `handleToolResult` method. @default 60000 (60 seconds) */
  defaultAgentTurnTimeoutMs?: number;
  /**
   * ID of a default "Error Handling Agent" or a meta-agent to consult if an orchestrated agent
   * enters an unrecoverable error state. If not set, orchestrator handles errors more directly.
   */
  errorHandlingAgentId?: string;
}

/**
 * @interface IAgentOrchestrator
 * Defines the contract for the central service that coordinates agent execution.
 */
export interface IAgentOrchestrator {
  /** A unique identifier for this orchestrator implementation. */
  readonly orchestratorId: string;

  /**
   * Initializes the agent orchestrator.
   * @param {AgentOrchestratorConfig} config - Orchestrator-specific configuration.
   * @param {AgentOrchestratorDependencies} dependencies - Other necessary services like AgentFactory, ToolExecutor, ModelRouter.
   */
  initialize(config: AgentOrchestratorConfig, dependencies: AgentOrchestratorDependencies): Promise<void>;

  /**
   * Processes a user query or initiates an agent task from start to finish for a single logical "turn"
   * or until the primary agent indicates completion or requires further user input.
   * This involves selecting an agent (if not specified), running its `processTurn` method,
   * handling any tool calls it requests by invoking the `ToolExecutor`, feeding results back to the
   * agent via `handleToolResult`, and continuing this loop until the agent is done or a limit is reached.
   *
   * @param {ConversationContext} conversationContext - The active conversation context, which will be updated.
   * @param {string | null} userInput - The latest input from the user for this turn. Can be null if agent is acting proactively.
   * @param {string} targetAgentId - The ID of the primary agent to handle this request.
   * @returns {Promise<AgentOutput>} The final output from the agent after its processing (and any tool calls) are complete for this logical turn.
   * This output might indicate the overall task is complete, or that it's paused awaiting more input/events.
   */
  processAgentTurn(
    conversationContext: ConversationContext,
    userInput: string | null,
    targetAgentId: string
  ): Promise<AgentOutput>;

  /**
   * (Advanced/Future) Handles a planned handoff from one agent to another.
   * @param {ConversationContext} conversationContext - The active conversation context.
   * @param {AgentOutput} currentAgentOutput - The output from the current agent that triggered the handoff.
   * @param {string} nextAgentId - The ID of the agent to handoff to.
   * @param {any} [handoffData] - Any specific data or instructions to pass to the next agent.
   * @returns {Promise<AgentOutput>} The output from the `nextAgentId` after it processes the handoff.
   */
  initiateAgentHandoff?(
    conversationContext: ConversationContext,
    currentAgentOutput: AgentOutput,
    nextAgentId: string,
    handoffData?: any
  ): Promise<AgentOutput>;
}