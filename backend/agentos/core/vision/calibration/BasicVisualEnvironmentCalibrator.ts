// File: backend/agentos/core/vision/calibration/BasicVisualEnvironmentCalibrator.ts
/**
 * @file BasicVisualEnvironmentCalibrator.ts
 * @module backend/agentos/core/vision/calibration/BasicVisualEnvironmentCalibrator
 * @version 1.0.0
 * @description A basic implementation of the IVisualEnvironmentCalibrator.
 * It analyzes a stream of `VisualCalibrationMetrics` (derived from frames)
 * to produce and adapt a `VisualEnvironmentProfile`. This implementation uses
 * exponential moving averages for smoothing metrics and a simple rule-based
 * classification for determining the environment type.
 */

import {
  IVisualEnvironmentCalibrator,
  CalibrationUpdateListener,
} from './IVisualEnvironmentCalibrator';
import {
  BasicVisualEnvironmentCalibratorConfig,
} from './VisualEnvironmentCalibratorConfig';
import {
  VisualCalibrationMetrics,
  VisualEnvironmentProfile,
  VisualEnvironmentType,
} from '../types/VisualEnvironment';
import { VisionInputEnvelope } from '../types/VisionInput'; // For initial calibration stream
import { ImageUtils } from '../utils/ImageUtils'; // For deriving metrics from raw frames if needed
import { VisionError, VisionErrorCode } from '../errors/VisionError';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events'; // For onProfileUpdate

/**
 * @class BasicVisualEnvironmentCalibrator
 * @implements IVisualEnvironmentCalibrator
 * @extends EventEmitter
 * @description Manages the characterization of the visual environment by processing
 * frame metrics and producing an adaptive VisualEnvironmentProfile.
 */
export class BasicVisualEnvironmentCalibrator extends EventEmitter implements IVisualEnvironmentCalibrator {
  public readonly calibratorId: string;
  private config!: Required<BasicVisualEnvironmentCalibratorConfig>;
  private _isInitialized: boolean = false;
  private _isCalibrating: boolean = false;

  private currentProfile?: VisualEnvironmentProfile;
  private metricsBuffer: VisualCalibrationMetrics[];
  private profileUpdateTimer?: NodeJS.Timeout;

  // Smoothed metrics using Exponential Moving Average (EMA)
  private smoothedMetrics?: VisualCalibrationMetrics;

  /**
   * Constructs a BasicVisualEnvironmentCalibrator.
   * @param {string} [calibratorId] - Optional ID for the calibrator.
   */
  constructor(calibratorId?: string) {
    super();
    this.calibratorId = calibratorId || `basic-visual-calibrator-${uuidv4()}`;
    this.metricsBuffer = [];
  }

  /** @inheritdoc */
  public get isInitialized(): boolean {
    return this._isInitialized;
  }

  /** @inheritdoc */
  public get isCalibrating(): boolean {
    return this._isCalibrating;
  }

  /** @inheritdoc */
  public async initialize(config: BasicVisualEnvironmentCalibratorConfig): Promise<void> {
    if (this._isInitialized) {
      if (config.logActivity ?? this.config?.logActivity) {
         console.warn(`BasicVisualEnvironmentCalibrator (ID: ${this.calibratorId}): Already initialized. Re-initializing.`);
      }
      await this.shutdown(); // Clean up existing state
    }

    this.config = {
      isEnabled: true,
      logActivity: false,
      minFramesForInitialProfile: 50, // Reduced for faster initial profile in mock/dev
      initialCalibrationDurationMs: 3000, // Reduced for faster initial profile
      profileUpdateIntervalMs: 5000,
      metricsBufferSize: 100, // Buffer size for EMA calculation
      profileConfidenceThresholdForUpdate: 0.6,
      environmentClassificationThresholds: { // Example thresholds
        quietStaticBrightnessMax: 0.4, quietStaticMotionMax: 0.05,
        dynamicComplexMotionMin: 0.3, dynamicComplexComplexityMin: 0.5,
        poorVisibilityClarityMax: 0.3,
        textDominantMinScore: 0.6, facesDominantMinScore: 0.5,
      },
      adaptiveThresholdDefaults: {
        significantChangeThreshold: 0.15, // Default sensitivity
        featureComparisonSensitivity: 0.80, // Similarity threshold
        objectDetectionMinConfidence: 0.4,
      },
      smoothingFactorMetrics: 0.1,
      historyRetentionForTrendAnalysis: 5,
      ...config,
      calibratorId: this.calibratorId,
    };

    this.resetInternalState();

    if (this.config.profileUpdateIntervalMs > 0) {
      this.profileUpdateTimer = setInterval(async () => {
        if (this.metricsBuffer.length >= this.config.minFramesForInitialProfile / 2) { // Less stringent for periodic updates
          await this.updateProfileFromBuffer(this.currentProfile?.profileId);
        }
      }, this.config.profileUpdateIntervalMs);
    }

    this._isInitialized = true;
    if (this.config.logActivity) {
      console.log(`BasicVisualEnvironmentCalibrator (ID: ${this.calibratorId}) initialized with config:`, this.config);
    }
  }

