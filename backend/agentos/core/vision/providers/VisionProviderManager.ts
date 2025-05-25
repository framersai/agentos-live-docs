// File: backend/agentos/core/vision/providers/VisionProviderManager.ts
/**
 * @file VisionProviderManager.ts
 * @module backend/agentos/core/vision/providers/VisionProviderManager
 * @version 1.0.0
 * @description Manages multiple vision provider instances.
 * This class is responsible for initializing, configuring, selecting, and providing
 * access to various `IVisionProvider` implementations. It allows the system
 * to work with different vision AI services through a unified interface,
 * similar to how `AIModelProviderManager` handles LLM providers.
 */

import { IVisionProvider } from './IVisionProvider';
import { BaseVisionProviderConfig, VisionModelInfo } from './VisionProviderConfig';
import { VisionTask } from '../types/VisionOutput';
import { VisionError, VisionErrorCode } from '../errors/VisionError';
import { GMIError, GMIErrorCode } from '../../../../utils/errors';

/**
 * @interface VisionProviderManagerConfig
 * @description Configuration for the VisionProviderManager.
 */
export interface VisionProviderManagerConfig {
  /**
   * @property {BaseVisionProviderConfig[]} providers
   * @description An array of configurations for each vision provider to be managed.
   * Each configuration object must include at least `providerId`, `serviceName`,
   * and a way to instantiate the provider (e.g., a factory function or class reference,
   * though for simplicity here we might assume instantiation happens externally or
   * based on `providerId` mapping to known classes).
   */
  providers: Array<BaseVisionProviderConfig & {
    /**
     * Optional. A factory function to create the provider instance.
     * If not provided, the manager might use a pre-registered mapping of
     * providerId to provider classes.
     */
    factory?: () => IVisionProvider;
    /**
     * Optional. Path to the provider implementation class, if dynamic loading is supported.
     * For this implementation, we'll assume providers are instantiated and passed or created via factory.
     */
    classPath?: string;
  }>;

  /**
   * @property {string} [defaultProviderId]
   * @description Optional. The ID of the provider to use by default if no specific provider is requested
   * or if a model ID doesn't inherently specify its provider.
   */
  defaultProviderId?: string;

  /**
   * @property {Record<string, string[]>} [taskToProviderPreference]
   * @description Optional. A mapping of VisionTask types (or custom task hints) to an ordered list
   * of preferred provider IDs for performing that task.
   * @example { "extract_text_ocr": ["google-cloud-vision", "openai-vision"], "detect_objects": ["amazon-rekognition"] }
   */
  taskToProviderPreference?: Partial<Record<VisionTask | string, string[]>>;
}

/**
 * @class VisionProviderManager
 * @description Manages and provides access to various vision AI service providers.
 * It handles initialization, selection, and basic health monitoring of configured providers.
 */
export class VisionProviderManager {
  private providerInstances: Map<string, IVisionProvider>;
  private providerConfigs: Map<string, BaseVisionProviderConfig>;
  private config!: VisionProviderManagerConfig;
  private _isInitialized: boolean = false;
  private defaultProviderInstance?: IVisionProvider;

  /**
   * Constructs a VisionProviderManager instance.
   */
  constructor() {
    this.providerInstances = new Map<string, IVisionProvider>();
    this.providerConfigs = new Map<string, BaseVisionProviderConfig>();
  }

  /**
   * @property {boolean} isInitialized
   * @description Indicates whether the manager has been successfully initialized.
   * @readonly
   */
  public get isInitialized(): boolean {
    return this._isInitialized;
  }

