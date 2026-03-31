# Interface: AgencySession

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:143](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyTypes.ts#L143)

Represents a collective of GMIs collaborating under a single Agency identity.
Agencies enable multi-agent workflows with shared context and memory.

## Properties

### agencyId

> **agencyId**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:145](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyTypes.ts#L145)

Unique agency identifier

***

### conversationId

> **conversationId**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:149](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyTypes.ts#L149)

Conversation context for this agency

***

### createdAt

> **createdAt**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:151](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyTypes.ts#L151)

ISO timestamp of creation

***

### memoryConfig?

> `optional` **memoryConfig**: [`AgencyMemoryConfig`](AgencyMemoryConfig.md)

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:162](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyTypes.ts#L162)

Shared memory configuration for this agency.

#### See

AgencyMemoryConfig

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:157](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyTypes.ts#L157)

Custom metadata

***

### seats

> **seats**: `Record`\<`string`, [`AgencySeatState`](AgencySeatState.md)\>

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:155](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyTypes.ts#L155)

GMI seats keyed by role ID

***

### updatedAt

> **updatedAt**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:153](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyTypes.ts#L153)

ISO timestamp of last update

***

### workflowId

> **workflowId**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:147](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyTypes.ts#L147)

Associated workflow instance
