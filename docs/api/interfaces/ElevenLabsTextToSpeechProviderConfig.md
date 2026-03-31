# Interface: ElevenLabsTextToSpeechProviderConfig

Defined in: [packages/agentos/src/speech/providers/ElevenLabsTextToSpeechProvider.ts:14](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/providers/ElevenLabsTextToSpeechProvider.ts#L14)

Configuration for the [ElevenLabsTextToSpeechProvider](../classes/ElevenLabsTextToSpeechProvider.md).

## See

 - [ElevenLabsTextToSpeechProvider](../classes/ElevenLabsTextToSpeechProvider.md) for usage examples
 - https://docs.elevenlabs.io/api-reference/text-to-speech

## Properties

### apiKey

> **apiKey**: `string`

Defined in: [packages/agentos/src/speech/providers/ElevenLabsTextToSpeechProvider.ts:19](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/providers/ElevenLabsTextToSpeechProvider.ts#L19)

ElevenLabs API key used for authentication.
Sent as the `xi-api-key` header value (not Bearer-style auth).

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/speech/providers/ElevenLabsTextToSpeechProvider.ts:25](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/providers/ElevenLabsTextToSpeechProvider.ts#L25)

Base URL for the ElevenLabs API. Override for proxies or self-hosted instances.

#### Default

```ts
'https://api.elevenlabs.io/v1'
```

***

### fetchImpl()?

> `optional` **fetchImpl**: \{(`input`, `init?`): `Promise`\<`Response`\>; (`input`, `init?`): `Promise`\<`Response`\>; \}

Defined in: [packages/agentos/src/speech/providers/ElevenLabsTextToSpeechProvider.ts:43](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/providers/ElevenLabsTextToSpeechProvider.ts#L43)

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

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/speech/providers/ElevenLabsTextToSpeechProvider.ts:37](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/providers/ElevenLabsTextToSpeechProvider.ts#L37)

Default model ID for synthesis.

#### Default

```ts
'eleven_multilingual_v2'
```

***

### voiceId?

> `optional` **voiceId**: `string`

Defined in: [packages/agentos/src/speech/providers/ElevenLabsTextToSpeechProvider.ts:31](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/providers/ElevenLabsTextToSpeechProvider.ts#L31)

Default voice ID. ElevenLabs uses opaque IDs (not human-readable names).

#### Default

```ts
'EXAVITQu4vr4xnSDxMaL' (the "Sarah" voice)
```
