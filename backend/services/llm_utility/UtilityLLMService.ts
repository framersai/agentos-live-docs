// File: backend/services/llm_utility/UtilityLLMService.ts
/**
 * @fileoverview Provides a service for general-purpose LLM utility tasks,
 * leveraging the AIModelProviderManager and IPromptEngine. This service
 * facilitates direct interactions with LLMs for tasks like on-demand prompting
 * and text summarization, abstracting the complexities of provider selection,
 * prompt construction, and response handling.
 * @module backend/services/llm_utility/UtilityLLMService
 */

import {
  IProvider,
  ModelCompletionOptions,
  ModelCompletionResponse,
  ModelUsage,
  ChatMessage,
  MessageContent,
  MessageContentPart,
  ModelInfo as ProviderModelInfo
} from '../../agentos/core/llm/providers/IProvider';
import {
  AIModelProviderManager,
} from '../../agentos/core/llm/providers/AIModelProviderManager';
import {
  IPromptEngine,
  PromptComponents,
  ModelTargetInfo,
  PromptEngineConfig,
  FormattedPrompt,
  PromptTemplateFunction,
  ContextualElementType,
  PromptEngineError
} from '../../agentos/core/llm/IPromptEngine';
import { PromptEngine } from '../../agentos/core/llm/PromptEngine';
import { GMIError, GMIErrorCode, createGMIErrorFromError } from '../../utils/errors';

/**
 * Defines the structure for a direct prompt execution request.
 * This allows for straightforward, ad-hoc interactions with an LLM.
 * @interface DirectPromptRequest
 */
export interface DirectPromptRequest {
  /** The main prompt text. For chat models, this is typically the user's message. */
  prompt: string;
  /** An optional system prompt to provide context or instructions to the LLM. */
  systemPrompt?: string;
  /** Optional ID of the preferred LLM model to use. */
  modelId?: string;
  /** Optional ID of the preferred LLM provider. */
  providerId?: string;
  /**
   * A hint about the nature of the task (e.g., "summarization", "code_generation").
   * This can assist in selecting an appropriate model or prompt template.
   */
  taskHint?: string;
  /** Specific options to control the LLM's generation process (e.g., temperature, maxTokens). */
  completionOptions?: Partial<ModelCompletionOptions>;
  /** Flag to indicate whether the response should be streamed. */
  stream?: boolean;
}

/**
 * Defines the structure for a text summarization task request.
 * @interface SummarizationTaskRequest
 */
export interface SummarizationTaskRequest {
  /** The input text that needs to be summarized. */
  textToSummarize: string;
  /**
   * Desired length of the summary. Can be a qualitative preset ('short', 'medium', 'long')
   * or a specific target number of tokens.
   */
  desiredLength?: 'short' | 'medium' | 'long' | number;
  /** Preferred output format for the summary (e.g., a single paragraph or bullet points). */
  outputFormat?: 'paragraph' | 'bullet_points';
  /** Optional ID of the preferred LLM model for the summarization task. */
  modelId?: string;
  /** Optional ID of the preferred LLM provider for the summarization task. */
  providerId?: string;
  /** Custom completion options specifically for the summarization task. */
  completionOptions?: Partial<ModelCompletionOptions>;
  /** Flag to indicate whether the summarized output should be streamed. */
  stream?: boolean;
}

/**
 * Defines the standard output structure for operations performed by the UtilityLLMService.
 * @interface UtilityLLMServiceOutput
 */
export interface UtilityLLMServiceOutput {
  /**
   * The generated text response from the LLM.
   * This will be `null` if an error occurred or if the LLM did not produce a text response.
   */
  responseText: string | null;
  /** Token usage statistics for the LLM interaction (prompt, completion, total, and estimated cost). */
  usage?: ModelUsage;
  /** An error message if the operation encountered a problem. */
  error?: string;
  /** For streaming responses, indicates if this is the final chunk of the response. */
  isFinal?: boolean;
  /** The unique identifier of the LLM provider that handled the request. */
  providerId?: string;
  /** The unique identifier of the LLM model that was used for the request. */
  modelIdUsed?: string;
}

/**
 * @class UtilityLLMService
 * @description Provides a suite of utility LLM functionalities, such as direct prompting
 * and text summarization. It orchestrates model selection through `AIModelProviderManager`
 * and prompt construction via `IPromptEngine`.
 */
