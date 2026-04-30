# Interface: AssemblyAISTTProviderConfig

Defined in: [packages/agentos/src/hearing/providers/AssemblyAISTTProvider.ts:15](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/providers/AssemblyAISTTProvider.ts#L15)

Configuration for the [AssemblyAISTTProvider](../classes/AssemblyAISTTProvider.md).

## See

[AssemblyAISTTProvider](../classes/AssemblyAISTTProvider.md) for usage examples

## Properties

### apiKey

> **apiKey**: `string`

Defined in: [packages/agentos/src/hearing/providers/AssemblyAISTTProvider.ts:21](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/providers/AssemblyAISTTProvider.ts#L21)

AssemblyAI API key used for authentication.
Sent as the `Authorization` header value (without a prefix like "Bearer").
Obtain from https://www.assemblyai.com/dashboard/account

***

### fetchImpl()?

> `optional` **fetchImpl**: \{(`input`, `init?`): `Promise`\<`Response`\>; (`input`, `init?`): `Promise`\<`Response`\>; \}

Defined in: [packages/agentos/src/hearing/providers/AssemblyAISTTProvider.ts:28](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/providers/AssemblyAISTTProvider.ts#L28)

Custom fetch implementation for dependency injection in tests.
When omitted, the global `fetch` is used.

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
