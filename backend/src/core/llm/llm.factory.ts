// File: backend/src/core/llm/llm.factory.ts
/**
 * @file LLM Factory with Robust Model ID Handling and Fallback
 * @description Factory for creating LLM service instances and routing requests intelligently.
 * @version 2.0.0
 */

import { OpenAiLlmService } from './openai.llm.service';
import { OpenRouterLlmService } from './openrouter.llm.service';
// Import other services like AnthropicLlmService, OllamaLlmService as needed
import { LlmConfigService, LlmProviderId } from './llm.config.service';
import {
  IChatMessage,
  ILlmResponse,
  IChatCompletionParams,
  ILlmService
} from './llm.interfaces';

const llmServices: Map<LlmProviderId, ILlmService> = new Map();
let configServiceInstance: LlmConfigService | null = null;

/**
 * Initializes all LLM services based on available API keys and configurations.
 * This function should be called once at application startup.
 * @param {LlmConfigService} [configSvc] - Optional LlmConfigService instance for testing.
 */
export function initializeLlmServices(configSvc?: LlmConfigService): void {
  configServiceInstance = configSvc || LlmConfigService.getInstance();

  if (configServiceInstance.isProviderAvailable(LlmProviderId.OPENAI)) {
    try {
      llmServices.set(LlmProviderId.OPENAI, new OpenAiLlmService(configServiceInstance.getProviderConfig(LlmProviderId.OPENAI)!));
      console.log('LLM Factory: Initialized OpenAI service.');
    } catch (error) {
      console.error('LLM Factory: Failed to initialize OpenAI service:', error);
    }
  }

  if (configServiceInstance.isProviderAvailable(LlmProviderId.OPENROUTER)) {
    try {
      llmServices.set(LlmProviderId.OPENROUTER, new OpenRouterLlmService(configServiceInstance.getProviderConfig(LlmProviderId.OPENROUTER)!));
      console.log('LLM Factory: Initialized OpenRouter service.');
    } catch (error) {
      console.error('LLM Factory: Failed to initialize OpenRouter service:', error);
    }
  }

  // TODO: Initialize AnthropicLlmService and OllamaLlmService if they exist and are configured.
  // Example for Anthropic:
  // if (configServiceInstance.isProviderAvailable(LlmProviderId.ANTHROPIC)) {
  //   try {
  //     llmServices.set(LlmProviderId.ANTHROPIC, new AnthropicLlmService(configServiceInstance.getProviderConfig(LlmProviderId.ANTHROPIC)!));
  //     console.log('LLM Factory: Initialized Anthropic service.');
  //   } catch (error) {
  //     console.error('LLM Factory: Failed to initialize Anthropic service:', error);
  //   }
  // }

  console.log('LLM Factory: Initialized services for providers:', Array.from(llmServices.keys()));
  if (llmServices.size === 0) {
    console.warn("LLM Factory: No LLM services were initialized. Check API key configurations in .env file.");
  }
}

/**
 * Extracts the potential provider from a model ID string.
 * @param {string} modelId - The full model ID (e.g., 'openrouter/openai/gpt-4o-mini', 'openai/gpt-4o-mini', 'gpt-4o-mini').
 * @returns {LlmProviderId | null} The extracted provider ID or null if not identifiable.
 */
function extractProviderFromModelId(modelId: string): LlmProviderId | null {
  if (!modelId || typeof modelId !== 'string') return null;
  const parts = modelId.split('/');
  const potentialProvider = parts[0].toLowerCase();

  if (Object.values(LlmProviderId).includes(potentialProvider as LlmProviderId)) {
    return potentialProvider as LlmProviderId;
  }
  // Add heuristics for provider-less model names if needed (e.g., 'gpt-' for openai)
  if (modelId.startsWith('gpt-') || modelId.startsWith('text-davinci-') || modelId.startsWith('text-embedding-')) return LlmProviderId.OPENAI;
  if (modelId.startsWith('claude-')) return LlmProviderId.ANTHROPIC;

  return null;
}