export class UtilityLLMService {
  private readonly providerManager: AIModelProviderManager;
  private readonly promptEngine: IPromptEngine;

  /**
   * Constructs an instance of UtilityLLMService.
   * @param {AIModelProviderManager} providerManager An initialized instance of `AIModelProviderManager`
   * for accessing LLM providers.
   * @param {IPromptEngine} [promptEngine] Optional. A custom instance of `IPromptEngine`. If not provided,
   * a default `PromptEngine` will be instantiated and configured.
   */
  constructor(providerManager: AIModelProviderManager, promptEngine?: IPromptEngine) {
    this.providerManager = providerManager;

    // Define a simple, functional default prompt template.
    const defaultUtilityTemplate: PromptTemplateFunction = async (
      components: Readonly<PromptComponents>,
      modelInfo: Readonly<ModelTargetInfo>,
      selectedContextualElements: ReadonlyArray<any>, 
      config: Readonly<PromptEngineConfig>,
      estimateTokenCountFn: (content: string, modelId?: string) => Promise<number>
    ): Promise<ChatMessage[]> => {
      const messages: ChatMessage[] = [];
      let systemContent = "";

      if (components.systemPrompts && components.systemPrompts.length > 0) {
        systemContent = components.systemPrompts.map(sp => sp.content).join('\n');
      }

      selectedContextualElements.forEach(element => {
        // Assuming ContextualPromptElement has 'type' and 'content'
        if (element.type === ContextualElementType.SYSTEM_INSTRUCTION_ADDON && typeof element.content === 'string') {
          systemContent += `\n${element.content}`;
        }
      });

      if (systemContent.trim()) {
        messages.push({ role: 'system', content: systemContent.trim(), name: 'system_instructions' });
      }

      if (components.conversationHistory) {
        // Map ConversationMessage (from IPromptEngine) to ChatMessage (from IProvider)
        const historyChatMessages: ChatMessage[] = components.conversationHistory.map(convMsg => {
            // Basic mapping, assuming ConversationMessage.role is compatible or mappable
            // to ChatMessage.role values. ConversationMessage.content might also need transformation.
            let mappedRole: ChatMessage['role'];
            switch (convMsg.role) {
                case 'user': mappedRole = 'user'; break;
                case 'assistant': mappedRole = 'assistant'; break;
                case 'system': mappedRole = 'system'; break;
                case 'tool': mappedRole = 'tool'; break;
                default:
                    // Decide how to handle other MessageRole types, e.g., skip or map to a default
                    console.warn(`UtilityLLMService Default Template: Unhandled MessageRole '${convMsg.role}' in history. Skipping.`);
                    return null; // Skip this message
            }
            if(mappedRole) {
                return {
                    role: mappedRole,
                    content: typeof convMsg.content === 'string' ? convMsg.content : JSON.stringify(convMsg.content), // Simplistic content handling
                    name: convMsg.name,
                    tool_calls: convMsg.tool_calls as ChatMessage['tool_calls'], // Assuming structure is compatible or castable
                    tool_call_id: convMsg.tool_call_id,
                };
            }
            return null;
        }).filter(msg => msg !== null) as ChatMessage[];
        messages.push(...historyChatMessages);
      }

      if (components.userInput) {
        messages.push({ role: 'user', content: components.userInput });
      } else if (messages.length === 0 || (messages.length > 0 && messages[messages.length -1].role !== 'user')) {
        // Ensure there's at least a minimal user prompt if nothing else is provided.
        messages.push({ role: 'user', content: "Please proceed with the task." });
      }
      return messages;
    };

    const defaultConfig: PromptEngineConfig = {
        defaultTemplateName: 'defaultUtilityTemplate',
        availableTemplates: {
            'defaultUtilityTemplate': defaultUtilityTemplate,
        },
        tokenCounting: { strategy: 'estimated', estimationModel: 'generic' },
        historyManagement: {
            defaultMaxMessages: 10, // Increased default
            maxTokensForHistory: 2048, // Increased default
            summarizationTriggerRatio: 0.7,
            preserveImportantMessages: true,
        },
        contextManagement: {
            maxRAGContextTokens: 2048, // Increased default
            summarizationQualityTier: 'balanced',
            preserveSourceAttributionInSummary: true,
        },
        contextualElementSelection: {
            defaultMaxElementsPerType: 3, // Increased default
            priorityResolutionStrategy: 'highest_first',
            conflictResolutionStrategy: 'skip_conflicting',
            maxElementsPerType: {
                [ContextualElementType.FEW_SHOT_EXAMPLE]: 5,
                [ContextualElementType.SYSTEM_INSTRUCTION_ADDON]: 5,
            },
        },
        performance: { enableCaching: false, cacheTimeoutSeconds: 300 },
        debugging: { logConstructionSteps: false, includeDebugMetadataInResult: false },
    };

    this.promptEngine = promptEngine || new PromptEngine();
    if (this.promptEngine instanceof PromptEngine && !(this.promptEngine as any)._initialized && typeof this.promptEngine.initialize === 'function') {
        this.promptEngine.initialize(defaultConfig)
            .catch(err => {
                const initError = createGMIErrorFromError(err, GMIErrorCode.INITIALIZATION_ERROR, { component: 'PromptEngine' }, "UtilityLLMService: Critical error initializing default PromptEngine");
                console.error(initError.message, initError.details);
            });
    }
    console.log("UtilityLLMService initialized.");
  }