  /**
   * Initializes the VisionProviderManager with a given configuration.
   * This involves instantiating and initializing each configured vision provider.
   *
   * @async
   * @param {VisionProviderManagerConfig} config - The configuration for the manager.
   * @param {Record<string, () => IVisionProvider>} [providerFactories] - Optional. A map of providerId to factory functions.
   * This is an alternative to embedding factories in the config and allows for dependency injection.
   * @returns {Promise<void>} A promise that resolves when all providers are initialized.
   * @throws {VisionError} If configuration is invalid or any provider fails to initialize.
   */
  public async initialize(
    config: VisionProviderManagerConfig,
    providerFactories?: Record<string, () => IVisionProvider>
  ): Promise<void> {
    if (this._isInitialized) {
      console.warn('VisionProviderManager is already initialized. Re-initializing...');
      // Consider a more robust re-initialization strategy, e.g., shutting down existing providers.
      await this.shutdown(); // Gracefully shutdown existing before re-initializing
    }

    if (!config || !Array.isArray(config.providers) || config.providers.length === 0) {
      throw new VisionError(
        'VisionProviderManager initialization failed: Provider configurations are missing or empty.',
        VisionErrorCode.CONFIGURATION_ERROR,
        { configReceived: config }
      );
    }
    this.config = config;
    this.providerInstances.clear();
    this.providerConfigs.clear();

    for (const providerConfig of this.config.providers) {
      if (!providerConfig.providerId || !providerConfig.serviceName) {
        console.warn('Skipping provider configuration due to missing providerId or serviceName:', providerConfig);
        continue;
      }
      if (!providerConfig.isEnabled === false) { // Check for explicitly false, undefined means true
          if (this.config.logRequests) console.log(`VisionProviderManager: Provider ${providerConfig.providerId} is disabled via configuration. Skipping.`);
          continue;
      }


      let providerInstance: IVisionProvider | undefined;
      try {
        if (providerFactories && providerFactories[providerConfig.providerId]) {
          providerInstance = providerFactories[providerConfig.providerId]();
        } else if (providerConfig.factory) {
          providerInstance = providerConfig.factory();
        } else {
          // Placeholder for future dynamic class loading or predefined mapping
          // For now, we require a factory if not using a known built-in type.
          // This section would map providerConfig.providerId (or a 'type' field in config)
          // to actual class constructors.
          // Example:
          // if (providerConfig.providerId.startsWith('openai-')) {
          //   providerInstance = new OpenAIVisionProvider(providerConfig.providerId);
          // } else ...
          throw new VisionError(
            `No factory or known class for providerId '${providerConfig.providerId}'. Please provide a factory.`,
            VisionErrorCode.CONFIGURATION_ERROR,
            { providerId: providerConfig.providerId }
          );
        }

        if (!providerInstance) {
             throw new VisionError(
            `Failed to instantiate provider '${providerConfig.providerId}'. Factory returned undefined.`,
            VisionErrorCode.CONFIGURATION_ERROR,
            { providerId: providerConfig.providerId }
          );
        }

        await providerInstance.initialize(providerConfig);
        this.providerInstances.set(providerConfig.providerId, providerInstance);
        this.providerConfigs.set(providerConfig.providerId, providerConfig);
        if (this.config.logRequests) console.log(`VisionProviderManager: Provider '${providerConfig.providerId}' (${providerInstance.serviceName}) initialized successfully.`);
      } catch (error: any) {
        const visionError = VisionError.fromError(
            error,
            VisionErrorCode.CONFIGURATION_ERROR,
            `Failed to initialize vision provider '${providerConfig.providerId}'`
        );
        console.error(visionError.message, visionError.details);
        // Decide on error strategy: throw immediately or collect errors and throw once.
        // For now, throwing immediately.
        throw visionError;
      }
    }

    if (this.config.defaultProviderId) {
      this.defaultProviderInstance = this.providerInstances.get(this.config.defaultProviderId);
      if (!this.defaultProviderInstance) {
        console.warn(`VisionProviderManager: Default provider ID '${this.config.defaultProviderId}' specified but not found or failed to initialize.`);
      } else {
         if (this.config.logRequests) console.log(`VisionProviderManager: Default provider set to '${this.config.defaultProviderId}'.`);
      }
    } else if (this.providerInstances.size > 0) {
        // Fallback: set the first initialized provider as default if no explicit default is given
        this.defaultProviderInstance = this.providerInstances.values().next().value;
        this.config.defaultProviderId = this.defaultProviderInstance?.providerId;
        if (this.config.logRequests && this.defaultProviderInstance) {
            console.log(`VisionProviderManager: No explicit default provider. Using first available: '${this.defaultProviderInstance.providerId}'.`);
        }
    }


    if (this.providerInstances.size === 0) {
      console.warn('VisionProviderManager initialized, but no vision providers were successfully configured or enabled.');
    }

    this._isInitialized = true;
    console.log('VisionProviderManager initialized successfully.');
  }

