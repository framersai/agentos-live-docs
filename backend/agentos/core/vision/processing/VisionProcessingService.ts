// File: backend/agentos/core/vision/processing/VisionProcessorService.ts
/**
 * @file VisionProcessorService.ts
 * @module backend/agentos/core/vision/processing/VisionProcessorService
 * @version 1.0.0
 * @description Implements the IVisionProcessorService interface. This service is the
 * central orchestrator for processing visual input streams. It manages frame caching,
 * uses differencing engines to detect significant changes, interacts with a visual
 * environment calibrator for adaptive thresholds, and calls vision providers for
 * detailed analysis when needed. It's designed to be efficient for real-time
 * applications like webcam processing.
 */

import {
  IVisionProcessorService,
  VisionProcessorServiceDependencies,
  VisionProcessingOutput,
  VisionProcessingEventType,
  NoSignificantChangeEvent,
  AnalysisStartedEvent,
  AnalysisCompletedEvent,
  CachedResultUsedEvent,
  ProcessingSkippedEvent,
  FrameProcessingErrorEvent,
  EnvironmentProfileUpdatedEvent,
} from './IVisionProcessorService';
import { VisionProcessorServiceConfig, ReferenceFrameUpdateStrategy } from './VisionProcessorServiceConfig';
import { VisionInputEnvelope, FrameMetadata, VisionInputData } from '../types/VisionInput';
import { ProcessedVisionData, VisionTask, ImageFeatureSet } from '../types/VisionOutput';
import { VisualEnvironmentProfile, VisualCalibrationMetrics, VisualEnvironmentType } from '../types/VisualEnvironment';
import { CachedFrameInfo } from '../types/CachedFrame';
import { ImageUtils } from '../utils/ImageUtils';
import { VisionError, VisionErrorCode } from '../errors/VisionError';
import { IDifferenceEngine, DifferenceScore } from '../differencing/IDifferenceEngine';
import { DifferenceEngineType } // AnyDifferenceEngineConfig
from '../differencing/DifferenceEngineConfig';
import { v4 as uuidv4 } from 'uuid';
import { IFrameCache } from '../cache/IFrameCache';
import { IVisualEnvironmentCalibrator, CalibrationUpdateListener } from '../calibration/IVisualEnvironmentCalibrator';
import { VisionProviderManager } from '../providers/VisionProviderManager';
import { GMIError } from '../../../../utils/errors'; // For broader error context

/**
 * @interface StreamProcessingState
 * @description Internal state maintained by VisionProcessorService for each active visual stream.
 */
interface StreamProcessingState {
  streamId: string;
  isWatching: boolean;
  lastProcessedFrameTimestamp: number;
  lastAnalysisTimestamp: number;
  lastSignificantFrameInfo?: CachedFrameInfo; // Info of the last frame that triggered a full analysis
  lastProcessedFrameDigest?: string; // Digest of the very last frame processed, significant or not
  currentVisualProfileId?: string; // ID of the profile actively used for this stream
  referenceFrameUpdateTimer?: NodeJS.Timeout; // For periodic reference frame updates
  // Add more state as needed, e.g., recent difference scores, GMI feedback context
}

/**
 * @class VisionProcessorService
 * @implements IVisionProcessorService
 * @description Orchestrates the vision processing pipeline.
 */
export class VisionProcessorService implements IVisionProcessorService {
  public readonly serviceId: string;
  private config!: VisionProcessorServiceConfig;
  private dependencies!: VisionProcessorServiceDependencies;
  private _isInitialized: boolean = false;

  // Internal state management for multiple streams
  private streamStates: Map<string, StreamProcessingState>;
  private lruStreamStateOrder: string[]; // For managing maxStreamStateHistory

  /**
   * Constructs a VisionProcessorService instance.
   * Dependencies are injected via the `initialize` method.
   * @param {string} [serviceId] - Optional ID for the service.
   */
  constructor(serviceId?: string) {
    this.serviceId = serviceId || `vision-processor-${uuidv4()}`;
    this.streamStates = new Map();
    this.lruStreamStateOrder = [];
  }

  /** @inheritdoc */
  public get isInitialized(): boolean {
    return this._isInitialized;
  }

