// File: backend/agentos/core/vision/differencing/engines/FeatureDifferenceEngine.ts
/**
 * @file FeatureDifferenceEngine.ts
 * @module backend/agentos/core/vision/differencing/engines/FeatureDifferenceEngine
 * @version 1.0.0
 * @description Implements a difference engine that compares frames based on their
 * extracted abstract features (e.g., embeddings, categorical tags). This allows for
 * more nuanced semantic comparison than simple digest matching.
 */

import { IDifferenceEngine, DifferenceScore } from '../IDifferenceEngine';
import { FeatureDifferenceEngineConfig, DifferenceEngineType } from '../DifferenceEngineConfig';
import { CachedFrameInfo } from '../../types/CachedFrame';
import { VisualEnvironmentProfile } from '../../types/VisualEnvironment';
import { VisionError, VisionErrorCode } from '../../errors/VisionError';
import {
  ImageFeatureSet,
  ImageFeatureVector,
  ImageCategoricalFeatures,
  ImageDigestFeatures,
} from '../../types/VisionOutput';
import { v4 as uuidv4 } from 'uuid';
// For potential LLM-based comparison of categorical features, we might need:
// import { UtilityLLMService } from '../../../../services/llm_utility/UtilityLLMService'; // If used directly
// import { AIModelProviderManager } from '../../llm/providers/AIModelProviderManager'; // If constructing LLM service

/**
 * @class FeatureDifferenceEngine
 * @implements IDifferenceEngine
 * @description Compares frames using their extracted `ImageFeatureSet`.
 * Relies on appropriate features being present in `CachedFrameInfo.extractedFeatures`.
 */
export class FeatureDifferenceEngine implements IDifferenceEngine {
  public readonly engineId: string;
  private config!: Required<FeatureDifferenceEngineConfig>;
  private _isInitialized: boolean = false;

  // Optional: For 'custom_llm' comparison of categorical features
  // private llmService?: UtilityLLMService;

  /**
   * Constructs a FeatureDifferenceEngine instance.
   * @param {string} [engineId] - Optional unique ID for this engine instance.
   * @param {any} [dependencies] - Optional dependencies, e.g., { llmService } for custom_llm comparison.
   */
  constructor(engineId?: string, dependencies?: { /* llmService?: UtilityLLMService */ }) {
    this.engineId = engineId || `feature-diff-engine-${uuidv4()}`;
    // if (dependencies?.llmService) this.llmService = dependencies.llmService;
  }

  /** @inheritdoc */
  public get isInitialized(): boolean {
    return this._isInitialized;
  }

  /** @inheritdoc */
  public async initialize(config: FeatureDifferenceEngineConfig): Promise<void> {
    if (config.engineType !== DifferenceEngineType.FEATURE_COMPARISON) {
      throw new VisionError(
        `Configuration engineType '${config.engineType}' does not match FeatureDifferenceEngine.`,
        VisionErrorCode.CONFIGURATION_ERROR,
        { expected: DifferenceEngineType.FEATURE_COMPARISON, actual: config.engineType, engineId: this.engineId }
      );
    }
    this.config = {
      defaultComparisonMetric: 'cosine_similarity',
      vectorNormalizationFactor: 1.0,
      isEnabled: true,
      logActivity: false,
      ...config,
      engineId: this.engineId,
    };

    // Basic validation
    if (this.config.defaultComparisonMetric === 'custom_llm' && (!this.config.llmModelForComparison /*|| !this.llmService*/)) {
      console.warn(`FeatureDifferenceEngine (ID: ${this.engineId}): 'custom_llm' metric selected but LLM model or service is not configured. LLM-based comparison will fail.`);
    }

    this._isInitialized = true;
    if (this.config.logActivity) {
      console.log(`FeatureDifferenceEngine (ID: ${this.engineId}) initialized. Default Metric: ${this.config.defaultComparisonMetric}.`);
    }
  }

  private ensureInitialized(): void {
    if (!this._isInitialized) {
      throw new VisionError(
        `FeatureDifferenceEngine (ID: ${this.engineId}) is not initialized.`,
        VisionErrorCode.CONFIGURATION_ERROR,
        { engineId: this.engineId }
      );
    }
  }

