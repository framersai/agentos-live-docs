// File: backend/src/core/llm/llm.factory.ts
import { IChatMessage, IChatCompletionParams, ILlmResponse } from './llm.interfaces';

/**
 * @file LLM Service Factory.
 * @description Provides a factory function to create instances of LLM services
 * based on provider ID and configuration. This promotes loose coupling and
 * simplifies the process of obtaining an LLM service instance.
 * @version 1.1.0 - Enhanced fallback logic and model ID handling.
 */

import { ILlmService, ILlmProviderConfig } from './llm.interfaces';
import { LlmConfigService, LlmProviderId } from './llm.config.service';
import { OpenAiLlmService } from './openai.llm.service';
import { OpenRouterLlmService } from './openrouter.llm.service';
// Import other LLM services here as they are created (e.g., AnthropicLlmService, OllamaLlmService)

/**
 * Factory class for creating LLM service instances.
 */
export class LlmServiceFactory {
  private static configServiceInstance: LlmConfigService | null = null;

  /**
   * Gets a singleton instance of the LlmConfigService.
   * @returns {LlmConfigService} The LlmConfigService instance.
   */
  private static getConfigService(): LlmConfigService {
    if (!this.configServiceInstance) {
      this.configServiceInstance = new LlmConfigService();
    }
    return this.configServiceInstance;
  }

  /**
   * Creates and returns an instance of an LLM service based on the provider ID.
   *
   * @param {LlmProviderId} providerId - The identifier of the LLM provider.
   * @returns {ILlmService} An instance of the LLM service.
   * @throws {Error} If the provider configuration is not found or the provider is unsupported.
   *
   * @example
   * ```typescript
   * const openAiService = LlmServiceFactory.createService(LlmProviderId.OPENAI);
   * const openRouterService = LlmServiceFactory.createService(LlmProviderId.OPENROUTER);
   * ```
   */
  public static createService(providerId: LlmProviderId): ILlmService {
    const configService = this.getConfigService();
    const providerConfig = configService.getProviderConfig(providerId);

    if (!providerConfig) {
      throw new Error(`LLM Service Factory: Configuration for provider "${providerId}" not found or provider is disabled.`);
    }

    switch (providerId) {
      case LlmProviderId.OPENAI:
        if (!providerConfig.apiKey && !configService.getProviderConfig(LlmProviderId.OPENROUTER)?.apiKey) { // Allow OpenRouter to provide OpenAI key
            throw new Error("OpenAI API key missing for OpenAI service creation (and not available via OpenRouter).");
        }
        return new OpenAiLlmService(providerConfig);
      case LlmProviderId.OPENROUTER:
        if (!providerConfig.apiKey) throw new Error("OpenRouter API key missing for OpenRouter service creation.");
        return new OpenRouterLlmService(providerConfig);
      // Add cases for other providers here
      // case LlmProviderId.ANTHROPIC:
      //   if (!providerConfig.apiKey) throw new Error("Anthropic API key missing.");
      //   return new AnthropicLlmService(providerConfig);
      // case LlmProviderId.OLLAMA:
      //   return new OllamaLlmService(providerConfig); // Ollama might not need API key
      default:
        throw new Error(`LLM Service Factory: Unsupported LLM provider ID "${providerId}".`);
    }
  }

  /**
   * Gets the default LLM service instance based on environment configuration.
   * It uses `LlmConfigService.getDefaultProviderAndModel()` to determine which service to instantiate.
   *
   * @returns {ILlmService} An instance of the default LLM service.
   * @throws {Error} If the default provider cannot be determined or is not configured.
   */
  public static getDefaultService(): ILlmService {
    const configService = this.getConfigService();
    const { providerId } = configService.getDefaultProviderAndModel();
    console.log(`LlmServiceFactory: Creating default service for provider: ${providerId}`);
    return this.createService(providerId);
  }
}

/**
 * Main function to call an LLM provider.
 * This function determines the provider and model, then uses the appropriate service.
 * Includes fallback logic.
 *
 * @param {IChatMessage[]} messages - Array of chat messages.
 * @param {string} modelIdFromRequest - The model ID specified in the request (e.g., "openai/gpt-4o-mini", "gpt-4o").
 * @param {IChatCompletionParams} [params] - Optional parameters for the chat completion.
 * @param {LlmProviderId} [preferredProviderIdFromEnv] - The preferred provider ID from environment config (ROUTING_LLM_PROVIDER_ID).
 * @param {string} [userId] - Optional user ID for logging or context.
 * @returns {Promise<ILlmResponse>} The LLM's response.
 */
