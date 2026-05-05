# Interface: SimulationState

Defined in: [apps/paracosm/src/engine/core/state.ts:209](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/core/state.ts#L209)

## Properties

### agents

> **agents**: [`Agent`](Agent.md)[]

Defined in: [apps/paracosm/src/engine/core/state.ts:221](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/core/state.ts#L221)

***

### environment

> **environment**: `Record`\<`string`, `number` \| `string` \| `boolean`\>

Defined in: [apps/paracosm/src/engine/core/state.ts:236](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/core/state.ts#L236)

Environment conditions from `world.environment` declarations
(external context: market growth pct, radiation, depth, etc.).
Keys are scenario-declared; always present (empty object when
the scenario declares no environment fields).

***

### eventLog

> **eventLog**: [`TurnEvent`](TurnEvent.md)[]

Defined in: [apps/paracosm/src/engine/core/state.ts:237](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/core/state.ts#L237)

***

### metadata

> **metadata**: [`SimulationMetadata`](SimulationMetadata.md)

Defined in: [apps/paracosm/src/engine/core/state.ts:210](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/core/state.ts#L210)

***

### metrics

> **metrics**: [`WorldMetrics`](WorldMetrics.md)

Defined in: [apps/paracosm/src/engine/core/state.ts:220](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/core/state.ts#L220)

Numerical world state. The `WorldMetrics` fields below
(`population`, `morale`, `foodMonthsReserve`, `powerKw`, etc.) are
Mars/space heritage conveniences. Any scenario extends the bag
via the `[key: string]: number` index signature without touching
these defaults. Was `colony` pre-0.5.0, then `systems` 0.5.x-0.6.x,
now `metrics` aligning with `WorldSnapshot.metrics` from the
universal schema.

***

### politics

> **politics**: [`WorldPolitics`](WorldPolitics.md)

Defined in: [apps/paracosm/src/engine/core/state.ts:222](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/core/state.ts#L222)

***

### statuses

> **statuses**: `Record`\<`string`, `string` \| `boolean`\>

Defined in: [apps/paracosm/src/engine/core/state.ts:229](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/core/state.ts#L229)

Categorical state from `world.statuses` declarations
(governance state, faction alignment, funding round, etc.).
Keys are scenario-declared; always present (empty object when
the scenario declares no statuses).
