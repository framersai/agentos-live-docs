# Class: ForgeStatsAggregator

Defined in: [packages/agentos/src/emergent/ForgeStatsAggregator.ts:82](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/ForgeStatsAggregator.ts#L82)

Aggregator for forge outcomes across a single run. No dependency on
the cost tracker or any consumer-specific types — consumers compose
it into whatever telemetry layer they already have.

Typical wiring: the consumer's forge capture callback calls
[recordAttempt](#recordattempt) with the outcome fields, then embeds
[snapshot](#snapshot) under a `forgeStats` key in whatever payload the
consumer ships to clients.

## Constructors

### Constructor

> **new ForgeStatsAggregator**(): `ForgeStatsAggregator`

#### Returns

`ForgeStatsAggregator`

## Methods

### recordAttempt()

> **recordAttempt**(`approved`, `confidence`, `toolName?`, `errorReason?`): `void`

Defined in: [packages/agentos/src/emergent/ForgeStatsAggregator.ts:102](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/ForgeStatsAggregator.ts#L102)

Record one forge attempt's outcome.

#### Parameters

##### approved

`boolean`

`true` when the judge approved; `false` for shape-check
  or judge rejections.

##### confidence

`number`

Judge's confidence score for approved tools. Summed
  into `approvedConfidenceSum` (skipped for rejections so rejection
  confidence does not dilute the average).

##### toolName?

`string`

Optional tool name. When provided, tracks unique-tool
  metrics (eventually-approved vs terminally-rejected) rather than
  raw attempt counts.

##### errorReason?

`string`

Optional rejection-reason string. On a rejected
  attempt, passed through [classifyForgeRejection](../functions/classifyForgeRejection.md) and binned
  into `rejectionReasons`.

#### Returns

`void`

***

### reset()

> **reset**(): `void`

Defined in: [packages/agentos/src/emergent/ForgeStatsAggregator.ts:138](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/ForgeStatsAggregator.ts#L138)

Clear all accumulated state. Useful when the aggregator is reused
across multiple runs in one process.

#### Returns

`void`

***

### snapshot()

> **snapshot**(): [`ForgeStats`](../interfaces/ForgeStats.md)

Defined in: [packages/agentos/src/emergent/ForgeStatsAggregator.ts:127](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/ForgeStatsAggregator.ts#L127)

Build a plain-object snapshot of current stats. Safe to JSON-serialize
and ship to clients. Returns a shallow copy so callers can mutate
without affecting the aggregator's internal state.

#### Returns

[`ForgeStats`](../interfaces/ForgeStats.md)
