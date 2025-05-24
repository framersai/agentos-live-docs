/**
 * @fileoverview Implements the Generalized Mind Instance (GMI), the core cognitive
 * engine of the AgentOS platform. The GMI is responsible for processing user
 * interactions, managing its internal state and memory, generating responses,
 * utilizing tools via an IToolOrchestrator, and adapting its behavior
 * through self-reflection.
 *
 * It orchestrates various sub-systems including:
 * - IWorkingMemory: For session-specific state and short-term adaptations.
 * - IPromptEngine: For dynamically constructing prompts based on rich context.
 * - IRetrievalAugmentor (RAG): For augmenting its knowledge with long-term, categorized memory.
 * - IToolOrchestrator: For managing and executing tools.
 * - LLM Providers (via AIModelProviderManager): For generating responses and internal reasoning.
 * - IUtilityAI: For auxiliary AI tasks like JSON parsing or summarization.
 * - IPersonaDefinition: Which provides the blueprint for its behavior, prompting, and memory interaction.
 *
 * @module backend/agentos/cognitive_substrate/GMI
 * @see ./IGMI.ts for the interface definition.
 * @see ./personas/IPersonaDefinition.ts for persona structure.
 * @see ../tools/IToolOrchestrator.ts for tool orchestration.
 */

import { v4 as uuidv4 } from 'uuid';
import {
  IGMI,
  GMIBaseConfig,
  GMITurnInput,
  GMIOutputChunk,
  GMIOutputChunkType,
  GMIPrimeState,
  GMIMood,
  UserContext,
  TaskContext,
  ReasoningTrace,
  ReasoningTraceEntry,
  ReasoningEntryType,
  GMIHealthReport,
  MemoryLifecycleEvent,
  LifecycleActionResponse,
  GMIInteractionType,
  ToolCallRequest,
  ToolCallResult,
} from './IGMI';
import {
  IPersonaDefinition,
  PersonaRagConfigRetrievalTrigger,
  // MetaPromptDefinition, // If used directly by GMI for selection logic
} from './personas/IPersonaDefinition';
import { IWorkingMemory } from './memory/IWorkingMemory';
import { IPromptEngine, PromptExecutionContext, PromptComponents } from '../core/llm/IPromptEngine';
import { IRetrievalAugmentor, RagRetrievalOptions, RagDocumentInput, RagIngestionOptions, RagMemoryCategory } from '../rag/IRetrievalAugmentor';
import { IProvider, ModelStreamChunk, ModelStreamOptions, ModelChatMessage } from '../core/llm/providers/IProvider';
import { AIModelProviderManager } from '../core/llm/providers/AIModelProviderManager';
import { IUtilityAI } from '../core/ai_utilities/IUtilityAI';
import { IToolOrchestrator } from '../tools/IToolOrchestrator';
import { ToolExecutionRequestDetails } from '../tools/ToolExecutor'; // IToolOrchestrator might re-export or GMI constructs this
import { GMIError, GMIErrorCode } from '../../utils/errors';

const DEFAULT_MAX_CONVERSATION_HISTORY_TURNS = 20;
const DEFAULT_SELF_REFLECTION_INTERVAL_TURNS = 5;

/**
 * @class GMI
 * @implements {IGMI}
 * The core implementation of the Generalized Mind Instance.
 */
export class GMI implements IGMI {
  public readonly gmiId: string;
  public readonly creationTimestamp: Date;
  private activePersona!: IPersonaDefinition;
  private config!: GMIBaseConfig;

  // Core Dependencies
  private workingMemory!: IWorkingMemory;
  private promptEngine!: IPromptEngine;
  private retrievalAugmentor?: IRetrievalAugmentor;
  private toolOrchestrator!: IToolOrchestrator; // Now a required dependency
  private llmProviderManager!: AIModelProviderManager;
  private utilityAI!: IUtilityAI;

  // Internal State
  private state: GMIPrimeState;
  private currentGmiMood: GMIMood;
  private currentUserContext: UserContext;
  private currentTaskContext: TaskContext;
  private reasoningTrace: ReasoningTrace;
  private conversationHistory: ModelChatMessage[]; // Using ModelChatMessage for closer LLM compatibility

  private selfReflectionIntervalTurns: number;
  private turnsSinceLastReflection: number;

  /**
   * Constructs a GMI instance.
   * The GMI is not fully operational until `initialize` is called.
   * @param {string} [gmiId] - Optional ID for the GMI. If not provided, a UUID will be generated.
   */
  constructor(gmiId?: string) {
    this.gmiId = gmiId || `gmi-${uuidv4()}`;
    this.creationTimestamp = new Date();
    this.state = GMIPrimeState.IDLE;
    this.currentGmiMood = GMIMood.NEUTRAL; // Initial default
    this.currentUserContext = { userId: 'default-user', skillLevel: 'novice' }; // Initial default
    this.currentTaskContext = { taskId: 'default-task', complexity: 'low', domain: 'general' }; // Initial default
    this.reasoningTrace = { gmiId: this.gmiId, personaId: '', entries: [] };
    this.conversationHistory = [];
    this.selfReflectionIntervalTurns = DEFAULT_SELF_REFLECTION_INTERVAL_TURNS;
    this.turnsSinceLastReflection = 0;
  }

  /**
   * @inheritdoc
   */
  public async initialize(persona: IPersonaDefinition, config: GMIBaseConfig): Promise<void> {
    if (this.state !== GMIPrimeState.IDLE && this.state !== GMIPrimeState.ERRORED) {
      console.warn(`GMI (ID: ${this.gmiId}) is being re-initialized from state: ${this.state}. Current state will be reset.`);
    }

    this.validateInitializationInputs(persona, config);

    this.activePersona = persona;
    this.config = config;
    this.workingMemory = config.workingMemory;
    this.promptEngine = config.promptEngine;
    this.retrievalAugmentor = config.retrievalAugmentor;
    this.toolOrchestrator = config.toolOrchestrator; // Store the orchestrator
    this.llmProviderManager = config.llmProviderManager;
    this.utilityAI = config.utilityAI;

    this.reasoningTrace = { gmiId: this.gmiId, personaId: this.activePersona.personaId, entries: [] }; // Reset trace
    this.conversationHistory = [];

    await this.workingMemory.initialize(this.gmiId, persona.initialMemoryImprints as any); // Assuming initialMemoryImprints can be used as config or processed
    this.addTraceEntry(ReasoningEntryType.LIFECYCLE, 'GMI Initializing.', { personaId: persona.id });

    await this.loadStateFromMemoryAndPersona();

    this.selfReflectionIntervalTurns = this.activePersona.metaPrompts?.find(mp => mp.id === 'periodic_self_reflection')?.trigger?.intervalTurns ||
                                     DEFAULT_SELF_REFLECTION_INTERVAL_TURNS; // More specific config for reflection interval
    this.turnsSinceLastReflection = 0;

    this.state = GMIPrimeState.READY;
    this.addTraceEntry(ReasoningEntryType.LIFECYCLE, 'GMI Initialization complete. State: READY.');
    console.log(`GMI (ID: ${this.gmiId}, Persona: ${this.activePersona.id}) initialized successfully.`);
  }

