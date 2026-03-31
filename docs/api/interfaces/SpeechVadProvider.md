# Interface: SpeechVadProvider

Defined in: [packages/agentos/src/speech/types.ts:162](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/types.ts#L162)

## Properties

### displayName?

> `readonly` `optional` **displayName**: `string`

Defined in: [packages/agentos/src/speech/types.ts:164](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/types.ts#L164)

***

### id

> `readonly` **id**: `string`

Defined in: [packages/agentos/src/speech/types.ts:163](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/types.ts#L163)

## Methods

### dispose()?

> `optional` **dispose**(): `void`

Defined in: [packages/agentos/src/speech/types.ts:168](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/types.ts#L168)

#### Returns

`void`

***

### getNoiseProfile()?

> `optional` **getNoiseProfile**(): [`NoiseProfile`](NoiseProfile.md) \| `null`

Defined in: [packages/agentos/src/speech/types.ts:167](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/types.ts#L167)

#### Returns

[`NoiseProfile`](NoiseProfile.md) \| `null`

***

### processFrame()

> **processFrame**(`frame`): [`SpeechVadDecision`](SpeechVadDecision.md)

Defined in: [packages/agentos/src/speech/types.ts:165](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/types.ts#L165)

#### Parameters

##### frame

`Float32Array`

#### Returns

[`SpeechVadDecision`](SpeechVadDecision.md)

***

### reset()

> **reset**(): `void`

Defined in: [packages/agentos/src/speech/types.ts:166](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/types.ts#L166)

#### Returns

`void`
