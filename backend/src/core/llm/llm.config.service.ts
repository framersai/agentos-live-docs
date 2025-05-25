// File: backend/src/core/llm/llm.config.service.ts

/**
 * @file Manages LLM provider configurations.
 * @description This service is responsible for loading, storing, and providing access
 * to configurations for various LLM providers (OpenAI, OpenRouter, etc.).
 * It centralizes how API keys and other provider-specific settings are handled.
 * @version 1.1.0 - Enhanced default provider logic and fallback mechanisms.
 */

import { ILlmProviderConfig } from './llm.interfaces';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Ensure .env is loaded relative to the project root
const __filename = fileURLToPath(import.meta.url);
const __projectRoot = path.resolve(path.dirname(__filename), '../../../..'); // Adjusted path
dotenv.config({ path: path.join(__projectRoot, '.env'), override: true });

/**
 * Enum for supported LLM provider identifiers.
 * These should correspond to keys used in environment variables and configuration.
 */
export enum LlmProviderId {
  OPENAI = 'openai',
  OPENROUTER = 'openrouter',
  ANTHROPIC = 'anthropic',
  OLLAMA = 'ollama',
}

/**
 * Service class for managing LLM provider configurations.
 * It reads configurations from environment variables and provides
 * them in a structured format.
 */
export class LlmConfigService {
  private readonly providerConfigs: Map<LlmProviderId, ILlmProviderConfig>;

  /**
   * Initializes a new instance of the `LlmConfigService`,
   * loading configurations from environment variables.
   */
  constructor() {
    this.providerConfigs = new Map<LlmProviderId, ILlmProviderConfig>();
    this.loadConfigurations();
  }

  /**
   * Loads LLM provider configurations from environment variables.
   * This method is called during service instantiation.
   * It populates the `providerConfigs` map.
   */
  private loadConfigurations(): void {
    // OpenAI Configuration
    const openAIApiKey = process.env.OPENAI_API_KEY;
    if (openAIApiKey && openAIApiKey !== 'YOUR_OPENAI_API_KEY_HERE') {
      this.providerConfigs.set(LlmProviderId.OPENAI, {
        providerId: LlmProviderId.OPENAI,
        apiKey: openAIApiKey,
        baseUrl: process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1',
        defaultModel: process.env.MODEL_PREF_OPENAI_DEFAULT || 'gpt-4o-mini',
      });
    } else {
      console.warn('LlmConfigService: OpenAI API key (OPENAI_API_KEY) is missing or a placeholder. OpenAI provider will be unavailable unless OpenRouter is used for OpenAI models.');
    }

    // OpenRouter Configuration
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (openRouterApiKey && openRouterApiKey !== 'YOUR_OPENROUTER_API_KEY_HERE') {
      this.providerConfigs.set(LlmProviderId.OPENROUTER, {
        providerId: LlmProviderId.OPENROUTER,
        apiKey: openRouterApiKey,
        baseUrl: process.env.OPENROUTER_API_BASE_URL || 'https://openrouter.ai/api/v1',
        defaultModel: process.env.MODEL_PREF_OPENROUTER_DEFAULT || 'openai/gpt-4o-mini', // Example: OpenRouter can route to OpenAI
        additionalHeaders: {
          "HTTP-Referer": process.env.APP_URL || `http://localhost:${process.env.PORT || 3001}`,
          "X-Title": process.env.APP_NAME || "Voice Coding Assistant",
        },
      });
    } else {
      console.warn('LlmConfigService: OpenRouter API key (OPENROUTER_API_KEY) is missing or a placeholder. OpenRouter provider will be unavailable.');
    }

    // Anthropic Configuration
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicApiKey && anthropicApiKey !== 'YOUR_ANTHROPIC_API_KEY_HERE') {
      this.providerConfigs.set(LlmProviderId.ANTHROPIC, {
        providerId: LlmProviderId.ANTHROPIC,
        apiKey: anthropicApiKey,
        baseUrl: process.env.ANTHROPIC_API_BASE_URL || 'https://api.anthropic.com',
        defaultModel: process.env.MODEL_PREF_ANTHROPIC_DEFAULT || 'claude-3-opus-20240229',
         additionalHeaders: {
           "anthropic-version": "2023-06-01", // Required by Anthropic
         }
      });
    } // No warning for Anthropic, considered optional

    // Ollama Configuration
    const ollamaBaseUrl = process.env.OLLAMA_BASE_URL;
    if (ollamaBaseUrl) {
        this.providerConfigs.set(LlmProviderId.OLLAMA, {
            providerId: LlmProviderId.OLLAMA,
            apiKey: undefined, // Ollama typically doesn't use API keys for local instances
            baseUrl: ollamaBaseUrl,
            defaultModel: process.env.MODEL_PREF_OLLAMA_DEFAULT || 'llama3',
        });
    } // No warning for Ollama, considered optional

