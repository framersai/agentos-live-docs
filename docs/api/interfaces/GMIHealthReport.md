# Interface: GMIHealthReport

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:479](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L479)

A report on the GMI's health, including its sub-components.

## Interface

GMIHealthReport

## Properties

### activeTurnsProcessed?

> `optional` **activeTurnsProcessed**: `number`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:499](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L499)

***

### currentState

> **currentState**: [`GMIPrimeState`](../enumerations/GMIPrimeState.md)

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:484](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L484)

***

### dependenciesStatus?

> `optional` **dependenciesStatus**: `object`[]

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:492](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L492)

#### componentName

> **componentName**: `string`

#### details?

> `optional` **details**: `any`

#### status

> **status**: `"HEALTHY"` \| `"DEGRADED"` \| `"UNHEALTHY"` \| `"ERROR"` \| `"UNKNOWN"`

***

### gmiId

> **gmiId**: `string`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:480](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L480)

***

### memoryHealth?

> `optional` **memoryHealth**: `object`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:485](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L485)

#### issues?

> `optional` **issues**: `object`[]

#### lifecycleManagerStats?

> `optional` **lifecycleManagerStats**: `object`

##### lifecycleManagerStats.details?

> `optional` **details**: `any`

##### lifecycleManagerStats.isHealthy

> **isHealthy**: `boolean`

#### overallStatus

> **overallStatus**: `"DEGRADED"` \| `"ERROR"` \| `"OPERATIONAL"` \| `"LIMITED"`

#### ragSystemStats?

> `optional` **ragSystemStats**: `object`

##### ragSystemStats.details?

> `optional` **details**: `any`

##### ragSystemStats.isHealthy

> **isHealthy**: `boolean`

#### workingMemoryStats?

> `optional` **workingMemoryStats**: `object`

##### Index Signature

\[`key`: `string`\]: `any`

##### workingMemoryStats.itemCount

> **itemCount**: `number`

***

### overallStatus

> **overallStatus**: `"HEALTHY"` \| `"DEGRADED"` \| `"UNHEALTHY"` \| `"ERROR"`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:483](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L483)

***

### personaId

> **personaId**: `string`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:481](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L481)

***

### recentErrors?

> `optional` **recentErrors**: [`ReasoningTraceEntry`](ReasoningTraceEntry.md)[]

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:497](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L497)

***

### timestamp

> **timestamp**: `Date`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:482](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L482)

***

### uptimeSeconds?

> `optional` **uptimeSeconds**: `number`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:498](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L498)
