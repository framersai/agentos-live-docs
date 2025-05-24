// File: backend/agentos/core/llm/providers/implementations/OpenRouterProvider.ts
/**
 * @fileoverview Implements the IProvider interface for OpenRouter, a service that
 * provides access to a wide variety of LLMs from different providers through a unified API.
 * This provider handles routing requests to the specified models via OpenRouter.
 *
 * Key features:
 * - Access to numerous models from OpenAI, Anthropic, Google, Meta, etc., via a single API key.
 * - Standardized chat completion and streaming.
 * - Embedding generation for supported models.
 * - Listing of available models aggregated by OpenRouter.
 * - Health checks for the OpenRouter service.
 * - Adherence to AgentOS architectural principles, using custom errors and comprehensive JSDoc.
 *
 * Note: OpenRouter model IDs are typically prefixed with the original provider and model name,
 * e.g., "openai/gpt-4o", "anthropic/claude-3-opus".
 *
 * @module backend/agentos/core/llm/providers/implementations/OpenRouterProvider
 * @implements {IProvider}
 */

import axios, { AxiosInstance, AxiosError, ResponseType } from 'axios';
import {
  IProvider,
  ChatMessage,
  ModelCompletionOptions,
  ModelCompletionResponse,
  ModelInfo,
  ModelUsage,
  ProviderEmbeddingOptions,
  ProviderEmbeddingResponse,
  EmbeddingObject,
  ModelCompletionChoice, // Added import
} from '../IProvider'; // Corrected path to parent directory
import { OpenRouterProviderError } from '../errors/OpenRouterProviderError'; // Assuming this error class exists

/**
 * Configuration specific to the OpenRouterProvider.
 * @interface OpenRouterProviderConfig
 * @property {string} apiKey - Your OpenRouter API key. This is mandatory.
 * @property {string} [baseURL="https://openrouter.ai/api/v1"] - The base URL for the OpenRouter API.
 * @property {string} [defaultModelId] - Default model ID to use if not specified in a request (e.g., "openai/gpt-3.5-turbo"). This model must be one available through your OpenRouter account.
 * @property {string} [siteUrl] - Recommended by OpenRouter: Your site URL to attribute requests.
 * @property {string} [appName] - Recommended by OpenRouter: Your application name.
 * @property {number} [requestTimeout=60000] - Timeout for API requests to OpenRouter in milliseconds (60 seconds).
 * @property {number} [streamRequestTimeout=180000] - Timeout for streaming API requests to OpenRouter in milliseconds (3 minutes). OpenRouter recommends longer timeouts for streaming.
 */
export interface OpenRouterProviderConfig {
  apiKey: string;
  baseURL?: string;
  defaultModelId?: string;
  siteUrl?: string;
  appName?: string;
  requestTimeout?: number;
  streamRequestTimeout?: number;
}

// --- OpenRouter Specific API Response Types ---

/**
 * Common structure for choices in OpenRouter's chat completion responses.
 * @interface OpenRouterChatChoice
 * @private
 */
interface OpenRouterChatChoice {
  index: number;
  message?: {
    role: ChatMessage['role'];
    content: string | null;
    tool_calls?: ChatMessage['tool_calls'];
  };
  delta?: {
    role?: ChatMessage['role'];
    content?: string | null;
    tool_calls?: Array<{
      index: number;
      id?: string;
      type?: 'function';
      function?: { name?: string; arguments?: string; };
    }>;
  };
  finish_reason: string | null;
  logprobs?: unknown;
}

/**
 * Response structure for OpenRouter's /chat/completions endpoint.
 * Applies to both non-streaming responses and individual stream chunks.
 * @interface OpenRouterChatCompletionAPIResponse
 * @private
 */
interface OpenRouterChatCompletionAPIResponse {
  id: string;
  object: string; // e.g., "chat.completion" or "chat.completion.chunk"
  created: number; // Unix timestamp (seconds)
  model: string; // Model ID used, e.g., "openai/gpt-4o"
  choices: OpenRouterChatChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    cost?: number; // OpenRouter may include cost directly in USD
  };
  // OpenRouter specific fields might exist (e.g., routing, fallback info)
}

