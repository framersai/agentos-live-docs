// File: backend/src/core/llm/llm.config.service.ts
/**
 * @file Manages LLM provider configurations.
 * @description This service is responsible for loading, storing, and providing access
 * to configurations for various LLM providers (OpenAI, OpenRouter, etc.).
 * It centralizes how API keys and other provider-specific settings are handled.
 * Implements a singleton pattern.
 * @version 1.2.0 - Added singleton getInstance() and refined default model logic.
 */

import { ILlmProviderConfig } from './llm.interfaces';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Ensure .env is loaded relative to the project root
const __filename = fileURLToPath(import.meta.url);
const __projectRoot = path.resolve(path.dirname(__filename), '../../../..');
dotenv.config({ path: path.join(__projectRoot, '.env'), override: true });

/**
 * Enum for supported LLM provider identifiers.
 */
export enum LlmProviderId {
  OPENAI = 'openai',
  OPENROUTER = 'openrouter',
  ANTHROPIC = 'anthropic',
  OLLAMA = 'ollama',
}

/**
 * Service class for managing LLM provider configurations.
 */
export class LlmConfigService {
  private static instance: LlmConfigService;
  private readonly providerConfigs: Map<LlmProviderId, ILlmProviderConfig>;

  /**
   * Private constructor to enforce singleton pattern.
   * Initializes a new instance of the `LlmConfigService`,
   * loading configurations from environment variables.
   */
  private constructor() {
    this.providerConfigs = new Map<LlmProviderId, ILlmProviderConfig>();
    this.loadConfigurations();
  }

  /**
   * Gets the singleton instance of the LlmConfigService.
   * @returns {LlmConfigService} The singleton instance.
   */
  public static getInstance(): LlmConfigService {
    if (!LlmConfigService.instance) {
      LlmConfigService.instance = new LlmConfigService();
    }
    return LlmConfigService.instance;
  }

  /**
   * Loads LLM provider configurations from environment variables.
   */
  private loadConfigurations(): void {
    // OpenAI Configuration
    const openAIApiKey = process.env.OPENAI_API_KEY;
    if (openAIApiKey && openAIApiKey.trim() !== '' && !openAIApiKey.startsWith('YOUR_') && !openAIApiKey.endsWith('_HERE')) {
      this.providerConfigs.set(LlmProviderId.OPENAI, {
        providerId: LlmProviderId.OPENAI,
        apiKey: openAIApiKey,
        baseUrl: process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1',
        defaultModel: process.env.MODEL_PREF_OPENAI_DEFAULT || 'gpt-4o-mini',
      });
    } else {
      console.warn('LlmConfigService: OpenAI API key (OPENAI_API_KEY) is missing or a placeholder. OpenAI provider will be unavailable for direct calls unless its models are accessed via OpenRouter.');
    }

    // OpenRouter Configuration
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (openRouterApiKey && openRouterApiKey.trim() !== '' && !openRouterApiKey.startsWith('YOUR_') && !openRouterApiKey.endsWith('_HERE')) {
      this.providerConfigs.set(LlmProviderId.OPENROUTER, {
        providerId: LlmProviderId.OPENROUTER,
        apiKey: openRouterApiKey,
        baseUrl: process.env.OPENROUTER_API_BASE_URL || 'https://openrouter.ai/api/v1',
        defaultModel: process.env.MODEL_PREF_OPENROUTER_DEFAULT || 'openai/gpt-4o-mini',
        additionalHeaders: {
          "HTTP-Referer": process.env.APP_URL || `http://localhost:${process.env.PORT || 3001}`,
          "X-Title": process.env.APP_NAME || "Voice Chat Assistant",
        },
      });
    } else {
      console.warn('LlmConfigService: OpenRouter API key (OPENROUTER_API_KEY) is missing or a placeholder. OpenRouter provider will be unavailable.');
    }

    // Anthropic Configuration
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicApiKey && anthropicApiKey.trim() !== '' && !anthropicApiKey.startsWith('YOUR_') && !anthropicApiKey.endsWith('_HERE')) {
      this.providerConfigs.set(LlmProviderId.ANTHROPIC, {
        providerId: LlmProviderId.ANTHROPIC,
        apiKey: anthropicApiKey,
        baseUrl: process.env.ANTHROPIC_API_BASE_URL || 'https://api.anthropic.com/v1',
        defaultModel: process.env.MODEL_PREF_ANTHROPIC_DEFAULT || 'claude-3-opus-20240229',
        additionalHeaders: { "anthropic-version": "2023-06-01" }
      });
    }

