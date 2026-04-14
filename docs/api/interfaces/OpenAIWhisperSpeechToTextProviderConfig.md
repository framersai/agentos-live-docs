# Interface: OpenAIWhisperSpeechToTextProviderConfig

Defined in: [packages/agentos/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts:17](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts#L17)

Configuration for the [OpenAIWhisperSpeechToTextProvider](../classes/OpenAIWhisperSpeechToTextProvider.md).

## See

 - [OpenAIWhisperSpeechToTextProvider](../classes/OpenAIWhisperSpeechToTextProvider.md) for usage examples
 - https://platform.openai.com/docs/api-reference/audio/createTranscription

## Properties

### apiKey

> **apiKey**: `string`

Defined in: [packages/agentos/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts:22](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts#L22)

OpenAI API key used for authentication.
Sent as `Authorization: Bearer <apiKey>` in the request header.

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts:29](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts#L29)

Base URL for the OpenAI API. Override for proxies, Azure OpenAI, or
compatible third-party endpoints.

#### Default

```ts
'https://api.openai.com/v1'
```

***

### fetchImpl()?

> `optional` **fetchImpl**: \{(`input`, `init?`): `Promise`\<`Response`\>; (`input`, `init?`): `Promise`\<`Response`\>; \}

Defined in: [packages/agentos/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts:41](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts#L41)

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

Defined in: [packages/agentos/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts:35](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/hearing/providers/OpenAIWhisperSpeechToTextProvider.ts#L35)

Default Whisper model to use for transcription.

#### Default

```ts
'whisper-1'
```
