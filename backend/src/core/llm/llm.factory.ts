// File: backend/src/core/llm/llm.factory.ts
import { IChatMessage, IChatCompletionParams, ILlmResponse, ILlmService } from './llm.interfaces';
import { LlmConfigService, LlmProviderId } from './llm.config.service';
import { OpenAiLlmService } from './openai.llm.service';
import { OpenRouterLlmService } from './openrouter.llm.service';
// Import other services like OllamaLlmService if you have them

export class LlmServiceFactory {
  private static configServiceInstance: LlmConfigService | null = null;

  private static getConfigService(): LlmConfigService {
    if (!this.configServiceInstance) {
      this.configServiceInstance = new LlmConfigService();
    }
    return this.configServiceInstance;
  }

  public static createService(providerId: LlmProviderId): ILlmService {
    const configService = this.getConfigService();
    const providerConfig = configService.getProviderConfig(providerId);

    if (!providerConfig) {
      throw new Error(`LLM Service Factory: Configuration for provider "${providerId}" not found or provider is disabled.`);
    }

    switch (providerId) {
      case LlmProviderId.OPENAI:
        // Allow OpenRouter key to be used if OpenAI specific key is missing for OpenAI models via OpenRouter
        if (!providerConfig.apiKey && !configService.getProviderConfig(LlmProviderId.OPENROUTER)?.apiKey?.startsWith('sk-or-')) {
           // Check if OpenRouter key is actually an OpenRouter key if using it as a proxy for OpenAI key
          throw new Error("OpenAI API key missing for OpenAI service creation.");
        }
        return new OpenAiLlmService(providerConfig);
      case LlmProviderId.OPENROUTER:
        if (!providerConfig.apiKey) throw new Error("OpenRouter API key missing for OpenRouter service creation.");
        return new OpenRouterLlmService(providerConfig);
      // case LlmProviderId.OLLAMA:
      //   return new OllamaLlmService(providerConfig); // Example
      default:
        throw new Error(`LLM Service Factory: Unsupported LLM provider ID "${providerId}".`);
    }
  }

  public static getDefaultService(): ILlmService {
    const configService = this.getConfigService();
    const { providerId } = configService.getDefaultProviderAndModel();
    console.log(`LlmServiceFactory: Creating default service for provider: ${providerId}`);
    return this.createService(providerId);
  }
}

/**
 * Prepares the model ID for a specific provider.
 * - For OpenAI: Strips "openai/" prefix if present (e.g., "openai/gpt-4o-mini" -> "gpt-4o-mini").
 * - For OpenRouter: Strips "openrouter/" prefix if present (e.g., "openrouter/openai/gpt-4o-mini" -> "openai/gpt-4o-mini").
 * If no prefix and it's a known OpenAI model, it might prefix with "openai/"
 * (though OpenRouter can often infer this for popular models).
 * @param modelId The raw model ID string.
 * @param targetProvider The provider the modelId is being prepared for.
 * @returns The processed model ID suitable for the target provider.
 */
function prepareModelIdForProvider(modelId: string, targetProvider: LlmProviderId, configService: LlmConfigService): string {
  let processedModelId = modelId;

  if (targetProvider === LlmProviderId.OPENAI) {
    if (processedModelId.startsWith(`${LlmProviderId.OPENAI}/`)) {
      processedModelId = processedModelId.substring(`${LlmProviderId.OPENAI}/`.length);
    } else if (processedModelId.startsWith(`${LlmProviderId.OPENROUTER}/${LlmProviderId.OPENAI}/`)) {
      // Handle cases like "openrouter/openai/gpt-4o-mini" -> "gpt-4o-mini" for direct OpenAI call
      processedModelId = processedModelId.substring(`${LlmProviderId.OPENROUTER}/${LlmProviderId.OPENAI}/`.length);
    }
    // If after stripping, it's just the provider name or clearly not a model, use a default
    if (processedModelId === LlmProviderId.OPENAI || !processedModelId || processedModelId.includes('/')) {
        console.warn(`callLlm: Invalid OpenAI model ID '${modelId}' after processing. Using default.`);
        processedModelId = configService.getDefaultOpenAIModel(); // Requires getDefaultOpenAIModel() in LlmConfigService
    }
  } else if (targetProvider === LlmProviderId.OPENROUTER) {
    // OpenRouter expects "provider_slug/model_name", e.g., "openai/gpt-4o-mini"
    // It does NOT want "openrouter/provider_slug/model_name"
    if (processedModelId.startsWith(`${LlmProviderId.OPENROUTER}/`)) {
      processedModelId = processedModelId.substring(`${LlmProviderId.OPENROUTER}/`.length);
    }
    // If 'processedModelId' is now something like "gpt-4o-mini" (without a provider slug),
    // OpenRouter might infer it for popular models, or you might need to prefix it if it's ambiguous
    // e.g., if (isKnownOpenAIModel(processedModelId) && !processedModelId.includes('/')) processedModelId = `openai/${processedModelId}`;
    // For now, assume if it doesn't have a slash, OpenRouter might handle common ones or it's an OpenRouter specific model.
    // The error "openrouter/openai/gpt-4o-mini is not a valid model ID" clearly means the "openrouter/" prefix was the issue.
  }
  // Add logic for other providers if necessary

  return processedModelId;
}


