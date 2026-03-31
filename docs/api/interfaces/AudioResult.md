# Interface: AudioResult

Defined in: [packages/agentos/src/media/audio/types.ts:255](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/audio/types.ts#L255)

Result envelope returned by [IAudioGenerator.generateMusic](IAudioGenerator.md#generatemusic) and
[IAudioGenerator.generateSFX](IAudioGenerator.md#generatesfx).

Follows the same envelope pattern used by [VideoResult](VideoResult.md) in the video
subsystem: a timestamp, model/provider IDs, the generated artifact(s), and
optional usage/billing information.

## Example

```typescript
const result: AudioResult = {
  created: Math.floor(Date.now() / 1000),
  modelId: 'suno-v3.5',
  providerId: 'suno',
  audio: [{ url: 'https://cdn.suno.ai/abc123.mp3', mimeType: 'audio/mpeg' }],
  usage: { totalAudioClips: 1 },
};
```

## Properties

### audio

> **audio**: [`GeneratedAudio`](GeneratedAudio.md)[]

Defined in: [packages/agentos/src/media/audio/types.ts:266](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/audio/types.ts#L266)

The generated audio clip(s).

***

### created

> **created**: `number`

Defined in: [packages/agentos/src/media/audio/types.ts:257](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/audio/types.ts#L257)

Unix timestamp (seconds) when the result was created.

***

### modelId

> **modelId**: `string`

Defined in: [packages/agentos/src/media/audio/types.ts:260](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/audio/types.ts#L260)

Model identifier that produced the result.

***

### providerId

> **providerId**: `string`

Defined in: [packages/agentos/src/media/audio/types.ts:263](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/audio/types.ts#L263)

Provider identifier that produced the result.

***

### usage?

> `optional` **usage**: [`AudioProviderUsage`](AudioProviderUsage.md)

Defined in: [packages/agentos/src/media/audio/types.ts:269](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/audio/types.ts#L269)

Usage / billing information, if available.
