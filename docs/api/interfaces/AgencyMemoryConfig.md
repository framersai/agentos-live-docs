# Interface: AgencyMemoryConfig

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:54](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/agents/agency/AgencyTypes.ts#L54)

Configuration for agency-level shared RAG memory.
Enables GMIs within an agency to share context and collaborate effectively.

## Properties

### autoIngestCommunications?

> `optional` **autoIngestCommunications**: `boolean`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:84](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/agents/agency/AgencyTypes.ts#L84)

Automatically ingest cross-GMI communications to shared memory.

#### Default

```ts
false
```

***

### enabled

> **enabled**: `boolean`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:60](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/agents/agency/AgencyTypes.ts#L60)

Enable shared RAG memory for the agency.
When enabled, all GMIs in the agency can read/write to shared collections.

#### Default

```ts
false
```

***

### readRoles?

> `optional` **readRoles**: `string`[]

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:78](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/agents/agency/AgencyTypes.ts#L78)

Control which roles can read from shared memory.
If empty/undefined, all roles can read.

***

### retentionPolicy?

> `optional` **retentionPolicy**: [`AgencyMemoryRetentionPolicy`](AgencyMemoryRetentionPolicy.md)

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:89](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/agents/agency/AgencyTypes.ts#L89)

Retention policy for shared memory documents.

***

### scoping?

> `optional` **scoping**: [`AgencyMemoryScopingConfig`](AgencyMemoryScopingConfig.md)

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:94](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/agents/agency/AgencyTypes.ts#L94)

Memory scoping configuration.

***

### sharedDataSourceId?

> `optional` **sharedDataSourceId**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:66](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/agents/agency/AgencyTypes.ts#L66)

Dedicated data source ID for agency shared memory.
Auto-generated if not provided when enabled.

***

### writeRoles?

> `optional` **writeRoles**: `string`[]

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:72](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/agents/agency/AgencyTypes.ts#L72)

Control which roles can write to shared memory.
If empty/undefined, all roles can write.