/**
 * Processes a model ID string to make it suitable for the target provider's API.
 * @param {string} modelId - The original model ID.
 * @param {LlmProviderId} targetProviderId - The provider the model ID is being prepared for.
 * @param {LlmConfigService} configSvc - The configuration service instance.
 * @returns {string} The processed model ID.
 */
function processModelIdForProvider(modelId: string, targetProviderId: LlmProviderId, configSvc: LlmConfigService): string {
  console.log(`LLM Factory: Processing model ID '${modelId}' for provider '${targetProviderId}'`);
  let processedModelId = modelId;

  switch (targetProviderId) {
    case LlmProviderId.OPENAI:
      // Strips 'openai/' or 'openrouter/openai/' prefixes.
      if (processedModelId.startsWith(`${LlmProviderId.OPENROUTER}/${LlmProviderId.OPENAI}/`)) {
        processedModelId = processedModelId.substring(`${LlmProviderId.OPENROUTER}/${LlmProviderId.OPENAI}/`.length);
      } else if (processedModelId.startsWith(`${LlmProviderId.OPENAI}/`)) {
        processedModelId = processedModelId.substring(`${LlmProviderId.OPENAI}/`.length);
      }
      // If after stripping, it's empty or clearly not an OpenAI model (e.g., contains other provider slugs), use default.
      if (!processedModelId || processedModelId.includes('/') || !(/\b(gpt|davinci|turbo|ada|babbage|curie|text-embedding)\b/i.test(processedModelId))) {
          const defaultOpenAIModel = configSvc.getDefaultOpenAIModel();
          console.warn(`LLM Factory: Model ID '${modelId}' processed to '${processedModelId}' for OpenAI seems invalid. Using default: '${defaultOpenAIModel}'.`);
          processedModelId = defaultOpenAIModel;
      }
      break;

    case LlmProviderId.OPENROUTER:
      // OpenRouter expects 'provider_slug/model_name'. It should NOT have 'openrouter/' prefix.
      if (processedModelId.startsWith(`${LlmProviderId.OPENROUTER}/`)) {
        processedModelId = processedModelId.substring(`${LlmProviderId.OPENROUTER}/`.length);
      }
      // If it's a known OpenAI model without a prefix, add 'openai/' for OpenRouter.
      else if (!processedModelId.includes('/') && (processedModelId.startsWith('gpt-') || processedModelId.startsWith('text-davinci-') || processedModelId.startsWith('text-embedding-'))) {
        processedModelId = `${LlmProviderId.OPENAI}/${processedModelId}`;
        console.log(`LLM Factory: Prefixed plain OpenAI model for OpenRouter: '${modelId}' -> '${processedModelId}'`);
      }
      // Similar logic for Anthropic models if passed without prefix for OpenRouter
      else if (!processedModelId.includes('/') && processedModelId.startsWith('claude-')) {
        processedModelId = `${LlmProviderId.ANTHROPIC}/${processedModelId}`;
         console.log(`LLM Factory: Prefixed plain Anthropic model for OpenRouter: '${modelId}' -> '${processedModelId}'`);
      }
      // If still no slash, it might be an OpenRouter native model or an issue.
      // OpenRouter errors if the format is not `provider/model`.
      if (!processedModelId.includes('/')) {
          const defaultOpenRouterModel = configSvc.getDefaultOpenRouterModel();
          console.warn(`LLM Factory: Model ID '${modelId}' processed to '${processedModelId}' for OpenRouter is ambiguous (missing provider slug). Consider using default: '${defaultOpenRouterModel}'.`);
          // It might be safer to use defaultOpenRouterModel here if `processedModelId` is clearly not provider-prefixed.
          // For now, we'll pass it along, OpenRouter will validate.
      }
      break;

    // Add cases for LlmProviderId.ANTHROPIC, LlmProviderId.OLLAMA if they need specific processing
    // e.g., Anthropic might just need the model name without any prefix.
    case LlmProviderId.ANTHROPIC:
        if (processedModelId.includes('/')) {
            processedModelId = processedModelId.substring(processedModelId.lastIndexOf('/') + 1);
        }
        break;
    case LlmProviderId.OLLAMA:
        // Ollama model names are usually simple, e.g., 'llama3', 'codellama:13b'
        // No complex prefix stripping usually needed. If it has a provider prefix, strip it.
        if (processedModelId.includes('/')) {
            processedModelId = processedModelId.substring(processedModelId.lastIndexOf('/') + 1);
        }
        break;
  }
  console.log(`LLM Factory: Processed model ID is now '${processedModelId}'`);
  return processedModelId;
}