  private validateInitializationInputs(persona: IPersonaDefinition, config: GMIBaseConfig): void {
    if (!persona) throw new GMIError('PersonaDefinition cannot be null for GMI initialization.', GMIErrorCode.CONFIG_ERROR);
    if (!config) throw new GMIError('GMIBaseConfig cannot be null for GMI initialization.', GMIErrorCode.CONFIG_ERROR);
    if (!config.workingMemory) throw new GMIError('IWorkingMemory dependency is missing in GMIBaseConfig.', GMIErrorCode.DEPENDENCY_ERROR);
    if (!config.promptEngine) throw new GMIError('IPromptEngine dependency is missing in GMIBaseConfig.', GMIErrorCode.DEPENDENCY_ERROR);
    if (!config.llmProviderManager) throw new GMIError('AIModelProviderManager dependency is missing in GMIBaseConfig.', GMIErrorCode.DEPENDENCY_ERROR);
    if (!config.utilityAI) throw new GMIError('IUtilityAI dependency is missing in GMIBaseConfig.', GMIErrorCode.DEPENDENCY_ERROR);
    if (!config.toolOrchestrator) throw new GMIError('IToolOrchestrator dependency is missing in GMIBaseConfig.', GMIErrorCode.DEPENDENCY_ERROR);
    // RetrievalAugmentor is optional and checked at usage time.
  }


  /**
   * Loads initial operational state from working memory, falling back to persona defaults.
   * @private
   */
  private async loadStateFromMemoryAndPersona(): Promise<void> {
    // Simplified from previous, assumes persona structure with defaultMood, initialUserContext, etc.
    // The IPersonaDefinition provided seems to have `moodAdaptation.defaultMood` and not `initialContext`.
    // Adjusting to the provided IPersonaDefinition.
    this.currentGmiMood = await this.workingMemory.get<GMIMood>('currentGmiMood') ||
                          this.activePersona.moodAdaptation?.defaultMood as GMIMood || // Type cast if string
                          GMIMood.NEUTRAL;

    const defaultUserContext: UserContext = {
        userId: 'unknown_user',
        skillLevel: 'novice',
        preferences: {},
        ...this.activePersona.customFields?.initialUserContext, // Example: if initialUserContext is in customFields
    };
    this.currentUserContext = {
        ...defaultUserContext,
        ...(await this.workingMemory.get<UserContext>('currentUserContext')),
    };
    
    const defaultTaskContext: TaskContext = {
        taskId: uuidv4(),
        domain: 'general',
        complexity: 'low',
        status: 'not_started',
        ...this.activePersona.customFields?.initialTaskContext, // Example
    };
    this.currentTaskContext = {
        ...defaultTaskContext,
        ...(await this.workingMemory.get<TaskContext>('currentTaskContext')),
    };

    await this.workingMemory.set('currentGmiMood', this.currentGmiMood);
    await this.workingMemory.set('currentUserContext', this.currentUserContext);
    await this.workingMemory.set('currentTaskContext', this.currentTaskContext);

    this.addTraceEntry(ReasoningEntryType.STATE_CHANGE, 'GMI operational state loaded/initialized.', {
        mood: this.currentGmiMood,
        userContext: this.currentUserContext,
        taskContext: this.currentTaskContext
    });

    // Load initial memory imprints from persona
    if (this.activePersona.initialMemoryImprints) {
        for (const imprint of this.activePersona.initialMemoryImprints) {
            await this.workingMemory.set(imprint.key, imprint.value);
            this.addTraceEntry(ReasoningEntryType.STATE_CHANGE, `Applied initial memory imprint: ${imprint.key}`, { value: imprint.value });
        }
    }
  }

  public getPersona(): IPersonaDefinition {
    if (!this.isInitialized || !this.activePersona) throw new GMIError("GMI or Persona not initialized.", GMIErrorCode.NOT_INITIALIZED);
    return this.activePersona;
  }

  public getGMIId(): string {
    return this.gmiId;
  }

  public getCurrentState(): GMIPrimeState {
    return this.state;
  }

  public getReasoningTrace(): Readonly<ReasoningTrace> {
    // Return a deep copy to ensure immutability of the trace for external consumers
    return JSON.parse(JSON.stringify(this.reasoningTrace));
  }

  private addTraceEntry(type: ReasoningEntryType, message: string, details?: Record<string, any>, timestamp?: Date): void {
    const entry: ReasoningTraceEntry = {
      timestamp: timestamp || new Date(),
      type,
      message,
      details: details || {},
    };
    this.reasoningTrace.entries.push(entry);
  }

  private ensureReady(): void {
    if (this.state !== GMIPrimeState.READY) {
      throw new GMIError(
        `GMI (ID: ${this.gmiId}) is not in READY state. Current state: ${this.state}.`,
        GMIErrorCode.INVALID_STATE,
        { currentState: this.state }
      );
    }
  }

