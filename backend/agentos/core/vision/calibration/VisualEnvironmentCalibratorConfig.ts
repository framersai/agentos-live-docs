// File: backend/agentos/core/vision/calibration/VisualEnvironmentCalibratorConfig.ts
/**
 * @file VisualEnvironmentCalibratorConfig.ts
 * @module backend/agentos/core/vision/calibration/VisualEnvironmentCalibratorConfig
 * @version 1.0.0
 * @description Defines configuration structures for visual environment calibrators.
 * These configurations control how the calibrator analyzes visual input streams
 * to determine and adapt the VisualEnvironmentProfile.
 */

import { VisualEnvironmentType } from '../types/VisualEnvironment';

/**
 * @interface BaseVisualEnvironmentCalibratorConfig
 * @description Base configuration applicable to any visual environment calibrator implementation.
 */
export interface BaseVisualEnvironmentCalibratorConfig {
  /**
   * @property {string} calibratorId
   * @description A unique identifier for this specific calibrator instance.
   */
  calibratorId: string;

  /**
   * @property {boolean} [isEnabled=true]
   * @description Flag to enable or disable this calibrator instance.
   * @default true
   */
  isEnabled?: boolean;

  /**
   * @property {boolean} [logActivity=false]
   * @description If true, the calibrator should log its activities, profile updates, and environment changes.
   * @default false
   */
  logActivity?: boolean;

  /**
   * @property {number} [minFramesForInitialProfile=100]
   * @description Minimum number of frames (or metric sets derived from frames) required to generate
   * the first reliable `VisualEnvironmentProfile`.
   * @default 100
   */
  minFramesForInitialProfile?: number;

  /**
   * @property {number} [initialCalibrationDurationMs=5000]
   * @description Suggested duration in milliseconds for an initial explicit calibration phase
   * when a vision stream starts, if applicable. During this time, metrics are gathered intensively.
   * @default 5000 (5 seconds)
   */
  initialCalibrationDurationMs?: number;

  /**
   * @property {number} [profileUpdateIntervalMs=10000]
   * @description How often (in milliseconds) the calibrator should attempt to re-evaluate and potentially
   * update the `VisualEnvironmentProfile` based on continuously gathered metrics during active processing.
   * This can be subject to backoff strategies.
   * @default 10000 (10 seconds)
   */
  profileUpdateIntervalMs?: number;

  /**
   * @property {number} [metricsBufferSize=200]
   * @description Number of recent `VisualCalibrationMetrics` (or derived per-frame data points)
   * to keep in a rolling buffer for calculating the current profile.
   * @default 200
   */
  metricsBufferSize?: number;

  /**
   * @property {number} [profileConfidenceThresholdForUpdate=0.7]
   * @description Minimum confidence score the new profile calculation must achieve to replace
   * an existing profile (if the existing profile's confidence is higher).
   * Helps prevent profile thrashing due to transient noisy data.
   * @default 0.7
   */
  profileConfidenceThresholdForUpdate?: number;

  /**
   * @property {object} [environmentClassificationThresholds]
   * @description Thresholds used by the calibrator to classify the `VisualEnvironmentType`.
   * These are specific to the classification logic within the calibrator implementation.
   * Example: thresholds for brightness, motion, complexity scores.
   */
  environmentClassificationThresholds?: {
    quietStaticBrightnessMax?: number; // e.g., 0.3 for normalized brightness
    quietStaticMotionMax?: number;     // e.g., 0.05 for normalized motion score
    dynamicComplexMotionMin?: number;  // e.g., 0.4
    dynamicComplexComplexityMin?: number; // e.g., 0.6
    poorVisibilityClarityMax?: number; // e.g., 0.2 for normalized clarity score
    textDominantMinScore?: number;     // e.g., 0.7 for text presence score
    facesDominantMinScore?: number;    // e.g., 0.6 for face presence score
    [key: string]: number | undefined;
  };

  /**
   * @property {object} [adaptiveThresholdDefaults]
   * @description Default values for the `adaptiveThresholds` within a `VisualEnvironmentProfile`
   * if they cannot be dynamically determined or as a starting point.
   */
  adaptiveThresholdDefaults?: {
    significantChangeThreshold?: number; // e.g., 0.15
    featureComparisonSensitivity?: number; // e.g., 0.85 (similarity threshold)
    objectDetectionMinConfidence?: number; // e.g., 0.5
  };
}

/**
 * @interface BasicVisualEnvironmentCalibratorConfig
 * @description Configuration specific to the `BasicVisualEnvironmentCalibrator`.
 */
export interface BasicVisualEnvironmentCalibratorConfig extends BaseVisualEnvironmentCalibratorConfig {
  /**
   * @property {number} [smoothingFactorMetrics=0.1]
   * @description Smoothing factor (alpha for exponential moving average) applied to metrics like
   * brightness, motion, complexity when updating the profile. Lower values mean slower adaptation (more smoothing).
   * @default 0.1
   */
  smoothingFactorMetrics?: number;

  /**
   * @property {number} [historyRetentionForTrendAnalysis=10]
   * @description Number of past `VisualEnvironmentType` classifications to retain in the profile's
   * history for detecting trends or oscillations.
   * @default 10
   */
  historyRetentionForTrendAnalysis?: number;
}

/**
 * @union AnyVisualEnvironmentCalibratorConfig
 * @description A union type representing all possible specific calibrator configurations.
 */
export type AnyVisualEnvironmentCalibratorConfig =
  | BasicVisualEnvironmentCalibratorConfig;
  // Add other calibrator configs here as they are defined.