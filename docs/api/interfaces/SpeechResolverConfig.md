# Interface: SpeechResolverConfig

Defined in: [packages/agentos/src/speech/types.ts:202](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L202)

Configuration for the speech provider resolver.

## Properties

### stt?

> `optional` **stt**: `object`

Defined in: [packages/agentos/src/speech/types.ts:203](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L203)

#### fallback?

> `optional` **fallback**: `boolean`

#### preferred?

> `optional` **preferred**: `string`[]

***

### tts?

> `optional` **tts**: `object`

Defined in: [packages/agentos/src/speech/types.ts:207](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L207)

#### fallback?

> `optional` **fallback**: `boolean`

#### preferred?

> `optional` **preferred**: `string`[]

#### voice?

> `optional` **voice**: `string`

***

### wakeWord?

> `optional` **wakeWord**: `object`

Defined in: [packages/agentos/src/speech/types.ts:212](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L212)

#### keywords?

> `optional` **keywords**: `string`[]

#### provider?

> `optional` **provider**: `string`

#### sensitivity?

> `optional` **sensitivity**: `number`
