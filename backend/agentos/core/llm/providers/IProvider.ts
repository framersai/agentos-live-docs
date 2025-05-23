// File: backend/agentos/core/llm/providers/IProvider.ts
/**
 * @fileoverview Defines the core interface for an AI Model Provider,
 * abstracting interactions with various LLM services (OpenAI, Ollama, OpenRouter, etc.).
 * It includes dedicated methods for text/chat completions, text embeddings, model introspection,
 * health checks, and lifecycle management.
 * @module backend/agentos/core/llm/providers/IProvider
 */

/**
 * Generic type for message content, which can be simple text or
 * a structured array for multimodal inputs (e.g., text and image parts).
 * This allows for flexibility in handling different types of content within a message.
 *
 * @example
 * const textContent: MessageContent = "Hello, world!";
 * const imageContent: MessageContent = [
 * { type: 'text', text: "Describe this image:" },
 * { type: 'image_url', image_url: { url: "data:image/jpeg;base64,..." } }
 * ];
 */
export type MessageContent =
  | string
  | Array<{
      type: 'text' | 'image_url' | string; // Extensible for other future content types
      text?: string;
      image_url?: {
        url: string;
        /** Specifies the detail level of the image if it's an image URL. 'auto' lets the model decide. */
        detail?: 'low' | 'high' | 'auto';
      };
      // Future: Potentially other modality-specific fields like 'audio_url', 'video_url'
    }>;

/**
 * Represents a single message in a conversation, conforming to a structure
 * widely adopted by chat-based LLM APIs.
 */
export interface ChatMessage {
  /** The role of the entity sending the message. */
  role: 'system' | 'user' | 'assistant' | 'tool';
  /** The content of the message. Can be simple text or structured for multimodal inputs. */
  content: MessageContent | null; // Null content is allowed by some providers, e.g. for tool calls.
  /**
   * An optional name for the message author.
   * For 'tool' role, this is the name of the tool.
   * For 'assistant' role with tool calls, it can be the assistant's identifier.
   * For 'user' role, it might identify a specific user in a multi-user chat.
   */
  name?: string;
  /** Identifier for the tool call, present in 'tool' role messages that are responses to a tool call. */
  tool_call_id?: string;
  /**
   * A list of tool calls requested by the assistant.
   * Present in 'assistant' role messages when the model decides to call tools.
   */
  tool_calls?: Array<{
    id: string;
    type: 'function'; // Currently, only 'function' type is widely supported.
    function: {
      name: string;
      /** JSON stringified arguments for the function. */
      arguments: string;
    };
  }>;
}

/**
 * General options for model completion requests (both chat and legacy text completion, though chat is prioritized).
 * These options control aspects like creativity, response length, and penalties.
 */
