/**
 * @fileoverview Implements the Generalized Mind Instance (GMI), the core cognitive
 * engine of the AgentOS platform. This version integrates concrete IUtilityAI methods
 * for tasks like JSON parsing in self-reflection and summarization for RAG ingestion,
 * alongside its full suite of capabilities including tool orchestration, RAG interaction,
 * and adaptive state management.
 *
 * @module backend/agentos/cognitive_substrate/GMI
 * @see ./IGMI.ts for the interface definition.
 * @see ./personas/IPersonaDefinition.ts for persona structure.
 * @see ../tools/IToolOrchestrator.ts for tool orchestration.
 * @see ../core/ai_utilities/IUtilityAI.ts for utility functions.
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
  LifecycleAction,
  GMIInteractionType,
  ToolCallRequest,
  ToolCallResult,
} from './IGMI';
import {
  IPersonaDefinition,
  PersonaRagConfigRetrievalTrigger, // From persona's ragConfig
  MetaPromptDefinition, // For self-reflection structure
  PersonaUtilityProcessingConfig, // For summarization config from persona
  PersonaMemoryConfig, // To access RAG and Lifecycle configs
} from './personas/IPersonaDefinition';
import { IWorkingMemory } from './memory/IWorkingMemory';
import { IPromptEngine, PromptExecutionContext, PromptComponents } from '../core/llm/IPromptEngine';
import { IRetrievalAugmentor, RagRetrievalOptions, RagDocumentInput, RagIngestionOptions, RagMemoryCategory } from '../rag/IRetrievalAugmentor';
import { IProvider, ModelStreamChunk, ModelStreamOptions, ModelChatMessage, ModelUsage } from '../core/llm/providers/IProvider';
import { AIModelProviderManager } from '../core/llm/providers/AIModelProviderManager';
import { IUtilityAI, SummarizationOptions, ParseJsonOptions } from '../core/ai_utilities/IUtilityAI';
import { IToolOrchestrator, ToolDefinitionForLLM } from '../tools/IToolOrchestrator';
import { ToolExecutionRequestDetails } from '../tools/ToolExecutor';
import { GMIError, GMIErrorCode } from '../../utils/errors';

const DEFAULT_MAX_CONVERSATION_HISTORY_TURNS = 20;
const DEFAULT_SELF_REFLECTION_INTERVAL_TURNS = 5;
const MAX_REASONING_TRACE_ENTRIES = 500; // Limit trace size in memory

/**
 * @class GMI
 * @implements {IGMI}
 * The core implementation of the Generalized Mind Instance, orchestrating
 * perception, cognition, action, and adaptation.
 */
export class GMI implements IGMI {
  public readonly gmiId: string;
  public readonly creationTimestamp: Date;

  private activePersona!: IPersonaDefinition;
  private config!: GMIBaseConfig;

  // Core Dependencies (Injected)
  private workingMemory!: IWorkingMemory;
  private promptEngine!: IPromptEngine;
  private retrievalAugmentor?: IRetrievalAugmentor;
  private toolOrchestrator!: IToolOrchestrator;
  private llmProviderManager!: AIModelProviderManager;
  private utilityAI!: IUtilityAI;

  // Internal State
  private state: GMIPrimeState;
  private currentGmiMood: GMIMood;
  private currentUserContext!: UserContext;
  private currentTaskContext!: TaskContext;
  private reasoningTrace: ReasoningTrace;
  private conversationHistory: ModelChatMessage[]; // Uses ModelChatMessage for direct LLM compatibility

  // Self-Reflection Control
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

