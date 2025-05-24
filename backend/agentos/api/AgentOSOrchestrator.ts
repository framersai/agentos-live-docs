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
import { ToolExecutionResult } from '../tools/interfaces/ToolResult';
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
 */
export interface AgentOSOrchestratorDependencies {
  gmiManager: GMIManager;
  toolOrchestrator: ToolOrchestrator;
  conversationManager: ConversationManager;
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
    conversationContext: ConversationContext,
    bufferedResponseChunks: AgentOSResponse[],
    userApiKeys?: Record<string, string>,
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

    if (!dependencies.gmiManager || !dependencies.toolOrchestrator || !dependencies.conversationManager) {
      throw new Error('AgentOSOrchestrator: Missing essential dependencies (gmiManager, toolOrchestrator, conversationManager).');
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
   * Helper method to create response chunks without StreamingManager
   */
  private createChunk(
    type: AgentOSResponseChunkType,
    streamId: string,
    gmiInstanceId: string,
    personaId: string,
    isFinal: boolean,
    data: any
  ): AgentOSResponse {
    const baseChunk = {
      type,
      streamId,
      gmiInstanceId,
      personaId,
      isFinal,
      timestamp: new Date().toISOString(),
    };

    switch (type) {
      case AgentOSResponseChunkType.TEXT_DELTA:
        return { ...baseChunk, textDelta: data.textDelta } as AgentOSTextDeltaChunk;
      case AgentOSResponseChunkType.SYSTEM_PROGRESS:
        return { ...baseChunk, message: data.message, progressPercentage: data.progressPercentage, statusCode: data.statusCode } as AgentOSSystemProgressChunk;
      case AgentOSResponseChunkType.TOOL_CALL_REQUEST:
        return { ...baseChunk, toolCalls: data.toolCalls, rationale: data.rationale } as AgentOSToolCallRequestChunk;
      case AgentOSResponseChunkType.TOOL_RESULT_EMISSION:
        return { ...baseChunk, toolCallId: data.toolCallId, toolName: data.toolName, toolResult: data.toolResult, isSuccess: data.isSuccess, errorMessage: data.errorMessage } as AgentOSToolResultEmissionChunk;
      case AgentOSResponseChunkType.UI_COMMAND:
        return { ...baseChunk, uiCommands: data.uiCommands } as AgentOSUICommandChunk;
      case AgentOSResponseChunkType.ERROR:
        return { ...baseChunk, code: data.code, message: data.message, details: data.details } as AgentOSErrorChunk;
      case AgentOSResponseChunkType.FINAL_RESPONSE:
        return { 
          ...baseChunk, 
          finalResponseText: data.finalResponseText,
          finalToolCalls: data.finalToolCalls,
          finalUiCommands: data.finalUiCommands,
          audioOutput: data.audioOutput,
          imageOutput: data.imageOutput,
          usage: data.usage,
          reasoningTrace: data.reasoningTrace,
          error: data.error,
          updatedConversationContext: data.updatedConversationContext,
          activePersonaDetails: data.activePersonaDetails
        } as AgentOSFinalResponseChunk;
      default:
        throw new Error(`Unknown chunk type: ${type}`);
    }
  }

  /**
   * Helper method to create error chunks
   */
  private createErrorChunk(
    streamId: string,
    personaId: string,
    code: string,
    message: string,
    details?: any
  ): AgentOSErrorChunk {
    return this.createChunk(
      AgentOSResponseChunkType.ERROR,
      streamId,
      'unknown',
      personaId,
      true,
      { code, message, details }
    ) as AgentOSErrorChunk;
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

    const streamId = uuidv4();
    let gmi: IGMI | undefined;
    let conversationContext: ConversationContext | undefined;
    let personaIdToUse = input.selectedPersonaId;

    try {
      console.log(`Orchestrator: Starting turn for stream ${streamId}, user ${input.userId}, session ${input.sessionId}`);

      // 1. Get or create GMI instance and load conversation context
      try {
        const result = await this.dependencies.gmiManager.getOrCreateGMIForPersona(
          input.userId,
          input.sessionId,
          personaIdToUse,
          input.conversationId,
          input.options?.preferredModelId,
          input.options?.preferredProviderId,
          input.userApiKeys
        );
        gmi = result.gmi;
        conversationContext = result.conversationContext;
        personaIdToUse = gmi.getCurrentPrimaryPersonaId();

        // Register the active stream
        this.activeStreams.set(streamId, {
          iterator: gmi.processTurnStream({} as GMITurnInput),
          gmi: gmi,
          userId: input.userId,
          sessionId: input.sessionId,
          personaId: personaIdToUse,
          conversationId: conversationContext.id,
          conversationContext: conversationContext,
          bufferedResponseChunks: [],
          userApiKeys: input.userApiKeys,
        });

        yield this.createChunk(
          AgentOSResponseChunkType.SYSTEM_PROGRESS,
          streamId,
          gmi.instanceId,
          personaIdToUse,
          false,
          { message: `Initializing persona ${personaIdToUse}...` }
        );

      } catch (err: any) {
        console.error(`Orchestrator: Failed to get/create GMI or load context for stream ${streamId}:`, err);
        yield this.createErrorChunk(
          streamId,
          personaIdToUse || 'unknown',
          'GMI_INIT_ERROR',
          `Failed to prepare agent: ${err.message}`,
          err
        );
        return;
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
        taskHint: 'user_query',
        personaStateOverrides: [],
        modelSelectionOverrides: {
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
      let finalGMIResult: GMIOutput | undefined; // Move this to broader scope

      // Loop for GMI processing and tool execution
      while (!isGMIProcessingComplete && toolCallIteration <= this.config.maxToolCallIterations) {
        toolCallIteration++;
        console.log(`Orchestrator: GMI turn processing iteration ${toolCallIteration} for stream ${streamId}`);

        let gmiStream: AsyncGenerator<GMIOutputChunk, GMIOutput, undefined>;
        if (currentGMIOutput && currentGMIOutput.type === 'ToolCallRequest' && currentGMIOutput.toolCalls) {
          console.error("Orchestrator: Direct tool call iteration loop is currently simplified. GMI.handleToolResult doesn't return a stream iterator directly.");
        }

        // Start or continue the GMI's processing stream
        gmiStream = gmi.processTurnStream(gmiInput);

        let accumulatedToolCalls: ToolCall[] = [];

        for await (const gmiChunk of gmiStream) {
          currentGMIOutput = gmiChunk;
          console.log(`Orchestrator: Received GMI chunk type: ${gmiChunk.type}, isFinal: ${gmiChunk.isFinal}`);

          // Transform GMIOutputChunk to AgentOSResponse and yield
          switch (gmiChunk.type) {
            case 'GMIResponseChunk':
              if (gmiChunk.responseTextDelta) {
                yield this.createChunk(
                  AgentOSResponseChunkType.TEXT_DELTA,
                  streamId, gmi.instanceId, personaIdToUse, false, { textDelta: gmiChunk.responseTextDelta }
                );
              }
              break;
            case 'SystemProgress':
              yield this.createChunk(
                AgentOSResponseChunkType.SYSTEM_PROGRESS,
                streamId, gmi.instanceId, personaIdToUse, false, { message: gmiChunk.message, progressPercentage: gmiChunk.progressPercentage, statusCode: gmiChunk.statusCode }
              );
              break;
            case 'ToolCallRequest':
              if (gmiChunk.toolCalls && gmiChunk.toolCalls.length > 0) {
                accumulatedToolCalls.push(...gmiChunk.toolCalls);
                yield this.createChunk(
                  AgentOSResponseChunkType.TOOL_CALL_REQUEST,
                  streamId, gmi.instanceId, personaIdToUse, false,
                  { toolCalls: gmiChunk.toolCalls, rationale: gmiChunk.responseText || 'Agent requires tool execution.' }
                );
                isGMIProcessingComplete = false;
                finalGMIResult = gmiChunk;
                break;
              }
              break;
            case 'UICommand':
              if (gmiChunk.uiCommands && gmiChunk.uiCommands.length > 0) {
                yield this.createChunk(
                  AgentOSResponseChunkType.UI_COMMAND,
                  streamId, gmi.instanceId, personaIdToUse, false, { uiCommands: gmiChunk.uiCommands }
                );
              }
              break;
            case 'Error':
              console.error(`Orchestrator: GMI error chunk for stream ${streamId}:`, gmiChunk.error);
              yield this.createErrorChunk(
                streamId,
                personaIdToUse,
                gmiChunk.error?.code || 'GMI_ERROR',
                gmiChunk.error?.message || 'An unknown GMI error occurred.',
                gmiChunk.error?.details
              );
              finalGMIResult = gmiChunk;
              isGMIProcessingComplete = true;
              break;
            case 'FinalResponse':
              finalGMIResult = gmiChunk;
              isGMIProcessingComplete = true;
              break;
          }

          if (gmiChunk.isFinal && !gmiChunk.toolCalls) {
            finalGMIResult = gmiChunk;
            isGMIProcessingComplete = true;
            break;
          }
        }

        // If GMI requested tool calls, execute them and re-loop
        if (finalGMIResult && finalGMIResult.toolCalls && finalGMIResult.toolCalls.length > 0 && !finalGMIResult.isFinal) {
          console.log(`Orchestrator: GMI requested ${finalGMIResult.toolCalls.length} tool calls for stream ${streamId}.`);
          
          // Execute tools concurrently with proper typing
          const toolResults: ToolExecutionResult[] = await Promise.all(
            finalGMIResult.toolCalls.map((toolCall: ToolCall) =>
              this.dependencies.toolOrchestrator.executeTool(
                toolCall.function.name,
                toolCall.function.arguments,
                input.userId,
                gmi!.instanceId,
                conversationContext!.id,
                toolCall.id
              )
            )
          );

          // Feed tool results back to GMI
          for (const result of toolResults) {
            console.log(`Orchestrator: Tool '${result.toolId}' (${result.callId}) execution complete. Success: ${result.isSuccess}`);
            const toolResultPayload: ToolResultPayload = result.isSuccess
              ? { type: 'success', result: result.output }
              : { type: 'error', error: { code: result.errorCode || 'TOOL_EXEC_FAILED', message: result.errorMessage || 'Unknown tool error.' } };

            const nextGMIOutput: GMIOutput = await gmi!.handleToolResult(
              result.callId,
              result.toolId,
              toolResultPayload,
              input.userId,
              input.userApiKeys || {}
            );
            currentGMIOutput = nextGMIOutput;
            isGMIProcessingComplete = nextGMIOutput.isFinal;

            // Yield a chunk indicating tool result emission
            yield this.createChunk(
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
              yield this.createChunk(
                AgentOSResponseChunkType.TEXT_DELTA,
                streamId, gmi!.instanceId, personaIdToUse, false,
                { textDelta: nextGMIOutput.responseText }
              );
            }
            
            // If GMI's response to the tool result contains UI commands, yield them
            if (nextGMIOutput.uiCommands && nextGMIOutput.uiCommands.length > 0) {
              yield this.createChunk(
                AgentOSResponseChunkType.UI_COMMAND,
                streamId, gmi!.instanceId, personaIdToUse, false,
                { uiCommands: nextGMIOutput.uiCommands }
              );
            }

            // If GMI decides to make new tool calls after processing the previous one
            if (nextGMIOutput.toolCalls && nextGMIOutput.toolCalls.length > 0) {
              accumulatedToolCalls = nextGMIOutput.toolCalls;
              isGMIProcessingComplete = false;
              break;
            }
            
            // If GMI signals final after handling tool result, break the loop
            if (nextGMIOutput.isFinal) {
              finalGMIResult = nextGMIOutput;
              isGMIProcessingComplete = true;
              break;
            }
          }
        } else {
          isGMIProcessingComplete = (finalGMIResult && finalGMIResult.isFinal) ?? false;
        }

        // If max tool call iterations reached, force termination
        if (toolCallIteration >= this.config.maxToolCallIterations && !isGMIProcessingComplete) {
          console.warn(`Orchestrator: Max tool call iterations reached for stream ${streamId}. Forcing stream termination.`);
          yield this.createErrorChunk(
            streamId,
            personaIdToUse,
            'MAX_TOOL_ITERATIONS_EXCEEDED',
            'Agent reached maximum tool call iterations. Please clarify your request or try a different approach.',
            { maxIterations: this.config.maxToolCallIterations }
          );
          isGMIProcessingComplete = true;
        }
      }

      // Final processing after GMI is complete or loop terminates
      if (finalGMIResult) {
        // Save conversation history (if enabled and context exists)
        if (this.config.enableConversationalPersistence && conversationContext) {
          await this.dependencies.conversationManager.saveConversation(conversationContext);
          console.log(`Orchestrator: Conversation context saved for ${conversationContext.id}.`);
        }

        // Construct and yield final response chunk
        yield this.createChunk(
          AgentOSResponseChunkType.FINAL_RESPONSE,
          streamId,
          gmi!.instanceId,
          personaIdToUse,
          true,
          {
            finalResponseText: finalGMIResult.responseText,
            finalToolCalls: finalGMIResult.toolCalls,
            finalUiCommands: finalGMIResult.uiCommands,
            audioOutput: finalGMIResult.audioOutput,
            imageOutput: finalGMIResult.imageOutput,
            usage: finalGMIResult.usage,
            reasoningTrace: finalGMIResult.reasoningTrace,
            error: finalGMIResult.error,
            updatedConversationContext: conversationContext,
            activePersonaDetails: gmi!.getCurrentPersonaDefinition()
          }
        );
      } else {
        console.error(`Orchestrator: No final GMI result for stream ${streamId}. Unexpected termination.`);
        yield this.createErrorChunk(
          streamId,
          personaIdToUse,
          'ORCHESTRATOR_NO_FINAL_GMI_OUTPUT',
          'The agent did not produce a final response. An unexpected internal error occurred.',
          { lastGMIChunk: currentGMIOutput }
        );
      }

    } catch (error: any) {
      console.error(`Orchestrator: Critical error in orchestrateTurn for stream ${streamId}:`, error);
      yield this.createErrorChunk(
        streamId,
        personaIdToUse || 'unknown',
        'ORCHESTRATOR_CRITICAL_ERROR',
        `A critical error occurred during orchestration: ${error.message}`,
        error
      );
    } finally {
      this.activeStreams.delete(streamId);
      console.log(`Orchestrator: Stream ${streamId} finished and cleaned up.`);
    }
  }

  /**
   * Handles the result of an external tool execution, feeding it back into the
   * relevant GMI instance for continued processing.
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
      yield this.createErrorChunk(
        streamId,
        'unknown',
        'INACTIVE_STREAM',
        `Tool result received for an inactive or unknown stream (${streamId}).`,
        { toolCallId, toolName, isSuccess, errorMessage }
      );
      return;
    }

    const { gmi, userId, conversationContext, personaId, userApiKeys } = activeStreamInfo;
    const toolResultPayload: ToolResultPayload = isSuccess
      ? { type: 'success', result: toolOutput }
      : { type: 'error', error: { code: 'EXTERNAL_TOOL_ERROR', message: errorMessage || 'External tool execution failed.' } };

    console.log(`Orchestrator: Feeding tool result for stream ${streamId}, tool call ${toolCallId} (${toolName}) back to GMI.`);

    try {
      yield this.createChunk(
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

      const gmiResponseAfterTool: GMIOutput = await gmi.handleToolResult(
        toolCallId,
        toolName,
        toolResultPayload,
        userId,
        userApiKeys || {}
      );

      if (gmiResponseAfterTool.responseText) {
        yield this.createChunk(
          AgentOSResponseChunkType.TEXT_DELTA,
          streamId, gmi.instanceId, personaId, false,
          { textDelta: gmiResponseAfterTool.responseText }
        );
      }
      
      if (gmiResponseAfterTool.uiCommands && gmiResponseAfterTool.uiCommands.length > 0) {
        yield this.createChunk(
          AgentOSResponseChunkType.UI_COMMAND,
          streamId, gmi.instanceId, personaId, false,
          { uiCommands: gmiResponseAfterTool.uiCommands }
        );
      }
      
      if (gmiResponseAfterTool.error) {
        yield this.createErrorChunk(
          streamId,
          personaId,
          gmiResponseAfterTool.error.code,
          gmiResponseAfterTool.error.message,
          gmiResponseAfterTool.error.details
        );
      }

      let isGMIProcessingComplete = gmiResponseAfterTool.isFinal;
      let newToolCalls: ToolCall[] | undefined = gmiResponseAfterTool.toolCalls;

      if (newToolCalls && newToolCalls.length > 0) {
        console.log(`Orchestrator: GMI requested new tool calls after processing previous result for stream ${streamId}.`);
        yield this.createChunk(
          AgentOSResponseChunkType.TOOL_CALL_REQUEST,
          streamId, gmi.instanceId, personaId, false,
          { toolCalls: newToolCalls, rationale: 'Agent requires further tool execution after previous tool result.' }
        );

        const subsequentToolResults: ToolExecutionResult[] = await Promise.all(
          newToolCalls.map((newToolCall: ToolCall) =>
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
          yield this.createChunk(
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
          
          const finalWrapUpGMIOutput = await gmi.handleToolResult(
            subResult.callId,
            subResult.toolId,
            subResult.isSuccess ? { type: 'success', result: subResult.output } : { type: 'error', error: { code: subResult.errorCode || 'SUB_TOOL_ERROR', message: subResult.errorMessage || 'Subsequent tool failed.' } },
            userId,
            userApiKeys || {}
          );

          if (finalWrapUpGMIOutput.responseText) {
            yield this.createChunk(
              AgentOSResponseChunkType.TEXT_DELTA,
              streamId, gmi.instanceId, personaId, false,
              { textDelta: finalWrapUpGMIOutput.responseText }
            );
          }
          
          if (finalWrapUpGMIOutput.uiCommands && finalWrapUpGMIOutput.uiCommands.length > 0) {
            yield this.createChunk(
              AgentOSResponseChunkType.UI_COMMAND,
              streamId, gmi.instanceId, personaId, false,
              { uiCommands: finalWrapUpGMIOutput.uiCommands }
            );
          }

          if (finalWrapUpGMIOutput.isFinal) {
            isGMIProcessingComplete = true;
          } else if (finalWrapUpGMIOutput.toolCalls && finalWrapUpGMIOutput.toolCalls.length > 0) {
             console.warn(`Orchestrator: GMI requested excessive chained tool calls for stream ${streamId}. Forcing final response.`);
             yield this.createErrorChunk(
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
        yield this.createChunk(
          AgentOSResponseChunkType.FINAL_RESPONSE,
          streamId,
          gmi.instanceId,
          personaId,
          true,
          {
            finalResponseText: gmiResponseAfterTool.responseText,
            finalToolCalls: gmiResponseAfterTool.toolCalls,
            finalUiCommands: gmiResponseAfterTool.uiCommands,
            audioOutput: gmiResponseAfterTool.audioOutput,
            imageOutput: gmiResponseAfterTool.imageOutput,
            usage: gmiResponseAfterTool.usage,
            reasoningTrace: gmiResponseAfterTool.reasoningTrace,
            error: gmiResponseAfterTool.error,
            updatedConversationContext: conversationContext,
            activePersonaDetails: gmi.getCurrentPersonaDefinition()
          }
        );
      } else {
        // If GMI is not final but did not request new tools, it's an intermediate response.
        console.warn(`Orchestrator: GMI response after tool result for stream ${streamId} was not final and had no new tool calls. Forcing finalization of this tool result processing request.`);
        yield this.createChunk(
          AgentOSResponseChunkType.FINAL_RESPONSE,
          streamId,
          gmi.instanceId,
          personaId,
          true,
          {
            finalResponseText: gmiResponseAfterTool.responseText,
            finalToolCalls: gmiResponseAfterTool.toolCalls,
            finalUiCommands: gmiResponseAfterTool.uiCommands,
            audioOutput: gmiResponseAfterTool.audioOutput,
            imageOutput: gmiResponseAfterTool.imageOutput,
            usage: gmiResponseAfterTool.usage,
            reasoningTrace: gmiResponseAfterTool.reasoningTrace,
            error: gmiResponseAfterTool.error,
            updatedConversationContext: conversationContext,
            activePersonaDetails: gmi.getCurrentPersonaDefinition()
          }
        );
      }

    } catch (error: any) {
      console.error(`Orchestrator: Critical error in orchestrateToolResult for stream ${streamId}:`, error);
      yield this.createErrorChunk(
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