export interface ModelCompletionOptions {
  /**
   * Controls randomness: lower values make the output more focused and deterministic.
   * Higher values (e.g., 0.8) make it more random.
   * @type {number | undefined}
   * @minimum 0
   * @maximum 2
   */
  temperature?: number;
  /**
   * Nucleus sampling: the model considers only tokens with probabilities summing up to topP.
   * Lower values (e.g., 0.1) mean more restricted, less random output.
   * @type {number | undefined}
   * @minimum 0
   * @maximum 1
   */
  topP?: number;
  /**
   * The maximum number of tokens to generate in the completion.
   * The total length of input tokens and generated tokens is limited by the model's context length.
   * @type {number | undefined}
   */
  maxTokens?: number;
  /**
   * Positive values penalize new tokens based on whether they appear in the text so far,
   * increasing the model's likelihood to talk about new topics.
   * @type {number | undefined}
   * @minimum -2.0
   * @maximum 2.0
   */
  presencePenalty?: number;
  /**
   * Positive values penalize new tokens based on their existing frequency in the text so far,
   * decreasing the model's likelihood to repeat the same line verbatim.
   * @type {number | undefined}
   * @minimum -2.0
   * @maximum 2.0
   */
  frequencyPenalty?: number;
  /**
   * Sequences where the API will stop generating further tokens.
   * The returned text will not contain the stop sequence.
   * @type {string[] | undefined}
   */
  stopSequences?: string[];
  /**
   * A unique identifier representing your end-user, which can help providers monitor and detect abuse.
   * @type {string | undefined}
   */
  userId?: string;
  /**
   * Allows overriding the default API key for a specific user or request, if the provider supports it.
   * Use with caution and ensure secure handling.
   * @type {string | undefined}
   */
  apiKeyOverride?: string;
  /**
   * For provider-specific parameters not covered by the common options.
   * Should be used sparingly to maintain provider agnosticism.
   * @type {Record<string, unknown> | undefined}
   */
  customModelParams?: Record<string, unknown>;
  /**
   * Indicates if a streaming response is expected. This should be true when calling `generateCompletionStream`.
   * @type {boolean | undefined}
   */
  stream?: boolean;
  /**
   * Schemas of tools the model can call. Used for function calling capabilities.
   * The schema format typically follows JSON Schema.
   * @type {Array<Record<string, unknown>> | undefined}
   */
  tools?: Array<Record<string, unknown>>; // Should be more specific, e.g., ToolDefinition interface based on OpenAI's spec
  /**
   * Controls how the model uses tools.
   * Can be "none", "auto", or an object specifying a particular function to call.
   * Example: `{ type: "function", function: { name: "my_function" } }`
   * @type {string | Record<string, unknown> | undefined}
   */
  toolChoice?: string | Record<string, unknown>; // e.g. "auto", "none", or {type: "function", function: {name: "my_tool"}}
  /**
   * Specifies the format of the response, e.g. for JSON mode.
   * Example: `{ type: "json_object" }` for OpenAI.
   * @type {{ type: 'text' | 'json_object' | string } | undefined}
   */
  responseFormat?: { type: 'text' | 'json_object' | string };
}

/**
 * Represents token usage information from a model call, including cost estimation.
 */
export interface ModelUsage {
  /** Number of tokens in the input prompt. */
  promptTokens?: number;
  /** Number of tokens generated in the completion. */
  completionTokens?: number;
  /** Total number of tokens processed (prompt + completion). */
  totalTokens: number;
  /** Estimated cost for this specific model call in USD. */
  costUSD?: number;
}

/**
 * Represents a single choice in a model's completion response.
 * Typically, there's one choice unless N > 1 is requested (not a common option here).
 */
export interface ModelCompletionChoice {
  /** Index of the choice in the list of choices. */
  index: number;
  /** The message generated by the model (for chat models). */
  message: ChatMessage;
  /** The text generated by the model (for older text completion models, less common now). */
  text?: string; // Primarily for older text-completion models
  /**
   * Log probabilities of tokens, if requested and supported.
   * Structure can be complex and provider-specific.
   */
  logprobs?: unknown; // Structure can be complex and provider-specific
  /**
   * The reason the model stopped generating tokens.
   * e.g., 'stop' (natural stop or stop sequence), 'length' (maxTokens limit),
   * 'tool_calls' (model is calling tools), 'content_filter'.
   */
  finishReason: string | null;
}

/**
 * Represents the full response from a model completion call (non-streaming or a single chunk of a stream).
 */
export interface ModelCompletionResponse {
  /** Unique ID for the completion, provided by the LLM provider. */
  id: string;
  /** Type of object (e.g., 'chat.completion', 'text_completion', 'chat.completion.chunk'). */
  object: string;
  /** Timestamp of when the completion was created (Unix epoch seconds). */
  created: number;
  /** Model ID used for this completion. */
  modelId: string;
  /** A list of completion choices. Usually one, unless multiple completions were requested (N > 1). */
  choices: ModelCompletionChoice[];
  /** Token usage information for the request, if available. */
  usage?: ModelUsage;
  /**
   * Provider-level error for this specific request, if one occurred.
   * This is distinct from HTTP errors which might be handled at a lower level.
   */
  error?: {
    message: string;
    type?: string;
    code?: string | number;
    details?: unknown;
  };
  /**
   * For streaming responses: the delta of text content in the current chunk.
   * Use this to append to the ongoing response.
   */
  responseTextDelta?: string;
  /**
   * For streaming responses: deltas for tool calls in the current chunk.
   * These need to be accumulated to form complete tool call requests.
   */
  toolCallsDeltas?: Array<{
    index: number; // Index of the tool call, for accumulation
    id?: string;
    type?: 'function';
    function?: {
      name?: string;
      arguments_delta?: string; // Argument chunks
    };
  }>;
  /** Indicates if this is the final chunk in a stream. */
  isFinal?: boolean;
}

