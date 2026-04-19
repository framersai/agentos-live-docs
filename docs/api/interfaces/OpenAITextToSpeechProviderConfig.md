# Interface: OpenAITextToSpeechProviderConfig

Defined in: [packages/agentos/src/speech/providers/OpenAITextToSpeechProvider.ts:16](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/speech/providers/OpenAITextToSpeechProvider.ts#L16)

Configuration for the [OpenAITextToSpeechProvider](../classes/OpenAITextToSpeechProvider.md).

## See

 - [OpenAITextToSpeechProvider](../classes/OpenAITextToSpeechProvider.md) for usage examples
 - https://platform.openai.com/docs/api-reference/audio/createSpeech

## Properties

### apiKey

> **apiKey**: `string`

Defined in: [packages/agentos/src/speech/providers/OpenAITextToSpeechProvider.ts:21](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/speech/providers/OpenAITextToSpeechProvider.ts#L21)

OpenAI API key used for authentication.
Sent as `Authorization: Bearer <apiKey>`.

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/speech/providers/OpenAITextToSpeechProvider.ts:28](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/speech/providers/OpenAITextToSpeechProvider.ts#L28)

Base URL for the OpenAI API. Override for proxies, Azure OpenAI, or
compatible third-party endpoints.

#### Default

```ts
'https://api.openai.com/v1'
```

***

### fetchImpl()?

> `optional` **fetchImpl**: \{(`input`, `init?`): `Promise`\<`Response`\>; (`input`, `init?`): `Promise`\<`Response`\>; \}

Defined in: [packages/agentos/src/speech/providers/OpenAITextToSpeechProvider.ts:46](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/speech/providers/OpenAITextToSpeechProvider.ts#L46)

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

Defined in: [packages/agentos/src/speech/providers/OpenAITextToSpeechProvider.ts:34](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/speech/providers/OpenAITextToSpeechProvider.ts#L34)

Default TTS model. `tts-1` is optimized for real-time, `tts-1-hd` for quality.

#### Default

```ts
'tts-1'
```

***

### voice?

> `optional` **voice**: `string`

Defined in: [packages/agentos/src/speech/providers/OpenAITextToSpeechProvider.ts:40](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/speech/providers/OpenAITextToSpeechProvider.ts#L40)

Default voice identifier. See `OPENAI_VOICES` for available options.

#### Default

```ts
'nova'
```