  /**
   * Selects an appropriate LLM provider and a specific model based on given preferences and task hints.
   * It prioritizes explicit provider/model IDs, then falls back to task-based heuristics and defaults.
   * @param {string} [preferredProviderId] - Optional. The preferred provider ID.
   * @param {string} [preferredModelId] - Optional. The preferred model ID.
   * @param {string} [taskHint='general_utility'] - A hint about the task to help select a suitable model.
   * @returns {Promise<{ provider: IProvider; model: ProviderModelInfo }>} An object containing the selected provider and model information.
   * @throws {GMIError} If no suitable provider or model can be determined.
   * @private
   */
  private async _selectProviderAndModel(
    preferredProviderId?: string,
    preferredModelId?: string,
    taskHint: string = 'general_utility'
  ): Promise<{ provider: IProvider; model: ProviderModelInfo }> {
    let provider: IProvider | undefined;
    let model: ProviderModelInfo | undefined;

    if (preferredProviderId && preferredModelId) {
      provider = this.providerManager.getProvider(preferredProviderId);
      if (provider) {
        model = await provider.getModelInfo(preferredModelId).catch(() => undefined);
      }
    } else if (preferredModelId) {
      if (preferredModelId.includes('/')) {
        const [pId] = preferredModelId.split('/');
        provider = this.providerManager.getProvider(pId);
      }
      if (!provider) {
         provider = this.providerManager.getProviderForModel(preferredModelId);
      }
      if (provider) {
        model = await provider.getModelInfo(preferredModelId).catch(() => undefined);
      }
    } else if (preferredProviderId) {
      provider = this.providerManager.getProvider(preferredProviderId);
      if (provider) {
        const models = await provider.listAvailableModels({ capability: taskHint }).catch(() => []);
        model = models.find(m => m.isDefaultModel) || models[0];
        if (!model && provider.defaultModelId) {
            model = await provider.getModelInfo(provider.defaultModelId).catch(() => undefined);
        }
      }
    }

    if (!provider || !model) {
      const allModels = await this.providerManager.listAllAvailableModels().catch(() => []);
      if (allModels.length === 0) {
        throw new GMIError(
            'No models available from any configured provider.',
            GMIErrorCode.CONFIGURATION_ERROR,
            { hint: 'Check provider configurations and ensure models are accessible and providers are initialized.' }
        );
      }

      let suitableModel = allModels.find(m =>
        m.capabilities.includes(taskHint.split('_')[0]) ||
        (taskHint.includes("summarization") && (m.modelId.includes("haiku") || m.modelId.includes("opus") || m.modelId.includes("sonnet") || m.modelId.includes("turbo"))) ||
        (m.modelId.includes("llama3") && m.modelId.includes("8b"))
      );
      suitableModel = suitableModel || allModels.find(m => m.providerId === this.providerManager.getDefaultProvider()?.providerId && m.isDefaultModel);
      suitableModel = suitableModel || allModels.find(m => m.isDefaultModel);
      model = suitableModel || allModels[0];
      provider = this.providerManager.getProvider(model.providerId);
    }

    if (!provider) {
      throw new GMIError(
          'UtilityLLMService: No suitable LLM provider could be determined or initialized for the selected model.',
          GMIErrorCode.RESOURCE_NOT_FOUND,
          { resourceType: 'LLMProvider', modelIdAttempted: model?.modelId }
      );
    }
    if (!model) {
      throw new GMIError(
          `UtilityLLMService: No specific model could be determined for provider ${provider.providerId}.`,
          GMIErrorCode.LLM_MODEL_NOT_FOUND,
          { providerId: provider.providerId }
      );
    }

    return { provider, model };
  }

