# Interface: GenerateVideoResult

Defined in: [packages/agentos/src/api/generateVideo.ts:276](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/generateVideo.ts#L276)

The result returned by [generateVideo](../functions/generateVideo.md).

Wraps the core [VideoResult](VideoResult.md) with a simpler, AI-SDK-style shape.

## Properties

### created

> **created**: `number`

Defined in: [packages/agentos/src/api/generateVideo.ts:282](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/generateVideo.ts#L282)

Unix timestamp (ms) when the video was created.

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/api/generateVideo.ts:278](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/generateVideo.ts#L278)

Model identifier reported by the provider.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/generateVideo.ts:280](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/generateVideo.ts#L280)

Provider identifier (e.g. `"runway"`, `"replicate"`, `"fal"`).

***

### usage?

> `optional` **usage**: [`VideoProviderUsage`](VideoProviderUsage.md)

Defined in: [packages/agentos/src/api/generateVideo.ts:286](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/generateVideo.ts#L286)

Usage / billing information, if available.

***

### videos

> **videos**: [`GeneratedVideo`](GeneratedVideo.md)[]

Defined in: [packages/agentos/src/api/generateVideo.ts:284](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/generateVideo.ts#L284)

Array of generated video objects containing URLs or base64 data.
