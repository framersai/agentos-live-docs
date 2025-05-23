// backend/agentos/core/orchestration/AgentOrchestrator.ts

import { IAgentOrchestrator, AgentOrchestratorConfig } from './IAgentOrchestrator';
import { ConversationContext } from '../conversation/ConversationContext';
import { AgentOutput, IAgent, AgentToolCall } from '../agents/IAgent';
import { IToolExecutor } from '../agents/tools/IToolExecutor';
import { IAgentFactory } from '../agents/IAgentFactory';
import { IProvider } from '../llm/providers/IProvider';
import { AIModelProviderManager } from '../llm/providers/AIModelProviderManager';
import { MessageRole } from '../conversation/ConversationMessage';
import { v4 as uuidv4 } from 'uuid'; // For generating UUIDs for tool calls if missing

/**
 * @fileoverview Implements the core Agent Orchestrator for AgentOS.
 * Manages the execution flow of an agent's turn, including processing user input,
 * handling tool calls, and managing the conversation context updates.
 * @module agentos/core/orchestration/AgentOrchestrator
 */

/**
 * Defines the execution context provided to tools.
 * (Placeholder - needs proper definition where ToolExecutor is implemented)
 */
interface ToolExecutionContext {
  userId: string;
  conversationId: string;
  agentId: string;
  // apiKeyStore?: IAPIKeyStore; // conceptual
  // eventBus?: IEventBus; // conceptual
}

/**
 * Dependencies required by the AgentOrchestrator.
 * These are typically injected during initialization.
 */
export interface AgentOrchestratorDependencies {
  agentFactory: IAgentFactory;
  toolExecutor: IToolExecutor;
  providerManager: AIModelProviderManager; // For fetching providers for agents
  // modelRouter?: IModelRouter; // If routing is done before selecting agent, or for agent to select sub-models.
}

/**
 * @class AgentOrchestrator
 * Implements IAgentOrchestrator to manage the agent interaction lifecycle.
 */
export class AgentOrchestrator implements IAgentOrchestrator {
  public readonly orchestratorId = 'default_agent_orchestrator_v1.0';
  private config!: Required<AgentOrchestratorConfig>;
  private dependencies!: AgentOrchestratorDependencies;
  private initialized: boolean = false;

  constructor() {}