    // Initial sensible defaults, will be properly set during initialization
    this.currentGmiMood = GMIMood.NEUTRAL;
    this.currentUserContext = { userId: 'uninitialized-user', skillLevel: 'novice', preferences: {} };
    this.currentTaskContext = { taskId: `task-${uuidv4()}`, domain: 'general', complexity: 'low', status: 'not_started' };
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
      console.warn(`GMI (ID: ${this.gmiId}) is being re-initialized from state: ${this.state}. Current state and history will be reset.`);
      // Resetting key state for a clean re-initialization
      this.reasoningTrace = { gmiId: this.gmiId, personaId: '', entries: [] };
      this.conversationHistory = [];
      this.turnsSinceLastReflection = 0;
    }

    this.validateInitializationInputs(persona, config);

    this.activePersona = persona;
    this.config = config;

    // Assign dependencies from config
    this.workingMemory = config.workingMemory;
    this.promptEngine = config.promptEngine;
    this.retrievalAugmentor = config.retrievalAugmentor;
    this.toolOrchestrator = config.toolOrchestrator;
    this.llmProviderManager = config.llmProviderManager;
    this.utilityAI = config.utilityAI;

    this.reasoningTrace.personaId = this.activePersona.id; // Set personaId in trace

    // Initialize working memory specific to this GMI instance
    // The persona's `initialMemoryImprints` will be handled by `loadStateFromMemoryAndPersona`
    await this.workingMemory.initialize(this.gmiId, this.activePersona.customFields?.defaultWorkingMemoryConfig || {});
    this.addTraceEntry(ReasoningEntryType.LIFECYCLE, 'GMI Initializing with Persona and Config.', { personaId: persona.id });

    // Load or establish initial operational state (mood, user/task context)
    await this.loadStateFromMemoryAndPersona();

    // Configure self-reflection interval from persona, if defined
    const reflectionMetaPrompt = this.activePersona.metaPrompts?.find(mp => mp.id === 'gmi_self_trait_adjustment'); // Standard ID for reflection meta-prompt
    if (reflectionMetaPrompt?.trigger?.type === 'turn_interval' && typeof reflectionMetaPrompt.trigger.intervalTurns === 'number') {
      this.selfReflectionIntervalTurns = reflectionMetaPrompt.trigger.intervalTurns;
    } else {
      this.selfReflectionIntervalTurns = DEFAULT_SELF_REFLECTION_INTERVAL_TURNS;
    }
    this.turnsSinceLastReflection = 0;

    this.state = GMIPrimeState.READY;
    this.addTraceEntry(ReasoningEntryType.LIFECYCLE, 'GMI Initialization complete. State: READY.');
    console.log(`GMI (ID: ${this.gmiId}, Persona: ${this.activePersona.id}) initialized successfully.`);
  }

  /**
   * Validates the essential inputs for GMI initialization.
   * @param persona - The persona definition.
   * @param config - The base configuration for the GMI.
   * @private
   */
  private validateInitializationInputs(persona: IPersonaDefinition, config: GMIBaseConfig): void {
    const errors: string[] = [];
    if (!persona) errors.push('PersonaDefinition cannot be null.');
    if (!config) errors.push('GMIBaseConfig cannot be null.');
    else {
      if (!config.workingMemory) errors.push('IWorkingMemory dependency is missing.');
      if (!config.promptEngine) errors.push('IPromptEngine dependency is missing.');
      if (!config.llmProviderManager) errors.push('AIModelProviderManager dependency is missing.');
      if (!config.utilityAI) errors.push('IUtilityAI dependency is missing.'); // Now crucial
      if (!config.toolOrchestrator) errors.push('IToolOrchestrator dependency is missing.');
    }
    if (errors.length > 0) {
      throw new GMIError(`GMI initialization failed due to missing or invalid inputs: ${errors.join(', ')}`, GMIErrorCode.CONFIG_ERROR, { missing: errors });
    }
  }

  /**
   * Loads initial operational state (mood, user context, task context) from working memory,
   * falling back to persona defaults if not found, and applies initial memory imprints.
   * @private
   */
  private async loadStateFromMemoryAndPersona(): Promise<void> {
    // Load mood, falling back to persona default, then system default
    this.currentGmiMood = await this.workingMemory.get<GMIMood>('currentGmiMood') ||
                          (this.activePersona.moodAdaptation?.defaultMood as GMIMood) || // Cast because IPersonaDefinition mood is string
                          GMIMood.NEUTRAL;

    // Load user context
    const personaInitialUserCtx = this.activePersona.customFields?.initialUserContext as Partial<UserContext> || {};
    const defaultUserContext: UserContext = {
        userId: 'default_user', // Should be overridden by actual user ID from turnInput
        skillLevel: 'novice',
        preferences: {},
        ...personaInitialUserCtx,
    };
    this.currentUserContext = {
        ...defaultUserContext,
        ...(await this.workingMemory.get<UserContext>('currentUserContext')),
    };
    
    // Load task context
    const personaInitialTaskCtx = this.activePersona.customFields?.initialTaskContext as Partial<TaskContext> || {};
    const defaultTaskContext: TaskContext = {
        taskId: `task-${uuidv4()}`, // New default task ID
        domain: this.activePersona.strengths?.[0] || 'general',
        complexity: 'medium',
        status: 'not_started',
        ...personaInitialTaskCtx,
    };
    this.currentTaskContext = {
        ...defaultTaskContext,
        ...(await this.workingMemory.get<TaskContext>('currentTaskContext')),
    };

    // Persist the potentially merged or defaulted state back to working memory
    await this.workingMemory.set('currentGmiMood', this.currentGmiMood);
    await this.workingMemory.set('currentUserContext', this.currentUserContext);
    await this.workingMemory.set('currentTaskContext', this.currentTaskContext);

    this.addTraceEntry(ReasoningEntryType.STATE_CHANGE, 'GMI operational state (mood, user, task contexts) loaded/initialized.', {
        mood: this.currentGmiMood,
        userContext: this.currentUserContext,
        taskContext: this.currentTaskContext,
    });

    // Apply initial memory imprints from persona definition
    if (this.activePersona.initialMemoryImprints && this.activePersona.initialMemoryImprints.length > 0) {
      this.addTraceEntry(ReasoningEntryType.STATE_CHANGE, `Applying ${this.activePersona.initialMemoryImprints.length} initial memory imprints from persona.`);
      for (const imprint of this.activePersona.initialMemoryImprints) {
        if (imprint.key && imprint.value !== undefined) {
          await this.workingMemory.set(imprint.key, imprint.value);
          this.addTraceEntry(ReasoningEntryType.DEBUG, `Applied memory imprint: '${imprint.key}'`, { value: imprint.value, description: imprint.description });
        }
      }
    }
  }

  /** @inheritdoc */
  public getPersona(): IPersonaDefinition {
    if (!this.isInitialized || !this.activePersona) {
      throw new GMIError("GMI is not properly initialized or has no active persona.", GMIErrorCode.NOT_INITIALIZED);
    }
    return this.activePersona;
  }

  /** @inheritdoc */
  public getGMIId(): string {
    return this.gmiId;
  }

  /** @inheritdoc */
  public getCurrentState(): GMIPrimeState {
    return this.state;
  }

  /** @inheritdoc */
  public getReasoningTrace(): Readonly<ReasoningTrace> {
    // Return a deep copy to prevent external modification
    return JSON.parse(JSON.stringify(this.reasoningTrace));
  }

  /**
   * Adds an entry to the GMI's reasoning trace, ensuring not to exceed max size.
   * @private
   */
  private addTraceEntry(type: ReasoningEntryType, message: string, details?: Record<string, any>, timestamp?: Date): void {
    if (this.reasoningTrace.entries.length >= MAX_REASONING_TRACE_ENTRIES) {
      this.reasoningTrace.entries.shift(); // Remove oldest entry
    }
    const entry: ReasoningTraceEntry = {
      timestamp: timestamp || new Date(),
      type,
      message: message.substring(0, 1000), // Cap message length
      details: details ? JSON.parse(JSON.stringify(details)) : {}, // Store copy, cap detail size if needed
    };
    this.reasoningTrace.entries.push(entry);
  }

  /**
   * Ensures the GMI is in a READY state to process interactions.
   * @private
   */
  private ensureReady(): void {
    if (this.state !== GMIPrimeState.READY) {
      throw new GMIError(
        `GMI (ID: ${this.gmiId}) is not in READY state. Current state: ${this.state}. Cannot process new turn.`,
        GMIErrorCode.INVALID_STATE,
        { currentGMIState: this.state }
      );
    }
  }

  /**
   * Creates a standardized GMIOutputChunk.
   * @private
   */
  private createOutputChunk(
    interactionId: string,
    type: GMIOutputChunkType,
    content: any,
    extras: Partial<Omit<GMIOutputChunk, 'interactionId' | 'type' | 'content' | 'timestamp' | 'chunkId'>> = {}
  ): GMIOutputChunk {
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
   * Updates the internal conversation history with new input.
   * Also manages history length according to persona configuration.
   * @private
   */
  private updateConversationHistory(turnInput: GMITurnInput): void {
    let messageToAdd: ModelChatMessage | null = null;
    const timestamp = (turnInput.timestamp || new Date()).getTime(); // Ensure timestamp is number

    switch (turnInput.type) {
      case GMIInteractionType.TEXT:
        messageToAdd = { role: 'user', content: turnInput.content as string };
        break;
      case GMIInteractionType.MULTIMODAL_CONTENT:
        // Assuming IProvider.ModelChatMessage content can handle array for multimodal
        messageToAdd = { role: 'user', content: turnInput.content as any };
        break;
      case GMIInteractionType.TOOL_RESPONSE:
        // This case is for when the GMI *receives* tool results from an external executor.
        // The internal tool loop (LLM -> tool -> LLM) adds its own 'tool' role messages.
        const results = Array.isArray(turnInput.content) ? turnInput.content as ToolCallResult[] : [turnInput.content as ToolCallResult];
        results.forEach(result => {
          this.conversationHistory.push({
            role: 'tool',
            tool_call_id: result.toolCallId,
            name: result.toolName,
            content: typeof result.output === 'string' ? result.output : JSON.stringify(result.output),
            // timestamp: timestamp // ModelChatMessage doesn't typically have per-message timestamp
          });
        });
        break; // Handled multiple messages
      case GMIInteractionType.SYSTEM_MESSAGE:
         messageToAdd = { role: 'system', content: turnInput.content as string };
         break;
    }
    if(messageToAdd) this.conversationHistory.push(messageToAdd);

    // Trim history
    const maxHistoryMessages = this.activePersona.conversationContextConfig?.maxMessages ||
                               this.activePersona.memoryConfig?.conversationContext?.maxMessages || // Legacy
                               DEFAULT_MAX_CONVERSATION_HISTORY_TURNS;
    // A simple trim, keeping the most recent N messages. More sophisticated trimming would involve token counts
    // and strategies like 'truncate_head', 'summarize_middle'. PromptEngine handles detailed truncation.
    // This GMI history is primarily for its own context and re-prompting LLMs.
    if (this.conversationHistory.length > maxHistoryMessages) {
        const removeCount = this.conversationHistory.length - maxHistoryMessages;
        this.conversationHistory.splice(0, removeCount); // Remove from the beginning
        this.addTraceEntry(ReasoningEntryType.DEBUG, `Conversation history trimmed to ${this.conversationHistory.length} messages.`, { maxLength: maxHistoryMessages });
    }
  }

  /**
   * Adds a tool call result to the conversation history for re-prompting the LLM.
   * @private
   */
  private updateConversationHistoryWithToolResult(toolCallResult: ToolCallResult): void {
    this.conversationHistory.push({
      role: 'tool',
      tool_call_id: toolCallResult.toolCallId,
      name: toolCallResult.toolName,
      content: toolCallResult.isError
        ? `Tool execution error for '${toolCallResult.toolName}': ${JSON.stringify(toolCallResult.errorDetails || toolCallResult.output)}`
        : (typeof toolCallResult.output === 'string' ? toolCallResult.output : JSON.stringify(toolCallResult.output)),
    });
  }

  /**
   * Builds the PromptExecutionContext for the current state of the GMI.
   * @private
   */
  private buildPromptExecutionContext(): PromptExecutionContext {
    if (!this.activePersona || !this.currentUserContext || !this.currentTaskContext) {
        throw new GMIError("GMI context (persona, user, or task) not properly initialized before prompt construction.", GMIErrorCode.INVALID_STATE);
    }
    // For `availableTools` in PromptExecutionContext, we should ideally get schemas from ToolOrchestrator
    // filtered by permissions. This requires an async call.
    // For now, a simplification: pass tool names/IDs from persona, PromptEngine might fetch schemas if needed.
    // Or, ToolOrchestrator.listAvailableTools is called before invoking PromptEngine and its results passed in PromptComponents.
    // The GMI's `processTurnStream` already calls `toolOrchestrator.listAvailableTools` to pass to LLM.
    // So, `promptEngine.constructPrompt` might not need this here if `finalPrompt` is already `ModelChatMessage[]`.
    // This depends on `IPromptEngine.constructPrompt`'s exact needs.
    // Assuming PromptEngine needs tool definitions if it's to format them for the prompt.
    const toolDefsForPromptEngine: ToolDefinitionForLLM[] = (this.activePersona.toolIds || []).map(toolId => {
        // This is a placeholder; actual schemas should come from ToolOrchestrator.
        // The LLM receives the full schemas via ModelStreamOptions.tools.
        // PromptEngine might only need names/descriptions if just listing them.
        const tool = this.toolOrchestrator.getTool(toolId).then(t => t); // This is async, can't use directly here
        return { name: toolId, description: "Tool: " + toolId, inputSchema: {} };
    });


    return {
      gmiInstanceId: this.gmiId,
      activePersona: this.activePersona,
      currentGmiMood: this.currentGmiMood,
      currentUser: this.currentUserContext,
      currentTask: this.currentTaskContext,
      conversationHistory: [...this.conversationHistory], // Crucial: Pass a copy for PromptEngine to work with
      availableTools: this.activePersona.embeddedTools || [], // Or toolDefsForPromptEngine if PromptEngine needs them
      reasoningTraceSoFar: this.getReasoningTrace(),
    };
  }

  /**
   * @inheritdoc
   */
  public async *processTurnStream(turnInput: GMITurnInput): AsyncGenerator<GMIOutputChunk, void, undefined> {
    this.ensureReady();
    this.state = GMIPrimeState.PROCESSING;
    const turnId = turnInput.interactionId || `turn-${uuidv4()}`; // Use provided interactionId or generate one
    this.reasoningTrace.turnId = turnId;
    this.addTraceEntry(ReasoningEntryType.INTERACTION_START, `Processing turn '${turnId}' for user '${turnInput.userId}'`, { inputType: turnInput.type, inputPreview: String(turnInput.content).substring(0,100) });

    try {
      // Update GMI's internal contexts from turnInput if overrides are provided
      if (turnInput.userContextOverride) { /* ... update currentUserContext and WM ... */ }
      if (turnInput.taskContextOverride) { /* ... update currentTaskContext and WM ... */ }
      if (turnInput.userId && this.currentUserContext.userId !== turnInput.userId) {
        this.currentUserContext.userId = turnInput.userId;
        await this.workingMemory.set('currentUserContext', this.currentUserContext);
      }

      // Add current input to conversation history
      this.updateConversationHistory(turnInput);

      let safetyBreak = 0; // Prevent infinite tool loops
      // eslint-disable-next-line no-constant-condition
      main_processing_loop: while (safetyBreak < 5) { // Limit to 5 tool call iterations
        safetyBreak++;
        let augmentedContextFromRAG = "";

        // 1. RAG Retrieval (if applicable for this iteration)
        const isInitialUserInteraction = this.conversationHistory.length > 0 && this.conversationHistory[this.conversationHistory.length - 1].role === 'user';
        if (this.retrievalAugmentor && this.activePersona.memoryConfig?.ragConfig?.enabled && isInitialUserInteraction) {
          const currentQueryForRag = this.conversationHistory.findLast(m => m.role === 'user')?.content as string;
          if (currentQueryForRag && this.shouldTriggerRAGRetrieval(currentQueryForRag)) {
            // ... (RAG call and trace entries as previously implemented) ...
            const ragResult = await this.retrievalAugmentor.retrieveContext(currentQueryForRag, { /* options */ });
            augmentedContextFromRAG = ragResult.augmentedContext;
            this.addTraceEntry(ReasoningEntryType.RAG_QUERY_RESULT, 'RAG context retrieved.', { /* details */ });
          }
        }

        // 2. Construct Prompt
        const promptExecContext = this.buildPromptExecutionContext(); // Includes current full history
        const promptComponents: PromptComponents = {
          systemMessage: this.activePersona.baseSystemPrompt,
          retrievedContext: augmentedContextFromRAG,
          // userQuery is part of conversationHistory
        };
        const { finalPrompt, issues: promptIssues, selectedModel } = await this.promptEngine.constructPrompt(
          promptExecContext, promptComponents,
          this.activePersona.defaultModelCompletionOptions?.modelId || this.config.defaultLlmModelId
        );
        promptIssues?.forEach(issue => this.addTraceEntry(ReasoningEntryType.WARNING, `Prompt issue: ${issue.message}`, issue));
        this.addTraceEntry(ReasoningEntryType.PROMPT_CONSTRUCTION_COMPLETE, `Prompt for model ${selectedModel.modelId}.`);

        // 3. Call LLM Provider
        const provider = this.llmProviderManager.getProvider(selectedModel.providerId);
        const toolsForLLM = await this.toolOrchestrator.listAvailableTools({
            personaId: this.activePersona.id,
            personaCapabilities: this.activePersona.allowedCapabilities || [],
            userContext: this.currentUserContext,
        });
        const llmOptions: ModelStreamOptions = {
          temperature: this.activePersona.defaultModelCompletionOptions?.temperature ?? 0.7,
          maxTokens: this.activePersona.defaultModelCompletionOptions?.maxTokens ?? 2048,
          tools: toolsForLLM.length > 0 ? toolsForLLM : undefined, // Pass tool definitions if any
          // tool_choice: // Can be configured via persona if needed
          userId: this.currentUserContext.userId,
        };
        this.addTraceEntry(ReasoningEntryType.LLM_CALL_START, `Streaming from ${selectedModel.modelId}. Tools available: ${toolsForLLM.length}.`);

        let fullLLMTextResponseThisIteration = "";
        let llmRequestedToolCalls: ToolCallRequest[] = []; // From this specific LLM response

        for await (const chunk of provider.generateStream(selectedModel.modelId, finalPrompt, llmOptions)) {
          if (chunk.error) throw new GMIError(`LLM stream error: ${chunk.error.message}`, GMIErrorCode.PROVIDER_ERROR, chunk.error.details);
          if (chunk.textDelta) {
            fullLLMTextResponseThisIteration += chunk.textDelta;
            yield this.createOutputChunk(turnInput.interactionId, GMIOutputChunkType.TEXT_DELTA, chunk.textDelta, { usage: chunk.usage });
          }
          if (chunk.toolCalls && chunk.toolCalls.length > 0) {
            const parsedToolCalls = chunk.toolCalls.map(tc => ({
                id: tc.id || `toolcall-${uuidv4()}`, // Ensure ID for matching
                name: tc.function.name,
                arguments: typeof tc.function.arguments === 'string'
                    // Robust parsing for arguments. If this fails, the tool call is problematic.
                    ? (JSON.parse(tc.function.arguments) as Record<string, any>)
                    : tc.function.arguments as Record<string, any>,
            }));
            llmRequestedToolCalls.push(...parsedToolCalls);
            yield this.createOutputChunk(turnInput.interactionId, GMIOutputChunkType.TOOL_CALL_REQUEST, [...parsedToolCalls]); // Yield a copy
            this.addTraceEntry(ReasoningEntryType.TOOL_CALL_REQUESTED, `LLM requested tool(s).`, { requests: parsedToolCalls });
          }
          if (chunk.isFinal && chunk.finishReason) {
            this.addTraceEntry(ReasoningEntryType.LLM_CALL_COMPLETE, `LLM stream part finished. Reason: ${chunk.finishReason}`, { usage: chunk.usage });
            if(chunk.usage) yield this.createOutputChunk(turnInput.interactionId, GMIOutputChunkType.USAGE_UPDATE, chunk.usage);
          }
        } // End LLM stream

        // Add assistant's full response (text and tool call *requests*) to history
        this.conversationHistory.push({
            role: 'assistant',
            content: fullLLMTextResponseThisIteration || null, // OpenAI: null content if only tool_calls
            tool_calls: llmRequestedToolCalls.length > 0 ? llmRequestedToolCalls.map(tc => ({...tc})) : undefined, // Store copies
        });

        // 4. Process Tool Calls if LLM requested them
        if (llmRequestedToolCalls.length > 0) {
          this.state = GMIPrimeState.AWAITING_TOOL_RESULT;
          const toolExecutionResults: ToolCallResult[] = [];
          for (const toolCallReq of llmRequestedToolCalls) {
            const requestDetails: ToolExecutionRequestDetails = {
              toolCallRequest: toolCallReq, // Arguments are already objects
              gmiId: this.gmiId, personaId: this.activePersona.id,
              personaCapabilities: this.activePersona.allowedCapabilities || [],
              userContext: this.currentUserContext, correlationId: turnId,
            };
            this.addTraceEntry(ReasoningEntryType.TOOL_EXECUTION_START, `Orchestrating tool: ${toolCallReq.name}`, { reqId: toolCallReq.id });
            const result = await this.toolOrchestrator.processToolCall(requestDetails);
            toolExecutionResults.push(result); // This is ToolCallResult
            this.addTraceEntry(ReasoningEntryType.TOOL_EXECUTION_RESULT, `Tool '${toolCallReq.name}' result. Success: ${!result.isError}`, { result });
          }

          // Add all tool results to history for the next LLM iteration
          toolExecutionResults.forEach(tcResult => this.updateConversationHistoryWithToolResult(tcResult));
          this.state = GMIPrimeState.PROCESSING; // Back to processing for next LLM call
          // Loop back to re-prompt LLM with tool results in history
          continue main_processing_loop;
        }

        // If no tool calls were made by the LLM, this is the end of the interaction sequence for this turn.
        break main_processing_loop;
      } // End main_processing_loop

      // Post-turn actions (RAG ingestion, self-reflection trigger)
      const finalGmiTextResponse = this.conversationHistory.filter(m => m.role === 'assistant' && typeof m.content === 'string').map(m=>m.content).join("\n");
      await this.performPostTurnIngestion(turnInput.content as string, finalGmiTextResponse);

      this.turnsSinceLastReflection++;
      const reflectionMetaPrompt = this.activePersona.metaPrompts?.find(mp => mp.id === 'gmi_self_trait_adjustment');
      if (reflectionMetaPrompt?.trigger?.type === 'turn_interval' && this.turnsSinceLastReflection >= (reflectionMetaPrompt.trigger.intervalTurns || this.selfReflectionIntervalTurns)) {
        this.addTraceEntry(ReasoningEntryType.SELF_REFLECTION_TRIGGERED, `Interval reached.`);
        this._triggerAndProcessSelfReflection().catch(err => { /* log background error */ }); // Non-blocking
        this.turnsSinceLastReflection = 0;
      }

    } catch (error: any) {
      const gmiError = GMIError.wrap(error, GMIErrorCode.PROCESSING_ERROR, `Error during GMI turn '${turnId}'.`, { turnId });
      this.state = GMIPrimeState.ERRORED;
      this.addTraceEntry(ReasoningEntryType.ERROR, `GMI processing error: ${gmiError.message}`, gmiError.toPlainObject());
      console.error(`GMI (ID: ${this.gmiId}) error in turn '${turnId}':`, gmiError);
      yield this.createOutputChunk(turnInput.interactionId, GMIOutputChunkType.ERROR, gmiError.message, { errorDetails: gmiError.toPlainObject() });
    } finally {
      if (this.state !== GMIPrimeState.ERRORED && this.state !== GMIPrimeState.AWAITING_TOOL_RESULT) {
        this.state = GMIPrimeState.READY;
      }
      yield this.createOutputChunk(turnInput.interactionId, GMIOutputChunkType.FINAL_RESPONSE_MARKER, 'Turn processing sequence complete.', { isFinal: true });
      this.addTraceEntry(ReasoningEntryType.INTERACTION_END, `Turn '${turnId}' finished. GMI State: ${this.state}.`);
      this.reasoningTrace.turnId = undefined;
    }
  }

  /**
   * Performs post-turn RAG ingestion if configured, using IUtilityAI for summarization.
   * @private
   */
  private async performPostTurnIngestion(userInput: string, gmiResponse: string): Promise<void> {
    const ragConfig = this.activePersona.memoryConfig?.ragConfig;
    const ingestionTriggers = ragConfig?.ingestionTriggers; // Path from IPersonaDefinition
    // In IPersonaDefinition, summarization config for RAG might be under memoryConfig.ragConfig.retrievedContextProcessing or a new ingestionProcessing section
    const ingestionProcessingConfig = ragConfig?.ingestionProcessing; // Assuming new PersonaRagIngestionProcessingConfig on PersonaRagConfig

    if (!this.retrievalAugmentor || !ragConfig?.enabled || !ingestionTriggers?.onTurnSummary) {
        return;
    }
    
    try {
        const textToSummarize = `User: ${userInput}\n\nAssistant: ${gmiResponse}`;
        let documentContent = textToSummarize;

        if (this.utilityAI && ingestionProcessingConfig?.summarization?.enabled) {
            const summarizationOptions: SummarizationOptions = {
                desiredLength: ingestionProcessingConfig.summarization.targetLength || 'short',
                method: ingestionProcessingConfig.summarization.method || 'abstractive_llm',
                modelId: ingestionProcessingConfig.summarization.modelId || this.activePersona.defaultModelCompletionOptions?.modelId, // Fallback model
                // providerId: (if available in ingestionProcessingConfig.summarization)
            };
            this.addTraceEntry(ReasoningEntryType.RAG_INGESTION_DETAIL, "Summarizing turn for RAG ingestion.", { textLength: textToSummarize.length, options: summarizationOptions });
            documentContent = await this.utilityAI.summarize(textToSummarize, summarizationOptions);
        }
        
        const docToIngest: RagDocumentInput = {
            id: `turnsummary-${this.gmiId}-${this.reasoningTrace.turnId || uuidv4()}`,
            content: documentContent,
            metadata: {
                gmiId: this.gmiId, personaId: this.activePersona.id, userId: this.currentUserContext.userId,
                timestamp: new Date().toISOString(), type: "conversation_turn_summary", turnId: this.reasoningTrace.turnId,
            },
            dataSourceId: ragConfig.defaultIngestionDataSourceId, // Ensure this is configured in persona
        };
        const ingestionOptions: RagIngestionOptions = {
            userId: this.currentUserContext.userId, personaId: this.activePersona.id,
        };

        this.addTraceEntry(ReasoningEntryType.RAG_INGESTION_START, "Ingesting turn summary to RAG.", { documentId: docToIngest.id, summaryLength: documentContent.length });
        const ingestionResult = await this.retrievalAugmentor.ingestDocuments(docToIngest, ingestionOptions);
        if (ingestionResult.failedIngestionCount > 0) {
            this.addTraceEntry(ReasoningEntryType.WARNING, "Post-turn RAG ingestion encountered errors.", { errors: ingestionResult.errors });
        } else {
            this.addTraceEntry(ReasoningEntryType.RAG_INGESTION_COMPLETE, "Post-turn RAG ingestion successful.", { ingestedIds: ingestionResult.ingestedDocumentIds });
        }
    } catch (error: any) {
        const gmiError = GMIError.wrap(error, GMIErrorCode.RAG_INGESTION_FAILED, "Error during post-turn RAG ingestion.");
        this.addTraceEntry(ReasoningEntryType.ERROR, gmiError.message, gmiError.toPlainObject());
        console.error(`GMI (ID: ${this.gmiId}): ${gmiError.message}`, gmiError.details?.underlyingError);
    }
  }

  /**
   * @inheritdoc
   */
  public async _triggerAndProcessSelfReflection(): Promise<void> {
    const reflectionMetaPromptDef = this.activePersona.metaPrompts?.find(mp => mp.id === 'gmi_self_trait_adjustment');
    if (!reflectionMetaPromptDef?.promptTemplate) {
      this.addTraceEntry(ReasoningEntryType.SELF_REFLECTION_SKIPPED, "Self-reflection disabled or no 'gmi_self_trait_adjustment' meta-prompt.");
      return;
    }
     if (this.state === GMIPrimeState.REFLECTING) {
        this.addTraceEntry(ReasoningEntryType.SELF_REFLECTION_SKIPPED, "Self-reflection already in progress."); return;
    }

    const previousState = this.state;
    this.state = GMIPrimeState.REFLECTING;
    this.addTraceEntry(ReasoningEntryType.SELF_REFLECTION_START, "Starting self-reflection cycle.");

    try {
      const evidence = { /* ... gather extensive evidence ... */
        recentConversation: this.conversationHistory.slice(-10),
        recentTraceEntries: this.reasoningTrace.entries.slice(-20),
        currentMood: this.currentGmiMood, currentUserContext: this.currentUserContext, currentTaskContext: this.currentTaskContext,
      };
      this.addTraceEntry(ReasoningEntryType.SELF_REFLECTION_DETAIL, "Gathered evidence for reflection.");

      let metaPromptText = (typeof reflectionMetaPromptDef.promptTemplate === 'string')
          ? reflectionMetaPromptDef.promptTemplate
          : reflectionMetaPromptDef.promptTemplate.template;

      // Simple templating, more robust solution would use a library
      metaPromptText = metaPromptText.replace(/\{\{\s*evidence\s*\}\}/gi, JSON.stringify(evidence).substring(0, 4000) + "...")
                                   .replace(/\{\{\s*current_mood\s*\}\}/gi, this.currentGmiMood)
                                   .replace(/\{\{\s*user_skill\s*\}\}/gi, this.currentUserContext.skillLevel || "unknown")
                                   .replace(/\{\{\s*task_complexity\s*\}\}/gi, this.currentTaskContext.complexity || "unknown");
      
      this.addTraceEntry(ReasoningEntryType.SELF_REFLECTION_DETAIL, "Constructed meta-prompt.", { preview: metaPromptText.substring(0,100) });

      const { modelId, providerId } = this.getModelAndProviderForLLMCall(
          reflectionMetaPromptDef.modelId, reflectionMetaPromptDef.providerId,
          this.config.defaultLlmModelId, this.config.defaultLlmProviderId // Fallbacks
      );
      const provider = this.llmProviderManager.getProvider(providerId);
      const llmResponse = await provider.generate(modelId, metaPromptText, {
        maxTokens: reflectionMetaPromptDef.maxOutputTokens || 512,
        temperature: reflectionMetaPromptDef.temperature || 0.3,
        response_format: { type: "json_object" } // Instruct LLM for JSON output
      });

      if (!llmResponse.choices?.[0]?.text) {
        throw new GMIError("Self-reflection LLM call returned no content.", GMIErrorCode.PROVIDER_ERROR);
      }
      const responseText = llmResponse.choices[0].text;
      this.addTraceEntry(ReasoningEntryType.SELF_REFLECTION_DETAIL, "LLM response for reflection received.", { preview: responseText.substring(0,100) });

      const parseOptions: ParseJsonOptions = {
          attemptFixWithLLM: true,
          llmModelIdForFix: reflectionMetaPromptDef.modelId || modelId, // Use a capable model
          llmProviderIdForFix: reflectionMetaPromptDef.providerId || providerId,
          // targetSchema: reflectionMetaPromptDef.outputSchema // If defined in MetaPromptDefinition
      };
      type ExpectedReflectionOutput = {
          updatedGmiMood?: GMIMood;
          updatedUserSkillLevel?: string;
          updatedTaskComplexity?: string;
          adjustmentRationale?: string;
          newMemoryImprints?: Array<{key: string; value: any; description?: string}>;
      };
      const parsedUpdates = await this.utilityAI.parseJsonSafe<ExpectedReflectionOutput>(responseText, parseOptions);

      if (!parsedUpdates) {
          throw new GMIError("Failed to parse/fix JSON from self-reflection LLM using UtilityAI.", GMIErrorCode.PARSING_ERROR, { responseText });
      }
      this.addTraceEntry(ReasoningEntryType.SELF_REFLECTION_DETAIL, "Parsed trait update suggestions.", { suggestions: parsedUpdates });

      // Apply updates to working memory and GMI state
      let stateChanged = false;
      if (parsedUpdates.updatedGmiMood && Object.values(GMIMood).includes(parsedUpdates.updatedGmiMood) && this.currentGmiMood !== parsedUpdates.updatedGmiMood) {
        this.currentGmiMood = parsedUpdates.updatedGmiMood;
        await this.workingMemory.set('currentGmiMood', this.currentGmiMood); stateChanged = true;
      }
      if (parsedUpdates.updatedUserSkillLevel && this.currentUserContext.skillLevel !== parsedUpdates.updatedUserSkillLevel) {
        this.currentUserContext.skillLevel = parsedUpdates.updatedUserSkillLevel;
        await this.workingMemory.set('currentUserContext', this.currentUserContext); stateChanged = true;
      }
      if (parsedUpdates.updatedTaskComplexity && this.currentTaskContext.complexity !== parsedUpdates.updatedTaskComplexity) {
        this.currentTaskContext.complexity = parsedUpdates.updatedTaskComplexity;
        await this.workingMemory.set('currentTaskContext', this.currentTaskContext); stateChanged = true;
      }
      if (parsedUpdates.newMemoryImprints && parsedUpdates.newMemoryImprints.length > 0) {
          for (const imprint of parsedUpdates.newMemoryImprints) {
              await this.workingMemory.set(imprint.key, imprint.value);
          }
          stateChanged = true; // Consider this a state change
          this.addTraceEntry(ReasoningEntryType.STATE_CHANGE, "New memory imprints added from self-reflection.", { imprints: parsedUpdates.newMemoryImprints });
      }

      if (stateChanged) {
        this.addTraceEntry(ReasoningEntryType.STATE_CHANGE, "GMI state updated via self-reflection.", {
          newMood: this.currentGmiMood, newUserContext: this.currentUserContext, newTaskContext: this.currentTaskContext,
          rationale: parsedUpdates.adjustmentRationale
        });
      } else {
         this.addTraceEntry(ReasoningEntryType.SELF_REFLECTION_DETAIL, "No state changes applied from self-reflection.", { rationale: parsedUpdates.adjustmentRationale });
      }

    } catch (error: any) {
      const gmiError = GMIError.wrap(error, GMIErrorCode.PROCESSING_ERROR, `Error during self-reflection.`);
      this.addTraceEntry(ReasoningEntryType.ERROR, `Self-reflection failed: ${gmiError.message}`, gmiError.toPlainObject());
      console.error(`GMI (ID: ${this.gmiId}) self-reflection error:`, gmiError);
    } finally {
      this.state = previousState === GMIPrimeState.REFLECTING ? GMIPrimeState.READY : previousState; // Restore previous or set to Ready
      this.addTraceEntry(ReasoningEntryType.SELF_REFLECTION_COMPLETE, "Self-reflection cycle finished.");
    }
  }

  /**
   * Helper to determine model and provider for internal LLM calls.
   * @private
   */
  private getModelAndProviderForLLMCall(
    preferredModelId?: string, preferredProviderId?: string,
    systemDefaultModelId?: string, systemDefaultProviderId?: string
  ): { modelId: string; providerId: string } {
    let modelId = preferredModelId || systemDefaultModelId;
    let providerId = preferredProviderId || systemDefaultProviderId;

    if (!modelId) { // If still no model, try to get first from manager (less ideal)
        const allModels = this.llmProviderManager.listProviderIds().flatMap(pid => this.llmProviderManager.getProvider(pid)?.listModels().then(mList => mList.map(m => ({...m, providerId: pid}))));
        // This is async and complex for a sync helper. Needs a better default/fallback strategy.
        // For now, throw if essential modelId is missing.
        throw new GMIError("Cannot determine modelId for LLM call: No preferred or system default found.", GMIErrorCode.CONFIG_ERROR);
    }

    // If providerId is missing but modelId is "provider/model_name"
    if (!providerId && modelId.includes('/')) {
      const parts = modelId.split('/');
      if (parts.length === 2) {
        providerId = parts[0];
        modelId = parts[1]; // Use the model name part for the call
      }
    }
    if (!providerId) {
        // If still no providerId, the AIModelProviderManager.getProvider() will try to resolve it
        // or throw if it cannot.
        // For clarity, we can attempt to find a provider for the model if manager supports it.
        // This logic is simplified here; AIModelProviderManager should be robust.
        const providerForModel = this.llmProviderManager.listProviderIds().find(pid =>
            this.llmProviderManager.getProvider(pid)?.listModels().then(models => models.some(m => m.id === modelId))
        );
        if (providerForModel) {
            providerId = providerForModel;
        } else {
             throw new GMIError(`Cannot determine providerId for model '${modelId}'. Please specify explicitly or ensure AIModelProviderManager can resolve it.`, GMIErrorCode.CONFIG_ERROR);
        }
    }
    return { modelId, providerId };
  }

  /** @inheritdoc */
  public async onMemoryLifecycleEvent(event: MemoryLifecycleEvent): Promise<LifecycleActionResponse> {
    // ... (implementation as previously provided, can use this.utilityAI.summarize or other methods for richer negotiation)
    this.ensureReady();
    this.addTraceEntry(ReasoningEntryType.MEMORY_LIFECYCLE_EVENT_RECEIVED, `Received memory lifecycle event: ${event.type}`, { eventId: event.eventId, itemId: event.itemId });
    
    const personaLifecycleConf = this.activePersona.memoryConfig?.lifecycleConfig; // Path based on IPersonaDefinition
    let gmiDecision: LifecycleAction = event.proposedAction; // Default
    let rationale = 'GMI default action: align with MemoryLifecycleManager proposal.';

    if (personaLifecycleConf?.negotiationEnabled && event.negotiable) {
        this.addTraceEntry(ReasoningEntryType.MEMORY_LIFECYCLE_NEGOTIATION_START, "GMI negotiation for memory item.", { event });
        // Placeholder for more complex negotiation logic, potentially involving an LLM call via this.utilityAI
        // Example: if item is USER_EXPLICIT_MEMORY and proposed for deletion, be cautious.
        if (event.category === RagMemoryCategory.USER_EXPLICIT_MEMORY.toString() &&
            (event.proposedAction === 'DELETE' || event.proposedAction === 'EVICTION_PROPOSED')) {
            gmiDecision = 'PREVENT_ACTION';
            rationale = 'GMI policy: User explicit memory requires careful review; preventing immediate deletion/eviction.';
        }
    }
    const response: LifecycleActionResponse = {
        gmiId: this.gmiId, eventId: event.eventId, actionTaken: gmiDecision, rationale,
    };
    this.addTraceEntry(ReasoningEntryType.MEMORY_LIFECYCLE_RESPONSE_SENT, `Responding to memory event: ${response.actionTaken}`, { response });
    return response;
  }

  /** @inheritdoc */
  public async analyzeAndReportMemoryHealth(): Promise<GMIHealthReport['memoryHealth']> {
    // ... (implementation as previously provided)
    this.ensureReady();
    this.addTraceEntry(ReasoningEntryType.HEALTH_CHECK_REQUESTED, "Analyzing GMI memory health.");
    const workingMemorySize = await this.workingMemory.size();
    const ragHealth = this.retrievalAugmentor ? await this.retrievalAugmentor.checkHealth() : { isHealthy: true, details: "RAG not configured." };
    // const mlmHealth = this.memoryLifecycleManager ? await this.memoryLifecycleManager.checkHealth() : {isHealthy: true, details: "MLM not configured"};

    const memoryHealth: GMIHealthReport['memoryHealth'] = {
        overallStatus: ragHealth.isHealthy /* && mlmHealth.isHealthy */ ? 'OPERATIONAL' : 'DEGRADED',
        workingMemoryStats: { itemCount: workingMemorySize },
        ragSystemStats: ragHealth,
        // lifecycleManagerStats: mlmHealth,
        issues: [],
    };
    // Add issues based on health details
    if (!ragHealth.isHealthy) memoryHealth.issues?.push({severity: 'warning', component: 'RetrievalAugmentor', description: "RAG system health check failed.", details: ragHealth.details});
    // if (!mlmHealth.isHealthy) memoryHealth.issues?.push({severity: 'warning', component: 'MemoryLifecycleManager', description: "MLM health check failed.", details: mlmHealth.details});

    this.addTraceEntry(ReasoningEntryType.HEALTH_CHECK_RESULT, "Memory health analysis complete.", { status: memoryHealth.overallStatus });
    return memoryHealth;
  }

  /** @inheritdoc */
  public async getOverallHealth(): Promise<GMIHealthReport> {
    // ... (implementation as previously provided, ensuring all checks are thorough)
    this.addTraceEntry(ReasoningEntryType.HEALTH_CHECK_REQUESTED, "Overall GMI health check.");
    const memoryHealth = await this.analyzeAndReportMemoryHealth();
    const dependenciesStatus: GMIHealthReport['dependenciesStatus'] = [];
    // ... (checkDep helper and calls as before) ...
    const report: GMIHealthReport = { /* ... assemble full report ... */ } as GMIHealthReport; // Placeholder
    this.addTraceEntry(ReasoningEntryType.HEALTH_CHECK_RESULT, "Overall GMI health check complete.", { status: report.overallStatus });
    return report;
  }

  /** @inheritdoc */
  public async shutdown(): Promise<void> {
    // ... (implementation as previously provided)
    if (this.state === GMIPrimeState.SHUTDOWN || (this.state === GMIPrimeState.IDLE && !this.isInitialized)) {
      console.log(`GMI (ID: ${this.gmiId}) already shut down or was never fully initialized.`);
      this.state = GMIPrimeState.SHUTDOWN; return;
    }
    this.state = GMIPrimeState.SHUTTING_DOWN;
    this.addTraceEntry(ReasoningEntryType.LIFECYCLE, "GMI shutting down.");
    try {
      await this.workingMemory?.close?.();
      await this.retrievalAugmentor?.shutdown?.();
      await this.toolOrchestrator?.shutdown?.(); // Orchestrator might shut down tools
      await this.promptEngine?.shutdown?.(); // If IPromptEngine gets shutdown
      await this.utilityAI?.shutdown?.();
    } catch (error: any) { /* ... log error ... */ }
    finally {
      this.state = GMIPrimeState.SHUTDOWN; this.isInitialized = false;
      this.addTraceEntry(ReasoningEntryType.LIFECYCLE, "GMI shutdown complete.");
      console.log(`GMI (ID: ${this.gmiId}) shut down.`);
    }
  }
}