  /** @inheritdoc */
  public async initialize(
    config: VisionProcessorServiceConfig,
    dependencies: VisionProcessorServiceDependencies,
  ): Promise<void> {
    if (this._isInitialized) {
      if (config.logActivity ?? this.config?.logActivity) {
        console.warn(`VisionProcessorService (ID: ${this.serviceId}): Already initialized. Re-initializing.`);
      }
      await this.shutdown(); // Gracefully handle re-initialization
    }

    this.config = {
      defaultIsWatchingState: false,
      referenceFrameUpdateStrategy: ReferenceFrameUpdateStrategy.ON_SIGNIFICANT_CHANGE,
      periodicReferenceFrameUpdateIntervalMs: 30000,
      minTimeBetweenFullAnalysesMs: 1000,
      defaultVisionTasksOnSignificantChange: [VisionTask.DESCRIBE_SCENE, VisionTask.DETECT_OBJECTS],
      enableVisualEnvironmentCalibration: true,
      maxStreamStateHistory: 100,
      logActivity: false,
      propagateProcessedDataToCalibrator: true,
      ...config,
    };
    this.dependencies = dependencies;

    // Validate dependencies
    if (!this.dependencies.frameCache ||
        !this.dependencies.differenceEngineProvider || // This should be a factory or a map
        !this.dependencies.visualEnvironmentCalibrator ||
        !this.dependencies.visionProviderManager) {
      throw new VisionError(
        'Missing critical dependencies for VisionProcessorService initialization.',
        VisionErrorCode.CONFIGURATION_ERROR,
        { serviceId: this.serviceId, missing: Object.keys(dependencies).filter(k => !(dependencies as any)[k]) }
      );
    }

    // Initialize dependencies if they have an initialize method and are not already initialized
    // This assumes dependencies might be shared and initialized externally, or need init here.
    // For robust design, dependencies should be guaranteed to be initialized before being passed.
    // We'll assume they are ready or self-initializing if they need it.

    if (this.config.enableVisualEnvironmentCalibration) {
        this.dependencies.visualEnvironmentCalibrator.onProfileUpdate(this.handleProfileUpdate.bind(this));
    }


    this._isInitialized = true;
    if (this.config.logActivity) {
      console.log(`VisionProcessorService (ID: ${this.serviceId}) initialized. Default watching: ${this.config.defaultIsWatchingState}`);
    }
  }

  private ensureInitialized(): void {
    if (!this._isInitialized) {
      throw new VisionError(
        `VisionProcessorService (ID: ${this.serviceId}) is not initialized.`,
        VisionErrorCode.CONFIGURATION_ERROR,
        { serviceId: this.serviceId }
      );
    }
  }

  private getStreamState(streamId: string): StreamProcessingState {
    let state = this.streamStates.get(streamId);
    if (!state) {
      if (this.streamStates.size >= this.config.maxStreamStateHistory) {
        const oldestStreamId = this.lruStreamStateOrder.shift();
        if (oldestStreamId) {
          const removedState = this.streamStates.get(oldestStreamId);
          if (removedState?.referenceFrameUpdateTimer) {
            clearTimeout(removedState.referenceFrameUpdateTimer);
          }
          this.streamStates.delete(oldestStreamId);
          if (this.config.logActivity) console.log(`VisionProcessorService (ID: ${this.serviceId}): Evicted state for stream ${oldestStreamId} due to history limit.`);
        }
      }
      state = {
        streamId,
        isWatching: this.config.defaultIsWatchingState,
        lastProcessedFrameTimestamp: 0,
        lastAnalysisTimestamp: 0,
      };
      this.streamStates.set(streamId, state);
      if (this.config.logActivity) console.log(`VisionProcessorService (ID: ${this.serviceId}): Initialized new state for stream ${streamId}. Watching: ${state.isWatching}`);
    }
    // Update LRU order
    const index = this.lruStreamStateOrder.indexOf(streamId);
    if (index > -1) {
      this.lruStreamStateOrder.splice(index, 1);
    }
    this.lruStreamStateOrder.push(streamId);
    return state;
  }

