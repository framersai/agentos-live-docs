# Interface: OpenAIWhisperSpeechToTextProviderConfig

Defined in: [packages/agentos/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts:16](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts#L16)

Configuration for the [OpenAIWhisperSpeechToTextProvider](../classes/OpenAIWhisperSpeechToTextProvider.md).

## See

 - [OpenAIWhisperSpeechToTextProvider](../classes/OpenAIWhisperSpeechToTextProvider.md) for usage examples
 - https://platform.openai.com/docs/api-reference/audio/createTranscription

## Properties

### apiKey

> **apiKey**: `string`

Defined in: [packages/agentos/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts:21](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts#L21)

OpenAI API key used for authentication.
Sent as `Authorization: Bearer <apiKey>` in the request header.

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts:28](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts#L28)

Base URL for the OpenAI API. Override for proxies, Azure OpenAI, or
compatible third-party endpoints.

#### Default

```ts
'https://api.openai.com/v1'
```

***

### fetchImpl()?

> `optional` **fetchImpl**: \{(`input`, `init?`): `Promise`\<`Response`\>; (`input`, `init?`): `Promise`\<`Response`\>; \}

Defined in: [packages/agentos/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts:40](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts#L40)

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

Defined in: [packages/agentos/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts:34](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts#L34)

Default Whisper model to use for transcription.

#### Default

```ts
'whisper-1'
```
