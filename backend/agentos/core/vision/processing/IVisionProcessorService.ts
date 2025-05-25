// File: backend/agentos/core/vision/processing/IVisionProcessorService.ts
/**
 * @file IVisionProcessorService.ts
 * @module backend/agentos/core/vision/processing/IVisionProcessorService
 * @version 1.0.0
 * @description Defines the interface for the VisionProcessorService.
 * This service is the central orchestrator for processing incoming visual data,
 * leveraging caching, differencing, calibration, and vision provider interactions
 * to deliver structured visual perceptions to the AgentOS system.
 */

import { VisionInputEnvelope, FrameMetadata } from '../types/VisionInput';
import { ProcessedVisionData, VisionTask } from '../types/VisionOutput';
import { VisualEnvironmentProfile, VisualCalibrationMetrics } from '../types/VisualEnvironment';
import { VisionProcessorServiceConfig } from './VisionProcessorServiceConfig';
import { VisionError } from '../errors/VisionError';

// Dependencies to be injected
import { IFrameCache } from '../cache/IFrameCache';
import { IDifferenceEngine } from '../differencing/IDifferenceEngine';
import { IVisualEnvironmentCalibrator } from '../calibration/IVisualEnvironmentCalibrator';
import { VisionProviderManager } from '../providers/VisionProviderManager';
import { AnyDifferenceEngineConfig, DifferenceEngineType } from '../differencing/DifferenceEngineConfig';

/**
 * @interface VisionProcessorServiceDependencies
 * @description Defines the dependencies required by the VisionProcessorService.
 * These are typically injected during construction or initialization.
 */
export interface VisionProcessorServiceDependencies {
  frameCache: IFrameCache;
  // Allows providing a map of pre-configured differencer instances, or a factory.
  // For simplicity, let's assume the manager can create them based on type from config.
  differenceEngineProvider: (type: DifferenceEngineType, config: AnyDifferenceEngineConfig) => IDifferenceEngine;
  visualEnvironmentCalibrator: IVisualEnvironmentCalibrator;
  visionProviderManager: VisionProviderManager;
}

/**
 * @enum VisionProcessingEventType
 * @description Types of events that can be yielded by the `processVisualInput` stream.
 */
export enum VisionProcessingEventType {
  /** Indicates the input was processed but no significant change was detected according to current thresholds. */
  NO_SIGNIFICANT_CHANGE = 'no_significant_change',
  /** Indicates a significant change was detected and full analysis is being initiated. */
  ANALYSIS_STARTED = 'analysis_started',
  /** Indicates full analysis is complete and `ProcessedVisionData` is available. */
  ANALYSIS_COMPLETED = 'analysis_completed',
  /** Indicates a cached result for the frame (or a sufficiently similar one) was used. */
  CACHED_RESULT_USED = 'cached_result_used',
  /** Indicates processing was skipped for this frame because the system is not in an "is watching" state for the stream. */
  PROCESSING_SKIPPED_NOT_WATCHING = 'processing_skipped_not_watching',
  /** Indicates processing was skipped due to rate limiting (e.g., `minTimeBetweenFullAnalysesMs`). */
  PROCESSING_SKIPPED_RATE_LIMIT = 'processing_skipped_rate_limit',
  /** Indicates an error occurred during processing this specific frame. */
  FRAME_PROCESSING_ERROR = 'frame_processing_error',
  /** Indicates an update to the visual environment profile relevant to the stream. */
  ENVIRONMENT_PROFILE_UPDATED = 'environment_profile_updated',
}

/**
 * @interface BaseVisionProcessingEvent
 * @description Base structure for events yielded by `processVisualInput`.
 */
export interface BaseVisionProcessingEvent {
  type: VisionProcessingEventType;
  timestamp: number;
  streamId?: string; // ID of the visual stream this event pertains to
  frameId?: string;  // ID of the frame that triggered this event
  correlationId?: string; // Correlation ID from the input envelope
}

