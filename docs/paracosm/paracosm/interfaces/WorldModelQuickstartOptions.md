# Interface: WorldModelQuickstartOptions

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:71](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L71)

Options for [WorldModel.quickstart](../classes/WorldModel.md#quickstart). Every field has a sensible
default; callers typically only set `actorCount`.

## Properties

### actorCount?

> `optional` **actorCount**: `number`

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:73](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L73)

How many leaders the quickstart should run in parallel. Default 3. Range 2..6.

***

### captureSnapshots?

> `optional` **captureSnapshots**: `boolean`

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:82](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L82)

Whether to embed per-turn kernel snapshots so the results are
 fork-eligible. Default true.

***

### maxTurns?

> `optional` **maxTurns**: `number`

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:79](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L79)

Absolute-final turn index for each leader's run. Default: the
 scenario's `setup.defaultTurns`.

***

### model?

> `optional` **model**: `string`

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:87](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L87)

Model for the leader-generation LLM call. Default 'claude-sonnet-4-6'.

***

### provider?

> `optional` **provider**: `"openai"` \| `"anthropic"`

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:85](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L85)

Provider for the leader-generation LLM call and the per-leader
 simulation. Default 'anthropic'.

***

### seed?

> `optional` **seed**: `number`

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:76](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L76)

Scenario-level seed for each leader's run. Default: the scenario's
 `setup.defaultSeed`, else 42.
