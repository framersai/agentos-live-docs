// backend/agentos/core/llm/providers/IProvider.ts

/**
 * @fileoverview Defines the core interface for an AI Model Provider,
 * abstracting interactions with various LLM services (OpenAI, Ollama, etc.).
 * It now includes dedicated methods for both text/chat completions and text embeddings.
 * @module backend/agentos/core/llm/providers/IProvider
 */

/**
 * Generic type for message content, which can be simple text or
 * a structured array for multimodal inputs (e.g., text and image parts).
 */
export type MessageContent =
  | string
  | Array<{
      type: 'text' | 'image_url' | string; // Extensible for other types
      text?: string;
      image_url?: { url: string; detail?: 'low' | 'high' | 'auto' };
      // Potentially other modality-specific fields
    }>;

/**
 * Represents a single message in a conversation.
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: MessageContent;
  name?: string; // Optional name for the message author (e.g., tool name)
  tool_call_id?: string; // For tool response messages
  tool_calls?: Array<{ // For assistant messages requesting tool calls
    id: string;
    type: 'function';
    function: { name: string; arguments: string };
  }>;
}

/**
 * General options for model completion requests (chat or text).
 */
export interface ModelCompletionOptions {
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  stopSequences?: string[];
  userId?: string; // For tracking and potential policy enforcement
  apiKeyOverride?: string; // If a user-specific API key should be used
  customModelParams?: Record<string, any>; // For provider-specific parameters not covered
  stream?: boolean; // Indicates if streaming response is expected (for generateCompletionStream)
  isEmbeddingRequest?: boolean; // DEPRECATED: Use generateEmbeddings method instead.
  tools?: Array<any>; // Tool schemas for function calling
  toolChoice?: string | object; // Specific tool choice
}

/**
 * Represents token usage information from a model call.
 */
export interface ModelUsage {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens: number;
  costUSD?: number; // Estimated cost for this specific call
}

/**
 * Represents a single choice in a model's completion response.
 */
export interface ModelCompletionChoice {
  index: number;
  message: ChatMessage; // For chat models
  text?: string; // For older text completion models
  logprobs?: any;
  finishReason: string | null; // e.g., 'stop', 'length', 'tool_calls', 'content_filter'
}

/**
 * Represents the full response from a model completion call (non-streaming).
 */
export interface ModelCompletionResponse {
  id: string; // Unique ID for the completion
  object: string; // Type of object (e.g., 'chat.completion', 'text_completion')
  created: number; // Timestamp of creation
  modelId: string; // Model ID used for the completion
  choices: ModelCompletionChoice[];
  usage?: ModelUsage;
  error?: { // If an error occurred at the provider level for this request
    message: string;
    type?: string;
    code?: string | number;
    details?: any;
  };
  // For streaming, this might represent the final aggregated response or a single chunk.
  // If streaming, deltas would be inside choices[0].message.content or choices[0].delta
  responseTextDelta?: string; // For streaming text
  toolCallsDeltas?: Array<{ id?: string; type: 'function'; function?: { name?: string; arguments_delta?: string } }>; // For streaming tool calls
  isFinal?: boolean; // Indicates if this is the final chunk in a stream
}

// --- New Types for Embedding Generation ---

/**
 * Options for embedding generation requests at the provider level.
 */
export interface ProviderEmbeddingOptions {
  model?: string; // Some providers might require the model in options rather than as a top-level param
  userId?: string;
  apiKeyOverride?: string;
  customModelParams?: Record<string, any>; // For provider-specific embedding parameters
  encodingFormat?: 'float' | 'base64'; // Optional: format of the returned embeddings
  dimensions?: number; // Optional: Request specific dimensions if model supports it (e.g. OpenAI new models)
  inputType?: 'search_document' | 'search_query' | 'classification' | 'clustering'; // OpenAI specific
}

/**
 * Represents a single embedding object from a provider.
 */
export interface EmbeddingObject {
  object: 'embedding';
  embedding: number[];
  index: number;
}

/**
 * Represents the response from an embedding generation call from a provider.
 */
export interface ProviderEmbeddingResponse {
  object: 'list'; // Typically a list of embedding objects
  data: EmbeddingObject[];
  model: string; // The model ID used for generating embeddings
  usage: { // Token usage for the embedding request
    prompt_tokens: number;
    total_tokens: number;
    costUSD?: number; // Estimated cost for this embedding request
  };
  error?: {
    message: string;
    type?: string;
    code?: string | number;
    details?: any;
  };
}

// --- End New Types for Embedding Generation ---