/**
 * Determines the best provider and processed model ID for a given request.
 * @param {string} requestedModelId - The model ID from the request.
 * @param {LlmConfigService} configSvc - The configuration service.
 * @param {LlmProviderId} [preferredProviderId] - An optional preferred provider.
 * @returns {{ providerId: LlmProviderId; modelId: string }}
 * @throws {Error} If no suitable provider can be found.
 */
function selectProviderAndModel(
  requestedModelId: string,
  configSvc: LlmConfigService,
  preferredProviderId?: LlmProviderId
): { providerId: LlmProviderId; modelId: string } {

  // Attempt 1: Use preferredProviderId if specified and available
  if (preferredProviderId && configSvc.isProviderAvailable(preferredProviderId)) {
    const modelForService = processModelIdForProvider(requestedModelId, preferredProviderId, configSvc);
    console.log(`LLM Factory: Using preferred provider '${preferredProviderId}' with model '${modelForService}'.`);
    return { providerId: preferredProviderId, modelId: modelForService };
  }

  // Attempt 2: Extract provider from requestedModelId if possible and available
  const extractedProvider = extractProviderFromModelId(requestedModelId);
  if (extractedProvider && configSvc.isProviderAvailable(extractedProvider)) {
    const modelForService = processModelIdForProvider(requestedModelId, extractedProvider, configSvc);
    console.log(`LLM Factory: Using provider '${extractedProvider}' extracted from model ID, with processed model '${modelForService}'.`);
    return { providerId: extractedProvider, modelId: modelForService };
  }

  // Attempt 3: Use system default provider if requestedModelId has no discernible provider
  // and preferredProviderId was not usable.
  const { providerId: defaultSystemProvider, modelId: defaultSystemModel } = configSvc.getDefaultProviderAndModel();
  if (configSvc.isProviderAvailable(defaultSystemProvider)) {
      // If the requestedModelId is just a model name (no slashes), process it for the default provider.
      // Otherwise, if requestedModelId had a (now unusable) prefix, using defaultSystemModel is safer.
      const modelForDefaultProvider = !requestedModelId.includes('/')
          ? processModelIdForProvider(requestedModelId, defaultSystemProvider, configSvc)
          : processModelIdForProvider(defaultSystemModel, defaultSystemProvider, configSvc); // Process the default system model for its own provider

      console.log(`LLM Factory: Using system default provider '${defaultSystemProvider}' with model '${modelForDefaultProvider}'. Original request: '${requestedModelId}'.`);
      return { providerId: defaultSystemProvider, modelId: modelForDefaultProvider };
  }

  throw new Error('LLM Factory: No suitable LLM provider available for the request. Check configurations and API keys.');
}

/**
 * Main function to call an LLM with automatic provider selection, model ID processing, and fallback.
 * @param {IChatMessage[]} messages - Array of chat messages.
 * @param {string} requestedModelId - The initially requested model ID (e.g., from mode config).
 * @param {IChatCompletionParams} [params] - Optional LLM parameters.
 * @param {LlmProviderId} [routingProviderId] - Preferred provider from environment or routing config.
 * @param {string} [userId] - Optional user ID for logging/tracking.
 * @returns {Promise<ILlmResponse>} The LLM's response.
 * @throws {Error} If the primary and fallback attempts fail, or no providers are available.
 */