  /**
   * @inheritdoc
   */
  public async *processTurnStream(turnInput: GMITurnInput): AsyncGenerator<GMIOutputChunk, void, undefined> {
    this.ensureReady();
    this.state = GMIPrimeState.PROCESSING;
    const turnId = `turn-${uuidv4()}`;
    this.reasoningTrace.turnId = turnId; // Associate trace entries with this turn
    this.addTraceEntry(ReasoningEntryType.INTERACTION_START, `Processing turn '${turnId}' for user '${turnInput.userId}'`, { inputType: turnInput.type });

    try {
        // Update user context if provided
        if (turnInput.userContextOverride) {
            this.currentUserContext = { ...this.currentUserContext, ...turnInput.userContextOverride };
            await this.workingMemory.set('currentUserContext', this.currentUserContext);
            this.addTraceEntry(ReasoningEntryType.STATE_CHANGE, 'User context updated from turn input.', { newUserContext: this.currentUserContext });
        }
        if (turnInput.userId && this.currentUserContext.userId !== turnInput.userId) {
            this.currentUserContext.userId = turnInput.userId;
            await this.workingMemory.set('currentUserContext', this.currentUserContext);
        }

        // Add user input or tool result to conversation history
        this.updateConversationHistory(turnInput);

        let llmResponseProcessed = false;
        let lastLLMPrompt: ModelChatMessage[] | string = ""; // Store the prompt for potential re-calls
        let accumulatedToolCallResults: ToolCallResult[] = []; // For the current "tool loop"

        // Main interaction loop (can iterate if LLM calls tools)
        // eslint-disable-next-line no-constant-condition
        while(true) {
            let augmentedContextFromRAG = "";
            // 1. RAG Retrieval (if needed and not already in a tool-response loop where RAG might not be relevant)
            if (this.retrievalAugmentor && this.activePersona.memoryConfig?.ragConfig?.enabled && accumulatedToolCallResults.length === 0) { // Avoid RAG on tool response loop
                // Simplified trigger logic
                const currentQueryForRag = typeof turnInput.content === 'string' ? turnInput.content : this.conversationHistory.slice(-1)[0]?.content as string;
                if (this.shouldTriggerRAGRetrieval(currentQueryForRag)) { // Pass relevant query string
                    this.addTraceEntry(ReasoningEntryType.RAG_QUERY_START, 'RAG retrieval triggered.');
                    const ragQuery = currentQueryForRag || "General context query for current interaction";
                    
                    const retrievalOptions: RagRetrievalOptions = {
                        userId: this.currentUserContext.userId,
                        personaId: this.activePersona.id,
                        targetMemoryCategories: this.activePersona.memoryConfig.ragConfig.defaultRetrievalStrategy as RagMemoryCategory[] || [], // Adjust as per actual config
                        topK: this.activePersona.memoryConfig.ragConfig.defaultRetrievalTopK,
                    };
                    
                    const ragResult = await this.retrievalAugmentor.retrieveContext(ragQuery, retrievalOptions);
                    augmentedContextFromRAG = ragResult.augmentedContext;
                    this.addTraceEntry(ReasoningEntryType.RAG_QUERY_RESULT, 'RAG context retrieved.', {
                        contextLength: augmentedContextFromRAG.length, diagnostics: ragResult.diagnostics
                    });
                }
            }

            // 2. Construct Prompt Execution Context & Components
            const promptExecContext = this.buildPromptExecutionContext();
            const mainUserQuery = (turnInput.type === GMIInteractionType.TEXT || turnInput.type === GMIInteractionType.MULTIMODAL_CONTENT) ?
                                  (turnInput.content as string | Record<string,any>) : undefined;

            const promptComponents: PromptComponents = {
                systemMessage: this.activePersona.baseSystemPrompt,
                userQuery: mainUserQuery, // This might be undefined if we are in a tool response loop.
                // Tool results are already in conversation history for the Prompt Engine to use
                retrievedContext: augmentedContextFromRAG,
            };
            
            this.addTraceEntry(ReasoningEntryType.PROMPT_CONSTRUCTION_START, 'Constructing prompt.');
            const { finalPrompt, issues: promptIssues, selectedModel } = await this.promptEngine.constructPrompt(
                promptExecContext,
                promptComponents,
                this.activePersona.defaultModelCompletionOptions?.modelId || this.config.defaultLlmModelId // Model preference
            );
            lastLLMPrompt = finalPrompt; // Save for potential re-call with tool results

            if (promptIssues && promptIssues.length > 0) {
                promptIssues.forEach(issue => this.addTraceEntry(ReasoningEntryType.WARNING, `Prompt construction issue: ${issue.message}`, issue));
            }
            this.addTraceEntry(ReasoningEntryType.PROMPT_CONSTRUCTION_COMPLETE, `Prompt constructed for model ${selectedModel.modelId}.`, {
                 promptPreview: typeof finalPrompt === 'string' ? finalPrompt.substring(0,150) + '...' : Array.isArray(finalPrompt) ? "ChatMessages Preview" : "Structured Prompt"
            });

            // 3. Call LLM Provider
            const provider = this.llmProviderManager.getProvider(selectedModel.providerId);
            if (!provider) {
                throw new GMIError(`LLM Provider '${selectedModel.providerId}' not found for model '${selectedModel.modelId}'.`, GMIErrorCode.PROVIDER_NOT_FOUND);
            }
            const llmOptions: ModelStreamOptions = {
                temperature: this.activePersona.defaultModelCompletionOptions?.temperature ?? 0.7,
                maxTokens: this.activePersona.defaultModelCompletionOptions?.maxTokens ?? 2048,
                tools: this.activePersona.toolIds ? await this.toolOrchestrator.listAvailableTools({ personaId: this.activePersona.id, personaCapabilities: this.activePersona.allowedCapabilities, userContext: this.currentUserContext }) : undefined,
                userId: this.currentUserContext.userId,
                // stopSequences, tool_choice etc. can be added from persona or request
            };

            this.addTraceEntry(ReasoningEntryType.LLM_CALL_START, `Streaming response from ${selectedModel.modelId} via ${selectedModel.providerId}.`);
            
            let currentLLMResponseText = "";
            let currentToolCallRequests: ToolCallRequest[] = [];
            llmResponseProcessed = true; // Mark that we've processed an LLM response in this iteration

            for await (const chunk of provider.generateStream(selectedModel.modelId, finalPrompt, llmOptions)) {
                if (chunk.error) {
                    throw new GMIError(`LLM stream error: ${chunk.error.message}`, GMIErrorCode.PROVIDER_ERROR, chunk.error.details);
                }

                if (chunk.textDelta) {
                    currentLLMResponseText += chunk.textDelta;
                    yield this.createOutputChunk(turnInput.interactionId, GMIOutputChunkType.TEXT_DELTA, chunk.textDelta, { usage: chunk.usage });
                }

                if (chunk.toolCalls && chunk.toolCalls.length > 0) {
                    // LLM is requesting tool calls
                    // Accumulate all tool call requests from this LLM response
                    const newToolCallRequests = chunk.toolCalls.map(tc => ({
                        id: tc.id || uuidv4(), // Ensure ID exists
                        name: tc.function.name,
                        // Arguments from LLM are typically a string that needs parsing.
                        // Or, if the provider pre-parses, it's already an object.
                        // Assuming 'arguments' can be string or object. IUtilityAI should handle parsing.
                        arguments: typeof tc.function.arguments === 'string' ? JSON.parse(tc.function.arguments) : tc.function.arguments,
                    }));
                    currentToolCallRequests.push(...newToolCallRequests);
                     this.addTraceEntry(ReasoningEntryType.TOOL_CALL_REQUESTED, `LLM requested tool calls.`, { requests: newToolCallRequests });
                    // Yield a single chunk with all tool call requests for this LLM response
                    yield this.createOutputChunk(turnInput.interactionId, GMIOutputChunkType.TOOL_CALL_REQUEST, newToolCallRequests);
                }
                
                if (chunk.isFinal) {
                    this.addTraceEntry(ReasoningEntryType.LLM_CALL_COMPLETE, `LLM stream part finished. Reason: ${chunk.finishReason}`, { usage: chunk.usage, fullResponseTextPreview: currentLLMResponseText.substring(0,100)+ "..." });
                     if (chunk.usage) {
                        yield this.createOutputChunk(turnInput.interactionId, GMIOutputChunkType.USAGE_UPDATE, chunk.usage);
                    }
                    if (chunk.finishReason === 'tool_calls' && currentToolCallRequests.length > 0) {
                        // Handled by currentToolCallRequests logic below
                    } else if (chunk.finishReason === 'stop' || chunk.finishReason === 'length') {
                        // This is a final text response from the LLM
                    }
                }
            } // End of LLM stream for current call

            // Add LLM's full text response (if any) to history BEFORE processing tool calls from this same response
            if (currentLLMResponseText) {
                this.conversationHistory.push({ role: 'assistant', content: currentLLMResponseText });
            }

            // If LLM requested tools, execute them
            if (currentToolCallRequests.length > 0) {
                // Add the assistant message that *contained* the tool calls to history
                // Some models (like OpenAI) structure this as an assistant message with a `tool_calls` array.
                // Others might just stop and imply tools are next.
                // For simplicity, if there was text AND tool calls, the text is added above.
                // Now we need to represent the LLM's *intent* to call tools.
                // The ModelChatMessage for assistant needs to properly reflect this for the next LLM call.
                // This might mean adding a specific type of message or content to history here for the tool_calls request.
                // For now, we assume the `ToolCallRequest` objects are what we process, and then we'll add `ToolCallResult`s to history.
                
                // To avoid issues with history, let's add a placeholder for the assistant message if it only made tool calls.
                 if (!currentLLMResponseText && currentToolCallRequests.length > 0) {
                    // Placeholder if assistant response was *only* tool calls
                    // This part is model-specific on how to format history for tool calls.
                    // OpenAI: assistant message with tool_calls array.
                    // Let's assume the ModelChatMessage for assistant should contain the tool_calls array.
                     this.conversationHistory.push({ role: 'assistant', content: null, tool_calls: currentToolCallRequests });
                 }


                accumulatedToolCallResults = []; // Reset for this round of tool executions
                this.state = GMIPrimeState.AWAITING_TOOL_RESULT;

                for (const toolCallReq of currentToolCallRequests) {
                    const requestDetails: ToolExecutionRequestDetails = {
                        toolCallRequest: toolCallReq,
                        gmiId: this.gmiId,
                        personaId: this.activePersona.id,
                        personaCapabilities: this.activePersona.allowedCapabilities || [],
                        userContext: this.currentUserContext,
                        correlationId: turnId,
                    };
                    this.addTraceEntry(ReasoningEntryType.TOOL_EXECUTION_START, `Processing tool call via orchestrator: ${toolCallReq.name}`, { requestId: toolCallReq.id });
                    const toolCallResult = await this.toolOrchestrator.processToolCall(requestDetails);
                    accumulatedToolCallResults.push(toolCallResult);
                    this.addTraceEntry(ReasoningEntryType.TOOL_EXECUTION_RESULT, `Tool call ${toolCallReq.name} result received. Success: ${!toolCallResult.isError}`, { result: toolCallResult });
                    // The GMI doesn't yield the tool result directly to the client here.
                    // It collects all tool results and sends them back to the LLM.
                }

                // Add all tool results to history for the next LLM call
                for (const tcResult of accumulatedToolCallResults) {
                    this.updateConversationHistoryWithToolResult(tcResult);
                }

                this.state = GMIPrimeState.PROCESSING; // Back to processing for the next LLM call
                currentToolCallRequests = []; // Clear for next iteration
                // Loop continues: will re-prompt LLM with tool results in history.
                continue;
            }

            // If no tool calls, this LLM response is the final one for this turn sequence.
            break; // Exit the while(true) loop
        } // End of while(true) loop for tool execution

        // Post-turn processing if a final response was generated
        if (llmResponseProcessed) { // Check if any LLM interaction actually happened
            const finalAssistantResponse = this.conversationHistory.filter(m => m.role === 'assistant').pop()?.content as string || "";
            await this.performPostTurnIngestion(
                (turnInput.type === GMIInteractionType.TEXT ? turnInput.content as string : "Structured Input"),
                finalAssistantResponse
            );

            this.turnsSinceLastReflection++;
            if (this.activePersona.metaPrompts && this.activePersona.metaPrompts.some(mp => mp.id === 'periodic_self_reflection' && mp.trigger?.type === 'turn_interval') && this.turnsSinceLastReflection >= this.selfReflectionIntervalTurns) {
                this.addTraceEntry(ReasoningEntryType.SELF_REFLECTION_TRIGGERED, `Self-reflection interval reached.`);
                // Intentionally not awaiting here to avoid blocking the output stream for long reflections.
                // In a real system, this might be offloaded to a separate task queue.
                this._triggerAndProcessSelfReflection().catch(reflectionError => {
                    console.error(`GMI (ID: ${this.gmiId}): Background self-reflection failed: ${reflectionError.message}`);
                    this.addTraceEntry(ReasoningEntryType.ERROR, `Background self-reflection error.`, { message: reflectionError.message });
                });
                this.turnsSinceLastReflection = 0;
            }
        }

    } catch (error: any) {
      const gmiError = error instanceof GMIError ? error : new GMIError(`Error during GMI turn processing: ${error.message}`, GMIErrorCode.PROCESSING_ERROR, { turnId, underlyingError: error.toString(), stack: error.stack });
      this.state = GMIPrimeState.ERRORED;
      this.addTraceEntry(ReasoningEntryType.ERROR, `GMI processing error: ${gmiError.message}`, gmiError.details);
      console.error(`GMI (ID: ${this.gmiId}) encountered an error during turn '${turnId}':`, gmiError);
      yield this.createOutputChunk(turnInput.interactionId, GMIOutputChunkType.ERROR, gmiError.message, { errorDetails: gmiError.details });
    } finally {
      if (this.state !== GMIPrimeState.ERRORED && this.state !== GMIPrimeState.AWAITING_TOOL_RESULT) {
        this.state = GMIPrimeState.READY;
      }
       yield this.createOutputChunk(turnInput.interactionId, GMIOutputChunkType.FINAL_RESPONSE_MARKER, 'Turn processing complete.', { isFinal: true });
      this.addTraceEntry(ReasoningEntryType.INTERACTION_END, `Turn '${turnId}' processing finished. GMI State: ${this.state}.`);
      this.reasoningTrace.turnId = undefined; // Clear turnId from trace context
    }
  }