  /**
   * Constructs a `ModelTargetInfo` object from `ProviderModelInfo` and `IProvider`.
   * This object is used by the `IPromptEngine` to tailor prompt construction.
   * @param {ProviderModelInfo} model - The detailed information about the selected LLM model.
   * @param {IProvider} provider - The instance of the LLM provider for this model.
   * @returns {ModelTargetInfo} The constructed model target information.
   * @private
   */
  private _createModelTargetInfo(model: ProviderModelInfo, provider: IProvider): ModelTargetInfo {
    let promptFormatType: ModelTargetInfo['promptFormatType'] = 'custom';
    const lowerProviderId = provider.providerId.toLowerCase();

    if (lowerProviderId.includes('openai')) {
      promptFormatType = 'openai_chat';
    } else if (lowerProviderId.includes('anthropic')) {
      promptFormatType = 'anthropic_messages';
    } else if (lowerProviderId.includes('google') || lowerProviderId.includes('gemini')) {
      promptFormatType = 'custom'; // Google's specific format might require a custom template
    } else if (model.capabilities.includes('chat')) {
      promptFormatType = 'openai_chat'; // Defaulting to OpenAI chat for generic chat models
    } else if (model.capabilities.includes('completion')) {
      promptFormatType = 'generic_completion';
    }

    const hasToolUseCapability = model.capabilities.includes('tool_use');
    let toolFormat: ModelTargetInfo['toolSupport']['format'] = 'custom';
    if (lowerProviderId.includes('openai') && hasToolUseCapability) {
        toolFormat = 'openai_functions';
    } else if (lowerProviderId.includes('anthropic') && hasToolUseCapability) {
        toolFormat = 'anthropic_tools';
    }  else if ((lowerProviderId.includes('google') || lowerProviderId.includes('gemini')) && hasToolUseCapability) {
        toolFormat = 'google_tools'; // Example for Google
    }

    return {
      modelId: model.modelId,
      providerId: model.providerId,
      maxContextTokens: model.contextWindowSize || model.inputTokenLimit || 8192,
      capabilities: [...model.capabilities],
      promptFormatType,
      toolSupport: {
        supported: hasToolUseCapability,
        format: toolFormat,
      },
      visionSupport: {
        supported: model.capabilities.includes('vision_input'),
      },
    };
  }

  /**
   * Prepares an array of `ChatMessage` objects from a `FormattedPrompt` structure,
   * suitable for passing to an `IProvider`'s generation methods.
   * @param {FormattedPrompt} formattedPrompt - The prompt structure from `IPromptEngine`.
   * @param {ModelTargetInfo} modelTargetInfo - Information about the target model, used for context.
   * @returns {ChatMessage[]} An array of chat messages.
   * @throws {GMIError} If the `FormattedPrompt` cannot be converted to `ChatMessage[]`.
   * @private
   */
  private _prepareMessagesForProvider(formattedPrompt: FormattedPrompt, modelTargetInfo: ModelTargetInfo): ChatMessage[] {
    if (Array.isArray(formattedPrompt)) {
      // Ensure all elements are valid ChatMessage (especially role)
      return formattedPrompt.map(fm => ({
          role: fm.role, // Assuming FormattedPrompt elements have compatible roles
          content: fm.content,
          name: fm.name,
          tool_calls: fm.tool_calls,
          tool_call_id: fm.tool_call_id,
      } as ChatMessage));
    }
    if (typeof formattedPrompt === 'string') {
      return [{ role: 'user', content: formattedPrompt }];
    }
    if (typeof formattedPrompt === 'object' && formattedPrompt !== null && 'messages' in formattedPrompt && Array.isArray(formattedPrompt.messages)) {
      const messages = (formattedPrompt.messages as any[]).map(fm => ({
          role: fm.role,
          content: fm.content,
          name: fm.name,
          tool_calls: fm.tool_calls,
          tool_call_id: fm.tool_call_id,
      } as ChatMessage));

      if (formattedPrompt.system && typeof formattedPrompt.system === 'string' && !messages.some(m => m.role === 'system')) {
          return [{role: 'system', content: formattedPrompt.system }, ...messages];
      }
      return messages;
    }

    console.warn("UtilityLLMService: Could not convert FormattedPrompt to ChatMessage[]. This indicates a mismatch between PromptEngine output and provider expectations.", { formattedPromptType: typeof formattedPrompt, modelTargetInfo });
    throw new GMIError(
        "Invalid prompt format from PromptEngine for the target provider. Expected ChatMessage[], a string, or a compatible object.",
        GMIErrorCode.INTERNAL_SERVER_ERROR,
        { promptFormatReceived: typeof formattedPrompt, targetModelId: modelTargetInfo.modelId }
    );
  }

