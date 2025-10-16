import { LlmConfigService, LlmProviderId, NoLlmProviderConfiguredError } from './llm.config.service.js';
import { OpenAiLlmService } from './openai.llm.service.js';
import { OpenRouterLlmService } from './openrouter.llm.service.js';
import { CostService } from '../cost/cost.service.js';
import { getModelPrice } from '../../../config/models.config.js';
let llmConfigService;
const serviceCache = new Map();
export async function initializeLlmServices() {
    if (llmConfigService) {
        console.warn('[LLM Factory] LLM services already initialized.');
        return;
    }
    try {
        llmConfigService = LlmConfigService.getInstance();
        console.log('[LLM Factory] LLMConfigService instance obtained.');
        const defaultProvider = llmConfigService.getDefaultProviderAndModel();
        if (defaultProvider?.providerId) {
            getLlmService(defaultProvider.providerId);
            console.log(`[LLM Factory] Pre-initialized service for default provider: ${defaultProvider.providerId}`);
        }
    }
    catch (error) {
        console.error('[LLM Factory] CRITICAL: Failed to initialize LlmConfigService:', error);
        if (error instanceof NoLlmProviderConfiguredError) {
            throw error;
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(`Failed to initialize LLM services: ${String(error)}`);
    }
}
export function getLlmService(providerId) {
    if (!llmConfigService) {
        throw new Error('[LLM Factory] LlmConfigService not initialized. Call initializeLlmServices() first.');
    }
    if (serviceCache.has(providerId)) {
        return serviceCache.get(providerId);
    }
    const providerConfig = llmConfigService.getProviderConfig(providerId);
    if (!providerConfig) {
        throw new Error(`[LLM Factory] Configuration not found for LLM provider: ${providerId}`);
    }
    let service;
    switch (providerId) {
        case LlmProviderId.OPENAI:
            service = new OpenAiLlmService(providerConfig);
            break;
        case LlmProviderId.OPENROUTER:
            service = new OpenRouterLlmService(providerConfig);
            break;
        default:
            throw new Error(`[LLM Factory] Unsupported LLM provider: ${providerId}`);
    }
    serviceCache.set(providerId, service);
    console.log(`[LLM Factory] Service for provider "${providerId}" initialized and cached.`);
    return service;
}
export async function callLlm(messages, modelId, params, providerId, userIdForCostTracking = 'system_user_llm_factory') {
    if (!llmConfigService) {
        console.error("[LLM Factory] LlmConfigService not initialized. Call initializeLlmServices() first.");
        await initializeLlmServices();
        if (!llmConfigService) {
            throw new Error("[LLM Factory] Critical: LlmConfigService failed to initialize on demand.");
        }
        console.warn("[LLM Factory] LlmConfigService was initialized on-demand by callLlm. Ensure initializeLlmServices() is part of your application's startup sequence.");
    }
    let effectiveProviderId;
    let effectiveModelId;
    if (providerId) {
        effectiveProviderId = providerId;
        const serviceInstance = getLlmService(effectiveProviderId);
        effectiveModelId = modelId || llmConfigService.getProviderConfig(effectiveProviderId)?.defaultModel || '';
        if (!effectiveModelId) {
            throw new Error(`[LLM Factory] No model ID provided and no default model configured for provider: ${effectiveProviderId}`);
        }
    }
    else if (modelId && modelId.includes('/')) {
        const [inferredProvider, ...modelNameParts] = modelId.split('/');
        const inferredProviderId = inferredProvider.toLowerCase();
        if (llmConfigService.isProviderAvailable(inferredProviderId)) {
            effectiveProviderId = inferredProviderId;
            effectiveModelId = modelNameParts.join('/');
            if (effectiveProviderId === LlmProviderId.OPENROUTER) {
                effectiveModelId = modelId;
            }
        }
        else {
            console.warn(`[LLM Factory] Provider inferred from modelId "${modelId}" (${inferredProviderId}) is not available. Falling back to default provider.`);
            const defaultChoice = llmConfigService.getDefaultProviderAndModel();
            effectiveProviderId = defaultChoice.providerId;
            effectiveModelId = modelId;
        }
    }
    else {
        const defaultChoice = llmConfigService.getDefaultProviderAndModel();
        effectiveProviderId = defaultChoice.providerId;
        effectiveModelId = modelId || defaultChoice.modelId;
    }
    if (!effectiveModelId) {
        throw new Error(`[LLM Factory] Could not resolve a model ID for provider ${effectiveProviderId}.`);
    }
    const service = getLlmService(effectiveProviderId);
    console.log(`[LLM Factory] Calling LLM via provider: "${effectiveProviderId}", model: "${effectiveModelId}"`);
    try {
        const completionParams = {
            ...params,
            tools: params?.tools,
            tool_choice: params?.tool_choice,
        };
        const response = await service.generateChatCompletion(messages, effectiveModelId, completionParams);
        const modelPriceInfo = getModelPrice(response.model || effectiveModelId);
        if (response.usage && modelPriceInfo) {
            const cost = ((response.usage.prompt_tokens || 0) / 1000) * modelPriceInfo.inputCostPer1K +
                ((response.usage.completion_tokens || 0) / 1000) * modelPriceInfo.outputCostPer1K;
            CostService.trackCost(userIdForCostTracking, 'llm', cost, response.model || effectiveModelId, response.usage.prompt_tokens || 0, 'tokens', response.usage.completion_tokens || 0, 'tokens', { provider: effectiveProviderId, stopReason: response.stopReason, hasToolCalls: !!response.toolCalls?.length });
        }
        else if (response.usage) {
            console.warn(`[LLM Factory] Usage reported by LLM for model ${response.model || effectiveModelId}, but no pricing info found. Cost not tracked for this call.`);
        }
        return response;
    }
    catch (error) {
        console.error(`[LLM Factory] Error during callLlm with provider ${effectiveProviderId}, model ${effectiveModelId}: ${error.message}`, error.stack);
        const isRetryableError = !(error.response?.status === 401 || error.response?.status === 403 || error.response?.status === 400);
        if (isRetryableError) {
            const fallbackProviderId = llmConfigService.getFallbackProviderId();
            if (fallbackProviderId && fallbackProviderId !== effectiveProviderId) {
                console.warn(`[LLM Factory] Attempting fallback to provider: ${fallbackProviderId} due to error with ${effectiveProviderId}.`);
                try {
                    const fallbackService = getLlmService(fallbackProviderId);
                    const fallbackModelId = modelId || llmConfigService.getProviderConfig(fallbackProviderId)?.defaultModel || effectiveModelId;
                    const fallbackResponse = await fallbackService.generateChatCompletion(messages, fallbackModelId, params);
                    const fallbackModelPriceInfo = getModelPrice(fallbackResponse.model || fallbackModelId);
                    if (fallbackResponse.usage && fallbackModelPriceInfo) {
                        const fallbackCost = ((fallbackResponse.usage.prompt_tokens || 0) / 1000) * fallbackModelPriceInfo.inputCostPer1K +
                            ((fallbackResponse.usage.completion_tokens || 0) / 1000) * fallbackModelPriceInfo.outputCostPer1K;
                        CostService.trackCost(userIdForCostTracking, 'llm_fallback', fallbackCost, fallbackResponse.model || fallbackModelId, fallbackResponse.usage.prompt_tokens || 0, 'tokens', fallbackResponse.usage.completion_tokens || 0, 'tokens', { originalProvider: effectiveProviderId, provider: fallbackProviderId, stopReason: fallbackResponse.stopReason, hasToolCalls: !!fallbackResponse.toolCalls?.length });
                    }
                    return fallbackResponse;
                }
                catch (fallbackError) {
                    console.error(`[LLM Factory] Fallback LLM call also failed for provider ${fallbackProviderId}: ${fallbackError.message}`);
                    throw error;
                }
            }
        }
        throw error;
    }
}
//# sourceMappingURL=llm.factory.js.map