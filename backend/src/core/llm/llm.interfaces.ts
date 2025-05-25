// File: backend/src/core/llm/llm.interfaces.ts

/**
 * @file Defines interfaces for Large Language Model (LLM) services and configurations.
 * @description This file specifies the contracts for interacting with different LLM providers,
 * managing their configurations, and handling responses in a standardized way.
 * It supports the architectural goal of provider flexibility (e.g., OpenAI, OpenRouter).
 * @version 1.0.0
 */

/**
 * Represents a single message in a chat conversation.
 * Aligns with common LLM API structures.
 */
export interface IChatMessage {
  /**
   * The role of the message sender.
   * 'system' messages provide instructions to the AI.
   * 'user' messages are from the end-user.
   * 'assistant' messages are responses from the AI.
   */
  role: 'system' | 'user' | 'assistant';

  /**
   * The text content of the message.
   */
  content: string;

  /**
   * Optional name of the participant.
   * Can be used to specify the function name if the message is a function call response.
   */
  name?: string;
  // Future: tool_calls, tool_call_id could be added for more advanced function calling
}

/**
 * Represents the usage statistics returned by an LLM API call.
 */
export interface ILlmUsage {
  /**
   * The number of tokens in the prompt. Can be null if not provided by the API.
   */
  prompt_tokens: number | null;

  /**
   * The number of tokens in the generated completion. Can be null if not provided by the API.
   */
  completion_tokens: number | null;

  /**
   * The total number of tokens used in the request (prompt + completion). Can be null if not provided by the API.
   */
  total_tokens: number | null;
}

/**
 * Represents a standardized response from an LLM service.
 */
export interface ILlmResponse {
  /**
   * The primary text content of the AI's response.
   * This can be null if the response is, for example, a tool call.
   */
  text: string | null;

  /**
   * The identifier of the model that generated the response.
   * e.g., "openai/gpt-4o-mini", "openrouter/anthropic/claude-3-opus"
   */
  model: string;

  /**
   * Optional usage statistics for the API call.
   */
  usage?: ILlmUsage;

  /**
   * Optional unique identifier for the request or response, if provided by the LLM.
   */
  id?: string;

  /**
   * Optional stop reason, if provided by the LLM.
   * e.g., "stop", "length", "tool_calls"
   */
  stopReason?: string;

  /**
   * Any additional metadata or raw response from the provider.
   * Use 'unknown' for type safety, requiring explicit casting if accessed.
   */
  providerResponse?: unknown;
}

/**
 * Configuration options for an LLM provider.
 */
export interface ILlmProviderConfig {
  /**
   * The unique identifier for the provider (e.g., 'openai', 'openrouter').
   */
  providerId: string;

  /**
   * The API key for the provider.
   */
  apiKey: string | undefined;

  /**
   * The base URL for the provider's API, if applicable.
   * For OpenRouter, this would be the OpenRouter base URL.
   * For OpenAI, this might be their standard base URL or a proxy.
   */
  baseUrl?: string;

  /**
   * Default model to use for this provider if not specified per request.
   */
  defaultModel?: string;

  /**
   * Optional additional headers to send with requests to this provider.
   */
  additionalHeaders?: Record<string, string>;
}

/**
 * Common parameters for making a chat completion request.
 */
export interface IChatCompletionParams {
  /**
   * Controls randomness: lowering results in less random completions.
   * As the temperature approaches zero, the model will become deterministic and repetitive.
   * Typically between 0 and 2.0.
   */
  temperature?: number;

  /**
   * The maximum number of tokens to generate in the completion.
   */
  max_tokens?: number;

  /**
   * An alternative to sampling with temperature, called nucleus sampling,
   * where the model considers the results of the tokens with top_p probability mass.
   * So 0.1 means only the tokens comprising the top 10% probability mass are considered.
   * Typically between 0 and 1.0.
   */
  top_p?: number;

  /**
   * Sequences where the API will stop generating further tokens.
   */
  stop?: string | string[];

  /**
   * A unique identifier representing your end-user, which can help monitoring and abuse detection.
   */
  user?: string;

  /**
   * Optional stream flag. If true, the response will be streamed.
   * Note: Handling streamed responses requires a different method signature or approach.
   * This interface currently focuses on non-streamed completions.
   */
  stream?: boolean;

  // Allow any other provider-specific parameters
  [key: string]: any;
}


/**
 * Interface for an LLM service.
 * Each concrete implementation (e.g., OpenAiService, OpenRouterService)
 * will adhere to this contract.
 */
export interface ILlmService {
  /**
   * The unique identifier of the LLM provider this service interacts with.
   * (e.g., "openai", "openrouter")
   */
  readonly providerId: string;

  /**
   * Generates a chat completion based on the provided messages and model.
   *
   * @param messages An array of IChatMessage objects representing the conversation history.
   * @param modelId The identifier of the model to use for this specific request.
   * This could be a provider-specific model ID (e.g., "gpt-4o-mini")
   * or an OpenRouter-style ID (e.g., "openai/gpt-4o-mini").
   * @param params Optional parameters for the completion request (e.g., temperature, max_tokens).
   * @returns A Promise resolving to an ILlmResponse containing the AI's response.
   * @throws Error if the API call fails or the response cannot be processed.
   *
   * @example
   * \`\`\`typescript
   * const messages: IChatMessage[] = [
   * { role: 'system', content: 'You are a helpful assistant.' },
   * { role: 'user', content: 'Hello, world!' }
   * ];
   * const response = await llmService.generateChatCompletion(messages, 'openai/gpt-4o-mini', { temperature: 0.7 });
   * console.log(response.text);
   * \`\`\`
   */
  generateChatCompletion(
    messages: IChatMessage[],
    modelId: string,
    params?: IChatCompletionParams
  ): Promise<ILlmResponse>;

  // Future methods could include:
  // generateEmbedding(text: string, modelId: string): Promise<number[]>;
  // listAvailableModels(): Promise<string[]>;
}