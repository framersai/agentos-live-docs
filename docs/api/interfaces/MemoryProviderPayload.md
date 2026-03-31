# Interface: MemoryProviderPayload

Defined in: [packages/agentos/src/extensions/types.ts:354](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/extensions/types.ts#L354)

Memory provider payload for custom memory/storage backends.
Providers handle storage and retrieval for agent memory, including
vector/conversational backends and cognitive memory systems.

## Properties

### delete()?

> `optional` **delete**: (`collectionId`, `ids`) => `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/types.ts:380](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/extensions/types.ts#L380)

Delete data

#### Parameters

##### collectionId

`string`

##### ids

`string`[]

#### Returns

`Promise`\<`void`\>

***

### description

> **description**: `string`

Defined in: [packages/agentos/src/extensions/types.ts:358](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/extensions/types.ts#L358)

Provider description

***

### getStats()?

> `optional` **getStats**: () => `Promise`\<\{ `collections`: `number`; `documents`: `number`; `size`: `number`; \}\>

Defined in: [packages/agentos/src/extensions/types.ts:382](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/extensions/types.ts#L382)

Get provider statistics

#### Returns

`Promise`\<\{ `collections`: `number`; `documents`: `number`; `size`: `number`; \}\>

***

### initialize()

> **initialize**: (`config`) => `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/types.ts:370](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/extensions/types.ts#L370)

Initialize the provider

#### Parameters

##### config

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`void`\>

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/extensions/types.ts:356](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/extensions/types.ts#L356)

Provider name (e.g., 'pinecone', 'weaviate', 'qdrant', 'sql')

***

### query()

> **query**: (`collectionId`, `query`, `options?`) => `Promise`\<`unknown`[]\>

Defined in: [packages/agentos/src/extensions/types.ts:374](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/extensions/types.ts#L374)

Query data

#### Parameters

##### collectionId

`string`

##### query

`unknown`

##### options?

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`unknown`[]\>

***

### shutdown()?

> `optional` **shutdown**: () => `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/types.ts:384](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/extensions/types.ts#L384)

Cleanup/shutdown

#### Returns

`Promise`\<`void`\>

***

### store()

> **store**: (`collectionId`, `data`) => `Promise`\<`string`\>

Defined in: [packages/agentos/src/extensions/types.ts:372](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/extensions/types.ts#L372)

Store data

#### Parameters

##### collectionId

`string`

##### data

`unknown`

#### Returns

`Promise`\<`string`\>

***

### supportedTypes

> **supportedTypes**: (`"vector"` \| `"conversational"` \| `"episodic"` \| `"semantic"` \| `"procedural"` \| `"prospective"` \| `"relational"`)[]

Defined in: [packages/agentos/src/extensions/types.ts:360](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/extensions/types.ts#L360)

Memory types this provider supports
