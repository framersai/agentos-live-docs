# Class: VideoAnalyzer

Defined in: [packages/agentos/src/media/video/VideoAnalyzer.ts:130](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/video/VideoAnalyzer.ts#L130)

Structured video analysis pipeline that wires together scene detection,
vision description, audio transcription, and LLM summarization.

Implements the base [IVideoAnalyzer](../interfaces/IVideoAnalyzer.md) interface for simple analysis
requests, and exposes an `analyze()` method for rich analysis with
progress reporting, configurable detail levels, and optional RAG indexing.

All ffmpeg/ffprobe invocations use `execFile` (not `exec`) for safety —
arguments are passed as arrays, preventing shell injection.

## Implements

- [`IVideoAnalyzer`](../interfaces/IVideoAnalyzer.md)

## Constructors

### Constructor

> **new VideoAnalyzer**(`deps?`): `VideoAnalyzer`

Defined in: [packages/agentos/src/media/video/VideoAnalyzer.ts:157](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/video/VideoAnalyzer.ts#L157)

Create a new VideoAnalyzer with optional injected dependencies.

Missing dependencies are auto-created with sensible defaults:
- **VisionPipeline**: created lazily via `createVisionPipeline()` on first use
- **SceneDetector**: created immediately with default thresholds
- **SpeechToTextProvider**: left undefined — transcription skipped when missing

#### Parameters

##### deps?

[`VideoAnalyzerDeps`](../interfaces/VideoAnalyzerDeps.md)

Optional dependency overrides.

#### Returns

`VideoAnalyzer`

## Methods

### analyze()

> **analyze**(`request`): `Promise`\<[`VideoAnalysisRich`](../interfaces/VideoAnalysisRich.md)\>

Defined in: [packages/agentos/src/media/video/VideoAnalyzer.ts:240](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/video/VideoAnalyzer.ts#L240)

Run the full video analysis pipeline with scene detection, vision
descriptions, optional audio transcription, and LLM summarization.

The pipeline executes these stages sequentially:

1. **Extract frames** — decode video at 1fps via ffmpeg
2. **Detect scenes** — run SceneDetector over extracted frames
3. **Describe scenes** — send key frames to VisionPipeline
4. **Transcribe audio** — (optional) extract audio and run STT
5. **Summarize** — generate overall summary via LLM

Progress events are emitted at each phase transition when
`onProgress` is provided.

#### Parameters

##### request

[`VideoAnalyzeRequestRich`](../interfaces/VideoAnalyzeRequestRich.md)

Rich analysis parameters.

#### Returns

`Promise`\<[`VideoAnalysisRich`](../interfaces/VideoAnalysisRich.md)\>

Rich analysis result with scenes, summary, and optional RAG chunks.

#### Throws

If ffprobe/ffmpeg are not installed on the system.

#### Throws

If the video buffer is empty or invalid.

***

### analyzeVideo()

> **analyzeVideo**(`request`): `Promise`\<[`VideoAnalysis`](../interfaces/VideoAnalysis.md)\>

Defined in: [packages/agentos/src/media/video/VideoAnalyzer.ts:178](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/video/VideoAnalyzer.ts#L178)

Analyse a video and return structured understanding results.

This is the simple [IVideoAnalyzer](../interfaces/IVideoAnalyzer.md) interface method. For richer
analysis with progress reporting and scene descriptions, use
[analyze](#analyze) instead.

#### Parameters

##### request

[`VideoAnalyzeRequest`](../interfaces/VideoAnalyzeRequest.md)

The analysis parameters (video source + optional prompt).

#### Returns

`Promise`\<[`VideoAnalysis`](../interfaces/VideoAnalysis.md)\>

Structured analysis including description, scenes, and duration.

#### Implementation of

[`IVideoAnalyzer`](../interfaces/IVideoAnalyzer.md).[`analyzeVideo`](../interfaces/IVideoAnalyzer.md#analyzevideo)
