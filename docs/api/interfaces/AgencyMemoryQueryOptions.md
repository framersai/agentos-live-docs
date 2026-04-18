# Interface: AgencyMemoryQueryOptions

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:218](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyTypes.ts#L218)

Query options for agency shared memory.

## Properties

### fromRoles?

> `optional` **fromRoles**: `string`[]

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:232](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyTypes.ts#L232)

Filter by specific roles' contributions

***

### includePersonalMemory?

> `optional` **includePersonalMemory**: `boolean`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:230](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyTypes.ts#L230)

Include personal memory in results

***

### query

> **query**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:220](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyTypes.ts#L220)

Query text

***

### requestingGmiId

> **requestingGmiId**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:222](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyTypes.ts#L222)

Requesting GMI instance ID

***

### requestingRoleId

> **requestingRoleId**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:224](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyTypes.ts#L224)

Requesting role ID

***

### threshold?

> `optional` **threshold**: `number`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:228](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyTypes.ts#L228)

Minimum similarity threshold

***

### topK?

> `optional` **topK**: `number`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:226](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyTypes.ts#L226)

Maximum results