/**
 * Response structure for OpenRouter's /embeddings endpoint.
 * This typically mirrors the underlying provider's embedding response format (e.g., OpenAI's).
 * @interface OpenRouterEmbeddingAPIResponse
 * @private
 */
interface OpenRouterEmbeddingAPIResponse {
  object: 'list';
  data: Array<{
    object: 'embedding';
    embedding: number[];
    index: number;
  }>;
  model: string; // Model ID used for embeddings
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

/**
 * Represents a model object as returned by OpenRouter's `/models` endpoint.
 * @interface OpenRouterModelAPIObject
 * @private
 */
interface OpenRouterModelAPIObject {
  id: string;
  name: string;
  description: string;
  pricing: {
    prompt: string; // Cost per prompt token (string USD value, e.g., "0.0000015")
    completion: string; // Cost per completion token
    request?: string; // Optional cost per request
    image?: string;   // Optional cost per image
  };
  context_length: number | null;
  architecture?: {
    modality: string; // e.g., "text", "multimodal"
    tokenizer: string;
    instruct_type: string | null;
  };
  top_provider: {
    max_retries: number | null;
    is_fallback: boolean | null;
  };
  // Other fields like 'perplexity', 'default_fallback', 'is_moderated' may exist.
}

/**
 * Response structure from OpenRouter's `/models` endpoint.
 * @interface OpenRouterListModelsAPIResponse
 * @private
 */
interface OpenRouterListModelsAPIResponse {
  data: OpenRouterModelAPIObject[];
}


/**
 * @class OpenRouterProvider
 * @implements {IProvider}
 * @description Provides an interface to a wide variety of Large Language Models (LLMs)
 * through the OpenRouter aggregation service. It standardizes API requests for
 * chat completions (both regular and streaming), text embeddings, and model information listing.
 * This provider requires an OpenRouter API key for authentication.
 */
export class OpenRouterProvider implements IProvider {
  /** @inheritdoc */
  public readonly providerId: string = 'openrouter';
  /** @inheritdoc */
  public isInitialized: boolean = false;
  /** @inheritdoc */
  public defaultModelId?: string;

  private config!: Readonly<Required<OpenRouterProviderConfig>>; // Ensure all config fields are present after init
  private client!: AxiosInstance;
  private readonly availableModelsCache: Map<string, ModelInfo> = new Map();

  /**
   * Creates an instance of OpenRouterProvider.
   * The provider must be initialized using `initialize()` before it can be used to make API calls.
   */
  constructor() {}

  /** @inheritdoc */
  public async initialize(config: OpenRouterProviderConfig): Promise<void> {
    if (!config.apiKey) {
      throw new OpenRouterProviderError(
        'OpenRouter API key (apiKey) is required for initialization.',
        'INIT_FAILED_MISSING_API_KEY'
      );
    }
    this.config = Object.freeze({
      baseURL: config.baseURL || 'https://openrouter.ai/api/v1',
      requestTimeout: config.requestTimeout || 60000, // 60 seconds
      streamRequestTimeout: config.streamRequestTimeout || 180000, // 3 minutes
      ...config, // User-provided config overrides defaults
    });
    this.defaultModelId = this.config.defaultModelId;

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': `AgentOS/1.0 (OpenRouterProvider; ${this.config.appName || 'UnknownApp'})`,
    };
    if (this.config.siteUrl) {
      headers['HTTP-Referer'] = this.config.siteUrl;
    }
    if (this.config.appName) {
      headers['X-Title'] = this.config.appName;
    }

    this.client = axios.create({
      baseURL: this.config.baseURL,
      headers,
    });

    try {
      await this.refreshAvailableModels();
      this.isInitialized = true;
      console.log(`OpenRouterProvider initialized. Default Model: ${this.defaultModelId || 'Not set'}. Found ${this.availableModelsCache.size} models via OpenRouter.`);
    } catch (error: unknown) {
      this.isInitialized = false; // Ensure it's false on failed init
      const initError = error instanceof OpenRouterProviderError ? error :
        createGMIErrorFromError(
            error instanceof Error ? error : new Error(String(error)),
            GMIErrorCode.LLM_PROVIDER_ERROR, // Or a more specific init error code
            { providerId: this.providerId },
           `OpenRouterProvider failed to initialize: ${error instanceof Error ? error.message : String(error)}`
        );
      console.error(initError.message, initError.details || initError);
      throw initError; // Re-throw standardized error
    }
  }

