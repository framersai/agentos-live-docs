# Class: SpeechProviderRegistry

Defined in: [packages/agentos/src/speech/SpeechProviderRegistry.ts:9](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/SpeechProviderRegistry.ts#L9)

## Constructors

### Constructor

> **new SpeechProviderRegistry**(): `SpeechProviderRegistry`

#### Returns

`SpeechProviderRegistry`

## Methods

### getSttProvider()

> **getSttProvider**(`id`): [`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md) \| `undefined`

Defined in: [packages/agentos/src/speech/SpeechProviderRegistry.ts:31](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/SpeechProviderRegistry.ts#L31)

#### Parameters

##### id

`string`

#### Returns

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md) \| `undefined`

***

### getTtsProvider()

> **getTtsProvider**(`id`): [`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md) \| `undefined`

Defined in: [packages/agentos/src/speech/SpeechProviderRegistry.ts:35](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/SpeechProviderRegistry.ts#L35)

#### Parameters

##### id

`string`

#### Returns

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md) \| `undefined`

***

### getVadProvider()

> **getVadProvider**(`id`): [`SpeechVadProvider`](../interfaces/SpeechVadProvider.md) \| `undefined`

Defined in: [packages/agentos/src/speech/SpeechProviderRegistry.ts:39](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/SpeechProviderRegistry.ts#L39)

#### Parameters

##### id

`string`

#### Returns

[`SpeechVadProvider`](../interfaces/SpeechVadProvider.md) \| `undefined`

***

### getWakeWordProvider()

> **getWakeWordProvider**(`id`): [`WakeWordProvider`](../interfaces/WakeWordProvider.md) \| `undefined`

Defined in: [packages/agentos/src/speech/SpeechProviderRegistry.ts:43](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/SpeechProviderRegistry.ts#L43)

#### Parameters

##### id

`string`

#### Returns

[`WakeWordProvider`](../interfaces/WakeWordProvider.md) \| `undefined`

***

### list()

> **list**(`kind`): ([`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md) \| [`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md) \| [`SpeechVadProvider`](../interfaces/SpeechVadProvider.md) \| [`WakeWordProvider`](../interfaces/WakeWordProvider.md))[]

Defined in: [packages/agentos/src/speech/SpeechProviderRegistry.ts:47](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/SpeechProviderRegistry.ts#L47)

#### Parameters

##### kind

[`SpeechProviderKind`](../type-aliases/SpeechProviderKind.md)

#### Returns

([`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md) \| [`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md) \| [`SpeechVadProvider`](../interfaces/SpeechVadProvider.md) \| [`WakeWordProvider`](../interfaces/WakeWordProvider.md))[]

***

### registerSttProvider()

> **registerSttProvider**(`provider`): `void`

Defined in: [packages/agentos/src/speech/SpeechProviderRegistry.ts:15](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/SpeechProviderRegistry.ts#L15)

#### Parameters

##### provider

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md)

#### Returns

`void`

***

### registerTtsProvider()

> **registerTtsProvider**(`provider`): `void`

Defined in: [packages/agentos/src/speech/SpeechProviderRegistry.ts:19](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/SpeechProviderRegistry.ts#L19)

#### Parameters

##### provider

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md)

#### Returns

`void`

***

### registerVadProvider()

> **registerVadProvider**(`provider`): `void`

Defined in: [packages/agentos/src/speech/SpeechProviderRegistry.ts:23](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/SpeechProviderRegistry.ts#L23)

#### Parameters

##### provider

[`SpeechVadProvider`](../interfaces/SpeechVadProvider.md)

#### Returns

`void`

***

### registerWakeWordProvider()

> **registerWakeWordProvider**(`provider`): `void`

Defined in: [packages/agentos/src/speech/SpeechProviderRegistry.ts:27](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/SpeechProviderRegistry.ts#L27)

#### Parameters

##### provider

[`WakeWordProvider`](../interfaces/WakeWordProvider.md)

#### Returns

`void`