  private ensureInitialized(): void {
    if (!this._isInitialized) {
      throw new VisionError(
        `BasicVisualEnvironmentCalibrator (ID: ${this.calibratorId}) is not initialized.`,
        VisionErrorCode.CONFIGURATION_ERROR,
        { calibratorId: this.calibratorId }
      );
    }
  }

  private resetInternalState(profileId?: string): void {
    this.metricsBuffer = [];
    this.smoothedMetrics = undefined;
    this.currentProfile = this.createDefaultProfile(profileId || `profile-${uuidv4()}`);
    if (this.config?.logActivity) {
        console.log(`BasicVisualEnvironmentCalibrator (ID: ${this.calibratorId}): Internal state and profile '${this.currentProfile.profileId}' reset.`);
    }
    // Emit initial/reset profile
    this.emitProfileUpdate(this.currentProfile);
  }

  private createDefaultProfile(profileId: string): VisualEnvironmentProfile {
    const now = Date.now();
    const defaultMetrics: VisualCalibrationMetrics = {
      averageBrightness: 0.5, motionLevelScore: 0.1, sceneComplexityScore: 0.3,
      clarityScore: 0.7, textPresenceScore: 0.1, facePresenceScore: 0.1,
      lightingStabilityScore: 0.8, motionStabilityScore: 0.8,
      framesAnalyzed: 0, durationMsAnalyzed: 0,
    };
    return {
      profileId,
      lastUpdatedAt: now,
      currentEnvironmentType: VisualEnvironmentType.UNKNOWN_UNCALIBRATED,
      currentMetrics: defaultMetrics,
      confidence: 0.1, // Low confidence initially
      adaptiveThresholds: {
        significantChangeThreshold: this.config.adaptiveThresholdDefaults?.significantChangeThreshold ?? 0.2,
        featureComparisonSensitivity: this.config.adaptiveThresholdDefaults?.featureComparisonSensitivity ?? 0.80,
        objectDetectionMinConfidence: this.config.adaptiveThresholdDefaults?.objectDetectionMinConfidence ?? 0.5,
        motionAnalysisFrameSkip: 0,
        calibrationUpdateFrequencyFactor: 1.0,
      },
      history: [{ timestamp: now, type: VisualEnvironmentType.UNKNOWN_UNCALIBRATED, confidence: 0.1 }],
    };
  }

