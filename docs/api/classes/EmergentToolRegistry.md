# Class: EmergentToolRegistry

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:155](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentToolRegistry.ts#L155)

Manages the lifecycle of emergent tools across three trust tiers.

The registry stores session-tier tools in an in-memory Map (keyed by tool ID)
and mirrors them to SQLite when available for audit/inspection. Agent/shared
tier tools live in the persisted map and are written to SQLite (when a
storage adapter is provided) or kept in-memory as fallback.

Key responsibilities:
- **Registration**: Accept new tools at a given tier, enforcing config limits.
- **Lookup**: Retrieve tools by ID or filter by tier with optional scope.
- **Usage tracking**: Record invocations and update rolling statistics.
- **Promotion / demotion**: Move tools between tiers with audit logging.
- **Session cleanup**: Bulk-remove all session-scoped tools for a given session.
- **Audit trail**: Log every state change for observability and debugging.

## Example

```ts
const registry = new EmergentToolRegistry({ ...DEFAULT_EMERGENT_CONFIG, enabled: true });
registry.register(tool, 'session');
registry.recordUse(tool.id, { x: 1 }, { y: 2 }, true, 42);
const stats = registry.getUsageStats(tool.id);
```

## Constructors

### Constructor

> **new EmergentToolRegistry**(`config?`, `db?`): `EmergentToolRegistry`

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:191](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentToolRegistry.ts#L191)

Create a new EmergentToolRegistry.

#### Parameters

##### config?

`Partial`\<[`EmergentConfig`](../interfaces/EmergentConfig.md)\> = `{}`

Emergent capability configuration. Missing fields are
  filled from [DEFAULT\_EMERGENT\_CONFIG](../variables/DEFAULT_EMERGENT_CONFIG.md).

##### db?

[`EmergentRegistryStorageAdapter`](../interfaces/EmergentRegistryStorageAdapter.md)

Optional SQLite storage adapter. When provided, agent and
  shared tier tools are persisted to the `agentos_emergent_tools` table.
  When omitted, all tiers use in-memory storage only.

#### Returns

`EmergentToolRegistry`

## Methods

### cleanupSession()

> **cleanupSession**(`sessionId`): `number`

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:650](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentToolRegistry.ts#L650)

Remove all session-tier tools associated with a specific session.

Iterates the session map and deletes every tool whose `source` string
contains the given session ID. Logs a cleanup audit event for each
removed tool.

#### Parameters

##### sessionId

`string`

The session identifier to match against tool `source`
  strings.

#### Returns

`number`

The number of tools removed.

***

### demote()

> **demote**(`toolId`, `reason`): `void`

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:614](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentToolRegistry.ts#L614)

Demote or deactivate a tool.

Marks the tool as inactive by setting a sentinel on its usage stats
(`confidenceScore` set to 0) and logs the demotion event with a reason.

Inactive tools are still retrievable via `get()` but should be filtered
out by callers when building tool lists for the LLM.

#### Parameters

##### toolId

`string`

The ID of the tool to demote.

##### reason

`string`

Human-readable explanation for why the tool is being demoted.

#### Returns

`void`

#### Throws

If the tool is not found.

***

### ensureSchema()

> **ensureSchema**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:227](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentToolRegistry.ts#L227)

Initialize the database schema for emergent tool persistence.

Creates the `agentos_emergent_tools` and `agentos_emergent_audit_log`
tables along with their indexes. Safe to call multiple times — all
statements use `CREATE TABLE IF NOT EXISTS` / `CREATE INDEX IF NOT EXISTS`.

This method is a no-op when no storage adapter was provided.

#### Returns

`Promise`\<`void`\>

#### Throws

If the storage adapter's `exec` or `run` method rejects.

***

### ensureSchemaReady()

> **ensureSchemaReady**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:209](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentToolRegistry.ts#L209)

Idempotent schema readiness guard.

Ensures `ensureSchema()` is called exactly once and all subsequent callers
await the same in-flight promise. This prevents the race condition where
concurrent DB operations start before DDL statements finish.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the schema is ready.

***

### get()

> **get**(`toolId`): [`EmergentTool`](../interfaces/EmergentTool.md) \| `undefined`

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:361](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentToolRegistry.ts#L361)

Retrieve a tool by its unique identifier.

Searches all tiers (session first, then persisted agent/shared).

#### Parameters

##### toolId

`string`

The tool ID to look up.

#### Returns

[`EmergentTool`](../interfaces/EmergentTool.md) \| `undefined`

The tool if found, or `undefined` if no tool with that ID exists.

***

### getAuditLog()

> **getAuditLog**(`toolId?`): [`AuditEntry`](../interfaces/AuditEntry.md)[]

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:681](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentToolRegistry.ts#L681)

Retrieve audit log entries, optionally filtered by tool ID.

#### Parameters

##### toolId?

`string`

When provided, only entries for this tool are returned.

#### Returns

[`AuditEntry`](../interfaces/AuditEntry.md)[]

An array of [AuditEntry](../interfaces/AuditEntry.md) objects in chronological order.

***

### getByTier()

> **getByTier**(`tier`, `scope?`): [`EmergentTool`](../interfaces/EmergentTool.md)[]

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:427](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentToolRegistry.ts#L427)

Get all tools registered at a specific tier, optionally filtered by scope.

#### Parameters

##### tier

[`ToolTier`](../type-aliases/ToolTier.md)

The tier to query (`'session'`, `'agent'`, or `'shared'`).

##### scope?

Optional scope filter. When provided, results are narrowed:
  - `sessionId`: Match tools whose `source` string contains the session ID.
  - `agentId`: Match tools whose `createdBy` equals the agent ID.

###### agentId?

`string`

###### sessionId?

`string`

#### Returns

[`EmergentTool`](../interfaces/EmergentTool.md)[]

An array of matching tools (may be empty).

***

### getUsageStats()

> **getUsageStats**(`toolId`): [`ToolUsageStats`](../interfaces/ToolUsageStats.md) \| `undefined`

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:528](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentToolRegistry.ts#L528)

Retrieve usage statistics for a registered tool.

#### Parameters

##### toolId

`string`

The tool ID to look up.

#### Returns

[`ToolUsageStats`](../interfaces/ToolUsageStats.md) \| `undefined`

The tool's [ToolUsageStats](../interfaces/ToolUsageStats.md), or `undefined` if the tool
  is not registered.

***

### promote()

> **promote**(`toolId`, `targetTier`, `approvedBy?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:553](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentToolRegistry.ts#L553)

Promote a tool to a higher lifecycle tier.

Moves the tool from its current tier to `targetTier`. If the tool was at
session tier, it is removed from the session map and added to the persisted
map. If a storage adapter is available and the target tier is agent or
shared, the tool is persisted to the database.

#### Parameters

##### toolId

`string`

The ID of the tool to promote.

##### targetTier

[`ToolTier`](../type-aliases/ToolTier.md)

The target tier to promote to. Must be strictly higher
  than the tool's current tier.

##### approvedBy?

`string`

Optional identifier of the human or system entity that
  approved the promotion.

#### Returns

`Promise`\<`void`\>

#### Throws

If the tool is not found.

#### Throws

If `targetTier` is not higher than the tool's current tier.

***

### recordUse()

> **recordUse**(`toolId`, `_input`, `_output`, `success`, `executionTimeMs`): `void`

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:476](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentToolRegistry.ts#L476)

Record a tool invocation, updating rolling usage statistics.

Updates the tool's [ToolUsageStats](../interfaces/ToolUsageStats.md) in place:
- Increments `totalUses`.
- Increments `successCount` or `failureCount` based on the `success` flag.
- Recalculates `avgExecutionTimeMs` as a running average.
- Recalculates `confidenceScore` as `successCount / totalUses`.
- Sets `lastUsedAt` to the current ISO-8601 timestamp.

#### Parameters

##### toolId

`string`

The ID of the tool that was invoked.

##### \_input

`unknown`

The input arguments passed to the tool (logged for audit).

##### \_output

`unknown`

The output returned by the tool (logged for audit).

##### success

`boolean`

Whether the invocation completed successfully.

##### executionTimeMs

`number`

Wall-clock execution time in milliseconds.

#### Returns

`void`

#### Throws

If no tool with the given ID is registered.

***

### register()

> **register**(`tool`, `tier`): `void`

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:306](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentToolRegistry.ts#L306)

Register a new emergent tool at the given tier.

Session-tier tools are stored in the in-memory session map and mirrored to
SQLite when available. Agent and shared tier tools are stored in the
persisted map (and written to SQLite when a storage adapter is available).

#### Parameters

##### tool

[`EmergentTool`](../interfaces/EmergentTool.md)

The emergent tool to register. Must have a unique `id`.

##### tier

[`ToolTier`](../type-aliases/ToolTier.md)

The tier to register the tool at. The tool's `tier` property
  is updated to match.

#### Returns

`void`

#### Throws

If the maximum tool count for the target tier is exceeded
  (checked against `maxSessionTools` or `maxAgentTools` from config).

#### Throws

If a tool with the same ID is already registered.

***

### remove()

> **remove**(`toolId`): `boolean`

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:396](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentToolRegistry.ts#L396)

Remove a tool from the registry entirely.

Used to roll back newly forged tools when downstream activation fails.

#### Parameters

##### toolId

`string`

#### Returns

`boolean`

***

### upsert()

> **upsert**(`tool`): `void`

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:371](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentToolRegistry.ts#L371)

Upsert a tool into the registry, replacing any prior in-memory copy.

Used to hydrate persisted/shared tools back into a live runtime so they can
become executable again after process restart or admin promotion.

#### Parameters

##### tool

[`EmergentTool`](../interfaces/EmergentTool.md)

#### Returns

`void`
