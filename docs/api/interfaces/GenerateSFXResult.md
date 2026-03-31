# Interface: GenerateSFXResult

Defined in: [packages/agentos/src/api/generateSFX.ts:274](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/generateSFX.ts#L274)

The result returned by [generateSFX](../functions/generateSFX.md).

Wraps the core [AudioResult](AudioResult.md) with a simpler, AI-SDK-style shape.

## Properties

### audio

> **audio**: [`GeneratedAudio`](GeneratedAudio.md)[]

Defined in: [packages/agentos/src/api/generateSFX.ts:282](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/generateSFX.ts#L282)

Array of generated audio objects containing URLs or base64 data.

***

### created

> **created**: `number`

Defined in: [packages/agentos/src/api/generateSFX.ts:280](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/generateSFX.ts#L280)

Unix timestamp (seconds) when the audio was created.

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/api/generateSFX.ts:276](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/generateSFX.ts#L276)

Model identifier reported by the provider.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/generateSFX.ts:278](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/generateSFX.ts#L278)

Provider identifier (e.g. `"elevenlabs-sfx"`, `"stable-audio"`).

***

### usage?

> `optional` **usage**: [`AudioProviderUsage`](AudioProviderUsage.md)

Defined in: [packages/agentos/src/api/generateSFX.ts:284](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/generateSFX.ts#L284)

Usage / billing information, if available.