export async function callLlm(
  messages: IChatMessage[],
  requestedModelId: string,
  params?: IChatCompletionParams,
  routingProviderId?: LlmProviderId, // This is the preferredProviderIdFromEnv
  userId?: string
): Promise<ILlmResponse> {
  if (!configServiceInstance) {
    console.warn("LLM Factory: initializeLlmServices() was not called or failed. Attempting to initialize now.");
    initializeLlmServices(); // Ensure services are initialized
    if (!configServiceInstance) { // if still null after attempt
        throw new Error("LLM Factory critical error: LlmConfigService not available.");
    }
  }

  console.log(`LLM Factory: callLlm invoked. User: ${userId || 'N/A'}, Requested Model: '${requestedModelId}', Routing Provider: '${routingProviderId || 'None'}'`);

  let primaryAttempt: { providerId: LlmProviderId; modelId: string };
  try {
    primaryAttempt = selectProviderAndModel(requestedModelId, configServiceInstance, routingProviderId);
  } catch (selectionError: any) {
    console.error(`LLM Factory: Error selecting provider: ${selectionError.message}`);
    throw selectionError; // Re-throw if we can't even select a provider
  }

  const service = llmServices.get(primaryAttempt.providerId);
  if (!service) {
    console.error(`LLM Factory: Service for provider '${primaryAttempt.providerId}' not found, though selected. This indicates an initialization issue.`);
    throw new Error(`LLM service for provider '${primaryAttempt.providerId}' is not initialized or available.`);
  }

  console.log(`LLM Factory: Attempt 1 - Provider: '${primaryAttempt.providerId}', Model: '${primaryAttempt.modelId}'`);
  try {
    // The ILlmService interface uses `generateChatCompletion`.
    // Claude's version used `chatCompletion`. Standardizing to `generateChatCompletion`.
    const response = await service.generateChatCompletion(messages, primaryAttempt.modelId, params);
    console.log(`LLM Factory: Successfully received response from ${primaryAttempt.providerId}`);
    return response;
  } catch (serviceError: any) {
    console.warn(`LLM Factory: Attempt 1 with Provider '${primaryAttempt.providerId}', Model '${primaryAttempt.modelId}' failed. Error: ${serviceError.message}`);

    // Fallback Logic
    let fallbackProviderId: LlmProviderId | undefined;
    const configuredFallback = configServiceInstance.getFallbackProviderId();

    if (configuredFallback && configuredFallback !== primaryAttempt.providerId && llmServices.has(configuredFallback)) {
      fallbackProviderId = configuredFallback;
    } else { // Auto-toggle if no specific different fallback, or if configured fallback is same as primary
      if (primaryAttempt.providerId === LlmProviderId.OPENROUTER && llmServices.has(LlmProviderId.OPENAI)) {
        fallbackProviderId = LlmProviderId.OPENAI;
      } else if (primaryAttempt.providerId === LlmProviderId.OPENAI && llmServices.has(LlmProviderId.OPENROUTER)) {
        fallbackProviderId = LlmProviderId.OPENROUTER;
      }
      // Add more auto-toggle pairs if necessary (e.g., Anthropic <-> OpenRouter)
    }

    if (fallbackProviderId) {
      const fallbackService = llmServices.get(fallbackProviderId);
      if (fallbackService) {
        console.log(`LLM Factory: Attempting fallback to Provider '${fallbackProviderId}'.`);
        // Process the *original* requestedModelId for the fallback provider's context.
        const fallbackModelForService = processModelIdForProvider(requestedModelId, fallbackProviderId, configServiceInstance);
        
        console.log(`LLM Factory: Fallback attempt - Provider: '${fallbackProviderId}', Model: '${fallbackModelForService}'`);
        try {
          const fallbackResponse = await fallbackService.generateChatCompletion(messages, fallbackModelForService, params);
          console.log(`LLM Factory: Successfully received response from fallback provider ${fallbackProviderId}`);
          return fallbackResponse;
        } catch (fallbackError: any) {
          console.error(`LLM Factory: Fallback to Provider '${fallbackProviderId}', Model '${fallbackModelForService}' also failed. Error: ${fallbackError.message}`);
          throw fallbackError; // Re-throw the fallback error
        }
      } else {
         console.error(`LLM Factory: Fallback provider '${fallbackProviderId}' selected, but its service is not available/initialized.`);
      }
    } else {
      console.error(`LLM Factory: No suitable or available fallback provider after ${primaryAttempt.providerId} failed.`);
    }
    throw serviceError; // Re-throw the original error if no fallback was attempted or fallback failed
  }
}