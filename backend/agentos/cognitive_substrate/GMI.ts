/**
 * @fileoverview This file implements the Generalized Mind Instance (GMI), the central cognitive
 * engine of AgentOS. The GMI is responsible for embodying a persona, managing its active state,
 * orchestrating interactions with Large Language Models (LLMs) and tools, processing multimodal
 * inputs, adapting to user feedback, and driving the streaming response generation.
 *
 * The GMI operates in a sophisticated cognitive loop:
 * 1. Receives input (text, vision, audio, feedback, commands).
 * 2. Adapts based on feedback.
 * 3. Selects/confirms the persona for the current task.
 * 4. Gathers necessary information (working memory, RAG, conversation history).
 * 5. Selects an appropriate LLM and provider.
 * 6. Constructs a detailed prompt using the PromptEngine.
 * 7. Calls the LLM, handling streaming responses.
 * 8. Parses LLM output for text, tool calls, or errors.
 * 9. If tool calls are requested, yields them and awaits results.
 * 10. If tool results are provided, processes them and re-enters the LLM loop.
 * 11. Yields final response chunks and a conclusive GMIOutput.
 *
 * It is designed to be highly configurable through PersonaDefinitions and to be observable
 * via a detailed reasoning trace.
 *
 * @module backend/agentos/cognitive_substrate/GMI
 * @see {@link IGMI} for the interface definition.
 * @see {@link IPersonaDefinition} for persona configuration.
 */

import { v4 as uuidv4 } from 'uuid';
import {
  IGMI,
  GMIBaseConfig,
  GMITurnInput,
  GMIOutputChunk,
  GMIOutput,
  ToolCall,
  ToolResultPayload,
  VisionInputData,
  AudioInputData,
  UserFeedback,
  ReasoningTrace,
  CostAggregator,
  IGMISnapshot,
  ModelSelectionOverrides,
} from './IGMI';
import { IPersonaDefinition, PersonaStateOverride, PersonaVoiceConfig } from './personas/IPersonaDefinition';
import { IWorkingMemory } from './memory/IWorkingMemory';
// import { RedisWorkingMemory } from './memory/RedisWorkingMemory'; // Example of a persistent memory store
import { AIModelProviderManager } from '../core/llm/providers/AIModelProviderManager';
import { IProvider, ModelCompletionResponse, ModelInfo, ModelUsage, ModelCompletionOptions, ChatMessage } from '../core/llm/providers/IProvider';
import { IModelRouter, ModelSelectionCriteria, ModelRouteDecision } from '../core/llm/routing/IModelRouter';
import { PromptEngine, FormattedPrompt, PromptEngineResult } from '../core/llm/PromptEngine';
import { ToolExecutor } from '../tools/ToolExecutor';
import { ITool, ToolParameter } from '../tools/interfaces/ITool';
import { ConversationContext, Message, MessageRole } from '../core/conversation/ConversationContext';
import { ISubscriptionService, ISubscriptionTier } from '../../services/user_auth/SubscriptionService';
import { IAuthService } from '../../services/user_auth/AuthService';
import { ConversationManager } from '../core/conversation/ConversationManager';
import { PrismaClient } from '@prisma/client';

/**
 * Internal type for accumulating streamed tool call arguments.
 * @internal
 */
type AccumulatedToolCallDelta = {
  id: string;
  name: string;
  argumentsBuffer: string;
  type: 'function'; // Currently fixed as per OpenAI spec
};

/**
 * Custom error class for GMI-specific operational errors.
 * @class GMIError
 * @extends {Error}
 */
export class GMIError extends Error {
  /**
   * The specific error code for this GMI error.
   * @type {string}
   */
  public readonly code: string;
  /**
   * Optional additional details or context for the error.
   * @type {any}
   * @optional
   */
  public readonly details?: any;

  /**
   * Creates an instance of GMIError.
   * @param {string} message - The human-readable error message.
   * @param {string} code - A GMI-specific error code (e.g., 'NO_PERSONA_ACTIVE', 'MODEL_SELECTION_FAILED').
   * @param {any} [details] - Optional additional context or the underlying error.
   */
  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = 'GMIError';
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, GMIError.prototype); // Ensure instanceof works correctly
  }
}

/**
 * Represents a single, coherent cognitive instance within AgentOS.
 * Each GMI instance operates based on an active `IPersonaDefinition`, maintains its
 * own `IWorkingMemory` and `ConversationContext`, and orchestrates the flow
 * of information to and from Large Language Models (LLMs) and external tools.
 * It is designed to be streaming-first, yielding response chunks in real-time.
 *
 * @class GMI
 * @implements {IGMI}
 */
export class GMI implements IGMI {
  /**
   * Unique identifier for this GMI instance.
   * @readonly
   * @type {string}
   */
  public readonly instanceId: string;

  /**
   * The conversation context associated with this GMI instance.
   * It is managed externally by {@link GMIManager} and injected during initialization.
   * @type {ConversationContext}
   */
  public conversationContext!: ConversationContext;

  /**
   * The base configuration and shared dependencies for the GMI.
   * @private
   * @type {GMIBaseConfig}
   */
  private baseConfig: GMIBaseConfig;

  /**
   * The working memory instance for this GMI.
   * Managed externally by {@link GMIManager} and injected during initialization.
   * @private
   * @type {IWorkingMemory}
   */
  private workingMemory!: IWorkingMemory;

  /**
   * The currently active primary persona definition.
   * @private
   * @type {IPersonaDefinition | undefined}
   */
  private currentPrimaryPersona?: IPersonaDefinition;

  /**
   * A map of all persona definitions available to this GMI instance.
   * Keyed by persona ID.
   * @private
   * @type {Map<string, IPersonaDefinition>}
   */
  private availablePersonaDefinitions: Map<string, IPersonaDefinition>;

  /**
   * Aggregates cost and usage for LLM calls within the current turn.
   * Resets at the beginning of each new turn processed by `processTurnStream`.
   * @private
   * @type {CostAggregator}
   */
  private turnCostAggregator: CostAggregator;

  /**
   * Records the sequence of significant operations and decisions within the current turn.
   * Resets at the beginning of each new turn processed by `processTurnStream`.
   * @private
   * @type {ReasoningTrace[]}
   */
  private reasoningTrace: ReasoningTrace[];

  // Cached dependencies from baseConfig for convenience and type safety.
  private providerManager: AIModelProviderManager;
  private promptEngine: PromptEngine;
  private toolExecutor: ToolExecutor;
  private modelRouter?: IModelRouter;
  private authService: IAuthService;
  private subscriptionService: ISubscriptionService;
  // Prisma client is optional at GMIBaseConfig level
  private prisma?: PrismaClient;
  // ConversationManager is part of GMIBaseConfig but primarily used by GMIManager for context creation.
  // GMI receives the specific ConversationContext instance.

  /**
   * Indicates if the GMI instance has been successfully initialized.
   * @private
   * @type {boolean}
   */
  private isInitialized: boolean = false;


  /**
   * Constructs a new GMI instance.
   * Note: The GMI is not fully operational until `initialize()` is called.
   *
   * @param {string | null} instanceId - A unique ID for this GMI instance. If null, a new UUID will be generated.
   * @param {GMIBaseConfig} baseConfig - The fundamental configuration and shared dependencies for the GMI.
   */
  constructor(
    instanceId: string | null = null,
    baseConfig: GMIBaseConfig,
  ) {
    this.instanceId = instanceId || uuidv4();
    this.baseConfig = baseConfig;

    // Extract and cache dependencies from baseConfig
    if (!baseConfig.providerManager || !baseConfig.promptEngine || !baseConfig.toolExecutor || !baseConfig.authService || !baseConfig.subscriptionService || !baseConfig.conversationManager) {
      throw new GMIError(
        'Critical GMI dependencies (providerManager, promptEngine, toolExecutor, authService, subscriptionService, conversationManager) are missing from baseConfig.',
        'GMI_CONSTRUCTION_FAILED_MISSING_DEPS'
      );
    }
    this.providerManager = baseConfig.providerManager;
    this.promptEngine = baseConfig.promptEngine;
    this.toolExecutor = baseConfig.toolExecutor;
    this.modelRouter = baseConfig.modelRouter;
    this.authService = baseConfig.authService;
    this.subscriptionService = baseConfig.subscriptionService;
    this.prisma = baseConfig.prisma;

    this.availablePersonaDefinitions = new Map();
    this.turnCostAggregator = { totalCostUSD: 0, calls: [] };
    this.reasoningTrace = [];

    // Initial log, full initialization happens in initialize()
    // console.log(`GMI instance ${this.instanceId} constructed. Awaiting initialization.`);
  }

