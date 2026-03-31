# Class: AgencyMemoryManager

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:163](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyMemoryManager.ts#L163)

Manages shared RAG memory for Agency collectives.

## Remarks

This manager provides:
- Initialization of dedicated data sources for agencies
- Ingestion with role-based access control
- Cross-GMI context queries with permission checks
- Memory lifecycle management (retention, eviction)

Architecture:
```
AgencyMemoryManager
        │
        ├─► VectorStoreManager (storage backend)
        │
        ├─► AgencyRegistry (session state)
        │
        └─► Per-Agency Collections
             └─► agency-{agencyId}-shared
```

## Constructors

### Constructor

> **new AgencyMemoryManager**(`vectorStoreManager`, `logger?`): `AgencyMemoryManager`

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:187](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyMemoryManager.ts#L187)

Creates a new AgencyMemoryManager instance.

#### Parameters

##### vectorStoreManager

Vector store manager for RAG operations

[`IVectorStoreManager`](../interfaces/IVectorStoreManager.md) | `null`

##### logger?

[`ILogger`](../interfaces/ILogger.md)

Optional logger for diagnostics

#### Returns

`AgencyMemoryManager`

## Methods

### broadcastToAgency()

> **broadcastToAgency**(`agencyId`, `input`, `config?`): `Promise`\<[`AgencyMemoryOperationResult`](../interfaces/AgencyMemoryOperationResult.md)\>

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:688](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyMemoryManager.ts#L688)

Broadcasts context from one GMI to all others in the agency.
This is useful for sharing discoveries, decisions, or important updates.

#### Parameters

##### agencyId

`string`

Target agency

##### input

Broadcast input

###### broadcastType

`"finding"` \| `"decision"` \| `"update"` \| `"request"` \| `"alert"`

###### content

`string`

###### metadata?

`Record`\<`string`, `unknown`\>

###### priority?

`"critical"` \| `"low"` \| `"high"` \| `"normal"`

###### senderGmiId

`string`

###### senderRoleId

`string`

###### targetRoles?

`string`[]

##### config?

[`AgencyMemoryConfig`](../interfaces/AgencyMemoryConfig.md)

Agency memory configuration

#### Returns

`Promise`\<[`AgencyMemoryOperationResult`](../interfaces/AgencyMemoryOperationResult.md)\>

Operation result with broadcast metadata

#### Example

```typescript
await memoryManager.broadcastToAgency(agencyId, {
  content: 'Found critical security vulnerability in auth module',
  senderGmiId: 'security-analyst-gmi',
  senderRoleId: 'security-analyst',
  broadcastType: 'finding',
  priority: 'high',
});
```

***

### cleanupAgencyMemory()

> **cleanupAgencyMemory**(`agencyId`): `Promise`\<[`AgencyMemoryOperationResult`](../interfaces/AgencyMemoryOperationResult.md)\>

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:584](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyMemoryManager.ts#L584)

Cleans up agency memory when agency is removed.

#### Parameters

##### agencyId

`string`

Agency to clean up

#### Returns

`Promise`\<[`AgencyMemoryOperationResult`](../interfaces/AgencyMemoryOperationResult.md)\>

Operation result

***

### getContextFromRoles()

> **getContextFromRoles**(`agencyId`, `options`, `config?`): `Promise`\<[`AgencyMemoryQueryResult`](../interfaces/AgencyMemoryQueryResult.md)\>

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:748](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyMemoryManager.ts#L748)

Gets recent context contributions from specific roles.
Enables GMIs to selectively query context from collaborators.

#### Parameters

##### agencyId

`string`

Target agency

##### options

Query options with role filtering

###### categories?

(`"context"` \| `"summary"` \| `"finding"` \| `"decision"` \| `"communication"`)[]

###### fromRoles

`string`[]

###### limit?

`number`

###### minScore?

`number`

###### requestingGmiId

`string`

###### requestingRoleId

`string`

##### config?

[`AgencyMemoryConfig`](../interfaces/AgencyMemoryConfig.md)

Agency memory configuration

#### Returns

`Promise`\<[`AgencyMemoryQueryResult`](../interfaces/AgencyMemoryQueryResult.md)\>

Query result filtered by contributor roles

#### Example

```typescript
// Get recent findings from the researcher role
const findings = await memoryManager.getContextFromRoles(agencyId, {
  fromRoles: ['researcher', 'analyst'],
  categories: ['finding', 'summary'],
  requestingGmiId: 'coordinator-gmi',
  requestingRoleId: 'coordinator',
  limit: 10,
});
```

***

### getDecisions()

> **getDecisions**(`agencyId`, `options`, `config?`): `Promise`\<[`AgencyMemoryQueryResult`](../interfaces/AgencyMemoryQueryResult.md)\>

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:870](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyMemoryManager.ts#L870)

Gets all decisions made by the agency.

#### Parameters

##### agencyId

`string`

Target agency

##### options

Query options

###### decisionTypes?

(`"escalation"` \| `"consensus"` \| `"delegation"` \| `"resolution"`)[]

###### limit?

`number`

###### requestingGmiId

`string`

###### requestingRoleId

`string`

##### config?

[`AgencyMemoryConfig`](../interfaces/AgencyMemoryConfig.md)

Agency memory configuration

#### Returns

`Promise`\<[`AgencyMemoryQueryResult`](../interfaces/AgencyMemoryQueryResult.md)\>

Query result with decision chunks

***

### getStats()

> **getStats**(`agencyId`): `Promise`\<[`AgencyMemoryStats`](../interfaces/AgencyMemoryStats.md) \| `null`\>

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:528](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyMemoryManager.ts#L528)

Gets statistics for agency shared memory.

#### Parameters

##### agencyId

`string`

Target agency

#### Returns

`Promise`\<[`AgencyMemoryStats`](../interfaces/AgencyMemoryStats.md) \| `null`\>

Memory statistics

***

### ingestToSharedMemory()

> **ingestToSharedMemory**(`agencyId`, `input`, `config?`): `Promise`\<[`AgencyMemoryOperationResult`](../interfaces/AgencyMemoryOperationResult.md)\>

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:297](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyMemoryManager.ts#L297)

Ingests a document to agency shared memory.

#### Parameters

##### agencyId

`string`

Target agency

##### input

[`AgencyMemoryIngestInput`](../interfaces/AgencyMemoryIngestInput.md)

Document to ingest

##### config?

[`AgencyMemoryConfig`](../interfaces/AgencyMemoryConfig.md)

Agency memory configuration

#### Returns

`Promise`\<[`AgencyMemoryOperationResult`](../interfaces/AgencyMemoryOperationResult.md)\>

Operation result

***

### initializeAgencyMemory()

> **initializeAgencyMemory**(`session`): `Promise`\<[`AgencyMemoryOperationResult`](../interfaces/AgencyMemoryOperationResult.md)\>

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:207](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyMemoryManager.ts#L207)

Initializes shared memory for an agency.
Creates dedicated collection and applies configuration.

#### Parameters

##### session

[`AgencySession`](../interfaces/AgencySession.md)

Agency session to initialize memory for

#### Returns

`Promise`\<[`AgencyMemoryOperationResult`](../interfaces/AgencyMemoryOperationResult.md)\>

Operation result

***

### isInitialized()

> **isInitialized**(`agencyId`): `boolean`

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:660](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyMemoryManager.ts#L660)

Checks if agency memory is initialized.

#### Parameters

##### agencyId

`string`

#### Returns

`boolean`

***

### querySharedMemory()

> **querySharedMemory**(`agencyId`, `options`, `config?`): `Promise`\<[`AgencyMemoryQueryResult`](../interfaces/AgencyMemoryQueryResult.md)\>

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:403](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyMemoryManager.ts#L403)

Queries agency shared memory.

#### Parameters

##### agencyId

`string`

Target agency

##### options

[`AgencyMemoryQueryOptions`](../interfaces/AgencyMemoryQueryOptions.md)

Query options

##### config?

[`AgencyMemoryConfig`](../interfaces/AgencyMemoryConfig.md)

Agency memory configuration

#### Returns

`Promise`\<[`AgencyMemoryQueryResult`](../interfaces/AgencyMemoryQueryResult.md)\>

Query result with retrieved chunks

***

### recordDecision()

> **recordDecision**(`agencyId`, `decision`, `config?`): `Promise`\<[`AgencyMemoryOperationResult`](../interfaces/AgencyMemoryOperationResult.md)\>

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:823](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyMemoryManager.ts#L823)

Records a decision made by the agency for future reference.

#### Parameters

##### agencyId

`string`

Target agency

##### decision

Decision details

###### affectedRoles?

`string`[]

###### content

`string`

###### decisionMakerId

`string`

###### decisionMakerRoleId

`string`

###### decisionType

`"escalation"` \| `"consensus"` \| `"delegation"` \| `"resolution"`

###### metadata?

`Record`\<`string`, `unknown`\>

###### rationale?

`string`

##### config?

[`AgencyMemoryConfig`](../interfaces/AgencyMemoryConfig.md)

Agency memory configuration

#### Returns

`Promise`\<[`AgencyMemoryOperationResult`](../interfaces/AgencyMemoryOperationResult.md)\>

Operation result

***

### shareSynthesis()

> **shareSynthesis**(`agencyId`, `summary`, `config?`): `Promise`\<[`AgencyMemoryOperationResult`](../interfaces/AgencyMemoryOperationResult.md)\>

Defined in: [packages/agentos/src/agents/agency/AgencyMemoryManager.ts:781](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/agents/agency/AgencyMemoryManager.ts#L781)

Shares a synthesis or summary across all GMIs in the agency.
Typically used by coordinator or synthesizer roles.

#### Parameters

##### agencyId

`string`

Target agency

##### summary

Summary content and metadata

###### content

`string`

###### metadata?

`Record`\<`string`, `unknown`\>

###### sourceRoles?

`string`[]

###### summaryType

`"interim"` \| `"final"` \| `"action_items"` \| `"consensus"`

###### synthesizerId

`string`

###### synthesizerRoleId

`string`

##### config?

[`AgencyMemoryConfig`](../interfaces/AgencyMemoryConfig.md)

Agency memory configuration

#### Returns

`Promise`\<[`AgencyMemoryOperationResult`](../interfaces/AgencyMemoryOperationResult.md)\>

Operation result
