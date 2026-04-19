# Interface: AnalyzeVideoOptions

Defined in: [packages/agentos/src/api/analyzeVideo.ts:34](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/analyzeVideo.ts#L34)

Options for a [analyzeVideo](../functions/analyzeVideo.md) call.

At minimum, a video source (`videoUrl` or `videoBuffer`) is required.

## Properties

### descriptionDetail?

> `optional` **descriptionDetail**: [`DescriptionDetail`](../type-aliases/DescriptionDetail.md)

Defined in: [packages/agentos/src/api/analyzeVideo.ts:71](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/analyzeVideo.ts#L71)

How detailed scene descriptions should be.

#### Default

```ts
'detailed'
```

***

### indexForRAG?

> `optional` **indexForRAG**: `boolean`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:85](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/analyzeVideo.ts#L85)

Whether to index scene descriptions and transcripts into the
RAG vector store for later retrieval.

#### Default

```ts
false
```

***

### maxFrames?

> `optional` **maxFrames**: `number`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:51](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/analyzeVideo.ts#L51)

Maximum number of frames to sample for analysis.

***

### maxScenes?

> `optional` **maxScenes**: `number`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:78](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/analyzeVideo.ts#L78)

Maximum number of scenes to detect.
Prevents runaway analysis on very long videos.

#### Default

```ts
100
```

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:48](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/analyzeVideo.ts#L48)

Model identifier to use for the vision LLM analysis step.

***

### onProgress()?

> `optional` **onProgress**: (`event`) => `void`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:90](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/analyzeVideo.ts#L90)

Optional callback invoked as analysis progresses through phases.

#### Parameters

##### event

[`VideoAnalysisProgressEvent`](VideoAnalysisProgressEvent.md)

#### Returns

`void`

***

### prompt?

> `optional` **prompt**: `string`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:45](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/analyzeVideo.ts#L45)

Text prompt / question to guide the analysis (e.g.
"Describe the key actions in this video").

***

### providerOptions?

> `optional` **providerOptions**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/api/analyzeVideo.ts:93](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/analyzeVideo.ts#L93)

Arbitrary provider-specific options.

***

### sceneThreshold?

> `optional` **sceneThreshold**: `number`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:59](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/analyzeVideo.ts#L59)

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

Defined in: [packages/agentos/src/api/analyzeVideo.ts:65](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/analyzeVideo.ts#L65)

Whether to transcribe the audio track using the configured STT provider.

#### Default

```ts
true
```

***

### usageLedger?

> `optional` **usageLedger**: [`AgentOSUsageLedgerOptions`](AgentOSUsageLedgerOptions.md)

Defined in: [packages/agentos/src/api/analyzeVideo.ts:96](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/analyzeVideo.ts#L96)

Optional durable usage ledger configuration for accounting.

***

### videoBuffer?

> `optional` **videoBuffer**: `Buffer`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:39](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/analyzeVideo.ts#L39)

Raw video bytes. Mutually exclusive with `videoUrl`.

***

### videoUrl?

> `optional` **videoUrl**: `string`

Defined in: [packages/agentos/src/api/analyzeVideo.ts:36](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/analyzeVideo.ts#L36)

URL of the video to analyse. Mutually exclusive with `videoBuffer`.
