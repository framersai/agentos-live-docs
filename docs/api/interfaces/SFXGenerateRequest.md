# Interface: SFXGenerateRequest

Defined in: [packages/agentos/src/media/audio/types.ts:154](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/audio/types.ts#L154)

Request payload for sound-effect generation from a text prompt.

Passed to [IAudioGenerator.generateSFX](IAudioGenerator.md#generatesfx) by the high-level
orchestration layer after normalising user input.

## Example

```typescript
const request: SFXGenerateRequest = {
  prompt: 'Thunder crack followed by heavy rain on a tin roof',
  durationSec: 5,
};
```

## Properties

### durationSec?

> `optional` **durationSec**: `number`

Defined in: [packages/agentos/src/media/audio/types.ts:176](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/audio/types.ts#L176)

Desired output duration in seconds.

SFX clips are typically short (1-15 seconds). Providers may enforce
their own limits.

***

### modelId?

> `optional` **modelId**: `string`

Defined in: [packages/agentos/src/media/audio/types.ts:168](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/audio/types.ts#L168)

Model identifier to use for generation.

When omitted the provider falls back to its [IAudioGenerator.defaultModelId](IAudioGenerator.md#defaultmodelid).

***

### n?

> `optional` **n**: `number`

Defined in: [packages/agentos/src/media/audio/types.ts:197](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/audio/types.ts#L197)

Number of audio clips to generate.

#### Default

```ts
1
```

***

### outputFormat?

> `optional` **outputFormat**: [`AudioOutputFormat`](../type-aliases/AudioOutputFormat.md)

Defined in: [packages/agentos/src/media/audio/types.ts:183](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/audio/types.ts#L183)

Output audio format.

#### Default

```ts
'mp3'
```

***

### prompt

> **prompt**: `string`

Defined in: [packages/agentos/src/media/audio/types.ts:161](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/audio/types.ts#L161)

Text prompt describing the desired sound effect.

Be specific about the sound, its environment, and any layering
(e.g. "glass breaking on a marble floor in a large hall with reverb").

***

### providerOptions?

> `optional` **providerOptions**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/media/audio/types.ts:203](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/audio/types.ts#L203)

Arbitrary provider-specific options.

***

### seed?

> `optional` **seed**: `number`

Defined in: [packages/agentos/src/media/audio/types.ts:190](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/audio/types.ts#L190)

Seed for reproducible output.

Not all providers honour seeds — check provider documentation.

***

### userId?

> `optional` **userId**: `string`

Defined in: [packages/agentos/src/media/audio/types.ts:200](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/audio/types.ts#L200)

Identifier of the requesting user (for billing / rate limiting).