  /**
   * Fetches the list of available models from the OpenRouter `/models` endpoint
   * and updates the internal cache (`availableModelsCache`).
   * @private
   * @async
   * @throws {OpenRouterProviderError} If fetching models fails or the response is malformed.
   */
  private async refreshAvailableModels(): Promise<void> {
    const responseData = await this.makeApiRequest<OpenRouterListModelsAPIResponse>(
        '/models',
        'GET',
        this.config.requestTimeout // Use standard request timeout for this
    );

    this.availableModelsCache.clear();
    if (responseData && Array.isArray(responseData.data)) {
        responseData.data.forEach((apiModel: OpenRouterModelAPIObject) => {
            const modelInfo = this.mapApiToModelInfo(apiModel);
            this.availableModelsCache.set(modelInfo.modelId, modelInfo);
        });
    } else {
        console.warn("OpenRouterProvider: Received no model data or malformed response from /models endpoint.");
    }
  }

  /**
   * Maps an OpenRouter API model object to the standardized `ModelInfo` interface used within AgentOS.
   * @private
   * @param {OpenRouterModelAPIObject} apiModel - The model object from the OpenRouter API.
   * @returns {ModelInfo} The standardized `ModelInfo` object.
   */
  private mapApiToModelInfo(apiModel: OpenRouterModelAPIObject): ModelInfo {
    const capabilities: ModelInfo['capabilities'] = ['chat', 'completion']; // Assume most support these by default
    if (apiModel.architecture?.modality === 'multimodal') {
      capabilities.push('vision_input');
    }
    // Inferring tool_use and json_mode: OpenRouter doesn't flag this explicitly in /models.
    // Heuristic: common advanced models often support these.
    const knownAdvancedModelPatterns = ['gpt-3.5', 'gpt-4', 'claude-2', 'claude-3', 'gemini', 'mistral', 'llama'];
    if (knownAdvancedModelPatterns.some(pattern => apiModel.id.toLowerCase().includes(pattern))) {
      capabilities.push('tool_use', 'json_mode');
    }
    // Embedding capabilities are usually tied to specific embedding models, not general chat models.
    if (apiModel.id.includes('embedding') || apiModel.id.includes('embed')) {
        capabilities.push('embeddings');
    }


    // Convert string pricing (cost per token) to cost per 1 Million tokens (number)
    const parsePrice = (priceStr: string | undefined, tokensFactor: number = 1000000): number | undefined => {
        if (typeof priceStr !== 'string') return undefined;
        const price = parseFloat(priceStr);
        return isNaN(price) ? undefined : price * tokensFactor;
    };

    return {
      modelId: apiModel.id,
      providerId: this.providerId,
      displayName: apiModel.name,
      description: apiModel.description,
      capabilities: Array.from(new Set(capabilities)), // Ensure unique capabilities
      contextWindowSize: apiModel.context_length || undefined,
      pricePer1MTokensInput: parsePrice(apiModel.pricing.prompt),
      pricePer1MTokensOutput: parsePrice(apiModel.pricing.completion),
      supportsStreaming: true, // OpenRouter generally supports streaming for its chat models.
      status: 'active', // Assume active unless specified otherwise by OpenRouter in future API versions.
    };
  }

  /**
   * Ensures the provider has been successfully initialized before making API calls.
   * @private
   * @throws {OpenRouterProviderError} if the provider is not initialized.
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new OpenRouterProviderError(
        'OpenRouterProvider is not initialized. Please call the initialize() method first.',
        'PROVIDER_NOT_INITIALIZED'
      );
    }
  }

  /**
   * Maps an array of standard `ChatMessage` objects to the format expected by OpenRouter's API.
   * This typically involves ensuring roles and content structure are compatible.
   * @private
   * @param {ChatMessage[]} messages - The array of messages to map.
   * @returns {Array<Partial<ChatMessage>>} An array of messages formatted for OpenRouter.
   * Using Partial<ChatMessage> as OpenRouter might not require all fields (e.g. name on user role).
   */
  private mapToOpenRouterMessages(messages: ChatMessage[]): Array<Partial<ChatMessage>> {
    return messages.map(msg => {
        const mappedMsg: Partial<ChatMessage> = { role: msg.role, content: msg.content };
        if (msg.name) mappedMsg.name = msg.name;
        if (msg.tool_calls) mappedMsg.tool_calls = msg.tool_calls;
        if (msg.tool_call_id) mappedMsg.tool_call_id = msg.tool_call_id;
        return mappedMsg;
    });
  }

