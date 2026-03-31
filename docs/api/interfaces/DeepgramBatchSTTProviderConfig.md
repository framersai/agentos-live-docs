# Interface: DeepgramBatchSTTProviderConfig

Defined in: [packages/agentos/src/hearing/providers/DeepgramBatchSTTProvider.ts:14](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/hearing/providers/DeepgramBatchSTTProvider.ts#L14)

Configuration for the [DeepgramBatchSTTProvider](../classes/DeepgramBatchSTTProvider.md).

## See

[DeepgramBatchSTTProvider](../classes/DeepgramBatchSTTProvider.md) for usage examples

## Properties

### apiKey

> **apiKey**: `string`

Defined in: [packages/agentos/src/hearing/providers/DeepgramBatchSTTProvider.ts:19](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/hearing/providers/DeepgramBatchSTTProvider.ts#L19)

Deepgram API key used for authentication.
Sent as `Authorization: Token <apiKey>` in the request header.

***

### fetchImpl()?

> `optional` **fetchImpl**: \{(`input`, `init?`): `Promise`\<`Response`\>; (`input`, `init?`): `Promise`\<`Response`\>; \}

Defined in: [packages/agentos/src/hearing/providers/DeepgramBatchSTTProvider.ts:41](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/hearing/providers/DeepgramBatchSTTProvider.ts#L41)

Custom fetch implementation for dependency injection in tests.
When omitted, the global `fetch` is used. This allows tests to
intercept HTTP calls without mocking globals.

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

### language?

> `optional` **language**: `string`

Defined in: [packages/agentos/src/hearing/providers/DeepgramBatchSTTProvider.ts:33](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/hearing/providers/DeepgramBatchSTTProvider.ts#L33)

BCP-47 language code, e.g. `'en-US'`, `'fr-FR'`, `'de-DE'`.
When omitted, Deepgram applies automatic language detection.

#### Default

```ts
'en-US' (set at transcribe-time if not configured here)
```

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/hearing/providers/DeepgramBatchSTTProvider.ts:26](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/hearing/providers/DeepgramBatchSTTProvider.ts#L26)

Deepgram model to use for transcription.
See https://developers.deepgram.com/docs/models for available models.

#### Default

```ts
'nova-2'
```