/**
 * @interface IProvider
 * @description Defines the contract for an AI Model Provider.
 * Implementations will connect to specific services like OpenAI, Ollama, OpenRouter, etc.
 */
export interface IProvider {
  /** Unique identifier for the provider (e.g., "openai", "ollama"). */
  readonly providerId: string;

  /**
   * Initializes the provider with necessary configuration.
   * @async
   * @param {Record<string, any>} config - Provider-specific configuration (e.g., API keys, base URLs).
   * @returns {Promise<void>}
   */
  initialize(config: Record<string, any>): Promise<void>;

  /**
   * Generates a text or chat completion based on the provided messages and options.
   * For non-streaming responses.
   * @async
   * @param {string} modelId - The specific model ID to use.
   * @param {ChatMessage[]} messages - An array of messages forming the conversation history and prompt.
   * @param {ModelCompletionOptions} options - Options for the completion request.
   * @returns {Promise<ModelCompletionResponse>} The full completion response from the model.
   */
  generateCompletion(
    modelId: string,
    messages: ChatMessage[],
    options: ModelCompletionOptions
  ): Promise<ModelCompletionResponse>;

  /**
   * Generates a text or chat completion as an asynchronous stream.
   * @async
   * @generator
   * @param {string} modelId - The specific model ID to use.
   * @param {ChatMessage[]} messages - An array of messages forming the conversation history and prompt.
   * @param {ModelCompletionOptions} options - Options for the completion request (stream should be true).
   * @yields {ModelCompletionResponse} Each chunk of the streamed response.
   * The `isFinal` flag in the yielded object indicates the end of the stream.
   */
  generateCompletionStream(
    modelId: string,
    messages: ChatMessage[],
    options: ModelCompletionOptions
  ): AsyncGenerator<ModelCompletionResponse, void, undefined>;

  /**
   * Generates vector embeddings for a batch of input texts using a specified model.
   * @async
   * @param {string} modelId - The specific embedding model ID to use.
   * @param {string[]} texts - An array of texts to embed.
   * @param {ProviderEmbeddingOptions} [options] - Optional parameters for the embedding request.
   * @returns {Promise<ProviderEmbeddingResponse>} The response containing embeddings and usage data.
   * @throws {Error} If the provider or model does not support embeddings or an API error occurs.
   */
  generateEmbeddings(
    modelId: string,
    texts: string[],
    options?: ProviderEmbeddingOptions
  ): Promise<ProviderEmbeddingResponse>;

  /**
   * Lists available models from this provider, optionally filtered by capability.
   * @async
   * @param {{ capability?: 'completion' | 'chat' | 'embeddings' | string }} [filter] - Optional filter.
   * @returns {Promise<ModelInfo[]>} A list of available models with their details.
   */
  listAvailableModels(filter?: { capability?: 'completion' | 'chat' | 'embeddings' | string }): Promise<ModelInfo[]>;

  /**
   * Retrieves detailed information about a specific model.
   * @async
   * @param {string} modelId - The ID of the model to get info for.
   * @returns {Promise<ModelInfo | undefined>} Detailed model information or undefined if not found.
   */
  getModelInfo(modelId: string): Promise<ModelInfo | undefined>;

  /**
   * Checks the health or status of the provider's connection/service.
   * @async
   * @returns {Promise<{isHealthy: boolean, details?: any}>} Health status.
   */
  checkHealth(): Promise<{isHealthy: boolean, details?: any}>;

  /**
   * Shuts down the provider, closing any open connections.
   * @async
   * @returns {Promise<void>}
   */
  shutdown(): Promise<void>;
}

/**
 * @interface ModelInfo
 * @description Represents information about a specific AI model available from a provider.
 */
export interface ModelInfo {
  modelId: string;
  providerId: string;
  displayName?: string;
  description?: string;
  capabilities: Array<'completion' | 'chat' | 'embeddings' | 'vision_input' | 'tool_use' | string>;
  contextWindowSize?: number; // Max tokens (prompt + completion)
  inputTokenLimit?: number; // Max input tokens for embeddings or specific tasks
  outputTokenLimit?: number; // Max output tokens for completions
  pricePer1MTokensInput?: number; // Cost per 1 million input tokens in USD
  pricePer1MTokensOutput?: number; // Cost per 1 million output tokens in USD (for completions)
  pricePer1MTokensTotal?: number; // Cost per 1 million total tokens (for embeddings or simpler models)
  supportsStreaming?: boolean;
  defaultTemperature?: number;
  minSubscriptionTierLevel?: number; // If applicable for AgentOS internal tiering
  isDefaultModel?: boolean; // Whether this is a default model for the provider
  embeddingDimension?: number; // For embedding models
}