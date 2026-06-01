# Function: getSwarm()

> **getSwarm**(`artifact`): \{ `agents`: `object`[]; `births?`: `number`; `deaths?`: `number`; `morale?`: `number`; `population`: `number`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `time`: `number`; `turn`: `number`; \} \| `undefined`

Defined in: [apps/paracosm/src/runtime/swarm/index.ts:32](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/swarm/index.ts#L32)

Final swarm snapshot from a run, or `undefined` when the run did not
produce one (e.g., `batch-point` mode that skipped the turn loop).

## Parameters

### artifact

#### aborted?

`boolean` = `...`

#### assumptions?

`string`[] = `...`

Assumptions held true during the simulation.

#### citations?

`object`[] = `...`

#### cost?

\{ `breakdown?`: `Record`\<`string`, `number`\>; `cachedReadTokens?`: `number`; `cacheSavingsUSD?`: `number`; `inputTokens?`: `number`; `llmCalls?`: `number`; `outputTokens?`: `number`; `totalUSD`: `number`; \} = `...`

#### cost.breakdown?

`Record`\<`string`, `number`\> = `...`

Per-site / per-model breakdown: `{ director: 0.12, departments: 0.34 }`.

#### cost.cachedReadTokens?

`number` = `...`

#### cost.cacheSavingsUSD?

`number` = `...`

#### cost.inputTokens?

`number` = `...`

#### cost.llmCalls?

`number` = `...`

#### cost.outputTokens?

`number` = `...`

#### cost.totalUSD

`number` = `...`

#### decisions?

`object`[] = `...`

Every decision made during the run — one per commander choice in turn-loop.

#### disclaimer?

`string` = `...`

Scenario-supplied disclaimer (digital-twin simulations use this for medical / professional caveats).

#### finalState?

\{ `capacities?`: `Record`\<`string`, `number`\>; `environment?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `metrics`: `Record`\<`string`, `number`\>; `politics?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `statuses?`: `Record`\<`string`, `string` \| `boolean`\>; \} = `...`

#### finalState.capacities?

`Record`\<`string`, `number`\> = `...`

Capacity constraints: life support, housing, budget.

#### finalState.environment?

`Record`\<`string`, `string` \| `number` \| `boolean`\> = `...`

Environmental conditions: weather, radiation, depth, altitude.

#### finalState.metrics

`Record`\<`string`, `number`\> = `...`

Numeric gauges: food, power, population, morale, VO2max, whatever.

#### finalState.politics?

`Record`\<`string`, `string` \| `number` \| `boolean`\> = `...`

Political/social pressures. Values may be numeric or categorical.

#### finalState.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

#### finalState.statuses?

`Record`\<`string`, `string` \| `boolean`\> = `...`

Categorical state: governance status, alignment, phase.

#### finalSwarm?

\{ `agents`: `object`[]; `births?`: `number`; `deaths?`: `number`; `morale?`: `number`; `population`: `number`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `time`: `number`; `turn`: `number`; \} = `...`

Final agent-swarm roster at end-of-run. Pairs with `finalState`: the
world snapshot is the macro view (metrics, statuses), the swarm
snapshot is the micro view (every agent's role, mood, family edges,
memory). Populated in `turn-loop` runs that exercised the swarm.
Use `WorldModel.swarm()` for the live equivalent during a run.

#### finalSwarm.agents

`object`[] = `...`

Every agent in the swarm at snapshot time, alive or dead.

#### finalSwarm.births?

`number` = `...`

Number of births this turn.

#### finalSwarm.deaths?

`number` = `...`

Number of deaths this turn.

#### finalSwarm.morale?

`number` = `...`

Aggregate morale 0..1 (population-weighted).

#### finalSwarm.population

`number` = `...`

Aggregate counts derived from `agents`.

#### finalSwarm.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

#### finalSwarm.time

`number` = `...`

Scenario time at snapshot (years/quarters/ticks per scenario).

#### finalSwarm.turn

`number` = `...`

Turn number this snapshot was taken at (0-indexed).

#### fingerprint?

`Record`\<`string`, `string` \| `number`\> = `...`

Loose classification scores. Paracosm heritage; scenarios may extend.

#### forgedTools?

`object`[] = `...`

#### intervention?

\{ `adherenceProfile?`: \{ `expected`: `number`; `risks?`: `string`[]; \}; `category?`: `string`; `description`: `string`; `duration?`: \{ `unit`: `string`; `value`: `number`; \}; `id`: `string`; `mechanism?`: `string`; `name`: `string`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `targetBehaviors?`: `string`[]; \} = `...`

Intervention being tested on the subject.

#### intervention.adherenceProfile?

\{ `expected`: `number`; `risks?`: `string`[]; \} = `...`

#### intervention.adherenceProfile.expected

`number` = `...`

#### intervention.adherenceProfile.risks?

`string`[] = `...`

#### intervention.category?

`string` = `...`

#### intervention.description

`string` = `...`

#### intervention.duration?

\{ `unit`: `string`; `value`: `number`; \} = `...`

#### intervention.duration.unit

`string` = `...`

#### intervention.duration.value

`number` = `...`

#### intervention.id

`string` = `...`

#### intervention.mechanism?

`string` = `...`

#### intervention.name

`string` = `...`

#### intervention.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

#### intervention.targetBehaviors?

`string`[] = `...`

#### leveragePoints?

`string`[] = `...`

Actionable leverage points for consumers of the artifact.

#### metadata

\{ `completedAt?`: `string`; `forkedFrom?`: \{ `atTurn`: `number`; `parentRunId`: `string`; \}; `mode`: `"turn-loop"` \| `"batch-trajectory"` \| `"batch-point"`; `runId`: `string`; `scenario`: \{ `id`: `string`; `name`: `string`; `version?`: `string`; \}; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `seed?`: `number`; `startedAt`: `string`; \} = `RunMetadataSchema`

Required. Identifies the run + scenario + mode.

#### metadata.completedAt?

`string` = `...`

#### metadata.forkedFrom?

\{ `atTurn`: `number`; `parentRunId`: `string`; \} = `...`

When this run was produced by forking a prior run, records the
parent run-id + the turn at which the fork happened. Consumers
walking a fork chain follow this link transitively through
stored artifacts. Omitted for fresh (non-forked) runs.

Added in 0.7.x with the WorldModel.fork() API. Additive +
optional; no COMPILE_SCHEMA_VERSION bump required.

#### metadata.forkedFrom.atTurn

`number` = `...`

#### metadata.forkedFrom.parentRunId

`string` = `...`

#### metadata.mode

`"turn-loop"` \| `"batch-trajectory"` \| `"batch-point"` = `SimulationModeSchema`

#### metadata.runId

`string` = `...`

Unique identifier for this run. UUID, slug, or host-assigned id.

#### metadata.scenario

\{ `id`: `string`; `name`: `string`; `version?`: `string`; \} = `...`

#### metadata.scenario.id

`string` = `...`

#### metadata.scenario.name

`string` = `...`

#### metadata.scenario.version?

`string` = `...`

Scenario version; not artifact version. Optional.

#### metadata.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

#### metadata.seed?

`number` = `...`

Absent for non-deterministic runs (LLM-only synthesis without a seeded kernel).

#### metadata.startedAt

`string` = `...`

#### overview?

`string` = `...`

Short headline summary. Digital-twin `overview`, paracosm verdict's
`summary`, a game's end-of-run narrator line.

#### providerError?

\{ `actionUrl?`: `string`; `kind`: `"unknown"` \| `"auth"` \| `"quota"` \| `"rate_limit"` \| `"network"`; `message`: `string`; `provider`: `string`; \} \| `null` = `...`

#### riskFlags?

`object`[] = `...`

Risk callouts. Maps to digital-twin `risk_flags` after camelCase rename.

#### scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

#### specialistNotes?

`object`[] = `...`

Specialist analyses across domains. Flat list; multiple entries per domain/turn OK.

#### subject?

\{ `conditions?`: `string`[]; `id`: `string`; `markers?`: `object`[]; `name`: `string`; `personality?`: `Record`\<`string`, `number`\>; `profile?`: `Record`\<`string`, `unknown`\>; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `signals?`: `object`[]; \} = `...`

Subject being simulated (person, character, organism, vessel, etc.).

#### subject.conditions?

`string`[] = `...`

#### subject.id

`string` = `...`

#### subject.markers?

`object`[] = `...`

#### subject.name

`string` = `...`

#### subject.personality?

`Record`\<`string`, `number`\> = `...`

#### subject.profile?

`Record`\<`string`, `unknown`\> = `...`

#### subject.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

#### subject.signals?

`object`[] = `...`

#### trajectory?

\{ `points?`: `object`[]; `timepoints?`: `object`[]; `timeUnit`: \{ `plural`: `string`; `singular`: `string`; \}; \} = `...`

Labeled trajectory of the simulation. `trajectory.points` for sparklines,
`trajectory.timepoints` for rich labeled snapshots. Both optional; at
least one populated in `turn-loop` and `batch-trajectory` modes.

#### trajectory.points?

`object`[] = `...`

Lightweight per-sample metric records; good for sparklines.

#### trajectory.timepoints?

`object`[] = `...`

Rich labeled snapshots with narrative + score; good for timepoint cards.

#### trajectory.timeUnit

\{ `plural`: `string`; `singular`: `string`; \} = `...`

#### trajectory.timeUnit.plural

`string` = `...`

#### trajectory.timeUnit.singular

`string` = `...`

## Returns

\{ `agents`: `object`[]; `births?`: `number`; `deaths?`: `number`; `morale?`: `number`; `population`: `number`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `time`: `number`; `turn`: `number`; \}

### agents

> **agents**: `object`[]

Every agent in the swarm at snapshot time, alive or dead.

### births?

> `optional` **births**: `number`

Number of births this turn.

### deaths?

> `optional` **deaths**: `number`

Number of deaths this turn.

### morale?

> `optional` **morale**: `number`

Aggregate morale 0..1 (population-weighted).

### population

> **population**: `number`

Aggregate counts derived from `agents`.

### scenarioExtensions?

> `optional` **scenarioExtensions**: `Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

### time

> **time**: `number`

Scenario time at snapshot (years/quarters/ticks per scenario).

### turn

> **turn**: `number`

Turn number this snapshot was taken at (0-indexed).

`undefined`
