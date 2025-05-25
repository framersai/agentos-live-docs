# AgentOS Vision Subsystem

**Version:** 1.0.0  
**Status:** Core Architecture Defined, Initial Implementations In Progress  
**Last Updated:** May 24, 2025

## 1. Overview

The AgentOS Vision Subsystem endows GMIs (Generalized Mind Instances) and other AI agents with the ability to "see" and interpret visual information. It provides a comprehensive backend pipeline for:

* **Receiving Visual Input**: Accepts `VisionInputEnvelope` objects, typically containing frames from webcams or uploaded images, via dedicated API endpoints.
* **Efficient Frame Processing**: Minimizes redundant analysis by detecting significant changes between frames using configurable differencing engines and caching mechanisms.
* **Visual Environment Adaptation**: Dynamically characterizes the visual scene (`VisualEnvironmentProfile`) to adjust processing sensitivity and thresholds, enabling robust perception across diverse conditions.
* **Agnostic Vision Analysis**: Abstracts specific vision AI models (e.g., OpenAI Vision, Google Cloud Vision) through a common `IVisionProvider` interface, managed by a `VisionProviderManager`.
* **Structured Perception Output**: Delivers rich, structured `ProcessedVisionData` (object detection, scene description, OCR, etc.) for agent consumption and decision-making.

This subsystem aims to provide a SOTA perception layer, allowing for sophisticated multimodal interactions.

## 2. Core Architectural Tenets

* **Interface-Driven Design**: All core components (Providers, Processors, Calibrators, Caches, Differencers) are defined by clear TypeScript interfaces, promoting loose coupling and testability.
* **Modularity & Extensibility**: Components are designed to be replaceable and extensible. New vision providers, differencing algorithms, or caching strategies can be integrated with minimal disruption.
* **Efficiency & Optimization**: Strong emphasis on minimizing redundant computation and data transfer, especially for streaming visual input. This is achieved through:
    * **Frame Digesting**: `ImageUtils` for quick identification of identical frames.
    * **Intelligent Differencing**: `IDifferenceEngine` strategies (digest-based, feature-based) to detect meaningful changes.
    * **Adaptive Thresholds**: Change detection sensitivity adjusts based on the `VisualEnvironmentProfile`.
    * **Caching**: `IFrameCache` stores `CachedFrameInfo` (digests, features, analysis results/summaries) with LRU/TTL eviction ("decay").
* **Adaptability & "Evolutionary" Behavior**:
    * The `IVisualEnvironmentCalibrator` produces a `VisualEnvironmentProfile` that adapts to observed scene characteristics (brightness, motion, complexity).
    * This profile, in turn, influences processing parameters (e.g., differencing thresholds).
    * "Evolutionary decay" concepts are embedded: cache TTLs ensure stale data expires, and adaptive thresholds can "decay" towards baselines or evolve based on prolonged environmental stability or GMI feedback (future enhancement).
* **Configuration**: Comprehensive, environment-driven configuration for all key components, allowing fine-tuning of performance, cost, and accuracy. **Vision capabilities are entirely optional** and can be disabled globally.
* **Robust Error Handling**: Specific `VisionError` types ensure clear error propagation and diagnosis.

## 3. Key Components & Data Flow

The backend vision processing pipeline is orchestrated primarily by the `VisionProcessorService`.