  /**
   * Ensures that the GMI has been properly initialized before use.
   * @private
   * @throws {GMIError} If the GMI is not initialized.
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new GMIError(
        `GMI instance ${this.instanceId} has not been initialized. Call initialize() before use.`,
        'GMI_NOT_INITIALIZED'
      );
    }
  }

  /**
   * {@inheritDoc IGMI.initialize}
   */
  public async initialize(
    initialPersona: IPersonaDefinition,
    availablePersonas: IPersonaDefinition[],
    workingMemory: IWorkingMemory,
    conversationContext: ConversationContext,
  ): Promise<void> {
    if (this.isInitialized) {
      this.addTrace({ timestamp: new Date(), event: 'GMIReinitializationAttempt', details: `GMI ${this.instanceId} re-initialization attempted. Current persona: ${this.currentPrimaryPersona?.id}. New initial: ${initialPersona.id}` });
      // Decide on re-initialization strategy: e.g., throw error, or clear and re-init
      // For now, let's allow re-initialization, which will reset state.
    }

    if (!initialPersona || !availablePersonas || availablePersonas.length === 0 || !workingMemory || !conversationContext) {
      throw new GMIError(
        'Invalid arguments for GMI initialization. All parameters are required and availablePersonas must not be empty.',
        'GMI_INIT_INVALID_ARGS',
        { initialPersonaId: initialPersona?.id, availablePersonasCount: availablePersonas?.length, hasWorkingMemory: !!workingMemory, hasConversationContext: !!conversationContext }
      );
    }

    this.availablePersonaDefinitions.clear();
    availablePersonas.forEach(p => {
      if (p && p.id) {
        this.availablePersonaDefinitions.set(p.id, p);
      } else {
        console.warn(`GMI ${this.instanceId}: Invalid persona definition encountered during initialization (missing ID). Skipping.`);
      }
    });

    if (!this.availablePersonaDefinitions.has(initialPersona.id)) {
       this.availablePersonaDefinitions.set(initialPersona.id, initialPersona); // Ensure initial persona is in the available list
       console.warn(`GMI ${this.instanceId}: Initial persona '${initialPersona.id}' was not in the provided availablePersonas list. It has been added.`)
    }


    this.workingMemory = workingMemory;
    this.conversationContext = conversationContext;

    // Initialize working memory; it needs the GMI instance ID for potential namespacing
    try {
      await this.workingMemory.initialize(this.instanceId);
    } catch (error: any) {
      throw new GMIError(
        `Failed to initialize working memory for GMI ${this.instanceId}: ${error.message}`,
        'WORKING_MEMORY_INIT_FAILED',
        error
      );
    }

    // Activate the initial persona (this also handles initial memory imprints and conversation config)
    try {
      await this.activatePersona(initialPersona.id);
    } catch (error: any) {
      // If activatePersona throws, it might be a GMIError already.
      // If not, wrap it.
      if (error instanceof GMIError) throw error;
      throw new GMIError(
        `Failed to activate initial persona '${initialPersona.id}' for GMI ${this.instanceId}: ${error.message}`,
        'INITIAL_PERSONA_ACTIVATION_FAILED',
        error
      );
    }

    this.isInitialized = true;
    this.addTrace({
      timestamp: new Date(),
      event: 'GMIInitialized',
      details: `GMI ${this.instanceId} initialized successfully with persona ${this.currentPrimaryPersona?.name} (ID: ${this.currentPrimaryPersona?.id}).`,
      data: {
        initialPersonaId: this.currentPrimaryPersona?.id,
        workingMemoryId: this.workingMemory.id,
        conversationContextId: this.conversationContext.id,
        availablePersonaCount: this.availablePersonaDefinitions.size,
      }
    });
    // console.log(`GMI ${this.instanceId} initialized with persona ${this.currentPrimaryPersona?.name}.`);
  }

  /**
   * {@inheritDoc IGMI.getCurrentPrimaryPersonaId}
   */
  public getCurrentPrimaryPersonaId(): string {
    this.ensureInitialized();
    if (!this.currentPrimaryPersona) {
      throw new GMIError(`GMI ${this.instanceId}: No primary persona is currently active. Cannot get ID.`, 'NO_PERSONA_ACTIVE');
    }
    return this.currentPrimaryPersona.id;
  }

  /**
   * {@inheritDoc IGMI.getCurrentPersonaDefinition}
   */
  public getCurrentPersonaDefinition(): IPersonaDefinition | undefined {
    this.ensureInitialized();
    return this.currentPrimaryPersona;
  }

  /**
   * {@inheritDoc IGMI.activatePersona}
   */
  public async activatePersona(personaId: string): Promise<void> {
    this.ensureInitialized(); // GMI must be initialized to activate a persona (though initialize calls this too)

    const persona = this.availablePersonaDefinitions.get(personaId);
    if (!persona) {
      throw new GMIError(
        `Persona with ID '${personaId}' not available to GMI ${this.instanceId}. Known personas: ${Array.from(this.availablePersonaDefinitions.keys()).join(', ')}`,
        'PERSONA_NOT_FOUND'
      );
    }

    const previousPersonaId = this.currentPrimaryPersona?.id;
    if (this.currentPrimaryPersona && previousPersonaId !== persona.id) {
      // Switching personas: clear session-specific working memory adaptations.
      // This prevents mood/state from one persona leaking into another.
      // Persisted user preferences (if stored elsewhere or under specific keys) might be retained.
      await this.workingMemory.clear(); // This should be carefully considered. Some memory might be cross-persona.
                                       // For now, a full clear aligns with isolating persona states.
      this.addTrace({
        timestamp: new Date(),
        event: 'PersonaSwitchClearMemory',
        details: `Switching from persona ${previousPersonaId} to ${persona.name} (ID: ${persona.id}). Working memory for session-specific adaptations cleared.`,
        data: { fromPersonaId: previousPersonaId, toPersonaId: persona.id },
      });
    }

    this.currentPrimaryPersona = persona;

    // Apply initial memory imprints from the new persona definition
    if (persona.initialMemoryImprints && persona.initialMemoryImprints.length > 0) {
      for (const imprint of persona.initialMemoryImprints) {
        if (imprint && typeof imprint.key === 'string') {
          await this.workingMemory.set(imprint.key, imprint.value);
        } else {
          console.warn(`GMI ${this.instanceId}: Invalid initial memory imprint in persona ${persona.id}:`, imprint);
        }
      }
      this.addTrace({
        timestamp: new Date(),
        event: 'InitialMemoryImprintsApplied',
        details: `Applied ${persona.initialMemoryImprints.length} initial memory imprints from persona ${persona.name}.`,
        data: { personaId: persona.id, imprintKeys: persona.initialMemoryImprints.map(i => i.key) },
      });
    }

    // Set/update current persona ID and initial/default mood in working memory for dynamic access by GMI logic or prompts
    await this.workingMemory.set('current_primary_persona_id', persona.id);
    await this.workingMemory.set('current_mood', persona.moodAdaptation?.defaultMood || 'neutral');

    // Apply conversation context configuration from the persona
    // This might adjust history length, summarization strategy, etc.
    if (persona.conversationContextConfig) {
      this.conversationContext.applyConfig(persona.conversationContextConfig);
      this.addTrace({
        timestamp: new Date(),
        event: 'ConversationContextConfigApplied',
        details: `Applied conversation context configuration from persona ${persona.name}.`,
        data: { personaId: persona.id, config: persona.conversationContextConfig },
      });
    }

    this.addTrace({
      timestamp: new Date(),
      event: 'PersonaActivated',
      details: `Activated persona: ${persona.name} (ID: ${persona.id})`,
      data: { personaId: persona.id, personaName: persona.name },
    });
    // console.log(`GMI ${this.instanceId}: Persona ${persona.name} (ID: ${persona.id}) activated.`);
  }