    console.log(`LlmConfigService: Initialized. Found configurations for: ${Array.from(this.providerConfigs.keys()).join(', ') || 'none'}`);
  }

  /**
   * Retrieves the configuration for a specific LLM provider.
   *
   * @param {LlmProviderId} providerId The identifier of the LLM provider.
   * @returns {ILlmProviderConfig | undefined} The `ILlmProviderConfig` for the specified provider, or `undefined` if not configured.
   */
  public getProviderConfig(providerId: LlmProviderId): ILlmProviderConfig | undefined {
    const config = this.providerConfigs.get(providerId);
    // Do not warn here, let the caller decide if a missing config is an issue.
    return config;
  }

  /**
   * Retrieves the preferred LLM provider ID and model ID based on environment settings.
   *
   * Order of preference:
   * 1. Explicit `ROUTING_LLM_PROVIDER_ID` and `ROUTING_LLM_MODEL_ID` from `.env`.
   * 2. If only `ROUTING_LLM_PROVIDER_ID` is set, use its `defaultModel`.
   * 3. Fallback to OpenRouter if configured, using its `defaultModel`.
   * 4. Fallback to OpenAI if configured, using its `defaultModel`.
   * 5. Absolute fallback (OpenRouter with a common model) if no primary providers are configured.
   *
   * @returns {{ providerId: LlmProviderId; modelId: string }} An object containing the determined `providerId` and `modelId`.
   * @throws {Error} If no usable LLM provider configuration can be resolved.
   */
  public getDefaultProviderAndModel(): { providerId: LlmProviderId; modelId: string } {
    const envRoutingProviderId = process.env.ROUTING_LLM_PROVIDER_ID?.toLowerCase() as LlmProviderId | undefined;
    const envRoutingModelId = process.env.ROUTING_LLM_MODEL_ID;

    // Attempt 1: Explicit .env routing
    if (envRoutingProviderId && this.providerConfigs.has(envRoutingProviderId)) {
      const providerConfig = this.providerConfigs.get(envRoutingProviderId)!;
      const modelIdToUse = envRoutingModelId || providerConfig.defaultModel;
      if (modelIdToUse) {
        console.log(`LlmConfigService: Using explicit routing from .env: Provider=${envRoutingProviderId}, Model=${modelIdToUse}`);
        return { providerId: envRoutingProviderId, modelId: modelIdToUse };
      }
    }

    // Attempt 2: OpenRouter as a primary default (if ROUTING_LLM_PROVIDER_ID is not OpenAI)
    const openRouterConfig = this.getProviderConfig(LlmProviderId.OPENROUTER);
    if (envRoutingProviderId !== LlmProviderId.OPENAI && openRouterConfig?.apiKey && openRouterConfig?.defaultModel) {
      console.log(`LlmConfigService: Defaulting to OpenRouter provider based on configuration priority.`);
      return { providerId: LlmProviderId.OPENROUTER, modelId: openRouterConfig.defaultModel };
    }

    // Attempt 3: OpenAI as a primary default (if ROUTING_LLM_PROVIDER_ID is OpenAI, or OpenRouter not configured)
    const openAiConfig = this.getProviderConfig(LlmProviderId.OPENAI);
    if (openAiConfig?.apiKey && openAiConfig?.defaultModel) {
      console.log(`LlmConfigService: Defaulting to OpenAI provider.`);
      return { providerId: LlmProviderId.OPENAI, modelId: openAiConfig.defaultModel };
    }
    
    // Attempt 4: If OpenRouter was skipped due to envRoutingProviderId being OpenAI, but OpenAI itself is not configured, reconsider OpenRouter.
    if (envRoutingProviderId === LlmProviderId.OPENAI && !openAiConfig && openRouterConfig?.apiKey && openRouterConfig?.defaultModel) {
        console.log(`LlmConfigService: OpenAI specified as routing but not configured; falling back to OpenRouter.`);
        return { providerId: LlmProviderId.OPENROUTER, modelId: openRouterConfig.defaultModel };
    }

    // Critical Fallback
    console.error("LlmConfigService: CRITICAL - No primary LLM providers (OpenAI or OpenRouter with API key & default model) are properly configured. Chat functionality will be severely limited or non-functional.");
    // Provide a hardcoded fallback that implies OpenRouter can access an OpenAI model
    // This is a last resort if .env is misconfigured.
    if(openRouterConfig?.apiKey){ // If openrouter key exists, try to use it with a common model
        console.warn("LlmConfigService: Attempting absolute fallback via OpenRouter due to missing default provider config.");
        return { providerId: LlmProviderId.OPENROUTER, modelId: 'openai/gpt-4o-mini' };
    }
    if(openAiConfig?.apiKey){ // If only openai key exists
        console.warn("LlmConfigService: Attempting absolute fallback via OpenAI due to missing default provider config.");
        return { providerId: LlmProviderId.OPENAI, modelId: 'gpt-4o-mini' };
    }
    
    // If truly nothing is available.
    throw new Error("LlmConfigService: No usable LLM provider configuration found. Please check your .env file for OPENAI_API_KEY or OPENROUTER_API_KEY.");
  }


  /**
   * Gets the fallback LLM provider ID if specified in the environment.
   * @returns {LlmProviderId | undefined} The fallback provider ID or undefined.
   */
  public getFallbackProviderId(): LlmProviderId | undefined {
    return process.env.FALLBACK_LLM_PROVIDER_ID?.toLowerCase() as LlmProviderId | undefined;
  }

  /**
   * Gets a list of all successfully configured (API key present or OLLAma) provider IDs.
   * @returns {LlmProviderId[]} An array of `LlmProviderId` strings.
   */
  public getConfiguredProviders(): LlmProviderId[] {
    return Array.from(this.providerConfigs.values())
      .filter(config => !!config.apiKey || config.providerId === LlmProviderId.OLLAMA) // Ollama doesn't need API key
      .map(config => config.providerId as LlmProviderId);
  }
}