export async function callLlm(
  messages: IChatMessage[],
  requestedModelId: string, // This is modelIdForMode from chat.routes.ts
  params?: IChatCompletionParams,
  preferredProviderIdFromEnv?: LlmProviderId, // From ROUTING_LLM_PROVIDER_ID
  userId?: string
): Promise<ILlmResponse> {
  const configService = new LlmConfigService();
  let providerToUse: LlmProviderId;
  let modelForService: string;

  const defaultProviderInfo = configService.getDefaultProviderAndModel(); // { providerId, modelId (fully qualified) }

  // 1. Determine Provider for the first attempt
  if (preferredProviderIdFromEnv && configService.getProviderConfig(preferredProviderIdFromEnv)) {
    providerToUse = preferredProviderIdFromEnv;
    modelForService = prepareModelIdForProvider(requestedModelId, providerToUse, configService);
  } else if (requestedModelId.includes('/')) {
    const potentialProvider = requestedModelId.split('/')[0].toLowerCase() as LlmProviderId;
    if (Object.values(LlmProviderId).includes(potentialProvider) && configService.getProviderConfig(potentialProvider)) {
      providerToUse = potentialProvider;
      modelForService = prepareModelIdForProvider(requestedModelId, providerToUse, configService);
    } else {
      providerToUse = defaultProviderInfo.providerId;
      modelForService = prepareModelIdForProvider(defaultProviderInfo.modelId, providerToUse, configService); // Use default model for default provider
      console.warn(`callLlm: Could not infer provider from requestedModelId "${requestedModelId}". Using system default provider "${providerToUse}" and model "${modelForService}".`);
    }
  } else { // No preferred provider, no prefix in modelId: use default provider. Model ID assumed to be for that provider.
    providerToUse = defaultProviderInfo.providerId;
    modelForService = prepareModelIdForProvider(requestedModelId, providerToUse, configService);
  }

  console.log(`callLlm (User: ${userId || 'N/A'}): Attempt 1 - Provider: "${providerToUse}", Model: "${modelForService}" (Original request: "${requestedModelId}")`);

  try {
    const service = LlmServiceFactory.createService(providerToUse);
    return await service.generateChatCompletion(messages, modelForService, params);
  } catch (error: any) {
    console.warn(`callLlm: Attempt 1 with Provider: "${providerToUse}", Model: "${modelForService}" failed. Error: ${error.message}`);
    
    const fallbackProviderConfigured = configService.getFallbackProviderId();
    let providerForFallback: LlmProviderId | undefined;

    // Determine actual fallback provider
    if (fallbackProviderConfigured && fallbackProviderConfigured !== providerToUse && configService.getProviderConfig(fallbackProviderConfigured)) {
      providerForFallback = fallbackProviderConfigured;
    } else { // Auto-toggle between openai and openrouter if no specific different fallback is set
      if (providerToUse === LlmProviderId.OPENROUTER && configService.getProviderConfig(LlmProviderId.OPENAI)) {
        providerForFallback = LlmProviderId.OPENAI;
      } else if (providerToUse === LlmProviderId.OPENAI && configService.getProviderConfig(LlmProviderId.OPENROUTER)) {
        providerForFallback = LlmProviderId.OPENROUTER;
      }
    }

    if (providerForFallback) {
      console.log(`callLlm: Attempting fallback to provider "${providerForFallback}".`);
      // For fallback, re-evaluate model based on the original requestedModelId and the new provider
      let modelForFallbackService = prepareModelIdForProvider(requestedModelId, providerForFallback, configService);
      
      console.log(`callLlm: Fallback attempt - Provider: "${providerForFallback}", Model: "${modelForFallbackService}" (Original request: "${requestedModelId}")`);
      try {
        const fallbackService = LlmServiceFactory.createService(providerForFallback);
        return await fallbackService.generateChatCompletion(messages, modelForFallbackService, params);
      } catch (fallbackError: any) {
        console.error(`callLlm: Fallback to Provider: "${providerForFallback}", Model: "${modelForFallbackService}" also failed. Error: ${fallbackError.message}`);
        throw fallbackError; // Re-throw the fallback error to be caught by chat.routes.ts
      }
    } else {
      console.error(`callLlm: No suitable fallback provider configured or available after ${providerToUse} failed.`);
      throw error; // Re-throw the original error
    }
  }
}