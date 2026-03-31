# Interface: MemoryProviderPayload

Defined in: [packages/agentos/src/extensions/types.ts:354](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/extensions/types.ts#L354)

Memory provider payload for custom memory/storage backends.
Providers handle storage and retrieval for agent memory, including
vector/conversational backends and cognitive memory systems.

## Properties

### delete()?

> `optional` **delete**: (`collectionId`, `ids`) => `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/types.ts:379](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/extensions/types.ts#L379)

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

Defined in: [packages/agentos/src/extensions/types.ts:358](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/extensions/types.ts#L358)

Provider description

***

### getStats()?

> `optional` **getStats**: () => `Promise`\<\{ `collections`: `number`; `documents`: `number`; `size`: `number`; \}\>

Defined in: [packages/agentos/src/extensions/types.ts:381](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/extensions/types.ts#L381)

Get provider statistics

#### Returns

`Promise`\<\{ `collections`: `number`; `documents`: `number`; `size`: `number`; \}\>

***

### initialize()

> **initialize**: (`config`) => `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/types.ts:369](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/extensions/types.ts#L369)

Initialize the provider

#### Parameters

##### config

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`void`\>

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/extensions/types.ts:356](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/extensions/types.ts#L356)

Provider name (e.g., 'pinecone', 'weaviate', 'qdrant', 'sql')

***

### query()

> **query**: (`collectionId`, `query`, `options?`) => `Promise`\<`unknown`[]\>

Defined in: [packages/agentos/src/extensions/types.ts:373](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/extensions/types.ts#L373)

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

Defined in: [packages/agentos/src/extensions/types.ts:383](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/extensions/types.ts#L383)

Cleanup/shutdown

#### Returns

`Promise`\<`void`\>

***

### store()

> **store**: (`collectionId`, `data`) => `Promise`\<`string`\>

Defined in: [packages/agentos/src/extensions/types.ts:371](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/extensions/types.ts#L371)

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

> **supportedTypes**: (`"vector"` \| `"conversational"` \| `"episodic"` \| `"semantic"` \| `"procedural"` \| `"prospective"`)[]

Defined in: [packages/agentos/src/extensions/types.ts:360](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/extensions/types.ts#L360)

Memory types this provider supports