  /**
   * Creates a GMIOutputChunk with common fields populated.
   * @private
   */
  private createOutputChunk(interactionId: string, type: GMIOutputChunkType, content: any, extras: Partial<GMIOutputChunk> = {}): GMIOutputChunk {
    return {
      interactionId,
      type,
      content,
      timestamp: new Date(),
      chunkId: `gmi-chunk-${uuidv4()}`,
      ...extras,
    };
  }

  /**
   * Updates conversation history based on GMITurnInput.
   * @private
   */
  private updateConversationHistory(turnInput: GMITurnInput): void {
    const maxHistory = this.activePersona.conversationContextConfig?.maxMessages ||
                       this.activePersona.memoryConfig?.conversationContext?.maxMessages || // Legacy path
                       DEFAULT_MAX_CONVERSATION_HISTORY_TURNS;

    switch (turnInput.type) {
      case GMIInteractionType.TEXT:
        this.conversationHistory.push({ role: 'user', content: turnInput.content as string });
        break;
      case GMIInteractionType.MULTIMODAL_CONTENT:
        // For multimodal, content might be an array of parts.
        // ModelChatMessage needs to support this structure if the LLM does.
        // For now, assuming it's flattened or handled by PromptEngine.
        // This is a simplification.
        if(Array.isArray(turnInput.content)) {
             this.conversationHistory.push({ role: 'user', content: turnInput.content });
        } else {
            this.conversationHistory.push({ role: 'user', content: JSON.stringify(turnInput.content) }); // Fallback
        }
        break;
      case GMIInteractionType.TOOL_RESPONSE:
        // This case is tricky. `processTurnStream` now handles adding tool results to history
        // after they are processed by `ToolOrchestrator`.
        // This explicit `TOOL_RESPONSE` input type might be for externally executed tools
        // not orchestrated by this GMI's LLM.
        // For now, the main tool loop handles history for LLM-requested tools.
        // If this input type IS used, it means the GMI is being TOLD a tool result.
        const toolResults = Array.isArray(turnInput.content) ? turnInput.content : [turnInput.content as ToolCallResult];
        for (const result of toolResults) {
            this.conversationHistory.push({
                role: 'tool',
                tool_call_id: result.toolCallId,
                name: result.toolName, // Name might not be on ToolCallResult, but needed for some models' history
                content: typeof result.output === 'string' ? result.output : JSON.stringify(result.output),
            });
        }
        break;
      case GMIInteractionType.SYSTEM_MESSAGE:
         this.conversationHistory.push({ role: 'system', content: turnInput.content as string });
         break;
    }

    // Trim history: keep N last pairs of user/assistant messages + preceding system/tool messages.
    // A more sophisticated trimming would consider token counts.
    if (this.conversationHistory.length > maxHistory * 2.5) { // Allow some buffer for system/tool messages
        const cutoff = this.conversationHistory.length - maxHistory * 2; // Keep roughly last N exchanges
        this.conversationHistory.splice(0, cutoff > 0 ? cutoff : 0);
        this.addTraceEntry(ReasoningEntryType.DEBUG, "Conversation history trimmed.", { newLength: this.conversationHistory.length, maxLength: maxHistory });
    }
  }

