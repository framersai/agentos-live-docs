# Interface: SimulationState

Defined in: [apps/paracosm/src/engine/core/state.ts:217](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L217)

## Properties

### agents

> **agents**: [`Agent`](Agent.md)[]

Defined in: [apps/paracosm/src/engine/core/state.ts:229](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L229)

***

### environment

> **environment**: `Record`\<`string`, `number` \| `string` \| `boolean`\>

Defined in: [apps/paracosm/src/engine/core/state.ts:244](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L244)

Environment conditions from `world.environment` declarations
(external context: market growth pct, radiation, depth, etc.).
Keys are scenario-declared; always present (empty object when
the scenario declares no environment fields).

***

### eventLog

> **eventLog**: [`TurnEvent`](TurnEvent.md)[]

Defined in: [apps/paracosm/src/engine/core/state.ts:245](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L245)

***

### metadata

> **metadata**: [`SimulationMetadata`](SimulationMetadata.md)

Defined in: [apps/paracosm/src/engine/core/state.ts:218](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L218)

***

### metrics

> **metrics**: [`WorldMetrics`](WorldMetrics.md)

Defined in: [apps/paracosm/src/engine/core/state.ts:228](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L228)

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

Defined in: [apps/paracosm/src/engine/core/state.ts:230](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L230)

***

### statuses

> **statuses**: `Record`\<`string`, `string` \| `boolean`\>

Defined in: [apps/paracosm/src/engine/core/state.ts:237](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L237)

Categorical state from `world.statuses` declarations
(governance state, faction alignment, funding round, etc.).
Keys are scenario-declared; always present (empty object when
the scenario declares no statuses).
