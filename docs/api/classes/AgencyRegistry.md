# Class: AgencyRegistry

Defined in: [packages/agentos/src/agents/agency/AgencyRegistry.ts:45](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/AgencyRegistry.ts#L45)

Tracks the Agencies (multi-GMI collectives) active inside the AgentOS runtime.

## Remarks

The registry is intentionally ephemeral; durable state should be captured via
workflow persistence. For shared memory, use [AgencyMemoryManager](AgencyMemoryManager.md).

## Example

```typescript
const registry = new AgencyRegistry(logger);

// Create agency with shared memory enabled
const session = registry.upsertAgency({
  workflowId: 'workflow-123',
  conversationId: 'conv-456',
  memoryConfig: { enabled: true },
});

// Register GMI seats
registry.registerSeat({
  agencyId: session.agencyId,
  roleId: 'researcher',
  gmiInstanceId: 'gmi-789',
  personaId: 'research-persona',
});
```

## Constructors

### Constructor

> **new AgencyRegistry**(`logger?`): `AgencyRegistry`

Defined in: [packages/agentos/src/agents/agency/AgencyRegistry.ts:56](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/AgencyRegistry.ts#L56)

Creates a new AgencyRegistry instance.

#### Parameters

##### logger?

[`ILogger`](../interfaces/ILogger.md)

Optional logger for diagnostics

#### Returns

`AgencyRegistry`

## Methods

### appendSeatHistory()

> **appendSeatHistory**(`agencyId`, `roleId`, `entry`, `maxEntries?`): [`AgencySeatState`](../interfaces/AgencySeatState.md) \| `undefined`

Defined in: [packages/agentos/src/agents/agency/AgencyRegistry.ts:192](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/AgencyRegistry.ts#L192)

Appends a history entry to the specified seat and returns the updated state.

#### Parameters

##### agencyId

`string`

##### roleId

`string`

##### entry

[`AgencySeatHistoryEntry`](../interfaces/AgencySeatHistoryEntry.md)

##### maxEntries?

`number` = `20`

#### Returns

[`AgencySeatState`](../interfaces/AgencySeatState.md) \| `undefined`

***

### getAgency()

> **getAgency**(`agencyId`): [`AgencySession`](../interfaces/AgencySession.md) \| `undefined`

Defined in: [packages/agentos/src/agents/agency/AgencyRegistry.ts:125](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/AgencyRegistry.ts#L125)

Retrieves an agency session by identifier.

#### Parameters

##### agencyId

`string`

Target Agency identifier.

#### Returns

[`AgencySession`](../interfaces/AgencySession.md) \| `undefined`

The matching agency session or `undefined` when absent.

***

### getAgencyByWorkflow()

> **getAgencyByWorkflow**(`workflowId`): [`AgencySession`](../interfaces/AgencySession.md) \| `undefined`

Defined in: [packages/agentos/src/agents/agency/AgencyRegistry.ts:134](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/AgencyRegistry.ts#L134)

Resolves the agency session associated with a workflow instance (if any).

#### Parameters

##### workflowId

`string`

Workflow instance identifier.

#### Returns

[`AgencySession`](../interfaces/AgencySession.md) \| `undefined`

The agency session mapped to the workflow, if present.

***

### mergeSeatMetadata()

> **mergeSeatMetadata**(`agencyId`, `roleId`, `metadata`): [`AgencySeatState`](../interfaces/AgencySeatState.md) \| `undefined`

Defined in: [packages/agentos/src/agents/agency/AgencyRegistry.ts:210](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/AgencyRegistry.ts#L210)

Merges metadata onto a seat without altering other properties.

#### Parameters

##### agencyId

`string`

##### roleId

`string`

##### metadata

`Record`\<`string`, `unknown`\>

#### Returns

[`AgencySeatState`](../interfaces/AgencySeatState.md) \| `undefined`

***

### registerSeat()

> **registerSeat**(`args`): [`AgencySession`](../interfaces/AgencySession.md)

Defined in: [packages/agentos/src/agents/agency/AgencyRegistry.ts:145](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/AgencyRegistry.ts#L145)

Registers or updates a seat inside the agency.

#### Parameters

##### args

[`AgencySeatRegistrationArgs`](../interfaces/AgencySeatRegistrationArgs.md)

Seat registration payload.

#### Returns

[`AgencySession`](../interfaces/AgencySession.md)

Updated agency session after the seat registration.

#### Throws

When attempting to register against an unknown agency.

***

### removeAgency()

> **removeAgency**(`agencyId`): `boolean`

Defined in: [packages/agentos/src/agents/agency/AgencyRegistry.ts:175](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/AgencyRegistry.ts#L175)

Removes an agency entirely (e.g., when the workflow reaches a terminal state).

#### Parameters

##### agencyId

`string`

Agency identifier to remove.

#### Returns

`boolean`

`true` when the agency existed and was removed.

***

### upsertAgency()

> **upsertAgency**(`args`): [`AgencySession`](../interfaces/AgencySession.md)

Defined in: [packages/agentos/src/agents/agency/AgencyRegistry.ts:76](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/AgencyRegistry.ts#L76)

Creates or updates an agency session associated with a workflow.

#### Parameters

##### args

[`AgencyUpsertArgs`](../interfaces/AgencyUpsertArgs.md)

Upsert payload containing workflow linkage, memory config, and optional metadata.

#### Returns

[`AgencySession`](../interfaces/AgencySession.md)

The upserted agency session.

#### Example

```typescript
const session = registry.upsertAgency({
  workflowId: 'workflow-123',
  conversationId: 'conv-456',
  memoryConfig: {
    enabled: true,
    autoIngestCommunications: true,
  },
});
```