/**
 * Options for embedding generation requests at the provider level.
 */
export interface ProviderEmbeddingOptions {
  /**
   * The model ID to use for embeddings. Some providers might require this in options
   * rather than as a top-level parameter to `generateEmbeddings`.
   * If provided here, it might override the modelId passed to `generateEmbeddings`.
   */
  model?: string;
  /**
   * A unique identifier representing your end-user, which can help providers monitor and detect abuse.
   * @type {string | undefined}
   */
  userId?: string;
  /**
   * Allows overriding the default API key for a specific user or request.
   * @type {string | undefined}
   */
  apiKeyOverride?: string;
  /**
   * For provider-specific embedding parameters not covered by common options.
   * @type {Record<string, unknown> | undefined}
   */
  customModelParams?: Record<string, unknown>;
  /**
   * Optional: Desired format of the returned embeddings.
   * 'float' is typical for direct use, 'base64' for some storage/transport scenarios.
   * @type {('float' | 'base64') | undefined}
   */
  encodingFormat?: 'float' | 'base64';
  /**
   * Optional: Request specific dimensions for the embedding vectors if the model supports it
   * (e.g., some newer OpenAI models like text-embedding-3-small allow this).
   * @type {number | undefined}
   */
  dimensions?: number;
  /**
   * Optional: Specifies the type of input text, which can help some models optimize embeddings.
   * (e.g., OpenAI's embedding models can take `input_type`).
   * @type {('search_document' | 'search_query' | 'classification' | 'clustering' | string) | undefined}
   */
  inputType?: 'search_document' | 'search_query' | 'classification' | 'clustering' | string;
}

/**
 * Represents a single vector embedding object as returned by a provider.
 */
export interface EmbeddingObject {
  /** Type of object, typically 'embedding'. */
  object: 'embedding';
  /** The numerical vector embedding. */
  embedding: number[];
  /** The index of this embedding in the batch request. */
  index: number;
}

/**
 * Represents the response from an embedding generation call from a provider.
 */
export interface ProviderEmbeddingResponse {
  /** Type of object, typically 'list' indicating a list of embedding objects. */
  object: 'list';
  /** The array of embedding objects, one for each input text. */
  data: EmbeddingObject[];
  /** The model ID used for generating these embeddings. */
  model: string;
  /** Token usage information for the embedding request. */
  usage: {
    prompt_tokens: number;
    total_tokens: number; // For some providers, completion_tokens is not applicable or is 0 for embeddings.
    costUSD?: number; // Estimated cost for this embedding request.
  };
  /** Provider-level error for this specific request, if one occurred. */
  error?: {
    message: string;
    type?: string;
    code?: string | number;
    details?: unknown;
  };
}

/**
 * Represents detailed information about a specific AI model available from a provider.
 * This data is crucial for model selection, routing, and understanding capabilities.
 */
export interface ModelInfo {
  /** The unique identifier for the model (e.g., "gpt-4o", "ollama/llama3"). */
  modelId: string;
  /** The identifier of the provider offering this model (e.g., "openai", "ollama"). */
  providerId: string;
  /** A user-friendly display name for the model. */
  displayName?: string;
  /** A brief description of the model, its strengths, or use cases. */
  description?: string;
  /**
   * A list of capabilities the model supports.
   * Examples: 'chat', 'completion', 'embeddings', 'vision_input', 'tool_use', 'json_mode'.
   * This should be an extensible list of well-defined strings.
   */
  capabilities: Array<'completion' | 'chat' | 'embeddings' | 'vision_input' | 'tool_use' | 'json_mode' | string>;
  /** Maximum number of tokens the model can process in a single context (prompt + completion). */
  contextWindowSize?: number;
  /** Maximum number of input tokens specifically for embeddings or other non-completion tasks, if different from contextWindowSize. */
  inputTokenLimit?: number;
  /** Maximum number of output tokens the model can generate in a completion, if different from contextWindowSize. */
  outputTokenLimit?: number;
  /** Cost per 1 million input tokens in USD. */
  pricePer1MTokensInput?: number;
  /** Cost per 1 million output tokens in USD (for completions). */
  pricePer1MTokensOutput?: number;
  /** Cost per 1 million total tokens in USD (for embeddings or simpler models where input/output distinction is not made). */
  pricePer1MTokensTotal?: number; // Alternative for models like embeddings
  /** Indicates if the model supports streaming responses for completions. */
  supportsStreaming?: boolean;
  /** Default temperature setting typically recommended for this model, if any. */
  defaultTemperature?: number;
  /**
   * If AgentOS implements internal tiering, this specifies the minimum user subscription tier
   * required to access this model through the platform.
   */
  minSubscriptionTierLevel?: number;
  /** Whether this is a default or recommended model for the provider or for general use. */
  isDefaultModel?: boolean;
  /** For embedding models, the dimensionality of the generated vectors. */
  embeddingDimension?: number;
  /** Date when the model was last updated or became available, in ISO 8601 format. */
  lastUpdated?: string;
  /** Current status of the model (e.g., 'active', 'beta', 'deprecated'). */
  status?: 'active' | 'beta' | 'deprecated' | string;
}