  /** @inheritdoc */
  public async generateCompletion(
    modelId: string,
    messages: ChatMessage[],
    options: ModelCompletionOptions
  ): Promise<ModelCompletionResponse> {
    this.ensureInitialized();
    const openRouterMessages = this.mapToOpenRouterMessages(messages);

    const payload: Record<string, unknown> = {
      model: modelId,
      messages: openRouterMessages,
      stream: false, // Explicitly false for non-streaming
      ...(options.temperature !== undefined && { temperature: options.temperature }),
      ...(options.topP !== undefined && { top_p: options.topP }),
      ...(options.maxTokens !== undefined && { max_tokens: options.maxTokens }),
      ...(options.presencePenalty !== undefined && { presence_penalty: options.presencePenalty }),
      ...(options.frequencyPenalty !== undefined && { frequency_penalty: options.frequencyPenalty }),
      ...(options.stopSequences !== undefined && { stop: options.stopSequences }),
      ...(options.userId !== undefined && { user: options.userId }),
      ...(options.tools !== undefined && { tools: options.tools }),
      ...(options.toolChoice !== undefined && { tool_choice: options.toolChoice }),
      ...(options.responseFormat?.type === 'json_object' && { response_format: { type: 'json_object' } }),
      ...(options.customModelParams || {}),
    };

    const apiResponseData = await this.makeApiRequest<OpenRouterChatCompletionAPIResponse>(
      '/chat/completions',
      'POST',
      this.config.requestTimeout,
      payload
    );
    return this.mapApiToCompletionResponse(apiResponseData, modelId);
  }

  /** @inheritdoc */
  public async *generateCompletionStream(
    modelId: string,
    messages: ChatMessage[],
    options: ModelCompletionOptions
  ): AsyncGenerator<ModelCompletionResponse, void, undefined> {
    this.ensureInitialized();
    const openRouterMessages = this.mapToOpenRouterMessages(messages);

    const payload: Record<string, unknown> = {
      model: modelId,
      messages: openRouterMessages,
      stream: true, // Explicitly true for streaming
      ...(options.temperature !== undefined && { temperature: options.temperature }),
      ...(options.topP !== undefined && { top_p: options.topP }),
      ...(options.maxTokens !== undefined && { max_tokens: options.maxTokens }),
      ...(options.presencePenalty !== undefined && { presence_penalty: options.presencePenalty }),
      ...(options.frequencyPenalty !== undefined && { frequency_penalty: options.frequencyPenalty }),
      ...(options.stopSequences !== undefined && { stop: options.stopSequences }),
      ...(options.userId !== undefined && { user: options.userId }),
      ...(options.tools !== undefined && { tools: options.tools }),
      ...(options.toolChoice !== undefined && { tool_choice: options.toolChoice }),
      ...(options.responseFormat?.type === 'json_object' && { response_format: { type: 'json_object' } }),
      ...(options.customModelParams || {}),
    };

    const stream = await this.makeApiRequest<NodeJS.ReadableStream>(
      '/chat/completions',
      'POST',
      this.config.streamRequestTimeout,
      payload,
      true // expectStream = true
    );

    const accumulatedToolCalls: Map<number, { id?: string; type?: 'function'; function?: { name?: string; arguments?: string; } }> = new Map();

    for await (const rawChunk of this.parseSseStream(stream)) {
      // OpenRouter specific stream termination conditions
      if (rawChunk.startsWith('data: ') && rawChunk.includes('[DONE]')) {
          const doneData = rawChunk.substring('data: '.length).trim();
          if (doneData === '[DONE]') break; // End of stream for some OpenRouter models
      }
      if (rawChunk === 'data: [DONE]') { // Another common OpenAI-style termination
          break;
      }

      if (rawChunk.startsWith('data: ')) {
        const jsonData = rawChunk.substring('data: '.length);
        try {
          const apiChunk = JSON.parse(jsonData) as OpenRouterChatCompletionAPIResponse;
          yield this.mapApiToStreamChunkResponse(apiChunk, modelId, accumulatedToolCalls);
          if (apiChunk.choices[0]?.finish_reason) {
            break; // Stream is finished if a finish_reason is received
          }
        } catch (error: unknown) {
          console.warn('OpenRouterProvider: Failed to parse stream chunk JSON, skipping chunk. Data:', jsonData, 'Error:', error);
          // Optionally yield an error chunk or log more verbosely
        }
      }
    }
  }