/** @interface NoSignificantChangeEvent - Event specific data */
export interface NoSignificantChangeEvent extends BaseVisionProcessingEvent {
  type: VisionProcessingEventType.NO_SIGNIFICANT_CHANGE;
  frameDigest: string;
  differenceScore?: number;
}

/** @interface AnalysisStartedEvent - Event specific data */
export interface AnalysisStartedEvent extends BaseVisionProcessingEvent {
  type: VisionProcessingEventType.ANALYSIS_STARTED;
  frameDigest: string;
  tasks: VisionTask[];
}

/** @interface AnalysisCompletedEvent - Event specific data */
export interface AnalysisCompletedEvent extends BaseVisionProcessingEvent {
  type: VisionProcessingEventType.ANALYSIS_COMPLETED;
  data: ProcessedVisionData;
}

/** @interface CachedResultUsedEvent - Event specific data */
export interface CachedResultUsedEvent extends BaseVisionProcessingEvent {
  type: VisionProcessingEventType.CACHED_RESULT_USED;
  frameDigest: string;
  cachedData: ProcessedVisionData; // Or a summary, depending on cache content
}

/** @interface ProcessingSkippedEvent - Event specific data */
export interface ProcessingSkippedEvent extends BaseVisionProcessingEvent {
  type: VisionProcessingEventType.PROCESSING_SKIPPED_NOT_WATCHING | VisionProcessingEventType.PROCESSING_SKIPPED_RATE_LIMIT;
  reason: string;
}

/** @interface FrameProcessingErrorEvent - Event specific data */
export interface FrameProcessingErrorEvent extends BaseVisionProcessingEvent {
  type: VisionProcessingEventType.FRAME_PROCESSING_ERROR;
  error: { message: string; code?: string; details?: any };
}
/** @interface EnvironmentProfileUpdatedEvent - Event specific data */
export interface EnvironmentProfileUpdatedEvent extends BaseVisionProcessingEvent {
  type: VisionProcessingEventType.ENVIRONMENT_PROFILE_UPDATED;
  profile: VisualEnvironmentProfile;
}


/**
 * @union VisionProcessingOutput
 * @description Union type for the items yielded by `processVisualInput`.
 * It can be a specific event or the full `ProcessedVisionData` upon completion of analysis.
 */
export type VisionProcessingOutput =
  | NoSignificantChangeEvent
  | AnalysisStartedEvent
  | AnalysisCompletedEvent // This effectively replaces yielding ProcessedVisionData directly if we want all outputs to be events
  | CachedResultUsedEvent
  | ProcessingSkippedEvent
  | FrameProcessingErrorEvent
  | EnvironmentProfileUpdatedEvent;
  // | ProcessedVisionData; // Alternatively, can yield ProcessedVisionData directly

/**
 * @interface IVisionProcessorService
 * @description Defines the contract for the central vision processing service.
 */
export interface IVisionProcessorService {
  /**
   * @property {string} serviceId - Readonly unique identifier for this service instance.
   */
  readonly serviceId: string;

  /**
   * @property {boolean} isInitialized - Readonly flag indicating if the service has been initialized.
   */
  readonly isInitialized: boolean;

  /**
   * Initializes the VisionProcessorService with its configuration and dependencies.
   * @async
   * @param {VisionProcessorServiceConfig} config - Configuration for the service.
   * @param {VisionProcessorServiceDependencies} dependencies - Core dependencies like cache, differencer, etc.
   * @returns {Promise<void>}
   * @throws {VisionError} If initialization fails.
   */
  initialize(
    config: VisionProcessorServiceConfig,
    dependencies: VisionProcessorServiceDependencies,
  ): Promise<void>;