  /**
   * {@inheritDoc IGMI.processTurnStream}
   */
  public async *processTurnStream(input: GMITurnInput): AsyncGenerator<GMIOutputChunk, GMIOutput, undefined> {
    this.ensureInitialized();
    this.resetTurnState(); // Reset costs and trace for this new turn.
    const streamId = uuidv4(); // Unique ID for this specific turn's stream.

    // Initial progress chunk
    yield {
      type: 'SystemProgress',
      streamId,
      isFinal: false,
      gmiInstanceId: this.instanceId,
      personaId: this.currentPrimaryPersona?.id || 'unknown',
      message: 'GMI turn processing started...',
      statusCode: 'GMI_TURN_START',
    };
    this.addTrace({
      timestamp: new Date(),
      event: 'TurnStart',
      details: `Processing input for GMI turn stream ${streamId}.`,
      data: {
        userId: input.userId,
        sessionId: input.sessionId,
        conversationId: input.conversationId,
        textInputPreview: input.textInput ? input.textInput.substring(0, 100) + (input.textInput.length > 100 ? '...' : '') : null,
        hasVisionInputs: !!input.visionInputs?.length,
        hasAudioInput: !!input.audioInput,
      }
    });

    let activePersona = this.currentPrimaryPersona;

    try {
      // 0. Apply explicit persona state overrides if provided
      if (input.personaStateOverrides && input.personaStateOverrides.length > 0) {
        for (const override of input.personaStateOverrides) {
          await this.applyPersonaStateOverride(override);
        }
        yield {
          type: 'SystemProgress', streamId, isFinal: false, gmiInstanceId: this.instanceId,
          personaId: activePersona?.id || 'unknown', message: 'Applied persona state overrides.',
          statusCode: 'PERSONA_STATE_OVERRIDDEN',
        };
      }

      // 1. Handle User Feedback (Adaptation)
      if (input.userFeedback) {
        await this.adapt(input.userFeedback, input.userId);
        yield {
          type: 'SystemProgress', streamId, isFinal: false, gmiInstanceId: this.instanceId,
          personaId: activePersona?.id || 'unknown', message: 'Adaptation processed based on user feedback.',
          statusCode: 'ADAPTATION_COMPLETE',
        };
      }

      // 2. Persona Activation/Orchestration
      if (input.explicitPersonaSwitchId && input.explicitPersonaSwitchId !== activePersona?.id) {
        try {
          await this.activatePersona(input.explicitPersonaSwitchId);
          activePersona = this.currentPrimaryPersona; // Update activePersona reference
          yield {
            type: 'SystemProgress', streamId, isFinal: false, gmiInstanceId: this.instanceId,
            personaId: activePersona!.id, message: `Switched to persona: ${activePersona!.name}.`,
            statusCode: 'PERSONA_SWITCHED',
          };
        } catch (e: any) {
          const switchErrorMsg = `Failed to switch to persona '${input.explicitPersonaSwitchId}'. Continuing with current persona '${activePersona?.name || 'unknown'}'.`;
          console.warn(`GMI ${this.instanceId}: ${switchErrorMsg} Details: ${e.message}`);
          this.addTrace({ timestamp: new Date(), event: 'PersonaSwitchFailed', details: switchErrorMsg, data: { requestedPersonaId: input.explicitPersonaSwitchId, error: e.message } });
          yield {
            type: 'SystemProgress', streamId, isFinal: false, gmiInstanceId: this.instanceId,
            personaId: activePersona?.id || 'unknown', message: switchErrorMsg,
            statusCode: 'PERSONA_SWITCH_FAILED',
          };
          // Continue with the current persona
        }
      }

      if (!activePersona) {
        throw new GMIError('No primary persona active. GMI cannot process turn.', 'NO_PERSONA_ACTIVE_FOR_TURN');
      }
      this.addTrace({ timestamp: new Date(), event: 'PersonaForExecution', details: `Executing turn with persona: ${activePersona.name} (ID: ${activePersona.id})` });

      // Add user message to conversation context
      const userMessageContent = this.constructUserMessageContent(input);
      if (userMessageContent || (input.visionInputs && input.visionInputs.length > 0) || input.audioInput) {
        const userMessage: Message = {
          role: MessageRole.USER,
          content: userMessageContent,
          vision_inputs: input.visionInputs,
          audio_input: input.audioInput, // GMI or a tool would handle transcription if needed.
          timestamp: new Date().toISOString(),
          userId: input.userId, // Associate message with user
        };
        this.conversationContext.addMessage(userMessage);
        this.addTrace({
            timestamp: new Date(), event: 'UserMessageAddedToContext',
            details: `User input (text, vision, audio) added to conversation context.`,
            data: { messageId: userMessage.id, textInputPreview: input.textInput?.substring(0,50), visionCount: input.visionInputs?.length, hasAudio: !!input.audioInput },
        });
      }


      let accumulatedResponseText = '';
      let currentToolCallDeltas: AccumulatedToolCallDelta[] = [];
      let modelResponseForTurn: ModelCompletionResponse | null = null; // Holds the last significant response from LLM
      let iteration = 0;
      const maxIterations = await this.subscriptionService.getMaxToolCallIterations(input.userId);

      // Main Cognitive Loop (handles multiple LLM calls if tools are involved)
      // eslint-disable-next-line no-constant-condition
      while (true) {
        iteration++;
        if (iteration > maxIterations) {
          const iterErrorMsg = `Maximum tool call iterations (${maxIterations}) reached. Force-completing turn.`;
          this.addTrace({ timestamp: new Date(), event: 'MaxIterationsReached', details: iterErrorMsg });
          console.warn(`GMI ${this.instanceId}: ${iterErrorMsg}`);
          throw new GMIError(iterErrorMsg, 'MAX_TOOL_ITERATIONS_EXCEEDED');
        }

        yield {
          type: 'SystemProgress', streamId, isFinal: false, gmiInstanceId: this.instanceId,
          personaId: activePersona.id, message: `GMI thinking (iteration ${iteration})...`,
          statusCode: 'AGENT_THINKING_ITERATION',
          progressPercentage: Math.floor((iteration / maxIterations) * 50), // Rough progress
          metadata: { iteration }
        };

        // 3.1 Select Model
        const { provider, modelId, modelInfo } = await this._selectModelForTask(
          activePersona,
          input.taskHint || 'general_conversation',
          input.userId,
          input.userApiKeys,
          input.modelSelectionOverrides
        );

        // 3.2 Gather Prompt Components & Construct Prompt
        const promptComponents = await this._gatherPromptComponents(
          activePersona,
          input,
          this.conversationContext.getHistory(),
          modelInfo
        );
        const promptResult = await this.promptEngine.constructPrompt(
          promptComponents,
          modelInfo,
          activePersona.promptEngineConfigOverrides?.promptTemplateName
        );
        this.handlePromptIssues(promptResult, streamId, activePersona.id);


        // 3.3 Call LLM (Streaming)
        const llmStream = this._callLLMStream(provider, modelId, promptResult.prompt, {
          userId: input.userId,
          apiKeyOverride: input.userApiKeys?.[provider.providerId],
          temperature: input.modelSelectionOverrides?.temperature ?? activePersona.defaultModelCompletionOptions?.temperature,
          maxTokens: input.modelSelectionOverrides?.maxTokens ?? activePersona.defaultModelCompletionOptions?.maxTokens,
          topP: input.modelSelectionOverrides?.topP ?? activePersona.defaultModelCompletionOptions?.topP,
          tools: promptResult.formattedToolSchemas,
          toolChoice: input.modelSelectionOverrides?.forceToolCall ? {type: "function", function: { name: input.modelSelectionOverrides.forceToolCall.name }} : activePersona.defaultModelCompletionOptions?.toolChoice,
        });

        let textDeltaBuffer = '';
        let activeToolCallDelta: AccumulatedToolCallDelta | null = null;
        const completedToolCallDeltasThisStream: AccumulatedToolCallDelta[] = [];

        for await (const chunk of llmStream) {
          modelResponseForTurn = chunk; // Keep track of the latest chunk for potential full response data.
          if (chunk.usage) { this.aggregateUsage(chunk.usage, modelId, provider.providerId); }
          if (chunk.error) {
            throw new GMIError(`LLM stream error from ${modelId}: ${chunk.error.message}`, 'LLM_STREAM_ERROR', chunk.error);
          }

          // Accumulate text deltas
          if (chunk.responseTextDelta) {
            textDeltaBuffer += chunk.responseTextDelta;
            accumulatedResponseText += chunk.responseTextDelta;
            yield {
              type: 'GMIResponseChunk', streamId, isFinal: false, gmiInstanceId: this.instanceId,
              personaId: activePersona.id, responseTextDelta: chunk.responseTextDelta,
              usage: chunk.usage, timestamp: new Date().toISOString(),
            };
          }

          // Accumulate tool call deltas
          if (chunk.toolCallsDeltas && chunk.toolCallsDeltas.length > 0) {
            for (const delta of chunk.toolCallsDeltas) {
              if (delta.id && (!activeToolCallDelta || activeToolCallDelta.id !== delta.id)) {
                // Finalize previous active tool call delta
                if (activeToolCallDelta) {
                  completedToolCallDeltasThisStream.push(activeToolCallDelta);
                  this.addTrace({ timestamp: new Date(), event: 'StreamedToolCallPartComplete', details: `Completed streaming part for tool: ${activeToolCallDelta.name}`, data: { id: activeToolCallDelta.id } });
                }
                // Start new tool call delta
                activeToolCallDelta = {
                  id: delta.id,
                  name: delta.function?.name || '',
                  argumentsBuffer: delta.function?.arguments_delta || '',
                  type: 'function',
                };
              } else if (activeToolCallDelta) {
                if (delta.function?.name) activeToolCallDelta.name = delta.function.name; // Should typically come with ID
                if (delta.function?.arguments_delta) activeToolCallDelta.argumentsBuffer += delta.function.arguments_delta;
              }
            }
          }
        } // End of LLM stream chunk processing

        // Finalize any last active tool call delta from the stream
        if (activeToolCallDelta) {
          completedToolCallDeltasThisStream.push(activeToolCallDelta);
          this.addTrace({ timestamp: new Date(), event: 'StreamedToolCallPartComplete', details: `Completed final streaming part for tool: ${activeToolCallDelta.name}`, data: { id: activeToolCallDelta.id } });
        }
        currentToolCallDeltas = completedToolCallDeltasThisStream; // Store fully accumulated deltas

        // 3.4 Parse Final LLM Response (from last chunk or accumulated deltas)
        const { responseText: llmFinalText, toolCalls: parsedToolCalls } = this._parseLLMResponse(
            modelResponseForTurn, // Use the last response object which might contain full tool_calls array
            textDeltaBuffer, // Text received in this specific stream
            currentToolCallDeltas, // Tools accumulated from this specific stream
            activePersona
        );
        this.addTrace({ timestamp: new Date(), event: 'LLMResponseParsed', details: 'LLM response from stream parsed.', data: { responseTextLength: llmFinalText?.length, toolCallCount: parsedToolCalls?.length } });

        // Add GMI's direct response (text or tool_calls decision) to context
        if (llmFinalText || parsedToolCalls?.length) {
          const gmiMessage: Message = {
            role: MessageRole.ASSISTANT,
            content: llmFinalText || null,
            tool_calls: parsedToolCalls, // Already parsed with arguments as objects
            timestamp: new Date().toISOString(),
            model_id: modelResponseForTurn?.modelId,
            usage: modelResponseForTurn?.usage,
          };
          this.conversationContext.addMessage(gmiMessage);
          this.addTrace({
              timestamp: new Date(), event: 'GMIMessageAddedToContext',
              details: `Assistant message (text/tool_calls) added to context.`,
              data: { messageId: gmiMessage.id, hasContent: !!llmFinalText, toolCallCount: parsedToolCalls?.length }
          });
        }

        // 3.5 Handle Tool Calls or Finalize Response
        if (parsedToolCalls && parsedToolCalls.length > 0) {
          yield {
            type: 'ToolCallRequest', streamId, isFinal: false, gmiInstanceId: this.instanceId,
            personaId: activePersona.id, toolCalls: parsedToolCalls,
            responseText: llmFinalText, // Include any text generated before tool call decision
            usage: this.turnCostAggregator, reasoningTrace: [...this.reasoningTrace],
          };
          // The orchestrator is expected to call `handleToolResult` next.
          // The `processTurnStream` generator will pause here.
          // When `handleToolResult` is called, its output is handled by orchestrator.
          // The orchestrator then calls `processTurnStream` again *with the tool result already in context*.
          // So, this loop will continue with the updated context.
          // The actual `return` from this generator happens when no more tool calls are made OR
          // when handleToolResult returns a GMIOutput that signals the end of the turn.

          // Since we are in a `while(true)` loop that depends on external calls to `handleToolResult`
          // to populate context for the *next* iteration, we need to break or return from here
          // if the nature of the interaction is such that `processTurnStream` shouldn't automatically continue.
          // The prompt specified `handleToolResult` should return a `Promise<GMIOutput>`, not resume the stream.
          // This means `processTurnStream` is responsible for ONE full thought leading to text or tool_calls.
          // If tool_calls, it yields and effectively finishes its current "thought".
          // The *next* call to `processTurnStream` (if any) will be after tool results are processed by handleToolResult
          // and added to context by the orchestrator.

          // For the current design, after yielding ToolCallRequest, this invocation of processTurnStream IS DONE.
          // The final GMIOutput of this specific generator invocation is the ToolCallRequest itself.
          // This adheres to the idea that processTurnStream handles one "segment" of thought.
          const toolCallRequestOutput: GMIOutput = {
            type: 'ToolCallRequest', streamId, isFinal: true, /* Mark as final for this generator's scope */
            gmiInstanceId: this.instanceId, personaId: activePersona.id, toolCalls: parsedToolCalls,
            responseText: llmFinalText, usage: this.turnCostAggregator, reasoningTrace: [...this.reasoningTrace],
          };
          this.addTrace({ timestamp: new Date(), event: 'TurnSegmentEnd_ToolCall', details: `GMI turn segment finished, yielding tool call request. Stream ${streamId}.`});
          return toolCallRequestOutput; // End this invocation of the generator.

        } else {
          // No tool calls, this is the final response for the turn.
          const finalResponseOutput: GMIOutput = {
            type: 'FinalResponse', streamId, isFinal: true, gmiInstanceId: this.instanceId,
            personaId: activePersona.id, responseText: llmFinalText || accumulatedResponseText, // Prioritize directly parsed text
            toolCalls: undefined, // No tool calls this round
            uiCommands: undefined, // UI commands would be handled by specific tools or future GMI capabilities
            audioOutput: (activePersona.allowedOutputModalities?.includes('audio_tts') && (llmFinalText || accumulatedResponseText))
              ? { textToSpeak: (llmFinalText || accumulatedResponseText)!, voiceConfig: activePersona.voiceConfig }
              : undefined,
            imageOutput: undefined, // Would come from a tool result typically
            usage: this.turnCostAggregator, reasoningTrace: [...this.reasoningTrace],
            error: modelResponseForTurn?.error ? { code: 'LLM_RESPONSE_ERROR', message: modelResponseForTurn.error.message, details: modelResponseForTurn.error.details } : undefined,
            conversationContext: this.conversationContext.getRawData(), // Send back the updated context state
          };
          this.addTrace({ timestamp: new Date(), event: 'TurnEnd_FinalResponse', details: `GMI turn processing finished with final response. Stream ${streamId}.`});
          yield finalResponseOutput; // Yield the final response object as a chunk (isFinal=true)
          return finalResponseOutput; // And return it to satisfy the generator's return type
        }
      } // End of while(true) cognitive loop
    } catch (error: any) {
      const traceError = (error instanceof GMIError) ? error : new GMIError(error.message, 'GMI_TURN_FATAL_ERROR', error);
      this.addTrace({
        timestamp: new Date(), event: 'FatalTurnError',
        details: `Fatal error in GMI turn stream ${streamId}: ${traceError.message}`,
        data: { code: traceError.code, stack: traceError.stack, details: traceError.details }
      });
      console.error(`GMI ${this.instanceId}: Fatal error in processTurnStream:`, traceError);

      const errorOutput: GMIOutput = {
        type: 'Error', streamId, isFinal: true, gmiInstanceId: this.instanceId,
        personaId: activePersona?.id || 'unknown',
        error: { code: traceError.code, message: traceError.message, details: traceError.details },
        usage: this.turnCostAggregator, reasoningTrace: [...this.reasoningTrace],
        responseText: null,
      };
      yield errorOutput; // Yield the error object as the final chunk
      return errorOutput; // And return it
    }
  }