  /** @inheritdoc */
  public async generateEmbeddings(
    modelId: string,
    texts: string[],
    options?: ProviderEmbeddingOptions
  ): Promise<ProviderEmbeddingResponse> {
    this.ensureInitialized();
    if (!texts || texts.length === 0) {
      throw new OpenRouterProviderError('Input texts array cannot be empty for generating embeddings.', 'EMBEDDING_NO_INPUT');
    }

    // Verify model is suitable for embeddings if possible, or rely on OpenRouter to error correctly.
    const modelInfo = await this.getModelInfo(modelId);
    if (modelInfo && !modelInfo.capabilities.includes('embeddings')) {
        console.warn(`OpenRouterProvider: Model '${modelId}' is not explicitly listed with embedding capabilities. Attempting anyway.`);
    }

    const payload: Record<string, unknown> = {
      model: modelId,
      input: texts,
      ...(options?.encodingFormat && { encoding_format: options.encodingFormat }),
      ...(options?.dimensions && { dimensions: options.dimensions }), // Pass dimensions if supported
      // input_type is less common with OpenRouter's generic endpoint, but can be in customModelParams
      ...(options?.customModelParams || {}),
    };
     if (options?.inputType && payload.customModelParams) {
        (payload.customModelParams as Record<string, unknown>).input_type = options.inputType;
     } else if (options?.inputType) {
        payload.customModelParams = { input_type: options.inputType };
     }


    const apiResponseData = await this.makeApiRequest<OpenRouterEmbeddingAPIResponse>(
      '/embeddings',
      'POST',
      this.config.requestTimeout,
      payload
    );

    return {
      object: 'list',
      data: apiResponseData.data.map(d => ({
        object: 'embedding',
        embedding: d.embedding,
        index: d.index,
      })),
      model: apiResponseData.model,
      usage: {
        prompt_tokens: apiResponseData.usage.prompt_tokens,
        total_tokens: apiResponseData.usage.total_tokens,
        // Cost calculation for embeddings via OpenRouter can be complex and often isn't returned per call.
        // It's generally based on total tokens processed against the model's embedding price.
      },
    };
  }

  /** @inheritdoc */
  public async listAvailableModels(filter?: { capability?: string }): Promise<ModelInfo[]> {
    this.ensureInitialized();
    // Attempt to refresh cache if it's empty, as a fallback.
    if (this.availableModelsCache.size === 0) {
        try {
            await this.refreshAvailableModels();
        } catch (refreshError) {
            console.warn("OpenRouterProvider: Failed to refresh models during listAvailableModels call after finding empty cache:", refreshError);
            // Proceed with potentially empty cache or throw, depending on desired strictness.
        }
    }
    const models = Array.from(this.availableModelsCache.values());
    if (filter?.capability) {
      return models.filter(m => m.capabilities.includes(filter.capability!));
    }
    return models;
  }

  /** @inheritdoc */
  public async getModelInfo(modelId: string): Promise<ModelInfo | undefined> {
    this.ensureInitialized();
    if (!this.availableModelsCache.has(modelId)) {
        try {
            // Attempt to refresh models if the specific model isn't found; it might be new.
            console.log(`OpenRouterProvider: Model ${modelId} not in cache. Refreshing model list.`);
            await this.refreshAvailableModels();
        } catch (error) {
            console.warn(`OpenRouterProvider: Failed to refresh models list while trying to get info for ${modelId}:`, error);
            // Proceed to check cache again; if still not found, it's genuinely unavailable or an issue.
        }
    }
    return this.availableModelsCache.get(modelId);
  }

