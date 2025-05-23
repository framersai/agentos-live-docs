// backend/agentos/api/AgentOSOrchestrator.ts

import { AgentOSInput } from './types/AgentOSInput';
import {
  AgentOSResponse,
  AgentOSResponseChunkType,
  AgentOSTextDeltaChunk,
  AgentOSFinalResponseChunk,
  AgentOSErrorChunk,
  AgentOSSystemProgressChunk,
  AgentOSToolCallRequestChunk,
  AgentOSToolResultEmissionChunk,
  AgentOSUICommandChunk,
} from './types/AgentOSResponse';
import { GMIManager } from '../cognitive_substrate/GMIManager';
import { IGMI, GMITurnInput, GMIOutputChunk, GMIOutput, ToolCall, ToolResultPayload } from '../cognitive_substrate/IGMI';
import { ConversationManager } from '../core/conversation/ConversationManager';
import { ConversationContext } from '../core/conversation/ConversationContext';
import { ToolOrchestrator } from '../tools/ToolOrchestrator';
import { ToolExecutionResult } from '../tools/interfaces/ToolResult'; // Assuming this type exists
import { StreamingManager } from '../core/streaming/StreamingManager'; // For advanced streaming logic
import { v4 as uuidv4 } from 'uuid';

/**
 * @fileoverview Implements the `AgentOSOrchestrator`, which acts as the central
 * coordinator between the public-facing `AgentOS` API and the internal `GMI`
 * instances. It manages the full lifecycle of an interaction turn, including
 * GMI selection, input preparation, handling GMI's streaming output, and
 * coordinating tool execution and result feedback.
 * @module backend/agentos/api/AgentOSOrchestrator
 */

/**
 * @typedef {Object} AgentOSOrchestratorConfig
 * Configuration options for the AgentOSOrchestrator.
 * @property {number} [maxToolCallIterations=5] - The maximum number of sequential
 * tool calls allowed within a single logical turn to prevent infinite loops.
 * @property {number} [defaultAgentTurnTimeoutMs=120000] - Default timeout for a
 * single GMI processing step (e.g., initial turn or tool result processing).
 * @property {boolean} [enableConversationalPersistence=true] - If true, conversation
 * context will be saved and loaded from persistent storage.
 */
export interface AgentOSOrchestratorConfig {
  maxToolCallIterations?: number;
  defaultAgentTurnTimeoutMs?: number;
  enableConversationalPersistence?: boolean;
}

/**
 * @typedef {Object} AgentOSOrchestratorDependencies
 * Defines the dependencies required by the AgentOSOrchestrator.
 * These are typically injected during its initialization.
 * @property {GMIManager} gmiManager - Manager for GMI instances and persona definitions.
 * @property {ToolOrchestrator} toolOrchestrator - Orchestrates the execution of tools.
 * @property {ConversationManager} conversationManager - Manages loading and saving
 * of persistent conversation contexts.
 * @property {StreamingManager} streamingManager - Manages the buffering and delivery of streaming chunks.
 */
export interface AgentOSOrchestratorDependencies {
  gmiManager: GMIManager;
  toolOrchestrator: ToolOrchestrator;
  conversationManager: ConversationManager;
  streamingManager: StreamingManager;
}

/**
 * @class AgentOSOrchestrator
 * @description
 * The `AgentOSOrchestrator` is responsible for unifying the request handling
 * pipeline for AgentOS. It bridges the high-level `AgentOSInput` from the
 * public API to the internal `GMI` processing logic. It ensures that user
 * requests are routed to the correct GMI, manages the GMI's turn lifecycle,
 * and handles the complex dance of tool calls and streaming responses.
 */
export class AgentOSOrchestrator {
  private initialized: boolean = false;
  private config!: Required<AgentOSOrchestratorConfig>;
  private dependencies!: AgentOSOrchestratorDependencies;