  /** @inheritdoc */
  public async performInitialCalibration(
    frameStream: AsyncIterable<VisionInputEnvelope>,
    profileId?: string,
  ): Promise<VisualEnvironmentProfile> {
    this.ensureInitialized();
    if (this._isCalibrating) {
      throw new VisionError("Initial calibration is already in progress.", VisionErrorCode.PROCESSING_FAILED, { calibratorId: this.calibratorId });
    }
    this._isCalibrating = true;
    this.resetInternalState(profileId); // Reset for a fresh calibration specific to this call
    if (this.config.logActivity) console.log(`BasicVisualEnvironmentCalibrator (ID: ${this.calibratorId}): Starting initial calibration for profile ${this.currentProfile!.profileId}.`);

    const calibrationStartTime = Date.now();
    let framesProcessed = 0;

    try {
      for await (const envelope of frameStream) {
        if (!this._isCalibrating) break; // Calibration might be cancelled externally

        // In a real scenario, VisionInputData would be processed to derive VisualCalibrationMetrics
        // For this basic version, we might simulate or use ImageUtils for very basic metrics
        const mockMetrics = await this.deriveMetricsFromEnvelope(envelope);
        this.addMetricsToBuffer(mockMetrics);

        framesProcessed++;
        const elapsedTime = Date.now() - calibrationStartTime;

        if (
            framesProcessed >= this.config.minFramesForInitialProfile ||
            elapsedTime >= this.config.initialCalibrationDurationMs
        ) {
            if (this.config.logActivity) console.log(`BasicVisualEnvironmentCalibrator (ID: ${this.calibratorId}): Initial calibration condition met (Frames: ${framesProcessed}, Time: ${elapsedTime}ms).`);
            break;
        }
      }
    } catch (error) {
        this._isCalibrating = false;
        throw VisionError.fromError(error, VisionErrorCode.CALIBRATION_FAILED, "Error during initial calibration frame stream processing.", this.calibratorId);
    }

    this._isCalibrating = false;
    if (this.metricsBuffer.length < this.config.minFramesForInitialProfile / 2 && this.config.logActivity) { // Relaxed check
        console.warn(`BasicVisualEnvironmentCalibrator (ID: ${this.calibratorId}): Initial calibration completed with only ${this.metricsBuffer.length} metric sets. Profile confidence may be low.`);
    }

    await this.updateProfileFromBuffer(this.currentProfile!.profileId);
    if (this.config.logActivity) console.log(`BasicVisualEnvironmentCalibrator (ID: ${this.calibratorId}): Initial calibration complete for profile ${this.currentProfile!.profileId}.`);
    return this.currentProfile!;
  }

  /**
   * Simulates or uses ImageUtils to derive basic metrics from a VisionInputEnvelope.
   * In a full system, this might involve calls to a lightweight IVisionProvider task.
   */
  private async deriveMetricsFromEnvelope(envelope: VisionInputEnvelope): Promise<VisualCalibrationMetrics> {
      // For now, use ImageUtils for very basic metrics, or generate mock data.
      // A real implementation might involve more sophisticated local analysis or even
      // quick analysis from a vision provider on downscaled images.
      const basicImgMetrics = await ImageUtils.extractBasicImageMetrics(envelope.frameData);
      return {
          averageBrightness: basicImgMetrics.averageBrightness ?? 0.5,
          motionLevelScore: Math.random() * 0.3, // Needs actual inter-frame comparison
          sceneComplexityScore: Math.random() * 0.5, // Needs feature analysis
          clarityScore: Math.random() * 0.4 + 0.6, // Needs blur detection
          textPresenceScore: Math.random() * 0.2, // Needs OCR hint
          facePresenceScore: Math.random() * 0.1, // Needs face detection hint
          lightingStabilityScore: 0.8, // Assumed stable for now
          motionStabilityScore: 0.7,   // Assumed somewhat stable
          framesAnalyzed: 1, // This metric is for a single frame's contribution
          durationMsAnalyzed: 50, // Approximate time to process/derive these metrics
      };
  }