  /**
   * {@inheritDoc IGMI.handleToolResult}
   */
  public async handleToolResult(
    toolCallId: string,
    originalToolName: string,
    toolResultPayload: ToolResultPayload,
    userId: string,
    userApiKeys?: Record<string, string>,
    modelSelectionOverrides?: ModelSelectionOverrides
  ): Promise<GMIOutput> {
    this.ensureInitialized();
    // NOTE: `handleToolResult` is called by an orchestrator. It processes the tool result,
    // adds it to context, and then the orchestrator would typically call `processTurnStream` again.
    // This method itself returns a *single* GMIOutput, which might be an interim progress update
    // or, if the GMI decides the turn is over after this tool call, a FinalResponse.
    // For this implementation, `handleToolResult` primarily updates context.
    // The decision to continue the turn (and make another LLM call) will happen
    // in a *subsequent* call to `processTurnStream` by the orchestrator.

    const streamIdForToolResultProcessing = uuidv4(); // New stream ID for this specific operation's output
    this.resetTurnState(); // Reset costs for this "sub-turn" or processing step. Trace will also be fresh.

    this.addTrace({
      timestamp: new Date(), event: 'ToolResultReceived',
      details: `Received result for tool call ID ${toolCallId} (Tool: ${originalToolName}). Status: ${toolResultPayload.type}.`,
      data: { toolCallId, originalToolName, resultType: toolResultPayload.type, resultPreview: JSON.stringify(toolResultPayload).substring(0,100) }
    });

    const activePersona = this.currentPrimaryPersona;
    if (!activePersona) {
      const noPersonaError = new GMIError('No primary persona active. Cannot handle tool result.', 'NO_PERSONA_ACTIVE_FOR_TOOL_RESULT');
      this.addTrace({ timestamp: new Date(), event: 'FatalError_HandleToolResult', details: noPersonaError.message, data: { code: noPersonaError.code } });
      return {
        type: 'Error', streamId: streamIdForToolResultProcessing, isFinal: true, gmiInstanceId: this.instanceId, personaId: 'unknown',
        error: { code: noPersonaError.code, message: noPersonaError.message },
        usage: this.turnCostAggregator, reasoningTrace: [...this.reasoningTrace], responseText: null,
      };
    }

    // Add tool result message to conversation context.
    // This is crucial for the *next* call to `processTurnStream`.
    this.conversationContext.addMessage({
      role: MessageRole.TOOL,
      tool_call_id: toolCallId,
      name: originalToolName, // Function name for the tool message
      content: JSON.stringify(toolResultPayload.result ?? toolResultPayload.error ?? { status: toolResultPayload.type, info: 'No explicit content from tool.' }),
      timestamp: new Date().toISOString(),
      userId: userId, // Associate with user if applicable
    });
    this.addTrace({ timestamp: new Date(), event: 'ToolResultAddedToContext', details: `Tool result from ${originalToolName} (ID: ${toolCallId}) added to conversation context.` });

    // The GMI has now noted the tool result. The standard flow expects the orchestrator
    // to call `processTurnStream` again. `handleToolResult` itself doesn't typically make another LLM call
    // in this refined architecture unless it's a very simple "tool result summarization" step.
    // The primary loop in `processTurnStream` is responsible for the LLM calls.

    // For now, `handleToolResult` returns a SystemProgress type GMIOutput,
    // signaling that the tool result has been integrated into the context.
    // The orchestrator then decides if/when to call `processTurnStream` again.
    const toolResultProcessedOutput: GMIOutput = {
        type: 'ToolResultProcessed',
        streamId: streamIdForToolResultProcessing,
        isFinal: true, // This GMIOutput is final for *this specific method call*
        gmiInstanceId: this.instanceId,
        personaId: activePersona.id,
        toolCallId: toolCallId,
        toolName: originalToolName,
        status: toolResultPayload.type,
        message: `Tool result for '${originalToolName}' (ID: ${toolCallId}) processed and added to context. GMI is ready for next reasoning step.`,
        // usage: this.turnCostAggregator, // No LLM calls made directly within this refined handleToolResult
        // reasoningTrace: [...this.reasoningTrace], // Trace for this specific operation
    } as unknown as GMIOutput; // Cast because TS struggles with discriminated union return from IGMI methods sometimes

    // If the architecture demanded that handleToolResult *must* continue the thought process with an LLM call immediately:
    // You would replicate the model selection, prompt construction, and LLM call logic from `processTurnStream` here.
    // However, this can lead to duplicated logic. The current design where `handleToolResult` updates context
    // and `processTurnStream` handles all LLM interactions based on current context is cleaner.
    // The orchestrator would call processTurnStream with an updated GMITurnInput (perhaps with a specific taskHint like 'process_tool_output').

    this.addTrace({ timestamp: new Date(), event: 'HandleToolResultEnd', details: `Tool result handling for ${originalToolName} complete. Context updated.` });
    return toolResultProcessedOutput;
  }


  /**
   * {@inheritDoc IGMI.adapt}
   */
  public async adapt(feedback: UserFeedback, userId: string): Promise<void> {
    this.ensureInitialized();
    if (!this.currentPrimaryPersona) {
      console.warn(`GMI ${this.instanceId}: Cannot adapt, no primary persona active.`);
      this.addTrace({ timestamp: new Date(), event: 'AdaptationSkipped', details: 'No active persona during adaptation attempt.' });
      return;
    }
    this.addTrace({ timestamp: new Date(), event: 'AdaptationAttempt', details: 'Processing user feedback.', data: { feedback, userId } });

    // Example: Simple mood adaptation based on sentiment
    if (feedback.sentiment && this.currentPrimaryPersona.moodAdaptation?.enabled) {
      const moodConfig = this.currentPrimaryPersona.moodAdaptation;
      let currentMood = await this.workingMemory.get<string>('current_mood') || moodConfig.defaultMood;
      let newMood = currentMood;

      if (feedback.sentiment === 'positive' && moodConfig.moodPrompts?.['positive_feedback_mood']) {
        newMood = moodConfig.moodPrompts['positive_feedback_mood'];
      } else if (feedback.sentiment === 'negative' && moodConfig.moodPrompts?.['negative_feedback_mood']) {
        newMood = moodConfig.moodPrompts['negative_feedback_mood'];
      } else if (moodConfig.moodPrompts?.[feedback.sentiment]) {
        // Allow custom sentiments defined in moodPrompts to map to a mood state or prompt key
        newMood = feedback.sentiment; // Assuming feedback.sentiment is a key in moodPrompts
      }

      if (newMood !== currentMood && moodConfig.allowedMoods?.includes(newMood)) {
        await this.workingMemory.set('current_mood', newMood);
        this.addTrace({ timestamp: new Date(), event: 'MoodAdaptation', details: `Mood adapted from '${currentMood}' to: '${newMood}' due to feedback.`, data: { oldMood: currentMood, newMood } });
      } else if (newMood !== currentMood) {
          this.addTrace({ timestamp: new Date(), event: 'MoodAdaptationSkipped', details: `Proposed new mood '${newMood}' not in allowed moods or no change.`, data: { proposedMood: newMood, currentMood, allowed: moodConfig.allowedMoods } });
      }
    }

    // Storing explicit preferences
    if (feedback.preferences) {
      for (const key in feedback.preferences) {
        // It's good practice to namespace user preferences, e.g., `user_pref_${key}`
        // or store them under a dedicated object `user_preferences`.
        await this.workingMemory.set(`user_preference_${key}`, feedback.preferences[key]);
        this.addTrace({ timestamp: new Date(), event: 'PreferenceStored', details: `Stored user preference: ${key} = ${JSON.stringify(feedback.preferences[key])}` });
      }
    }

    // Further adaptation logic could involve:
    // - Updating RAG memory with corrected information.
    // - Triggering a meta-prompt for the GMI to reflect on the feedback.
    // - Adjusting parameters for future tool usage or model selection.
    // This would typically involve more domain-specific logic or an AdaptationEngine service.
    this.addTrace({ timestamp: new Date(), event: 'AdaptationProcessed', details: 'User feedback processing complete.' });
  }

