// File: backend/agentos/core/vision/types/VisualEnvironment.ts
/**
 * @file VisualEnvironment.ts
 * @module backend/agentos/core/vision/types/VisualEnvironment
 * @version 1.0.0
 * @description Defines structures related to understanding and characterizing the visual environment
 * in which the AgentOS system is operating. This includes metrics for calibration and the resulting
 * profile used to adapt vision processing, particularly differencing thresholds.
 */

/**
 * @enum VisualEnvironmentType
 * @description Categorizes the overall type of visual environment based on its observed characteristics
 * like complexity, motion levels, and clarity. This aids in adapting processing strategies.
 */
export enum VisualEnvironmentType {
  /** Very low motion, simple background, good clarity. High confidence in stillness. */
  STABLE_STATIC_CLEAR = 'stable_static_clear',
  /** Low motion, relatively simple scene, good clarity. */
  STABLE_LOW_ACTIVITY_CLEAR = 'stable_low_activity_clear',
  /** Moderate, predictable motion or visual detail (e.g., a person talking, slow panning). Good clarity. */
  MODERATE_PREDICTABLE_ACTIVITY = 'moderate_predictable_activity',
  /** High or erratic motion, significant visual detail, or cluttered scene. Clarity may vary. */
  DYNAMIC_COMPLEX_VARIABLE_CLARITY = 'dynamic_complex_variable_clarity',
  /** Consistently poor visibility due to low light, blur, or obstructions. */
  POOR_VISIBILITY_CONSISTENT = 'poor_visibility_consistent',
  /** Scene is primarily dominated by textual content (e.g., screen sharing a document or IDE). */
  TEXT_DOMINANT = 'text_dominant',
  /** Scene predominantly features human faces, often in a conversational setting. */
  FACES_DOMINANT_CONVERSATIONAL = 'faces_dominant_conversational',
  /** Initial state or insufficient data to reliably classify the environment. */
  UNKNOWN_UNCALIBRATED = 'unknown_uncalibrated',
  /** Environment characteristics are highly variable and change frequently. */
  HIGHLY_VARIABLE = 'highly_variable',
}

/**
 * @interface VisualCalibrationMetrics
 * @description Metrics collected during a visual calibration phase or from continuous analysis of frames.
 * These raw or aggregated metrics are used to build or update a `VisualEnvironmentProfile`.
 * Values are typically normalized (e.g., 0-1) where applicable.
 */
export interface VisualCalibrationMetrics {
  /**
   * @property {number} averageBrightness - Average brightness level (e.g., normalized 0-1).
   */
  averageBrightness: number;
  /**
   * @property {number} [averageContrast] - Optional. Average contrast level.
   */
  averageContrast?: number;
  /**
   * @property {number} motionLevelScore - Score representing inter-frame motion (0=none, 1=high).
   */
  motionLevelScore: number;
  /**
   * @property {number} [sceneComplexityScore] - Optional. Score for visual complexity (e.g., edge density, feature count).
   */
  sceneComplexityScore?: number;
  /**
   * @property {number} [clarityScore] - Optional. Score for image clarity/sharpness (0=blurry, 1=sharp).
   */
  clarityScore?: number;
  /**
   * @property {number} [textPresenceScore] - Optional. Score (0-1) indicating prevalence of detectable text.
   */
  textPresenceScore?: number;
  /**
   * @property {number} [facePresenceScore] - Optional. Score (0-1) indicating prevalence of detectable faces.
   */
  facePresenceScore?: number;
  /**
   * @property {number} [lightingStabilityScore] - Optional. Score (0-1, 1=stable) indicating stability of lighting conditions. Based on `stdDevBrightness`.
   */
  lightingStabilityScore?: number;
  /**
   * @property {number} [motionStabilityScore] - Optional. Score (0-1, 1=stable) indicating stability/predictability of motion. Based on `stdDevMotion`.
   */
  motionStabilityScore?: number;
  /**
   * @property {number} framesAnalyzed - Number of frames analyzed to compute these metrics.
   */
  framesAnalyzed: number;
  /**
   * @property {number} durationMsAnalyzed - Total duration in milliseconds over which frames were analyzed.
   */
  durationMsAnalyzed: number;
}