  /** @inheritdoc */
  public async checkHealth(): Promise<{ isHealthy: boolean; details?: unknown }> {
    // Ensure client is created even if initialize wasn't called by other means,
    // but this relies on config being available. Best to call after initialize.
    if (!this.client) {
        return { isHealthy: false, details: { message: "OpenRouterProvider not initialized (HTTP client missing)."}};
    }
    try {
      // A lightweight check: pinging the /models endpoint.
      // Shorter timeout for health check compared to regular requests.
      await this.client.get('/models', { timeout: Math.min(this.config.requestTimeout || 10000, 10000) });
      return { isHealthy: true, details: { message: "Successfully connected to OpenRouter /models endpoint." } };
    } catch (error: unknown) {
      const err = error as AxiosError;
      return {
        isHealthy: false,
        details: {
          message: `OpenRouter health check failed: ${err.message}`,
          status: err.response?.status,
          responseData: err.response?.data,
        },
      };
    }
  }

  /** @inheritdoc */
  public async shutdown(): Promise<void> {
    this.isInitialized = false;
    this.availableModelsCache.clear();
    // Axios instances don't typically require explicit shutdown unless they hold persistent connections
    // not managed by standard HTTP keep-alive, which is rare for basic usage.
    console.log('OpenRouterProvider shutdown: Instance marked as uninitialized and cache cleared.');
  }

  /**
   * Maps an OpenRouter API Chat Completion response (non-streaming) to the standard `ModelCompletionResponse`.
   * @private
   * @param {OpenRouterChatCompletionAPIResponse} apiResponse - The raw response from OpenRouter.
   * @param {string} requestedModelId - The model ID that was originally requested.
   * @returns {ModelCompletionResponse} The standardized completion response.
   */
  private mapApiToCompletionResponse(
    apiResponse: OpenRouterChatCompletionAPIResponse,
    requestedModelId: string
  ): ModelCompletionResponse {
    const choice = apiResponse.choices[0];
    if (!choice) {
        throw new OpenRouterProviderError("Received empty choices array from OpenRouter.", "API_RESPONSE_MALFORMED", apiResponse.id);
    }

    const usage: ModelUsage | undefined = apiResponse.usage ? {
      promptTokens: apiResponse.usage.prompt_tokens,
      completionTokens: apiResponse.usage.completion_tokens,
      totalTokens: apiResponse.usage.total_tokens,
      costUSD: apiResponse.usage.cost,
    } : undefined;

    return {
      id: apiResponse.id,
      object: apiResponse.object, // e.g., "chat.completion"
      created: apiResponse.created,
      modelId: apiResponse.model || requestedModelId, // Prefer model from response, fallback to requested
      choices: apiResponse.choices.map(c => ({
        index: c.index,
        message: { 
          role: c.message!.role, // Non-streaming, message should exist
          content: c.message!.content,
          tool_calls: c.message!.tool_calls,
        },
        finishReason: c.finish_reason,
        logprobs: c.logprobs,
      })),
      usage,
    };
  }

