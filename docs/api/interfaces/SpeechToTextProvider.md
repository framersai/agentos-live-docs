# Interface: SpeechToTextProvider

Defined in: [packages/agentos/src/speech/types.ts:135](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/speech/types.ts#L135)

## Properties

### displayName?

> `readonly` `optional` **displayName**: `string`

Defined in: [packages/agentos/src/speech/types.ts:137](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/speech/types.ts#L137)

***

### id

> `readonly` **id**: `string`

Defined in: [packages/agentos/src/speech/types.ts:136](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/speech/types.ts#L136)

***

### supportsStreaming?

> `readonly` `optional` **supportsStreaming**: `boolean`

Defined in: [packages/agentos/src/speech/types.ts:138](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/speech/types.ts#L138)

## Methods

### getProviderName()

> **getProviderName**(): `string`

Defined in: [packages/agentos/src/speech/types.ts:143](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/speech/types.ts#L143)

#### Returns

`string`

***

### transcribe()

> **transcribe**(`audio`, `options?`): `Promise`\<[`SpeechTranscriptionResult`](SpeechTranscriptionResult.md)\>

Defined in: [packages/agentos/src/speech/types.ts:139](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/speech/types.ts#L139)

#### Parameters

##### audio

[`SpeechAudioInput`](SpeechAudioInput.md)

##### options?

[`SpeechTranscriptionOptions`](SpeechTranscriptionOptions.md)

#### Returns

`Promise`\<[`SpeechTranscriptionResult`](SpeechTranscriptionResult.md)\>
