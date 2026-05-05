# Interface: TurnArtifact

Defined in: [apps/paracosm/src/runtime/contracts.ts:86](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/contracts.ts#L86)

## Properties

### commanderDecision

> **commanderDecision**: [`CommanderDecision`](CommanderDecision.md)

Defined in: [apps/paracosm/src/runtime/contracts.ts:91](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/contracts.ts#L91)

***

### crisis

> **crisis**: `string`

Defined in: [apps/paracosm/src/runtime/contracts.ts:89](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/contracts.ts#L89)

***

### departmentReports

> **departmentReports**: [`DepartmentReport`](DepartmentReport.md)[]

Defined in: [apps/paracosm/src/runtime/contracts.ts:90](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/contracts.ts#L90)

***

### policyEffectsApplied

> **policyEffectsApplied**: `string`[]

Defined in: [apps/paracosm/src/runtime/contracts.ts:92](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/contracts.ts#L92)

***

### stateSnapshotAfter

> **stateSnapshotAfter**: `object`

Defined in: [apps/paracosm/src/runtime/contracts.ts:108](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/contracts.ts#L108)

Snapshot of the five runtime state bags at the end of the turn,
produced by the kernel. Widened in 0.7.x from the pre-F23
Mars-shape (flat `population`/`morale`/…) to a structural match
of the universal schema's WorldSnapshot: `metrics` for numeric
gauges plus optional `capacities`, `statuses`, `politics`, and
`environment` bags populated when the scenario declares them.
`buildRunArtifact` maps this directly onto per-timepoint
WorldSnapshot objects without flattening.

Back-compat: Mars + lunar scenarios still put population, morale,
foodMonthsReserve, infrastructureModules, scienceOutput, births,
and deaths under `metrics`, so legacy consumers reading
`ta.stateSnapshotAfter.metrics.population` still work.

#### capacities?

> `optional` **capacities**: `Record`\<`string`, `number`\>

Capacity constraints; optional, declared via world.capacities.

#### environment?

> `optional` **environment**: `Record`\<`string`, `string` \| `number` \| `boolean`\>

Environmental conditions; optional, declared via world.environment.

#### metrics

> **metrics**: `Record`\<`string`, `number`\>

Numeric gauges from kernel.state.metrics (the primary bag).

#### politics?

> `optional` **politics**: `Record`\<`string`, `string` \| `number` \| `boolean`\>

Political / social variables; optional, declared via world.politics.

#### statuses?

> `optional` **statuses**: `Record`\<`string`, `string` \| `boolean`\>

Categorical statuses; optional, declared via world.statuses.

***

### time

> **time**: `number`

Defined in: [apps/paracosm/src/runtime/contracts.ts:88](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/contracts.ts#L88)

***

### turn

> **turn**: `number`

Defined in: [apps/paracosm/src/runtime/contracts.ts:87](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/contracts.ts#L87)