   /**
   * Maps an OpenRouter API stream chunk to a standard `ModelCompletionResponse` object representing that chunk.
   * This method also handles the accumulation of `tool_calls` data across multiple chunks.
   * @private
   * @param {OpenRouterChatCompletionAPIResponse} apiChunk - The raw stream chunk from OpenRouter.
   * @param {string} requestedModelId - The model ID originally requested for the stream.
   * @param {Map<number, { id?: string; type?: 'function'; function?: { name?: string; arguments?: string; } }>} accumulatedToolCalls - A map to accumulate tool call parts across chunks. The key is the tool call index.
   * @returns {ModelCompletionResponse} The standardized response chunk.
   */
  private mapApiToStreamChunkResponse(
      apiChunk: OpenRouterChatCompletionAPIResponse,
      requestedModelId: string,
      accumulatedToolCalls: Map<number, { id?: string; type?: 'function'; function?: { name?: string; arguments?: string; } }>
  ): ModelCompletionResponse {
      const choice = apiChunk.choices[0];
      if (!choice) {
          // This shouldn't happen in a valid stream but guard against it.
          return {
              id: apiChunk.id, object: apiChunk.object, created: apiChunk.created,
              modelId: apiChunk.model || requestedModelId, choices: [], isFinal: true,
              error: { message: "Stream chunk contained no choices.", type: "invalid_response" }
          };
      }

      let responseTextDelta: string | undefined;
      let toolCallsDeltas: ModelCompletionResponse['toolCallsDeltas'];
      
      if (choice.delta?.content) {
          responseTextDelta = choice.delta.content;
      }

      if (choice.delta?.tool_calls) {
          toolCallsDeltas = [];
          choice.delta.tool_calls.forEach(tcDelta => {
              let currentToolCallState = accumulatedToolCalls.get(tcDelta.index);
              if (!currentToolCallState) {
                  currentToolCallState = { function: { name: '', arguments: ''} }; // Initialize if new
              }

              if (tcDelta.id) currentToolCallState.id = tcDelta.id;
              if (tcDelta.type) currentToolCallState.type = tcDelta.type as 'function';
              if (tcDelta.function?.name) currentToolCallState.function!.name = (currentToolCallState.function!.name || '') + tcDelta.function.name;
              if (tcDelta.function?.arguments) currentToolCallState.function!.arguments = (currentToolCallState.function!.arguments || '') + tcDelta.function.arguments;
              
              accumulatedToolCalls.set(tcDelta.index, currentToolCallState);

              // The delta itself reflects what changed in this chunk
              toolCallsDeltas!.push({
                  index: tcDelta.index,
                  id: tcDelta.id, // id usually comes in the first chunk for a tool_call
                  type: tcDelta.type as 'function',
                  function: tcDelta.function ? {
                      name: tcDelta.function.name,
                      arguments_delta: tcDelta.function.arguments // The chunk of arguments string
                  } : undefined,
              });
          });
      }

      const isFinal = !!choice.finish_reason;
      let finalUsage: ModelUsage | undefined;
      let finalChoices: ModelCompletionChoice[] = [];

      if (isFinal) {
          if (apiChunk.usage) {
              finalUsage = {
                  promptTokens: apiChunk.usage.prompt_tokens,
                  completionTokens: apiChunk.usage.completion_tokens,
                  totalTokens: apiChunk.usage.total_tokens,
                  costUSD: apiChunk.usage.cost,
              };
          }
          // Construct the complete message for the final chunk's choice
          const finalMessage: ChatMessage = {
              role: choice.delta?.role || accumulatedToolCalls.size > 0 ? 'assistant' : (choice.message?.role || 'assistant'), // Determine role carefully
              content: responseTextDelta || (choice.message?.content || null), // Prefer delta, fallback to full message if available
              tool_calls: Array.from(accumulatedToolCalls.values())
                              .filter(tc => tc.id && tc.function?.name) // Ensure valid accumulated calls
                              .map(accTc => ({
                                  id: accTc.id!,
                                  type: accTc.type!,
                                  function: { name: accTc.function!.name!, arguments: accTc.function!.arguments! }
                              })),
          };
          if (!finalMessage.tool_calls || finalMessage.tool_calls.length === 0) {
              delete finalMessage.tool_calls;
          }
          // If responseTextDelta was the only content, ensure final message.content reflects it.
          // If the stream only contained tool_calls, content should be null.
          if (responseTextDelta && !choice.message?.content && accumulatedToolCalls.size === 0) {
              finalMessage.content = responseTextDelta; // This assumes simple text accumulation
          } else if (accumulatedToolCalls.size > 0 && !responseTextDelta && !choice.message?.content) {
              finalMessage.content = null;
          }


          finalChoices.push({
              index: choice.index,
              message: finalMessage,
              finishReason: choice.finish_reason,
              logprobs: choice.logprobs,
          });
      } else {
          // For intermediate chunks, construct message with delta content
          finalChoices.push({
              index: choice.index,
              message: {
                  role: choice.delta?.role || 'assistant',
                  content: responseTextDelta || null,
                  // Intermediate tool_calls are handled by toolCallsDeltas
              },
              finishReason: null, // Not final yet
          });
      }
      
      return {
          id: apiChunk.id,
          object: apiChunk.object, // Should be "chat.completion.chunk"
          created: apiChunk.created,
          modelId: apiChunk.model || requestedModelId,
          choices: finalChoices,
          responseTextDelta: isFinal ? undefined : responseTextDelta, // Delta only for non-final
          toolCallsDeltas: isFinal ? undefined : toolCallsDeltas, // Deltas only for non-final
          isFinal,
          usage: finalUsage,
      };
  }

