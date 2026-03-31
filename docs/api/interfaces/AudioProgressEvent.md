# Interface: AudioProgressEvent

Defined in: [packages/agentos/src/media/audio/types.ts:293](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/audio/types.ts#L293)

Typed progress event emitted during audio generation.

The generation lifecycle flows through these statuses in order:
`queued` -> `processing` -> `downloading` -> `complete` (or `failed`
at any point).

Not all providers emit all statuses — synchronous providers (Stable Audio,
ElevenLabs) may jump directly from `processing` to `complete`.

## Example

```typescript
emitter.on('audio:progress', (evt: AudioProgressEvent) => {
  console.log(`[${evt.status}] ${evt.progress ?? '?'}% — ${evt.message}`);
});
```

## Properties

### estimatedRemainingMs?

> `optional` **estimatedRemainingMs**: `number`

Defined in: [packages/agentos/src/media/audio/types.ts:318](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/audio/types.ts#L318)

Estimated time remaining in milliseconds.

Only available when the provider reports ETA information.

***

### message?

> `optional` **message**: `string`

Defined in: [packages/agentos/src/media/audio/types.ts:321](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/audio/types.ts#L321)

Human-readable status message or error description.

***

### progress?

> `optional` **progress**: `number`

Defined in: [packages/agentos/src/media/audio/types.ts:311](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/audio/types.ts#L311)

Estimated progress percentage (0-100).

Not all providers report granular progress; may remain `undefined`
until the final status transition.

***

### status

> **status**: `"failed"` \| `"queued"` \| `"processing"` \| `"downloading"` \| `"complete"`

Defined in: [packages/agentos/src/media/audio/types.ts:303](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/audio/types.ts#L303)

Current status of the generation job.

- `'queued'`      — Request accepted, waiting for processing slot
- `'processing'`  — Actively generating audio
- `'downloading'` — Generation complete, downloading result
- `'complete'`    — Fully done, result available
- `'failed'`      — Terminal error, see [message](#message)
