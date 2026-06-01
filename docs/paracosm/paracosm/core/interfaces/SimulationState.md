# Interface: SimulationState

Defined in: [apps/paracosm/src/engine/core/state.ts:222](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L222)

## Properties

### agents

> **agents**: [`Agent`](Agent.md)[]

Defined in: [apps/paracosm/src/engine/core/state.ts:234](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L234)

***

### environment

> **environment**: `Record`\<`string`, `number` \| `string` \| `boolean`\>

Defined in: [apps/paracosm/src/engine/core/state.ts:249](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L249)

Environment conditions from `world.environment` declarations
(external context: market growth pct, radiation, depth, etc.).
Keys are scenario-declared; always present (empty object when
the scenario declares no environment fields).

***

### eventLog

> **eventLog**: [`TurnEvent`](TurnEvent.md)[]

Defined in: [apps/paracosm/src/engine/core/state.ts:250](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L250)

***

### metadata

> **metadata**: [`SimulationMetadata`](SimulationMetadata.md)

Defined in: [apps/paracosm/src/engine/core/state.ts:223](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L223)

***

### metrics

> **metrics**: [`WorldMetrics`](WorldMetrics.md)

Defined in: [apps/paracosm/src/engine/core/state.ts:233](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L233)

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

Defined in: [apps/paracosm/src/engine/core/state.ts:235](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L235)

***

### statuses

> **statuses**: `Record`\<`string`, `string` \| `boolean`\>

Defined in: [apps/paracosm/src/engine/core/state.ts:242](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L242)

Categorical state from `world.statuses` declarations
(governance state, faction alignment, funding round, etc.).
Keys are scenario-declared; always present (empty object when
the scenario declares no statuses).
