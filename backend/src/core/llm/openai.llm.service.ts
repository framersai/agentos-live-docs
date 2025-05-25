// File: backend/src/core/llm/openai.llm.service.ts

/**
 * @file OpenAI LLM Service Implementation.
 * @description Provides an implementation of the ILlmService interface for interacting
 * with OpenAI's API. It uses the official OpenAI Node.js library.
 * @version 1.0.0
 */

import OpenAI from 'openai';
import {
  IChatMessage,
  IChatCompletionParams,
  ILlmResponse,
  ILlmService,
  ILlmProviderConfig,
  ILlmUsage,
} from './llm.interfaces';
import { LlmProviderId } from './llm.config.service';

/**
 * Implements the ILlmService for the OpenAI provider.
 */
export class OpenAiLlmService implements ILlmService {
  readonly providerId = LlmProviderId.OPENAI;
  private openai: OpenAI;
  private config: ILlmProviderConfig;

  /**
   * Creates an instance of OpenAiLlmService.
   * @param {ILlmProviderConfig} config - The configuration for the OpenAI provider.
   * @throws {Error} If the API key is not provided in the configuration.
   */
  constructor(config: ILlmProviderConfig) {
    if (!config.apiKey) {
      throw new Error('OpenAI API key is required for OpenAiLlmService.');
    }
    this.config = config;
    this.openai = new OpenAI({
      apiKey: this.config.apiKey,
      baseURL: this.config.baseUrl,
    });
  }

  /**
   * Generates a chat completion using the OpenAI API.
   *
   * @param {IChatMessage[]} messages - The array of chat messages.
   * @param {string} modelId - The OpenAI model ID (e.g., "gpt-4o-mini").
   * @param {IChatCompletionParams} [params] - Optional parameters for the completion.
   * @returns {Promise<ILlmResponse>} A promise that resolves to the LLM response.
   * @throws {Error} If the API call fails.
   */
  async generateChatCompletion(
    messages: IChatMessage[],
    modelId: string,
    params?: IChatCompletionParams
  ): Promise<ILlmResponse> {
    const MappedModelId = this.mapToProviderModelId(modelId);
    try {
      const requestPayload: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming = {
        model: MappedModelId,
        messages: messages as OpenAI.Chat.ChatCompletionMessageParam[], // Cast to OpenAI's type
        temperature: params?.temperature ?? parseFloat(process.env.LLM_DEFAULT_TEMPERATURE || '0.7'),
        max_tokens: params?.max_tokens ?? parseInt(process.env.LLM_DEFAULT_MAX_TOKENS || '2048'),
        top_p: params?.top_p,
        stop: params?.stop,
        user: params?.user,
      };

      // Remove undefined optional parameters to avoid API errors
      Object.keys(requestPayload).forEach(key => {
        if (requestPayload[key as keyof typeof requestPayload] === undefined) {
          delete requestPayload[key as keyof typeof requestPayload];
        }
      });
      
      console.log(`OpenAiLlmService: Calling OpenAI with model: ${MappedModelId}`);
      const response = await this.openai.chat.completions.create(requestPayload);

      const usage = response.usage
        ? {
            prompt_tokens: response.usage.prompt_tokens,
            completion_tokens: response.usage.completion_tokens,
            total_tokens: response.usage.total_tokens,
          }
        : undefined;

      return {
        text: response.choices[0]?.message?.content ?? null,
        model: response.model || MappedModelId, // Use model from response if available
        usage,
        id: response.id,
        stopReason: response.choices[0]?.finish_reason,
        providerResponse: response,
      };
    } catch (error: any) {
      console.error(`OpenAiLlmService: Error calling OpenAI API for model ${MappedModelId}:`, error.message);
      if (error.response?.data) {
        console.error('OpenAI API Error Details:', JSON.stringify(error.response.data, null, 2));
      }
      // Re-throw a more structured error or handle it based on application needs
      throw new Error(`OpenAI API request failed for model ${MappedModelId}: ${error.message}`);
    }
  }

  /**
   * Maps a generic model ID (which might include a provider prefix)
   * to an OpenAI-specific model ID.
   * @param {string} modelId - The generic model ID.
   * @returns {string} The OpenAI-specific model ID.
   */
  private mapToProviderModelId(modelId: string): string {
    if (modelId.startsWith('openai/')) {
      return modelId.replace('openai/', '');
    }
    // If no prefix, assume it's already an OpenAI model or a compatible one.
    return modelId;
  }
}