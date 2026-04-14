# Interface: VideoAnalysisProgressEvent

Defined in: [packages/agentos/src/media/video/types.ts:288](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/video/types.ts#L288)

Progress event emitted during video analysis.

The analysis lifecycle flows through these phases in order:
`extracting-frames` -> `detecting-scenes` -> `describing` ->
`transcribing` -> `summarizing`.

## Properties

### currentScene?

> `optional` **currentScene**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:315](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/video/types.ts#L315)

0-based index of the scene currently being processed.
Only meaningful during the `'describing'` and `'transcribing'` phases.

***

### message?

> `optional` **message**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:318](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/video/types.ts#L318)

Human-readable status message for the current phase.

***

### phase

> **phase**: `"transcribing"` \| `"extracting-frames"` \| `"detecting-scenes"` \| `"describing"` \| `"summarizing"`

Defined in: [packages/agentos/src/media/video/types.ts:298](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/video/types.ts#L298)

Current phase of the analysis pipeline.

- `'extracting-frames'` — Decoding video and extracting frames
- `'detecting-scenes'`  — Running scene boundary detection
- `'describing'`        — Sending key frames to vision LLM
- `'transcribing'`      — Running audio transcription via Whisper
- `'summarizing'`       — Generating overall video summary

***

### progress?

> `optional` **progress**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:309](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/video/types.ts#L309)

Estimated progress percentage (0-100) within the current phase.
Not always available — depends on the phase and provider.