  /**
   * Handles updates to the VisualEnvironmentProfile from the calibrator.
   * @param newProfile - The updated profile.
   */
  private handleProfileUpdate(newProfile: Readonly<VisualEnvironmentProfile>): void {
    if (this.config.logActivity) {
      console.log(`VisionProcessorService (ID: ${this.serviceId}): Received VisualEnvironmentProfile update for profile ID '${newProfile.profileId}'. New type: ${newProfile.currentEnvironmentType}`);
    }
    // If managing profiles per stream, associate this newProfile with relevant stream states.
    // For now, assuming a global or default profile context from the calibrator if not specified.
    for (const state of this.streamStates.values()) {
        if (!state.currentVisualProfileId || state.currentVisualProfileId === newProfile.profileId) {
            // Conceptually, the service would now use this newProfile for future differencing for this stream.
            // This might involve yielding an EnvironmentProfileUpdatedEvent on the relevant stream's processing.
            // The `getCurrentVisualProfile` method would fetch this updated profile.
        }
    }
  }


  /** @inheritdoc */
  public async *processVisualInput(
    envelope: Readonly<VisionInputEnvelope>,
    requestedTasks?: VisionTask[]
  ): AsyncIterable<VisionProcessingOutput> {
    this.ensureInitialized();
    const streamId = envelope.metadata.streamId || envelope.correlationId || 'default_vision_stream';
    const frameId = envelope.metadata.frameId || `frame_${envelope.metadata.timestamp}`;
    const streamState = this.getStreamState(streamId);

    const eventBase = {
        timestamp: Date.now(),
        streamId,
        frameId,
        correlationId: envelope.correlationId,
    };

    if (!streamState.isWatching) {
      yield {
        ...eventBase,
        type: VisionProcessingEventType.PROCESSING_SKIPPED_NOT_WATCHING,
        reason: `Stream ${streamId} is not in 'watching' state.`,
      } as ProcessingSkippedEvent;
      return;
    }

    const now = Date.now();
    if ((now - streamState.lastAnalysisTimestamp) < this.config.minTimeBetweenFullAnalysesMs) {
        yield {
            ...eventBase,
            type: VisionProcessingEventType.PROCESSING_SKIPPED_RATE_LIMIT,
            reason: `Rate limited: Minimum time between analyses (${this.config.minTimeBetweenFullAnalysesMs}ms) not met. Last analysis: ${streamState.lastAnalysisTimestamp}`,
        } as ProcessingSkippedEvent;
        return;
    }


    let currentFrameDigest: string;
    let basicFrameMetrics: VisualCalibrationMetrics | undefined;

    try {
      currentFrameDigest = envelope.metadata.digest || ImageUtils.calculateSimpleDigest(envelope.frameData);
      // Generate basic metrics for calibration input
      // In a more complex system, this could be richer, or even from a quick provider call
      const imgUtilMetrics = await ImageUtils.extractBasicImageMetrics(envelope.frameData);
      basicFrameMetrics = {
        averageBrightness: imgUtilMetrics.averageBrightness ?? 0.5,
        motionLevelScore: 0, // Requires comparison, set later if differencer provides
        sceneComplexityScore: Math.random() * 0.2, // Placeholder
        clarityScore: Math.random() * 0.3 + 0.5, // Placeholder
        framesAnalyzed: 1,
        durationMsAnalyzed: 20, // Placeholder for metric derivation time
      };

      if (this.config.enableVisualEnvironmentCalibration) {
        const updatedProfile = await this.dependencies.visualEnvironmentCalibrator.processFrameMetricsForAdaptation(
          basicFrameMetrics,
          streamState.currentVisualProfileId
        );
        if (updatedProfile) {
            streamState.currentVisualProfileId = updatedProfile.profileId; // Ensure state tracks the profile ID
            yield {
                ...eventBase,
                type: VisionProcessingEventType.ENVIRONMENT_PROFILE_UPDATED,
                profile: updatedProfile,
            } as EnvironmentProfileUpdatedEvent;
        }
      }
    } catch (error: any) {
      const visionError = VisionError.fromError(error, VisionErrorCode.PROCESSING_FAILED, "Error during frame pre-processing or digest calculation");
      yield {
        ...eventBase,
        type: VisionProcessingEventType.FRAME_PROCESSING_ERROR,
        error: { message: visionError.message, code: visionError.code.toString(), details: visionError.details },
      } as FrameProcessingErrorEvent;
      return;
    }

    // 1. Cache Check for identical frame
    const cachedInfo = await this.dependencies.frameCache.get(currentFrameDigest);
    if (cachedInfo && cachedInfo.processedDataReference && typeof cachedInfo.processedDataReference !== 'string') {
        // Assuming ProcessedVisionData (or relevant parts) are stored directly
        // And check if cached data satisfies requestedTasks (if any)
        const dataRef = cachedInfo.processedDataReference as Partial<ProcessedVisionData>;
        const tasksInCache = dataRef.completedTasks || Object.keys(dataRef).filter(k => k !== 'inputId' && k !== 'processingTimestamp' && k !== 'visionProviderId' && k !== 'modelIdUsed'); // Approximation
        const allRequestedTasksCovered = !requestedTasks || requestedTasks.every(task => tasksInCache.includes(task as string));

      if (allRequestedTasksCovered) {
        yield {
          ...eventBase,
          type: VisionProcessingEventType.CACHED_RESULT_USED,
          frameDigest: currentFrameDigest,
          cachedData: dataRef as ProcessedVisionData, // Cast if confident, or ensure it's a full ProcessedVisionData
        } as CachedResultUsedEvent;
        streamState.lastProcessedFrameTimestamp = envelope.metadata.timestamp;
        streamState.lastProcessedFrameDigest = currentFrameDigest;
        // No full analysis, so don't update lastAnalysisTimestamp for rate limiting
        return;
      }
    }

    // 2. Differencing
    const currentProfile = await this.dependencies.visualEnvironmentCalibrator.getCurrentProfile(streamState.currentVisualProfileId);
    if (!currentProfile) {
        yield {
            ...eventBase,
            type: VisionProcessingEventType.FRAME_PROCESSING_ERROR,
            error: { message: "Visual environment profile not available for differencing.", code: VisionErrorCode.CALIBRATION_FAILED.toString() },
        } as FrameProcessingErrorEvent;
        return;
    }

    const currentFrameCachedInfoPartial: CachedFrameInfo = { // Build partial info for current frame for differencer
        frameDigest: currentFrameDigest,
        timestampAdded: envelope.metadata.timestamp, // Use frame timestamp
        originalFrameTimestamp: envelope.metadata.timestamp,
        resolution: envelope.metadata.resolution,
        sourceStreamId: streamId,
        // extractedFeatures would be needed if FeatureDifferenceEngine is used and not yet extracted
        // For now, assume digest is primary for this flow or features are extracted on demand by differencer
        processedDataReference: {}, // Empty, as not fully processed yet
        accessCount: 0,
        lastAccessedTimestamp: envelope.metadata.timestamp,
    };


    let isSignificantChange = true; // Assume significant if no reference or other issues
    let differenceScoreObj: DifferenceScore | undefined;

    if (streamState.lastSignificantFrameInfo) { // If there's a reference frame
      try {
        // Dynamically get differencer instance based on config
        const differencer = this.dependencies.differenceEngineProvider(
            this.config.defaultDifferenceEngineType,
            { engineType: this.config.defaultDifferenceEngineType } as AnyDifferenceEngineConfig // Provide minimal config
        );
        if (!differencer.isInitialized) await differencer.initialize({ engineType: this.config.defaultDifferenceEngineType } as AnyDifferenceEngineConfig);


        // For FeatureDifferenceEngine, features might need to be extracted here if not in CachedFrameInfo
        // This implies `currentFrameCachedInfoPartial` and `streamState.lastSignificantFrameInfo` need `extractedFeatures`
        // For simplicity, assuming DigestDifferenceEngine primarily or features are handled by specific logic paths.
        // A more advanced VPS would handle on-demand feature extraction if differencer needs it.
        if (this.config.defaultDifferenceEngineType === DifferenceEngineType.FEATURE_COMPARISON &&
            (!currentFrameCachedInfoPartial.extractedFeatures || !streamState.lastSignificantFrameInfo.extractedFeatures)) {
            // Placeholder: Extract features if needed for FeatureDifferenceEngine
            // This would involve calling a vision provider. This adds latency here.
            // Ideally, feature extraction is part of a multi-stage cache/processing.
            // For now, we'll assume features are present or DigestDifferenceEngine is used.
            if(this.config.logActivity) console.warn(`VisionProcessorService (ID: ${this.serviceId}): FeatureDifferenceEngine selected but features not readily available for comparison on frame ${frameId}. This path needs feature pre-extraction or on-demand extraction.`);
            // Fallback to considering it a significant change if features can't be compared
        }


        differenceScoreObj = await differencer.calculateDifference(
          currentFrameCachedInfoPartial,
          streamState.lastSignificantFrameInfo,
          currentProfile
        );
        isSignificantChange = differenceScoreObj.isSignificant;
      } catch (diffError: any) {
        const visionError = VisionError.fromError(diffError, VisionErrorCode.DIFFERENCING_ERROR, `Error during frame differencing for stream ${streamId}`);
        yield {
          ...eventBase,
          type: VisionProcessingEventType.FRAME_PROCESSING_ERROR,
          error: { message: visionError.message, code: visionError.code.toString(), details: visionError.details },
        } as FrameProcessingErrorEvent;
        // Decide if we should proceed with analysis despite diff error; likely not.
        return;
      }
    } else {
      // No reference frame, so this is the first significant frame (or after a reset)
      if (this.config.logActivity) console.log(`VisionProcessorService (ID: ${this.serviceId}): No reference frame for stream ${streamId}, current frame ${frameId} is considered significant.`);
    }

    streamState.lastProcessedFrameTimestamp = envelope.metadata.timestamp;
    streamState.lastProcessedFrameDigest = currentFrameDigest;

    if (!isSignificantChange) {
      yield {
        ...eventBase,
        type: VisionProcessingEventType.NO_SIGNIFICANT_CHANGE,
        frameDigest: currentFrameDigest,
        differenceScore: differenceScoreObj?.score,
      } as NoSignificantChangeEvent;
      // Update reference frame periodically if configured and not a significant change
      this.handlePeriodicReferenceFrameUpdate(streamState, currentFrameCachedInfoPartial, false);
      return;
    }

    // 3. Full Analysis
    const tasksToRun = requestedTasks || this.config.defaultVisionTasksOnSignificantChange;
    yield {
      ...eventBase,
      type: VisionProcessingEventType.ANALYSIS_STARTED,
      frameDigest: currentFrameDigest,
      tasks: tasksToRun,
    } as AnalysisStartedEvent;

    try {
      const provider = this.dependencies.visionProviderManager.selectProvider({taskHint: tasksToRun[0]}); // Simple selection for now
      if (!provider) {
        throw new VisionError("No suitable vision provider found for analysis.", VisionErrorCode.PROVIDER_UNAVAILABLE, {tasks: tasksToRun});
      }

      const processedData = await provider.analyzeImage(envelope.frameData, { tasks: tasksToRun });

      // Create/Update CachedFrameInfo with full results
      const newCachedInfo: CachedFrameInfo = {
        ...currentFrameCachedInfoPartial, // Includes digest, timestamps, resolution, sourceStreamId
        processedDataReference: processedData, // Store full data for this example
        extractedFeatures: processedData.imageFeatures || currentFrameCachedInfoPartial.extractedFeatures,
        timestampAdded: cachedInfo?.timestampAdded || Date.now(), // Preserve original add time if updating
        lastAccessedTimestamp: Date.now(),
        accessCount: (cachedInfo?.accessCount || 0) + 1,
        expiresAt: this.config.defaultFrameCacheTTLMs > 0 ? Date.now() + this.config.defaultFrameCacheTTLMs : undefined,
      };
      await this.dependencies.frameCache.set(newCachedInfo);

      streamState.lastAnalysisTimestamp = now;
      streamState.lastSignificantFrameInfo = newCachedInfo; // Update reference to this fully analyzed frame
      this.handlePeriodicReferenceFrameUpdate(streamState, newCachedInfo, true); // Reset periodic timer after significant change

      yield {
        ...eventBase,
        type: VisionProcessingEventType.ANALYSIS_COMPLETED,
        data: processedData,
      } as AnalysisCompletedEvent;

      // Optionally feed richer metrics from ProcessedVisionData to calibrator
      if (this.config.enableVisualEnvironmentCalibration && this.config.propagateProcessedDataToCalibrator) {
          const metricsFromAnalysis = this.deriveMetricsFromProcessedData(processedData, basicFrameMetrics);
          if (metricsFromAnalysis) {
            const updatedProfile = await this.dependencies.visualEnvironmentCalibrator.processFrameMetricsForAdaptation(
                metricsFromAnalysis,
                streamState.currentVisualProfileId
            );
            if (updatedProfile) {
                streamState.currentVisualProfileId = updatedProfile.profileId;
                 yield { // Yield another event for this specific update
                    ...eventBase,
                    type: VisionProcessingEventType.ENVIRONMENT_PROFILE_UPDATED,
                    profile: updatedProfile,
                } as EnvironmentProfileUpdatedEvent;
            }
          }
      }

    } catch (analysisError: any) {
      const visionError = VisionError.fromError(analysisError, VisionErrorCode.PROCESSING_FAILED, `Full image analysis failed for frame ${frameId} on stream ${streamId}`);
      yield {
        ...eventBase,
        type: VisionProcessingEventType.FRAME_PROCESSING_ERROR,
        error: { message: visionError.message, code: visionError.code.toString(), details: visionError.details },
      } as FrameProcessingErrorEvent;
    }
  }