  /**
   * Adds a tool call result to the conversation history in the format expected by LLMs.
   * @private
   */
  private updateConversationHistoryWithToolResult(toolCallResult: ToolCallResult): void {
    this.conversationHistory.push({
      role: 'tool',
      tool_call_id: toolCallResult.toolCallId,
      name: toolCallResult.toolName, // Assuming toolName is on ToolCallResult
      content: toolCallResult.isError
        ? `Error executing tool ${toolCallResult.toolName}: ${JSON.stringify(toolCallResult.errorDetails || toolCallResult.output)}`
        : (typeof toolCallResult.output === 'string' ? toolCallResult.output : JSON.stringify(toolCallResult.output)),
    });
  }


  /**
   * Builds the PromptExecutionContext for the current turn.
   * @private
   */
  private buildPromptExecutionContext(): PromptExecutionContext {
    // Ensure activePersona is defined
    if (!this.activePersona) {
        throw new GMIError("Active persona is not set in GMI.", GMIErrorCode.INVALID_STATE, { gmiId: this.gmiId });
    }
    // Ensure UserContext is defined
    if (!this.currentUserContext) {
        throw new GMIError("Current user context is not set in GMI.", GMIErrorCode.INVALID_STATE, { gmiId: this.gmiId });
    }


    // Get available tools for the persona for the PromptEngine Context
    // This should ideally be pre-filtered by permissions if ToolOrchestrator's listAvailableTools is used.
    // For now, using what's directly in persona, assuming orchestrator handles availability at call time.
    const availableToolDefinitionsForPrompt = (this.activePersona.toolIds || []).map(toolIdOrName => {
        // This is a simplification. ToolOrchestrator.listAvailableTools should provide this.
        // For now, we'll assume the PromptEngine can use ITool[] or tool names from persona.
        // The actual schemas are best obtained from ToolOrchestrator.listAvailableTools().
        // Placeholder:
        const tool = this.toolOrchestrator.getTool(toolIdOrName).then(t => t); // Conceptual
        return tool ? { name: toolIdOrName, description: "Tool description placeholder", inputSchema: {} } : null;
    }).filter(t => t !== null);


    return {
      gmiInstanceId: this.gmiId,
      activePersona: this.activePersona,
      currentGmiMood: this.currentGmiMood,
      currentUser: this.currentUserContext,
      currentTask: this.currentTaskContext,
      conversationHistory: [...this.conversationHistory], // Pass a fresh copy
      // Available tools should come from ToolOrchestrator.listAvailableTools, filtered for persona context
      // For now, using a simplified list from persona definition.
      availableTools: this.activePersona.embeddedTools || [], // Or use toolOrchestrator.listAvailableTools(context)
      reasoningTraceSoFar: this.getReasoningTrace(), // Snapshot
      // Potentially add current datetime, or other dynamic context elements
    };
  }