  /**
   * {@inheritDoc IGMI.createSnapshot}
   */
  public async createSnapshot(): Promise<IGMISnapshot> {
    this.ensureInitialized();
    if (!this.currentPrimaryPersona) {
      throw new GMIError(`GMI ${this.instanceId}: Cannot create snapshot, no primary persona active.`, 'NO_PERSONA_FOR_SNAPSHOT');
    }

    const workingMemoryData = await this.workingMemory.getAll();
    const conversationContextData = this.conversationContext.getRawData(); // Get serializable data

    const snapshot: IGMISnapshot = {
      gmiInstanceId: this.instanceId,
      timestamp: new Date().toISOString(),
      version: '1.1.0', // Increment version if snapshot structure changes
      currentPrimaryPersonaId: this.currentPrimaryPersona.id,
      availablePersonaIds: Array.from(this.availablePersonaDefinitions.keys()),
      workingMemorySnapshot: workingMemoryData,
      conversationContextSnapshot: conversationContextData,
      reasoningTraceSnapshot: [...this.reasoningTrace], // Snapshot of the current turn's trace
      currentMood: await this.workingMemory.get<string>('current_mood'),
      // customState: { /* any other GMI-specific state to persist */ }
    };
    this.addTrace({ timestamp: new Date(), event: 'SnapshotCreated', details: `Snapshot created for GMI ${this.instanceId}.`, data: { snapshotIdHint: snapshot.timestamp } });
    return snapshot;
  }

  /**
   * {@inheritDoc IGMI.restoreFromSnapshot}
   */
  public async restoreFromSnapshot(
    snapshot: IGMISnapshot,
    availablePersonas: IPersonaDefinition[], // Provide all known personas to ensure we can find the one from snapshot
    workingMemory: IWorkingMemory,
    conversationContext: ConversationContext
  ): Promise<void> {
    // Initial checks
    if (snapshot.gmiInstanceId !== this.instanceId && this.isInitialized) { // Check if already initialized and different ID
      console.warn(`GMI ${this.instanceId}: Restoring snapshot from a different GMI instance (${snapshot.gmiInstanceId}). State will be overwritten.`);
      // Potentially clear existing state or re-initialize GMI core components if necessary
      this.isInitialized = false; // Force re-evaluation of initialization state
    }
     if (!snapshot || !availablePersonas || !workingMemory || !conversationContext) {
        throw new GMIError('Invalid arguments for GMI restoreFromSnapshot.', 'GMI_RESTORE_INVALID_ARGS');
    }

    // Re-populate available personas. This GMI instance might have a different set than the one that created the snapshot.
    this.availablePersonaDefinitions.clear();
    availablePersonas.forEach(p => this.availablePersonaDefinitions.set(p.id, p));

    const targetPersona = this.availablePersonaDefinitions.get(snapshot.currentPrimaryPersonaId);
    if (!targetPersona) {
      throw new GMIError(
        `Cannot restore snapshot: Persona ID '${snapshot.currentPrimaryPersonaId}' from snapshot not found in available personas.`,
        'PERSONA_NOT_FOUND_ON_RESTORE',
        { snapshotPersonaId: snapshot.currentPrimaryPersonaId, knownIds: Array.from(this.availablePersonaDefinitions.keys()) }
      );
    }

    this.workingMemory = workingMemory; // Assign the provided working memory instance
    this.conversationContext = conversationContext; // Assign the provided context instance

    // Initialize working memory (again, if it wasn't the same instance or needs re-scoping)
    await this.workingMemory.initialize(this.instanceId);
    await this.workingMemory.clear(); // Clear it before restoring snapshot data
    if (snapshot.workingMemorySnapshot) {
      for (const key in snapshot.workingMemorySnapshot) {
        await this.workingMemory.set(key, snapshot.workingMemorySnapshot[key]);
      }
    }

    // Restore conversation context
    if (snapshot.conversationContextSnapshot && typeof this.conversationContext.restoreFromSnapshot === 'function') {
      this.conversationContext.restoreFromSnapshot(snapshot.conversationContextSnapshot);
    } else if (snapshot.conversationContextSnapshot) {
        console.warn(`GMI ${this.instanceId}: ConversationContext does not have a restoreFromSnapshot method. Snapshot data may not be fully applied.`);
        // Fallback: try to set messages if possible, assuming a basic structure.
        if (snapshot.conversationContextSnapshot.messages) {
            this.conversationContext.clearMessages();
            (snapshot.conversationContextSnapshot.messages as Message[]).forEach(msg => this.conversationContext.addMessage(msg));
        }
    }


    // Activate the persona. This will apply its initial imprints and conversation config.
    // Working memory has already been populated from snapshot, so imprints might overwrite some snapshot values if keys overlap.
    // Consider if snapshot working memory should *always* take precedence over fresh persona imprints.
    // Current logic: Persona imprints apply, then snapshot WM overwrites.
    await this.activatePersona(targetPersona.id);


    // Restore reasoning trace (optional, usually for debugging a specific past state)
    this.reasoningTrace = snapshot.reasoningTraceSnapshot ? [...snapshot.reasoningTraceSnapshot] : [];

    // Restore mood if explicitly stored in snapshot and not already set by working memory restore + activatePersona
    if (snapshot.currentMood && (await this.workingMemory.get<string>('current_mood')) !== snapshot.currentMood) {
      await this.workingMemory.set('current_mood', snapshot.currentMood);
    }

    this.isInitialized = true; // Mark as initialized after successful restoration.
    this.addTrace({ timestamp: new Date(), event: 'SnapshotRestored', details: `GMI ${this.instanceId} state restored from snapshot version ${snapshot.version}. Active persona: ${this.currentPrimaryPersona?.id}` });
    // console.log(`GMI ${this.instanceId} restored from snapshot. Active persona: ${this.currentPrimaryPersona?.name}`);
  }


  /**
   * {@inheritDoc IGMI.close}
   */
  public async close(): Promise<void> {
    // No specific check for ensureInitialized() here as close should be callable even if init failed partially
    this.addTrace({ timestamp: new Date(), event: 'GMICloseAttempt', details: `Attempting to close GMI ${this.instanceId}.` });
    if (this.workingMemory && typeof this.workingMemory.close === 'function') {
      try {
        await this.workingMemory.close();
        this.addTrace({ timestamp: new Date(), event: 'WorkingMemoryClosed', details: `Working memory for GMI ${this.instanceId} closed.` });
      } catch (error: any) {
        console.error(`GMI ${this.instanceId}: Error closing working memory: ${error.message}`);
        this.addTrace({ timestamp: new Date(), event: 'WorkingMemoryCloseFailed', details: error.message, data: error });
      }
    }
    // Any other resource cleanup (e.g., unsubscribing from event buses) would go here.
    this.isInitialized = false; // Mark as not initialized after closing.
    // console.log(`GMI ${this.instanceId} closed and resources released.`);
  }

  /**
   * Resets the ephemeral state for a new turn, primarily cost aggregator and reasoning trace.
   * Working memory and conversation context are persistent across turns within a session.
   * @private
   */
  private resetTurnState(): void {
    this.turnCostAggregator = { totalCostUSD: 0, calls: [] };
    this.reasoningTrace = []; // Clear trace for each new top-level turn stream.
  }

  /**
   * Applies a single persona state override to the GMI's working memory.
   * @private
   * @param {PersonaStateOverride} override - The override to apply.
   * @throws {GMIError} If working memory is not available.
   */
  private async applyPersonaStateOverride(override: PersonaStateOverride): Promise<void> {
    if (!this.workingMemory) {
      throw new GMIError('Cannot apply persona state override: working memory is not available.', 'WORKING_MEMORY_UNAVAILABLE');
    }
    if (override && typeof override.key === 'string') {
        await this.workingMemory.set(override.key, override.value);
        this.addTrace({
            timestamp: new Date(), event: 'PersonaStateOverrideApplied',
            details: `Applied override: Key='${override.key}', Value type='${typeof override.value}'.`,
            data: { key: override.key, valuePreview: JSON.stringify(override.value).substring(0, 50) + '...' }
        });
    } else {
        console.warn(`GMI ${this.instanceId}: Invalid persona state override object received.`, override)
    }
  }

