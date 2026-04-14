# Interface: AgencyMemoryStats

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:106](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/agents/agency/AgencyMemoryManager.ts#L106)

Statistics for agency memory.

## Properties

### documentsByCategory

> **documentsByCategory**: `Record`\<`string`, `number`\>

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:114](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/agents/agency/AgencyMemoryManager.ts#L114)

Documents by category

***

### documentsByRole

> **documentsByRole**: `Record`\<`string`, `number`\>

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:112](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/agents/agency/AgencyMemoryManager.ts#L112)

Documents by role

***

### lastIngestionAt?

> `optional` **lastIngestionAt**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:116](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/agents/agency/AgencyMemoryManager.ts#L116)

Last ingestion timestamp

***

### totalChunks

> **totalChunks**: `number`

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:110](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/agents/agency/AgencyMemoryManager.ts#L110)

Total chunks

***

### totalDocuments

> **totalDocuments**: `number`

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:108](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/agents/agency/AgencyMemoryManager.ts#L108)

Total documents in shared memory