    // Ollama Configuration
    const ollamaBaseUrl = process.env.OLLAMA_BASE_URL;
    if (ollamaBaseUrl && ollamaBaseUrl.trim() !== '') {
        this.providerConfigs.set(LlmProviderId.OLLAMA, {
            providerId: LlmProviderId.OLLAMA,
            apiKey: undefined,
            baseUrl: ollamaBaseUrl,
            defaultModel: process.env.MODEL_PREF_OLLAMA_DEFAULT || 'llama3',
        });
    }
    console.log(`LlmConfigService: Initialized. Found configurations for: ${Array.from(this.providerConfigs.keys()).join(', ') || 'none'}`);
  }

  /**
   * Retrieves the configuration for a specific LLM provider.
   * @param {LlmProviderId} providerId The identifier of the LLM provider.
   * @returns {ILlmProviderConfig | undefined} The config or undefined if not found.
   */
  public getProviderConfig(providerId: LlmProviderId): ILlmProviderConfig | undefined {
    return this.providerConfigs.get(providerId);
  }
  
  /**
   * Checks if a provider has a valid configuration (e.g., API key is present).
   * @param {LlmProviderId} providerId The ID of the provider to check.
   * @returns {boolean} True if the provider is considered available, false otherwise.
   */
  public isProviderAvailable(providerId: LlmProviderId): boolean {
    const config = this.providerConfigs.get(providerId);
    if (!config) return false;
    // Ollama doesn't require an API key
    if (providerId === LlmProviderId.OLLAMA) return !!config.baseUrl;
    return !!config.apiKey;
  }

  /**
   * Gets a list of available (configured and having necessary credentials) provider IDs.
   * @returns {LlmProviderId[]} An array of available LlmProviderId strings.
   */
  public getAvailableProviders(): LlmProviderId[] {
    return Array.from(this.providerConfigs.keys()).filter(providerId => this.isProviderAvailable(providerId));
  }

  /**
   * Retrieves the preferred LLM provider ID and model ID based on environment settings.
   * @returns {{ providerId: LlmProviderId; modelId: string }} Determined provider and model.
   * @throws {Error} If no usable LLM provider configuration can be resolved.
   */
  public getDefaultProviderAndModel(): { providerId: LlmProviderId; modelId: string } {
    const envRoutingProviderId = process.env.ROUTING_LLM_PROVIDER_ID?.toLowerCase() as LlmProviderId | undefined;
    const envRoutingModelId = process.env.ROUTING_LLM_MODEL_ID;

    if (envRoutingProviderId && this.isProviderAvailable(envRoutingProviderId)) {
      const providerConfig = this.providerConfigs.get(envRoutingProviderId)!;
      const modelIdToUse = envRoutingModelId || providerConfig.defaultModel;
      if (modelIdToUse) {
        return { providerId: envRoutingProviderId, modelId: modelIdToUse };
      }
    }

    const preferredOrder: LlmProviderId[] = [
        LlmProviderId.OPENROUTER, // Prioritize OpenRouter if available
        LlmProviderId.OPENAI,
        LlmProviderId.ANTHROPIC,
        LlmProviderId.OLLAMA,
    ];

    for (const providerId of preferredOrder) {
        if (this.isProviderAvailable(providerId)) {
            const config = this.providerConfigs.get(providerId)!;
            if (config.defaultModel) {
                console.log(`LlmConfigService: Defaulting to first available configured provider: ${providerId}, Model: ${config.defaultModel}`);
                return { providerId, modelId: config.defaultModel };
            }
        }
    }
    
    throw new Error("LlmConfigService: No usable LLM provider configuration found. Please check your .env file.");
  }

  /**
   * Gets the fallback LLM provider ID if specified and available.
   * @returns {LlmProviderId | undefined} The fallback provider ID or undefined.
   */
  public getFallbackProviderId(): LlmProviderId | undefined {
    const fallbackId = process.env.FALLBACK_LLM_PROVIDER_ID?.toLowerCase() as LlmProviderId | undefined;
    if (fallbackId && this.isProviderAvailable(fallbackId)) {
      return fallbackId;
    }
    if (fallbackId) {
        console.warn(`LlmConfigService: FALLBACK_LLM_PROVIDER_ID "${fallbackId}" is set but not configured/available. Fallback ignored.`);
    }
    return undefined;
  }

  /**
   * Gets a sensible default OpenAI model ID.
   * @returns {string} A valid OpenAI model ID.
   */
  public getDefaultOpenAIModel(): string {
    const openAiConfig = this.providerConfigs.get(LlmProviderId.OPENAI);
    return openAiConfig?.defaultModel || process.env.MODEL_PREF_OPENAI_DEFAULT || 'gpt-4o-mini';
  }

   /**
   * Gets a sensible default OpenRouter model ID.
   * @returns {string} A valid OpenRouter model ID (usually provider-prefixed).
   */
  public getDefaultOpenRouterModel(): string {
    const openRouterConfig = this.providerConfigs.get(LlmProviderId.OPENROUTER);
    return openRouterConfig?.defaultModel || process.env.MODEL_PREF_OPENROUTER_DEFAULT || 'openai/gpt-4o-mini';
  }
}