  private handlePeriodicReferenceFrameUpdate(
    streamState: StreamProcessingState,
    newReferenceCandidate: CachedFrameInfo,
    isSignificantEvent: boolean
  ): void {
    if (streamState.referenceFrameUpdateTimer) {
      clearTimeout(streamState.referenceFrameUpdateTimer);
      streamState.referenceFrameUpdateTimer = undefined;
    }

    if (this.config.referenceFrameUpdateStrategy === ReferenceFrameUpdateStrategy.PERIODIC) {
      streamState.referenceFrameUpdateTimer = setTimeout(() => {
        if(this.config.logActivity) console.log(`VisionProcessorService (ID: ${this.serviceId}): Periodically updating reference frame for stream ${streamState.streamId} to digest ${newReferenceCandidate.frameDigest}.`);
        streamState.lastSignificantFrameInfo = newReferenceCandidate; // Update to the latest processed, even if not "significant"
        streamState.referenceFrameUpdateTimer = undefined;
      }, this.config.periodicReferenceFrameUpdateIntervalMs);
    } else if (this.config.referenceFrameUpdateStrategy === ReferenceFrameUpdateStrategy.EVERY_PROCESSED_FRAME) {
        streamState.lastSignificantFrameInfo = newReferenceCandidate;
    } else if (this.config.referenceFrameUpdateStrategy === ReferenceFrameUpdateStrategy.ON_SIGNIFICANT_CHANGE && isSignificantEvent) {
        // Already handled by main logic: streamState.lastSignificantFrameInfo = newCachedInfo;
    }
  }

