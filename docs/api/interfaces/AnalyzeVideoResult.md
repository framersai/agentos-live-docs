# Interface: AnalyzeVideoResult

Defined in: [packages/agentos/src/api/analyzeVideo.ts:106](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L106)

The result returned by [analyzeVideo](../functions/analyzeVideo.md).

Extends the core [VideoAnalysis](VideoAnalysis.md) with optional rich scene data
when scene detection and description are enabled.

## Properties

### description

> **description**: `string`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:108](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L108)

Free-form textual description / answer from the analyser.

***

### durationSec?

> `optional` **durationSec**: `number`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:116](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L116)

Overall duration of the analysed video in seconds.

***

### fullTranscript?

> `optional` **fullTranscript**: `string`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:122](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L122)

Full transcript when audio transcription was enabled.

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:118](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L118)

Model that produced the analysis.

***

### objects?

> `optional` **objects**: `string`[]

Defined in: [packages/agentos/src/api/analyzeVideo.ts:112](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L112)

Detected objects / entities across the video.

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:120](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L120)

Provider that produced the analysis.

***

### providerMetadata?

> `optional` **providerMetadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/api/analyzeVideo.ts:126](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L126)

Provider-specific metadata.

***

### ragChunkIds?

> `optional` **ragChunkIds**: `string`[]

Defined in: [packages/agentos/src/api/analyzeVideo.ts:124](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L124)

IDs of RAG chunks created, when indexForRAG was enabled.

***

### scenes?

> `optional` **scenes**: [`SceneDescription`](SceneDescription.md)[]

Defined in: [packages/agentos/src/api/analyzeVideo.ts:110](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L110)

Detected scene segments with timestamps.

***

### text?

> `optional` **text**: `string`[]

Defined in: [packages/agentos/src/api/analyzeVideo.ts:114](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L114)

Detected on-screen or spoken text (OCR / ASR).
