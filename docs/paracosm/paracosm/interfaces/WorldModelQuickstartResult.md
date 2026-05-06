# Interface: WorldModelQuickstartResult

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:93](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/world-model/index.ts#L93)

Shape returned by [WorldModel.quickstart](../classes/WorldModel.md#quickstart).

## Properties

### actors

> **actors**: [`ActorConfig`](ActorConfig.md)[]

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:97](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/world-model/index.ts#L97)

The actors the LLM generated for this run.

***

### artifacts

> **artifacts**: `object`[]

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:99](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/world-model/index.ts#L99)

One [RunArtifact](../type-aliases/RunArtifact.md) per actor, in the same order as `actors`.

#### aborted?

> `optional` **aborted**: `boolean`

#### assumptions?

> `optional` **assumptions**: `string`[]

Assumptions held true during the simulation.

#### citations?

> `optional` **citations**: `object`[]

#### cost?

> `optional` **cost**: `object`

##### cost.breakdown?

> `optional` **breakdown**: `Record`\<`string`, `number`\>

Per-site / per-model breakdown: `{ director: 0.12, departments: 0.34 }`.

##### cost.cachedReadTokens?

> `optional` **cachedReadTokens**: `number`

##### cost.cacheSavingsUSD?

> `optional` **cacheSavingsUSD**: `number`

##### cost.inputTokens?

> `optional` **inputTokens**: `number`

##### cost.llmCalls?

> `optional` **llmCalls**: `number`

##### cost.outputTokens?

> `optional` **outputTokens**: `number`

##### cost.totalUSD

> **totalUSD**: `number`

#### decisions?

> `optional` **decisions**: `object`[]

Every decision made during the run — one per commander choice in turn-loop.

#### disclaimer?

> `optional` **disclaimer**: `string`

Scenario-supplied disclaimer (digital-twin simulations use this for medical / professional caveats).

#### finalState?

> `optional` **finalState**: `object`

##### finalState.capacities?

> `optional` **capacities**: `Record`\<`string`, `number`\>

Capacity constraints: life support, housing, budget.

##### finalState.environment?

> `optional` **environment**: `Record`\<`string`, `string` \| `number` \| `boolean`\>

Environmental conditions: weather, radiation, depth, altitude.

##### finalState.metrics

> **metrics**: `Record`\<`string`, `number`\>

Numeric gauges: food, power, population, morale, VO2max, whatever.

##### finalState.politics?

> `optional` **politics**: `Record`\<`string`, `string` \| `number` \| `boolean`\>

Political/social pressures. Values may be numeric or categorical.

##### finalState.scenarioExtensions?

> `optional` **scenarioExtensions**: `Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

##### finalState.statuses?

> `optional` **statuses**: `Record`\<`string`, `string` \| `boolean`\>

Categorical state: governance status, alignment, phase.

#### finalSwarm?

> `optional` **finalSwarm**: `object`

Final agent-swarm roster at end-of-run. Pairs with `finalState`: the
world snapshot is the macro view (metrics, statuses), the swarm
snapshot is the micro view (every agent's role, mood, family edges,
memory). Populated in `turn-loop` runs that exercised the swarm.
Use `WorldModel.swarm()` for the live equivalent during a run.

##### finalSwarm.agents

> **agents**: `object`[]

Every agent in the swarm at snapshot time, alive or dead.

##### finalSwarm.births?

> `optional` **births**: `number`

Number of births this turn.

##### finalSwarm.deaths?

> `optional` **deaths**: `number`

Number of deaths this turn.

##### finalSwarm.morale?

> `optional` **morale**: `number`

Aggregate morale 0..1 (population-weighted).

##### finalSwarm.population

> **population**: `number`

Aggregate counts derived from `agents`.

##### finalSwarm.scenarioExtensions?

> `optional` **scenarioExtensions**: `Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

##### finalSwarm.time

> **time**: `number`

Scenario time at snapshot (years/quarters/ticks per scenario).

##### finalSwarm.turn

> **turn**: `number`

Turn number this snapshot was taken at (0-indexed).

#### fingerprint?

> `optional` **fingerprint**: `Record`\<`string`, `string` \| `number`\>

Loose classification scores. Paracosm heritage; scenarios may extend.

#### forgedTools?

> `optional` **forgedTools**: `object`[]

#### intervention?

> `optional` **intervention**: `object`

Intervention being tested on the subject.

##### intervention.adherenceProfile?

> `optional` **adherenceProfile**: `object`

##### intervention.adherenceProfile.expected

> **expected**: `number`

##### intervention.adherenceProfile.risks?

> `optional` **risks**: `string`[]

##### intervention.category?

> `optional` **category**: `string`

##### intervention.description

> **description**: `string`

##### intervention.duration?

> `optional` **duration**: `object`

##### intervention.duration.unit

> **unit**: `string`

##### intervention.duration.value

> **value**: `number`

##### intervention.id

> **id**: `string`

##### intervention.mechanism?

> `optional` **mechanism**: `string`

##### intervention.name

> **name**: `string`

##### intervention.scenarioExtensions?

> `optional` **scenarioExtensions**: `Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

##### intervention.targetBehaviors?

> `optional` **targetBehaviors**: `string`[]

#### leveragePoints?

> `optional` **leveragePoints**: `string`[]

Actionable leverage points for consumers of the artifact.

#### metadata

> **metadata**: `object` = `RunMetadataSchema`

Required. Identifies the run + scenario + mode.

##### metadata.completedAt?

> `optional` **completedAt**: `string`

##### metadata.forkedFrom?

> `optional` **forkedFrom**: `object`

When this run was produced by forking a prior run, records the
parent run-id + the turn at which the fork happened. Consumers
walking a fork chain follow this link transitively through
stored artifacts. Omitted for fresh (non-forked) runs.

Added in 0.7.x with the WorldModel.fork() API. Additive +
optional; no COMPILE_SCHEMA_VERSION bump required.

##### metadata.forkedFrom.atTurn

> **atTurn**: `number`

##### metadata.forkedFrom.parentRunId

> **parentRunId**: `string`

##### metadata.mode

> **mode**: `"turn-loop"` \| `"batch-trajectory"` \| `"batch-point"` = `SimulationModeSchema`

##### metadata.runId

> **runId**: `string`

Unique identifier for this run. UUID, slug, or host-assigned id.

##### metadata.scenario

> **scenario**: `object`

##### metadata.scenario.id

> **id**: `string`

##### metadata.scenario.name

> **name**: `string`

##### metadata.scenario.version?

> `optional` **version**: `string`

Scenario version; not artifact version. Optional.

##### metadata.scenarioExtensions?

> `optional` **scenarioExtensions**: `Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

##### metadata.seed?

> `optional` **seed**: `number`

Absent for non-deterministic runs (LLM-only synthesis without a seeded kernel).

##### metadata.startedAt

> **startedAt**: `string`

#### overview?

> `optional` **overview**: `string`

Short headline summary. Digital-twin `overview`, paracosm verdict's
`summary`, a game's end-of-run narrator line.

#### providerError?

> `optional` **providerError**: \{ `actionUrl?`: `string`; `kind`: `"unknown"` \| `"auth"` \| `"quota"` \| `"rate_limit"` \| `"network"`; `message`: `string`; `provider`: `string`; \} \| `null`

#### riskFlags?

> `optional` **riskFlags**: `object`[]

Risk callouts. Maps to digital-twin `risk_flags` after camelCase rename.

#### scenarioExtensions?

> `optional` **scenarioExtensions**: `Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

#### specialistNotes?

> `optional` **specialistNotes**: `object`[]

Specialist analyses across domains. Flat list; multiple entries per domain/turn OK.

#### subject?

> `optional` **subject**: `object`

Subject being simulated (person, character, organism, vessel, etc.).

##### subject.conditions?

> `optional` **conditions**: `string`[]

##### subject.id

> **id**: `string`

##### subject.markers?

> `optional` **markers**: `object`[]

##### subject.name

> **name**: `string`

##### subject.personality?

> `optional` **personality**: `Record`\<`string`, `number`\>

##### subject.profile?

> `optional` **profile**: `Record`\<`string`, `unknown`\>

##### subject.scenarioExtensions?

> `optional` **scenarioExtensions**: `Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

##### subject.signals?

> `optional` **signals**: `object`[]

#### trajectory?

> `optional` **trajectory**: `object`

Labeled trajectory of the simulation. `trajectory.points` for sparklines,
`trajectory.timepoints` for rich labeled snapshots. Both optional; at
least one populated in `turn-loop` and `batch-trajectory` modes.

##### trajectory.points?

> `optional` **points**: `object`[]

Lightweight per-sample metric records; good for sparklines.

##### trajectory.timepoints?

> `optional` **timepoints**: `object`[]

Rich labeled snapshots with narrative + score; good for timepoint cards.

##### trajectory.timeUnit

> **timeUnit**: `object`

##### trajectory.timeUnit.plural

> **plural**: `string`

##### trajectory.timeUnit.singular

> **singular**: `string`

***

### runs

> **runs**: [`ActorRun`](ActorRun.md)[]

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:103](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/world-model/index.ts#L103)

Actor + artifact zipped together. Equivalent to
`actors.map((a, i) => ({ actor: a, artifact: artifacts[i] }))`.
Easier to iterate via `runs.forEach(({ actor, artifact }) => ...)`.

***

### scenario

> **scenario**: [`ScenarioPackage`](ScenarioPackage.md)

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:95](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/world-model/index.ts#L95)

The scenario the quickstart ran against.