  private deriveMetricsFromProcessedData(
      processedData: ProcessedVisionData,
      basicMetrics?: VisualCalibrationMetrics, // Fallback if processedData lacks something
  ): VisualCalibrationMetrics | undefined {
      // Example: Extract more nuanced metrics if available
      let complexityScore = basicMetrics?.sceneComplexityScore || 0.3;
      if (processedData.detectedObjects) {
          complexityScore = Math.min(1, (basicMetrics?.sceneComplexityScore || 0.2) + processedData.detectedObjects.length * 0.05);
      }
      // More sophisticated derivations can be added here
      return {
          averageBrightness: basicMetrics?.averageBrightness || 0.5,
          motionLevelScore: basicMetrics?.motionLevelScore || 0.1, // Motion is hard to get from single frame analysis
          sceneComplexityScore: complexityScore,
          clarityScore: basicMetrics?.clarityScore || (processedData.sceneUnderstanding?.imageQualityAssessment === 'clear' ? 0.8 : 0.4),
          textPresenceScore: processedData.ocrResult ? Math.min(1, (processedData.ocrResult.fullTextAnnotation?.length || 0) / 500) : 0,
          facePresenceScore: processedData.faceDetections ? Math.min(1, processedData.faceDetections.length / 3) : 0,
          lightingStabilityScore: basicMetrics?.lightingStabilityScore || 0.7,
          motionStabilityScore: basicMetrics?.motionStabilityScore || 0.7,
          framesAnalyzed: 1,
          durationMsAnalyzed: processedData.processingTimeMs || basicMetrics?.durationMsAnalyzed || 50,
      };
  }


