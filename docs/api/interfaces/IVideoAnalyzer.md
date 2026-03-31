# Interface: IVideoAnalyzer

Defined in: [packages/agentos/src/media/video/IVideoAnalyzer.ts:26](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/IVideoAnalyzer.ts#L26)

Abstraction over a video analysis / understanding backend.

Unlike [IVideoGenerator](IVideoGenerator.md), analysis is typically a single-shot
operation with no capability negotiation required — every analyser is
expected to accept either a URL or a raw buffer and return a structured
[VideoAnalysis](VideoAnalysis.md).

## Methods

### analyzeVideo()

> **analyzeVideo**(`request`): `Promise`\<[`VideoAnalysis`](VideoAnalysis.md)\>

Defined in: [packages/agentos/src/media/video/IVideoAnalyzer.ts:33](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/IVideoAnalyzer.ts#L33)

Analyse a video and return structured understanding results.

#### Parameters

##### request

[`VideoAnalyzeRequest`](VideoAnalyzeRequest.md)

The analysis parameters (video source + optional prompt).

#### Returns

`Promise`\<[`VideoAnalysis`](VideoAnalysis.md)\>

Structured analysis including description, scenes, objects, etc.