  private addMetricsToBuffer(metrics: VisualCalibrationMetrics): void {
    this.metricsBuffer.push(metrics);
    if (this.metricsBuffer.length > this.config.metricsBufferSize) {
      this.metricsBuffer.shift(); // Maintain buffer size (FIFO)
    }

    // Update smoothed metrics with EMA
    if (!this.smoothedMetrics) {
      this.smoothedMetrics = { ...metrics, framesAnalyzed: 0, durationMsAnalyzed: 0 }; // Initialize with first full set
    } else {
      const alpha = this.config.smoothingFactorMetrics;
      const oneMinusAlpha = 1 - alpha;
      this.smoothedMetrics.averageBrightness = alpha * metrics.averageBrightness + oneMinusAlpha * this.smoothedMetrics.averageBrightness;
      this.smoothedMetrics.motionLevelScore = alpha * metrics.motionLevelScore + oneMinusAlpha * this.smoothedMetrics.motionLevelScore;
      // ... EMA for other relevant metrics ...
      this.smoothedMetrics.sceneComplexityScore = alpha * (metrics.sceneComplexityScore ?? 0.3) + oneMinusAlpha * (this.smoothedMetrics.sceneComplexityScore ?? 0.3);
      this.smoothedMetrics.clarityScore = alpha * (metrics.clarityScore ?? 0.7) + oneMinusAlpha * (this.smoothedMetrics.clarityScore ?? 0.7);
      this.smoothedMetrics.textPresenceScore = alpha * (metrics.textPresenceScore ?? 0.1) + oneMinusAlpha * (this.smoothedMetrics.textPresenceScore ?? 0.1);
      this.smoothedMetrics.facePresenceScore = alpha * (metrics.facePresenceScore ?? 0.1) + oneMinusAlpha * (this.smoothedMetrics.facePresenceScore ?? 0.1);
    }
     this.smoothedMetrics.framesAnalyzed = (this.smoothedMetrics.framesAnalyzed || 0) + metrics.framesAnalyzed;
     this.smoothedMetrics.durationMsAnalyzed = (this.smoothedMetrics.durationMsAnalyzed || 0) + metrics.durationMsAnalyzed;
  }

  private async updateProfileFromBuffer(profileIdToUpdate?: string): Promise<VisualEnvironmentProfile | undefined> {
    if (this.metricsBuffer.length === 0 || !this.smoothedMetrics) {
        if (this.config.logActivity) console.log(`BasicVisualEnvironmentCalibrator (ID: ${this.calibratorId}): Not enough data in buffer or no smoothed metrics to update profile.`);
        return undefined;
    }

    // Use smoothedMetrics as the basis for the new profile's metrics
    const aggregatedMetrics: VisualCalibrationMetrics = { ...this.smoothedMetrics };
    aggregatedMetrics.framesAnalyzed = this.metricsBuffer.length; // Reflect buffer size for confidence
    aggregatedMetrics.durationMsAnalyzed = this.metricsBuffer.reduce((sum, m) => sum + m.durationMsAnalyzed, 0);


    const newEnvType = this.classifySmoothedEnvironment(aggregatedMetrics);
    const newConfidence = this.calculateProfileConfidence(aggregatedMetrics);

    const profileToUpdate = this.currentProfile && this.currentProfile.profileId === profileIdToUpdate
        ? this.currentProfile
        : this.createDefaultProfile(profileIdToUpdate || `profile-${uuidv4()}`);


    // Check if update is warranted (significant change or higher confidence)
    const significantTypeChange = newEnvType !== profileToUpdate.currentEnvironmentType;
    const confidenceImproved = newConfidence > profileToUpdate.confidence + 0.05; // Requires noticeable improvement
    const meetsUpdateThreshold = newConfidence >= this.config.profileConfidenceThresholdForUpdate;

    if (significantTypeChange || (confidenceImproved && meetsUpdateThreshold) || profileToUpdate.currentEnvironmentType === VisualEnvironmentType.UNKNOWN_UNCALIBRATED) {
      profileToUpdate.lastUpdatedAt = Date.now();
      profileToUpdate.currentEnvironmentType = newEnvType;
      profileToUpdate.currentMetrics = aggregatedMetrics;
      profileToUpdate.confidence = newConfidence;
      profileToUpdate.adaptiveThresholds = this.determineAdaptiveThresholds(newEnvType, aggregatedMetrics);

      if (profileToUpdate.history && profileToUpdate.history.length >= this.config.historyRetentionForTrendAnalysis) {
        profileToUpdate.history.shift();
      }
      profileToUpdate.history?.push({ timestamp: Date.now(), type: newEnvType, confidence: newConfidence });

      this.currentProfile = profileToUpdate; // Update the main profile
      this.emitProfileUpdate(this.currentProfile);
      if (this.config.logActivity) {
        console.log(`BasicVisualEnvironmentCalibrator (ID: ${this.calibratorId}): Profile ${this.currentProfile.profileId} updated. New type: ${newEnvType}, Confidence: ${newConfidence.toFixed(2)}`);
      }
      return this.currentProfile;
    }
    return undefined; // No significant update
  }

