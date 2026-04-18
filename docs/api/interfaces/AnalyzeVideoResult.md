# Interface: AnalyzeVideoResult

Defined in: [packages/agentos/src/api/analyzeVideo.ts:105](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/analyzeVideo.ts#L105)

The result returned by [analyzeVideo](../functions/analyzeVideo.md).

Extends the core [VideoAnalysis](VideoAnalysis.md) with optional rich scene data
when scene detection and description are enabled.

## Properties

### description

> **description**: `string`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:107](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/analyzeVideo.ts#L107)

Free-form textual description / answer from the analyser.

***

### durationSec?

> `optional` **durationSec**: `number`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:115](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/analyzeVideo.ts#L115)

Overall duration of the analysed video in seconds.

***

### fullTranscript?

> `optional` **fullTranscript**: `string`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:121](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/analyzeVideo.ts#L121)

Full transcript when audio transcription was enabled.

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:117](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/analyzeVideo.ts#L117)

Model that produced the analysis.

***

### objects?

> `optional` **objects**: `string`[]

Defined in: [packages/agentos/src/api/analyzeVideo.ts:111](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/analyzeVideo.ts#L111)

Detected objects / entities across the video.

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:119](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/analyzeVideo.ts#L119)

Provider that produced the analysis.

***

### providerMetadata?

> `optional` **providerMetadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/api/analyzeVideo.ts:125](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/analyzeVideo.ts#L125)

Provider-specific metadata.

***

### ragChunkIds?

> `optional` **ragChunkIds**: `string`[]

Defined in: [packages/agentos/src/api/analyzeVideo.ts:123](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/analyzeVideo.ts#L123)

IDs of RAG chunks created, when indexForRAG was enabled.

***

### scenes?

> `optional` **scenes**: [`SceneDescription`](SceneDescription.md)[]

Defined in: [packages/agentos/src/api/analyzeVideo.ts:109](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/analyzeVideo.ts#L109)

Detected scene segments with timestamps.

***

### text?

> `optional` **text**: `string`[]

Defined in: [packages/agentos/src/api/analyzeVideo.ts:113](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/analyzeVideo.ts#L113)

Detected on-screen or spoken text (OCR / ASR).
