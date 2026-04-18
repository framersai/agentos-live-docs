# Interface: TextToSpeechProvider

Defined in: [packages/agentos/src/speech/types.ts:146](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L146)

## Properties

### displayName?

> `readonly` `optional` **displayName**: `string`

Defined in: [packages/agentos/src/speech/types.ts:148](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L148)

***

### id

> `readonly` **id**: `string`

Defined in: [packages/agentos/src/speech/types.ts:147](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L147)

***

### supportsStreaming?

> `readonly` `optional` **supportsStreaming**: `boolean`

Defined in: [packages/agentos/src/speech/types.ts:149](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L149)

## Methods

### getProviderName()

> **getProviderName**(): `string`

Defined in: [packages/agentos/src/speech/types.ts:151](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L151)

#### Returns

`string`

***

### listAvailableVoices()?

> `optional` **listAvailableVoices**(): `Promise`\<[`SpeechVoice`](SpeechVoice.md)[]\>

Defined in: [packages/agentos/src/speech/types.ts:152](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L152)

#### Returns

`Promise`\<[`SpeechVoice`](SpeechVoice.md)[]\>

***

### synthesize()

> **synthesize**(`text`, `options?`): `Promise`\<[`SpeechSynthesisResult`](SpeechSynthesisResult.md)\>

Defined in: [packages/agentos/src/speech/types.ts:150](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L150)

#### Parameters

##### text

`string`

##### options?

[`SpeechSynthesisOptions`](SpeechSynthesisOptions.md)

#### Returns

`Promise`\<[`SpeechSynthesisResult`](SpeechSynthesisResult.md)\>
