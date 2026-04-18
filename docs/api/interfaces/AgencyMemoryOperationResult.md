# Interface: AgencyMemoryOperationResult

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:204](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyTypes.ts#L204)

Result of an agency memory operation.

## Properties

### documentsAffected

> **documentsAffected**: `number`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:208](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyTypes.ts#L208)

Number of documents affected

***

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:210](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyTypes.ts#L210)

Error message if failed

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:212](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyTypes.ts#L212)

Operation metadata

***

### success

> **success**: `boolean`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:206](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyTypes.ts#L206)

Whether the operation succeeded
