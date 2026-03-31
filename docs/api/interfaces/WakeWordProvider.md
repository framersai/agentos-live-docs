# Interface: WakeWordProvider

Defined in: [packages/agentos/src/speech/types.ts:178](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/speech/types.ts#L178)

## Properties

### displayName?

> `readonly` `optional` **displayName**: `string`

Defined in: [packages/agentos/src/speech/types.ts:180](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/speech/types.ts#L180)

***

### id

> `readonly` **id**: `string`

Defined in: [packages/agentos/src/speech/types.ts:179](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/speech/types.ts#L179)

## Methods

### detect()

> **detect**(`frame`, `sampleRate`): [`WakeWordDetection`](WakeWordDetection.md) \| `Promise`\<[`WakeWordDetection`](WakeWordDetection.md) \| `null`\> \| `null`

Defined in: [packages/agentos/src/speech/types.ts:181](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/speech/types.ts#L181)

#### Parameters

##### frame

`Float32Array`

##### sampleRate

`number`

#### Returns

[`WakeWordDetection`](WakeWordDetection.md) \| `Promise`\<[`WakeWordDetection`](WakeWordDetection.md) \| `null`\> \| `null`

***

### dispose()?

> `optional` **dispose**(): `void`

Defined in: [packages/agentos/src/speech/types.ts:183](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/speech/types.ts#L183)

#### Returns

`void`

***

### reset()?

> `optional` **reset**(): `void`

Defined in: [packages/agentos/src/speech/types.ts:182](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/speech/types.ts#L182)

#### Returns

`void`