  /**
   * Selects the most appropriate LLM provider and model for a given task.
   * Considers persona preferences, user API keys, subscription tiers, model routing, and input overrides.
   * @private
   * @param {IPersonaDefinition} persona - The active persona definition.
   * @param {string} taskHint - A hint about the current task.
   * @param {string} userId - The ID of the user.
   * @param {Record<string, string>} [userApiKeys] - User-provided API keys.
   * @param {ModelSelectionOverrides} [overrides] - Explicit model selection overrides from input.
   * @returns {Promise<{ provider: IProvider; modelId: string; modelInfo: ModelInfo }>} Selected provider, model ID, and model info.
   * @throws {GMIError} If no suitable model or provider can be determined.
   */
  private async _selectModelForTask(
    persona: IPersonaDefinition,
    taskHint: string,
    userId: string,
    userApiKeys?: Record<string, string>,
    overrides?: ModelSelectionOverrides,
  ): Promise<{ provider: IProvider; modelId: string; modelInfo: ModelInfo }> {
    this.addTrace({ timestamp: new Date(), event: 'ModelSelectionStart', details: `Initiating model selection for task: ${taskHint}`, data: { personaId: persona.id, userId, overrides } });

    let targetModelId: string | undefined = overrides?.preferredModelId;
    let targetProviderId: string | undefined = overrides?.preferredProviderId;
    let selectionReason = "Initial override check";

    const availableModels = await this.providerManager.listAllAvailableModels();
    if (availableModels.length === 0) {
        throw new GMIError('No AI models available from any provider. Cannot select model.', 'NO_MODELS_AVAILABLE');
    }
    const userTier = await this.subscriptionService.getUserSubscriptionTier(userId);
    const userEnabledProviders = this.authService.getEnabledProvidersForUser(userId, userApiKeys); // Provider IDs user has keys for or system allows without keys

    // Step 1: Explicit override from input (highest precedence)
    if (targetModelId && targetProviderId) {
      selectionReason = `Explicit override from input: Use ${targetModelId} on ${targetProviderId}.`;
      this.addTrace({ timestamp: new Date(), event: 'ModelSelectionDebug', details: selectionReason });
    } else {
      // Step 2: Consult Persona's modelTargetPreferences
      const personaPreference = persona.modelTargetPreferences?.find(p => p.taskHint === taskHint || p.taskHint === '*');
      if (personaPreference) {
        targetModelId = personaPreference.modelId || targetModelId; // Override can still take precedence if only one part specified
        targetProviderId = personaPreference.providerId || targetProviderId;
        selectionReason = `Persona preference for task '${taskHint}': Model '${targetModelId || 'any'}', Provider '${targetProviderId || 'any'}'`;
        this.addTrace({ timestamp: new Date(), event: 'ModelSelectionDebug', details: selectionReason, data: personaPreference });

        // If persona specifies allowedModelIds, filter available models
        if (personaPreference.allowedModelIds && personaPreference.allowedModelIds.length > 0) {
            // This filtering should ideally happen when considering specific models, not just setting targetModelId generally
        }
      }

      // Step 3: Prioritize models from providers the user has enabled (e.g., via API key)
      if (userEnabledProviders.length > 0) {
        for (const userProviderId of userEnabledProviders) {
          const providerModels = availableModels.filter(m =>
            m.providerId === userProviderId &&
            (!userTier || m.minSubscriptionTierLevel === undefined || m.minSubscriptionTierLevel <= userTier.level) &&
            (!personaPreference?.allowedModelIds || personaPreference.allowedModelIds.includes(m.modelId)) &&
            this.checkModelCapabilities(m, overrides?.requiredCapabilities || personaPreference?.requiredCapabilities || [taskHint, 'general'])
          );

          let suitableModelInUserProvider: ModelInfo | undefined;
          if (targetModelId && targetProviderId === userProviderId) { // User wants specific model on this provider
            suitableModelInUserProvider = providerModels.find(m => m.modelId === targetModelId);
          } else if (targetProviderId === userProviderId && !targetModelId) { // User wants this provider, any suitable model
            suitableModelInUserProvider = this.findBestModelByCriteria(providerModels, personaPreference?.minQualityTier, persona.costSavingStrategy);
          } else if (!targetProviderId && !targetModelId) { // No provider/model specified yet, check if this user provider has a suitable model
             suitableModelInUserProvider = this.findBestModelByCriteria(providerModels, personaPreference?.minQualityTier, persona.costSavingStrategy);
          }


          if (suitableModelInUserProvider) {
            targetModelId = suitableModelInUserProvider.modelId;
            targetProviderId = suitableModelInUserProvider.providerId;
            selectionReason = `User-enabled provider '${userProviderId}' has suitable model '${targetModelId}'.`;
            this.addTrace({ timestamp: new Date(), event: 'ModelSelectionDebug', details: selectionReason, data: { model: targetModelId, provider: targetProviderId }});
            break; // Found a good match via user-enabled provider
          }
        }
      }

      // Step 4: Use Model Router if configured and no definitive choice, or if persona wants routing
      if (this.modelRouter && (persona.metaPrompts?.useLLMRouterForModelSelection || (!targetModelId || !targetProviderId))) {
        const criteria: ModelSelectionCriteria = {
          taskHint,
          personaId: persona.id,
          userId,
          userSubscriptionTierName: userTier?.id, // Pass tier name
          allowedModelIds: overrides?.allowedModelIds || personaPreference?.allowedModelIds,
          preferredModelIds: targetModelId ? [targetModelId] : (overrides?.modelFamily ? availableModels.filter(m=>this.isModelInFamily(m, overrides.modelFamily!)).map(m=>m.modelId) : undefined),
          preferredProviderIds: targetProviderId? [targetProviderId] : undefined,
          costSavingStrategy: overrides?.costSavingStrategy || persona.costSavingStrategy,
          requiredCapabilities: overrides?.requiredCapabilities || personaPreference?.requiredCapabilities || [taskHint, 'general'],
          userApiKeys, // Pass for router to consider providers user has keys for
        };
        this.addTrace({ timestamp: new Date(), event: 'ModelRouterConsultation', details: 'Consulting model router.', data: criteria });
        const routeDecision: ModelRouteDecision | null = await this.modelRouter.selectModel(criteria, availableModels);
        if (routeDecision) {
          targetModelId = routeDecision.modelId;
          targetProviderId = routeDecision.providerId;
          selectionReason = `Model Router: ${routeDecision.reasoning}`;
          this.addTrace({ timestamp: new Date(), event: 'ModelRouterDecision', details: selectionReason, data: routeDecision });
        } else {
          this.addTrace({ timestamp: new Date(), event: 'ModelRouterNoDecision', details: 'Model router did not return a decision. Proceeding with other heuristics.' });
        }
      }
    } // End of "else" for explicit override check

    // Step 5: Fallback to persona default or system default
    if (!targetModelId || !targetProviderId) {
      const defaultModelIdToConsider = overrides?.preferredModelId || persona.defaultModelId || this.providerManager.getDefaultProvider()?.defaultModelId;
      if (defaultModelIdToConsider) {
          const modelInfo = availableModels.find(m => m.modelId === defaultModelIdToConsider);
          if (modelInfo && (!userTier || modelInfo.minSubscriptionTierLevel === undefined || modelInfo.minSubscriptionTierLevel <= userTier.level)) {
              targetModelId = modelInfo.modelId;
              targetProviderId = modelInfo.providerId; // Provider ID comes from the found model's info
              selectionReason = `Fallback to default model: '${targetModelId}' on provider '${targetProviderId}'.`;
              this.addTrace({ timestamp: new Date(), event: 'ModelSelectionDebug', details: selectionReason });
          }
      }
    }

    // Step 6: Absolute fallback: pick any available model that meets minimum subscription tier and capabilities
    if (!targetModelId || !targetProviderId) {
      selectionReason = 'Absolute fallback: No specific preferences or defaults matched. Searching for any suitable model.';
      this.addTrace({ timestamp: new Date(), event: 'ModelSelectionDebug', details: selectionReason });
      const fallbackModels = availableModels.filter(m =>
        (!userTier || m.minSubscriptionTierLevel === undefined || m.minSubscriptionTierLevel <= userTier.level) &&
        this.checkModelCapabilities(m, overrides?.requiredCapabilities || persona.modelTargetPreferences?.find(p=>p.taskHint === taskHint || p.taskHint === '*')?.requiredCapabilities || [taskHint, 'general'])
      );

      if (fallbackModels.length > 0) {
        // Try to pick a reasonably good one, e.g., from default provider or balanced quality/cost
        const bestFallback = this.findBestModelByCriteria(fallbackModels, 'balanced', persona.costSavingStrategy) || fallbackModels[0];
        targetModelId = bestFallback.modelId;
        targetProviderId = bestFallback.providerId;
        selectionReason = `Absolute fallback selected: '${targetModelId}' on provider '${targetProviderId}'.`;
        this.addTrace({ timestamp: new Date(), event: 'ModelSelectionDebug', details: selectionReason, data: {model: targetModelId, provider: targetProviderId} });
      }
    }

    if (!targetModelId || !targetProviderId) {
      throw new GMIError(
        `Could not determine a suitable target model or provider for task '${taskHint}' after all selection steps. Last reason: ${selectionReason}`,
        'MODEL_SELECTION_FAILED_NO_MATCH',
        { taskHint, userId, availableModelsCount: availableModels.length, userTier: userTier?.id }
      );
    }

    const provider = this.providerManager.getProvider(targetProviderId);
    if (!provider) {
      throw new GMIError(
        `Provider '${targetProviderId}' for selected model '${targetModelId}' not found or not initialized.`,
        'PROVIDER_NOT_FOUND_FOR_MODEL',
        { targetProviderId, targetModelId }
      );
    }

    const modelInfo = await provider.getModelInfo(targetModelId); // Fetch fresh info for the chosen model
    if (!modelInfo) {
      throw new GMIError(
        `Model info for '${targetModelId}' on provider '${targetProviderId}' could not be retrieved. The model may not be available.`,
        'MODEL_INFO_NOT_FOUND',
        { targetModelId, targetProviderId }
      );
    }

    // Final check for subscription tier against the chosen model
    if (userTier && modelInfo.minSubscriptionTierLevel !== undefined && modelInfo.minSubscriptionTierLevel > userTier.level) {
        throw new GMIError(
            `Selected model '${targetModelId}' requires subscription tier level ${modelInfo.minSubscriptionTierLevel}, but user tier is ${userTier.level} ('${userTier.id}').`,
            'MODEL_SELECTION_TIER_MISMATCH',
            { modelId: targetModelId, requiredTierLevel: modelInfo.minSubscriptionTierLevel, userTierLevel: userTier.level, userTierId: userTier.id }
        );
    }


    this.addTrace({
      timestamp: new Date(), event: 'FinalModelSelected',
      details: `Final selected model: ${modelInfo.modelId} (Provider: ${provider.providerId}). Reason: ${selectionReason}`,
      data: { modelId: modelInfo.modelId, providerId: provider.providerId, modelCapabilities: modelInfo.capabilities, selectionReason }
    });
    return { provider, modelId: modelInfo.modelId, modelInfo };
  }