/**
 * @interface IProvider
 * @description Defines the contract for an AI Model Provider.
 * Implementations will connect to specific services like OpenAI, Ollama, OpenRouter, etc.,
 * providing a standardized way to interact with various LLMs for completions and embeddings,
 * as well as to query model capabilities and manage the provider's lifecycle.
 */
export interface IProvider {
  /** A unique identifier for the provider (e.g., "openai", "ollama", "openrouter"). Must be consistent. */
  readonly providerId: string;

  /** Indicates if the provider has been successfully initialized and is ready for use. */
  readonly isInitialized: boolean;

  /** The default model ID for this provider, if one is designated (e.g., "gpt-4o" for OpenAI). */
  readonly defaultModelId?: string;

  /**
   * Initializes the provider with necessary configuration.
   * This method should establish connections, verify API keys (if applicable),
   * and prepare the provider for use. It might also fetch initial model lists.
   * @async
   * @param {Record<string, any>} config - Provider-specific configuration object.
   * This can include API keys, base URLs, timeouts, default settings, etc.
   * @returns {Promise<void>} A promise that resolves when initialization is complete.
   * @throws {ProviderError} If initialization fails (e.g., invalid API key, connection error).
   *
   * @example
   * const openAIProvider = new OpenAIProvider();
   * await openAIProvider.initialize({ apiKey: "sk-...", requestTimeout: 60000 });
   */
  initialize(config: Record<string, any>): Promise<void>;

  /**
   * Generates a text or chat completion based on the provided model, messages, and options.
   * This method is for non-streaming responses.
   * @async
   * @param {string} modelId - The specific model ID to use for this completion (e.g., "gpt-4o").
   * @param {ChatMessage[]} messages - An array of messages forming the conversation history and current prompt.
   * @param {ModelCompletionOptions} options - Options controlling the completion generation process (e.g., temperature, maxTokens).
   * @returns {Promise<ModelCompletionResponse>} The full completion response from the model, including choices and usage data.
   * @throws {ProviderError} If the completion request fails.
   *
   * @example
   * const response = await provider.generateCompletion(
   * "gpt-4o",
   * [{ role: "user", content: "Tell me a joke." }],
   * { maxTokens: 50, temperature: 0.7 }
   * );
   * console.log(response.choices[0].message.content);
   */
  generateCompletion(
    modelId: string,
    messages: ChatMessage[],
    options: ModelCompletionOptions
  ): Promise<ModelCompletionResponse>;

  /**
   * Generates a text or chat completion as an asynchronous stream of response chunks.
   * Each yielded chunk contains a delta of the response.
   * @async
   * @generator
   * @param {string} modelId - The specific model ID to use.
   * @param {ChatMessage[]} messages - An array of messages forming the conversation history and prompt.
   * @param {ModelCompletionOptions} options - Options for the completion request. `stream` should implicitly or explicitly be true.
   * @yields {ModelCompletionResponse} Each chunk of the streamed response.
   * The `responseTextDelta` or `toolCallsDeltas` will contain the new content.
   * The `isFinal` flag in the yielded object indicates the end of the stream and may contain final usage stats.
   * @returns {AsyncGenerator<ModelCompletionResponse, void, undefined>} An async generator yielding response chunks.
   * @throws {ProviderError} If the streaming request setup or processing fails.
   *
   * @example
   * for await (const chunk of provider.generateCompletionStream(
   * "gpt-4o",
   * [{ role: "user", content: "Write a short story." }],
   * { maxTokens: 200 }
   * )) {
   * if (chunk.responseTextDelta) process.stdout.write(chunk.responseTextDelta);
   * if (chunk.isFinal) console.log("\nStream finished. Usage:", chunk.usage);
   * }
   */
  generateCompletionStream(
    modelId: string,
    messages: ChatMessage[],
    options: ModelCompletionOptions
  ): AsyncGenerator<ModelCompletionResponse, void, undefined>;