  /**
   * Extracts and concatenates text content from a `MessageContent` object.
   * If `MessageContent` is an array of `MessageContentPart`, only 'text' parts are joined.
   * @param {MessageContent | null | undefined} content - The message content to process.
   * @returns {string | null} The extracted text, or null if no text content is found.
   * @private
   */
  private _extractTextFromMessageContent(content: MessageContent | null | undefined): string | null {
    if (content === null || content === undefined) return null;
    if (typeof content === 'string') return content;

    if (Array.isArray(content)) {
      const textParts = content
        .filter((part): part is Extract<MessageContentPart, { type: 'text' }> => part.type === 'text')
        .map(part => part.text);
      return textParts.length > 0 ? textParts.join('') : null;
    }
    return null;
  }

  /**
   * Processes a direct prompt request and returns a single, non-streamed response.
   * @param {DirectPromptRequest} request - The request object containing prompt details and options.
   * @returns {Promise<UtilityLLMServiceOutput>} The LLM's response or an error object.
   * @public
   */
  public async processDirectPrompt(request: DirectPromptRequest): Promise<UtilityLLMServiceOutput> {
    let selectedProvider: IProvider | undefined;
    let selectedModel: ProviderModelInfo | undefined;
    try {
      const selection = await this._selectProviderAndModel(request.providerId, request.modelId, request.taskHint || "direct_prompt");
      selectedProvider = selection.provider;
      selectedModel = selection.model;

      const modelTargetInfo = this._createModelTargetInfo(selectedModel, selectedProvider);

      const promptComponents: Partial<PromptComponents> = { userInput: request.prompt };
      if (request.systemPrompt) {
        promptComponents.systemPrompts = [{ content: request.systemPrompt, priority: 0, source: 'UtilityLLMServiceDirect' }];
      }

      const promptResult = await this.promptEngine.constructPrompt(promptComponents, modelTargetInfo);
      if (promptResult.issues?.some(i => i.type === 'error')) {
        const errorMessages = promptResult.issues.filter(i => i.type === 'error').map(i => i.message).join('; ');
        throw new GMIError(
            `Prompt construction failed: ${errorMessages}`,
            GMIErrorCode.VALIDATION_ERROR, // FIX: Use VALIDATION_ERROR
            { issues: promptResult.issues, component: 'PromptEngine', phase: 'construction' }
        );
      }

      const messagesForProvider = this._prepareMessagesForProvider(promptResult.prompt, modelTargetInfo);
      const completionOptions: ModelCompletionOptions = {
        stream: false,
        ...(request.completionOptions || {}),
      };
      if (promptResult.formattedToolSchemas && promptResult.formattedToolSchemas.length > 0) {
        completionOptions.tools = promptResult.formattedToolSchemas;
      }

      const response = await selectedProvider.generateCompletion(selectedModel.modelId, messagesForProvider, completionOptions);
      const responseText = this._extractTextFromMessageContent(response.choices[0]?.message?.content) ||
                           (response.choices[0]?.text ?? null);

      return {
        responseText,
        usage: response.usage,
        error: response.error?.message,
        isFinal: true,
        providerId: selectedProvider.providerId,
        modelIdUsed: response.modelId,
      };
    } catch (error: any) {
      console.error(`UtilityLLMService.processDirectPrompt Error (Model: ${request.modelId}, Provider: ${request.providerId}):`, error);
      if (error instanceof PromptEngineError) {
          throw new GMIError(
              error.message,
              GMIErrorCode.VALIDATION_ERROR, // FIX: Use VALIDATION_ERROR
              error.details,
              { originalErrorCode: error.code, component: "PromptEngine", during: "processDirectPrompt" }
          );
      }
      const gmiError = error instanceof GMIError ? error : createGMIErrorFromError(
          error,
          GMIErrorCode.OPERATION_FAILED, // FIX: Use OPERATION_FAILED for external API issues
          { modelId: selectedModel?.modelId || request.modelId, providerId: selectedProvider?.providerId || request.providerId, detail: "LLM API call failure" },
          `Failed in processDirectPrompt to call LLM provider`
      );
      return { responseText: null, error: gmiError.message, isFinal: true, providerId: selectedProvider?.providerId, modelIdUsed: selectedModel?.modelId };
    }
  }

