# Interface: VideoModelInfo

Defined in: [packages/agentos/src/media/video/types.ts:39](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L39)

Describes a video model exposed by a provider.

## Properties

### capabilities?

> `optional` **capabilities**: (`"text-to-video"` \| `"image-to-video"`)[]

Defined in: [packages/agentos/src/media/video/types.ts:51](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L51)

Supported generation capabilities.

***

### description?

> `optional` **description**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:47](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L47)

Short description of the model's capabilities.

***

### displayName?

> `optional` **displayName**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:45](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L45)

Human-readable display name.

***

### maxDurationSec?

> `optional` **maxDurationSec**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:49](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L49)

Maximum output duration in seconds.

***

### modelId

> **modelId**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:41](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L41)

Unique model identifier (e.g. `'gen-3-alpha'`).

***

### providerId

> **providerId**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:43](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/video/types.ts#L43)

Provider that hosts this model.
