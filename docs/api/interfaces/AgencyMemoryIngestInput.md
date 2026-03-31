# Interface: AgencyMemoryIngestInput

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:50](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyMemoryManager.ts#L50)

Input for ingesting documents to agency shared memory.

## Properties

### category?

> `optional` **category**: `"context"` \| `"summary"` \| `"finding"` \| `"decision"` \| `"communication"`

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:58](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyMemoryManager.ts#L58)

Document category

***

### content

> **content**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:52](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyMemoryManager.ts#L52)

Document content

***

### contributorGmiId

> **contributorGmiId**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:54](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyMemoryManager.ts#L54)

GMI that contributed this content

***

### contributorRoleId

> **contributorRoleId**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:56](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyMemoryManager.ts#L56)

Role of the contributing GMI

***

### embedding?

> `optional` **embedding**: `number`[]

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:62](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyMemoryManager.ts#L62)

Optional pre-computed embedding

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:60](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyMemoryManager.ts#L60)

Additional metadata