  private classifySmoothedEnvironment(metrics: VisualCalibrationMetrics): VisualEnvironmentType {
    const thresholds = this.config.environmentClassificationThresholds;
    // Simplified classification logic based on smoothed metrics
    if ((metrics.clarityScore ?? 1.0) < (thresholds.poorVisibilityClarityMax ?? 0.3)) return VisualEnvironmentType.POOR_VISIBILITY_CONSISTENT;
    if ((metrics.textPresenceScore ?? 0) > (thresholds.textDominantMinScore ?? 0.7)) return VisualEnvironmentType.TEXT_DOMINANT;
    if ((metrics.facePresenceScore ?? 0) > (thresholds.facesDominantMinScore ?? 0.6)) return VisualEnvironmentType.FACES_DOMINANT_CONVERSATIONAL;

    if (metrics.motionLevelScore < (thresholds.quietStaticMotionMax ?? 0.05) && metrics.averageBrightness < (thresholds.quietStaticBrightnessMax ?? 0.4)) {
      return VisualEnvironmentType.STABLE_STATIC_CLEAR;
    }
    if (metrics.motionLevelScore < 0.15) return VisualEnvironmentType.STABLE_LOW_ACTIVITY_CLEAR; // Expanded range
    if (metrics.motionLevelScore < (thresholds.dynamicComplexMotionMin ?? 0.3)) return VisualEnvironmentType.MODERATE_PREDICTABLE_ACTIVITY;
    if (metrics.motionLevelScore >= (thresholds.dynamicComplexMotionMin ?? 0.3) || (metrics.sceneComplexityScore ?? 0) >= (thresholds.dynamicComplexComplexityMin ?? 0.5)) {
      return VisualEnvironmentType.DYNAMIC_COMPLEX_VARIABLE_CLARITY;
    }
    return VisualEnvironmentType.UNKNOWN_UNCALIBRATED; // Fallback
  }

  private calculateProfileConfidence(metrics: VisualCalibrationMetrics): number {
    // Confidence based on number of frames and stability (conceptual)
    const framesFactor = Math.min(1.0, metrics.framesAnalyzed / (this.config.minFramesForInitialProfile * 2)); // Max confidence from frames after 2x minFrames
    const stability = (metrics.lightingStabilityScore ?? 0.5 + metrics.motionStabilityScore ?? 0.5) / 2; // Example stability
    return Math.min(1.0, (framesFactor * 0.7 + stability * 0.3) + 0.1); // Base confidence + factors
  }

  private determineAdaptiveThresholds(
    envType: VisualEnvironmentType,
    metrics: VisualCalibrationMetrics
  ): VisualEnvironmentProfile['adaptiveThresholds'] {
    const defaults = this.config.adaptiveThresholdDefaults || {};
    let significantChange = defaults.significantChangeThreshold ?? 0.15; // Default: higher sensitivity

    switch (envType) {
      case VisualEnvironmentType.STABLE_STATIC_CLEAR:
      case VisualEnvironmentType.STABLE_LOW_ACTIVITY_CLEAR:
        significantChange = 0.05; // Very sensitive to changes
        break;
      case VisualEnvironmentType.MODERATE_PREDICTABLE_ACTIVITY:
        significantChange = 0.10;
        break;
      case VisualEnvironmentType.DYNAMIC_COMPLEX_VARIABLE_CLARITY:
      case VisualEnvironmentType.HIGHLY_VARIABLE:
        significantChange = 0.25; // Less sensitive
        break;
      case VisualEnvironmentType.POOR_VISIBILITY_CONSISTENT:
        significantChange = 0.20; // Might need to be less sensitive to noise
        break;
      case VisualEnvironmentType.TEXT_DOMINANT:
      case VisualEnvironmentType.FACES_DOMINANT_CONVERSATIONAL:
        significantChange = 0.08; // Sensitive to changes in relevant content
        break;
      case VisualEnvironmentType.UNKNOWN_UNCALIBRATED:
      default:
        significantChange = defaults.significantChangeThreshold ?? 0.20; // Moderate default for unknown
        break;
    }
    // "Evolutionary" aspect: Could slowly adjust `significantChange` based on long-term GMI feedback for this envType.
    // e.g., if GMI often misses things in "dynamic" scenes, this value might slowly decrease.
    // For now, it's rule-based.

    return {
      significantChangeThreshold: parseFloat(significantChange.toFixed(3)),
      featureComparisonSensitivity: defaults.featureComparisonSensitivity ?? 0.80, // Example: similarity must be >= this to be "same"
      objectDetectionMinConfidence: defaults.objectDetectionMinConfidence ?? 0.5,
      motionAnalysisFrameSkip: envType === VisualEnvironmentType.DYNAMIC_COMPLEX_VARIABLE_CLARITY ? 1 : 0,
      calibrationUpdateFrequencyFactor: envType === VisualEnvironmentType.HIGHLY_VARIABLE ? 0.5 : (envType === VisualEnvironmentType.STABLE_STATIC_CLEAR ? 1.5 : 1.0),
      customEngineThresholds: {},
    };
  }

