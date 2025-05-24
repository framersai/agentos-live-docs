// File: backend/agentos/core/llm/providers/AIModelProviderManager.ts
/**
 * @fileoverview Manages different AI Model Provider instances.
 * It loads, configures, and provides access to them, enabling a provider-agnostic
 * approach to model usage within AgentOS. This manager acts as a central registry
 * and factory for IProvider implementations.
 *
 * Key Responsibilities:
 * - Dynamically loading and initializing configured provider instances (e.g., OpenAI, OpenRouter, Ollama).
 * - Providing a unified interface to access specific providers or the default provider.
 * - Mapping model IDs to their respective providers, especially for prefixed model IDs (e.g., "openai/gpt-4o").
 * - Caching and serving lists of all available models across all configured and enabled providers.
 * - Offering methods to retrieve detailed information (`ModelInfo`) for specific models.
 *
 * This class is crucial for decoupling the core AgentOS logic from concrete LLM provider implementations,
 * allowing for flexibility and easier integration of new providers.
 *
 * @module backend/agentos/core/llm/providers/AIModelProviderManager
 */

import { IProvider, ModelInfo } from './IProvider'; // Assumes IProvider.ts is in the same directory
import { OpenAIProvider, OpenAIProviderConfig } from './implementations/OpenAIProvider';
import { OpenRouterProvider, OpenRouterProviderConfig } from './implementations/OpenRouterProvider';
import { OllamaProvider, OllamaProviderConfig } from './implementations/OllamaProvider';
import { GMIError, GMIErrorCode } from '../../../../utils/errors'; // Adjusted path relative to core/llm/providers

/**
 * Configuration for a single AI model provider entry within the manager.
 * @interface ProviderConfigEntry
 * @property {string} providerId - A unique identifier for the provider (e.g., "openai", "openrouter", "ollama"). This should match the `providerId` property of the `IProvider` implementation.
 * @property {boolean} enabled - Whether this provider should be initialized and made available.
 * @property {Partial<OpenAIProviderConfig | OpenRouterProviderConfig | OllamaProviderConfig | Record<string, any>>} config - Provider-specific configuration object. The structure depends on the provider being configured.
 * @property {boolean} [isDefault] - Optional. If true, this provider will be set as the default provider if no other default is already designated. The first provider marked as default will be chosen.
 */
export interface ProviderConfigEntry {
  providerId: string;
  enabled: boolean;
  config: Partial<OpenAIProviderConfig | OpenRouterProviderConfig | OllamaProviderConfig | Record<string, any>>;
  isDefault?: boolean;
}

/**
 * Configuration for the AIModelProviderManager itself.
 * @interface AIModelProviderManagerConfig
 * @property {ProviderConfigEntry[]} providers - An array of configurations for each provider to be managed.
 */
export interface AIModelProviderManagerConfig {
  providers: ProviderConfigEntry[];
}

/**
 * @class AIModelProviderManager
 * @description Manages and provides access to various configured AI model provider instances (`IProvider`).
 * It abstracts the instantiation and retrieval of specific providers, allowing other parts of AgentOS
 * to request models or providers in a more generic way.
 */
export class AIModelProviderManager {
  /**
   * Stores initialized provider instances, keyed by their `providerId`.
   * @private
   * @type {Map<string, IProvider>}
   */
  private readonly providers: Map<string, IProvider> = new Map();

  /**
   * The `providerId` of the designated default provider.
   * @private
   * @type {string | undefined}
   */
  private defaultProviderId?: string;

  /**
   * A map to quickly find the primary provider for a given model ID.
   * This is particularly useful for prefixed model IDs like "openai/gpt-4o".
   * The key is the full `modelId`, and the value is the `providerId`.
   * @private
   * @type {Map<string, string>}
   */
  private readonly modelToProviderMap: Map<string, string> = new Map();

  /**
   * Cache for the aggregated list of all available models from all enabled providers.
   * Nullified when providers are initialized or models are re-cached.
   * @private
   * @type {ModelInfo[] | null}
   */
  private allModelsCache: ModelInfo[] | null = null;

  /**
   * Indicates whether the manager has been successfully initialized.
   * @public
   * @readonly
   * @type {boolean}
   */
  public isInitialized: boolean = false;


  /**
   * Constructs an AIModelProviderManager instance.
   * The manager is not operational until `initialize()` is called.
   */
  constructor() {
    // Initialization logic is deferred to the initialize method.
  }