  private ensureInitialized(): void {
    if (!this._isInitialized) {
      throw new VisionError(
        'VisionProviderManager is not initialized. Call initialize() first.',
        VisionErrorCode.CONFIGURATION_ERROR, // Or a dedicated NOT_INITIALIZED error
      );
    }
  }

  /**
   * Retrieves a specific vision provider instance by its ID.
   *
   * @param {string} providerId - The ID of the provider to retrieve.
   * @returns {IVisionProvider | undefined} The provider instance, or undefined if not found or not initialized.
   */
  public getProvider(providerId: string): IVisionProvider | undefined {
    this.ensureInitialized();
    const provider = this.providerInstances.get(providerId);
    if (provider && provider.isInitialized) {
        return provider;
    }
    if (this.config.logRequests && !provider) console.warn(`VisionProviderManager: Provider with ID '${providerId}' not found.`);
    if (this.config.logRequests && provider && !provider.isInitialized) console.warn(`VisionProviderManager: Provider with ID '${providerId}' found but is not initialized.`);
    return undefined;
  }

  /**
   * Retrieves the default vision provider instance.
   * The default is determined by `config.defaultProviderId` or the first available provider.
   *
   * @returns {IVisionProvider | undefined} The default provider instance, or undefined if none available.
   */
  public getDefaultProvider(): IVisionProvider | undefined {
    this.ensureInitialized();
    if (this.defaultProviderInstance && this.defaultProviderInstance.isInitialized) {
        return this.defaultProviderInstance;
    }
    // If default wasn't set or isn't initialized, try to find one again
    if (this.config.defaultProviderId) {
        const provider = this.providerInstances.get(this.config.defaultProviderId);
        if (provider && provider.isInitialized) {
            this.defaultProviderInstance = provider;
            return provider;
        }
    }
    if (this.providerInstances.size > 0) {
        // Attempt to find any initialized provider if the designated default failed
        for (const p of this.providerInstances.values()) {
            if (p.isInitialized) {
                this.defaultProviderInstance = p; // Set this as the new runtime default
                if (this.config.logRequests) console.log(`VisionProviderManager: Original default provider unavailable, falling back to '${p.providerId}'.`);
                return p;
            }
        }
    }
    if (this.config.logRequests) console.warn(`VisionProviderManager: No default provider is available or initialized.`);
    return undefined;
  }

  /**
   * Selects an appropriate provider based on model ID, task hint, or explicit provider ID.
   * Logic:
   * 1. If `preferredProviderId` is given, use that.
   * 2. If `preferredModelId` contains a provider prefix (e.g., "openai/gpt-4o"), parse and use it.
   * 3. If `taskHint` is given, check `taskToProviderPreference` config.
   * 4. Fallback to `defaultProviderId` from config.
   * 5. Fallback to the first available initialized provider.
   *
   * @param {object} [criteria] - Selection criteria.
   * @param {string} [criteria.preferredProviderId] - Explicitly request this provider.
   * @param {string} [criteria.preferredModelId] - Request a provider that supports this model.
   * @param {VisionTask | string} [criteria.taskHint] - Hint about the task to perform.
   * @returns {IVisionProvider | undefined} The selected provider instance, or undefined if no suitable provider is found.
   */
  public selectProvider(criteria?: {
    preferredProviderId?: string;
    preferredModelId?: string;
    taskHint?: VisionTask | string;
  }): IVisionProvider | undefined {
    this.ensureInitialized();

    if (criteria?.preferredProviderId) {
      const provider = this.getProvider(criteria.preferredProviderId);
      if (provider) return provider;
    }

    if (criteria?.preferredModelId) {
      // Attempt to infer provider from modelId (e.g., "openai/gpt-4o")
      if (criteria.preferredModelId.includes('/')) {
        const [pId] = criteria.preferredModelId.split('/');
        const provider = this.getProvider(pId);
        if (provider) return provider; // TODO: Check if provider actually supports this modelId
      }
      // If not inferred, search all providers for one that lists this model
      for (const provider of this.providerInstances.values()) {
        if (provider.isInitialized) {
            // This requires IVisionProvider.listAvailableModels or getModelInfo to be fast or cached
            // For simplicity, assuming a direct check for now or that listAvailableModels is efficient.
            // A more robust way is if providers register their models with the manager upon init.
            const models = provider.listAvailableModels().then(m => m.find(model => model.modelId === criteria.preferredModelId)).catch(() => null);
            // This async check within sync method is problematic. Refactor needed for true model-based selection.
            // For now, this part of selection will be less effective without async or pre-cached model lists.
            // Let's assume for now that if modelId doesn't specify provider, this path is less reliable here.
        }
      }
    }

    if (criteria?.taskHint && this.config.taskToProviderPreference) {
      const preferredIds = this.config.taskToProviderPreference[criteria.taskHint];
      if (preferredIds) {
        for (const pId of preferredIds) {
          const provider = this.getProvider(pId);
          if (provider) return provider;
        }
      }
    }

    return this.getDefaultProvider(); // Fallback to default
  }