  /**
   * Processes an incoming visual input envelope (typically a single frame from a stream).
   * This is the main entry point for real-time vision processing.
   * The method is an asynchronous generator that yields `VisionProcessingOutput` events
   * indicating the status of processing (e.g., no significant change, analysis started)
   * and eventually the `ProcessedVisionData` if full analysis is performed.
   *
   * The `streamId` from the `envelope.metadata` is crucial for managing per-stream state
   * like "is watching", reference frames, and rate limits.
   *
   * @async
   * @generator
   * @param {Readonly<VisionInputEnvelope>} envelope - The visual input data and metadata.
   * @param {VisionTask[]} [requestedTasks] - Optional. Specific tasks to perform if this frame
   * is analyzed. Overrides `defaultVisionTasksOnSignificantChange` from config.
   * @yields {VisionProcessingOutput} Streams events and/or processed data.
   * @throws {VisionError} For critical, unrecoverable errors during the processing setup or stream.
   * Individual frame processing errors might be yielded as `FrameProcessingErrorEvent` within the stream.
   */
  processVisualInput(
    envelope: Readonly<VisionInputEnvelope>,
    requestedTasks?: VisionTask[]
  ): AsyncIterable<VisionProcessingOutput>;

  /**
   * Explicitly requests a full analysis of a given visual input, bypassing the
   * normal differencing and "is watching" logic. Useful for on-demand analysis.
   *
   * @async
   * @param {Readonly<VisionInputEnvelope>} envelope - The visual input to analyze.
   * @param {VisionTask[]} tasksToPerform - Array of specific vision tasks to execute.
   * @param {string} [preferredModelId] - Optional. Hint for a specific vision model to use.
   * @returns {Promise<ProcessedVisionData>} The full analysis result.
   * @throws {VisionError} If analysis fails or input is invalid.
   */
  requestExplicitAnalysis(
    envelope: Readonly<VisionInputEnvelope>,
    tasksToPerform: VisionTask[],
    preferredModelId?: string,
  ): Promise<ProcessedVisionData>;

  /**
   * Sets the "is watching" state for a specific visual stream.
   * When "watching", the service actively processes frames for significant changes.
   * When not "watching", it may perform minimal processing or ignore frames.
   *
   * @param {string} streamId - The identifier of the visual stream.
   * @param {boolean} isWatching - The desired state.
   * @param {string} [profileIdToAssociate] - Optional. If a specific VisualEnvironmentProfile ID should be associated
   * with this stream's "watching" session (e.g., if managing multiple profiles).
   * @returns {Promise<void>}
   * @throws {VisionError} If `streamId` is invalid or state cannot be set.
   */
  setStreamWatchingState(streamId: string, isWatching: boolean, profileIdToAssociate?: string): Promise<void>;

  /**
   * Retrieves the current "is watching" state for a specific stream.
   * @param {string} streamId - The identifier of the visual stream.
   * @returns {Promise<boolean>} True if the stream is currently being actively watched.
   */
  getStreamWatchingState(streamId: string): Promise<boolean>;

  /**
   * Retrieves the current `VisualEnvironmentProfile` being used for a specific stream,
   * or the default/global profile if no stream-specific one is active.
   * @async
   * @param {string} [streamId] - Optional. The ID of the stream to get the profile for.
   * @returns {Promise<VisualEnvironmentProfile | undefined>} The current profile.
   */
  getCurrentVisualProfile(streamId?: string): Promise<VisualEnvironmentProfile | undefined>;

  /**
   * Manually triggers the `IVisualEnvironmentCalibrator` to update the profile for a given stream
   * or the default profile, using currently buffered metrics.
   * @async
   * @param {string} [streamIdOrProfileId] - The ID of the stream/profile to re-calibrate.
   * @returns {Promise<VisualEnvironmentProfile | undefined>} The potentially updated profile.
   */
  triggerProfileRecalibration(streamIdOrProfileId?: string): Promise<VisualEnvironmentProfile | undefined>;

  /**
   * Gracefully shuts down the VisionProcessorService and its dependencies.
   * @async
   * @returns {Promise<void>}
   */
  shutdown(): Promise<void>;
}