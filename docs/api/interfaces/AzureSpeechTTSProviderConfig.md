# Interface: AzureSpeechTTSProviderConfig

Defined in: [packages/agentos/src/speech/providers/AzureSpeechTTSProvider.ts:14](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/providers/AzureSpeechTTSProvider.ts#L14)

Configuration for the [AzureSpeechTTSProvider](../classes/AzureSpeechTTSProvider.md).

## See

 - [AzureSpeechTTSProvider](../classes/AzureSpeechTTSProvider.md) for usage examples
 - https://learn.microsoft.com/azure/ai-services/speech-service/rest-text-to-speech

## Properties

### defaultVoice?

> `optional` **defaultVoice**: `string`

Defined in: [packages/agentos/src/speech/providers/AzureSpeechTTSProvider.ts:39](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/providers/AzureSpeechTTSProvider.ts#L39)

Default voice name to use when none is specified per-request.
Must be a valid Azure voice short-name (e.g. `'en-US-JennyNeural'`).

#### Default

```ts
'en-US-JennyNeural'
```

#### See

https://learn.microsoft.com/azure/ai-services/speech-service/language-support#prebuilt-neural-voices

***

### fetchImpl()?

> `optional` **fetchImpl**: \{(`input`, `init?`): `Promise`\<`Response`\>; (`input`, `init?`): `Promise`\<`Response`\>; \}

Defined in: [packages/agentos/src/speech/providers/AzureSpeechTTSProvider.ts:45](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/providers/AzureSpeechTTSProvider.ts#L45)

Custom fetch implementation for dependency injection in tests.

#### Call Signature

> (`input`, `init?`): `Promise`\<`Response`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/fetch)

##### Parameters

###### input

`RequestInfo` | `URL`

###### init?

`RequestInit`

##### Returns

`Promise`\<`Response`\>

#### Call Signature

> (`input`, `init?`): `Promise`\<`Response`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/fetch)

##### Parameters

###### input

`string` | `Request` | `URL`

###### init?

`RequestInit`

##### Returns

`Promise`\<`Response`\>

#### Default

```ts
globalThis.fetch
```

***

### key

> **key**: `string`

Defined in: [packages/agentos/src/speech/providers/AzureSpeechTTSProvider.ts:21](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/providers/AzureSpeechTTSProvider.ts#L21)

Azure Cognitive Services subscription key.
Sent as the `Ocp-Apim-Subscription-Key` header value.

See `AzureSpeechSTTProviderConfig.key` for the same pattern on STT.

***

### region

> **region**: `string`

Defined in: [packages/agentos/src/speech/providers/AzureSpeechTTSProvider.ts:30](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/providers/AzureSpeechTTSProvider.ts#L30)

Azure region where the Speech resource is deployed, e.g. `'eastus'`,
`'westeurope'`, `'southeastasia'`.

The region determines the REST endpoint hostname:
`https://{region}.tts.speech.microsoft.com`
