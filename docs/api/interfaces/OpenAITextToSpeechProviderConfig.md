# Interface: OpenAITextToSpeechProviderConfig

Defined in: [packages/agentos/src/speech/providers/OpenAITextToSpeechProvider.ts:14](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/providers/OpenAITextToSpeechProvider.ts#L14)

Configuration for the [OpenAITextToSpeechProvider](../classes/OpenAITextToSpeechProvider.md).

## See

 - [OpenAITextToSpeechProvider](../classes/OpenAITextToSpeechProvider.md) for usage examples
 - https://platform.openai.com/docs/api-reference/audio/createSpeech

## Properties

### apiKey

> **apiKey**: `string`

Defined in: [packages/agentos/src/speech/providers/OpenAITextToSpeechProvider.ts:19](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/providers/OpenAITextToSpeechProvider.ts#L19)

OpenAI API key used for authentication.
Sent as `Authorization: Bearer <apiKey>`.

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/speech/providers/OpenAITextToSpeechProvider.ts:26](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/providers/OpenAITextToSpeechProvider.ts#L26)

Base URL for the OpenAI API. Override for proxies, Azure OpenAI, or
compatible third-party endpoints.

#### Default

```ts
'https://api.openai.com/v1'
```

***

### fetchImpl()?

> `optional` **fetchImpl**: \{(`input`, `init?`): `Promise`\<`Response`\>; (`input`, `init?`): `Promise`\<`Response`\>; \}

Defined in: [packages/agentos/src/speech/providers/OpenAITextToSpeechProvider.ts:44](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/providers/OpenAITextToSpeechProvider.ts#L44)

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

Defined in: [packages/agentos/src/speech/providers/OpenAITextToSpeechProvider.ts:32](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/providers/OpenAITextToSpeechProvider.ts#L32)

Default TTS model. `tts-1` is optimized for real-time, `tts-1-hd` for quality.

#### Default

```ts
'tts-1'
```

***

### voice?

> `optional` **voice**: `string`

Defined in: [packages/agentos/src/speech/providers/OpenAITextToSpeechProvider.ts:38](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/speech/providers/OpenAITextToSpeechProvider.ts#L38)

Default voice identifier. See `OPENAI_VOICES` for available options.

#### Default

```ts
'nova'
```
