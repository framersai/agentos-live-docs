# Interface: ElevenLabsTextToSpeechProviderConfig

Defined in: [packages/agentos/src/speech/providers/ElevenLabsTextToSpeechProvider.ts:16](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/speech/providers/ElevenLabsTextToSpeechProvider.ts#L16)

Configuration for the [ElevenLabsTextToSpeechProvider](../classes/ElevenLabsTextToSpeechProvider.md).

## See

 - [ElevenLabsTextToSpeechProvider](../classes/ElevenLabsTextToSpeechProvider.md) for usage examples
 - https://docs.elevenlabs.io/api-reference/text-to-speech

## Properties

### apiKey

> **apiKey**: `string`

Defined in: [packages/agentos/src/speech/providers/ElevenLabsTextToSpeechProvider.ts:21](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/speech/providers/ElevenLabsTextToSpeechProvider.ts#L21)

ElevenLabs API key used for authentication.
Sent as the `xi-api-key` header value (not Bearer-style auth).

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/speech/providers/ElevenLabsTextToSpeechProvider.ts:27](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/speech/providers/ElevenLabsTextToSpeechProvider.ts#L27)

Base URL for the ElevenLabs API. Override for proxies or self-hosted instances.

#### Default

```ts
'https://api.elevenlabs.io/v1'
```

***

### fetchImpl()?

> `optional` **fetchImpl**: \{(`input`, `init?`): `Promise`\<`Response`\>; (`input`, `init?`): `Promise`\<`Response`\>; \}

Defined in: [packages/agentos/src/speech/providers/ElevenLabsTextToSpeechProvider.ts:45](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/speech/providers/ElevenLabsTextToSpeechProvider.ts#L45)

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

Defined in: [packages/agentos/src/speech/providers/ElevenLabsTextToSpeechProvider.ts:39](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/speech/providers/ElevenLabsTextToSpeechProvider.ts#L39)

Default model ID for synthesis.

#### Default

```ts
'eleven_multilingual_v2'
```

***

### voiceId?

> `optional` **voiceId**: `string`

Defined in: [packages/agentos/src/speech/providers/ElevenLabsTextToSpeechProvider.ts:33](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/speech/providers/ElevenLabsTextToSpeechProvider.ts#L33)

Default voice ID. ElevenLabs uses opaque IDs (not human-readable names).

#### Default

```ts
'EXAVITQu4vr4xnSDxMaL' (the "Sarah" voice)
```