  /** @inheritdoc */
  public async requestExplicitAnalysis(
    envelope: Readonly<VisionInputEnvelope>,
    tasksToPerform: VisionTask[],
    preferredModelId?: string,
  ): Promise<ProcessedVisionData> {
    this.ensureInitialized();
    const streamId = envelope.metadata.streamId || envelope.correlationId || 'default_vision_stream';
    const frameId = envelope.metadata.frameId || `frame_${envelope.metadata.timestamp}`;
    const streamState = this.getStreamState(streamId); // Get or create state
    const startTime = Date.now();

    if (this.config.logActivity) {
        console.log(`VisionProcessorService (ID: ${this.serviceId}): Explicit analysis requested for frame ${frameId}, stream ${streamId}. Tasks: ${tasksToPerform.join(', ')}`);
    }

    try {
      const provider = this.dependencies.visionProviderManager.selectProvider({ preferredModelId, taskHint: tasksToPerform[0] });
      if (!provider) {
        throw new VisionError("No suitable vision provider found for explicit analysis.", VisionErrorCode.PROVIDER_UNAVAILABLE, {tasks: tasksToPerform, preferredModelId});
      }

      const currentFrameDigest = envelope.metadata.digest || ImageUtils.calculateSimpleDigest(envelope.frameData);
      // Option: Check cache even for explicit requests, if tasks match. For now, assume explicit means re-analyze.
      // const cachedInfo = await this.dependencies.frameCache.get(currentFrameDigest);
      // if (cachedInfo && tasks match...) return cachedData;

      const processedData = await provider.analyzeImage(envelope.frameData, {
        tasks: tasksToPerform,
        modelId: preferredModelId, // Pass along preferred model
        includeRawResponse: true, // Good for explicit requests
      });

      const newCachedInfo: CachedFrameInfo = {
        frameDigest: currentFrameDigest,
        timestampAdded: Date.now(),
        originalFrameTimestamp: envelope.metadata.timestamp,
        resolution: envelope.metadata.resolution,
        sourceStreamId: streamId,
        processedDataReference: processedData,
        extractedFeatures: processedData.imageFeatures,
        accessCount: 1,
        lastAccessedTimestamp: Date.now(),
        expiresAt: this.config.defaultFrameCacheTTLMs > 0 ? Date.now() + this.config.defaultFrameCacheTTLMs : undefined,
      };
      await this.dependencies.frameCache.set(newCachedInfo);

      streamState.lastAnalysisTimestamp = startTime; // Update timestamp for rate limiting
      streamState.lastSignificantFrameInfo = newCachedInfo; // Consider this an important frame

      return processedData;

    } catch (error: any) {
      const visionError = VisionError.fromError(error, VisionErrorCode.PROCESSING_FAILED, `Explicit analysis failed for frame ${frameId}`);
      if (this.config.logActivity) console.error(visionError.message, visionError.details);
      throw visionError;
    }
  }

