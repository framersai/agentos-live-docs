// File: backend/agentos/core/vision/processing/VisionProcessorServiceConfig.ts
/**
 * @file VisionProcessorServiceConfig.ts
 * @module backend/agentos/core/vision/processing/VisionProcessorServiceConfig
 * @version 1.0.0
 * @description Defines the configuration structure for the VisionProcessorService.
 * This configuration governs how the service processes visual input, manages state,
 * interacts with dependencies (cache, differencer, calibrator, providers),
 * and adapts its behavior.
 */

import { VisionTask } from '../types/VisionOutput';
import { DifferenceEngineType } from '../differencing/DifferenceEngineConfig';

/**
 * @enum ReferenceFrameUpdateStrategy
 * @description Defines strategies for updating the reference frame used in differencing.
 */
export enum ReferenceFrameUpdateStrategy {
  /** Update the reference frame only when a significant change is detected and fully analyzed. */
  ON_SIGNIFICANT_CHANGE = 'on_significant_change',
  /** Update the reference frame periodically, regardless of significance, to avoid drift if minor changes accumulate. */
  PERIODIC = 'periodic',
  /** Update the reference frame with every processed frame, making comparisons always against the immediate predecessor. */
  EVERY_PROCESSED_FRAME = 'every_processed_frame',
}

/**
 * @interface VisionProcessorServiceConfig
 * @description Configuration for the VisionProcessorService.
 */
export interface VisionProcessorServiceConfig {
  /**
   * @property {string} serviceId
   * @description A unique identifier for this VisionProcessorService instance.
   */
  serviceId: string;

  /**
   * @property {boolean} [defaultIsWatchingState=false]
   * @description The default "is watching" state for new visual streams if not specified.
   * If `false`, frames are minimally processed unless explicit analysis is requested.
   * If `true`, active differencing and analysis occur.
   * @default false
   */
  defaultIsWatchingState?: boolean;

  /**
   * @property {DifferenceEngineType} defaultDifferenceEngineType
   * @description The type of `IDifferenceEngine` to use by default for new streams.
   * This allows selection between strategies like digest-based or feature-based comparison.
   * @example DifferenceEngineType.DIGEST_COMPARISON
   */
  defaultDifferenceEngineType: DifferenceEngineType;

  /**
   * @property {ReferenceFrameUpdateStrategy} [referenceFrameUpdateStrategy='on_significant_change']
   * @description Strategy for updating the reference frame used for differencing.
   * @default ReferenceFrameUpdateStrategy.ON_SIGNIFICANT_CHANGE
   */
  referenceFrameUpdateStrategy?: ReferenceFrameUpdateStrategy;

  /**
   * @property {number} [periodicReferenceFrameUpdateIntervalMs=30000]
   * @description If `referenceFrameUpdateStrategy` is 'periodic', this is the interval in milliseconds.
   * @default 30000 (30 seconds)
   */
  periodicReferenceFrameUpdateIntervalMs?: number;

  /**
   * @property {number} [minTimeBetweenFullAnalysesMs=1000]
   * @description Minimum time in milliseconds that must pass between two consecutive full analyses
   * of significantly changed frames for the same stream. Prevents overloading providers
   * during rapid sequences of significant changes.
   * @default 1000 (1 second)
   */
  minTimeBetweenFullAnalysesMs?: number;

  /**
   * @property {VisionTask[]} [defaultVisionTasksOnSignificantChange]
   * @description Default set of `VisionTask`s to perform when a significant visual change is detected
   * and a full analysis is triggered.
   * @default [VisionTask.DESCRIBE_SCENE, VisionTask.DETECT_OBJECTS]
   */
  defaultVisionTasksOnSignificantChange?: VisionTask[];

  /**
   * @property {boolean} [enableVisualEnvironmentCalibration=true]
   * @description Whether the service should actively use and update the `IVisualEnvironmentCalibrator`.
   * @default true
   */
  enableVisualEnvironmentCalibration?: boolean;

  /**
   * @property {number} [maxStreamStateHistory=100]
   * @description Maximum number of stream-specific states (like `lastSignificantFrameInfo`) to keep in memory.
   * Helps manage memory if many inactive streams are present. An LRU policy might be applied.
   * @default 100
   */
  maxStreamStateHistory?: number;

  /**
   * @property {boolean} [logActivity=false]
   * @description If true, the service logs its main processing steps and decisions.
   * @default false
   */
  logActivity?: boolean;

  /**
   * @property {boolean} [propagateProcessedDataToCalibrator=true]
   * @description If true, richer `ProcessedVisionData` (when available) is used to derive
   * metrics for the calibrator, potentially leading to more accurate profiles. If false,
   * only basic metrics from `ImageUtils` might be used.
   * @default true
   */
  propagateProcessedDataToCalibrator?: boolean;

  /**
   * @property {object} [adaptiveParameterEvolutionConfig]
   * @description Configuration placeholder for "evolutionary decay" and adaptation of service parameters
   * based on long-term observations or GMI feedback. (Future Enhancement)
   * @example { "thresholdDecayRate": 0.01, "feedbackInfluenceFactor": 0.2 }
   */
  adaptiveParameterEvolutionConfig?: {
    /** How quickly an adaptive threshold might decay towards a baseline if no reinforcing signals. */
    thresholdDecayRate?: number; // e.g., 0.01 means 1% decay towards baseline per cycle
    /** How much GMI feedback (positive/negative on perception utility) influences parameter adjustment. */
    feedbackInfluenceFactor?: number;
    /** Interval for re-evaluating these evolutionary parameters. */
    evolutionCheckIntervalMs?: number;
  };
}