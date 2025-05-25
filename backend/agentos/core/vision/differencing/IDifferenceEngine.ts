// File: backend/agentos/core/vision/differencing/IDifferenceEngine.ts
/**
 * @file IDifferenceEngine.ts
 * @module backend/agentos/core/vision/differencing/IDifferenceEngine
 * @version 1.0.0
 * @description Defines the interface for a visual difference engine.
 * Difference engines are responsible for comparing two visual frames (or their representations)
 * and determining the degree of change and whether that change is "significant" based on
 * current environmental context and thresholds.
 */

import { CachedFrameInfo } from '../types/CachedFrame';
import { VisualEnvironmentProfile } from '../types/VisualEnvironment';
import { AnyDifferenceEngineConfig } from './DifferenceEngineConfig';
import { VisionError } from '../errors/VisionError';

/**
 * @interface DifferenceScore
 * @description Represents the output of a difference calculation between two frames.
 */
export interface DifferenceScore {
  /**
   * @property {number} score
   * @description A numerical score representing the degree of difference.
   * The interpretation of this score (e.g., 0 = identical, 1 = completely different,
   * or a distance metric) depends on the specific engine implementation.
   * Higher values generally mean more different.
   */
  score: number;

  /**
   * @property {boolean} isSignificant
   * @description Indicates whether the calculated difference `score` exceeds the
   * significance threshold provided by the `VisualEnvironmentProfile` and internal engine logic.
   */
  isSignificant: boolean;

  /**
   * @property {string} methodUsed
   * @description The specific method or algorithm used by the engine to calculate the difference.
   * @example "phash_hamming_distance", "feature_vector_cosine_similarity", "ssim_index"
   */
  methodUsed: string;

  /**
   * @property {number} [thresholdApplied]
   * @description Optional. The actual threshold value against which the `score` was compared
   * to determine `isSignificant`. This value is typically derived from the `VisualEnvironmentProfile`.
   */
  thresholdApplied?: number;

  /**
   * @property {Record<string, any>} [details]
   * @description Optional. Additional details or metadata about the difference calculation,
   * such as specific regions of change, feature distances, or confidence levels.
   */
  details?: Record<string, any>;
}

/**
 * @interface IDifferenceEngine
 * @description Interface for a visual frame difference engine.
 * Implementations will provide specific algorithms for comparing frames or their features.
 */
export interface IDifferenceEngine {
  /**
   * @property {string} engineId - Readonly unique identifier for this engine instance.
   */
  readonly engineId: string;

  /**
   * @property {boolean} isInitialized - Readonly flag indicating if the engine has been initialized.
   */
  readonly isInitialized: boolean;

  /**
   * Initializes the difference engine with its specific configuration.
   * @async
   * @template TConfig - The specific configuration type for the engine, extending BaseDifferenceEngineConfig.
   * @param {TConfig} config - Engine-specific configuration options.
   * @returns {Promise<void>} A promise that resolves upon successful initialization.
   * @throws {VisionError} If initialization fails (e.g., invalid config).
   */
  initialize<TConfig extends AnyDifferenceEngineConfig>(config: TConfig): Promise<void>;

  /**
   * Calculates the difference between a current frame and a reference frame.
   * Both frames are provided as `CachedFrameInfo` which might contain raw digests,
   * extracted features, or links to more detailed data. The engine decides what aspects
   * of `CachedFrameInfo` to use based on its type and configuration.
   *
   * @async
   * @param {Readonly<CachedFrameInfo>} currentFrameInfo - Information about the current frame being assessed.
   * @param {Readonly<CachedFrameInfo>} referenceFrameInfo - Information about the reference frame (e.g., the last known significant frame).
   * @param {Readonly<VisualEnvironmentProfile>} environmentProfile - The current visual environment profile,
   * which provides adaptive thresholds (e.g., `profile.adaptiveThresholds.significantChangeThreshold`).
   * @returns {Promise<DifferenceScore>} A promise resolving to a `DifferenceScore` object,
   * indicating the degree of difference and its significance.
   * @throws {VisionError} If the comparison cannot be performed (e.g., incompatible frame info, missing features).
   */
  calculateDifference(
    currentFrameInfo: Readonly<CachedFrameInfo>,
    referenceFrameInfo: Readonly<CachedFrameInfo>,
    environmentProfile: Readonly<VisualEnvironmentProfile>,
  ): Promise<DifferenceScore>;

  /**
   * Optional method to check if this engine is suitable for comparing the given types of frame info
   * or feature sets.
   * @param {Readonly<CachedFrameInfo>} frameInfo1 - Information for the first frame.
   * @param {Readonly<CachedFrameInfo>} [frameInfo2] - Information for the second frame (if applicable for suitability check).
   * @returns {Promise<boolean>} True if the engine can process the given inputs.
   */
  isApplicable?(
    frameInfo1: Readonly<CachedFrameInfo>,
    frameInfo2?: Readonly<CachedFrameInfo>,
  ): Promise<boolean>;

  /**
   * Optional. Gracefully shuts down the engine, releasing any resources.
   * @async
   * @returns {Promise<void>}
   */
  shutdown?(): Promise<void>;
}