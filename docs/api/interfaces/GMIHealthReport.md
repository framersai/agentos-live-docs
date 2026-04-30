# Interface: GMIHealthReport

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:465](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L465)

A report on the GMI's health, including its sub-components.

## Interface

GMIHealthReport

## Properties

### activeTurnsProcessed?

> `optional` **activeTurnsProcessed**: `number`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:485](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L485)

***

### currentState

> **currentState**: [`GMIPrimeState`](../enumerations/GMIPrimeState.md)

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:470](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L470)

***

### dependenciesStatus?

> `optional` **dependenciesStatus**: `object`[]

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:478](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L478)

#### componentName

> **componentName**: `string`

#### details?

> `optional` **details**: `any`

#### status

> **status**: `"HEALTHY"` \| `"DEGRADED"` \| `"UNHEALTHY"` \| `"ERROR"` \| `"UNKNOWN"`

***

### gmiId

> **gmiId**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:466](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L466)

***

### memoryHealth?

> `optional` **memoryHealth**: `object`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:471](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L471)

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

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:469](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L469)

***

### personaId

> **personaId**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:467](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L467)

***

### recentErrors?

> `optional` **recentErrors**: [`ReasoningTraceEntry`](ReasoningTraceEntry.md)[]

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:483](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L483)

***

### timestamp

> **timestamp**: `Date`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:468](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L468)

***

### uptimeSeconds?

> `optional` **uptimeSeconds**: `number`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:484](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L484)
