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

import axios, { AxiosInstance, AxiosError } from 'axios';
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
} from '../IProvider';
import { OpenRouterProviderError } from '../errors/OpenRouterProviderError';

/**
 * Configuration specific to the OpenRouterProvider.
 */
export interface OpenRouterProviderConfig {
  /**
   * Your OpenRouter API key. This is mandatory.
   */
  apiKey: string;
  /**
   * The base URL for the OpenRouter API.
   * @default "https://openrouter.ai/api/v1"
   */
  baseURL?: string;
  /**
   * Default model ID to use if not specified in a request (e.g., "openai/gpt-3.5-turbo").
   * This model must be one available through your OpenRouter account.
   */
  defaultModelId?: string;
  /**
   * Recommended by OpenRouter: Your site URL to attribute requests.
   * @see {@link https://openrouter.ai/docs#headers}
   */
  siteUrl?: string;
  /**
   * Recommended by OpenRouter: Your application name.
   * @see {@link https://openrouter.ai/docs#headers}
   */
  appName?: string;
  /**
   * Timeout for API requests to OpenRouter in milliseconds.
   * @default 60000 (60 seconds) for standard, 180000 (3 minutes) for streaming
   */
  requestTimeout?: number;
  /**
   * Timeout for streaming API requests to OpenRouter in milliseconds.
   * OpenRouter recommends longer timeouts for streaming.
   * @default 180000 (3 minutes)
   */
  streamRequestTimeout?: number;
}

// --- OpenRouter Specific API Types ---

/**
 * Common structure for choices in OpenRouter's chat completion responses.
 */
interface OpenRouterChatChoice {
  index: number;
  message?: { // For non-streaming
    role: ChatMessage['role'];
    content: string | null;
    tool_calls?: ChatMessage['tool_calls'];
  };
  delta?: { // For streaming
    role?: ChatMessage['role'];
    content?: string | null;
    tool_calls?: Array<{ // Delta for tool_calls can be partial
        index: number;
        id?: string;
        type?: 'function';
        function?: { name?: string; arguments?: string; };
    }>;
  };
  finish_reason: string | null;
  logprobs?: unknown; // Varies by underlying model
}

/**
 * Response structure for OpenRouter's /chat/completions endpoint (non-streaming and stream chunks).
 */
interface OpenRouterChatCompletionResponse {
  id: string;
  object: string; // "chat.completion" or "chat.completion.chunk"
  created: number; // Unix timestamp
  model: string; // Model ID used, e.g., "openai/gpt-4o"
  choices: OpenRouterChatChoice[];
  usage?: { // Often present in non-streaming or final stream chunk
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    // OpenRouter may also include cost directly in USD
    cost?: number;
  };
  // OpenRouter specific fields might exist, e.g., related to routing or fallback
}

/**
 * Response structure for OpenRouter's /embeddings endpoint.
 * This typically mirrors the underlying provider's embedding response (e.g., OpenAI's).
 */
interface OpenRouterEmbeddingResponse {
  object: 'list';
  data: Array<{
    object: 'embedding';
    embedding: number[];
    index: number;
  }>;
  model: string; // Model ID used for embeddings
  usage: {
    prompt_tokens: number;
    total_tokens: number; // Completion tokens often 0 for embeddings
  };
}

/**
 * Represents a model object as returned by OpenRouter's /models endpoint.
 */
interface OpenRouterModelAPIObject {
  id: string; // e.g., "openai/gpt-4o"
  name: string; // User-friendly name
  description: string;
  pricing: {
    prompt: string; // Cost per prompt token (string USD value)
    completion: string; // Cost per completion token (string USD value)
    request?: string; // Cost per request (string USD value, optional)
    image?: string; // Cost per image (string USD value, optional)
  };
  context_length: number | null; // Context window size
  architecture?: {
    modality: string; // e.g., "text", "multimodal"
    tokenizer: string;
    instruct_type: string | null;
  };
  top_provider: {
    max_retries: number | null;
    is_fallback: boolean | null;
  };
  // Other fields like perplexity, default_fallback, etc.
}

/**
 * Response from OpenRouter's /models endpoint.
 */
interface OpenRouterListModelsResponse {
  data: OpenRouterModelAPIObject[];
}


/**
 * @class OpenRouterProvider
 * @implements {IProvider}
 * Provides an interface to a wide variety of LLMs through the OpenRouter aggregation service.
 * It handles API requests for chat completions, streaming, embeddings, and model listing.
 */
