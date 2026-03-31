# Interface: VideoAnalysis

Defined in: [packages/agentos/src/media/video/types.ts:199](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/types.ts#L199)

Structured result from video analysis.

## Properties

### description

> **description**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:201](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/types.ts#L201)

Free-form textual description / answer from the analyser.

***

### durationSec?

> `optional` **durationSec**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:209](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/types.ts#L209)

Overall duration of the analysed video in seconds.

***

### modelId?

> `optional` **modelId**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:211](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/types.ts#L211)

Model that produced the analysis.

***

### objects?

> `optional` **objects**: `string`[]

Defined in: [packages/agentos/src/media/video/types.ts:205](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/types.ts#L205)

Detected objects / entities across the video.

***

### providerId?

> `optional` **providerId**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:213](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/types.ts#L213)

Provider that produced the analysis.

***

### providerMetadata?

> `optional` **providerMetadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/media/video/types.ts:215](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/types.ts#L215)

Provider-specific metadata.

***

### scenes?

> `optional` **scenes**: [`VideoScene`](VideoScene.md)[]

Defined in: [packages/agentos/src/media/video/types.ts:203](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/types.ts#L203)

Detected scene segments with timestamps.

***

### text?

> `optional` **text**: `string`[]

Defined in: [packages/agentos/src/media/video/types.ts:207](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/types.ts#L207)

Detected on-screen or spoken text (OCR / ASR).