  /**
   * Initializes the AIModelProviderManager by loading, configuring, and initializing
   * each AI model provider specified in the configuration.
   *
   * @public
   * @async
   * @param {AIModelProviderManagerConfig} config - Configuration object detailing which providers to load
   * and their specific settings (e.g., API keys, base URLs).
   * @returns {Promise<void>} A promise that resolves when all enabled providers have been initialized.
   * @throws {GMIError} If the provided configuration is invalid (e.g., `GMIErrorCode.CONFIGURATION_ERROR`).
   */
  public async initialize(config: AIModelProviderManagerConfig): Promise<void> {
    if (this.isInitialized) {
        console.warn("AIModelProviderManager: Manager is already initialized. Re-initializing will reset providers.");
        this.providers.clear();
        this.modelToProviderMap.clear();
        this.allModelsCache = null;
        this.defaultProviderId = undefined;
    }

    if (!config || !Array.isArray(config.providers)) {
      console.warn("AIModelProviderManager: No providers configured or configuration is invalid. Manager will be empty.");
      this.isInitialized = true; // Mark as initialized even if empty, to prevent repeated errors.
      return;
    }

    for (const providerEntry of config.providers) {
      if (!providerEntry.enabled) {
        console.log(`AIModelProviderManager: Provider '${providerEntry.providerId}' is disabled. Skipping.`);
        continue;
      }

      let providerInstance: IProvider | undefined;
      try {
        switch (providerEntry.providerId.toLowerCase()) { // Normalize providerId for comparison
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

        // Ensure config is at least an empty object if not provided, to prevent errors in provider.initialize
        await providerInstance.initialize(providerEntry.config || {});
        this.providers.set(providerInstance.providerId, providerInstance);
        console.log(`AIModelProviderManager: Initialized provider '${providerInstance.providerId}'.`);

        if (providerEntry.isDefault && !this.defaultProviderId) {
          this.defaultProviderId = providerInstance.providerId;
        }

        await this.cacheModelsFromProvider(providerInstance);

      } catch (error: unknown) {
        const gmiError = createGMIErrorFromError(
            error instanceof Error ? error : new Error(String(error)),
            GMIErrorCode.LLM_PROVIDER_ERROR,
            { providerId: providerEntry.providerId },
            `Failed to initialize provider '${providerEntry.providerId}'`
        );
        console.error(gmiError.message, gmiError.details);
        // Optionally re-throw or collect errors to report initialization status comprehensively.
        // For now, we log and continue to allow other providers to initialize.
      }
    }

    if (!this.defaultProviderId && this.providers.size > 0) {
      // Fallback to the first successfully initialized provider if no default is explicitly set.
      this.defaultProviderId = this.providers.keys().next().value;
    }

    if (this.defaultProviderId) {
      console.log(`AIModelProviderManager: Default provider set to '${this.defaultProviderId}'.`);
    } else if (config.providers.some(p => p.enabled)) {
      console.warn("AIModelProviderManager: No default provider could be set, though some providers were configured and enabled. This might happen if all enabled providers failed to initialize.");
    } else {
      console.log("AIModelProviderManager: No providers enabled or configured. No default provider set.");
    }
    this.isInitialized = true;
    console.log(`AIModelProviderManager initialized with ${this.providers.size} active providers.`);
  }

  /**
   * Caches model information from a given provider and updates the model-to-provider mapping.
   * This is typically called during provider initialization.
   * @private
   * @async
   * @param {IProvider} provider - The provider instance from which to cache models.
   * @returns {Promise<void>}
   */
  private async cacheModelsFromProvider(provider: IProvider): Promise<void> {
    if (provider.isInitialized && typeof provider.listAvailableModels === 'function') {
      try {
        const models = await provider.listAvailableModels();
        models.forEach(model => {
          // ModelInfo now has modelId.
          if (!this.modelToProviderMap.has(model.modelId)) { // Corrected: model.id to model.modelId
            this.modelToProviderMap.set(model.modelId, provider.providerId); // Corrected: model.id to model.modelId
          }
          // For models with provider prefixes (e.g., "openai/gpt-4o" from OpenRouter),
          // the model.modelId itself will be prefixed.
        });
        this.allModelsCache = null; // Invalidate aggregated cache as new models are added.
      } catch (error: unknown) {
        const gmiError = createGMIErrorFromError(
            error instanceof Error ? error : new Error(String(error)),
            GMIErrorCode.LLM_PROVIDER_ERROR,
            { providerId: provider.providerId },
            `Error caching models from provider '${provider.providerId}'`
        );
        console.error(gmiError.message, gmiError.details);
      }
    }
  }

  /**
   * Retrieves an initialized provider instance by its unique ID.
   *
   * @public
   * @param {string} providerId - The ID of the provider to retrieve (e.g., "openai", "ollama").
   * @returns {IProvider | undefined} The provider instance if found and initialized, otherwise `undefined`.
   */
  public getProvider(providerId: string): IProvider | undefined {
    if (!this.isInitialized) {
        console.warn("AIModelProviderManager: Attempted to get provider before initialization.");
        return undefined;
    }
    const provider = this.providers.get(providerId);
    return provider?.isInitialized ? provider : undefined;
  }

  /**
   * Retrieves the configured default provider instance.
   *
   * @public
   * @returns {IProvider | undefined} The default provider instance, or `undefined` if no default is set or initialized.
   */
  public getDefaultProvider(): IProvider | undefined {
    if (!this.isInitialized) {
        console.warn("AIModelProviderManager: Attempted to get default provider before initialization.");
        return undefined;
    }
    return this.defaultProviderId ? this.getProvider(this.defaultProviderId) : undefined;
  }

  /**
   * Attempts to find a suitable provider for a given model ID.
   * It prioritizes direct matches from the `modelToProviderMap` (which handles prefixed IDs well).
   * It can also check if the `modelId` is a default model for any provider or infer from prefixes.
   *
   * @public
   * @param {string} modelId - The model ID (e.g., "gpt-4o", "openai/gpt-4o", "ollama/llama3").
   * @returns {IProvider | undefined} The determined provider instance, or the default provider as a fallback, or `undefined`.
   */
  public getProviderForModel(modelId: string): IProvider | undefined {
    if (!this.isInitialized) {
        console.warn("AIModelProviderManager: Attempted to get provider for model before initialization.");
        return undefined;
    }
    const mappedProviderId = this.modelToProviderMap.get(modelId);
    if (mappedProviderId) {
      const provider = this.getProvider(mappedProviderId);
      if (provider) return provider;
    }

    // Fallback: check if modelId is a default for any provider
    for (const provider of this.providers.values()) {
      if (provider.isInitialized && provider.defaultModelId === modelId) {
        return provider;
      }
    }
    
    // Fallback: if modelId is prefixed e.g., "openai/gpt-4o", try to get the "openai" provider.
    if (modelId.includes('/')) {
      const prefix = modelId.split('/')[0];
      const providerByPrefix = this.getProvider(prefix);
      if (providerByPrefix) return providerByPrefix;
    }

    console.warn(`AIModelProviderManager: Could not determine a specific provider for model '${modelId}'. Falling back to default provider if available.`);
    return this.getDefaultProvider();
  }

  /**
   * Lists all available models aggregated from all initialized and enabled providers.
   * Results are cached for performance and refreshed when providers are initialized/re-cached.
   *
   * @public
   * @async
   * @returns {Promise<ModelInfo[]>} A promise resolving to a combined list of `ModelInfo` objects.
   * Each `ModelInfo` object will be augmented with its `providerId`.
   */
  public async listAllAvailableModels(): Promise<ModelInfo[]> {
    this.ensureInitialized();
    if (this.allModelsCache) {
      return [...this.allModelsCache]; // Return a copy
    }

    let allModels: ModelInfo[] = [];
    const promises: Promise<ModelInfo[]>[] = [];

    for (const provider of this.providers.values()) {
      if (provider.isInitialized && typeof provider.listAvailableModels === 'function') {
        promises.push(
          provider.listAvailableModels().then(models => 
            models.map(m => ({ ...m, providerId: provider.providerId })) // Augment with providerId
          ).catch(error => {
            console.error(`AIModelProviderManager: Failed to list models from provider '${provider.providerId}':`, error);
            return []; // Return empty array for this provider on error
          })
        );
      }
    }
    
    const results = await Promise.allSettled(promises);
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        allModels = allModels.concat(result.value);
      }
    });

    // Deduplicate models if the same modelId appears from multiple sources (preferring first encountered)
    const uniqueModelsMap = new Map<string, ModelInfo>();
    for (const model of allModels) {
        if (!uniqueModelsMap.has(model.modelId)) { // Corrected: model.id to model.modelId
            uniqueModelsMap.set(model.modelId, model); // Corrected: model.id to model.modelId
        }
    }
    this.allModelsCache = Array.from(uniqueModelsMap.values());
    return [...this.allModelsCache]; // Return a copy
  }

  /**
   * Retrieves detailed information (`ModelInfo`) for a specific model ID.
   * It can optionally narrow the search by `providerId`.
   *
   * @public
   * @async
   * @param {string} modelId - The ID of the model to get information for (e.g., "gpt-4o").
   * @param {string} [providerId] - Optional. If specified, narrows the search to this provider.
   * @returns {Promise<ModelInfo | undefined>} Detailed model information if found, otherwise `undefined`.
   */
  public async getModelInfo(modelId: string, providerId?: string): Promise<ModelInfo | undefined> {
    this.ensureInitialized();
    let targetProvider: IProvider | undefined;

    if (providerId) {
      targetProvider = this.getProvider(providerId);
    } else {
      targetProvider = this.getProviderForModel(modelId); // This might infer providerId from modelId prefix
    }
    
    if (targetProvider && typeof targetProvider.getModelInfo === 'function') {
      try {
        const modelInfo = await targetProvider.getModelInfo(modelId); // ModelId might be prefixed here
        if (modelInfo) return { ...modelInfo, providerId: targetProvider.providerId };
      } catch (e) {
        console.warn(`AIModelProviderManager: Error getting model info for '${modelId}' from provider '${targetProvider.providerId}'. Will try cache.`, e);
      }
    }

    // Fallback to searching the aggregated cache
    const allModels = await this.listAllAvailableModels();
    return allModels.find(m => m.modelId === modelId && (providerId ? m.providerId === providerId : true)); // Corrected: m.id to m.modelId
  }

   /**
   * Performs a health check on all configured and enabled providers.
   * Aggregates their health statuses.
   *
   * @public
   * @async
   * @returns {Promise<{ isOverallHealthy: boolean; providerDetails: Array<{ providerId: string; isHealthy: boolean; details?: any }> }>}
   * An object indicating overall health (true if all providers are healthy) and an array of individual provider health details.
   */
  public async checkOverallHealth(): Promise<{
    isOverallHealthy: boolean;
    providerDetails: Array<{ providerId: string; isHealthy: boolean; details?: any }>;
  }> {
    this.ensureInitialized();
    const providerDetails: Array<{ providerId: string; isHealthy: boolean; details?: any }> = [];
    let isOverallHealthy = true;

    for (const provider of this.providers.values()) {
      if (provider.isInitialized && typeof provider.checkHealth === 'function') {
        try {
          const health = await provider.checkHealth();
          providerDetails.push({ providerId: provider.providerId, ...health });
          if (!health.isHealthy) {
            isOverallHealthy = false;
          }
        } catch (error: any) {
          isOverallHealthy = false;
          providerDetails.push({
            providerId: provider.providerId,
            isHealthy: false,
            details: { message: `Health check failed for ${provider.providerId}: ${error.message}`, error }
          });
        }
      } else {
        // Consider providers without a health check method as 'unknown' or assume healthy if initialized.
        providerDetails.push({ providerId: provider.providerId, isHealthy: provider.isInitialized, details: provider.isInitialized ? "Initialized, no specific health check method." : "Not initialized." });
        if(!provider.isInitialized) isOverallHealthy = false;
      }
    }
    return { isOverallHealthy, providerDetails };
  }


  /**
   * Shuts down all initialized providers managed by this manager.
   * Calls the `shutdown` method on each provider.
   *
   * @public
   * @async
   * @returns {Promise<void>} A promise that resolves when all providers have attempted shutdown.
   */
  public async shutdown(): Promise<void> {
    if (!this.isInitialized) {
        console.warn("AIModelProviderManager: Shutdown called but manager was not initialized or already shut down.");
        return;
    }
    console.log("AIModelProviderManager: Shutting down all managed providers...");
    const shutdownPromises: Promise<void>[] = [];
    for (const provider of this.providers.values()) {
      if (provider.isInitialized && typeof provider.shutdown === 'function') {
        shutdownPromises.push(
          provider.shutdown().catch(error => {
            console.error(`AIModelProviderManager: Error shutting down provider '${provider.providerId}':`, error);
            // Continue shutting down other providers
          })
        );
      }
    }
    await Promise.allSettled(shutdownPromises);
    this.providers.clear();
    this.modelToProviderMap.clear();
    this.allModelsCache = null;
    this.defaultProviderId = undefined;
    this.isInitialized = false;
    console.log("AIModelProviderManager: Shutdown complete. All providers processed.");
  }
}