  /** @inheritdoc */
  public async processFrameMetricsForAdaptation(
    frameMetrics: Readonly<VisualCalibrationMetrics>,
    associatedProfileId?: string,
  ): Promise<VisualEnvironmentProfile | undefined> {
    this.ensureInitialized();
    if (!this.config.isEnabled) return undefined;

    this.addMetricsToBuffer(frameMetrics);

    // Profile update is typically managed by the interval timer or after sufficient new data.
    // However, if a very significant, immediate shift in metrics is detected, we could trigger an update sooner.
    // For now, rely on the timer or initial calibration completion logic.
    // A forced update attempt if buffer has enough new data:
    if (this.metricsBuffer.length >= this.config.metricsBufferSize / 2) { // Heuristic: enough new data to reconsider
       return this.updateProfileFromBuffer(associatedProfileId || this.currentProfile?.profileId);
    }
    return this.currentProfile ? {...this.currentProfile} : undefined; // Return current if no update
  }

  /** @inheritdoc */
  public async getCurrentProfile(profileId?: string): Promise<VisualEnvironmentProfile | undefined> {
    this.ensureInitialized();
    if (!this.currentProfile || (profileId && this.currentProfile.profileId !== profileId)) {
        // Potentially load/manage multiple profiles if system evolves that way.
        // For now, this basic calibrator manages one primary profile.
        if (this.config.logActivity) console.warn(`BasicVisualEnvironmentCalibrator (ID: ${this.calibratorId}): Requested profile ${profileId} not found or doesn't match current. Returning current default.`);
    }
    return this.currentProfile ? JSON.parse(JSON.stringify(this.currentProfile)) : undefined; // Return a deep copy
  }

  /** @inheritdoc */
  public async resetCalibration(profileId?: string): Promise<void> {
    this.ensureInitialized();
    this.resetInternalState(profileId);
  }

  /** @inheritdoc */
  public onProfileUpdate(listener: CalibrationUpdateListener): void {
    this.on('profileUpdated', listener);
  }

  /** @inheritdoc */
  public offProfileUpdate(listener: CalibrationUpdateListener): void {
    this.off('profileUpdated', listener);
  }

  private emitProfileUpdate(profile: Readonly<VisualEnvironmentProfile>): void {
    this.emit('profileUpdated', JSON.parse(JSON.stringify(profile))); // Emit deep copy
  }

  /** @inheritdoc */
  public async shutdown(): Promise<void> {
    if (this.profileUpdateTimer) {
      clearInterval(this.profileUpdateTimer);
      this.profileUpdateTimer = undefined;
    }
    this.metricsBuffer = [];
    this.smoothedMetrics = undefined;
    // this.currentProfile = undefined; // Keep last profile or reset? Resetting makes more sense for shutdown.
    this.resetInternalState();
    this._isInitialized = false;
    if (this.config?.logActivity) {
      console.log(`BasicVisualEnvironmentCalibrator (ID: ${this.calibratorId}) shutdown.`);
    }
  }
}