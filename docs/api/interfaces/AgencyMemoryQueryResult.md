# Interface: AgencyMemoryQueryResult

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:90](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyMemoryManager.ts#L90)

Result of querying agency shared memory.

## Properties

### chunks

> **chunks**: [`AgencyMemoryChunk`](AgencyMemoryChunk.md)[]

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:94](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyMemoryManager.ts#L94)

Retrieved chunks

***

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:100](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyMemoryManager.ts#L100)

Error message if failed

***

### processingTimeMs

> **processingTimeMs**: `number`

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:98](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyMemoryManager.ts#L98)

Query processing time in ms

***

### success

> **success**: `boolean`

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:92](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyMemoryManager.ts#L92)

Whether query succeeded

***

### totalResults

> **totalResults**: `number`

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:96](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyMemoryManager.ts#L96)

Total matching results