  /**
   * Generates vector embeddings for a batch of input texts using a specified embedding model.
   * @async
   * @param {string} modelId - The specific embedding model ID to use (e.g., "text-embedding-3-small").
   * @param {string[]} texts - An array of text strings to embed. Providers may have limits on batch size or total text length.
   * @param {ProviderEmbeddingOptions} [options] - Optional parameters for the embedding request, like dimensions or input type.
   * @returns {Promise<ProviderEmbeddingResponse>} The response containing an array of embedding objects and usage data.
   * @throws {ProviderError} If the provider or model does not support embeddings, or if an API error occurs.
   *
   * @example
   * const embeddingsResponse = await provider.generateEmbeddings(
   * "text-embedding-ada-002",
   * ["Hello world", "Another document"],
   * { inputType: "search_document" }
   * );
   * embeddingsResponse.data.forEach(emb => console.log(emb.embedding.slice(0, 3)));
   */
  generateEmbeddings(
    modelId: string,
    texts: string[],
    options?: ProviderEmbeddingOptions
  ): Promise<ProviderEmbeddingResponse>;

  /**
   * Lists available models from this provider, optionally filtered by capability or other criteria.
   * @async
   * @param {object} [filter] - Optional filter criteria.
   * @param {('completion' | 'chat' | 'embeddings' | string)} [filter.capability] - Filter by a specific model capability.
   * @returns {Promise<ModelInfo[]>} A list of available models with their details.
   * @throws {ProviderError} If fetching the model list fails.
   *
   * @example
   * const chatModels = await provider.listAvailableModels({ capability: 'chat' });
   * console.log(chatModels.map(m => m.modelId));
   */
  listAvailableModels(filter?: { capability?: 'completion' | 'chat' | 'embeddings' | string }): Promise<ModelInfo[]>;

  /**
   * Retrieves detailed information about a specific model offered by this provider.
   * @async
   * @param {string} modelId - The ID of the model to get information for.
   * @returns {Promise<ModelInfo | undefined>} Detailed model information, or undefined if the model is not found or recognized.
   * @throws {ProviderError} If the request for model information fails.
   *
   * @example
   * const info = await provider.getModelInfo("gpt-4o");
   * if (info) console.log(`Context window for gpt-4o: ${info.contextWindowSize}`);
   */
  getModelInfo(modelId: string): Promise<ModelInfo | undefined>;

  /**
   * Checks the health or status of the provider's connection and service availability.
   * This might involve a lightweight API call to the provider's status endpoint or a simple connectivity test.
   * @async
   * @returns {Promise<{isHealthy: boolean, details?: unknown}>} An object indicating health status and optional details.
   * `isHealthy` is true if the provider is reachable and operational, false otherwise.
   * `details` can contain additional information like latency, error messages, or specific service statuses.
   *
   * @example
   * const health = await provider.checkHealth();
   * if (health.isHealthy) console.log(`${provider.providerId} is healthy.`);
   * else console.error(`${provider.providerId} is unhealthy:`, health.details);
   */
  checkHealth(): Promise<{isHealthy: boolean, details?: unknown}>;

  /**
   * Shuts down the provider, performing any necessary cleanup such as closing open connections
   * or releasing resources. This is important for graceful termination of the application.
   * @async
   * @returns {Promise<void>} A promise that resolves when shutdown is complete.
   * @throws {ProviderError} If an error occurs during shutdown.
   *
   * @example
   * await provider.shutdown();
   * console.log(`${provider.providerId} has been shut down.`);
   */
  shutdown(): Promise<void>;
}