  /**
   * Initializes the AgentOrchestrator.
   * @param {AgentOrchestratorConfig} config - Configuration for the orchestrator.
   * @param {AgentOrchestratorDependencies} dependencies - Required service dependencies.
   */
  public async initialize(
    config: AgentOrchestratorConfig,
    dependencies: AgentOrchestratorDependencies
  ): Promise<void> {
    if (!dependencies.agentFactory || !dependencies.toolExecutor || !dependencies.providerManager) {
      throw new Error("AgentOrchestrator: Missing required dependencies (agentFactory, toolExecutor, providerManager).");
    }
    this.config = {
      maxToolCallIterations: config.maxToolCallIterations || 5,
      defaultAgentTurnTimeoutMs: config.defaultAgentTurnTimeoutMs || 60000,
      errorHandlingAgentId: config.errorHandlingAgentId,
    };
    this.dependencies = dependencies;
    this.initialized = true;
    console.log(`AgentOrchestrator (${this.orchestratorId}) initialized.`);
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error("AgentOrchestrator is not initialized. Call initialize() first.");
    }
  }

  /**
   * Processes a full logical turn for a target agent.
   * This involves an initial `processTurn` call on the agent, followed by a loop
   * to handle any requested tool calls until the agent indicates its turn is complete
   * or an iteration limit/error is reached.
   *
   * @param {ConversationContext} conversationContext - The active conversation context.
   * @param {string | null} userInput - The latest user input for this turn.
   * @param {string} targetAgentId - The ID of the agent to handle this request.
   * @returns {Promise<AgentOutput>} The final output from the agent for this turn.
   */
  public async processAgentTurn(
    conversationContext: ConversationContext,
    userInput: string | null,
    targetAgentId: string
  ): Promise<AgentOutput> {
    this.ensureInitialized();

    const agent = await this.dependencies.agentFactory.getAgent(targetAgentId, {
      promptEngine: this.dependencies.promptEngine, // Assuming promptEngine is available via orchestration setup or globally
      providerManager: this.dependencies.providerManager,
      utilityAI: this.dependencies.utilityAI, // Assuming utilityAI is available
      agentFactory: this.dependencies.agentFactory // Pass itself for recursive agent loading
    });
    if (!agent) {
      const errorMsg = `Agent with ID '${targetAgentId}' not found. Cannot process turn.`;
      console.error(`AgentOrchestrator: ${errorMsg}`);
      // Add an error message to the context
      conversationContext.addMessage({ role: MessageRole.SYSTEM, content: `System Error: Agent '${targetAgentId}' could not be loaded.` });
      return { responseText: "I'm sorry, I encountered an issue and cannot find the right assistant to help you right now.", error: errorMsg, isComplete: true };
    }

    let currentAgentOutput: AgentOutput;
    let iterationCount = 0;

    // Initial agent processing (handles user input or starts a new thought process)
    try {
      // The agent now manages its own primary LLM provider internally, so we don't pass it here.
      currentAgentOutput = await agent.processTurn(userInput, conversationContext, /* availableTools could be passed here */);
      // Add assistant's response (if any text) to context before tool calls
      if (currentAgentOutput.responseText) {
        conversationContext.addMessage({
          role: MessageRole.ASSISTANT,
          content: currentAgentOutput.responseText,
          name: agent.id, // or agent.name
          metadata: { agentMood: conversationContext.getMetadata('currentAgentMood') } // Persist mood with message
        });
      }
    } catch (error) {
      const errorMsg = `Error during initial agent.processTurn for agent '${targetAgentId}': ${(error as Error).message}`;
      console.error(`AgentOrchestrator: ${errorMsg}`, error);
      conversationContext.addMessage({ role: MessageRole.ERROR, content: `Agent ${agent.name} encountered an error processing your request.` });
      // Try to get the agent to explain its own error if possible
      if (agent.handleInternalAgentError) {
        return agent.handleInternalAgentError(errorMsg, conversationContext, true);
      }
      return { responseText: "I encountered an error while processing your request. Please try again.", error: errorMsg, isComplete: true };
    }


    // Loop for tool calls
    while (
      currentAgentOutput.toolCalls &&
      currentAgentOutput.toolCalls.length > 0 &&
      !currentAgentOutput.isComplete && // Agent might make tool calls AND finish in one go for some models
      iterationCount < this.config.maxToolCallIterations
    ) {
      iterationCount++;
      const toolCallsToExecute = currentAgentOutput.toolCalls;

      // Add assistant's message containing tool_calls to history (OpenAI spec)
      // This assumes agent.processTurn already added its message with tool_calls to context or
      // that the LLM response parser within the agent did so.
      // If not, we create one.
      if (!currentAgentOutput.rawResponseMessage && currentAgentOutput.responseText === null && toolCallsToExecute.length > 0) {
        // Implies the LLM only returned tool_calls
        conversationContext.addMessage({
          role: MessageRole.ASSISTANT,
          content: null, // As per OpenAI spec for tool_calls only
          tool_calls: toolCallsToExecute.map(tc => ({ // Map to ToolCallRequest
            id: tc.callId || `toolcall_${uuidv4()}`, // Ensure ID
            type: 'function',
            function: { name: tc.toolId, arguments: JSON.stringify(tc.arguments) }
          })),
          name: agent.id,
          metadata: { agentMood: conversationContext.getMetadata('currentAgentMood') }
        });
      }


      const toolResults = await Promise.all(
        toolCallsToExecute.map(async (toolCall: AgentToolCall) => {
          const executionContext: ToolExecutionContext = { // Build context for tool
            userId: conversationContext.userId,
            conversationId: conversationContext.sessionId,
            agentId: agent.id,
            // apiKeyStore: conceptual, needs implementation
          };
          const result = await this.dependencies.toolExecutor.executeTool(toolCall, executionContext);

          // Add tool result message to conversation context
          conversationContext.addMessage({
            role: MessageRole.TOOL,
            tool_call_id: result.callId, // This MUST match the ID from assistant's tool_call
            name: result.toolId,
            content: result.error ? `Error: ${result.error.message}` : JSON.stringify(result.output),
            metadata: {
              toolExecutionStatus: result.error ? 'error' : 'success',
              errorDetails: result.error?.details
            }
          });
          return { callId: result.callId, toolId: result.toolId, output: result.output, error: result.error };
        })
      );

      // Feed results back to the agent
      let lastOutputFromToolLoop: AgentOutput | null = null;
      for (const result of toolResults) {
        try {
          // The agent's handleToolResult should use the current context which now includes the tool message.
          lastOutputFromToolLoop = await agent.handleToolResult(
            result.callId,
            result.error ? result.error : result.output, // Pass error object or successful output
            result.toolId, // Pass tool name
            conversationContext,
            // llmProvider no longer passed directly
          );

          // Add assistant's response after processing tool result
          if (lastOutputFromToolLoop.responseText) {
            conversationContext.addMessage({
              role: MessageRole.ASSISTANT,
              content: lastOutputFromToolLoop.responseText,
              name: agent.id,
              tool_calls: lastOutputFromToolLoop.toolCalls?.map(tc => ({ // If it makes further tool calls
                id: tc.callId || `toolcall_${uuidv4()}`, type: 'function',
                function: { name: tc.toolId, arguments: JSON.stringify(tc.arguments) }
              })),
              metadata: { agentMood: conversationContext.getMetadata('currentAgentMood') }
            });
          } else if (lastOutputFromToolLoop.toolCalls && lastOutputFromToolLoop.toolCalls.length > 0) {
            // If agent only makes new tool calls without text response
            conversationContext.addMessage({
              role: MessageRole.ASSISTANT, content: null, name: agent.id,
              tool_calls: lastOutputFromToolLoop.toolCalls.map(tc => ({
                id: tc.callId || `toolcall_${uuidv4()}`, type: 'function',
                function: { name: tc.toolId, arguments: JSON.stringify(tc.arguments) }
              })),
              metadata: { agentMood: conversationContext.getMetadata('currentAgentMood') }
            });
          }
          currentAgentOutput = lastOutputFromToolLoop; // Update current output for next loop check
          if (currentAgentOutput.isComplete || !currentAgentOutput.toolCalls || currentAgentOutput.toolCalls.length === 0) break; // Exit inner loop if agent is done or no more tool calls from this result

        } catch (error) {
          const errorMsg = `Error during agent.handleToolResult for tool '${result.toolId}', agent '${targetAgentId}': ${(error as Error).message}`;
          console.error(`AgentOrchestrator: ${errorMsg}`, error);
          // Try to get the agent to explain its own error
          if (agent.handleInternalAgentError) {
            return agent.handleInternalAgentError(errorMsg, conversationContext, true);
          }
          currentAgentOutput = { responseText: "I encountered an error while processing the tool's result.", error: errorMsg, isComplete: true };
          // Add system error message to context
          conversationContext.addMessage({ role: MessageRole.ERROR, content: `Agent ${agent.name} had an error processing result of tool ${result.toolId}.` });
          break; // Break from tool result processing loop
        }
      }
      if (currentAgentOutput.error || currentAgentOutput.isComplete) break; // Break from main tool call loop
    } // End of while loop for tool calls

    if (iterationCount >= this.config.maxToolCallIterations) {
      const errorMsg = `Agent '${targetAgentId}' exceeded maximum tool call iterations (${this.config.maxToolCallIterations}). Assuming a loop or unresolved task.`;
      console.warn(`AgentOrchestrator: ${errorMsg}`);
      currentAgentOutput.responseText = currentAgentOutput.responseText ? currentAgentOutput.responseText + "\nIt seems I'm stuck in a loop trying to use my tools. " : "I seem to be stuck in a loop trying to use my tools. ";
      currentAgentOutput.responseText += "Could you please clarify your request or try a different approach?";
      currentAgentOutput.error = errorMsg;
      currentAgentOutput.isComplete = true; // Force completion
      conversationContext.addMessage({ role: MessageRole.SYSTEM, content: `System Note: Agent ${agent.name} reached max tool iterations.` });
    }

    return currentAgentOutput;
  }

  // initiateAgentHandoff - conceptual, would involve more complex state transfer
}