  /**
   * Processes a direct prompt request and streams the LLM's response.
   * @param {DirectPromptRequest} request - The request object containing prompt details and options.
   * @returns {AsyncIterable<UtilityLLMServiceOutput>} An asynchronous iterable yielding response chunks.
   * @public
   */
  public async *streamDirectPrompt(request: DirectPromptRequest): AsyncIterable<UtilityLLMServiceOutput> {
    let selectedProvider: IProvider | undefined;
    let selectedModel: ProviderModelInfo | undefined;

    try {
      const selection = await this._selectProviderAndModel(request.providerId, request.modelId, request.taskHint || "direct_prompt_stream");
      selectedProvider = selection.provider;
      selectedModel = selection.model;

      const modelTargetInfo = this._createModelTargetInfo(selectedModel, selectedProvider);

      const promptComponents: Partial<PromptComponents> = { userInput: request.prompt };
      if (request.systemPrompt) {
        promptComponents.systemPrompts = [{ content: request.systemPrompt, priority: 0, source: 'UtilityLLMServiceStream' }];
      }

      const promptResult = await this.promptEngine.constructPrompt(promptComponents, modelTargetInfo);
      if (promptResult.issues?.some(i => i.type === 'error')) {
        const errorMessages = promptResult.issues.filter(i => i.type === 'error').map(i => i.message).join('; ');
        throw new GMIError(
            `Prompt construction failed for stream: ${errorMessages}`,
            GMIErrorCode.VALIDATION_ERROR, // FIX: Use VALIDATION_ERROR
            { issues: promptResult.issues, component: 'PromptEngine', phase: 'construction_stream' }
        );
      }

      const messagesForProvider = this._prepareMessagesForProvider(promptResult.prompt, modelTargetInfo);
      const completionOptions: ModelCompletionOptions = {
        stream: true,
        ...(request.completionOptions || {}),
      };
      if (promptResult.formattedToolSchemas && promptResult.formattedToolSchemas.length > 0) {
        completionOptions.tools = promptResult.formattedToolSchemas;
      }

      const stream = selectedProvider.generateCompletionStream(selectedModel.modelId, messagesForProvider, completionOptions);
      for await (const chunk of stream) {
        if (chunk.error) {
          yield { responseText: null, error: chunk.error.message, isFinal: true, usage: chunk.usage, providerId: selectedProvider.providerId, modelIdUsed: chunk.modelId || selectedModel.modelId };
          return;
        }

        const deltaContent = chunk.responseTextDelta || null;

        yield {
          responseText: deltaContent,
          usage: chunk.isFinal ? chunk.usage : undefined,
          isFinal: chunk.isFinal || false,
          providerId: selectedProvider.providerId,
          modelIdUsed: chunk.modelId || selectedModel.modelId,
        };
        if (chunk.isFinal) return;
      }
    } catch (error: any) {
      console.error(`UtilityLLMService.streamDirectPrompt Error (Model: ${request.modelId}, Provider: ${request.providerId}):`, error);
      if (error instanceof PromptEngineError) {
          throw new GMIError(
              error.message,
              GMIErrorCode.VALIDATION_ERROR, // FIX: Use VALIDATION_ERROR
              error.details,
              { originalErrorCode: error.code, component: "PromptEngine", during: "streamDirectPrompt" }
            );
      }
      const gmiError = error instanceof GMIError ? error : createGMIErrorFromError(
          error,
          GMIErrorCode.OPERATION_FAILED, // FIX: Use OPERATION_FAILED for external API issues
          { modelId: selectedModel?.modelId || request.modelId, providerId: selectedProvider?.providerId || request.providerId, detail: "LLM API stream failure" },
          "Failed in streamDirectPrompt to call LLM provider stream"
      );
      yield { responseText: null, error: gmiError.message, isFinal: true, providerId: selectedProvider?.providerId, modelIdUsed: selectedModel?.modelId };
    }
  }