  /**
   * Generic method to make an API request to the configured OpenRouter baseURL.
   * Handles common error mapping to `OpenRouterProviderError`.
   * @private
   * @template T Expected response data type.
   * @param {string} endpoint - The API endpoint path (e.g., "/chat/completions").
   * @param {'GET' | 'POST'} method - The HTTP method.
   * @param {number | undefined} timeout - Request-specific timeout.
   * @param {Record<string, unknown>} [body] - The request body for POST requests.
   * @param {boolean} [expectStream=false] - If true, sets responseType to 'stream'.
   * @returns {Promise<T>} The response data.
   * @throws {OpenRouterProviderError} If the API request fails or returns an error.
   */
  private async makeApiRequest<T = unknown>(
    endpoint: string,
    method: 'GET' | 'POST',
    timeout?: number, // Now using the specific timeout passed
    body?: Record<string, unknown>,
    expectStream: boolean = false
  ): Promise<T> {
    try {
      const response = await this.client.request<T>({
        url: endpoint,
        method,
        data: body,
        timeout: timeout, // Use the per-request timeout
        responseType: expectStream ? 'stream' as ResponseType : 'json' as ResponseType,
      });
      return response.data;
    } catch (error: unknown) {
      // Default error details
      let statusCode: number | undefined;
      let errorData: any;
      let errorMessage = 'Unknown OpenRouter API error';
      let errorType = 'UNKNOWN_API_ERROR';

      if (axios.isAxiosError(error)) {
        statusCode = error.response?.status;
        errorData = error.response?.data;
        // Try to extract a more specific message from OpenRouter's error structure
        if (errorData?.error && typeof errorData.error === 'object') {
            errorMessage = errorData.error.message || errorMessage;
            errorType = errorData.error.type || errorType;
        } else if (typeof errorData === 'string') {
            errorMessage = errorData;
        } else if (error.message) {
            errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      throw new OpenRouterProviderError(
        errorMessage,
        'API_REQUEST_FAILED', // Generic category for request failures
        statusCode,
        errorType, // More specific type from OpenRouter if available
        { requestEndpoint: endpoint, requestBodyPreview: body ? JSON.stringify(body).substring(0, 200) + '...' : undefined, responseData: errorData, underlyingError: error }
      );
    }
  }

  /**
   * Parses a Server-Sent Events (SSE) stream.
   * Handles line-by-line processing, specifically looking for "data: " prefixes.
   * @private
   * @async
   * @generator
   * @param {NodeJS.ReadableStream} stream - The SSE stream to parse.
   * @yields {string} Each data line from the SSE stream.
   * @throws {OpenRouterProviderError} If an error occurs during stream reading or parsing.
   */
  private async *parseSseStream(stream: NodeJS.ReadableStream): AsyncGenerator<string, void, undefined> {
    let buffer = '';
    const readableStream = stream as NodeJS.ReadableStream & { destroy?: () => void }; // Type assertion for destroy

    try {
        for await (const chunk of readableStream) {
            buffer += chunk.toString();
            let eolIndex;
            // Process all complete lines in the buffer
            while ((eolIndex = buffer.indexOf('\n')) >= 0) {
                const line = buffer.substring(0, eolIndex).trim();
                buffer = buffer.substring(eolIndex + 1);
                if (line) { // Only yield non-empty lines (SSE uses empty lines as separators)
                    yield line;
                }
            }
        }
        // After the stream ends, process any remaining data in the buffer
        if (buffer.trim()) {
            yield buffer.trim();
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "OpenRouter stream parsing/reading error";
        console.error("OpenRouterProvider: Error reading or parsing SSE stream:", message, error);
        // Ensure the error is an OpenRouterProviderError for consistent handling upstream
        if (error instanceof OpenRouterProviderError) throw error;
        throw new OpenRouterProviderError(message, 'STREAM_PARSING_ERROR', undefined, undefined, error);
    } finally {
        // Attempt to destroy the stream to free resources, especially if an error occurred.
        if (typeof readableStream.destroy === 'function') {
            readableStream.destroy();
        } else if (typeof (readableStream as any).close === 'function') { // Fallback for some stream types
            (readableStream as any).close();
        }
    }
  }
}