export class OpenRouterProvider implements IProvider {
  /** @inheritdoc */
  public readonly providerId: string = 'openrouter';
  /** @inheritdoc */
  public isInitialized: boolean = false;
  /** @inheritdoc */
  public defaultModelId?: string;

  private config!: OpenRouterProviderConfig;
  private client!: AxiosInstance;
  private availableModelsCache: Map<string, ModelInfo> = new Map();

  /**
   * Creates an instance of OpenRouterProvider.
   * The provider must be initialized using `initialize()` before use.
   */
  constructor() {}

  /** @inheritdoc */
  public async initialize(config: OpenRouterProviderConfig): Promise<void> {
    if (!config.apiKey) {
      throw new OpenRouterProviderError(
        'API key is required for OpenRouterProvider initialization.',
        'INIT_FAILED_MISSING_API_KEY'
      );
    }
    this.config = {
      baseURL: 'https://openrouter.ai/api/v1',
      requestTimeout: 60000, // 60 seconds for standard
      streamRequestTimeout: 180000, // 3 minutes for streaming (OpenRouter recommendation)
      ...config,
    };
    this.defaultModelId = config.defaultModelId;

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'AgentOS/1.0 (OpenRouterProvider)',
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
      // Timeout is handled per-request by makeApiRequest
    });

    try {
      await this.refreshAvailableModels();
      this.isInitialized = true;
      console.log(`OpenRouterProvider initialized successfully. Default model: ${this.defaultModelId || 'Not set'}. Found ${this.availableModelsCache.size} models via OpenRouter.`);
    } catch (error: unknown) {
      this.isInitialized = false;
      if (error instanceof OpenRouterProviderError) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error during initialization.';
      throw new OpenRouterProviderError(
        `OpenRouterProvider initialization failed: ${message}`,
        'INITIALIZATION_FAILED',
        undefined, undefined, error
      );
    }
  }

  /**
   * Fetches the list of available models from OpenRouter and updates the internal cache.
   * @private
   * @throws {OpenRouterProviderError} If fetching or parsing models fails.
   */
  private async refreshAvailableModels(): Promise<void> {
    const response = await this.makeApiRequest<OpenRouterListModelsResponse>(
        '/models',
        'GET',
        this.config.requestTimeout
    );

    this.availableModelsCache.clear();
    response.data.forEach((apiModel: OpenRouterModelAPIObject) => {
      const modelInfo = this.mapApiToModelInfo(apiModel);
      this.availableModelsCache.set(modelInfo.modelId, modelInfo);
    });
  }

  /**
   * Maps an OpenRouter API model object to the standard ModelInfo interface.
   * @private
   */
  private mapApiToModelInfo(apiModel: OpenRouterModelAPIObject): ModelInfo {
    const capabilities: ModelInfo['capabilities'] = [];
    if (apiModel.architecture?.modality === 'text' || apiModel.architecture?.modality === 'multimodal') {
      capabilities.push('chat', 'completion'); // Assume most text models support chat/completion
    }
    if (apiModel.architecture?.modality === 'multimodal') {
      capabilities.push('vision_input');
    }
    // Inferring tool_use and json_mode is complex; depends on underlying model.
    // OpenRouter doesn't standardize this capability flag directly in the /models list.
    // For now, assume if it's a known advanced model (e.g., OpenAI), it might support it.
    if (apiModel.id.includes('gpt-3.5') || apiModel.id.includes('gpt-4') || apiModel.id.includes('claude-2') || apiModel.id.includes('claude-3') || apiModel.id.includes('gemini')) {
        capabilities.push('tool_use', 'json_mode');
    }
    // Embedding models are usually separate or need specific checking.
    // OpenRouter may not list all underlying embedding models explicitly in /models in a way that's easy to flag.
    // We rely on generateEmbeddings with a known embedding modelId.

    // Convert string pricing to numbers (per 1K tokens)
    const promptPricePer1K = parseFloat(apiModel.pricing.prompt) * 1000;
    const completionPricePer1K = parseFloat(apiModel.pricing.completion) * 1000;

    return {
      modelId: apiModel.id,
      providerId: this.providerId,
      displayName: apiModel.name,
      description: apiModel.description,
      capabilities,
      contextWindowSize: apiModel.context_length || undefined,
      pricePer1MTokensInput: isNaN(promptPricePer1K) ? undefined : promptPricePer1K / 1000, // Back to per 1M for consistency
      pricePer1MTokensOutput: isNaN(completionPricePer1K) ? undefined : completionPricePer1K / 1000, // Back to per 1M
      supportsStreaming: true, // Most models on OpenRouter support streaming via their API.
      status: 'active', // Assume active
    };
  }

  /**
   * Ensures the provider is initialized.
   * @private
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new OpenRouterProviderError(
        'OpenRouterProvider is not initialized. Call initialize() first.',
        'PROVIDER_NOT_INITIALIZED'
      );
    }
  }

  /**
   * Transforms standard ChatMessage array to OpenRouter's expected format.
   * OpenRouter generally mirrors OpenAI's chat message format.
   * @private
   */
  private mapToOpenRouterMessages(messages: ChatMessage[]): Array<Record<string, unknown>> {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      name: msg.name,
      tool_calls: msg.tool_calls,
      tool_call_id: msg.tool_call_id,
    }));
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
      stream: false,
      ...(options.temperature !== undefined && { temperature: options.temperature }),
      ...(options.topP !== undefined && { top_p: options.topP }),
      ...(options.maxTokens !== undefined && { max_tokens: options.maxTokens }),
      ...(options.presencePenalty !== undefined && { presence_penalty: options.presencePenalty }),
      ...(options.frequencyPenalty !== undefined && { frequency_penalty: options.frequencyPenalty }),
      ...(options.stopSequences !== undefined && { stop: options.stopSequences }),
      ...(options.userId !== undefined && { user: options.userId }), // Pass user ID if available
      ...(options.tools !== undefined && { tools: options.tools }),
      ...(options.toolChoice !== undefined && { tool_choice: options.toolChoice }),
      ...(options.responseFormat?.type === 'json_object' && { response_format: { type: 'json_object' } }),
      ...(options.customModelParams || {}),
    };

    const apiResponse = await this.makeApiRequest<OpenRouterChatCompletionResponse>(
        '/chat/completions',
        'POST',
        this.config.requestTimeout,
        payload
    );
    return this.mapApiToCompletionResponse(apiResponse, modelId);
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
      stream: true,
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
        this.config.streamRequestTimeout, // Longer timeout for streams
        payload,
        true // Expect stream
    );

    const accumulatedToolCalls: Map<number, { id?: string; type?: 'function'; function?: { name?: string; arguments?: string; } }> = new Map();

    for await (const chunk of this.parseSseStream(stream)) {
        if (chunk.startsWith('data: ') && chunk.includes('[DONE]')) { // OpenRouter specific [DONE] in data
             const doneData = chunk.substring('data: '.length).trim();
             if (doneData === '[DONE]') {
                // Check if there's any final message content before this specific DONE
                // This is a bit of an edge case for OpenRouter's specific stream termination.
                // Usually, the last content chunk has finish_reason.
                // This ensures the generator terminates cleanly.
                return;
             }
        }
      // Some providers via OpenRouter (like OpenAI) might send a simple "data: [DONE]"
      if (chunk === 'data: [DONE]') {
        return;
      }
      if (chunk.startsWith('data: ')) {
        const jsonData = chunk.substring('data: '.length);
        try {
          const apiChunk = JSON.parse(jsonData) as OpenRouterChatCompletionResponse;
          yield this.mapApiToStreamChunkResponse(apiChunk, modelId, accumulatedToolCalls);
          if (apiChunk.choices[0]?.finish_reason) return; // End if finish_reason is present
        } catch (error: unknown) {
          console.warn('OpenRouterProvider: Failed to parse stream chunk JSON:', jsonData, error);
        }
      }
    }
  }

  /** @inheritdoc */
  public async generateEmbeddings(
    modelId: string, // e.g., "text-embedding-ada-002", "sentence-transformers/all-minilm-l6-v2"
    texts: string[],
    options?: ProviderEmbeddingOptions
  ): Promise<ProviderEmbeddingResponse> {
    this.ensureInitialized();
    if (!texts || texts.length === 0) {
      throw new OpenRouterProviderError('Input texts array cannot be empty for embeddings.', 'EMBEDDING_NO_INPUT');
    }

    // OpenRouter uses the /embeddings endpoint for OpenAI-compatible embedding models.
    // For other types of embedding models, the behavior might differ or may not be supported via a generic endpoint.
    // Assume for now that `modelId` is an OpenAI-compatible one if no other logic is specified.
    // A more robust solution would check model capabilities.
    if (!modelId.includes('text-embedding') && !modelId.includes('openai/')) {
        console.warn(`OpenRouterProvider: Model '${modelId}' may not be an OpenAI-compatible embedding model. Attempting /embeddings endpoint.`);
    }

    const payload: Record<string, unknown> = {
      model: modelId,
      input: texts,
      ...(options?.encodingFormat && { encoding_format: options.encodingFormat }),
      ...(options?.customModelParams || {}),
      // Note: OpenRouter does not standardize 'dimensions' or 'inputType' in its own API for all models.
      // These would typically be part of customModelParams if the underlying model supports them.
    };

    const apiResponse = await this.makeApiRequest<OpenRouterEmbeddingResponse>(
      '/embeddings',
      'POST',
      this.config.requestTimeout,
      payload
    );

    return {
      object: 'list',
      data: apiResponse.data.map(d => ({
        object: 'embedding',
        embedding: d.embedding,
        index: d.index,
      })),
      model: apiResponse.model, // Model used, returned by OpenRouter
      usage: {
        prompt_tokens: apiResponse.usage.prompt_tokens,
        total_tokens: apiResponse.usage.total_tokens,
        costUSD: undefined, // OpenRouter cost for embeddings is complex; usually derived from overall usage.
                           // The /embeddings endpoint itself might not return specific cost.
      },
    };
  }

  /** @inheritdoc */
  public async listAvailableModels(filter?: { capability?: string }): Promise<ModelInfo[]> {
    this.ensureInitialized();
    // Using cached models from initialization
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
            await this.refreshAvailableModels(); // Attempt to refresh if model not found
        } catch (error) {
             console.warn(`OpenRouterProvider: Failed to refresh models while fetching info for ${modelId}`, error);
        }
    }
    return this.availableModelsCache.get(modelId);
  }

  /** @inheritdoc */
  public async checkHealth(): Promise<{ isHealthy: boolean; details?: unknown }> {
    try {
      // OpenRouter doesn't have a dedicated /health endpoint. Pinging /models is a common check.
      await this.makeApiRequest<OpenRouterListModelsResponse>(
          '/models',
          'GET',
          this.config.requestTimeout ? Math.min(this.config.requestTimeout, 10000) : 10000 // shorter timeout for health check
      );
      return { isHealthy: true, details: { message: "Successfully connected to OpenRouter /models endpoint." } };
    } catch (error: unknown) {
      const err = error as AxiosError | OpenRouterProviderError;
      return {
        isHealthy: false,
        details: {
          message: `OpenRouter health check failed: ${err.message}`,
          error: err,
        },
      };
    }
  }

  /** @inheritdoc */
  public async shutdown(): Promise<void> {
    this.isInitialized = false;
    console.log('OpenRouterProvider shutdown complete.');
    // No explicit resources like persistent connections to release for Axios-based client.
  }

  // --- Helper Methods ---

  /**
   * Maps OpenRouter API Chat Completion response to standard ModelCompletionResponse.
   * @private
   */
  private mapApiToCompletionResponse(
    apiResponse: OpenRouterChatCompletionResponse,
    requestedModelId: string
  ): ModelCompletionResponse {
    const choice = apiResponse.choices[0];
    const usage: ModelUsage | undefined = apiResponse.usage ? {
      promptTokens: apiResponse.usage.prompt_tokens,
      completionTokens: apiResponse.usage.completion_tokens,
      totalTokens: apiResponse.usage.total_tokens,
      costUSD: apiResponse.usage.cost, // OpenRouter might provide cost directly
    } : undefined;

    return {
      id: apiResponse.id,
      object: apiResponse.object,
      created: apiResponse.created,
      modelId: apiResponse.model || requestedModelId, // Use actual model from response if available
      choices: apiResponse.choices.map(c => ({
        index: c.index,
        message: { // Ensure structure matches ChatMessage
          role: c.message!.role,
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
    * Maps an OpenRouter API stream chunk to a ModelCompletionResponse chunk.
    * @private
    */
   private mapApiToStreamChunkResponse(
       apiChunk: OpenRouterChatCompletionResponse, // Re-using type, object indicates if it's a chunk
       requestedModelId: string,
       accumulatedToolCalls: Map<number, { id?: string; type?: 'function'; function?: { name?: string; arguments?: string; } }>
   ): ModelCompletionResponse {
       const choice = apiChunk.choices[0];
       let responseTextDelta: string | undefined;
       let toolCallsDeltas: ModelCompletionResponse['toolCallsDeltas'];
       let finalUsage: ModelUsage | undefined;

       if (choice?.delta?.content) {
           responseTextDelta = choice.delta.content;
       }

       if (choice?.delta?.tool_calls) {
           toolCallsDeltas = [];
           choice.delta.tool_calls.forEach(tcDelta => {
               let currentToolCall = accumulatedToolCalls.get(tcDelta.index);
               if (!currentToolCall) {
                   currentToolCall = { id: tcDelta.id, type: tcDelta.type, function: { name: '', arguments: ''} };
               }
               if (tcDelta.id) currentToolCall.id = tcDelta.id;
               if (tcDelta.type) currentToolCall.type = tcDelta.type as 'function';
               if (tcDelta.function?.name) currentToolCall.function!.name = (currentToolCall.function!.name || '') + tcDelta.function.name;
               if (tcDelta.function?.arguments) currentToolCall.function!.arguments = (currentToolCall.function!.arguments || '') + tcDelta.function.arguments;
               
               accumulatedToolCalls.set(tcDelta.index, currentToolCall);

               toolCallsDeltas!.push({
                   index: tcDelta.index,
                   id: tcDelta.id,
                   type: tcDelta.type as 'function',
                   function: tcDelta.function ? {
                       name: tcDelta.function.name,
                       arguments_delta: tcDelta.function.arguments
                   } : undefined,
               });
           });
       }

       const isFinal = !!choice?.finish_reason;
       if (isFinal && apiChunk.usage) { // Usage might be in the final chunk
           finalUsage = {
               promptTokens: apiChunk.usage.prompt_tokens,
               completionTokens: apiChunk.usage.completion_tokens,
               totalTokens: apiChunk.usage.total_tokens,
               costUSD: apiChunk.usage.cost,
           };
       }
       
       const responseChoice: ModelCompletionChoice = {
            index: choice.index,
            message: {
                role: choice.delta?.role || 'assistant',
                content: responseTextDelta || null,
                tool_calls: isFinal ? Array.from(accumulatedToolCalls.values()).map(accTc => ({
                    id: accTc.id!, type: accTc.type!, function: { name: accTc.function!.name!, arguments: accTc.function!.arguments! }
                })).filter(tc => tc.id && tc.function.name) : undefined,
            },
            finishReason: choice.finish_reason || null,
            logprobs: choice.logprobs,
       };


       return {
           id: apiChunk.id,
           object: apiChunk.object, // Should be "chat.completion.chunk"
           created: apiChunk.created,
           modelId: apiChunk.model || requestedModelId,
           choices: [responseChoice],
           responseTextDelta,
           toolCallsDeltas,
           isFinal,
           usage: finalUsage,
       };
   }


  /**
   * Makes an API request to OpenRouter with error handling.
   * @private
   */
  private async makeApiRequest<T = unknown>(
    endpoint: string,
    method: 'GET' | 'POST',
    timeout: number | undefined,
    body?: Record<string, unknown>,
    expectStream: boolean = false
  ): Promise<T> {
    try {
      const response = await this.client.request<T>({
        url: endpoint,
        method,
        data: body,
        timeout: timeout || this.config.requestTimeout, // Use specific timeout
        responseType: expectStream ? 'stream' : 'json',
      });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>; // Using 'any' for error response data as it can vary
      const status = axiosError.response?.status;
      const errorData = axiosError.response?.data;
      const errorMessage = errorData?.error?.message || errorData?.detail || (typeof errorData === 'string' ? errorData : axiosError.message) || 'Unknown OpenRouter API error';
      const errorType = errorData?.error?.type || (status ? `HTTP_${status}` : 'UNKNOWN_TYPE');

      throw new OpenRouterProviderError(
        errorMessage,
        axiosError.isAxiosError ? 'API_REQUEST_FAILED' : 'UNKNOWN_ERROR',
        status,
        errorType,
        { requestEndpoint: endpoint, requestBody: body, responseData: errorData, underlyingError: axiosError }
      );
    }
  }

  /**
   * Parses an SSE (Server-Sent Events) stream from OpenRouter.
   * @private
   */
  private async *parseSseStream(stream: NodeJS.ReadableStream): AsyncGenerator<string, void, undefined> {
    let buffer = '';
    try {
        for await (const chunk of stream) {
            buffer += chunk.toString();
            let eolIndex;
            while ((eolIndex = buffer.indexOf('\n')) >= 0) {
                const line = buffer.substring(0, eolIndex).trim();
                buffer = buffer.substring(eolIndex + 1);
                if (line) { // Only yield non-empty lines
                    yield line;
                }
            }
        }
        if (buffer.trim()) { // Process any remaining part in buffer
            yield buffer.trim();
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "OpenRouter stream parsing error";
        console.error("OpenRouterProvider: Error reading or parsing SSE stream:", message, error);
        throw new OpenRouterProviderError(message, 'STREAM_PARSING_ERROR', undefined, undefined, error);
    } finally {
        if (stream && typeof stream.destroy === 'function') {
            stream.destroy();
        }
    }
  }
}