```mermaid
graph TD
    A[Frontend: Visual Input Source (e.g., Webcam via MediaStream API)] --> B(Client-Side Adapter);
    B -- VisionInputEnvelope (via API POST /api/v1/vision/process-frame) --> C{VisionProcessorService [Backend]};

    subgraph AgentOS Backend: Core Vision Processing
        C --> D(1. Frame Pre-processor & Digester);
        D -- Frame Digest & Metadata --> E{IFrameCache};
        E -- CachedFrameInfo? --> C;
        C -- Is Frame New/Significantly Changed? --> F(2. IDifferenceEngine);
        I -- Current VisualEnvironmentProfile --> F;
        F -- DifferenceScore / IsSignificant? --> C;
        
        C -- VisionInputData (if significant change OR explicit request) --> G(3. VisionProviderManager);
        G -- Selects & Calls --> H[IVisionProvider (e.g., OpenAI, Google)];
        H -- Raw Provider Output --> G;
        G -- ProcessedVisionData --> C;
        C -- Stores/Updates --> E;
        C -- Optionally updates --> I;
    end

    subgraph AgentOS Backend: Calibration & Adaptation
        I(IVisualEnvironmentCalibrator) -- Periodically/Continuously Analyzes Frame Metrics --> J[VisualEnvironmentProfile];
        C -- Feeds Frame Metrics (from D or H) --> I;
    end

    C -- ProcessedVisionData / VisionEvent --> K((To GMI / AgentOSOrchestrator / Output Stream));

    style A fill:#cde,stroke:#333,stroke-width:2px
    style B fill:#cde,stroke:#333,stroke-width:1.5px
    style K fill:#lightgrey,stroke:#333,stroke-width:2px
    style C stroke:#f00,stroke-width:3px,stroke-dasharray: 5 5
    style I stroke:#00f,stroke-width:2px,stroke-dasharray: 3 3
```

### Data Flow Description

**Client-Side Input (A -> B):**
The frontend captures frames (e.g., from a webcam). A conceptual Client-Side Adapter (part of the frontend logic) might perform initial light pre-processing (e.g., resizing, calculating a digest via ImageUtils ported to client or a similar client library). It packages the VisionInputData (base64 or URL) and FrameMetadata into a VisionInputEnvelope. This envelope is sent to a dedicated backend API endpoint (e.g., /api/v1/vision/process-frame).

**VisionProcessorService (VPS) (C) - Backend Orchestrator:**
Receives the VisionInputEnvelope.

* **Frame Pre-processing & Digesting (D)**: Uses ImageUtils to calculate a canonical digest (e.g., perceptual hash) for the incoming frame. Extracts basic metrics if not already provided.
* **Cache Check (E)**: Queries the IFrameCache using the frame digest.
    * If a recent, valid CachedFrameInfo is found (cache hit), the VPS may:
        * Return the cached ProcessedVisionData (or its reference/summary).
        * Skip further analysis if the frame is deemed unchanged or insignificantly different from a recently analyzed one.
* **Differencing (F)**: If no direct cache hit for an identical frame, or if change detection is active:
    * The VPS uses the configured IDifferenceEngine (e.g., DigestDifferenceEngine, FeatureDifferenceEngine).
    * The engine compares the current frame (or its features) against a reference (e.g., last known significant frame, or features from a cached frame).
    * The VisualEnvironmentProfile (from IVisualEnvironmentCalibrator) provides adaptive thresholds to the differencing engine, influencing its sensitivity.
    * If the change is not significant, processing for this frame might stop or only a lightweight update might occur (e.g., noting the frame was seen).
* **Full Analysis via Provider (G -> H)**: If the change is significant OR if an explicit analysis request is made (e.g., user asks "what is this?"):
    * The VPS sends the VisionInputData and requested VisionTask[] to the VisionProviderManager.
    * The VisionProviderManager selects an appropriate IVisionProvider (e.g., OpenAIVisionProvider).
    * The chosen provider performs the analysis and returns ProcessedVisionData.
* **Cache Update (C -> E)**: The VPS stores/updates CachedFrameInfo for the processed frame, including its digest, extracted features (if any), and a reference to/summary of the ProcessedVisionData.
* **Calibration Feedback (C -> I)**: Metrics derived from the processed frame can be fed to the IVisualEnvironmentCalibrator for continuous adaptation of the VisualEnvironmentProfile.

**IVisualEnvironmentCalibrator (I -> J):**
Operates periodically or is triggered by the VPS. Analyzes a sequence of frame metrics (brightness, motion, complexity derived via ImageUtils or from provider analyses) to build/update the VisualEnvironmentProfile. This profile influences the adaptiveThresholds used by the IDifferenceEngine.

**Output (K):**
The VisionProcessorService makes the ProcessedVisionData (for significant frames) or other visual events (e.g., "no significant visual change detected") available. This output is consumed by the AgentOSOrchestrator or directly by the active GMI, allowing the AI to incorporate visual understanding into its reasoning and responses. This could be via a stream or updates to the GMI's working memory/context.

