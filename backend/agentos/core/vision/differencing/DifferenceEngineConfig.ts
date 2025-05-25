// File: backend/agentos/core/vision/differencing/DifferenceEngineConfig.ts
/**
 * @file DifferenceEngineConfig.ts
 * @module backend/agentos/core/vision/differencing/DifferenceEngineConfig
 * @version 1.0.0
 * @description Defines configuration structures for various difference engines
 * used in the vision subsystem to compare visual frames or their features.
 */

/**
 * @enum {string} DifferenceEngineType
 * @description Enumerates the types of available difference engines.
 * This allows for dynamic selection of the differencing strategy.
 */
export enum DifferenceEngineType {
  /** Compares cryptographic or simple image digests for exact or near-exact matches. */
  DIGEST_COMPARISON = 'DigestDifferenceEngine',
  /** Compares extracted abstract image features (e.g., embeddings) using similarity metrics. */
  FEATURE_COMPARISON = 'FeatureDifferenceEngine',
  /** (Future) Compares pixel-level data, possibly with motion estimation. */
  PIXEL_LEVEL_MOTION = 'PixelLevelMotionDifferenceEngine',
  /** (Future) Uses a dedicated model to predict significance of change. */
  MODEL_BASED_CHANGE_DETECTION = 'ModelBasedChangeDetectionEngine',
}

/**
 * @interface BaseDifferenceEngineConfig
 * @description Base configuration applicable to any difference engine implementation.
 */
export interface BaseDifferenceEngineConfig {
  /**
   * @property {DifferenceEngineType} engineType
   * @description The type of this difference engine. Used for factory instantiation or selection.
   */
  engineType: DifferenceEngineType;

  /**
   * @property {boolean} [isEnabled=true]
   * @description Flag to enable or disable this specific engine configuration.
   * @default true
   */
  isEnabled?: boolean;

  /**
   * @property {string} [engineId]
   * @description Optional unique identifier for this specific engine configuration instance,
   * if multiple configurations of the same type are used.
   */
  engineId?: string;

  /**
   * @property {boolean} [logActivity=false]
   * @description If true, the engine should log its comparison activities and results.
   * @default false
   */
  logActivity?: boolean;
}

/**
 * @interface DigestDifferenceEngineConfig
 * @description Configuration specific to the DigestDifferenceEngine.
 */
export interface DigestDifferenceEngineConfig extends BaseDifferenceEngineConfig {
  engineType: DifferenceEngineType.DIGEST_COMPARISON;
  /**
   * @property {'exact' | 'hamming'} comparisonMode
   * @description
   * - `'exact'`: Considers frames different only if their digests do not match exactly. Suitable for cryptographic hashes (MD5, SHA).
   * - `'hamming'`: Calculates Hamming distance between digests. Suitable for perceptual hashes (pHash, aHash, dHash).
   * Requires `hammingDistanceThreshold` to be set in `VisualEnvironmentProfile`.
   * @default 'exact'
   */
  comparisonMode?: 'exact' | 'hamming';

  /**
   * @property {string} [defaultDigestTypePrefix='phash']
   * @description The expected prefix for digests if `comparisonMode` is 'hamming' (e.g., 'phash', 'ahash').
   * The engine will only attempt Hamming distance if digests match this prefix.
   * @default 'phash'
   */
  defaultDigestTypePrefix?: string;
}

/**
 * @interface FeatureDifferenceEngineConfig
 * @description Configuration specific to the FeatureDifferenceEngine.
 */
export interface FeatureDifferenceEngineConfig extends BaseDifferenceEngineConfig {
  engineType: DifferenceEngineType.FEATURE_COMPARISON;
  /**
   * @property {'cosine_similarity' | 'euclidean_distance' | 'custom_llm'} defaultComparisonMetric
   * @description Default metric for comparing feature vectors if not specified by the feature type itself or profile.
   * - `custom_llm` would imply sending textual/categorical features to an LLM for similarity assessment.
   * @default 'cosine_similarity'
   */
  defaultComparisonMetric?: 'cosine_similarity' | 'euclidean_distance' | 'custom_llm';

  /**
   * @property {number} [vectorNormalizationFactor=1.0]
   * @description Optional factor for normalizing feature vectors before comparison, if applicable.
   * @default 1.0 (no normalization by default here, assumes features are pre-normalized or metric handles it)
   */
  vectorNormalizationFactor?: number;

   /**
   * @property {string} [llmModelForComparison]
   * @description If `defaultComparisonMetric` is `custom_llm`, this specifies the LLM model to use
   * for comparing textual/categorical features.
   */
  llmModelForComparison?: string;

  /**
   * @property {string} [llmProviderForComparison]
   * @description Provider for the LLM used in comparison.
   */
  llmProviderForComparison?: string;
}

/**
 * @union AnyDifferenceEngineConfig
 * @description A union type representing all possible specific difference engine configurations.
 * This allows for type-safe handling of engine configurations.
 */
export type AnyDifferenceEngineConfig =
  | DigestDifferenceEngineConfig
  | FeatureDifferenceEngineConfig;
  // Add other engine configs here as they are defined.