# Class: SpeechRuntime

Defined in: [packages/agentos/src/speech/SpeechRuntime.ts:28](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/SpeechRuntime.ts#L28)

## Constructors

### Constructor

> **new SpeechRuntime**(`config?`): `SpeechRuntime`

Defined in: [packages/agentos/src/speech/SpeechRuntime.ts:36](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/SpeechRuntime.ts#L36)

#### Parameters

##### config?

[`SpeechRuntimeConfig`](../interfaces/SpeechRuntimeConfig.md) = `{}`

#### Returns

`SpeechRuntime`

## Properties

### resolver

> `readonly` **resolver**: [`SpeechProviderResolver`](SpeechProviderResolver.md)

Defined in: [packages/agentos/src/speech/SpeechRuntime.ts:34](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/SpeechRuntime.ts#L34)

Prefer resolver-based provider resolution over direct registry lookups.

## Methods

### createSession()

> **createSession**(`config?`): [`SpeechSession`](SpeechSession.md)

Defined in: [packages/agentos/src/speech/SpeechRuntime.ts:167](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/SpeechRuntime.ts#L167)

#### Parameters

##### config?

[`SpeechRuntimeSessionConfig`](../interfaces/SpeechRuntimeSessionConfig.md) = `{}`

#### Returns

[`SpeechSession`](SpeechSession.md)

***

### getProvider()

> **getProvider**(`id`): [`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md) \| [`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md) \| [`SpeechVadProvider`](../interfaces/SpeechVadProvider.md) \| [`WakeWordProvider`](../interfaces/WakeWordProvider.md) \| `undefined`

Defined in: [packages/agentos/src/speech/SpeechRuntime.ts:192](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/SpeechRuntime.ts#L192)

#### Parameters

##### id

`string`

#### Returns

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md) \| [`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md) \| [`SpeechVadProvider`](../interfaces/SpeechVadProvider.md) \| [`WakeWordProvider`](../interfaces/WakeWordProvider.md) \| `undefined`

***

### getProviderRegistry()

> **getProviderRegistry**(): [`SpeechProviderRegistry`](SpeechProviderRegistry.md)

Defined in: [packages/agentos/src/speech/SpeechRuntime.ts:96](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/SpeechRuntime.ts#L96)

#### Returns

[`SpeechProviderRegistry`](SpeechProviderRegistry.md)

***

### getSTT()

> **getSTT**(`requirements?`): [`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md) \| `undefined`

Defined in: [packages/agentos/src/speech/SpeechRuntime.ts:147](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/SpeechRuntime.ts#L147)

Resolve an STT provider via the new [SpeechProviderResolver](SpeechProviderResolver.md).
Returns `undefined` instead of throwing when no provider matches.

#### Parameters

##### requirements?

[`ProviderRequirements`](../interfaces/ProviderRequirements.md)

#### Returns

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md) \| `undefined`

***

### getTTS()

> **getTTS**(`requirements?`): [`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md) \| `undefined`

Defined in: [packages/agentos/src/speech/SpeechRuntime.ts:159](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/SpeechRuntime.ts#L159)

Resolve a TTS provider via the new [SpeechProviderResolver](SpeechProviderResolver.md).
Returns `undefined` instead of throwing when no provider matches.

#### Parameters

##### requirements?

[`ProviderRequirements`](../interfaces/ProviderRequirements.md)

#### Returns

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md) \| `undefined`

***

### hydrateFromExtensionManager()

> **hydrateFromExtensionManager**(`manager`): `void`

Defined in: [packages/agentos/src/speech/SpeechRuntime.ts:116](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/SpeechRuntime.ts#L116)

#### Parameters

##### manager

[`ExtensionManager`](ExtensionManager.md)

#### Returns

`void`

***

### listProviders()

> **listProviders**(): [`SpeechProviderCatalogEntry`](../interfaces/SpeechProviderCatalogEntry.md) & `object`[]

Defined in: [packages/agentos/src/speech/SpeechRuntime.ts:185](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/SpeechRuntime.ts#L185)

#### Returns

[`SpeechProviderCatalogEntry`](../interfaces/SpeechProviderCatalogEntry.md) & `object`[]

***

### registerSttProvider()

> **registerSttProvider**(`provider`): `void`

Defined in: [packages/agentos/src/speech/SpeechRuntime.ts:100](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/SpeechRuntime.ts#L100)

#### Parameters

##### provider

[`SpeechToTextProvider`](../interfaces/SpeechToTextProvider.md)

#### Returns

`void`

***

### registerTtsProvider()

> **registerTtsProvider**(`provider`): `void`

Defined in: [packages/agentos/src/speech/SpeechRuntime.ts:104](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/SpeechRuntime.ts#L104)

#### Parameters

##### provider

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md)

#### Returns

`void`

***

### registerVadProvider()

> **registerVadProvider**(`provider`): `void`

Defined in: [packages/agentos/src/speech/SpeechRuntime.ts:108](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/SpeechRuntime.ts#L108)

#### Parameters

##### provider

[`SpeechVadProvider`](../interfaces/SpeechVadProvider.md)

#### Returns

`void`

***

### registerWakeWordProvider()

> **registerWakeWordProvider**(`provider`): `void`

Defined in: [packages/agentos/src/speech/SpeechRuntime.ts:112](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/SpeechRuntime.ts#L112)

#### Parameters

##### provider

[`WakeWordProvider`](../interfaces/WakeWordProvider.md)

#### Returns

`void`