  /**
   * Helper to check if a model meets all required capabilities.
   * @param modelInfo The model to check.
   * @param requiredCapabilities Array of required capability strings.
   * @returns True if all capabilities are met, false otherwise.
   */
  private checkModelCapabilities(modelInfo: ModelInfo, requiredCapabilities?: string[]): boolean {
    if (!requiredCapabilities || requiredCapabilities.length === 0) return true; // No specific capabilities required
    if (!modelInfo.capabilities || modelInfo.capabilities.length === 0) return false; // Model has no listed capabilities, but some are required

    return requiredCapabilities.every(reqCap =>
        modelInfo.capabilities.some(modelCap => modelCap.toLowerCase() === reqCap.toLowerCase() || (reqCap === 'general' && modelInfo.capabilities.length > 0))
    );
  }

  /**
   * Helper to find the best model from a list based on quality and cost criteria.
   * @param models List of models to choose from.
   * @param qualityTier Preferred quality tier.
   * @param costStrategy Cost saving strategy.
   * @returns The best model found, or undefined.
   */
  private findBestModelByCriteria(models: ModelInfo[], qualityTier?: 'fastest' | 'balanced' | 'best', costStrategy?: IPersonaDefinition['costSavingStrategy']): ModelInfo | undefined {
    if (!models || models.length === 0) return undefined;

    // Simple heuristic:
    // 1. Filter by qualityTier if specified.
    // 2. Then sort by cost based on costStrategy.
    // This is a placeholder for more sophisticated selection logic.

    let candidates = [...models];
    if (qualityTier) {
        // This requires a way to map qualityTier to actual model properties or a predefined ranking.
        // For now, we'll assume a simple filtering if model names/IDs suggest tiers, or skip this.
    }

    if (costStrategy === 'always_cheapest') {
        candidates.sort((a, b) => (a.pricePer1MTokensInput || Infinity) - (b.pricePer1MTokensInput || Infinity));
    } else if (costStrategy === 'prioritize_quality') {
        // Requires a quality metric; for now, assume higher cost might correlate with higher quality (imperfect)
        candidates.sort((a, b) => (b.pricePer1MTokensInput || 0) - (a.pricePer1MTokensInput || 0)); // Higher cost first
    } else { // balance_quality_cost or user_preference (default to balanced for now)
        // A balanced approach might prefer models with moderate cost and good capabilities.
        // This is complex and would need more metrics. For now, take the first if no better sort.
    }
    return candidates[0];
  }

  /**
   * Helper to check if a model belongs to a given family.
   * @param modelInfo The model to check.
   * @param family The model family string (e.g., "gpt-4", "llama3").
   * @returns True if the model is considered part of the family.
   */
  private isModelInFamily(modelInfo: ModelInfo, family: string): boolean {
      if (!family) return false;
      // Simple check: modelId often contains the family name.
      // More robust checking might involve provider-specific metadata.
      return modelInfo.modelId.toLowerCase().includes(family.toLowerCase());
  }


  /**
   * Gathers all relevant prompt components for the LLM call.
   * @private
   */
  private async _gatherPromptComponents(
    persona: IPersonaDefinition,
    input: GMITurnInput,
    history: Message[],
    modelInfo: ModelInfo
  ): Promise<Partial<PromptEngineResult['prompt']>> { // Should be Partial<PromptComponents>
    this.addTrace({ timestamp: new Date(), event: 'PromptComponentGatheringStart', details: `Gathering components for persona ${persona.id} and model ${modelInfo.modelId}` });

    let systemPromptsArray: Array<{ content: string; priority?: number }> = [];
    if (typeof persona.baseSystemPrompt === 'string') {
      systemPromptsArray.push({ content: persona.baseSystemPrompt, priority: 0 });
    } else if (Array.isArray(persona.baseSystemPrompt)) {
      systemPromptsArray.push(...persona.baseSystemPrompt);
    } else if (persona.baseSystemPrompt && typeof persona.baseSystemPrompt === 'object' && 'template' in persona.baseSystemPrompt) {
      let template = persona.baseSystemPrompt.template;
      if (persona.baseSystemPrompt.variables) {
        for (const variable of persona.baseSystemPrompt.variables) {
          const value = await this.workingMemory.get<string>(variable) ?? persona.personalityTraits?.[variable] ?? '';
          template = template.replace(new RegExp(`{{${variable}}}`, 'g'), String(value));
        }
      }
      systemPromptsArray.push({ content: template, priority: 0 });
    } else {
      // Fallback system prompt if none is well-defined
      systemPromptsArray.push({ content: "You are a helpful AI assistant.", priority: 1000 }); // Low priority
      this.addTrace({ timestamp: new Date(), event: 'PromptWarning', details: 'No valid baseSystemPrompt in persona. Using default.', data: { personaId: persona.id } });
    }

    // Incorporate mood from working memory if applicable
    const currentMood = await this.workingMemory.get<string>('current_mood');
    if (currentMood && persona.moodAdaptation?.enabled && persona.moodAdaptation.moodPrompts?.[currentMood]) {
      systemPromptsArray.push({ content: persona.moodAdaptation.moodPrompts[currentMood], priority: 10 }); // Higher priority for dynamic mood
    }

    // Vision inputs (if model supports vision)
    const visionInputsForPrompt: VisionInputData[] = [];
    if (input.visionInputs && input.visionInputs.length > 0) {
      if (modelInfo.capabilities.includes('vision_input')) {
        for (const visInput of input.visionInputs) {
          try {
            if (visInput.type === 'url') new URL(visInput.data); // Basic URL validation
            visionInputsForPrompt.push(visInput);
          } catch (e: any) {
            this.addTrace({ timestamp: new Date(), event: 'PromptWarning', details: `Invalid image URL skipped: ${visInput.data}`, data: { error: e.message } });
          }
        }
      } else {
        this.addTrace({ timestamp: new Date(), event: 'PromptWarning', details: `Vision inputs provided but model ${modelInfo.modelId} does not support vision. Inputs ignored.` });
      }
    }

    // Prepare tool schemas for the prompt if model supports tool use
    let toolSchemasForPrompt: ITool[] | undefined;
    if (modelInfo.capabilities.includes('tool_use')) {
      const allRegisteredTools = await this.toolExecutor.getAvailableTools();
      const personaToolSet = new Map<string, ITool>();

      // 1. Add tools embedded directly in the persona definition
      persona.embeddedTools?.forEach(tool => personaToolSet.set(tool.id, tool));

      // 2. Add tools referenced by ID in the persona definition
      persona.toolIds?.forEach(toolId => {
        if (!personaToolSet.has(toolId)) {
          const foundTool = allRegisteredTools.find(t => t.id === toolId);
          if (foundTool) {
            personaToolSet.set(toolId, foundTool);
          } else {
            this.addTrace({ timestamp: new Date(), event: 'PromptWarning', details: `Persona '${persona.id}' references unknown tool ID: ${toolId}. Skipping.` });
          }
        }
      });

      // 3. Filter tools based on persona's allowedCapabilities and user's permissions (via ToolPermissionManager)
      toolSchemasForPrompt = Array.from(personaToolSet.values()).filter(tool =>
        this.toolExecutor.toolPermissionManager.canExecuteTool(persona.allowedCapabilities || [], input.userId, tool.id)
      );
      if (toolSchemasForPrompt.length === 0) toolSchemasForPrompt = undefined;
      this.addTrace({ timestamp: new Date(), event: 'ToolsPreparedForPrompt', details: `Prepared ${toolSchemasForPrompt?.length || 0} tools for prompt.`, data: { toolIds: toolSchemasForPrompt?.map(t => t.id) } });
    }

    // Assemble prompt components for the PromptEngine
    const components: Partial<ConstructorParameters<typeof PromptEngine>[0]> = { // This should be Partial<PromptComponents>
      systemPrompts: systemPromptsArray.sort((a,b) => (a.priority ?? 0) - (b.priority ?? 0)), // Sort by priority
      conversationHistory: history,
      userInput: input.textInput, // Text input is primary content for user message
      tools: toolSchemasForPrompt, // Pass ITool instances
      vision_inputs: visionInputsForPrompt.length > 0 ? visionInputsForPrompt : undefined,
      // audio_input: input.audioInput, // Audio is usually transcribed first or handled by a specific tool
      // retrievedContext from RAG would be populated here if RAG is used before prompt construction
      // taskSpecificData for more nuanced prompting
    };
    this.addTrace({ timestamp: new Date(), event: 'PromptComponentsGathered', details: 'Prompt components assembled.', data: { systemPromptCount: components.systemPrompts?.length, historyLength: components.conversationHistory?.length, toolCount: components.tools?.length } });
    // Type casting because PromptEngine constructor expects PromptComponents, not FormattedPrompt.
    return components as unknown as Partial<FormattedPrompt>;
  }

  /**
   * Handles potential issues from prompt construction.
   * @private
   */
  private handlePromptIssues(promptResult: PromptEngineResult, streamId: string, personaId: string): void {
    if (promptResult.issues && promptResult.issues.length > 0) {
      promptResult.issues.forEach(issue => {
        if (issue.type === 'error') {
          throw new GMIError(`Prompt construction critical error: ${issue.message}`, 'PROMPT_CONSTRUCTION_ERROR', issue);
        }
        // For warnings, add to trace and potentially yield a SystemProgress chunk
        this.addTrace({ timestamp: new Date(), event: 'PromptWarning', details: `Prompt construction warning: ${issue.message}`, data: issue });
        console.warn(`GMI ${this.instanceId} (Stream: ${streamId}, Persona: ${personaId}): Prompt warning: ${issue.message}`);
        // Optionally: yield { type: 'SystemProgress', streamId, ..., message: `Prompt Warning: ${issue.message}`, statusCode: 'PROMPT_WARNING' }
      });
    }
    if (promptResult.wasTruncatedOrSummarized) {
      this.addTrace({ timestamp: new Date(), event: 'PromptModified', details: 'Prompt was truncated or summarized to fit token limits.', data: promptResult.modificationDetails });
    }
    this.addTrace({ timestamp: new Date(), event: 'PromptConstructed', details: `Final prompt constructed for model. Estimated/Actual Tokens: ${promptResult.tokenCount || promptResult.estimatedTokenCount}`, data: { tokenCount: promptResult.tokenCount, wasModified: promptResult.wasTruncatedOrSummarized } });
  }

