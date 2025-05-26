/**
 * @file Manages LLM provider configurations.
 * @description This service is responsible for loading, storing, and providing access
 * to configurations for various LLM providers (OpenAI, OpenRouter, Anthropic, Ollama).
 * It centralizes how API keys and other provider-specific settings are handled.
 * Implements a singleton pattern for consistent access to configurations.
 * @version 1.2.1 - Enhanced logging for missing keys and clarified default logic.
 */

import { ILlmProviderConfig } from './llm.interfaces';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __projectRoot = path.resolve(path.dirname(__filename), '../../../..');
// Ensure .env is loaded relative to the project root. 'override: true' can be useful
// if .env files are loaded in multiple places, ensuring this one takes precedence for these variables.
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

  private constructor() {
    this.providerConfigs = new Map<LlmProviderId, ILlmProviderConfig>();
    this.loadConfigurations();
  }

  public static getInstance(): LlmConfigService {
    if (!LlmConfigService.instance) {
      LlmConfigService.instance = new LlmConfigService();
    }
    return LlmConfigService.instance;
  }

  private loadConfigurations(): void {
    console.log('LlmConfigService: Loading LLM provider configurations from environment variables...');

    // OpenAI Configuration
    const openAIApiKey = process.env.OPENAI_API_KEY;
    if (openAIApiKey && openAIApiKey.trim() !== '' && !openAIApiKey.startsWith('YOUR_') && !openAIApiKey.endsWith('_HERE')) {
      this.providerConfigs.set(LlmProviderId.OPENAI, {
        providerId: LlmProviderId.OPENAI,
        apiKey: openAIApiKey,
        baseUrl: process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1',
        defaultModel: process.env.MODEL_PREF_OPENAI_DEFAULT || 'gpt-4o-mini',
      });
      console.log('LlmConfigService: OpenAI configuration LOADED.');
    } else {
      console.warn('LlmConfigService: OpenAI API key (OPENAI_API_KEY) is missing, a placeholder, or invalid. OpenAI provider will be UNAVAILABLE for direct calls.');
    }

    // OpenRouter Configuration
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (openRouterApiKey && openRouterApiKey.trim() !== '' && !openRouterApiKey.startsWith('YOUR_') && !openRouterApiKey.endsWith('_HERE')) {
      this.providerConfigs.set(LlmProviderId.OPENROUTER, {
        providerId: LlmProviderId.OPENROUTER,
        apiKey: openRouterApiKey,
        baseUrl: process.env.OPENROUTER_API_BASE_URL || 'https://openrouter.ai/api/v1',
        defaultModel: process.env.MODEL_PREF_OPENROUTER_DEFAULT || 'openai/gpt-4o-mini', // Example: OpenRouter often uses provider-prefixed models
        additionalHeaders: {
          "HTTP-Referer": process.env.APP_URL || `http://localhost:${process.env.PORT || 3001}`,
          "X-Title": process.env.APP_NAME || "Voice Coding Assistant", // Changed from Voice Chat Assistant
        },
      });
      console.log('LlmConfigService: OpenRouter configuration LOADED.');
    } else {
      console.warn('LlmConfigService: OpenRouter API key (OPENROUTER_API_KEY) is missing or a placeholder. OpenRouter provider will be UNAVAILABLE.');
    }

    // Anthropic Configuration
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicApiKey && anthropicApiKey.trim() !== '' && !anthropicApiKey.startsWith('YOUR_') && !anthropicApiKey.endsWith('_HERE')) {
      this.providerConfigs.set(LlmProviderId.ANTHROPIC, {
        providerId: LlmProviderId.ANTHROPIC,
        apiKey: anthropicApiKey,
        baseUrl: process.env.ANTHROPIC_API_BASE_URL || 'https://api.anthropic.com/v1',
        defaultModel: process.env.MODEL_PREF_ANTHROPIC_DEFAULT || 'claude-3-haiku-20240307', // Changed to a more common/recent one
        additionalHeaders: { "anthropic-version": "2023-06-01" } // Check for latest required version
      });
      console.log('LlmConfigService: Anthropic configuration LOADED.');
    } else {
      console.info('LlmConfigService: Anthropic API key (ANTHROPIC_API_KEY) not provided. Anthropic provider will be unavailable.');
    }

    // Ollama Configuration
    const ollamaBaseUrl = process.env.OLLAMA_BASE_URL;
    if (ollamaBaseUrl && ollamaBaseUrl.trim() !== '') {
        this.providerConfigs.set(LlmProviderId.OLLAMA, {
            providerId: LlmProviderId.OLLAMA,
            apiKey: undefined, // Ollama typically doesn't use API keys for local instances
            baseUrl: ollamaBaseUrl,
            defaultModel: process.env.MODEL_PREF_OLLAMA_DEFAULT || 'llama3:latest', // Using :latest tag
        });
        console.log(`LlmConfigService: Ollama configuration LOADED. Base URL: ${ollamaBaseUrl}`);
    } else {
        console.info('LlmConfigService: OLLAMA_BASE_URL not provided. Ollama provider will be unavailable.');
    }
    console.log(`LlmConfigService: Initialization complete. Configured providers: ${Array.from(this.providerConfigs.keys()).join(', ') || 'None'}`);
  }

  public getProviderConfig(providerId: LlmProviderId): ILlmProviderConfig | undefined {
    return this.providerConfigs.get(providerId);
  }
  
  public isProviderAvailable(providerId: LlmProviderId): boolean {
    const config = this.providerConfigs.get(providerId);
    if (!config) return false;
    if (providerId === LlmProviderId.OLLAMA) return !!config.baseUrl; // Ollama needs a base URL
    return !!config.apiKey; // Other providers typically need an API key
  }

  public getAvailableProviders(): LlmProviderId[] {
    return Array.from(this.providerConfigs.keys()).filter(providerId => this.isProviderAvailable(providerId));
  }

  public getDefaultProviderAndModel(): { providerId: LlmProviderId; modelId: string } {
    const envRoutingProviderId = process.env.ROUTING_LLM_PROVIDER_ID?.toLowerCase() as LlmProviderId | undefined;
    const envRoutingModelId = process.env.ROUTING_LLM_MODEL_ID;

    if (envRoutingProviderId && this.isProviderAvailable(envRoutingProviderId)) {
      const providerConfig = this.providerConfigs.get(envRoutingProviderId)!;
      const modelIdToUse = envRoutingModelId || providerConfig.defaultModel;
      if (modelIdToUse) {
        console.log(`LlmConfigService: Using ROUTING_LLM_PROVIDER_ID: ${envRoutingProviderId}, Model: ${modelIdToUse}`);
        return { providerId: envRoutingProviderId, modelId: modelIdToUse };
      }
    }

    // Define a preferred order of providers to check if the .env routing isn't set or valid
    const preferredOrder: LlmProviderId[] = [
        LlmProviderId.OPENROUTER,
        LlmProviderId.OPENAI,
        LlmProviderId.ANTHROPIC,
        LlmProviderId.OLLAMA,
    ];

    for (const providerId of preferredOrder) {
        if (this.isProviderAvailable(providerId)) {
            const config = this.providerConfigs.get(providerId)!;
            if (config.defaultModel) {
                console.log(`LlmConfigService: Defaulting to first available configured provider in preferred order: ${providerId}, Model: ${config.defaultModel}`);
                return { providerId, modelId: config.defaultModel };
            }
        }
    }
    
    console.error("LlmConfigService: CRITICAL - No usable LLM provider configuration could be resolved. All LLM calls will likely fail. Please check your .env file for API keys and base URLs (OPENAI_API_KEY, OPENROUTER_API_KEY, ANTHROPIC_API_KEY, OLLAMA_BASE_URL) and model preferences.");
    throw new Error("LlmConfigService: No usable LLM provider configuration found.");
  }

  public getFallbackProviderId(): LlmProviderId | undefined {
    const fallbackId = process.env.FALLBACK_LLM_PROVIDER_ID?.toLowerCase() as LlmProviderId | undefined;
    if (fallbackId && this.isProviderAvailable(fallbackId)) {
      console.log(`LlmConfigService: Using FALLBACK_LLM_PROVIDER_ID: ${fallbackId}`);
      return fallbackId;
    }
    if (fallbackId) { // If set but not available
        console.warn(`LlmConfigService: FALLBACK_LLM_PROVIDER_ID "${fallbackId}" is set in .env but the provider is not configured or available. Fallback will be ignored.`);
    }
    return undefined;
  }

  public getDefaultOpenAIModel(): string {
    const openAiConfig = this.providerConfigs.get(LlmProviderId.OPENAI);
    return openAiConfig?.defaultModel || process.env.MODEL_PREF_OPENAI_DEFAULT || 'gpt-4o-mini';
  }

  public getDefaultOpenRouterModel(): string {
    const openRouterConfig = this.providerConfigs.get(LlmProviderId.OPENROUTER);
    return openRouterConfig?.defaultModel || process.env.MODEL_PREF_OPENROUTER_DEFAULT || 'openai/gpt-4o-mini';
  }

  public getDefaultAnthropicModel(): string {
    const anthropicConfig = this.providerConfigs.get(LlmProviderId.ANTHROPIC);
    return anthropicConfig?.defaultModel || process.env.MODEL_PREF_ANTHROPIC_DEFAULT || 'claude-3-haiku-20240307';
  }

  public getDefaultOllamaModel(): string {
    const ollamaConfig = this.providerConfigs.get(LlmProviderId.OLLAMA);
    return ollamaConfig?.defaultModel || process.env.MODEL_PREF_OLLAMA_DEFAULT || 'llama3:latest';
  }
}