# Class: SqlTaskOutcomeTelemetryStore

Defined in: [packages/agentos/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts:50](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts#L50)

SQL-backed persistence for `AgentOSOrchestrator` task outcome KPI windows.
Uses `@framers/sql-storage-adapter` so the same store works across SQLite, Postgres, and WASM adapters.

## Implements

- [`ITaskOutcomeTelemetryStore`](../interfaces/ITaskOutcomeTelemetryStore.md)

## Constructors

### Constructor

> **new SqlTaskOutcomeTelemetryStore**(`config?`): `SqlTaskOutcomeTelemetryStore`

Defined in: [packages/agentos/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts:56](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts#L56)

#### Parameters

##### config?

[`SqlTaskOutcomeTelemetryStoreConfig`](../interfaces/SqlTaskOutcomeTelemetryStoreConfig.md) = `{}`

#### Returns

`SqlTaskOutcomeTelemetryStore`

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts:69](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts#L69)

#### Returns

`Promise`\<`void`\>

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts:62](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts#L62)

#### Returns

`Promise`\<`void`\>

***

### loadWindows()

> **loadWindows**(): `Promise`\<`Record`\<`string`, [`TaskOutcomeKpiWindowEntry`](../type-aliases/TaskOutcomeKpiWindowEntry.md)[]\>\>

Defined in: [packages/agentos/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts:76](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts#L76)

#### Returns

`Promise`\<`Record`\<`string`, [`TaskOutcomeKpiWindowEntry`](../type-aliases/TaskOutcomeKpiWindowEntry.md)[]\>\>

#### Implementation of

[`ITaskOutcomeTelemetryStore`](../interfaces/ITaskOutcomeTelemetryStore.md).[`loadWindows`](../interfaces/ITaskOutcomeTelemetryStore.md#loadwindows)

***

### saveWindow()

> **saveWindow**(`scopeKey`, `entries`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts:102](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/turn-planner/SqlTaskOutcomeTelemetryStore.ts#L102)

#### Parameters

##### scopeKey

`string`

##### entries

[`TaskOutcomeKpiWindowEntry`](../type-aliases/TaskOutcomeKpiWindowEntry.md)[]

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ITaskOutcomeTelemetryStore`](../interfaces/ITaskOutcomeTelemetryStore.md).[`saveWindow`](../interfaces/ITaskOutcomeTelemetryStore.md#savewindow)