  private calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length || vecA.length === 0) {
      throw new VisionError("Vectors must have the same non-zero length for cosine similarity.", VisionErrorCode.INPUT_VALIDATION_FAILED);
    }
    let dotProduct = 0;
    let magA = 0;
    let magB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      magA += vecA[i] * vecA[i];
      magB += vecB[i] * vecB[i];
    }
    magA = Math.sqrt(magA);
    magB = Math.sqrt(magB);

    if (magA === 0 || magB === 0) {
      return 0; // Or handle as error/undefined, similarity is ill-defined
    }
    return dotProduct / (magA * magB);
  }

  private calculateJaccardIndex(setA: Set<string>, setB: Set<string>): number {
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    if (union.size === 0) {
      return 1.0; // Both empty, considered identical
    }
    return intersection.size / union.size;
  }

  /** @inheritdoc */
  public async calculateDifference(
    currentFrameInfo: Readonly<CachedFrameInfo>,
    referenceFrameInfo: Readonly<CachedFrameInfo>,
    environmentProfile: Readonly<VisualEnvironmentProfile>,
  ): Promise<DifferenceScore> {
    this.ensureInitialized();

    const features1 = currentFrameInfo.extractedFeatures;
    const features2 = referenceFrameInfo.extractedFeatures;

    if (!features1 || !features2) {
      throw new VisionError(
        'Extracted features are missing from one or both CachedFrameInfo objects.',
        VisionErrorCode.INPUT_VALIDATION_FAILED,
        {
          currentFeaturesPresent: !!features1,
          refFeaturesPresent: !!features2,
          engineId: this.engineId,
        }
      );
    }

    if (features1.type !== features2.type) {
      // If feature types are different, they are considered maximally different.
      // A more sophisticated engine might try to find a common comparable subset.
      if (this.config.logActivity) {
        console.warn(`FeatureDifferenceEngine (ID: ${this.engineId}): Feature types mismatch ('${features1.type}' vs '${features2.type}'). Assuming maximal difference.`);
      }
      return {
        score: 1.0, // Max difference
        isSignificant: true, // Different types are always significant
        methodUsed: 'type_mismatch',
        thresholdApplied: environmentProfile.adaptiveThresholds.significantChangeThreshold ?? 0.1, // Default, but significance is true anyway
        details: { featureType1: features1.type, featureType2: features2.type },
      };
    }

    let similarityScore = 0.0; // Similarity: 0=different, 1=identical
    let methodUsed = this.config.defaultComparisonMetric;
    let details: Record<string, any> = { featureType: features1.type };

    switch (features1.type) {
      case 'embedding_vector':
        const vec1 = (features1 as ImageFeatureVector).vector;
        const vec2 = (features2 as ImageFeatureVector).vector; // Type assertion
        if (!vec1 || !vec2) throw new VisionError("Vector data missing in embedding_vector features.", VisionErrorCode.INPUT_VALIDATION_FAILED);
        // Assuming cosine similarity for embeddings, where higher is more similar.
        similarityScore = this.calculateCosineSimilarity(vec1, vec2);
        methodUsed = 'embedding_cosine_similarity';
        details.vectorDimensions = vec1.length;
        break;

      case 'categorical_features':
        const cat1 = features1 as ImageCategoricalFeatures;
        const cat2 = features2 as ImageCategoricalFeatures; // Type assertion
        // Compare tags using Jaccard Index
        const tags1 = new Set(cat1.tags?.map(t => t.label) || []);
        const tags2 = new Set(cat2.tags?.map(t => t.label) || []);
        similarityScore = this.calculateJaccardIndex(tags1, tags2);
        if (cat1.dominantObjectType && cat2.dominantObjectType && cat1.dominantObjectType === cat2.dominantObjectType) {
            similarityScore = (similarityScore + 1.0) / 2.0; // Boost if dominant object type matches
        }
        methodUsed = 'categorical_jaccard_tags';
        details.tags1Count = tags1.size;
        details.tags2Count = tags2.size;
        // TODO: If metric is 'custom_llm', make an LLM call to compare cat1.customAttributes or descriptions
        break;

      case 'digest_features':
        // Compare perceptual hashes if present, otherwise direct comparison
        const digestFeat1 = features1 as ImageDigestFeatures;
        const digestFeat2 = features2 as ImageDigestFeatures;
        if (digestFeat1.perceptualHash && digestFeat2.perceptualHash && digestFeat1.perceptualHashAlgorithm === digestFeat2.perceptualHashAlgorithm) {
            const pHashComparison = ImageUtils.compareDigests(
                `${digestFeat1.perceptualHashAlgorithm}:${digestFeat1.perceptualHash}`,
                `${digestFeat2.perceptualHashAlgorithm}:${digestFeat2.perceptualHash}`
            );
            if (pHashComparison.distance !== undefined && digestFeat1.perceptualHash.length > 0) {
                similarityScore = 1.0 - (pHashComparison.distance / digestFeat1.perceptualHash.length);
                methodUsed = `${digestFeat1.perceptualHashAlgorithm}_hamming_similarity`;
                details.hammingDistance = pHashComparison.distance;
            } else {
                similarityScore = (digestFeat1.perceptualHash === digestFeat2.perceptualHash) ? 1.0 : 0.0;
                methodUsed = 'digest_perceptual_exact_match';
            }
        } else if (digestFeat1.md5 && digestFeat2.md5) {
            similarityScore = (digestFeat1.md5 === digestFeat2.md5) ? 1.0 : 0.0;
            methodUsed = 'digest_md5_exact_match';
        } else {
            similarityScore = 0.0; // Cannot compare
            methodUsed = 'digest_incomparable';
        }
        break;

      case 'custom':
        // For custom types, comparison logic is highly specific.
        // Default to simple equality or assume not similar.
        similarityScore = JSON.stringify(features1.value) === JSON.stringify(features2.value) ? 1.0 : 0.0;
        methodUsed = 'custom_feature_equality_check';
        details.customModelId = features1.modelId;
        break;

      default:
        if (this.config.logActivity) {
            console.warn(`FeatureDifferenceEngine (ID: ${this.engineId}): Unknown or unhandled feature type encountered: ${(features1 as any).type}. Assuming maximal difference.`);
        }
        similarityScore = 0.0; // Treat as completely different
        methodUsed = 'unknown_feature_type';
    }

    // Difference score: 0 = identical, 1 = completely different
    const differenceScoreValue = 1.0 - similarityScore;

    // Significance: is differenceScoreValue > adaptiveThreshold?
    const thresholdApplied = environmentProfile.adaptiveThresholds.featureComparisonSensitivity // This profile threshold should be for *similarity* to be considered *same enough*
                           ?? environmentProfile.adaptiveThresholds.significantChangeThreshold // Fallback to general change threshold
                           ?? 0.85; // Default: if similarity is less than 0.85, it's a significant change

    const isSignificant = similarityScore < thresholdApplied;

    if (this.config.logActivity) {
      console.log(`FeatureDifferenceEngine (ID: ${this.engineId}): Compared features. Similarity: ${similarityScore.toFixed(4)}, Difference: ${differenceScoreValue.toFixed(4)}, Significant: ${isSignificant}, Threshold (for similarity): ${thresholdApplied.toFixed(4)}, Method: ${methodUsed}`);
    }

    return {
      score: differenceScoreValue, // Report difference score
      isSignificant,
      methodUsed,
      thresholdApplied: thresholdApplied, // This is the similarity threshold
      details: {
        ...details,
        similarityScore: similarityScore,
        currentFeatureType: features1.type,
        referenceFeatureType: features2.type,
      },
    };
  }

  /** @inheritdoc */
  public async isApplicable(
    frameInfo1: Readonly<CachedFrameInfo>,
    _frameInfo2?: Readonly<CachedFrameInfo>, // Reference frame features checked in calculateDifference
  ): Promise<boolean> {
    // This engine is applicable if the current frame has extractable/extracted features.
    return !!frameInfo1.extractedFeatures;
  }

  /** @inheritdoc */
  public async shutdown(): Promise<void> {
     if (this.config?.logActivity) {
      console.log(`FeatureDifferenceEngine (ID: ${this.engineId}) shutdown.`);
    }
    this._isInitialized = false;
  }
}