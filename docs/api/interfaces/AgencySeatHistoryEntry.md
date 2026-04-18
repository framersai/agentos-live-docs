# Interface: AgencySeatHistoryEntry

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:33](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyTypes.ts#L33)

Single history entry for seat activity tracking.

## Properties

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:43](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyTypes.ts#L43)

Additional metadata

***

### outputPreview?

> `optional` **outputPreview**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:41](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyTypes.ts#L41)

Preview of task output

***

### status?

> `optional` **status**: `"completed"` \| `"failed"` \| `"pending"` \| `"running"`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:39](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyTypes.ts#L39)

Current status of the task

***

### taskId?

> `optional` **taskId**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:35](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyTypes.ts#L35)

Associated task identifier

***

### timestamp

> **timestamp**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:37](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/agents/agency/AgencyTypes.ts#L37)

ISO timestamp of this entry
