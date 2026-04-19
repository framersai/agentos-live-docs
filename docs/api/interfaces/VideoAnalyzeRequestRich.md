# Interface: VideoAnalyzeRequestRich

Defined in: [packages/agentos/src/media/video/types.ts:420](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L420)

Rich video analysis request with scene detection, transcription,
and RAG indexing support.

Extends the simpler [VideoAnalyzeRequest](VideoAnalyzeRequest.md) pattern with
fine-grained control over scene detection thresholds, description
detail, and optional RAG indexing of analysis results.

## Example

```typescript
const request: VideoAnalyzeRequestRich = {
  video: 'https://example.com/demo.mp4',
  sceneThreshold: 0.3,
  transcribeAudio: true,
  descriptionDetail: 'detailed',
  onProgress: (evt) => console.log(`${evt.phase}: ${evt.progress}%`),
};
```

## Properties

### descriptionDetail?

> `optional` **descriptionDetail**: [`DescriptionDetail`](../type-aliases/DescriptionDetail.md)

Defined in: [packages/agentos/src/media/video/types.ts:454](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L454)

How detailed scene descriptions should be.

#### Default

```ts
'detailed'
```

***

### indexForRAG?

> `optional` **indexForRAG**: `boolean`

Defined in: [packages/agentos/src/media/video/types.ts:475](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L475)

Whether to index scene descriptions and transcripts into the
RAG vector store for later retrieval.

#### Default

```ts
false
```

***

### maxFrames?

> `optional` **maxFrames**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:461](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L461)

Maximum number of frames to sample from the extracted frame set.
When the extracted frame count exceeds this value, frames are
evenly downsampled before scene detection and description.

***

### maxScenes?

> `optional` **maxScenes**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:468](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L468)

Maximum number of scenes to detect.
Prevents runaway analysis on very long videos with many cuts.

#### Default

```ts
100
```

***

### onProgress()?

> `optional` **onProgress**: (`event`) => `void`

Defined in: [packages/agentos/src/media/video/types.ts:482](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L482)

Optional callback invoked as analysis progresses through phases.
Called with a [VideoAnalysisProgressEvent](VideoAnalysisProgressEvent.md) at each phase
transition and when per-scene progress updates are available.

#### Parameters

##### event

[`VideoAnalysisProgressEvent`](VideoAnalysisProgressEvent.md)

#### Returns

`void`

***

### prompt?

> `optional` **prompt**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:432](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L432)

Optional analysis prompt or question that should guide the final answer.
When omitted, the analyzer produces a general-purpose summary.

***

### sceneThreshold?

> `optional` **sceneThreshold**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:440](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L440)

Threshold for scene change detection (0-1).
Lower values detect more scene boundaries (more sensitive);
higher values only detect dramatic cuts.

#### Default

```ts
0.3
```

***

### transcribeAudio?

> `optional` **transcribeAudio**: `boolean`

Defined in: [packages/agentos/src/media/video/types.ts:448](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L448)

Whether to transcribe the audio track using Whisper.
When enabled, each scene's transcript is populated and a
full transcript is included in the analysis.

#### Default

```ts
true
```

***

### video

> **video**: `string` \| `Buffer`

Defined in: [packages/agentos/src/media/video/types.ts:426](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L426)

Video to analyze — either a URL string or a raw Buffer.
When a URL is provided, the pipeline downloads the video to a
temporary file before processing.
