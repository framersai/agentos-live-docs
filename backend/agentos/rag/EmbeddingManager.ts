// backend/agentos/rag/EmbeddingManager.ts

import { LRUCache } from 'lru-cache';
import {
  IEmbeddingManager,
  EmbeddingRequest,
  EmbeddingResponse,
} from './IEmbeddingManager';
import {
  EmbeddingManagerConfig,
  EmbeddingModelConfig,
  // EmbeddingStrategyConfig, // Not directly used in this refactor but part of config
} from '../config/EmbeddingManagerConfiguration';
import { AIModelProviderManager } from '../core/llm/providers/AIModelProviderManager';
import {
  IProvider,
  // ModelCompletionOptions, // No longer needed directly for embedding calls
  // ModelUsage, // Part of ProviderEmbeddingResponse
  ProviderEmbeddingOptions,
  ProviderEmbeddingResponse,
} from '../core/llm/providers/IProvider';
import { GMIError } from '../../utils/errors'; // Assuming a custom error class

/**
 * @fileoverview Implements the EmbeddingManager, responsible for generating
 * vector embeddings for textual content. It manages configurations for various
 * embedding models, interacts with AIModelProviderManager for actual model calls,
 * and supports features like caching and dynamic model selection.
 * It now uses the dedicated `generateEmbeddings` method from IProvider.
 * @module backend/agentos/rag/EmbeddingManager
 */

interface CachedEmbedding {
  embedding: number[];
  modelId: string;
  timestamp: number;
}

export class EmbeddingManager implements IEmbeddingManager {
  private config!: EmbeddingManagerConfig;
  private providerManager!: AIModelProviderManager;
  private initialized: boolean = false;
  private availableModels: Map<string, EmbeddingModelConfig>;
  private defaultModel?: EmbeddingModelConfig;
  private cache?: LRUCache<string, CachedEmbedding>;

  constructor() {
    this.availableModels = new Map();
  }