  /** @inheritdoc */
  public async setStreamWatchingState(streamId: string, isWatching: boolean, profileIdToAssociate?: string): Promise<void> {
    this.ensureInitialized();
    const state = this.getStreamState(streamId); // Ensures state exists or is created
    state.isWatching = isWatching;
    if (profileIdToAssociate) {
        state.currentVisualProfileId = profileIdToAssociate;
    }
    if (!isWatching && state.referenceFrameUpdateTimer) { // Clear periodic timer if stopping watching
        clearTimeout(state.referenceFrameUpdateTimer);
        state.referenceFrameUpdateTimer = undefined;
    }
    if (this.config.logActivity) {
      console.log(`VisionProcessorService (ID: ${this.serviceId}): Stream ${streamId} watching state set to ${isWatching}. Profile: ${state.currentVisualProfileId || 'default'}`);
    }
  }

  /** @inheritdoc */
  public async getStreamWatchingState(streamId: string): Promise<boolean> {
    this.ensureInitialized();
    // Does not create state if it doesn't exist, returns default or false.
    const state = this.streamStates.get(streamId);
    return state ? state.isWatching : this.config.defaultIsWatchingState;
  }

  /** @inheritdoc */
  public async getCurrentVisualProfile(streamId?: string): Promise<VisualEnvironmentProfile | undefined> {
    this.ensureInitialized();
    const targetStreamId = streamId || 'default_vision_stream'; // Or handle global default differently
    const state = this.streamStates.get(targetStreamId);
    return this.dependencies.visualEnvironmentCalibrator.getCurrentProfile(state?.currentVisualProfileId);
  }

