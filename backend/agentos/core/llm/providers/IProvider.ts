// File: backend/agentos/core/llm/providers/IProvider.ts
/**
 * @fileoverview Defines the core interface for an AI Model Provider,
 * abstracting interactions with various LLM services (OpenAI, Ollama, OpenRouter, etc.).
 * It includes dedicated methods for text/chat completions, text embeddings, model introspection,
 * health checks, and lifecycle management.
 * @module backend/agentos/core/llm/providers/IProvider
 */

/**
 * Represents a part of a multimodal message content.
 */
export type MessageContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string; detail?: 'low' | 'high' | 'auto'; } }
  // For Anthropic tool results specifically, fitting their API:
  | { type: 'tool_result'; tool_use_id: string; content?: string | Array<Record<string, any>>; is_error?: boolean; }
  // Fallback for other potential string types for extensibility
  | { type: string; [key: string]: any };


/**
 * Generic type for message content, which can be simple text or
 * a structured array for multimodal inputs (e.g., text and image parts).
 */
export type MessageContent = string | Array<MessageContentPart>;

/**
 * Represents a single message in a conversation, conforming to a structure
 * widely adopted by chat-based LLM APIs.
 */
export interface ChatMessage {
  /** The role of the entity sending the message. */
  role: 'system' | 'user' | 'assistant' | 'tool';
  /** The content of the message. Can be simple text or structured for multimodal inputs. */
  content: MessageContent | null;
  /** An optional name for the message author. */
  name?: string;
  /** Identifier for the tool call, present in 'tool' role messages that are responses to a tool call. */
  tool_call_id?: string;
  /** A list of tool calls requested by the assistant. */
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string;
    };
  }>;
}

// ... (rest of IProvider.ts remains the same as provided by user initially)
// ... (ensure ModelCompletionOptions, ModelUsage, ModelCompletionChoice, ModelCompletionResponse, etc. are correctly defined or imported if they were part of the "..." )


/**
 * General options for model completion requests (both chat and legacy text completion, though chat is prioritized).
 * These options control aspects like creativity, response length, and penalties.
 */
export interface ModelCompletionOptions {
  /**
   * Controls randomness: lower values make the output more focused and deterministic.
   * Higher values (e.g., 0.8) make it more random.
   */
  temperature?: number;
  /**
   * Nucleus sampling: the model considers only tokens with probabilities summing up to topP.
   * Lower values (e.g., 0.1) mean more restricted, less random output.
   */
  topP?: number;
  /**
   * The maximum number of tokens to generate in the completion.
   */
  maxTokens?: number;
  /**
   * Positive values penalize new tokens based on whether they appear in the text so far,
   * increasing the model's likelihood to talk about new topics.
   */
  presencePenalty?: number;
  /**
   * Positive values penalize new tokens based on their existing frequency in the text so far,
   * decreasing the model's likelihood to repeat the same line verbatim.
   */
  frequencyPenalty?: number;
  /** Sequences where the API will stop generating further tokens. */
  stopSequences?: string[];
  /** A unique identifier representing your end-user. */
  userId?: string;
  /** Allows overriding the default API key for a specific user or request. */
  apiKeyOverride?: string;
  /** For provider-specific parameters not covered by the common options. */
  customModelParams?: Record<string, unknown>;
  /** Indicates if a streaming response is expected. */
  stream?: boolean;
  /** Schemas of tools the model can call. */
  tools?: Array<Record<string, unknown>>;
  /** Controls how the model uses tools. */
  toolChoice?: string | Record<string, unknown>;
  /** Specifies the format of the response, e.g. for JSON mode. */
  responseFormat?: { type: 'text' | 'json_object' | string };
}

/**
 * Represents token usage information from a model call, including cost estimation.
 */
export interface ModelUsage {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens: number;
  costUSD?: number;
}

/**
 * Represents a single choice in a model's completion response.
 */
export interface ModelCompletionChoice {
  index: number;
  message: ChatMessage;
  text?: string;
  logprobs?: unknown;
  finishReason: string | null;
}

/**
 * Represents the full response from a model completion call (non-streaming or a single chunk of a stream).
 */
export interface ModelCompletionResponse {
  id: string;
  object: string;
  created: number;
  modelId: string;
  choices: ModelCompletionChoice[];
  usage?: ModelUsage;
  error?: {
    message: string;
    type?: string;
    code?: string | number;
    details?: unknown;
  };
  responseTextDelta?: string;
  toolCallsDeltas?: Array<{
    index: number;
    id?: string;
    type?: 'function';
    function?: {
      name?: string;
      arguments_delta?: string;
    };
  }>;
  isFinal?: boolean;
}

/**
 * Options for embedding generation requests at the provider level.
 */
export interface ProviderEmbeddingOptions {
  model?: string;
  userId?: string;
  apiKeyOverride?: string;
  customModelParams?: Record<string, unknown>;
  encodingFormat?: 'float' | 'base64';
  dimensions?: number;
  inputType?: 'search_document' | 'search_query' | 'classification' | 'clustering' | string;
}

/**
 * Represents a single vector embedding object as returned by a provider.
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
  object: 'list';
  data: EmbeddingObject[];
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
    costUSD?: number;
  };
  error?: {
    message: string;
    type?: string;
    code?: string | number;
    details?: unknown;
  };
}

/**
 * Represents detailed information about a specific AI model available from a provider.
 */
export interface ModelInfo {
  modelId: string;
  providerId: string;
  displayName?: string;
  description?: string;
  capabilities: Array<'completion' | 'chat' | 'embeddings' | 'vision_input' | 'tool_use' | 'json_mode' | string>;
  contextWindowSize?: number;
  inputTokenLimit?: number;
  outputTokenLimit?: number;
  pricePer1MTokensInput?: number;
  pricePer1MTokensOutput?: number;
  pricePer1MTokensTotal?: number;
  supportsStreaming?: boolean;
  defaultTemperature?: number;
  minSubscriptionTierLevel?: number;
  isDefaultModel?: boolean;
  embeddingDimension?: number;
  lastUpdated?: string;
  status?: 'active' | 'beta' | 'deprecated' | string;
}

/**
 * @interface IProvider
 * @description Defines the contract for an AI Model Provider.
 */
export interface IProvider {
  readonly providerId: string;
  readonly isInitialized: boolean;
  readonly defaultModelId?: string;

  initialize(config: Record<string, any>): Promise<void>;

  generateCompletion(
    modelId: string,
    messages: ChatMessage[],
    options: ModelCompletionOptions
  ): Promise<ModelCompletionResponse>;

  generateCompletionStream(
    modelId: string,
    messages: ChatMessage[],
    options: ModelCompletionOptions
  ): AsyncGenerator<ModelCompletionResponse, void, undefined>;

  generateEmbeddings(
    modelId: string,
    texts: string[],
    options?: ProviderEmbeddingOptions
  ): Promise<ProviderEmbeddingResponse>;

  listAvailableModels(filter?: { capability?: 'completion' | 'chat' | 'embeddings' | string }): Promise<ModelInfo[]>;

  getModelInfo(modelId: string): Promise<ModelInfo | undefined>;

  checkHealth(): Promise<{isHealthy: boolean, details?: unknown}>;

  shutdown(): Promise<void>;
}