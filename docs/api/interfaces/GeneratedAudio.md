# Interface: GeneratedAudio

Defined in: [packages/agentos/src/media/audio/types.ts:216](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/audio/types.ts#L216)

A single generated audio artifact.

At least one of [url](#url) or [base64](#base64) will be populated depending
on the provider's response format.

## Properties

### base64?

> `optional` **base64**: `string`

Defined in: [packages/agentos/src/media/audio/types.ts:221](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/audio/types.ts#L221)

Base64-encoded audio data.

***

### durationSec?

> `optional` **durationSec**: `number`

Defined in: [packages/agentos/src/media/audio/types.ts:227](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/audio/types.ts#L227)

Duration of the generated audio in seconds.

***

### mimeType?

> `optional` **mimeType**: `string`

Defined in: [packages/agentos/src/media/audio/types.ts:224](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/audio/types.ts#L224)

MIME type of the audio (e.g. `'audio/mpeg'`, `'audio/wav'`).

***

### providerMetadata?

> `optional` **providerMetadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/media/audio/types.ts:233](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/audio/types.ts#L233)

Provider-specific metadata (job ID, generation params, etc.).

***

### sampleRate?

> `optional` **sampleRate**: `number`

Defined in: [packages/agentos/src/media/audio/types.ts:230](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/audio/types.ts#L230)

Sample rate in Hz (e.g. `44100`, `48000`).

***

### url?

> `optional` **url**: `string`

Defined in: [packages/agentos/src/media/audio/types.ts:218](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/audio/types.ts#L218)

Public URL where the audio can be downloaded.
