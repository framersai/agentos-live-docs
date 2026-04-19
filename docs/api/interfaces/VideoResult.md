# Interface: VideoResult

Defined in: [packages/agentos/src/media/video/types.ts:161](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L161)

Result envelope returned by [IVideoGenerator.generateVideo](IVideoGenerator.md#generatevideo) and
[IVideoGenerator.imageToVideo](IVideoGenerator.md#imagetovideo).

## Properties

### created

> **created**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:163](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L163)

Unix timestamp (ms) when the result was created.

***

### modelId

> **modelId**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:165](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L165)

Model identifier that produced the result.

***

### providerId

> **providerId**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:167](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L167)

Provider identifier that produced the result.

***

### usage?

> `optional` **usage**: [`VideoProviderUsage`](VideoProviderUsage.md)

Defined in: [packages/agentos/src/media/video/types.ts:171](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L171)

Usage / billing information, if available.

***

### videos

> **videos**: [`GeneratedVideo`](GeneratedVideo.md)[]

Defined in: [packages/agentos/src/media/video/types.ts:169](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L169)

The generated video(s).
