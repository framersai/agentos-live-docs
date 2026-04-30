# Interface: MusicGenerateRequest

Defined in: [packages/agentos/src/media/audio/types.ts:80](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/audio/types.ts#L80)

Request payload for music generation from a text prompt.

Passed to [IAudioGenerator.generateMusic](IAudioGenerator.md#generatemusic) by the high-level
orchestration layer after normalising user input.

## Example

```typescript
const request: MusicGenerateRequest = {
  prompt: 'Upbeat lo-fi hip hop beat with vinyl crackle and mellow piano',
  durationSec: 60,
  outputFormat: 'mp3',
};
```

## Properties

### durationSec?

> `optional` **durationSec**: `number`

Defined in: [packages/agentos/src/media/audio/types.ts:102](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/audio/types.ts#L102)

Desired output duration in seconds.

Provider limits vary: Suno caps at ~240s, Stable Audio at ~47s.
Exceeding the limit may result in truncation or an error.

***

### modelId?

> `optional` **modelId**: `string`

Defined in: [packages/agentos/src/media/audio/types.ts:94](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/audio/types.ts#L94)

Model identifier to use for generation.

When omitted the provider falls back to its [IAudioGenerator.defaultModelId](IAudioGenerator.md#defaultmodelid).

***

### n?

> `optional` **n**: `number`

Defined in: [packages/agentos/src/media/audio/types.ts:131](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/audio/types.ts#L131)

Number of audio clips to generate.

#### Default

```ts
1
```

***

### negativePrompt?

> `optional` **negativePrompt**: `string`

Defined in: [packages/agentos/src/media/audio/types.ts:110](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/audio/types.ts#L110)

Negative prompt describing musical elements to avoid.

Not all providers support negative prompts — unsupported values are
silently ignored by the adapter.

***

### outputFormat?

> `optional` **outputFormat**: [`AudioOutputFormat`](../type-aliases/AudioOutputFormat.md)

Defined in: [packages/agentos/src/media/audio/types.ts:117](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/audio/types.ts#L117)

Output audio format.

#### Default

```ts
'mp3'
```

***

### prompt

> **prompt**: `string`

Defined in: [packages/agentos/src/media/audio/types.ts:87](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/audio/types.ts#L87)

Text prompt describing the desired musical composition.

Quality and specificity of the prompt directly influence output quality.
Include genre, mood, instrumentation, and tempo for best results.

***

### providerOptions?

> `optional` **providerOptions**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/media/audio/types.ts:137](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/audio/types.ts#L137)

Arbitrary provider-specific options.

***

### seed?

> `optional` **seed**: `number`

Defined in: [packages/agentos/src/media/audio/types.ts:124](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/audio/types.ts#L124)

Seed for reproducible output.

Not all providers honour seeds — check provider documentation.

***

### userId?

> `optional` **userId**: `string`

Defined in: [packages/agentos/src/media/audio/types.ts:134](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/audio/types.ts#L134)

Identifier of the requesting user (for billing / rate limiting).
