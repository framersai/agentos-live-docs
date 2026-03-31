# Interface: VideoProgressEvent

Defined in: [packages/agentos/src/media/video/types.ts:252](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/video/types.ts#L252)

Typed progress event emitted during video generation.

The generation lifecycle flows through these statuses in order:
`queued` -> `processing` -> `downloading` -> `complete` (or `failed`
at any point).

## Properties

### estimatedRemainingMs?

> `optional` **estimatedRemainingMs**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:275](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/video/types.ts#L275)

Estimated time remaining in milliseconds.
Only available when the provider reports ETA information.

***

### message?

> `optional` **message**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:278](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/video/types.ts#L278)

Human-readable status message or error description.

***

### progress?

> `optional` **progress**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:269](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/video/types.ts#L269)

Estimated progress percentage (0-100).
Not all providers report granular progress; may remain undefined
until the final status transition.

***

### status

> **status**: `"failed"` \| `"queued"` \| `"processing"` \| `"downloading"` \| `"complete"`

Defined in: [packages/agentos/src/media/video/types.ts:262](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/video/types.ts#L262)

Current status of the generation job.

- `'queued'`      — Request accepted, waiting for GPU slot
- `'processing'`  — Actively generating frames
- `'downloading'` — Generation complete, downloading result
- `'complete'`    — Fully done, result available
- `'failed'`      — Terminal error, see [message](#message)