  /**
   * Makes a streaming call to an LLM provider.
   * @private
   */
  private _callLLMStream(
    provider: IProvider,
    modelId: string,
    messages: FormattedPrompt, // This should be the type PromptEngine expects
    options: ModelCompletionOptions
  ): AsyncGenerator<ModelCompletionResponse, any, undefined> {
    this.addTrace({
      timestamp: new Date(), event: 'LLMCallStreamStart',
      details: `Streaming from model ${modelId} on provider ${provider.providerId}.`,
      data: { modelId, providerId: provider.providerId, options: {...options, tools: options.tools?.length}, messagesPreview: JSON.stringify(messages).substring(0, 200) + '...' }
    });
    // Type assertion for messages, assuming PromptEngine output matches ChatMessage[] or compatible.
    return provider.generateCompletionStream(modelId, messages as ChatMessage[], options);
  }

  /**
   * Makes a non-streaming call to an LLM provider.
   * @private
   */
  private async _callLLM(
    provider: IProvider,
    modelId: string,
    messages: FormattedPrompt,
    options: ModelCompletionOptions
  ): Promise<ModelCompletionResponse> {
    this.addTrace({
      timestamp: new Date(), event: 'LLMCallStart_NonStream',
      details: `Calling model ${modelId} (non-stream) on provider ${provider.providerId}.`,
      data: { modelId, providerId: provider.providerId, options: {...options, tools: options.tools?.length}, messagesPreview: JSON.stringify(messages).substring(0, 200) + '...' }
    });
    try {
      // Type assertion for messages
      const response = await provider.generateCompletion(modelId, messages as ChatMessage[], options);
      if (response.error) {
        this.addTrace({ timestamp: new Date(), event: 'LLMCallError_NonStream', details: `Error from ${modelId}: ${response.error.message}`, data: response.error });
        throw new GMIError(`LLM call failed: ${response.error.message}`, 'LLM_NON_STREAM_ERROR', response.error);
      }
      this.addTrace({ timestamp: new Date(), event: 'LLMCallEnd_NonStream', details: `Response from ${modelId}.`, data: { usage: response.usage, choiceCount: response.choices.length } });
      return response;
    } catch (e: any) {
      const error = (e instanceof GMIError) ? e : new GMIError(e.message, 'LLM_NON_STREAM_CALL_EXCEPTION', e);
      this.addTrace({ timestamp: new Date(), event: 'LLMCallFailed_NonStream', details: `LLM call to ${modelId} failed: ${error.message}`, data: { error: error.message, code: error.code } });
      throw error;
    }
  }


  /**
   * Parses the LLM response, extracting text and tool calls.
   * Handles parsing of arguments for tool calls from JSON string to object.
   * @private
   */
  private _parseLLMResponse(
    response: ModelCompletionResponse | null,
    streamedTextAccumulator: string, // Text accumulated from *this specific stream segment*
    streamedToolCallDeltas: AccumulatedToolCallDelta[], // Tools accumulated from *this specific stream segment*
    persona: IPersonaDefinition
  ): { responseText: string | null; toolCalls: ToolCall[] | undefined } {
    let finalResponseText = streamedTextAccumulator; // Start with what we got from text deltas

    // If the final response object (last chunk) has full content, it might be more reliable than accumulated deltas
    // especially if the LLM provider sends full content in the last message of a stream.
    if (response?.choices?.[0]?.message?.content && response.choices[0].message.content.length > streamedTextAccumulator.length) {
      finalResponseText = response.choices[0].message.content;
    }

    let finalToolCalls: ToolCall[] = [];

    // Option 1: Process fully formed tool calls from the last ModelCompletionResponse object (if provider sends them complete at the end)
    if (response?.choices?.[0]?.message?.tool_calls && response.choices[0].message.tool_calls.length > 0) {
      response.choices[0].message.tool_calls.forEach(tc => {
        if (this.isToolAllowedByPersona(tc.function.name, persona)) {
          try {
            finalToolCalls.push({
              id: tc.id,
              type: 'function',
              function: {
                name: tc.function.name,
                arguments: JSON.parse(tc.function.arguments || '{}'), // Parse arguments string here
              },
            });
          } catch (e: any) {
            this.addTrace({
              timestamp: new Date(), event: 'ToolCallArgumentParseError',
              details: `Failed to parse JSON arguments for tool call '${tc.function.name}' from full response. Args: "${tc.function.arguments}"`,
              data: { toolName: tc.function.name, arguments: tc.function.arguments, error: e.message },
            });
          }
        } else {
          this.addTrace({ timestamp: new Date(), event: 'UnauthorizedToolCallAttempt', details: `LLM attempted to call unauthorized tool (from full response): ${tc.function.name}`, data: { toolName: tc.function.name } });
        }
      });
    }
    // Option 2: If no tool_calls in the final response object, or to supplement, process deltas
    // This handles cases where the provider *only* gives tool calls via deltas.
    // We need to be careful not to duplicate if both are present and represent the same calls.
    // A common pattern is that `tool_calls` in the final message is the aggregation of deltas.
    // If `finalToolCalls` is already populated from `response.choices[0].message.tool_calls`,
    // we assume it's the definitive list and might skip delta processing here, or use deltas as a fallback.
    // For robustness, let's process deltas if the main `tool_calls` array was empty.
    else if (streamedToolCallDeltas.length > 0) {
      for (const delta of streamedToolCallDeltas) {
        if (this.isToolAllowedByPersona(delta.name, persona)) {
          try {
            finalToolCalls.push({
              id: delta.id,
              type: 'function',
              function: {
                name: delta.name,
                arguments: JSON.parse(delta.argumentsBuffer || '{}'),
              },
            });
          } catch (e: any) {
            this.addTrace({
              timestamp: new Date(), event: 'ToolCallArgumentParseError',
              details: `Failed to parse JSON arguments for tool call '${delta.name}' from streamed deltas. Args: "${delta.argumentsBuffer}"`,
              data: { toolName: delta.name, argumentsBuffer: delta.argumentsBuffer, error: e.message },
            });
          }
        } else {
          this.addTrace({ timestamp: new Date(), event: 'UnauthorizedToolCallAttempt', details: `LLM attempted to call unauthorized tool (from streamed deltas): ${delta.name}`, data: { toolName: delta.name } });
        }
      }
    }

    return {
      responseText: finalResponseText || null, // Ensure null if empty string
      toolCalls: finalToolCalls.length > 0 ? finalToolCalls : undefined,
    };
  }

  /**
   * Checks if a tool is allowed by the current persona's configuration.
   * @param toolName The name/ID of the tool.
   * @param persona The active persona definition.
   * @returns True if the tool is allowed, false otherwise.
   */
  private isToolAllowedByPersona(toolName: string, persona: IPersonaDefinition): boolean {
    // Check embedded tools by ID
    if (persona.embeddedTools?.some(et => et.id === toolName)) {
      return true;
    }
    // Check referenced tool IDs
    if (persona.toolIds?.includes(toolName)) {
      return true;
    }
    // Check allowed capabilities (can be prefixes or full names)
    if (persona.allowedCapabilities?.some(cap => toolName.startsWith(cap) || toolName === cap)) {
      return true;
    }
    return false;
  }


  /**
   * Aggregates usage data from an LLM call into the turn's total.
   * @private
   */
  private aggregateUsage(usage: ModelUsage, modelId: string, providerId: string): void {
    this.turnCostAggregator.totalCostUSD += usage.costUSD || 0;
    const existingCall = this.turnCostAggregator.calls.find(c => c.modelId === modelId && c.providerId === providerId);
    if (existingCall) {
      existingCall.usage.promptTokens = (existingCall.usage.promptTokens || 0) + (usage.promptTokens || 0);
      existingCall.usage.completionTokens = (existingCall.usage.completionTokens || 0) + (usage.completionTokens || 0);
      existingCall.usage.totalTokens = (existingCall.usage.totalTokens || 0) + (usage.totalTokens || 0);
      existingCall.usage.costUSD = (existingCall.usage.costUSD || 0) + (usage.costUSD || 0);
    } else {
      this.turnCostAggregator.calls.push({ modelId, providerId, usage: { ...usage } });
    }
    // Add trace for significant usage accumulation if needed, or rely on overall turn summary
  }

  /**
   * Adds an event to the GMI's internal reasoning trace for the current turn.
   * @private
   * @param {Omit<ReasoningTrace, 'sequence'>} event - The trace event details, sequence number will be added automatically.
   */
  private addTrace(event: Omit<ReasoningTrace, 'sequence'>): void {
    this.reasoningTrace.push({ ...event, sequence: this.reasoningTrace.length + 1 });
  }

  /**
   * Constructs the user message content, prioritizing textInput but allowing for structured content later.
   * @private
   */
  private constructUserMessageContent(input: GMITurnInput): MessageContent | null {
    // For now, simple text input. Future: could be structured if vision/audio content needs to be part of the main message.
    // For OpenAI like vision, `vision_inputs` are handled separately and added to the ChatMessage.
    // So, `content` here is primarily for text.
    if (input.textInput) {
        return input.textInput;
    }
    // If there are vision inputs but no text, some models expect a null or empty string content
    // alongside the vision parts. This depends on the specific model provider's API.
    // The PromptEngine and Provider implementation should handle the correct formatting.
    // For GMI's context, if there's no text, content can be null.
    if (input.visionInputs && input.visionInputs.length > 0) {
        return null; // Or an empty string "" if the model API prefers that for multimodal messages without text.
    }
    return null;
  }

}