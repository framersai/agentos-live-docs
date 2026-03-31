# Interface: AzureSpeechSTTProviderConfig

Defined in: [packages/agentos/src/hearing/providers/AzureSpeechSTTProvider.ts:14](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/hearing/providers/AzureSpeechSTTProvider.ts#L14)

Configuration for the [AzureSpeechSTTProvider](../classes/AzureSpeechSTTProvider.md).

## See

 - [AzureSpeechSTTProvider](../classes/AzureSpeechSTTProvider.md) for usage examples
 - https://learn.microsoft.com/azure/ai-services/speech-service/rest-speech-to-text

## Properties

### fetchImpl()?

> `optional` **fetchImpl**: \{(`input`, `init?`): `Promise`\<`Response`\>; (`input`, `init?`): `Promise`\<`Response`\>; \}

Defined in: [packages/agentos/src/hearing/providers/AzureSpeechSTTProvider.ts:38](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/hearing/providers/AzureSpeechSTTProvider.ts#L38)

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

Defined in: [packages/agentos/src/hearing/providers/AzureSpeechSTTProvider.ts:21](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/hearing/providers/AzureSpeechSTTProvider.ts#L21)

Azure Cognitive Services subscription key.
Sent as the `Ocp-Apim-Subscription-Key` header — this is Azure's
standard authentication mechanism for Cognitive Services REST APIs.
Obtain from the Azure portal under your Speech resource's "Keys and Endpoint".

***

### region

> **region**: `string`

Defined in: [packages/agentos/src/hearing/providers/AzureSpeechSTTProvider.ts:32](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/hearing/providers/AzureSpeechSTTProvider.ts#L32)

Azure region where the Speech resource is deployed, e.g. `'eastus'`,
`'westeurope'`, `'southeastasia'`.

The region determines the REST endpoint hostname:
`https://{region}.stt.speech.microsoft.com`

#### See

https://learn.microsoft.com/azure/ai-services/speech-service/regions
