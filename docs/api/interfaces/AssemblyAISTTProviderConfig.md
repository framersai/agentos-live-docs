# Interface: AssemblyAISTTProviderConfig

Defined in: [packages/agentos/src/hearing/providers/AssemblyAISTTProvider.ts:14](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/hearing/providers/AssemblyAISTTProvider.ts#L14)

Configuration for the [AssemblyAISTTProvider](../classes/AssemblyAISTTProvider.md).

## See

[AssemblyAISTTProvider](../classes/AssemblyAISTTProvider.md) for usage examples

## Properties

### apiKey

> **apiKey**: `string`

Defined in: [packages/agentos/src/hearing/providers/AssemblyAISTTProvider.ts:20](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/hearing/providers/AssemblyAISTTProvider.ts#L20)

AssemblyAI API key used for authentication.
Sent as the `Authorization` header value (without a prefix like "Bearer").
Obtain from https://www.assemblyai.com/dashboard/account

***

### fetchImpl()?

> `optional` **fetchImpl**: \{(`input`, `init?`): `Promise`\<`Response`\>; (`input`, `init?`): `Promise`\<`Response`\>; \}

Defined in: [packages/agentos/src/hearing/providers/AssemblyAISTTProvider.ts:27](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/hearing/providers/AssemblyAISTTProvider.ts#L27)

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
