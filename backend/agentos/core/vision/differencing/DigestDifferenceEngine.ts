// File: backend/agentos/core/vision/differencing/engines/DigestDifferenceEngine.ts
/**
 * @file DigestDifferenceEngine.ts
 * @module backend/agentos/core/vision/differencing/engines/DigestDifferenceEngine
 * @version 1.0.0
 * @description Implements a difference engine that compares frames based on their
 * pre-calculated digests (hashes), such as MD5, SHA256, or perceptual hashes (pHash, aHash).
 * This engine is generally fast and suitable for detecting exact duplicates or near-duplicates
 * when using perceptual hashes.
 */

import { IDifferenceEngine, DifferenceScore } from '../IDifferenceEngine';
import { DigestDifferenceEngineConfig, DifferenceEngineType } from '../DifferenceEngineConfig';
import { CachedFrameInfo } from '../../types/CachedFrame';
import { VisualEnvironmentProfile } from '../../types/VisualEnvironment';
import { VisionError, VisionErrorCode } from '../../errors/VisionError';
import { ImageUtils } from '../../utils/ImageUtils'; // For ImageUtils.compareDigests
import { v4 as uuidv4 } from 'uuid';

/**
 * @class DigestDifferenceEngine
 * @implements IDifferenceEngine
 * @description Compares frames using their digests.
 */
export class DigestDifferenceEngine implements IDifferenceEngine {
  public readonly engineId: string;
  private config!: Required<DigestDifferenceEngineConfig>;
  private _isInitialized: boolean = false;

  /**
   * Constructs a DigestDifferenceEngine instance.
   * @param {string} [engineId] - Optional unique ID for this engine instance.
   */
  constructor(engineId?: string) {
    this.engineId = engineId || `digest-diff-engine-${uuidv4()}`;
  }

  /** @inheritdoc */
  public get isInitialized(): boolean {
    return this._isInitialized;
  }

  /** @inheritdoc */
  public async initialize(config: DigestDifferenceEngineConfig): Promise<void> {
    if (config.engineType !== DifferenceEngineType.DIGEST_COMPARISON) {
      throw new VisionError(
        `Configuration engineType '${config.engineType}' does not match DigestDifferenceEngine.`,
        VisionErrorCode.CONFIGURATION_ERROR,
        { expected: DifferenceEngineType.DIGEST_COMPARISON, actual: config.engineType, engineId: this.engineId }
      );
    }
    this.config = {
      comparisonMode: 'exact',
      defaultDigestTypePrefix: 'phash', // Used if comparisonMode is 'hamming'
      isEnabled: true,
      logActivity: false,
      ...config, // User-provided config overrides defaults
      engineId: this.engineId, // Ensure constructor's engineId is used
    };
    this._isInitialized = true;
    if (this.config.logActivity) {
      console.log(`DigestDifferenceEngine (ID: ${this.engineId}) initialized. Mode: ${this.config.comparisonMode}.`);
    }
  }

  private ensureInitialized(): void {
    if (!this._isInitialized) {
      throw new VisionError(
        `DigestDifferenceEngine (ID: ${this.engineId}) is not initialized.`,
        VisionErrorCode.CONFIGURATION_ERROR, // Or a dedicated NOT_INITIALIZED error
        { engineId: this.engineId }
      );
    }
  }

