// backend/agentos/core/llm/providers/AIModelProviderManager.ts

import { IProvider, ModelInfo } from './IProvider';
import { OpenAIProvider, OpenAIProviderConfig } from './implementations/OpenAIProvider';
import { OpenRouterProvider, OpenRouterProviderConfig } from './implementations/OpenRouterProvider';
import { OllamaProvider, OllamaProviderConfig } from './implementations/OllamaProvider';

/**
 * @fileoverview Manages different AI Model Provider instances.
 * It loads, configures, and provides access to them, enabling a provider-agnostic
 * approach to model usage within AgentOS.
 * @module agentos/core/llm/providers/AIModelProviderManager
 */

export interface ProviderConfigEntry {
  providerId: string; // "openai", "openrouter", "ollama"
  enabled: boolean;
  config: Partial<OpenAIProviderConfig | OpenRouterProviderConfig | OllamaProviderConfig | Record<string, any>>; // Specific config for the provider
  isDefault?: boolean;
}

export interface AIModelProviderManagerConfig {
  providers: ProviderConfigEntry[];
}

export class AIModelProviderManager {
  private providers: Map<string, IProvider> = new Map();
  private defaultProviderId?: string;
  private modelToProviderMap: Map<string, string> = new Map(); // modelId -> providerId
  private allModelsCache: ModelInfo[] | null = null;

  constructor() {
    // console.log("AIModelProviderManager created.");
  }

  /**
   * Initializes the manager by loading and initializing configured providers.
   * @param {AIModelProviderManagerConfig} config - Configuration detailing which providers to load and their settings.
   */
  public async initialize(config: AIModelProviderManagerConfig): Promise<void> {
    if (!config || !config.providers) {
      console.warn("AIModelProviderManager: No providers configured. Manager will be empty.");
      return;
    }

    for (const providerEntry of config.providers) {
      if (!providerEntry.enabled) {
        console.log(`AIModelProviderManager: Provider '${providerEntry.providerId}' is disabled. Skipping.`);
        continue;
      }

      let providerInstance: IProvider | undefined;
      try {
        switch (providerEntry.providerId) {
          case 'openai':
            providerInstance = new OpenAIProvider();
            break;
          case 'openrouter':
            providerInstance = new OpenRouterProvider();
            break;
          case 'ollama':
            providerInstance = new OllamaProvider();
            break;
          default:
            console.warn(`AIModelProviderManager: Unknown provider ID '${providerEntry.providerId}'. Skipping.`);
            continue;
        }

        await providerInstance.initialize(providerEntry.config as any); // Cast, ensure config matches
        this.providers.set(providerInstance.providerId, providerInstance);
        console.log(`AIModelProviderManager: Initialized provider '${providerInstance.providerId}'.`);

        if (providerEntry.isDefault && !this.defaultProviderId) {
          this.defaultProviderId = providerInstance.providerId;
        }

        // Cache models from this provider
        await this.cacheModelsFromProvider(providerInstance);

      } catch (error: any) {
        console.error(`AIModelProviderManager: Failed to initialize provider '${providerEntry.providerId}': ${error.message}`);
      }
    }

    if (!this.defaultProviderId && this.providers.size > 0) {
      // Fallback to the first initialized provider if no default is explicitly set
      this.defaultProviderId = this.providers.keys().next().value;
    }
    if (this.defaultProviderId) {
        console.log(`AIModelProviderManager: Default provider set to '${this.defaultProviderId}'.`);
    } else {
        console.warn("AIModelProviderManager: No default provider could be set.");
    }
    console.log(`AIModelProviderManager initialized with ${this.providers.size} providers.`);
  }

  private async cacheModelsFromProvider(provider: IProvider): Promise<void> {
    if (provider.isInitialized && typeof provider.listAvailableModels === 'function') {
        try {
            const models = await provider.listAvailableModels();
            models.forEach(model => {
                // For models like 'openai/gpt-3.5-turbo' from OpenRouter, we don't want to map 'gpt-3.5-turbo' directly to OpenRouter
                // if an OpenAI provider also offers 'gpt-3.5-turbo'.
                // The modelToProviderMap should store the provider that *claims* this exact model ID.
                // OpenRouter model IDs are already prefixed, e.g., "openai/gpt-3.5-turbo"
                if (!this.modelToProviderMap.has(model.id)) { // Prioritize first provider listing a model ID
                    this.modelToProviderMap.set(model.id, provider.providerId);
                }
            });
            this.allModelsCache = null; // Invalidate full cache
        } catch (error: any) {
            console.error(`AIModelProviderManager: Error caching models from provider '${provider.providerId}': ${error.message}`);
        }
    }
  }