  /**
   * Determines if RAG retrieval should be triggered based on persona config and input.
   * @private
   */
  private shouldTriggerRAGRetrieval(userInput: string | undefined): boolean {
    const ragConfig = this.activePersona.memoryConfig?.ragConfig;
    if (!ragConfig || !ragConfig.enabled || !this.retrievalAugmentor) return false;

    const triggerCondition = ragConfig.retrievalTriggers?.condition || // Assuming retrievalTriggers is on new ragConfig
                             PersonaRagConfigRetrievalTrigger.ON_EVERY_USER_MESSAGE; // Default

    switch (triggerCondition) {
      case PersonaRagConfigRetrievalTrigger.ON_EVERY_USER_MESSAGE:
        return true;
      case PersonaRagConfigRetrievalTrigger.ON_KEYWORD_MATCH:
        if (ragConfig.retrievalTriggers?.keywords && userInput) {
          return ragConfig.retrievalTriggers.keywords.some(kw => userInput.toLowerCase().includes(kw.toLowerCase()));
        }
        return false;
      default:
        return false;
    }
  }

  /**
   * Performs post-turn RAG ingestion if configured.
   * @private
   */
  private async performPostTurnIngestion(userInput: string, gmiResponse: string): Promise<void> {
    const ragConfig = this.activePersona.memoryConfig?.ragConfig;
    if (!this.retrievalAugmentor || !ragConfig?.enabled || !ragConfig.ingestionTriggers?.onTurnSummary) { // Assuming ingestionTriggers
        return;
    }
    
    try {
        // TODO: Use this.utilityAI.summarizeText for better summarization based on persona config
        const turnSummary = `Interaction Summary:\nUser: ${userInput.substring(0, 200)}...\nGMI: ${gmiResponse.substring(0, 300)}...`;
        
        const docToIngest: RagDocumentInput = {
            id: `turn-${this.gmiId}-${this.reasoningTrace.turnId || uuidv4()}`,
            content: turnSummary,
            metadata: {
                gmiId: this.gmiId,
                personaId: this.activePersona.id,
                userId: this.currentUserContext.userId,
                timestamp: new Date().toISOString(),
                type: "conversation_turn_summary",
                turnId: this.reasoningTrace.turnId,
            },
            dataSourceId: ragConfig.defaultIngestionDataSourceId // From PersonaRagConfig
        };
        const ingestionOptions: RagIngestionOptions = {
            // Use defaults or specific options from personaRagConfig.defaultIngestionOptions
            userId: this.currentUserContext.userId,
            personaId: this.activePersona.id,
        };

        this.addTraceEntry(ReasoningEntryType.RAG_INGESTION_START, "Attempting post-turn RAG ingestion.", { documentId: docToIngest.id });
        const ingestionResult = await this.retrievalAugmentor.ingestDocuments(docToIngest, ingestionOptions);
        if (ingestionResult.failedIngestionCount > 0) {
            this.addTraceEntry(ReasoningEntryType.WARNING, "Post-turn RAG ingestion encountered errors.", { errors: ingestionResult.errors });
        } else {
            this.addTraceEntry(ReasoningEntryType.RAG_INGESTION_COMPLETE, "Post-turn RAG ingestion successful.", { ingestedIds: ingestionResult.ingestedDocumentIds });
        }
    } catch (error: any) {
        this.addTraceEntry(ReasoningEntryType.ERROR, "Error during post-turn RAG ingestion.", { message: error.message, details: error.stack });
        console.error(`GMI (ID: ${this.gmiId}): Error in post-turn RAG ingestion: ${error.message}`);
    }
  }


