# Interface: ImageToVideoRequest

Defined in: [packages/agentos/src/media/video/types.ts:108](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L108)

Request payload for image-to-video generation.

Passed to [IVideoGenerator.imageToVideo](IVideoGenerator.md#imagetovideo) by the high-level
orchestration layer. Requires a source image that serves as the first
frame (or style reference) for the generated video.

## Properties

### aspectRatio?

> `optional` **aspectRatio**: [`VideoAspectRatio`](../type-aliases/VideoAspectRatio.md)

Defined in: [packages/agentos/src/media/video/types.ts:120](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L120)

Desired aspect ratio.

***

### durationSec?

> `optional` **durationSec**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:118](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L118)

Desired output duration in seconds.

***

### fps?

> `optional` **fps**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:124](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L124)

Frames per second for the output video.

***

### image

> **image**: `Buffer`

Defined in: [packages/agentos/src/media/video/types.ts:112](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L112)

Source image as a raw `Buffer`.

***

### modelId?

> `optional` **modelId**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:110](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L110)

Model identifier to use for generation.

***

### negativePrompt?

> `optional` **negativePrompt**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:116](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L116)

Negative prompt describing content to avoid.

***

### outputFormat?

> `optional` **outputFormat**: [`VideoOutputFormat`](../type-aliases/VideoOutputFormat.md)

Defined in: [packages/agentos/src/media/video/types.ts:122](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L122)

Output container format. Defaults to `'mp4'`.

***

### prompt

> **prompt**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:114](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L114)

Text prompt describing the desired motion / narrative.

***

### providerOptions?

> `optional` **providerOptions**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/media/video/types.ts:130](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L130)

Arbitrary provider-specific options.

***

### seed?

> `optional` **seed**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:126](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L126)

Seed for reproducible output.

***

### userId?

> `optional` **userId**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:128](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L128)

Identifier of the requesting user.
