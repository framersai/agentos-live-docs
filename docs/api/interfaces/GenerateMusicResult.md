# Interface: GenerateMusicResult

Defined in: [packages/agentos/src/api/generateMusic.ts:278](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateMusic.ts#L278)

The result returned by [generateMusic](../functions/generateMusic.md).

Wraps the core [AudioResult](AudioResult.md) with a simpler, AI-SDK-style shape.

## Properties

### audio

> **audio**: [`GeneratedAudio`](GeneratedAudio.md)[]

Defined in: [packages/agentos/src/api/generateMusic.ts:286](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateMusic.ts#L286)

Array of generated audio objects containing URLs or base64 data.

***

### created

> **created**: `number`

Defined in: [packages/agentos/src/api/generateMusic.ts:284](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateMusic.ts#L284)

Unix timestamp (seconds) when the audio was created.

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/api/generateMusic.ts:280](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateMusic.ts#L280)

Model identifier reported by the provider.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/generateMusic.ts:282](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateMusic.ts#L282)

Provider identifier (e.g. `"suno"`, `"stable-audio"`).

***

### usage?

> `optional` **usage**: [`AudioProviderUsage`](AudioProviderUsage.md)

Defined in: [packages/agentos/src/api/generateMusic.ts:288](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateMusic.ts#L288)

Usage / billing information, if available.