## 4. Directory Structure

The core vision subsystem resides in `backend/agentos/core/vision/`:
(Refer to the previously generated README section for the detailed file structure - I will omit it here for brevity but it's the same as discussed.)

## 5. Core Interfaces & Data Structures

* **VisionInputEnvelope**: Packages VisionInputData (base64/URL) and FrameMetadata.
* **ProcessedVisionData**: Comprehensive analysis results (scene description, objects, OCR, faces, features).
* **CachedFrameInfo**: Stores digest, features, analysis references, and cache metadata (timestamps, access count) for efficient lookups.
* **VisualEnvironmentProfile**: Characterizes the visual scene (e.g., STABLE_STATIC_CLEAR, DYNAMIC_COMPLEX_VARIABLE_CLARITY) and provides adaptiveThresholds for processing.
* **IVisionProvider**: Interface for vision AI backends (e.g., OpenAIVisionProvider). Methods: analyzeImage(), extractImageFeatures(), compareImageFeatures(), listAvailableModels(), getModelInfo(), checkHealth().
* **VisionProviderManager**: Manages and selects IVisionProvider instances.
* **IVisualEnvironmentCalibrator**: Interface for analyzing frame sequences to produce/update the VisualEnvironmentProfile.
* **IDifferenceEngine**: Interface for algorithms that compare frames/features and determine significance of change (e.g., DigestDifferenceEngine, FeatureDifferenceEngine).
* **IFrameCache**: Interface for caching CachedFrameInfo.
* **IVisionProcessorService**: The primary service interface orchestrating the vision pipeline. Method: processVisualInput(envelope) -> yields ProcessedVisionData or events.

## 6. Operational Modes

The VisionProcessorService can operate in different modes, often controlled by a GMI or user setting (e.g., an "AI is watching" toggle):

**Disabled Mode** (`VISION_PROCESSING_ENABLED=false` in .env): The entire vision subsystem is bypassed. No API endpoints related to vision are active.

**Passive/Standby Mode** (e.g., "Is Watching" = false via GMI state):
* The API endpoint for vision might still accept frames but the VisionProcessorService performs minimal work.
* It might only calculate digests and update the cache with basic frame presence without full analysis or differencing.
* No detailed ProcessedVisionData is generated unless an explicit analysis is requested for a specific frame.

**Active Mode** (e.g., "Is Watching" = true):
* The full pipeline is engaged for incoming frames.
* Frames are digested, cached, and compared using IDifferenceEngine with adaptive thresholds from VisualEnvironmentProfile.
* Significant changes trigger full analysis via an IVisionProvider.
* ProcessedVisionData or derived "visual events" (e.g., "new object detected", "scene changed significantly") are passed to the GMI/AgentOSOrchestrator.

## 7. Integration with AgentOS Core / GMI

**API Layer**: New API routes (e.g., `/api/v1/vision/process-frame`, `/api/v1/vision/analyze-image-explicitly`) will handle incoming visual data.

**GMI Input:**
* The existing `GMITurnInput.visionInputs?: VisionInputData[]` can be used for explicit, on-demand image analysis requested by the user or GMI.
* For continuous "ambient" vision (when "is watching"), ProcessedVisionData (or a summary/event derived from it) needs to be incorporated into the GMI's context. This could be:
    * A special system message injected into the ConversationContext.
    * A dedicated field in an expanded GMI input structure.
    * Updates to the GMI's IWorkingMemory (e.g., `workingMemory.set('current_visual_scene', sceneSummary)`).

**AgentOSOrchestrator / GMIManager:**
* Will likely manage the "is watching" state for a given GMI/session.
* Routes VisionInputEnvelopes from the API to the VisionProcessorService.
* Receives outputs/events from VisionProcessorService and decides how to integrate them into the GMI's processing loop. This fusion of multimodal input is a key orchestration task.

**Persona Configuration (IPersonaDefinition):**
* Can specify default vision processing behavior (e.g., preferred vision tasks when "watching", initial differencing sensitivity).
* Can define how a persona reacts to specific visual events or ProcessedVisionData.

**Tool System**: GMIs might use tools that accept or produce visual data, interacting indirectly with the vision subsystem.

## 8. Configuration (.env and Service Configurations)

The vision subsystem will be highly configurable via .env variables and JSON/TS configuration objects for each main service.

* **Global Toggle**: `VISION_PROCESSING_ENABLED` (master switch).
* **Provider Configuration**: API keys, default models per provider (e.g., `VISION_PROVIDER_OPENAI_API_KEY`, `VISION_PROVIDER_OPENAI_DEFAULT_MODEL_ID`).
* **VisionProcessorServiceConfig**: Default "is watching" state, cache settings (max items, TTL), default differencing engine, initial change thresholds.
* **VisualEnvironmentCalibratorConfig**: Calibration duration, adaptation intervals, sensitivity.
* **DifferenceEngineConfig**: Parameters specific to chosen differencing engines.
* **FrameCacheConfig**: Parameters for the chosen cache implementation.

Vision is designed to be entirely optional. If `VISION_PROCESSING_ENABLED` is false, or if no providers are configured, the system will function without visual capabilities, and GMIs will operate based on other available modalities.

## 9. "Smart" Optimizations & "Evolutionary Decay"

**Caching (IFrameCache with InMemoryFrameCache):**
* **LRU/LFU Eviction**: Ensures frequently/recently accessed frame data is prioritized.
* **TTL (Time-To-Live)**: `CachedFrameInfo.expiresAt` ensures stale data is eventually removed (decay).
* **Evolutionary Aspect (Future)**: The `defaultTTLMs` or even per-entry TTLs could be dynamically adjusted by the VisionProcessorService based on the VisualEnvironmentProfile's stability. A very stable scene might allow longer TTLs for its constituent frames. GMI feedback on the utility of past visual information could also influence cache retention.

**Differencing (IDifferenceEngine with VisualEnvironmentProfile):**
* **Adaptive Thresholds**: `VisualEnvironmentProfile.adaptiveThresholds.significantChangeThreshold` is the core mechanism. A "busy" or "poor visibility" environment would lead to higher thresholds (requiring more substantial change to be flagged as significant).
* **Evolutionary Aspect (Future)**: The VisualEnvironmentProfile itself evolves as the IVisualEnvironmentCalibrator continuously processes frame metrics. If the GMI indicates visual perceptions are frequently missed or irrelevant, these feedback signals could (in a more advanced version) trigger adjustments in calibration sensitivity or directly influence the threshold calculations within the profile, creating a feedback loop for "evolutionary" adaptation of what constitutes a "significant" change. "Decay" could mean that if an environment type persists for a long time, the confidence in that profile increases, making thresholds more stable, or if feedback is sparse, thresholds might slowly revert to more conservative baselines.

**Averaging:**
* **IVisualEnvironmentCalibrator**: Intrinsically uses averaging (or more robust statistical measures like percentiles) of frame metrics over time (VisualCalibrationMetrics) to establish a stable VisualEnvironmentProfile.
* **VisionProcessorService (Future)**: For very high frame rates or noisy input, might implement temporal averaging/smoothing of ImageFeatureSets from consecutive, highly similar (but not identical) frames before sending a single, stabilized "perception" to the GMI. This reduces jitter in perception.

## 10. Future Considerations

* **Advanced Client-Side Pre-processing**: Offloading digest calculation, basic motion detection, or even lightweight feature extraction to the client (e.g., using WebAssembly, TensorFlow.js Lite) to reduce backend load and network traffic. VisionInputEnvelope can carry these pre-computed elements.
* **Object Tracking Across Frames**: Beyond single-frame object detection.
* **GMI-Directed Visual Attention**: Allowing the GMI to request the vision system to "focus" on specific regions of interest or track particular objects.
* **More Sophisticated Differencing Engines**: E.g., engines that build a dynamic background model.
* **Feedback-Driven Evolution of Calibration/Thresholds**: Direct GMI feedback ("that visual change was important" or "that was irrelevant noise") influencing the VisualEnvironmentProfile parameters.
* **Scalable Persistent Caching**: Redis or other distributed cache solutions for IFrameCache in multi-instance deployments.

This vision subsystem, when fully implemented, will provide a powerful and adaptive perception layer for AgentOS.