  /**
   * Retrieves information for all models available across all initialized providers.
   *
   * @async
   * @param {{ capability?: VisionTask | string }} [filter] - Optional filter for model capabilities.
   * @returns {Promise<VisionModelInfo[]>} A flat list of all available models.
   */
  public async listAllAvailableModels(filter?: { capability?: VisionTask | string }): Promise<VisionModelInfo[]> {
    this.ensureInitialized();
    let allModels: VisionModelInfo[] = [];
    for (const provider of this.providerInstances.values()) {
      if (provider.isInitialized) {
        try {
          const models = await provider.listAvailableModels(filter);
          allModels = allModels.concat(models);
        } catch (error) {
            const visionError = VisionError.fromError(error, VisionErrorCode.PROVIDER_API_ERROR, `Failed to list models from provider '${provider.providerId}'`);
            console.error(visionError.message, visionError.details);
          // Continue to next provider
        }
      }
    }
    // Deduplicate if models can be listed by multiple "instances" of same conceptual provider (though unlikely with providerId uniqueness)
    return Array.from(new Map(allModels.map(m => [`${m.providerId}/${m.modelId}`, m])).values());
  }

  /**
   * Performs a health check on all managed (and initialized) providers.
   * @async
   * @returns {Promise<Array<{ providerId: string; serviceName: string; isHealthy: boolean; details?: any }>>}
   * An array of health check results for each provider.
   */
  public async checkProvidersHealth(): Promise<Array<{
    providerId: string;
    serviceName: string;
    isHealthy: boolean;
    details?: any;
  }>> {
    this.ensureInitialized();
    const healthResults = [];
    for (const provider of this.providerInstances.values()) {
        if (provider.isInitialized) {
            try {
                const health = await provider.checkHealth();
                healthResults.push({
                providerId: provider.providerId,
                serviceName: provider.serviceName,
                ...health,
                });
            } catch (error: any) {
                healthResults.push({
                providerId: provider.providerId,
                serviceName: provider.serviceName,
                isHealthy: false,
                details: { error: `Health check failed: ${error.message}` },
                });
            }
        } else {
             healthResults.push({
                providerId: provider.providerId,
                serviceName: provider.serviceName, // May not be available if provider instance creation failed before init
                isHealthy: false,
                details: { error: 'Provider not initialized.' },
            });
        }
    }
    return healthResults;
  }

  /**
   * Shuts down all managed vision providers.
   * @async
   * @returns {Promise<void>}
   */
  public async shutdown(): Promise<void> {
    if (this.config?.logRequests) console.log('VisionProviderManager: Shutting down all providers...');
    for (const provider of this.providerInstances.values()) {
      if (provider.isInitialized && provider.shutdown) {
        try {
          await provider.shutdown();
        } catch (error) {
            const visionError = VisionError.fromError(error, VisionErrorCode.PROCESSING_FAILED, `Error shutting down provider '${provider.providerId}'`);
            console.error(visionError.message, visionError.details);
        }
      }
    }
    this.providerInstances.clear();
    this.providerConfigs.clear();
    this.defaultProviderInstance = undefined;
    this._isInitialized = false;
    if (this.config?.logRequests) console.log('VisionProviderManager: Shutdown complete.');
  }
}