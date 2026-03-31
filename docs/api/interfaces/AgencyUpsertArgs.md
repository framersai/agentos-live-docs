# Interface: AgencyUpsertArgs

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:172](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/agents/agency/AgencyTypes.ts#L172)

Arguments for creating or updating an agency session.

## Properties

### agencyId?

> `optional` **agencyId**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:178](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/agents/agency/AgencyTypes.ts#L178)

Explicit agency ID (auto-generated if omitted)

***

### conversationId

> **conversationId**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:176](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/agents/agency/AgencyTypes.ts#L176)

Conversation context

***

### memoryConfig?

> `optional` **memoryConfig**: [`AgencyMemoryConfig`](AgencyMemoryConfig.md)

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:182](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/agents/agency/AgencyTypes.ts#L182)

Shared memory configuration

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:180](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/agents/agency/AgencyTypes.ts#L180)

Custom metadata

***

### workflowId

> **workflowId**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:174](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/agents/agency/AgencyTypes.ts#L174)

Associated workflow instance