/**
 * @interface VisualEnvironmentProfile
 * @description Represents the characterized state of the visual environment. This profile is dynamically
 * updated and used by components like `VisionProcessorService` and `IDifferenceEngine`
 * to adapt their processing strategies, particularly change detection thresholds.
 * It forms the basis for "evolutionary" adaptation of the vision system.
 */
export interface VisualEnvironmentProfile {
  /**
   * @property {string} profileId - Unique identifier for this profile instance (e.g., associated with a session or stream).
   */
  readonly profileId: string;
  /**
   * @property {number} lastUpdatedAt - Unix epoch (ms) when this profile was last updated.
   */
  lastUpdatedAt: number;
  /**
   * @property {VisualEnvironmentType} currentEnvironmentType - The overall classified type of the visual environment.
   */
  currentEnvironmentType: VisualEnvironmentType;
  /**
   * @property {VisualCalibrationMetrics} MOCK_METRICS - The aggregated calibration metrics forming the basis of this profile.
   * In a real system, this would be named 'aggregatedMetrics' or similar.
   * Note: Renamed this from `sourceMetrics` to `currentMetrics` to reflect it represents the current state.
   */
  currentMetrics: VisualCalibrationMetrics;
  /**
   * @property {number} confidence - A score (0-1) indicating confidence in this profile, based on data quantity and stability.
   */
  confidence: number;

  /**
   * @interface AdaptiveThresholds
   * @description Thresholds suggested by this profile for vision processing tasks.
   * These values are adapted based on the `currentEnvironmentType` and `currentMetrics`.
   * "Evolutionary decay" could apply by gradually adjusting these towards a baseline
   * if the environment remains stable or if direct feedback isn't reinforcing current settings.
   */
  adaptiveThresholds: {
    /**
     * @property {number} significantChangeThreshold
     * @description Normalized threshold (0-1) for frame differencing. A higher value means
     * a larger change is needed to be considered "significant".
     * Example: In `STABLE_STATIC_CLEAR`, this might be low (e.g., 0.05).
     * In `DYNAMIC_COMPLEX_VARIABLE_CLARITY`, this might be high (e.g., 0.25).
     */
    significantChangeThreshold: number;

    /**
     * @property {number} [featureComparisonSensitivity]
     * @description For feature-based differencing, a sensitivity factor (e.g., 0.1 to 1.0).
     * Higher values mean more sensitive to feature changes.
     */
    featureComparisonSensitivity?: number;

    /**
     * @property {number} [objectDetectionMinConfidence]
     * @description Minimum confidence for an object detection to be considered significant.
     * Might be higher in cluttered scenes (e.g., from `DYNAMIC_COMPLEX_VARIABLE_CLARITY`).
     */
    objectDetectionMinConfidence?: number;

    /**
     * @property {number} [motionAnalysisFrameSkip]
     * @description Number of frames to skip for coarser motion analysis in highly dynamic environments
     * to save processing, or 0-1 for fine-grained analysis.
     * @default 0
     */
    motionAnalysisFrameSkip?: number;

    /**
     * @property {number} [calibrationUpdateFrequencyFactor]
     * @description Factor (e.g., 0.5 to 2.0) to adjust how frequently the
     * `VisualEnvironmentCalibrator` re-evaluates the environment.
     * Lower if environment is stable, higher if highly variable.
     * @default 1.0
     */
    calibrationUpdateFrequencyFactor?: number;

    /**
     * @property {Record<string, any>} [customEngineThresholds]
     * @description Thresholds specific to differencing engines or providers.
     * @example { "phashDistanceMax": 5, "featureVectorCosineMin": 0.85 }
     */
    customEngineThresholds?: Record<string, any>;
  };

  /**
   * @property {Array<{timestamp: number, type: VisualEnvironmentType, confidence: number}>} history
   * @description Optional. A brief history of recent environment type classifications,
   * allowing for detection of trends or oscillations. Limited in size.
   */
  history?: Array<{timestamp: number, type: VisualEnvironmentType, confidence: number}>;

  /**
   * @property {Record<string, any>} [customProfileData]
   * @description Extensible field for other derived insights or adaptive parameters.
   */
  customProfileData?: Record<string, any>;
}