/**
 * @file LLM Factory with Robust Model ID Handling and Fallback
 * @description Factory for creating LLM service instances and routing requests intelligently.
 * Handles provider selection, model ID adaptation, and fallback mechanisms.
 * @version 2.0.1 - Enhanced logging and comments for model processing logic.
 */

import { OpenAiLlmService } from './openai.llm.service';
import { OpenRouterLlmService } from './openrouter.llm.service';
// TODO: Import AnthropicLlmService and OllamaLlmService when implemented
// import { AnthropicLlmService } from './anthropic.llm.service';
// import { OllamaLlmService } from './ollama.llm.service';
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
 * Initializes all LLM services based on available configurations.
 * Should be called once at application startup.
 * @param {LlmConfigService} [configSvc] - Optional LlmConfigService instance (for testing).
 */
export function initializeLlmServices(configSvc?: LlmConfigService): void {
  configServiceInstance = configSvc || LlmConfigService.getInstance();
  llmServices.clear(); // Clear any existing services if re-initializing

  console.log('LLM Factory: Initializing LLM services...');

  if (configServiceInstance.isProviderAvailable(LlmProviderId.OPENAI)) {
    try {
      llmServices.set(LlmProviderId.OPENAI, new OpenAiLlmService(configServiceInstance.getProviderConfig(LlmProviderId.OPENAI)!));
      console.log('LLM Factory: OpenAI service INITIALIZED.');
    } catch (error: any) {
      console.error('LLM Factory: FAILED to initialize OpenAI service:', error.message);
    }
  }

  if (configServiceInstance.isProviderAvailable(LlmProviderId.OPENROUTER)) {
    try {
      llmServices.set(LlmProviderId.OPENROUTER, new OpenRouterLlmService(configServiceInstance.getProviderConfig(LlmProviderId.OPENROUTER)!));
      console.log('LLM Factory: OpenRouter service INITIALIZED.');
    } catch (error: any) {
      console.error('LLM Factory: FAILED to initialize OpenRouter service:', error.message);
    }
  }

  if (configServiceInstance.isProviderAvailable(LlmProviderId.ANTHROPIC)) {
    // Assuming AnthropicLlmService exists and is imported
    // try {
    //   llmServices.set(LlmProviderId.ANTHROPIC, new AnthropicLlmService(configServiceInstance.getProviderConfig(LlmProviderId.ANTHROPIC)!));
    //   console.log('LLM Factory: Anthropic service INITIALIZED.');
    // } catch (error: any) {
    //   console.error('LLM Factory: FAILED to initialize Anthropic service:', error.message);
    // }
     console.log('LLM Factory: Anthropic provider is configured, but AnthropicLlmService is not yet fully integrated in factory.');
  }

  if (configServiceInstance.isProviderAvailable(LlmProviderId.OLLAMA)) {
    // Assuming OllamaLlmService exists and is imported
    // try {
    //   llmServices.set(LlmProviderId.OLLAMA, new OllamaLlmService(configServiceInstance.getProviderConfig(LlmProviderId.OLLAMA)!));
    //   console.log('LLM Factory: Ollama service INITIALIZED.');
    // } catch (error: any) {
    //   console.error('LLM Factory: FAILED to initialize Ollama service:', error.message);
    // }
     console.log('LLM Factory: Ollama provider is configured, but OllamaLlmService is not yet fully integrated in factory.');
  }

  console.log('LLM Factory: Initialization complete. Active services for providers:', Array.from(llmServices.keys()).join(', ') || 'NONE');
  if (llmServices.size === 0) {
    console.warn("LLM Factory: WARNING - No LLM services were successfully initialized. All LLM-dependent features will fail. Check API key configurations in .env and service implementations.");
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
  // Heuristics for provider-less model names (less reliable)
  if (/\b(gpt|davinci|turbo|ada|babbage|curie|text-embedding)\b/i.test(modelId)) return LlmProviderId.OPENAI;
  if (modelId.startsWith('claude-')) return LlmProviderId.ANTHROPIC;
  if (modelId.includes('llama') || modelId.includes('mistral') || modelId.includes('phi')) { // Common Ollama model names
    // This is ambiguous if OpenRouter also serves these without prefix.
    // For now, don't default to Ollama unless explicitly prefixed or configured.
  }
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
  console.log(`LLM Factory: Processing model ID '${modelId}' for target provider '${targetProviderId}'`);
  let processedModelId = modelId;

  switch (targetProviderId) {
    case LlmProviderId.OPENAI:
      if (processedModelId.startsWith(`${LlmProviderId.OPENROUTER}/${LlmProviderId.OPENAI}/`)) {
        processedModelId = processedModelId.substring(`${LlmProviderId.OPENROUTER}/${LlmProviderId.OPENAI}/`.length);
      } else if (processedModelId.startsWith(`${LlmProviderId.OPENAI}/`)) {
        processedModelId = processedModelId.substring(`${LlmProviderId.OPENAI}/`.length);
      }
      if (!processedModelId || processedModelId.includes('/') || !(/\b(gpt|davinci|turbo|ada|babbage|curie|text-embedding)\b/i.test(processedModelId))) {
          const defaultOpenAIModel = configSvc.getDefaultOpenAIModel();
          console.warn(`LLM Factory: Model ID '${modelId}' (processed to '${processedModelId}') seems invalid for OpenAI. Using OpenAI default: '${defaultOpenAIModel}'.`);
          processedModelId = defaultOpenAIModel;
      }
      break;

    case LlmProviderId.OPENROUTER:
      if (processedModelId.startsWith(`${LlmProviderId.OPENROUTER}/`)) { // Remove redundant 'openrouter/' prefix
        processedModelId = processedModelId.substring(`${LlmProviderId.OPENROUTER}/`.length);
      }
      // Ensure OpenRouter models are provider-prefixed if they are known provider models
      else if (!processedModelId.includes('/') && (/\b(gpt|davinci|turbo|ada|babbage|curie|text-embedding)\b/i.test(processedModelId))) {
        processedModelId = `${LlmProviderId.OPENAI}/${processedModelId}`;
      } else if (!processedModelId.includes('/') && processedModelId.startsWith('claude-')) {
        processedModelId = `${LlmProviderId.ANTHROPIC}/${processedModelId}`;
      }
      if (!processedModelId.includes('/')) { // OpenRouter expects 'provider/model'
          const defaultOpenRouterModel = configSvc.getDefaultOpenRouterModel();
          console.warn(`LLM Factory: Model ID '${modelId}' (processed to '${processedModelId}') for OpenRouter is ambiguous (missing provider slug like 'openai/model'). Using OpenRouter default: '${defaultOpenRouterModel}'.`);
          processedModelId = defaultOpenRouterModel; // Safer to default if format is wrong
      }
      break;

    case LlmProviderId.ANTHROPIC:
        if (processedModelId.includes('/')) { // Strip prefixes like 'openrouter/anthropic/' or 'anthropic/'
            processedModelId = processedModelId.substring(processedModelId.lastIndexOf('/') + 1);
        }
        if (!processedModelId.startsWith('claude-')) {
            const defaultAnthropicModel = configSvc.getDefaultAnthropicModel();
            console.warn(`LLM Factory: Model ID '${modelId}' (processed to '${processedModelId}') seems invalid for Anthropic. Using Anthropic default: '${defaultAnthropicModel}'.`);
            processedModelId = defaultAnthropicModel;
        }
        break;

    case LlmProviderId.OLLAMA:
        if (processedModelId.includes('/')) { // Strip prefixes e.g. 'ollama/llama3' -> 'llama3'
            processedModelId = processedModelId.substring(processedModelId.lastIndexOf('/') + 1);
        }
        // Ollama model names can be simple like 'llama3' or 'mistral:7b'. No extensive validation here, provider will handle.
        break;
  }
  console.log(`LLM Factory: Final processed model ID for provider '${targetProviderId}' is '${processedModelId}' (from original '${modelId}')`);
  return processedModelId;
}

/**
 * Determines the best provider and processed model ID for a given request.
 * @param {string} requestedModelId - The model ID from the request.
 * @param {LlmConfigService} configSvc - The configuration service.
 * @param {LlmProviderId} [preferredProviderIdFromEnv] - An optional preferred provider from .env.
 * @returns {{ providerId: LlmProviderId; modelId: string }}
 * @throws {Error} If no suitable provider can be found.
 */
function selectProviderAndModel(
  requestedModelId: string,
  configSvc: LlmConfigService,
  preferredProviderIdFromEnv?: LlmProviderId
): { providerId: LlmProviderId; modelId: string } {
  console.log(`LLM Factory: Selecting provider for requestedModelId='${requestedModelId}', preferredProviderIdFromEnv='${preferredProviderIdFromEnv || 'None'}'`);

  if (preferredProviderIdFromEnv && configSvc.isProviderAvailable(preferredProviderIdFromEnv)) {
    const modelForService = processModelIdForProvider(requestedModelId, preferredProviderIdFromEnv, configSvc);
    console.log(`LLM Factory: Selected provider via preferredProviderIdFromEnv: '${preferredProviderIdFromEnv}', Processed Model: '${modelForService}'.`);
    return { providerId: preferredProviderIdFromEnv, modelId: modelForService };
  }

  const extractedProvider = extractProviderFromModelId(requestedModelId);
  if (extractedProvider && configSvc.isProviderAvailable(extractedProvider)) {
    const modelForService = processModelIdForProvider(requestedModelId, extractedProvider, configSvc);
    console.log(`LLM Factory: Selected provider via extractedProvider from modelId: '${extractedProvider}', Processed Model: '${modelForService}'.`);
    return { providerId: extractedProvider, modelId: modelForService };
  }

  const { providerId: defaultSystemProvider, modelId: defaultSystemModel } = configSvc.getDefaultProviderAndModel();
  if (configSvc.isProviderAvailable(defaultSystemProvider)) {
      // Use requestedModelId if it's a simple name, otherwise use the defaultSystemModel (which might be provider-prefixed)
      const modelNameToProcess = !requestedModelId.includes('/') ? requestedModelId : defaultSystemModel;
      const modelForDefaultProvider = processModelIdForProvider(modelNameToProcess, defaultSystemProvider, configSvc);
      console.log(`LLM Factory: Selected provider via system default: '${defaultSystemProvider}', Original Requested: '${requestedModelId}', Processed Model (using '${modelNameToProcess}' as base for processing): '${modelForDefaultProvider}'.`);
      return { providerId: defaultSystemProvider, modelId: modelForDefaultProvider };
  }

  console.error(`LLM Factory: CRITICAL - Could not select any provider for requestedModelId='${requestedModelId}'. No providers available or match criteria.`);
  throw new Error('LLM Factory: No suitable LLM provider available for the request. Check configurations and API keys.');
}

/**
 * Main function to call an LLM with automatic provider selection, model ID processing, and fallback.
 * @param {IChatMessage[]} messages - Array of chat messages.
 * @param {string} requestedModelId - The initially requested model ID (e.g., from mode config).
 * @param {IChatCompletionParams} [params] - Optional LLM parameters.
 * @param {LlmProviderId} [routingProviderIdFromEnv] - Preferred provider from environment or routing config.
 * @param {string} [userId] - Optional user ID for logging/tracking.
 * @returns {Promise<ILlmResponse>} The LLM's response.
 * @throws {Error} If the primary and fallback attempts fail, or no providers are available.
 */
export async function callLlm(
  messages: IChatMessage[],
  requestedModelId: string,
  params?: IChatCompletionParams,
  routingProviderIdFromEnv?: LlmProviderId,
  userId?: string
): Promise<ILlmResponse> {
  if (!configServiceInstance || llmServices.size === 0) {
    console.warn("LLM Factory: Config service not initialized or no LLM services loaded. Attempting re-initialization...");
    initializeLlmServices();
    if (!configServiceInstance || llmServices.size === 0) {
        console.error("LLM Factory: CRITICAL - LlmConfigService or LLM services still not available after re-initialization attempt. LLM calls will fail.");
        throw new Error("LLM Factory critical error: LLM services or configuration not available.");
    }
  }

  console.log(`LLM Factory: callLlm invoked. User: ${userId || 'N/A'}, Requested Model: '${requestedModelId}', Env Routing Provider: '${routingProviderIdFromEnv || 'None'}'`);

  let primaryAttempt: { providerId: LlmProviderId; modelId: string };
  try {
    primaryAttempt = selectProviderAndModel(requestedModelId, configServiceInstance, routingProviderIdFromEnv);
  } catch (selectionError: any) {
    console.error(`LLM Factory: Error selecting provider for primary attempt: ${selectionError.message}`);
    throw selectionError;
  }

  const service = llmServices.get(primaryAttempt.providerId);
  if (!service) {
    console.error(`LLM Factory: Service for selected primary provider '${primaryAttempt.providerId}' not found. This indicates an initialization mismatch.`);
    throw new Error(`LLM service for provider '${primaryAttempt.providerId}' is not initialized or available.`);
  }

  console.log(`LLM Factory: Primary LLM Call - Provider: '${primaryAttempt.providerId}', Model: '${primaryAttempt.modelId}'`);
  try {
    const response = await service.generateChatCompletion(messages, primaryAttempt.modelId, params);
    console.log(`LLM Factory: Successfully received response from ${primaryAttempt.providerId} using model ${response.model}.`);
    return response;
  } catch (serviceError: any) {
    console.warn(`LLM Factory: Primary call with Provider '${primaryAttempt.providerId}', Model '${primaryAttempt.modelId}' FAILED. Error: ${serviceError.message}`);

    let fallbackProviderIdToTry: LlmProviderId | undefined;
    const configuredFallback = configServiceInstance.getFallbackProviderId();

    if (configuredFallback && configuredFallback !== primaryAttempt.providerId && llmServices.has(configuredFallback)) {
      fallbackProviderIdToTry = configuredFallback;
      console.log(`LLM Factory: Specific fallback provider configured: '${fallbackProviderIdToTry}'`);
    } else {
      // Auto-toggle logic if no specific different fallback is configured or primary was the configured fallback
      if (primaryAttempt.providerId === LlmProviderId.OPENROUTER && llmServices.has(LlmProviderId.OPENAI)) {
        fallbackProviderIdToTry = LlmProviderId.OPENAI;
      } else if (primaryAttempt.providerId === LlmProviderId.OPENAI && llmServices.has(LlmProviderId.OPENROUTER)) {
        fallbackProviderIdToTry = LlmProviderId.OPENROUTER;
      }
      // Add more auto-toggle pairs (e.g., Anthropic <-> OpenRouter if Anthropic is via OpenRouter or direct)
      if (fallbackProviderIdToTry) {
        console.log(`LLM Factory: Auto-selected fallback provider: '${fallbackProviderIdToTry}'`);
      }
    }

    if (fallbackProviderIdToTry) {
      const fallbackService = llmServices.get(fallbackProviderIdToTry);
      if (fallbackService) {
        console.log(`LLM Factory: Attempting fallback to Provider '${fallbackProviderIdToTry}'.`);
        const fallbackModelForService = processModelIdForProvider(requestedModelId, fallbackProviderIdToTry, configServiceInstance);
        
        console.log(`LLM Factory: Fallback LLM Call - Provider: '${fallbackProviderIdToTry}', Model: '${fallbackModelForService}'`);
        try {
          const fallbackResponse = await fallbackService.generateChatCompletion(messages, fallbackModelForService, params);
          console.log(`LLM Factory: Successfully received response from fallback provider ${fallbackProviderIdToTry} using model ${fallbackResponse.model}.`);
          return fallbackResponse;
        } catch (fallbackError: any) {
          console.error(`LLM Factory: Fallback call to Provider '${fallbackProviderIdToTry}', Model '${fallbackModelForService}' ALSO FAILED. Error: ${fallbackError.message}`);
          // Do not re-throw fallbackError immediately, prefer original error unless only fallback was attempted.
          // But since primary already failed, now throw the fallbackError.
          throw fallbackError;
        }
      } else {
         console.error(`LLM Factory: Fallback provider '${fallbackProviderIdToTry}' was selected, but its service is not available/initialized. Cannot attempt fallback.`);
      }
    } else {
      console.warn(`LLM Factory: No suitable or available fallback provider found after primary provider '${primaryAttempt.providerId}' failed.`);
    }
    throw serviceError; // Re-throw the original serviceError if no fallback was successful
  }
}