export async function callLlm(
  messages: IChatMessage[],
  modelIdFromRequest: string,
  params?: IChatCompletionParams,
  preferredProviderIdFromEnv?: LlmProviderId, // Added to pass the .env preference
  userId?: string
): Promise<ILlmResponse> {
  const configService = new LlmConfigService(); // Direct instantiation for this utility function
  let attemptProviderId: LlmProviderId;
  let attemptModelId = modelIdFromRequest;

  const defaultProviderInfo = configService.getDefaultProviderAndModel();
  const primaryProviderId = preferredProviderIdFromEnv || defaultProviderInfo.providerId;
  const primaryModelId = modelIdFromRequest || defaultProviderInfo.modelId;

  // Determine the provider and model for the first attempt
  if (primaryModelId.includes('/') && !primaryProviderId) {
    const [inferredProvider, ...restOfModel] = primaryModelId.split('/');
    if (Object.values(LlmProviderId).includes(inferredProvider.toLowerCase() as LlmProviderId)) {
      attemptProviderId = inferredProvider.toLowerCase() as LlmProviderId;
      attemptModelId = restOfModel.join('/') || primaryModelId; // Use full modelId if rest is empty
    } else {
      attemptProviderId = primaryProviderId; // Fallback to preferred/default provider
      attemptModelId = primaryModelId;
    }
  } else {
    attemptProviderId = primaryProviderId;
    attemptModelId = primaryModelId;
  }
  
  // Clean modelId for specific providers
  if (attemptProviderId === LlmProviderId.OPENAI && attemptModelId.startsWith(`${LlmProviderId.OPENAI}/`)) {
    attemptModelId = attemptModelId.substring(LlmProviderId.OPENAI.length + 1);
  } else if (attemptProviderId === LlmProviderId.OPENROUTER && !attemptModelId.includes('/')) {
     // If OpenRouter and no prefix, assume it's an OpenAI model by default or use a configured default prefix.
     // For simplicity, we assume openai prefix if not specified for OpenRouter.
     attemptModelId = `openai/${attemptModelId}`;
  }


  console.log(`callLlm (User: ${userId || 'N/A'}): Attempting provider "${attemptProviderId}" with model "${attemptModelId}" (Original request model: "${modelIdFromRequest}")`);

  try {
    const service = LlmServiceFactory.createService(attemptProviderId);
    return await service.generateChatCompletion(messages, attemptModelId, params);
  } catch (error: any) {
    console.warn(`callLlm: Initial attempt with ${attemptProviderId} failed. Error: ${error.message}`);
    
    const fallbackProviderIdEnv = configService.getFallbackProviderId();
    let fallbackProviderToTry: LlmProviderId | undefined;

    // Determine fallback provider:
    // 1. If FALLBACK_LLM_PROVIDER_ID is set and different from the failed attempt.
    // 2. If not, try the other of (OpenAI, OpenRouter) if the failed one was one of them.
    if (fallbackProviderIdEnv && fallbackProviderIdEnv !== attemptProviderId && configService.getProviderConfig(fallbackProviderIdEnv)) {
        fallbackProviderToTry = fallbackProviderIdEnv;
    } else {
        if (attemptProviderId === LlmProviderId.OPENAI && configService.getProviderConfig(LlmProviderId.OPENROUTER)) {
            fallbackProviderToTry = LlmProviderId.OPENROUTER;
        } else if (attemptProviderId === LlmProviderId.OPENROUTER && configService.getProviderConfig(LlmProviderId.OPENAI)) {
            fallbackProviderToTry = LlmProviderId.OPENAI;
        }
    }

    if (fallbackProviderToTry) {
      console.log(`callLlm: Attempting fallback to provider "${fallbackProviderToTry}".`);
      let fallbackModelId = modelIdFromRequest; // Reset to original model ID for fallback logic

      // Adjust modelId for fallback provider
      if (fallbackProviderToTry === LlmProviderId.OPENAI && fallbackModelId.includes('/')) {
        const parts = fallbackModelId.split('/');
        fallbackModelId = parts[1] || parts[0]; // Take model name after prefix
      } else if (fallbackProviderToTry === LlmProviderId.OPENROUTER && !fallbackModelId.includes('/')) {
        // If modelIdFromRequest was for OpenAI (e.g., "gpt-4o") and fallback is OpenRouter, prefix it
        fallbackModelId = `openai/${fallbackModelId}`;
      }
       else if (fallbackProviderToTry === LlmProviderId.OPENROUTER && fallbackModelId.includes('/') && !fallbackModelId.startsWith(LlmProviderId.OPENAI + '/') && !fallbackModelId.startsWith('anthropic/')) {
        // If it has a prefix not recognized by OpenRouter, might need adjustment or might be an error
        // For now, we assume that if it has a slash, OpenRouter might handle it.
        // More robust logic would map known provider prefixes.
      }


      try {
        const fallbackService = LlmServiceFactory.createService(fallbackProviderToTry);
        return await fallbackService.generateChatCompletion(messages, fallbackModelId, params);
      } catch (fallbackError: any) {
        console.error(`callLlm: Fallback to provider ${fallbackProviderToTry} also failed. Error: ${fallbackError.message}`);
        throw fallbackError; // Re-throw the fallback error
      }
    } else {
      console.error(`callLlm: No configured fallback provider available after ${attemptProviderId} failed.`);
      throw error; // Re-throw the original error if no fallback path
    }
  }
}