  /**
   * Summarizes a given text, providing a non-streamed, consolidated summary.
   * @param {SummarizationTaskRequest} request - The request detailing the text and summarization preferences.
   * @returns {Promise<UtilityLLMServiceOutput>} The summarized text or an error object.
   * @public
   */
  public async summarizeText(request: SummarizationTaskRequest): Promise<UtilityLLMServiceOutput> {
    const systemPrompt = `Your task is to summarize the following text.
Desired summary length: ${request.desiredLength || 'medium (approximately 3-5 sentences)'}.
Output format: ${request.outputFormat || 'a concise paragraph'}.
Focus on extracting the key points, main ideas, and essential information from the text.
Avoid personal opinions or interpretations. Be objective and stick to the content of the provided text.`;

    const directPromptRequest: DirectPromptRequest = {
      prompt: request.textToSummarize,
      systemPrompt,
      modelId: request.modelId,
      providerId: request.providerId,
      taskHint: "summarization",
      completionOptions: {
        maxTokens: typeof request.desiredLength === 'number'
            ? request.desiredLength
            : (request.desiredLength === 'long' ? 1000 : (request.desiredLength === 'short' ? 150 : 500)),
        temperature: request.completionOptions?.temperature ?? 0.3,
        ...(request.completionOptions || {}),
      },
      stream: request.stream || false,
    };

    if (directPromptRequest.stream) {
        let fullText = "";
        let lastUsage: ModelUsage | undefined;
        let finalProviderId: string | undefined;
        let finalModelIdUsed: string | undefined;
        let lastError: string | undefined;

        for await (const chunk of this.streamSummarizeText(request)) {
            if (chunk.error && !chunk.responseText) {
                return { responseText: fullText || null, error: chunk.error, isFinal: true, usage: chunk.usage, providerId: chunk.providerId, modelIdUsed: chunk.modelIdUsed };
            }
            if (chunk.responseText) {
                fullText += chunk.responseText;
            }
            if(chunk.error){
                lastError = chunk.error;
            }
            if (chunk.isFinal) {
                lastUsage = chunk.usage;
                finalProviderId = chunk.providerId;
                finalModelIdUsed = chunk.modelIdUsed;
                if(chunk.error && !lastError) lastError = chunk.error;
                if (lastError) {
                     return { responseText: fullText, usage: lastUsage, error: lastError, isFinal: true, providerId: finalProviderId, modelIdUsed: finalModelIdUsed };
                }
            }
        }
        if (!finalModelIdUsed && fullText && this.providerManager.isInitialized) {
            const fallbackSelection = await this._selectProviderAndModel(request.providerId, request.modelId, "summarization").catch(() => null);
            finalProviderId = fallbackSelection?.provider.providerId;
            finalModelIdUsed = fallbackSelection?.model.modelId;
        }
        return { responseText: fullText, usage: lastUsage, error: lastError, isFinal: true, providerId: finalProviderId, modelIdUsed: finalModelIdUsed };
    } else {
        return this.processDirectPrompt(directPromptRequest);
    }
  }

  /**
   * Summarizes a given text and streams the output as it's generated.
   * @param {SummarizationTaskRequest} request - The request detailing the text and summarization preferences.
   * @returns {AsyncIterable<UtilityLLMServiceOutput>} An asynchronous iterable yielding summary chunks.
   * @public
   */
  public async *streamSummarizeText(request: SummarizationTaskRequest): AsyncIterable<UtilityLLMServiceOutput> {
    const systemPrompt = `You are an expert summarizer. Your task is to stream a summary of the following text.
Desired summary length: ${request.desiredLength || 'medium (approximately 3-5 sentences)'}.
Output format: ${request.outputFormat || 'a concise paragraph'}.
Focus on extracting key information and main points. Stream your response, ensuring each yielded part contributes meaningfully to the summary.
If generating bullet points, stream each point or part of a point as available.`;

    const directPromptRequest: DirectPromptRequest = {
      prompt: request.textToSummarize,
      systemPrompt: systemPrompt,
      modelId: request.modelId,
      providerId: request.providerId,
      taskHint: "summarization_stream",
      completionOptions: {
        temperature: request.completionOptions?.temperature ?? 0.5,
        maxTokens: typeof request.desiredLength === 'number'
            ? request.desiredLength
            : (request.desiredLength === 'long' ? 1200 : (request.desiredLength === 'short' ? 200 : 600)),
        ...(request.completionOptions || {}),
      },
      stream: true,
    };
    yield* this.streamDirectPrompt(directPromptRequest);
  }
}