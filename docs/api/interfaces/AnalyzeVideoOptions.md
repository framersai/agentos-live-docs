# Interface: AnalyzeVideoOptions

Defined in: [packages/agentos/src/api/analyzeVideo.ts:35](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L35)

Options for a [analyzeVideo](../functions/analyzeVideo.md) call.

At minimum, a video source (`videoUrl` or `videoBuffer`) is required.

## Properties

### descriptionDetail?

> `optional` **descriptionDetail**: [`DescriptionDetail`](../type-aliases/DescriptionDetail.md)

Defined in: [packages/agentos/src/api/analyzeVideo.ts:72](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L72)

How detailed scene descriptions should be.

#### Default

```ts
'detailed'
```

***

### indexForRAG?

> `optional` **indexForRAG**: `boolean`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:86](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L86)

Whether to index scene descriptions and transcripts into the
RAG vector store for later retrieval.

#### Default

```ts
false
```

***

### maxFrames?

> `optional` **maxFrames**: `number`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:52](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L52)

Maximum number of frames to sample for analysis.

***

### maxScenes?

> `optional` **maxScenes**: `number`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:79](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L79)

Maximum number of scenes to detect.
Prevents runaway analysis on very long videos.

#### Default

```ts
100
```

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:49](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L49)

Model identifier to use for the vision LLM analysis step.

***

### onProgress()?

> `optional` **onProgress**: (`event`) => `void`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:91](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L91)

Optional callback invoked as analysis progresses through phases.

#### Parameters

##### event

[`VideoAnalysisProgressEvent`](VideoAnalysisProgressEvent.md)

#### Returns

`void`

***

### prompt?

> `optional` **prompt**: `string`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:46](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L46)

Text prompt / question to guide the analysis (e.g.
"Describe the key actions in this video").

***

### providerOptions?

> `optional` **providerOptions**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/api/analyzeVideo.ts:94](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L94)

Arbitrary provider-specific options.

***

### sceneThreshold?

> `optional` **sceneThreshold**: `number`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:60](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L60)

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

Defined in: [packages/agentos/src/api/analyzeVideo.ts:66](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L66)

Whether to transcribe the audio track using the configured STT provider.

#### Default

```ts
true
```

***

### usageLedger?

> `optional` **usageLedger**: [`AgentOSUsageLedgerOptions`](AgentOSUsageLedgerOptions.md)

Defined in: [packages/agentos/src/api/analyzeVideo.ts:97](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L97)

Optional durable usage ledger configuration for accounting.

***

### videoBuffer?

> `optional` **videoBuffer**: `Buffer`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:40](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L40)

Raw video bytes. Mutually exclusive with `videoUrl`.

***

### videoUrl?

> `optional` **videoUrl**: `string`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:37](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/analyzeVideo.ts#L37)

URL of the video to analyse. Mutually exclusive with `videoBuffer`.