  /** @inheritdoc */
  public async triggerProfileRecalibration(streamIdOrProfileId?: string): Promise<VisualEnvironmentProfile | undefined> {
    this.ensureInitialized();
    if (!this.config.enableVisualEnvironmentCalibration) {
        if (this.config.logActivity) console.log(`VisionProcessorService (ID: ${this.serviceId}): Visual environment calibration is disabled. Recalibration trigger ignored.`);
        return undefined;
    }
    // This basic calibrator manages one main profile or implicitly one per stream via its internal state.
    // A more complex system might have named profiles.
    // For BasicVisualEnvironmentCalibrator, just calling update from its buffer might be what's intended.
    // Or, if it supports an explicit "recalibrate_now_from_buffer" method.
    // For now, we'll update the profile linked to the stream or default.
    const profileId = streamIdOrProfileId ? (this.streamStates.get(streamIdOrProfileId)?.currentVisualProfileId || streamIdOrProfileId) : undefined;

    if (this.dependencies.visualEnvironmentCalibrator.isCalibrating) {
        if (this.config.logActivity) console.log(`VisionProcessorService (ID: ${this.serviceId}): Calibrator is already in an explicit calibration phase.`);
        // Optionally, return current profile or wait for ongoing calibration.
        return this.dependencies.visualEnvironmentCalibrator.getCurrentProfile(profileId);
    }
    
    // This assumes the calibrator can re-evaluate based on its current buffer or a new short analysis.
    // The current BasicVisualEnvironmentCalibrator updates profile via processFrameMetricsForAdaptation
    // or performInitialCalibration. An explicit "re-evaluate buffer now" might be a useful addition there.
    // For now, let's assume it means re-evaluating its current buffered/smoothed metrics.
    const currentProfile = await this.dependencies.visualEnvironmentCalibrator.getCurrentProfile(profileId);
    if (currentProfile) {
         // Re-process its own current metrics to force re-classification and threshold generation
        const updatedProfile = await this.dependencies.visualEnvironmentCalibrator.processFrameMetricsForAdaptation(currentProfile.currentMetrics, currentProfile.profileId);
        if (updatedProfile) {
            const state = streamIdOrProfileId ? this.streamStates.get(streamIdOrProfileId) : undefined;
            if (state) state.currentVisualProfileId = updatedProfile.profileId;
            return updatedProfile;
        }
        return currentProfile;
    }
    return undefined;
  }

  /** @inheritdoc */
  public async shutdown(): Promise<void> {
    if (!this._isInitialized) return;
    if (this.config?.logActivity) console.log(`VisionProcessorService (ID: ${this.serviceId}): Shutting down...`);

    this.streamStates.forEach(state => {
        if (state.referenceFrameUpdateTimer) {
            clearTimeout(state.referenceFrameUpdateTimer);
        }
    });
    this.streamStates.clear();
    this.lruStreamStateOrder = [];

    // Dependencies are managed externally, but if this service owned them, they'd be shut down here.
    // Example: await this.dependencies.frameCache.shutdown();
    // Example: await this.dependencies.visualEnvironmentCalibrator.shutdown();

    this._isInitialized = false;
    if (this.config?.logActivity) console.log(`VisionProcessorService (ID: ${this.serviceId}): Shutdown complete.`);
  }
}