  /**
   * Gets an initialized provider instance by its ID.
   * @param {string} providerId - The ID of the provider.
   * @returns {IProvider | undefined} The provider instance or undefined if not found/initialized.
   */
  public getProvider(providerId: string): IProvider | undefined {
    const provider = this.providers.get(providerId);
    return provider?.isInitialized ? provider : undefined;
  }

  /**
   * Gets the configured default provider instance.
   * @returns {IProvider | undefined} The default provider instance.
   */
  public getDefaultProvider(): IProvider | undefined {
    return this.defaultProviderId ? this.getProvider(this.defaultProviderId) : undefined;
  }

  /**
   * Attempts to find a provider that supports a given model ID.
   * This relies on models being uniquely named or providers having a way to declare their models.
   * OpenRouter models are usually prefixed (e.g., "openai/gpt-3.5-turbo").
   * @param {string} modelId - The model ID (can be provider-prefixed).
   * @returns {IProvider | undefined} The provider instance or undefined.
   */
  public getProviderForModel(modelId: string): IProvider | undefined {
    const directProviderId = this.modelToProviderMap.get(modelId);
    if (directProviderId) {
        return this.getProvider(directProviderId);
    }

    // Fallback for non-prefixed modelIDs that might be default for a provider
    for (const provider of this.providers.values()) {
        if (provider.isInitialized && provider.defaultModelId === modelId) return provider;
        // Check if provider lists this model (more robust check needed via listAvailableModels metadata)
        // This simple check might not be enough if multiple providers offer a model with the same generic ID.
    }
    
    // If modelId has a prefix like 'openai/...' try to get 'openai' provider
    if (modelId.includes('/')) {
        const prefix = modelId.split('/')[0];
        const provider = this.getProvider(prefix);
        if (provider) return provider;
    }

    console.warn(`AIModelProviderManager: Could not determine a specific provider for model '${modelId}'. Falling back to default.`);
    return this.getDefaultProvider();
  }

  /**
   * Lists all available models from all initialized providers.
   * @returns {Promise<ModelInfo[]>} A combined list of models.
   */
  public async listAllAvailableModels(): Promise<ModelInfo[]> {
    if (this.allModelsCache) return this.allModelsCache;

    let allModels: ModelInfo[] = [];
    for (const provider of this.providers.values()) {
      if (provider.isInitialized && typeof provider.listAvailableModels === 'function') {
        try {
          const models = await provider.listAvailableModels();
          allModels = allModels.concat(models.map(m => ({...m, providerId: provider.providerId})));
        } catch (error) {
          console.error(`AIModelProviderManager: Failed to list models from ${provider.providerId}`, error);
        }
      }
    }
    this.allModelsCache = allModels;
    return allModels;
  }

  /**
   * Gets detailed information for a specific model if available.
   * @param modelId The ID of the model (can be provider-prefixed).
   * @param providerId Optional: specify the provider if known.
   * @returns {Promise<ModelInfo | undefined>}
   */
  public async getModelInfo(modelId: string, providerId?: string): Promise<ModelInfo | undefined> {
      let targetProvider = providerId ? this.getProvider(providerId) : this.getProviderForModel(modelId);
      if (!targetProvider && modelId.includes('/')) { // Try parsing provider from modelId
          const prefix = modelId.split('/')[0];
          targetProvider = this.getProvider(prefix);
      }
      if (targetProvider && typeof targetProvider.listAvailableModels === 'function') {
          const models = await targetProvider.listAvailableModels();
          return models.find(m => m.id === modelId);
      }
      // If not found with specific provider, search all cached models
      const allModels = await this.listAllAvailableModels();
      return allModels.find(m => m.id === modelId && (providerId ? m.providerId === providerId : true));
  }
}