  /**
   * @inheritdoc
   */
  public async _triggerAndProcessSelfReflection(): Promise<void> {
    if (this.state === GMIPrimeState.REFLECTING) {
        this.addTraceEntry(ReasoningEntryType.SELF_REFLECTION_SKIPPED, "Self-reflection already in progress.");
        return;
    }
    // const selfReflectionConfig = this.activePersona.selfReflectionConfig; // From IPersonaDefinition
    // Using metaPrompts directly as per previous structure, assuming one is for reflection.
    const reflectionMetaPromptDef = this.activePersona.metaPrompts?.find(mp => mp.id === 'gmi_self_trait_adjustment');

    if (!reflectionMetaPromptDef || !reflectionMetaPromptDef.promptTemplate) {
      this.addTraceEntry(ReasoningEntryType.SELF_REFLECTION_SKIPPED, "Self-reflection disabled or no suitable meta-prompt configured.");
      return;
    }

    const previousState = this.state;
    this.state = GMIPrimeState.REFLECTING;
    this.addTraceEntry(ReasoningEntryType.SELF_REFLECTION_START, "Starting self-reflection cycle.");

    try {
      const evidence = {
        recentConversation: this.conversationHistory.slice(-10), // Last 5 exchanges (10 messages)
        recentTraceEntries: this.reasoningTrace.entries.filter(e => e.timestamp > new Date(Date.now() - 60 * 60 * 1000)).slice(-20), // Last hour, max 20
        currentMood: this.currentGmiMood,
        currentUserContext: this.currentUserContext,
        currentTaskContext: this.currentTaskContext,
        personaName: this.activePersona.name,
        personaDescription: this.activePersona.description,
      };
      this.addTraceEntry(ReasoningEntryType.SELF_REFLECTION_DETAIL, "Gathered evidence for reflection.");

      // Simple template substitution - PromptEngine could be used for more complex templating here
      let metaPromptText = reflectionMetaPromptDef.promptTemplate;
      if (typeof metaPromptText === 'object' && metaPromptText.template) { // If template object
          metaPromptText = metaPromptText.template;
      }
      metaPromptText = metaPromptText.replace("{{evidence}}", JSON.stringify(evidence, null, 2).substring(0, 4000) + "..."); // Truncate evidence
      metaPromptText = metaPromptText.replace("{{current_mood}}", this.currentGmiMood);
      metaPromptText = metaPromptText.replace("{{user_skill}}", this.currentUserContext.skillLevel || "unknown");
      metaPromptText = metaPromptText.replace("{{task_complexity}}", this.currentTaskContext.complexity || "unknown");


      this.addTraceEntry(ReasoningEntryType.SELF_REFLECTION_DETAIL, "Constructed meta-prompt for self-reflection.", { promptLength: metaPromptText.length });
      
      const reflectionModelId = reflectionMetaPromptDef.modelId || this.config.defaultLlmModelId || (await this.llmProviderManager.listModels())[0]?.id; // Fallback
      const reflectionProviderId = reflectionMetaPromptDef.providerId || this.config.defaultLlmProviderId || (await this.llmProviderManager.listModels())[0]?.providerId;

      if(!reflectionModelId || !reflectionProviderId){
          throw new GMIError("Cannot determine model/provider for self-reflection LLM call.", GMIErrorCode.CONFIG_ERROR);
      }

      const provider = this.llmProviderManager.getProvider(reflectionProviderId);
      const llmResponse = await provider.generate(reflectionModelId, metaPromptText, {
        maxTokens: reflectionMetaPromptDef.maxOutputTokens || 512,
        temperature: reflectionMetaPromptDef.temperature || 0.5,
        // Ensure LLM is prompted for JSON if that's expected
        // responseFormat: { type: 'json_object' } // If provider supports this
      });

      if (!llmResponse.choices || llmResponse.choices.length === 0 || !llmResponse.choices[0].text) {
        throw new GMIError("Self-reflection LLM call returned no content.", GMIErrorCode.PROVIDER_ERROR);
      }
      const responseText = llmResponse.choices[0].text;
      this.addTraceEntry(ReasoningEntryType.SELF_REFLECTION_DETAIL, "Received LLM response for self-reflection.", { responsePreview: responseText.substring(0, 200) });

      const parsedUpdates = await this.utilityAI.parseJsonOutput<{
          updatedGmiMood?: GMIMood;
          updatedUserSkillLevel?: string;
          updatedTaskComplexity?: string;
          adjustmentRationale?: string;
      }>(responseText);

      if (!parsedUpdates) {
          throw new GMIError("Failed to parse JSON from self-reflection LLM response.", GMIErrorCode.PARSING_ERROR, { responseText });
      }
      this.addTraceEntry(ReasoningEntryType.SELF_REFLECTION_DETAIL, "LLM provided trait update suggestions.", { suggestions: parsedUpdates });

      let stateChanged = false;
      if (parsedUpdates.updatedGmiMood && Object.values(GMIMood).includes(parsedUpdates.updatedGmiMood) && this.currentGmiMood !== parsedUpdates.updatedGmiMood) {
        this.currentGmiMood = parsedUpdates.updatedGmiMood;
        await this.workingMemory.set('currentGmiMood', this.currentGmiMood);
        stateChanged = true;
      }
      if (parsedUpdates.updatedUserSkillLevel && this.currentUserContext.skillLevel !== parsedUpdates.updatedUserSkillLevel) {
        this.currentUserContext.skillLevel = parsedUpdates.updatedUserSkillLevel;
        await this.workingMemory.set('currentUserContext', this.currentUserContext);
        stateChanged = true;
      }
      if (parsedUpdates.updatedTaskComplexity && this.currentTaskContext.complexity !== parsedUpdates.updatedTaskComplexity) {
        this.currentTaskContext.complexity = parsedUpdates.updatedTaskComplexity;
        await this.workingMemory.set('currentTaskContext', this.currentTaskContext);
        stateChanged = true;
      }

      if (stateChanged) {
        this.addTraceEntry(ReasoningEntryType.STATE_CHANGE, "GMI operational state updated via self-reflection.", {
          newMood: this.currentGmiMood, newUserContext: this.currentUserContext, newTaskContext: this.currentTaskContext,
          rationale: parsedUpdates.adjustmentRationale
        });
      } else {
         this.addTraceEntry(ReasoningEntryType.SELF_REFLECTION_DETAIL, "No state changes applied from self-reflection suggestions.", { rationale: parsedUpdates.adjustmentRationale });
      }

    } catch (error: any) {
      const gmiError = error instanceof GMIError ? error : new GMIError(`Error during self-reflection: ${error.message}`, GMIErrorCode.PROCESSING_ERROR, { underlyingError: error.toString() });
      this.addTraceEntry(ReasoningEntryType.ERROR, `Self-reflection failed: ${gmiError.message}`, gmiError.details);
      console.error(`GMI (ID: ${this.gmiId}) self-reflection error:`, gmiError);
    } finally {
      this.state = previousState !== GMIPrimeState.REFLECTING ? previousState : GMIPrimeState.READY; // Restore previous state or Ready
      this.addTraceEntry(ReasoningEntryType.SELF_REFLECTION_COMPLETE, "Self-reflection cycle finished.");
    }
  }


  /**
   * @inheritdoc
   */
  public async onMemoryLifecycleEvent(event: MemoryLifecycleEvent): Promise<LifecycleActionResponse> {
    this.ensureReady();
    this.addTraceEntry(ReasoningEntryType.MEMORY_LIFECYCLE_EVENT_RECEIVED, `Received memory lifecycle event: ${event.type}`, { eventId: event.eventId, itemId: event.itemId });

    // More sophisticated logic based on event.type, event.category, event.itemSummary, and personaMemoryLifecycleConfig
    // This might involve an LLM call to assess importance.
    const personaLifecycleConf = this.activePersona.memoryConfig?.lifecycleConfig; // Assuming new path in IPersonaDefinition

    let gmiDecision: LifecycleAction = event.proposedAction; // Default to allowing what manager proposed
    let rationale = 'Default GMI action: align with MemoryLifecycleManager proposal.';

    if (personaLifecycleConf?.negotiationEnabled) {
        this.addTraceEntry(ReasoningEntryType.MEMORY_LIFECYCLE_NEGOTIATION_START, "Starting GMI negotiation for memory item.", { event });
        // Simplified negotiation: if it's user memory and proposed for deletion, be more cautious.
        if (event.category === RagMemoryCategory.USER_EXPLICIT_MEMORY.toString() && event.type === 'EVICTION_PROPOSED') {
            // Conceptual LLM call to decide if this item is "critical"
            // const isCritical = await this.utilityAI.evaluateCritcality(event.itemSummary, this.currentUserContext, this.currentTaskContext);
            // if (isCritical) {
            //    gmiDecision = 'PREVENT_ACTION';
            //    rationale = 'GMI assessed item as critical user memory; preventing eviction.';
            // }
            // For now, simple override example:
            if (event.itemSummary.toLowerCase().includes("password") || event.itemSummary.toLowerCase().includes("secret")) {
                 gmiDecision = 'PREVENT_ACTION';
                 rationale = 'GMI identified potentially sensitive user memory; preventing action.';
            }
        }
    }

    const response: LifecycleActionResponse = {
        gmiId: this.gmiId,
        eventId: event.eventId,
        actionTaken: gmiDecision,
        rationale,
    };
    this.addTraceEntry(ReasoningEntryType.MEMORY_LIFECYCLE_RESPONSE_SENT, `Responding to memory lifecycle event with: ${response.actionTaken}`, { response });
    return response;
  }

