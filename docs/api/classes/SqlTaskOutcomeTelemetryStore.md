# Class: SqlTaskOutcomeTelemetryStore

Defined in: [packages/agentos/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts:57](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts#L57)

SQL-backed persistence for `AgentOSOrchestrator` task outcome KPI windows.
Uses `@framers/sql-storage-adapter` so the same store works across SQLite, Postgres, and WASM adapters.

## Implements

- [`ITaskOutcomeTelemetryStore`](../interfaces/ITaskOutcomeTelemetryStore.md)

## Constructors

### Constructor

> **new SqlTaskOutcomeTelemetryStore**(`config?`): `SqlTaskOutcomeTelemetryStore`

Defined in: [packages/agentos/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts:63](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts#L63)

#### Parameters

##### config?

[`SqlTaskOutcomeTelemetryStoreConfig`](../interfaces/SqlTaskOutcomeTelemetryStoreConfig.md) = `{}`

#### Returns

`SqlTaskOutcomeTelemetryStore`

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts:96](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts#L96)

#### Returns

`Promise`\<`void`\>

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts:69](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts#L69)

#### Returns

`Promise`\<`void`\>

***

### loadWindows()

> **loadWindows**(): `Promise`\<`Record`\<`string`, [`TaskOutcomeKpiWindowEntry`](../type-aliases/TaskOutcomeKpiWindowEntry.md)[]\>\>

Defined in: [packages/agentos/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts:103](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts#L103)

#### Returns

`Promise`\<`Record`\<`string`, [`TaskOutcomeKpiWindowEntry`](../type-aliases/TaskOutcomeKpiWindowEntry.md)[]\>\>

#### Implementation of

[`ITaskOutcomeTelemetryStore`](../interfaces/ITaskOutcomeTelemetryStore.md).[`loadWindows`](../interfaces/ITaskOutcomeTelemetryStore.md#loadwindows)

***

### saveWindow()

> **saveWindow**(`scopeKey`, `entries`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts:129](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts#L129)

#### Parameters

##### scopeKey

`string`

##### entries

[`TaskOutcomeKpiWindowEntry`](../type-aliases/TaskOutcomeKpiWindowEntry.md)[]

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ITaskOutcomeTelemetryStore`](../interfaces/ITaskOutcomeTelemetryStore.md).[`saveWindow`](../interfaces/ITaskOutcomeTelemetryStore.md#savewindow)
