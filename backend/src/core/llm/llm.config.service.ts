// File: backend/src/core/llm/llm.config.service.ts

/**
 * @file Manages LLM provider configurations.
 * @description This service is responsible for loading, storing, and providing access
 * to configurations for various LLM providers (OpenAI, OpenRouter, etc.).
 * It centralizes how API keys and other provider-specific settings are handled.
 * @version 1.1.1 - Added getDefaultOpenAIModel method, refined loading and default provider logic.
 */

import { ILlmProviderConfig } from './llm.interfaces';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Ensure .env is loaded relative to the project root
const __filename = fileURLToPath(import.meta.url);
// Assuming llm.config.service.ts is in backend/src/core/llm/
// Path to project root from backend/src/core/llm/ is ../../../..
const __projectRoot = path.resolve(path.dirname(__filename), '../../../..');
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
  // Add other provider IDs here
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
    if (openAIApiKey && openAIApiKey.trim() !== '' && openAIApiKey !== 'YOUR_OPENAI_API_KEY_HERE') {
      this.providerConfigs.set(LlmProviderId.OPENAI, {
        providerId: LlmProviderId.OPENAI,
        apiKey: openAIApiKey,
        baseUrl: process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1',
        defaultModel: process.env.MODEL_PREF_OPENAI_DEFAULT || 'gpt-4o-mini', // Expected format: "gpt-4o-mini"
      });
    } else {
      console.warn('LlmConfigService: OpenAI API key (OPENAI_API_KEY) is missing or a placeholder. OpenAI provider will be unavailable for direct calls unless its models are accessed via OpenRouter.');
    }

    // OpenRouter Configuration
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (openRouterApiKey && openRouterApiKey.trim() !== '' && openRouterApiKey !== 'YOUR_OPENROUTER_API_KEY_HERE') {
      this.providerConfigs.set(LlmProviderId.OPENROUTER, {
        providerId: LlmProviderId.OPENROUTER,
        apiKey: openRouterApiKey,
        baseUrl: process.env.OPENROUTER_API_BASE_URL || 'https://openrouter.ai/api/v1',
        // Default model for OpenRouter should be fully qualified if it's not an OpenRouter-native model
        defaultModel: process.env.MODEL_PREF_OPENROUTER_DEFAULT || 'openai/gpt-4o-mini', // Expected format: "provider_slug/model_name"
        additionalHeaders: {
          "HTTP-Referer": process.env.APP_URL || `http://localhost:${process.env.PORT || 3001}`,
          "X-Title": process.env.APP_NAME || "Voice Coding Assistant", // APP_NAME from .env if you have it
        },
      });
    } else {
      console.warn('LlmConfigService: OpenRouter API key (OPENROUTER_API_KEY) is missing or a placeholder. OpenRouter provider will be unavailable.');
    }

    // Anthropic Configuration
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicApiKey && anthropicApiKey.trim() !== '' && anthropicApiKey !== 'YOUR_ANTHROPIC_API_KEY_HERE') {
      this.providerConfigs.set(LlmProviderId.ANTHROPIC, {
        providerId: LlmProviderId.ANTHROPIC,
        apiKey: anthropicApiKey,
        baseUrl: process.env.ANTHROPIC_API_BASE_URL || 'https://api.anthropic.com/v1', // Check actual base URL
        defaultModel: process.env.MODEL_PREF_ANTHROPIC_DEFAULT || 'claude-3-opus-20240229', // e.g. "claude-3-opus-20240229"
        additionalHeaders: {
          "anthropic-version": "2023-06-01", // Required by Anthropic
          // "x-api-key": anthropicApiKey, // Some SDKs handle this, others need it in header
        }
      });
    } // No warning for Anthropic if key is missing, considered optional or routed via OpenRouter.

    // Ollama Configuration
    const ollamaBaseUrl = process.env.OLLAMA_BASE_URL;
    if (ollamaBaseUrl && ollamaBaseUrl.trim() !== '') {
        this.providerConfigs.set(LlmProviderId.OLLAMA, {
            providerId: LlmProviderId.OLLAMA,
            apiKey: undefined, // Ollama typically doesn't use API keys for local instances
            baseUrl: ollamaBaseUrl,
            defaultModel: process.env.MODEL_PREF_OLLAMA_DEFAULT || 'llama3', // e.g., "llama3"
        });
    } // No warning for Ollama if URL is missing, considered optional.

    console.log(`LlmConfigService: Initialized. Found configurations for: ${Array.from(this.providerConfigs.keys()).join(', ') || 'none'}`);
  }

  /**
   * Retrieves the configuration for a specific LLM provider.
   *
   * @param {LlmProviderId} providerId The identifier of the LLM provider.
   * @returns {ILlmProviderConfig | undefined} The `ILlmProviderConfig` for the specified provider, or `undefined` if not configured/enabled.
   */
  public getProviderConfig(providerId: LlmProviderId): ILlmProviderConfig | undefined {
    return this.providerConfigs.get(providerId);
  }

  /**
   * Retrieves the preferred LLM provider ID and model ID based on environment settings.
   * The model ID returned here is the "raw" preference from .env or provider defaults,
   * and may need further processing (e.g., prefix stripping) by the calling function (`callLlm`)
   * before being passed to a specific LLM service.
   *
   * @returns {{ providerId: LlmProviderId; modelId: string }} An object containing the determined `providerId` and `modelId`.
   * @throws {Error} If no usable LLM provider configuration can be resolved.
   */
  public getDefaultProviderAndModel(): { providerId: LlmProviderId; modelId: string } {
    const envRoutingProviderId = process.env.ROUTING_LLM_PROVIDER_ID?.toLowerCase() as LlmProviderId | undefined;
    const envRoutingModelId = process.env.ROUTING_LLM_MODEL_ID; // Expected to be provider-aware, e.g., "openai/gpt-4o-mini" or "gpt-4o-mini"

    // Attempt 1: Explicit .env routing
    if (envRoutingProviderId && this.providerConfigs.has(envRoutingProviderId)) {
      const providerConfig = this.providerConfigs.get(envRoutingProviderId)!;
      const modelIdToUse = envRoutingModelId || providerConfig.defaultModel;
      if (modelIdToUse) {
        console.log(`LlmConfigService: Using explicit routing from .env: Provider=${envRoutingProviderId}, Model=${modelIdToUse}`);
        return { providerId: envRoutingProviderId, modelId: modelIdToUse };
      }
    }

    // Attempt 2: OpenRouter as a primary default (if it's configured and not explicitly overridden by OpenAI via ROUTING_LLM_PROVIDER_ID)
    const openRouterConfig = this.getProviderConfig(LlmProviderId.OPENROUTER);
    if (envRoutingProviderId !== LlmProviderId.OPENAI && openRouterConfig?.defaultModel) {
      console.log(`LlmConfigService: Defaulting to OpenRouter provider. Model: ${openRouterConfig.defaultModel}`);
      return { providerId: LlmProviderId.OPENROUTER, modelId: openRouterConfig.defaultModel };
    }

    // Attempt 3: OpenAI as a primary default
    const openAiConfig = this.getProviderConfig(LlmProviderId.OPENAI);
    if (openAiConfig?.defaultModel) {
      console.log(`LlmConfigService: Defaulting to OpenAI provider. Model: ${openAiConfig.defaultModel}`);
      return { providerId: LlmProviderId.OPENAI, modelId: openAiConfig.defaultModel };
    }
    
    // Attempt 4: If explicit routing was OpenAI but OpenAI itself wasn't configured (e.g. missing key), try OpenRouter if available.
    if (envRoutingProviderId === LlmProviderId.OPENAI && !openAiConfig && openRouterConfig?.defaultModel) {
        console.log(`LlmConfigService: OpenAI specified as routing but not configured; falling back to OpenRouter as default. Model: ${openRouterConfig.defaultModel}`);
        return { providerId: LlmProviderId.OPENROUTER, modelId: openRouterConfig.defaultModel };
    }

    // Critical Fallback - if preferred and primary defaults are not set up
    console.warn("LlmConfigService: No primary LLM providers (OpenAI or OpenRouter with API key & default model) are properly configured via .env for default routing. Attempting critical fallback.");
    if(openRouterConfig){ // If OpenRouter is configured at all
        const criticalFallbackModel = openRouterConfig.defaultModel || 'openai/gpt-4o-mini'; // Use its default or a known good one
        console.warn(`LlmConfigService: Critical fallback to OpenRouter with model ${criticalFallbackModel}.`);
        return { providerId: LlmProviderId.OPENROUTER, modelId: criticalFallbackModel };
    }
    if(openAiConfig){ // If OpenAI is configured at all
        const criticalFallbackModel = openAiConfig.defaultModel || 'gpt-4o-mini';
        console.warn(`LlmConfigService: Critical fallback to OpenAI with model ${criticalFallbackModel}.`);
        return { providerId: LlmProviderId.OPENAI, modelId: criticalFallbackModel };
    }
    
    throw new Error("LlmConfigService: No usable LLM provider configuration found. Please check your .env file for API keys and model preferences like OPENAI_API_KEY, MODEL_PREF_OPENAI_DEFAULT, OPENROUTER_API_KEY, MODEL_PREF_OPENROUTER_DEFAULT, ROUTING_LLM_PROVIDER_ID, or ROUTING_LLM_MODEL_ID.");
  }


  /**
   * Gets the fallback LLM provider ID if specified in the environment.
   * @returns {LlmProviderId | undefined} The fallback provider ID or undefined if not set or invalid.
   */
  public getFallbackProviderId(): LlmProviderId | undefined {
    const fallbackId = process.env.FALLBACK_LLM_PROVIDER_ID?.toLowerCase();
    if (fallbackId && Object.values(LlmProviderId).includes(fallbackId as LlmProviderId)) {
        // Ensure the fallback provider is actually configured
        if (this.providerConfigs.has(fallbackId as LlmProviderId)) {
            return fallbackId as LlmProviderId;
        } else {
            console.warn(`LlmConfigService: FALLBACK_LLM_PROVIDER_ID "${fallbackId}" is set but not configured. Fallback ignored.`);
        }
    }
    return undefined;
  }

  /**
   * Gets a sensible default OpenAI model ID, typically used for fallbacks.
   * @returns {string} A valid OpenAI model ID (e.g., "gpt-4o-mini").
   */
  public getDefaultOpenAIModel(): string {
    const openAiProviderConfig = this.providerConfigs.get(LlmProviderId.OPENAI);
    if (openAiProviderConfig?.defaultModel) {
      return openAiProviderConfig.defaultModel; // This should be clean, e.g., "gpt-4o-mini"
    }
    // Fallback to an environment variable for a generic OpenAI default, then a hardcoded known good default
    // Ensure MODEL_PREF_OPENAI_DEFAULT is set in .env if you want to override 'gpt-4o-mini'
    return process.env.MODEL_PREF_OPENAI_DEFAULT || 'gpt-4o-mini';
  }

  /**
   * Gets a list of all provider IDs that have been successfully loaded into configuration.
   * This doesn't necessarily mean they are usable (e.g., API key might be invalid but present).
   * @returns {LlmProviderId[]} An array of `LlmProviderId` strings.
   */
  public getConfiguredProviders(): LlmProviderId[] {
    return Array.from(this.providerConfigs.keys());
  }
}