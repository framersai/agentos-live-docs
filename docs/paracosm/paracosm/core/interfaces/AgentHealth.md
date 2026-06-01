# Interface: AgentHealth

Defined in: [apps/paracosm/src/engine/core/state.ts:56](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L56)

## Indexable

\[`key`: `string`\]: `unknown`

Scenario-defined health fields beyond the standard set

## Properties

### alive

> **alive**: `boolean`

Defined in: [apps/paracosm/src/engine/core/state.ts:57](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L57)

***

### boneDensityBase?

> `optional` **boneDensityBase**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:68](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L68)

Immutable starting bone density, captured on first progression
 tick so the decay curve targets a stable baseline rather than
 recursively re-decaying its own output (scenario-specific, used
 by Mars/Lunar physics modules).

***

### boneDensityPct?

> `optional` **boneDensityPct**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:63](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L63)

Bone density percentage (scenario-specific, used by Mars/Lunar)

***

### conditions

> **conditions**: `string`[]

Defined in: [apps/paracosm/src/engine/core/state.ts:61](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L61)

***

### cumulativeRadiationMsv?

> `optional` **cumulativeRadiationMsv**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:70](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L70)

Cumulative radiation exposure in millisieverts (scenario-specific, used by Mars/Lunar)

***

### deathCause?

> `optional` **deathCause**: `string`

Defined in: [apps/paracosm/src/engine/core/state.ts:59](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L59)

***

### deathTime?

> `optional` **deathTime**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:58](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L58)

***

### psychScore

> **psychScore**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:60](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L60)