  /**
   * @inheritdoc
   */
  public async initialize(
    config: EmbeddingManagerConfig,
    providerManager: AIModelProviderManager
  ): Promise<void> {
    if (this.initialized) {
      console.warn('EmbeddingManager already initialized. Re-initializing.');
    }

    this.config = config;
    this.providerManager = providerManager;
    this.availableModels.clear();

    if (!config.embeddingModels || config.embeddingModels.length === 0) {
      throw new GMIError(
        'EmbeddingManagerConfig: No embedding models provided.',
        'CONFIG_ERROR'
      );
    }

    config.embeddingModels.forEach(modelConfig => {
      if (!modelConfig.modelId || !modelConfig.providerId || !modelConfig.dimension) {
        console.warn(
          `EmbeddingManager: Invalid model configuration skipped: ${JSON.stringify(
            modelConfig
          )}`
        );
        return;
      }
      this.availableModels.set(modelConfig.modelId, modelConfig);
      if (modelConfig.isDefault) {
        this.defaultModel = modelConfig;
      }
    });

    if (!this.defaultModel && config.defaultModelId) {
      this.defaultModel = this.availableModels.get(config.defaultModelId);
    }
    if (!this.defaultModel && this.availableModels.size > 0) {
      this.defaultModel = this.availableModels.values().next().value; // First available as a last resort
      console.warn(
        `EmbeddingManager: No default embedding model explicitly set. Using first available: ${this.defaultModel?.modelId}`
      );
    }

    if (!this.defaultModel) {
      throw new GMIError(
        'EmbeddingManager: No default embedding model could be determined.',
        'CONFIG_ERROR'
      );
    }

    if (config.enableCache !== false) {
      this.cache = new LRUCache<string, CachedEmbedding>({
        max: config.cacheMaxSize || 1000,
        ttl: (config.cacheTTLSeconds || 3600) * 1000, // Convert to ms
      });
      console.log(
        `EmbeddingManager: Cache enabled (maxSize: ${
          config.cacheMaxSize || 1000
        }, ttl: ${config.cacheTTLSeconds || 3600}s).`
      );
    }

    this.initialized = true;
    console.log(
      `EmbeddingManager initialized with ${
        this.availableModels.size
      } models. Default: ${this.defaultModel?.modelId}`
    );
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new GMIError(
        'EmbeddingManager not initialized. Call initialize() first.',
        'NOT_INITIALIZED'
      );
    }
  }

  /**
   * Selects an embedding model based on the request and configured strategy.
   */
  private selectModel(request: EmbeddingRequest): EmbeddingModelConfig {
    this.ensureInitialized();

    // 1. Explicit model in request
    if (request.modelId) {
      const model = this.availableModels.get(request.modelId);
      if (model) {
        // If providerId is also specified, ensure it matches the model's configured provider
        if (request.providerId && request.providerId !== model.providerId) {
          console.warn(
            `EmbeddingManager: Requested providerId "${request.providerId}" for model "${request.modelId}" does not match model's configured provider "${model.providerId}". Using model's provider.`
          );
        }
        return model;
      }
      console.warn(
        `EmbeddingManager: Requested modelId "${request.modelId}" not found. Falling back.`
      );
    }

    const strategy = this.config.selectionStrategy?.type || 'static';
    let selectedModel: EmbeddingModelConfig | undefined;

    switch (strategy) {
      case 'dynamic_quality':
        selectedModel = [...this.availableModels.values()].sort(
          (a, b) => (b.qualityScore || 0) - (a.qualityScore || 0)
        )[0];
        break;
      case 'dynamic_cost':
        selectedModel = [...this.availableModels.values()]
          .filter(m => m.pricePer1MTokensUSD !== undefined)
          .sort((a, b) => (a.pricePer1MTokensUSD || Infinity) - (b.pricePer1MTokensUSD || Infinity))[0];
        break;
      case 'dynamic_collection_preference':
        if (request.collectionId) {
          selectedModel = [...this.availableModels.values()].find(m =>
            m.supportedCollections?.includes(request.collectionId!)
          );
        }
        break;
      case 'static':
      default:
        selectedModel = this.defaultModel;
        break;
    }

    if (!selectedModel && this.config.selectionStrategy?.fallbackModelId) {
      selectedModel = this.availableModels.get(this.config.selectionStrategy.fallbackModelId);
    }
    if (!selectedModel) {
      selectedModel = this.defaultModel;
    }
    if (!selectedModel) {
        throw new GMIError("Could not select any embedding model.", "MODEL_SELECTION_FAILED");
    }
    return selectedModel;
  }

  /**
   * @inheritdoc
   */
  public async generateEmbeddings(
    request: EmbeddingRequest
  ): Promise<EmbeddingResponse> {
    this.ensureInitialized();
    const textsToEmbed = Array.isArray(request.texts)
      ? request.texts
      : [request.texts];

    if (textsToEmbed.length === 0) {
      const defaultModelInfo = this.defaultModel || this.availableModels.values().next().value;
      if (!defaultModelInfo) {
        throw new GMIError("No embedding models configured to determine default model for empty request.", "CONFIG_ERROR");
      }
      return {
        embeddings: [],
        modelId: defaultModelInfo.modelId,
        providerId: defaultModelInfo.providerId,
        usage: { inputTokens: 0, totalTokens: 0 },
      };
    }

    const selectedModelConfig = this.selectModel(request);
    const provider = this.providerManager.getProvider(selectedModelConfig.providerId);

    if (!provider) {
      throw new GMIError(
        `Provider "${selectedModelConfig.providerId}" for model "${selectedModelConfig.modelId}" not found.`,
        'PROVIDER_NOT_FOUND'
      );
    }
    // Check if provider implements generateEmbeddings
    if (typeof provider.generateEmbeddings !== 'function') {
        throw new GMIError(
            `Provider "${selectedModelConfig.providerId}" does not support the 'generateEmbeddings' method.`,
            'METHOD_NOT_SUPPORTED'
        );
    }


    const finalEmbeddings: number[][] = new Array(textsToEmbed.length);
    const errors: Array<{ textIndex: number; message: string; details?: any }> = [];
    let cumulativeInputTokens = 0;
    let cumulativeTotalTokens = 0;
    let cumulativeCostUSD = 0;

    const batchSize = this.config.defaultBatchSize || 32; // Use configured batch size

    for (let i = 0; i < textsToEmbed.length; i += batchSize) {
      const batchTexts = textsToEmbed.slice(i, i + batchSize);
      const currentBatchIndices = batchTexts.map((_, idx) => i + idx); // Original indices in textsToEmbed

      const textsToFetchFromProvider: string[] = [];
      const providerFetchingIndices: number[] = []; // Indices within this batch that need fetching
      const originalIndicesForProviderFetch: number[] = []; // Original indices in textsToEmbed for provider fetch

      // Check cache for each text in the current batch
      if (this.cache) {
        for (let j = 0; j < batchTexts.length; j++) {
          const text = batchTexts[j];
          const cacheKey = `${selectedModelConfig.modelId}:${text}`;
          const cached = this.cache.get(cacheKey);
          if (cached && cached.modelId === selectedModelConfig.modelId) {
            finalEmbeddings[currentBatchIndices[j]] = cached.embedding;
          } else {
            textsToFetchFromProvider.push(text);
            providerFetchingIndices.push(j); // Store index within this batch
            originalIndicesForProviderFetch.push(currentBatchIndices[j]); // Store original overall index
          }
        }
      } else {
        textsToFetchFromProvider.push(...batchTexts);
        providerFetchingIndices.push(...batchTexts.map((_, k) => k));
        originalIndicesForProviderFetch.push(...currentBatchIndices);
      }

      if (textsToFetchFromProvider.length > 0) {
        try {
          const providerOptions: ProviderEmbeddingOptions = {
            userId: request.userId,
            // apiKeyOverride: handled by AIModelProviderManager if user keys are passed to it for the provider
            customModelParams: selectedModelConfig.providerSpecificArgs,
            // Model specific options from EmbeddingModelConfig can be mapped here if ProviderEmbeddingOptions supports them
            // e.g. inputType for OpenAI
            inputType: selectedModelConfig.providerSpecificArgs?.inputType as any,
            dimensions: selectedModelConfig.providerSpecificArgs?.dimensions as any,
          };

          const batchResponse: ProviderEmbeddingResponse = await provider.generateEmbeddings(
            selectedModelConfig.modelId,
            textsToFetchFromProvider,
            providerOptions
          );

          if (batchResponse.error) {
            throw new GMIError(batchResponse.error.message, 'PROVIDER_ERROR', batchResponse.error);
          }

          if (batchResponse.data && batchResponse.data.length === textsToFetchFromProvider.length) {
            batchResponse.data.forEach((embObj, k) => {
              const originalTextIndex = originalIndicesForProviderFetch[k]; // Get the original overall index
              finalEmbeddings[originalTextIndex] = embObj.embedding;
              if (this.cache) {
                const cacheKey = `${selectedModelConfig.modelId}:${textsToFetchFromProvider[k]}`;
                this.cache.set(cacheKey, {
                  embedding: embObj.embedding,
                  modelId: selectedModelConfig.modelId,
                  timestamp: Date.now(),
                });
              }
            });
          } else {
            throw new GMIError(
              'Mismatch in returned embeddings count from provider or no data.',
              'PROVIDER_ERROR',
              { expected: textsToFetchFromProvider.length, received: batchResponse.data?.length }
            );
          }

          cumulativeInputTokens += batchResponse.usage.prompt_tokens || 0;
          cumulativeTotalTokens += batchResponse.usage.total_tokens || 0;
          cumulativeCostUSD += batchResponse.usage.costUSD || 0;

        } catch (error: any) {
          console.error(
            `EmbeddingManager: Error embedding batch with model ${selectedModelConfig.modelId} via provider ${provider.providerId}:`,
            error
          );
          // For texts in this batch that were attempted, mark them as errored
          originalIndicesForProviderFetch.forEach(originalTextIndex => {
            // Avoid overwriting if already successfully processed (e.g. from cache)
            // This error applies to the whole batch fetch attempt.
            // A more granular error per text would require provider support.
            if (!finalEmbeddings[originalTextIndex]) {
                 errors.push({
                    textIndex: originalTextIndex,
                    message: error.message || 'Failed to generate embedding for this text in batch.',
                    details: error instanceof GMIError ? error.details : error.toString(),
                });
                // Optionally, fill with a zero vector or mark specifically
                // finalEmbeddings[originalTextIndex] = new Array(selectedModelConfig.dimension).fill(0.0)
            }
          });
        }
      }
    } // end batch loop

    // Filter out any positions that might still be empty if errors occurred and no placeholder was set
    const successfullyEmbedded = finalEmbeddings.filter(emb => emb !== undefined && emb !== null);

    return {
      embeddings: successfullyEmbedded, // Return only successfully generated or cached embeddings
      modelId: selectedModelConfig.modelId,
      providerId: selectedModelConfig.providerId,
      usage: {
        inputTokens: cumulativeInputTokens,
        totalTokens: cumulativeTotalTokens,
        costUSD: cumulativeCostUSD,
      },
      errors: errors.length > 0 ? errors : undefined,
    };
  }


  /**
   * @inheritdoc
   */
  public async getEmbeddingModelInfo(
    modelId?: string
  ): Promise<EmbeddingModelConfig | undefined> {
    this.ensureInitialized();
    const idToLookup = modelId || this.defaultModel?.modelId;
    if (!idToLookup) return undefined;
    return this.availableModels.get(idToLookup);
  }

  /**
   * @inheritdoc
   */
  public async getEmbeddingDimension(modelId?: string): Promise<number> {
    this.ensureInitialized();
    const modelInfo = await this.getEmbeddingModelInfo(modelId);

    // Try to get dimension from the specific model first
    if (modelInfo?.dimension) {
      return modelInfo.dimension;
    }
    // Fallback to manager's default dimension if model-specific is missing
    if (this.config.defaultEmbeddingDimension) {
      return this.config.defaultEmbeddingDimension;
    }
    // Fallback to the primary default model's dimension
    if (this.defaultModel?.dimension) {
        return this.defaultModel.dimension;
    }

    throw new GMIError(
      `Dimension for embedding model "${modelId || 'default'}" not found or configured, and no system-wide default dimension is set.`,
      'CONFIG_ERROR'
    );
  }

  /**
   * @inheritdoc
   */
  public async checkHealth(): Promise<{ isHealthy: boolean; details?: any }> {
    if (!this.initialized) {
      return { isHealthy: false, details: 'EmbeddingManager not initialized.' };
    }
    // Potentially check health of default model's provider if needed
    // const defaultProvider = this.providerManager.getProvider(this.defaultModel.providerId);
    // const providerHealth = await defaultProvider.checkHealth();
    // if (!providerHealth.isHealthy) return providerHealth;

    return { isHealthy: true, details: `${this.availableModels.size} embedding models configured.` };
  }
}