  /** @inheritdoc */
  public async calculateDifference(
    currentFrameInfo: Readonly<CachedFrameInfo>,
    referenceFrameInfo: Readonly<CachedFrameInfo>,
    environmentProfile: Readonly<VisualEnvironmentProfile>,
  ): Promise<DifferenceScore> {
    this.ensureInitialized();

    if (!currentFrameInfo.frameDigest || !referenceFrameInfo.frameDigest) {
      throw new VisionError(
        'Frame digest is missing from one or both CachedFrameInfo objects.',
        VisionErrorCode.INPUT_VALIDATION_FAILED,
        { currentDigest: currentFrameInfo.frameDigest, refDigest: referenceFrameInfo.frameDigest, engineId: this.engineId }
      );
    }

    const comparisonResult = ImageUtils.compareDigests(currentFrameInfo.frameDigest, referenceFrameInfo.frameDigest);
    let score: number;
    let isSignificant: boolean;
    let thresholdApplied: number | undefined;

    const adaptiveThreshold = environmentProfile.adaptiveThresholds.significantChangeThreshold ?? 0.01; // Default to very sensitive if not in profile

    if (this.config.comparisonMode === 'exact') {
      score = comparisonResult.areSame ? 0.0 : 1.0; // 0 for same, 1 for different
      isSignificant = !comparisonResult.areSame; // Any difference is significant
      thresholdApplied = 0.5; // Conceptually, anything > 0 means different
    } else if (this.config.comparisonMode === 'hamming' && comparisonResult.method?.startsWith(this.config.defaultDigestTypePrefix)) {
      if (comparisonResult.distance === undefined) {
        // This case implies digests were not comparable by Hamming (e.g., different lengths, wrong prefix)
        // Treat as maximally different if they weren't an exact match either.
        score = 1.0;
        isSignificant = currentFrameInfo.frameDigest !== referenceFrameInfo.frameDigest;
         if (this.config.logActivity) {
            console.warn(`DigestDifferenceEngine (ID: ${this.engineId}): Hamming distance not applicable or computable for digests "${currentFrameInfo.frameDigest}" and "${referenceFrameInfo.frameDigest}". Defaulting to exact comparison logic.`);
        }
      } else {
        // Normalize Hamming distance to a 0-1 score (0=identical, 1=max_diff)
        // Assuming perceptual hashes are hex strings. Max distance is length of hash.
        const maxLength = Math.max(currentFrameInfo.frameDigest.split(':')[1]?.length || 0, referenceFrameInfo.frameDigest.split(':')[1]?.length || 1);
        score = maxLength > 0 ? comparisonResult.distance / maxLength : 1.0; // if length is 0, consider different

        // Significance for Hamming: is normalized distance > adaptiveThreshold?
        // Note: adaptiveThreshold in profile usually means "threshold for difference to be significant".
        // So, if score (normalized distance) > adaptiveThreshold, it's significant.
        thresholdApplied = environmentProfile.adaptiveThresholds.customEngineThresholds?.phashDistanceNormalizedThreshold ?? adaptiveThreshold;
        isSignificant = score > thresholdApplied;
      }
    } else {
      // Fallback for unknown comparisonMode or non-matching digest types in hamming mode
      score = comparisonResult.areSame ? 0.0 : 1.0;
      isSignificant = !comparisonResult.areSame;
      if (this.config.logActivity && this.config.comparisonMode === 'hamming') {
        console.warn(`DigestDifferenceEngine (ID: ${this.engineId}): Digest types do not match configured prefix '${this.config.defaultDigestTypePrefix}' for Hamming comparison. Defaulting to exact match logic.`);
      }
    }
    if (this.config.logActivity) {
      console.log(`DigestDifferenceEngine (ID: ${this.engineId}): Compared ${currentFrameInfo.frameDigest} vs ${referenceFrameInfo.frameDigest}. Score: ${score.toFixed(4)}, Significant: ${isSignificant}, Threshold: ${thresholdApplied?.toFixed(4)} Method: ${comparisonResult.method || this.config.comparisonMode}`);
    }


    return {
      score,
      isSignificant,
      methodUsed: comparisonResult.method || this.config.comparisonMode,
      thresholdApplied,
      details: {
        currentDigest: currentFrameInfo.frameDigest,
        referenceDigest: referenceFrameInfo.frameDigest,
        ...(comparisonResult.distance !== undefined && { hammingDistance: comparisonResult.distance }),
      },
    };
  }

  /** @inheritdoc */
  public async isApplicable(
    frameInfo1: Readonly<CachedFrameInfo>,
    _frameInfo2?: Readonly<CachedFrameInfo>,
  ): Promise<boolean> {
    // This engine is applicable if the first frame (current frame) has a digest.
    // The reference frame digest will be checked in calculateDifference.
    return !!frameInfo1.frameDigest;
  }

  /** @inheritdoc */
  public async shutdown(): Promise<void> {
    if (this.config?.logActivity) {
      console.log(`DigestDifferenceEngine (ID: ${this.engineId}) shutdown.`);
    }
    this._isInitialized = false;
    // No specific resources to release for this in-memory engine
  }
}