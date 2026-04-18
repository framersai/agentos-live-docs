# Interface: VideoAnalyzerDeps

Defined in: [packages/agentos/src/media/video/VideoAnalyzer.ts:92](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/video/VideoAnalyzer.ts#L92)

Dependencies injected into the [VideoAnalyzer](../classes/VideoAnalyzer.md) constructor.

All fields are optional — the analyzer will auto-create default
instances for [VisionPipeline](../classes/VisionPipeline.md) and SceneDetector when
they are not provided.

## Properties

### sceneDetector?

> `optional` **sceneDetector**: `SceneDetector`

Defined in: [packages/agentos/src/media/video/VideoAnalyzer.ts:112](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/video/VideoAnalyzer.ts#L112)

Scene boundary detector for segmenting the video.
When omitted, a default SceneDetector with standard
thresholds is auto-created.

***

### sttProvider?

> `optional` **sttProvider**: [`SpeechToTextProvider`](SpeechToTextProvider.md)

Defined in: [packages/agentos/src/media/video/VideoAnalyzer.ts:105](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/video/VideoAnalyzer.ts#L105)

Speech-to-text provider for audio transcription.
When omitted, the `transcribeAudio` option in analysis requests
is silently skipped (scenes will not have transcripts).

***

### visionPipeline?

> `optional` **visionPipeline**: [`VisionPipeline`](../classes/VisionPipeline.md)

Defined in: [packages/agentos/src/media/video/VideoAnalyzer.ts:98](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/video/VideoAnalyzer.ts#L98)

Vision pipeline for describing key frames.
When omitted, a default pipeline is auto-created via
[createVisionPipeline](../functions/createVisionPipeline.md) on first use.
