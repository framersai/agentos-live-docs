# Interface: AgencyMemoryRetentionPolicy

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:100](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/AgencyTypes.ts#L100)

Retention policy for agency shared memory.

## Properties

### evictionStrategy?

> `optional` **evictionStrategy**: `"oldest_first"` \| `"least_accessed"` \| `"lowest_importance"`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:108](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/AgencyTypes.ts#L108)

Strategy for eviction when limits are reached

***

### maxAgeDays?

> `optional` **maxAgeDays**: `number`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:102](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/AgencyTypes.ts#L102)

Maximum age of documents in days before eviction

***

### maxDocuments?

> `optional` **maxDocuments**: `number`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:104](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/AgencyTypes.ts#L104)

Maximum number of documents to retain

***

### maxStorageBytes?

> `optional` **maxStorageBytes**: `number`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:106](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/AgencyTypes.ts#L106)

Maximum total storage in bytes
