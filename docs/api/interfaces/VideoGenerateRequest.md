# Interface: VideoGenerateRequest

Defined in: [packages/agentos/src/media/video/types.ts:74](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/video/types.ts#L74)

Request payload for text-to-video generation.

Passed to [IVideoGenerator.generateVideo](IVideoGenerator.md#generatevideo) by the high-level
orchestration layer after normalising user input.

## Properties

### aspectRatio?

> `optional` **aspectRatio**: [`VideoAspectRatio`](../type-aliases/VideoAspectRatio.md)

Defined in: [packages/agentos/src/media/video/types.ts:84](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/video/types.ts#L84)

Desired aspect ratio (e.g. `'16:9'`).

***

### durationSec?

> `optional` **durationSec**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:82](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/video/types.ts#L82)

Desired output duration in seconds.

***

### fps?

> `optional` **fps**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:90](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/video/types.ts#L90)

Frames per second for the output video.

***

### modelId?

> `optional` **modelId**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:76](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/video/types.ts#L76)

Model identifier to use for generation (e.g. `'gen-3-alpha'`).

***

### n?

> `optional` **n**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:94](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/video/types.ts#L94)

Number of videos to generate. Defaults to `1`.

***

### negativePrompt?

> `optional` **negativePrompt**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:80](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/video/types.ts#L80)

Negative prompt describing content to avoid.

***

### outputFormat?

> `optional` **outputFormat**: [`VideoOutputFormat`](../type-aliases/VideoOutputFormat.md)

Defined in: [packages/agentos/src/media/video/types.ts:88](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/video/types.ts#L88)

Output container format. Defaults to `'mp4'`.

***

### prompt

> **prompt**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:78](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/video/types.ts#L78)

Text prompt describing the desired video content.

***

### providerOptions?

> `optional` **providerOptions**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/media/video/types.ts:98](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/video/types.ts#L98)

Arbitrary provider-specific options.

***

### resolution?

> `optional` **resolution**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:86](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/video/types.ts#L86)

Desired output resolution (e.g. `'1280x720'`).

***

### seed?

> `optional` **seed**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:92](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/video/types.ts#L92)

Seed for reproducible output.

***

### userId?

> `optional` **userId**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:96](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/video/types.ts#L96)

Identifier of the requesting user (for billing / rate limiting).