  /**
   * A map to hold ongoing stream generators.
   * Key: streamId, Value: { iterator: AsyncGenerator<GMIOutputChunk>, gmi: IGMI, userId: string, sessionId: string, personaId: string, conversationId: string }
   */
  private activeStreams: Map<string, {
    iterator: AsyncGenerator<GMIOutputChunk, GMIOutput, undefined>,
    gmi: IGMI,
    userId: string,
    sessionId: string,
    personaId: string,
    conversationId: string,
    conversationContext: ConversationContext, // Keep a reference to the active context
    bufferedResponseChunks: AgentOSResponse[], // For non-immediate delivery of tool results, etc.
    // Additional state for tracking tool call IDs and their streams if needed
  }> = new Map();

  constructor() {}

  /**
   * Initializes the AgentOSOrchestrator with its configuration and dependencies.
   * This method must be called successfully before orchestrating any turns.
   *
   * @async
   * @param {AgentOSOrchestratorConfig} config - Configuration settings for the orchestrator.
   * @param {AgentOSOrchestratorDependencies} dependencies - Required services.
   * @returns {Promise<void>} A Promise that resolves when initialization is complete.
   * @throws {Error} If any critical dependency is missing.
   */
  public async initialize(
    config: AgentOSOrchestratorConfig,
    dependencies: AgentOSOrchestratorDependencies,
  ): Promise<void> {
    if (this.initialized) {
      console.warn('AgentOSOrchestrator already initialized. Skipping re-initialization.');
      return;
    }

    if (!dependencies.gmiManager || !dependencies.toolOrchestrator || !dependencies.conversationManager || !dependencies.streamingManager) {
      throw new Error('AgentOSOrchestrator: Missing essential dependencies (gmiManager, toolOrchestrator, conversationManager, streamingManager).');
    }

    this.config = {
      maxToolCallIterations: config.maxToolCallIterations ?? 5,
      defaultAgentTurnTimeoutMs: config.defaultAgentTurnTimeoutMs ?? 120000,
      enableConversationalPersistence: config.enableConversationalPersistence ?? true,
    };
    this.dependencies = dependencies;
    this.initialized = true;
    console.log('AgentOSOrchestrator initialized.');
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('AgentOSOrchestrator is not initialized. Call initialize() first.');
    }
  }

  /**
   * Orchestrates a full logical turn for a user request. This involves:
   * 1. Retrieving or creating a GMI instance.
   * 2. Loading or setting up the conversation context.
   * 3. Initiating the GMI's `processTurnStream`.
   * 4. Iterating over the GMI's output stream, transforming chunks and
   * handling tool call requests.
   * 5. Managing the tool execution loop and feeding results back to GMI.
   * 6. Delivering `AgentOSResponse` chunks to the consumer.
   *
   * @async
   * @generator
   * @param {AgentOSInput} input - The comprehensive input for the current turn.
   * @yields {AgentOSResponse} - A stream of `AgentOSResponse` chunks.
   * @returns {AsyncGenerator<AgentOSResponse, void, void>} An async generator.
   */
  public async *orchestrateTurn(input: AgentOSInput): AsyncGenerator<AgentOSResponse> {
    this.ensureInitialized();

    const streamId = uuidv4(); // Unique ID for this orchestration stream
    let gmi: IGMI | undefined;
    let conversationContext: ConversationContext | undefined;
    let personaIdToUse = input.selectedPersonaId; // This might change if the GMI decides to switch

    try {
      console.log(`Orchestrator: Starting turn for stream ${streamId}, user ${input.userId}, session ${input.sessionId}`);

      // 1. Get or create GMI instance and load conversation context
      try {
        const result = await this.dependencies.gmiManager.getOrCreateGMIForPersona(
          input.userId,
          input.sessionId, // Session ID is now the key for GMI management
          personaIdToUse,
          input.conversationId, // Pass conversationId for loading existing context
          input.options?.preferredModelId, // Pass preferences for GMI initialization
          input.options?.preferredProviderId,
          input.userApiKeys
        );
        gmi = result.gmi;
        conversationContext = result.conversationContext;
        // Update the personaIdToUse if the GMI returned an active persona
        personaIdToUse = gmi.getCurrentPrimaryPersonaId();

        // Register the active stream for later tool result handling
        this.activeStreams.set(streamId, {
          iterator: gmi.processTurnStream({} as GMITurnInput), // Placeholder, actual GMI stream starts below
          gmi: gmi,
          userId: input.userId,
          sessionId: input.sessionId,
          personaId: personaIdToUse,
          conversationId: conversationContext.id,
          conversationContext: conversationContext,
          bufferedResponseChunks: [],
        });

        yield this.dependencies.streamingManager.createChunk(
          AgentOSResponseChunkType.SYSTEM_PROGRESS,
          streamId,
          gmi.instanceId,
          personaIdToUse,
          false,
          { message: `Initializing persona ${personaIdToUse}...` }
        );

      } catch (err: any) {
        console.error(`Orchestrator: Failed to get/create GMI or load context for stream ${streamId}:`, err);
        yield this.dependencies.streamingManager.createErrorChunk(
          streamId,
          personaIdToUse || 'unknown',
          'GMI_INIT_ERROR',
          `Failed to prepare agent: ${err.message}`,
          err
        );
        return; // Terminate early
      }

      // Initial GMI turn input
      const gmiInput: GMITurnInput = {
        userId: input.userId,
        sessionId: input.sessionId,
        textInput: input.textInput,
        visionInputs: input.visionInputs,
        audioInput: input.audioInput,
        userApiKeys: input.userApiKeys,
        userFeedback: input.userFeedback,
        explicitPersonaSwitchId: input.selectedPersonaId,
        taskHint: 'user_query', // Default hint
        personaStateOverrides: [], // Can be populated by options if needed
        modelSelectionOverrides: { // Pass through model selection preferences from AgentOSInput
          preferredModelId: input.options?.preferredModelId,
          preferredProviderId: input.options?.preferredProviderId,
          temperature: input.options?.temperature,
          topP: input.options?.topP,
          maxTokens: input.options?.maxTokens,
        },
      };

      let currentGMIOutput: GMIOutputChunk | null = null;
      let toolCallIteration = 0;
      let isGMIProcessingComplete = false;

      // Loop for GMI processing and tool execution
      while (!isGMIProcessingComplete && toolCallIteration <= this.config.maxToolCallIterations) {
        toolCallIteration++;
        console.log(`Orchestrator: GMI turn processing iteration ${toolCallIteration} for stream ${streamId}`);

        let gmiStream: AsyncGenerator<GMIOutputChunk, GMIOutput, undefined>;
        if (currentGMIOutput && currentGMIOutput.type === 'ToolCallRequest' && currentGMIOutput.toolCalls) {
          // This path handles GMI's *next* turn after tool results are fed back.
          // The GMI.handleToolResult method would be the continuation.
          // For now, we simulate by re-calling processTurnStream with updated context.
          // A more robust design: handleToolResult returns an AsyncGenerator too.
          // The provided GMI.ts implementation *does* make handleToolResult return GMIOutput,
          // so we need to bridge that.
          console.error("Orchestrator: Direct tool call iteration loop is currently simplified. GMI.handleToolResult doesn't return a stream iterator directly.");
          // We will adjust this to call the new handleToolResult and then potentially restart the main loop with its output.
          // For now, assume GMI.processTurnStream handles subsequent internal turns.
        }

        // Start or continue the GMI's processing stream
        gmiStream = gmi.processTurnStream(gmiInput); // Pass original input, GMI gets its own history/state

        let accumulatedToolCalls: ToolCall[] = [];
        let finalGMIResult: GMIOutput | undefined;

        for await (const gmiChunk of gmiStream) {
          currentGMIOutput = gmiChunk;
          console.log(`Orchestrator: Received GMI chunk type: ${gmiChunk.type}, isFinal: ${gmiChunk.isFinal}`);

          // Transform GMIOutputChunk to AgentOSResponse and yield
          switch (gmiChunk.type) {
            case 'GMIResponseChunk':
              if (gmiChunk.responseTextDelta) {
                yield this.dependencies.streamingManager.createChunk(
                  AgentOSResponseChunkType.TEXT_DELTA,
                  streamId, gmi.instanceId, personaIdToUse, false, { textDelta: gmiChunk.responseTextDelta }
                );
              }
              // Handle streaming tool calls delta accumulation if GMI supports it
              if (gmiChunk.toolCallsDeltas && gmiChunk.toolCallsDeltas.length > 0) {
                // This is a complex part. The GMI.ts provided accumulates these,
                // but the orchestrator needs to recognize when a full tool call object is formed.
                // For now, we assume GMI.processTurnStream yields a full `ToolCallRequest` chunk
                // when it's ready for execution, rather than just deltas.
                // If deltas are processed, we'd need internal state in orchestrator to build `ToolCall` objects.
              }
              break;
            case 'SystemProgress':
              yield this.dependencies.streamingManager.createChunk(
                AgentOSResponseChunkType.SYSTEM_PROGRESS,
                streamId, gmi.instanceId, personaIdToUse, false, { message: gmiChunk.message, progressPercentage: gmiChunk.progressPercentage, statusCode: gmiChunk.statusCode }
              );
              break;
            case 'ToolCallRequest': // GMI indicates it wants to call tools
              if (gmiChunk.toolCalls && gmiChunk.toolCalls.length > 0) {
                accumulatedToolCalls.push(...gmiChunk.toolCalls); // Accumulate all tools requested
                yield this.dependencies.streamingManager.createChunk(
                  AgentOSResponseChunkType.TOOL_CALL_REQUEST,
                  streamId, gmi.instanceId, personaIdToUse, false,
                  { toolCalls: gmiChunk.toolCalls, rationale: gmiChunk.responseText || 'Agent requires tool execution.' }
                );
                // The stream is not final yet, but GMI wants to pause for tool execution.
                isGMIProcessingComplete = false; // GMI will continue after tool results
                finalGMIResult = gmiChunk; // This is actually the output with tool calls
                break; // Break the FOR loop to execute tools
              }
              break;
            case 'UICommand':
              if (gmiChunk.uiCommands && gmiChunk.uiCommands.length > 0) {
                yield this.dependencies.streamingManager.createChunk(
                  AgentOSResponseChunkType.UI_COMMAND,
                  streamId, gmi.instanceId, personaIdToUse, false, { uiCommands: gmiChunk.uiCommands }
                );
              }
              break;
            case 'Error':
              console.error(`Orchestrator: GMI error chunk for stream ${streamId}:`, gmiChunk.error);
              yield this.dependencies.streamingManager.createErrorChunk(
                streamId,
                personaIdToUse,
                gmiChunk.error?.code || 'GMI_ERROR',
                gmiChunk.error?.message || 'An unknown GMI error occurred.',
                gmiChunk.error?.details
              );
              finalGMIResult = gmiChunk; // Capture error as final result
              isGMIProcessingComplete = true; // Terminate this logical turn
              break;
            case 'FinalResponse': // This is the final output from GMI
              finalGMIResult = gmiChunk;
              isGMIProcessingComplete = true; // Signal completion
              break;
          }

          if (gmiChunk.isFinal && !gmiChunk.toolCalls) { // GMI explicitly says it's final and not calling tools
            finalGMIResult = gmiChunk;
            isGMIProcessingComplete = true;
            break; // Exit the for-await loop
          }
        } // End of GMI stream for-await

        // If GMI requested tool calls, execute them and re-loop
        if (finalGMIResult && finalGMIResult.toolCalls && finalGMIResult.toolCalls.length > 0 && !finalGMIResult.isFinal) {
          console.log(`Orchestrator: GMI requested ${finalGMIResult.toolCalls.length} tool calls for stream ${streamId}.`);
          // Execute tools concurrently
          const toolResults: ToolExecutionResult[] = await Promise.all(
            finalGMIResult.toolCalls.map(toolCall =>
              this.dependencies.toolOrchestrator.executeTool(
                toolCall.function.name, // toolId
                toolCall.function.arguments, // args
                input.userId,
                gmi!.instanceId,
                conversationContext!.id,
                toolCall.id // toolCallId
              )
            )
          );

          // Feed tool results back to GMI
          for (const result of toolResults) {
            console.log(`Orchestrator: Tool '${result.toolId}' (${result.callId}) execution complete. Success: ${result.isSuccess}`);
            const toolResultPayload: ToolResultPayload = result.isSuccess
              ? { type: 'success', result: result.output }
              : { type: 'error', error: { code: result.errorCode || 'TOOL_EXEC_FAILED', message: result.errorMessage || 'Unknown tool error.' } };

            // IMPORTANT: Call GMI's handleToolResult to continue its processing
            // GMI's handleToolResult returns a single GMIOutput, not a stream generator.
            // This means GMI makes its new "decision" after the tool call.
            const nextGMIOutput: GMIOutput = await gmi!.handleToolResult(
              result.callId,
              result.toolId,
              toolResultPayload,
              input.userId,
              input.userApiKeys || {} // Pass user API keys for subsequent LLM calls within GMI
            );
            currentGMIOutput = nextGMIOutput; // Update currentGMIOutput to be the result of handleToolResult
            isGMIProcessingComplete = nextGMIOutput.isFinal; // Check if GMI is now complete

            // Yield a chunk indicating tool result emission
            yield this.dependencies.streamingManager.createChunk(
              AgentOSResponseChunkType.TOOL_RESULT_EMISSION,
              streamId, gmi!.instanceId, personaIdToUse, false,
              {
                toolCallId: result.callId,
                toolName: result.toolId,
                toolResult: result.output,
                isSuccess: result.isSuccess,
                errorMessage: result.errorMessage,
              }
            );

            // If GMI's response to the tool result contains text, yield it
            if (nextGMIOutput.responseText) {
              yield this.dependencies.streamingManager.createChunk(
                AgentOSResponseChunkType.TEXT_DELTA,
                streamId, gmi!.instanceId, personaIdToUse, false,
                { textDelta: nextGMIOutput.responseText }
              );
            }
            // If GMI's response to the tool result contains UI commands, yield them
            if (nextGMIOutput.uiCommands && nextGMIOutput.uiCommands.length > 0) {
              yield this.dependencies.streamingManager.createChunk(
                AgentOSResponseChunkType.UI_COMMAND,
                streamId, gmi!.instanceId, personaIdToUse, false,
                { uiCommands: nextGMIOutput.uiCommands }
              );
            }

            // If GMI decides to make *new* tool calls after processing the previous one,
            // we should re-enter the tool execution loop.
            // This is handled by setting isGMIProcessingComplete = false and allowing the while loop to continue.
            if (nextGMIOutput.toolCalls && nextGMIOutput.toolCalls.length > 0) {
              accumulatedToolCalls = nextGMIOutput.toolCalls; // Override with new tool calls
              isGMIProcessingComplete = false; // Need to loop again for new tools
              break; // Break out of inner toolResults loop to re-enter outer while loop
            }
            // If GMI signals final after handling tool result, break the loop
            if (nextGMIOutput.isFinal) {
              finalGMIResult = nextGMIOutput; // This is the final result of the turn
              isGMIProcessingComplete = true;
              break; // Break out of toolResults loop and main while loop
            }
          }
          // If the inner loop finished without GMI signaling final or new tool calls,
          // then the GMI's last response (currentGMIOutput) should be final for this iteration.
        } else {
          // If no tool calls were requested or finalGMIResult already handled it
          isGMIProcessingComplete = (finalGMIResult && finalGMIResult.isFinal) ?? false;
        }

        // If max tool call iterations reached, force termination and yield error/warning
        if (toolCallIteration >= this.config.maxToolCallIterations && !isGMIProcessingComplete) {
          console.warn(`Orchestrator: Max tool call iterations reached for stream ${streamId}. Forcing stream termination.`);
          yield this.dependencies.streamingManager.createErrorChunk(
            streamId,
            personaIdToUse,
            'MAX_TOOL_ITERATIONS_EXCEEDED',
            'Agent reached maximum tool call iterations. Please clarify your request or try a different approach.',
            { maxIterations: this.config.maxToolCallIterations }
          );
          isGMIProcessingComplete = true; // Force exit
        }
      } // End of main while loop (GMI processing + tool execution)

      // Final processing after GMI is complete or loop terminates
      if (finalGMIResult) {
        // Save conversation history (if enabled and context exists)
        if (this.config.enableConversationalPersistence && conversationContext) {
          await this.dependencies.conversationManager.saveConversation(conversationContext);
          console.log(`Orchestrator: Conversation context saved for ${conversationContext.id}.`);
        }

        // Construct and yield final response chunk
        yield this.dependencies.streamingManager.createFinalResponseChunk(
          streamId,
          gmi!.instanceId, // gmi is guaranteed to be defined here
          personaIdToUse,
          finalGMIResult.responseText,
          finalGMIResult.toolCalls,
          finalGMIResult.uiCommands,
          finalGMIResult.audioOutput,
          finalGMIResult.imageOutput,
          finalGMIResult.usage,
          finalGMIResult.reasoningTrace,
          finalGMIResult.error,
          conversationContext, // Include the updated conversation context in the final chunk
          gmi!.getCurrentPersonaDefinition() // Pass the full persona definition for active details
        );
      } else {
        // Fallback if no finalGMIResult was produced (e.g., unexpected early termination)
        console.error(`Orchestrator: No final GMI result for stream ${streamId}. Unexpected termination.`);
        yield this.dependencies.streamingManager.createErrorChunk(
          streamId,
          personaIdToUse,
          'ORCHESTRATOR_NO_FINAL_GMI_OUTPUT',
          'The agent did not produce a final response. An unexpected internal error occurred.',
          { lastGMIChunk: currentGMIOutput }
        );
      }

    } catch (error: any) {
      console.error(`Orchestrator: Critical error in orchestrateTurn for stream ${streamId}:`, error);
      yield this.dependencies.streamingManager.createErrorChunk(
        streamId,
        personaIdToUse || 'unknown',
        'ORCHESTRATOR_CRITICAL_ERROR',
        `A critical error occurred during orchestration: ${error.message}`,
        error
      );
    } finally {
      // Clean up active stream registration
      this.activeStreams.delete(streamId);
      console.log(`Orchestrator: Stream ${streamId} finished and cleaned up.`);
    }
  }

  /**
   * Handles the result of an external tool execution, feeding it back into the
   * relevant GMI instance for continued processing. This method is typically
   * called asynchronously (e.g., via a webhook) after a tool has completed.
   *
   * @async
   * @generator
   * @param {string} streamId - The original stream ID that initiated the tool call.
   * @param {string} toolCallId - The unique ID of the tool call whose result is being provided.
   * @param {string} toolName - The name of the tool that was executed.
   * @param {any} toolOutput - The raw output or result from the tool execution.
   * @param {boolean} isSuccess - Indicates whether the tool execution was successful.
   * @param {string} [errorMessage] - An optional error message if `isSuccess` is false.
   * @yields {AgentOSResponse} - A stream of `AgentOSResponse` chunks representing
   * the agent's continued thought process and response.
   */
  public async *orchestrateToolResult(
    streamId: string,
    toolCallId: string,
    toolName: string,
    toolOutput: any,
    isSuccess: boolean,
    errorMessage?: string,
  ): AsyncGenerator<AgentOSResponse> {
    this.ensureInitialized();

    const activeStreamInfo = this.activeStreams.get(streamId);
    if (!activeStreamInfo) {
      console.error(`Orchestrator: Received tool result for unknown or inactive streamId: ${streamId}`);
      yield this.dependencies.streamingManager.createErrorChunk(
        streamId,
        'unknown', // Persona ID unknown for inactive stream
        'INACTIVE_STREAM',
        `Tool result received for an inactive or unknown stream (${streamId}).`,
        { toolCallId, toolName, isSuccess, errorMessage }
      );
      return;
    }

    const { gmi, userId, userApiKeys, conversationContext, personaId } = activeStreamInfo; // Assuming userApiKeys are stored
    const toolResultPayload: ToolResultPayload = isSuccess
      ? { type: 'success', result: toolOutput }
      : { type: 'error', error: { code: 'EXTERNAL_TOOL_ERROR', message: errorMessage || 'External tool execution failed.' } };

    console.log(`Orchestrator: Feeding tool result for stream ${streamId}, tool call ${toolCallId} (${toolName}) back to GMI.`);

    try {
      // Yield a chunk indicating tool result emission (even if GMI just produced it internally, external trigger is important)
      yield this.dependencies.streamingManager.createChunk(
        AgentOSResponseChunkType.TOOL_RESULT_EMISSION,
        streamId, gmi.instanceId, personaId, false,
        {
          toolCallId: toolCallId,
          toolName: toolName,
          toolResult: toolOutput,
          isSuccess: isSuccess,
          errorMessage: errorMessage,
        }
      );

      // Call GMI's handleToolResult to process the outcome. This *will* lead to a new LLM call inside GMI.
      // GMI's handleToolResult returns a single GMIOutput, not a stream, for simplicity.
      const gmiResponseAfterTool: GMIOutput = await gmi.handleToolResult(
        toolCallId,
        toolName,
        toolResultPayload,
        userId,
        userApiKeys // Need to pass userApiKeys back to GMI for its internal LLM calls
      );

      // Now, yield chunks based on GMI's full response after processing the tool result
      if (gmiResponseAfterTool.responseText) {
        yield this.dependencies.streamingManager.createChunk(
          AgentOSResponseChunkType.TEXT_DELTA,
          streamId, gmi.instanceId, personaId, false,
          { textDelta: gmiResponseAfterTool.responseText }
        );
      }
      if (gmiResponseAfterTool.uiCommands && gmiResponseAfterTool.uiCommands.length > 0) {
        yield this.dependencies.streamingManager.createChunk(
          AgentOSResponseChunkType.UI_COMMAND,
          streamId, gmi.instanceId, personaId, false,
          { uiCommands: gmiResponseAfterTool.uiCommands }
        );
      }
      if (gmiResponseAfterTool.error) {
        yield this.dependencies.streamingManager.createErrorChunk(
          streamId,
          personaId,
          gmiResponseAfterTool.error.code,
          gmiResponseAfterTool.error.message,
          gmiResponseAfterTool.error.details
        );
      }

      // Check if GMI is now final or requests new tool calls
      let isGMIProcessingComplete = gmiResponseAfterTool.isFinal;
      let newToolCalls: ToolCall[] | undefined = gmiResponseAfterTool.toolCalls;

      // Handle subsequent tool calls initiated by GMI after processing the result
      if (newToolCalls && newToolCalls.length > 0) {
        console.log(`Orchestrator: GMI requested new tool calls after processing previous result for stream ${streamId}.`);
        yield this.dependencies.streamingManager.createChunk(
          AgentOSResponseChunkType.TOOL_CALL_REQUEST,
          streamId, gmi.instanceId, personaId, false,
          { toolCalls: newToolCalls, rationale: 'Agent requires further tool execution after previous tool result.' }
        );

        // This is a recursive step: the orchestrator now effectively re-enters the
        // tool execution loop within this new "mini-turn" initiated by the GMI.
        // For simplicity, we'll execute them immediately and then yield the final GMI result.
        // A more complex implementation might have an internal state machine here.

        const subsequentToolResults: ToolExecutionResult[] = await Promise.all(
          newToolCalls.map(newToolCall =>
            this.dependencies.toolOrchestrator.executeTool(
              newToolCall.function.name,
              newToolCall.function.arguments,
              userId,
              gmi!.instanceId,
              conversationContext!.id,
              newToolCall.id
            )
          )
        );

        for (const subResult of subsequentToolResults) {
          yield this.dependencies.streamingManager.createChunk(
            AgentOSResponseChunkType.TOOL_RESULT_EMISSION,
            streamId, gmi.instanceId, personaId, false,
            {
              toolCallId: subResult.callId,
              toolName: subResult.toolId,
              toolResult: subResult.output,
              isSuccess: subResult.isSuccess,
              errorMessage: subResult.errorMessage,
            }
          );
          // And then feed *these* results back to GMI for a final wrap-up
          const finalWrapUpGMIOutput = await gmi.handleToolResult(
            subResult.callId,
            subResult.toolId,
            subResult.isSuccess ? { type: 'success', result: subResult.output } : { type: 'error', error: { code: subResult.errorCode || 'SUB_TOOL_ERROR', message: subResult.errorMessage || 'Subsequent tool failed.' } },
            userId,
            userApiKeys // Pass user API keys
          );

          if (finalWrapUpGMIOutput.responseText) {
            yield this.dependencies.streamingManager.createChunk(
              AgentOSResponseChunkType.TEXT_DELTA,
              streamId, gmi.instanceId, personaId, false,
              { textDelta: finalWrapUpGMIOutput.responseText }
            );
          }
          if (finalWrapUpGMIOutput.uiCommands && finalWrapUpGMIOutput.uiCommands.length > 0) {
            yield this.dependencies.streamingManager.createChunk(
              AgentOSResponseChunkType.UI_COMMAND,
              streamId, gmi.instanceId, personaId, false,
              { uiCommands: finalWrapUpGMIOutput.uiCommands }
            );
          }

          if (finalWrapUpGMIOutput.isFinal) {
            isGMIProcessingComplete = true; // The agent is finally done
          } else if (finalWrapUpGMIOutput.toolCalls && finalWrapUpGMIOutput.toolCalls.length > 0) {
             // If we get *another* tool call, this path needs more sophisticated handling or a hard limit.
             // For now, we'll just yield a warning and force final.
             console.warn(`Orchestrator: GMI requested excessive chained tool calls for stream ${streamId}. Forcing final response.`);
             yield this.dependencies.streamingManager.createErrorChunk(
               streamId,
               personaId,
               'EXCESSIVE_TOOL_CHAINING',
               'Agent requested too many chained tool calls. Please rephrase or try again.',
               { initialToolCallId: toolCallId }
             );
             isGMIProcessingComplete = true;
          }
        }
      }

      // Final processing after GMI is complete for this tool result-driven turn
      if (isGMIProcessingComplete) {
        // Save conversation history (if enabled)
        if (this.config.enableConversationalPersistence && conversationContext) {
          await this.dependencies.conversationManager.saveConversation(conversationContext);
          console.log(`Orchestrator: Conversation context saved for ${conversationContext.id}.`);
        }

        // Yield final response chunk
        yield this.dependencies.streamingManager.createFinalResponseChunk(
          streamId,
          gmi.instanceId,
          personaId,
          gmiResponseAfterTool.responseText,
          gmiResponseAfterTool.toolCalls,
          gmiResponseAfterTool.uiCommands,
          gmiResponseAfterTool.audioOutput,
          gmiResponseAfterTool.imageOutput,
          gmiResponseAfterTool.usage,
          gmiResponseAfterTool.reasoningTrace,
          gmiResponseAfterTool.error,
          conversationContext,
          gmi.getCurrentPersonaDefinition()
        );
      } else {
        // If GMI is not final but did not request new tools, it's an intermediate response.
        // This scenario means the GMI expects more input from the user or an external event.
        // For simplicity, we'll mark this as final for the tool result processing call.
        console.warn(`Orchestrator: GMI response after tool result for stream ${streamId} was not final and had no new tool calls. Forcing finalization of this tool result processing request.`);
        yield this.dependencies.streamingManager.createFinalResponseChunk(
          streamId,
          gmi.instanceId,
          personaId,
          gmiResponseAfterTool.responseText,
          gmiResponseAfterTool.toolCalls,
          gmiResponseAfterTool.uiCommands,
          gmiResponseAfterTool.audioOutput,
          gmiResponseAfterTool.imageOutput,
          gmiResponseAfterTool.usage,
          gmiResponseAfterTool.reasoningTrace,
          gmiResponseAfterTool.error,
          conversationContext,
          gmi.getCurrentPersonaDefinition()
        );
      }

    } catch (error: any) {
      console.error(`Orchestrator: Critical error in orchestrateToolResult for stream ${streamId}:`, error);
      yield this.dependencies.streamingManager.createErrorChunk(
        streamId,
        personaId,
        'ORCHESTRATOR_TOOL_RESULT_CRITICAL_ERROR',
        `A critical error occurred while orchestrating tool result: ${error.message}`,
        error
      );
    } finally {
      // For `orchestrateToolResult`, we don't remove from activeStreams here,
      // as the main `orchestrateTurn` generator is still managing the overall stream.
      // The stream is only removed once the original `orchestrateTurn` call finishes.
    }
  }

  /**
   * Shuts down the AgentOSOrchestrator, clearing any active streams
   * and releasing resources.
   *
   * @async
   * @returns {Promise<void>} A promise that resolves when shutdown is complete.
   */
  public async shutdown(): Promise<void> {
    console.log('AgentOSOrchestrator: Shutting down...');
    // Potentially iterate through active streams and send final error chunks
    // or log their abrupt termination.
    this.activeStreams.clear();
    this.initialized = false;
    console.log('AgentOSOrchestrator: Shutdown complete.');
  }
}