  /**
   * @inheritdoc
   */
  public async analyzeAndReportMemoryHealth(): Promise<GMIHealthReport['memoryHealth']> {
    this.ensureReady(); // Or allow health check in more states
    this.addTraceEntry(ReasoningEntryType.HEALTH_CHECK_REQUESTED, "Analyzing GMI memory health.");

    const workingMemorySize = await this.workingMemory.size();
    let ragSystemHealthStatus = { isHealthy: false, details: "RAG system (RetrievalAugmentor) not configured or health check failed." };
    if (this.retrievalAugmentor) {
        const ragHealth = await this.retrievalAugmentor.checkHealth();
        ragSystemHealthStatus = { isHealthy: ragHealth.isHealthy, details: ragHealth.details };
    }

    let lifecycleManagerHealthStatus = {isHealthy: true, details: "MemoryLifecycleManager health not directly checked in GMI yet."};
    // if (this.config.memoryLifecycleManager) { // if MLM was a direct GMI dependency
    //    lifecycleManagerHealthStatus = await this.config.memoryLifecycleManager.checkHealth();
    // }


    const memoryHealth: GMIHealthReport['memoryHealth'] = {
        overallStatus: ragSystemHealthStatus.isHealthy ? 'OPERATIONAL' : 'DEGRADED',
        workingMemoryStats: { itemCount: workingMemorySize },
        ragSystemStats: ragSystemHealthStatus,
        lifecycleManagerStats: lifecycleManagerHealthStatus, // Placeholder
        issues: [],
    };
    if (!ragSystemHealthStatus.isHealthy && this.retrievalAugmentor) {
        memoryHealth.issues?.push({ severity: 'critical', description: 'RAG system unhealthy.', component: 'RetrievalAugmentor', details: ragSystemHealthStatus.details });
    }

    this.addTraceEntry(ReasoningEntryType.HEALTH_CHECK_RESULT, "Memory health analysis complete.", { reportSummary: memoryHealth.overallStatus });
    return memoryHealth;
  }

  /**
   * @inheritdoc
   */
  public async getOverallHealth(): Promise<GMIHealthReport> {
    this.addTraceEntry(ReasoningEntryType.HEALTH_CHECK_REQUESTED, "Performing overall GMI health check.");
    const memoryHealth = await this.analyzeAndReportMemoryHealth();

    const dependenciesStatus: GMIHealthReport['dependenciesStatus'] = [];
    const checkDep = async (name: string, dep: { checkHealth?: () => Promise<{isHealthy: boolean; details?: any}> } | undefined) => {
        if (dep && typeof dep.checkHealth === 'function') {
            const health = await dep.checkHealth();
            dependenciesStatus.push({ componentName: name, status: health.isHealthy ? 'HEALTHY' : 'UNHEALTHY', details: health.details });
            return health.isHealthy;
        }
        dependenciesStatus.push({ componentName: name, status: dep ? 'UNKNOWN' : 'NOT_CONFIGURED' });
        return dep ? true : false; // Assume healthy if checkHealth not present but dep is. Not configured is not an error here.
    };

    let allDepsHealthy = true;
    allDepsHealthy = (await checkDep('PromptEngine', this.promptEngine)) && allDepsHealthy;
    allDepsHealthy = (await checkDep('ToolOrchestrator', this.toolOrchestrator)) && allDepsHealthy;
    allDepsHealthy = (await checkDep('UtilityAI', this.utilityAI)) && allDepsHealthy;
    allDepsHealthy = (await checkDep('WorkingMemory', this.workingMemory)) && allDepsHealthy;
    if(this.retrievalAugmentor) allDepsHealthy = (await checkDep('RetrievalAugmentor', this.retrievalAugmentor)) && allDepsHealthy;
    // LLM Provider Manager health (e.g., can it connect to default provider)
    const llmManagerHealth = await this.llmProviderManager.checkHealth(this.activePersona?.defaultModelCompletionOptions?.providerId || this.config.defaultLlmProviderId);
    dependenciesStatus.push({ componentName: 'AIModelProviderManager (Default Provider)', status: llmManagerHealth.isHealthy ? 'HEALTHY' : 'UNHEALTHY', details: llmManagerHealth.details});
    allDepsHealthy = llmManagerHealth.isHealthy && allDepsHealthy;


    const overallGMIStatus = this.state === GMIPrimeState.READY && memoryHealth.overallStatus === 'OPERATIONAL' && allDepsHealthy
                            ? 'HEALTHY'
                            : (this.state === GMIPrimeState.ERRORED ? 'ERROR' : 'DEGRADED');

    const report: GMIHealthReport = {
      gmiId: this.gmiId,
      personaId: this.activePersona?.id || 'N/A',
      timestamp: new Date(),
      overallStatus: overallGMIStatus,
      currentState: this.state,
      memoryHealth,
      dependenciesStatus,
      recentErrors: this.reasoningTrace.entries.filter(e => e.type === ReasoningEntryType.ERROR).slice(-5),
    };
    this.addTraceEntry(ReasoningEntryType.HEALTH_CHECK_RESULT, "Overall GMI health check complete.", { status: report.overallStatus });
    return report;
  }

  /**
   * @inheritdoc
   */
  public async shutdown(): Promise<void> {
    if (this.state === GMIPrimeState.SHUTDOWN || this.state === GMIPrimeState.IDLE && !this.isInitialized) {
      console.log(`GMI (ID: ${this.gmiId}) already shut down or was never fully initialized.`);
      this.state = GMIPrimeState.SHUTDOWN;
      return;
    }
    const prevState = this.state;
    this.state = GMIPrimeState.SHUTTING_DOWN;
    this.addTraceEntry(ReasoningEntryType.LIFECYCLE, "GMI shutting down.", { fromState: prevState });
    try {
      await this.workingMemory?.close?.();
      await this.retrievalAugmentor?.shutdown?.();
      await (this.promptEngine as any).shutdown?.(); // Add optional shutdown to IPromptEngine if needed
      await (this.toolOrchestrator as any).shutdown?.(); // Add optional shutdown to IToolOrchestrator
      await (this.utilityAI as any).shutdown?.(); // Add optional shutdown to IUtilityAI
      // AIModelProviderManager is likely a shared service, not shut down by individual GMIs
    } catch (error: any) {
      this.addTraceEntry(ReasoningEntryType.ERROR, `Error during GMI shutdown: ${error.message}`, { error: error.toString() });
      console.error(`GMI (ID: ${this.gmiId}) error during shutdown: ${error.message}`);
    } finally {
      this.state = GMIPrimeState.SHUTDOWN;
      this.isInitialized = false; // Ensure it needs re-init
      this.addTraceEntry(ReasoningEntryType.LIFECYCLE, "GMI shutdown complete.");
      console.log(`GMI (ID: ${this.gmiId}) has been shut down.`);
    }
  }
}