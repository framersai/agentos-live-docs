// File: backend/agentos/core/vision/calibration/IVisualEnvironmentCalibrator.ts
/**
 * @file IVisualEnvironmentCalibrator.ts
 * @module backend/agentos/core/vision/calibration/IVisualEnvironmentCalibrator
 * @version 1.0.0
 * @description Defines the interface for a Visual Environment Calibrator.
 * This component is responsible for analyzing sequences of visual frames (or their derived metrics)
 * to understand the characteristics of the current visual environment. It produces and maintains
 * a `VisualEnvironmentProfile` which can be used by other parts of the vision subsystem
 * (like difference engines) to adapt their behavior.
 */

import { VisionInputEnvelope } from '../types/VisionInput';
import { VisualCalibrationMetrics, VisualEnvironmentProfile } from '../types/VisualEnvironment';
import { AnyVisualEnvironmentCalibratorConfig } from './VisualEnvironmentCalibratorConfig';
import { VisionError } from '../errors/VisionError';

/**
 * @interface CalibrationUpdateListener
 * @description Callback function signature for profile updates.
 */
export type CalibrationUpdateListener = (newProfile: Readonly<VisualEnvironmentProfile>) => void;

/**
 * @interface IVisualEnvironmentCalibrator
 * @description Interface for components that analyze and characterize the visual environment.
 */
export interface IVisualEnvironmentCalibrator {
  /**
   * @property {string} calibratorId - Readonly unique identifier for this calibrator instance.
   */
  readonly calibratorId: string;

  /**
   * @property {boolean} isInitialized - Readonly flag indicating if the calibrator has been initialized.
   */
  readonly isInitialized: boolean;

  /**
   * @property {boolean} isCalibrating - Readonly flag indicating if an initial explicit calibration phase is active.
   */
  readonly isCalibrating?: boolean; // Optional, as not all calibrators might have an explicit "phase"

  /**
   * Initializes the visual environment calibrator with its specific configuration.
   * @async
   * @template TConfig - The specific configuration type for the calibrator.
   * @param {TConfig} config - Calibrator-specific configuration options.
   * @returns {Promise<void>} A promise that resolves upon successful initialization.
   * @throws {VisionError} If initialization fails (e.g., invalid config).
   */
  initialize<TConfig extends AnyVisualEnvironmentCalibratorConfig>(config: TConfig): Promise<void>;

  /**
   * Starts or triggers an initial calibration phase using a stream of visual input.
   * This is typically called when a new vision session begins or when explicit recalibration is needed.
   * The calibrator will analyze frames from the stream for a configured duration or number of frames.
   * Updates to the profile might be emitted during or upon completion of this phase.
   *
   * @async
   * @param {AsyncIterable<VisionInputEnvelope>} frameStream - An async iterable providing `VisionInputEnvelope` objects.
   * The calibrator will consume frames from this stream.
   * @param {string} [profileId] - Optional. An ID to assign to the generated profile. If not provided, one will be generated.
   * @returns {Promise<VisualEnvironmentProfile>} A promise that resolves to the initially generated
   * `VisualEnvironmentProfile` once the explicit calibration phase is deemed complete.
   * @throws {VisionError} If calibration cannot be started or fails critically.
   */
  performInitialCalibration(
    frameStream: AsyncIterable<VisionInputEnvelope>,
    profileId?: string,
  ): Promise<VisualEnvironmentProfile>;

  /**
   * Processes metrics derived from a single visual frame (or a batch of frames) for
   * continuous adaptation of the visual environment profile.
   * This method is called repeatedly by the `VisionProcessorService` or another component
   * feeding it frame-derived data.
   * The calibrator updates its internal state and may emit a new `VisualEnvironmentProfile`
   * if significant, persistent changes are detected or if a configured update interval is reached.
   *
   * @async
   * @param {Readonly<VisualCalibrationMetrics>} frameMetrics - Metrics derived from one or more recent frames.
   * These metrics are typically simpler than full `ProcessedVisionData` (e.g., brightness, motion score).
   * @param {string} [associatedProfileId] - Optional. The ID of the current profile being adapted.
   * If not provided, the calibrator adapts its internally managed default profile.
   * @returns {Promise<VisualEnvironmentProfile | undefined>} A promise that resolves to the updated
   * `VisualEnvironmentProfile` if an update occurred, otherwise `undefined`.
   * @throws {VisionError} If metric processing fails.
   */
  processFrameMetricsForAdaptation(
    frameMetrics: Readonly<VisualCalibrationMetrics>,
    associatedProfileId?: string,
  ): Promise<VisualEnvironmentProfile | undefined>;

  /**
   * Retrieves the current `VisualEnvironmentProfile`.
   * @async
   * @param {string} [profileId] - Optional. If managing multiple profiles, the ID of the profile to retrieve.
   * Defaults to the main or default profile.
   * @returns {Promise<VisualEnvironmentProfile | undefined>} A promise resolving to the current profile,
   * or `undefined` if no profile has been generated or an error occurs.
   */
  getCurrentProfile(profileId?: string): Promise<VisualEnvironmentProfile | undefined>;

  /**
   * Resets the calibrator's internal state and current profile(s), optionally to a
   * default or uncalibrated state. This might trigger a new calibration phase if
   * continuous adaptation is active.
   * @async
   * @param {string} [profileId] - Optional. If specified, resets only this profile. Otherwise, resets all/default.
   * @returns {Promise<void>}
   */
  resetCalibration(profileId?: string): Promise<void>;

  /**
   * Subscribes a listener function to receive updates when the `VisualEnvironmentProfile` changes.
   * @param {CalibrationUpdateListener} listener - The callback function to invoke with the new profile.
   * @returns {void}
   */
  onProfileUpdate(listener: CalibrationUpdateListener): void;

  /**
   * Unsubscribes a previously registered listener.
   * @param {CalibrationUpdateListener} listener - The listener function to remove.
   * @returns {void}
   */
  offProfileUpdate?(listener: CalibrationUpdateListener): void; // Optional for simpler event emitters

  /**
   * Optional. Gracefully shuts down the calibrator, stopping any background tasks
   * (like timers for profile re-evaluation) and releasing resources.
   * @async
   * @returns {Promise<void>}
   */
  shutdown?(): Promise<void>;
}