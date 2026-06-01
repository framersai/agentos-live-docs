# Class: WorldModel

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:206](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L206)

A compiled, runnable world. Wraps a [ScenarioPackage](../interfaces/ScenarioPackage.md) with
convenience methods for simulating single leaders or running a batch.

Construct via [WorldModel.fromJson](#fromjson) (compile from raw JSON) or
[WorldModel.fromScenario](#fromscenario) (wrap an already-compiled scenario,
e.g. `marsScenario`).

The underlying scenario is exposed via [WorldModel.scenario](#scenario) as
an escape hatch for callers that want the raw [ScenarioPackage](../interfaces/ScenarioPackage.md).

## Examples

```ts
import { WorldModel } from 'paracosm';
import worldJson from './my-world.json' with { type: 'json' };

const wm = await WorldModel.fromJson(worldJson, { provider: 'anthropic' });
const artifact = await wm.simulate({ actor: leader, maxTurns: 6, seed: 42 });
```

```ts
const wm = await WorldModel.fromJson(worldJson);
const trunk = await wm.simulate({
  actor: visionary,
  maxTurns: 6, seed: 42, captureSnapshots: true,
});
const branch = await (await wm.forkFromArtifact(trunk, 3)).simulate({
  actor: pragmatist,
  maxTurns: 6,
  seed: 42,
});
// branch.metadata.forkedFrom === { parentRunId: trunk.metadata.runId, atTurn: 3 }
```

```ts
import { marsScenario } from 'paracosm';
import { WorldModel } from 'paracosm';

const wm = WorldModel.fromScenario(marsScenario);
const artifact = await wm.simulate({ actor: leader, maxTurns: 8 });
```

## Properties

### scenario

> `readonly` **scenario**: [`ScenarioPackage`](../interfaces/ScenarioPackage.md)

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:211](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L211)

The underlying compiled scenario. Exposed so callers can reuse the
same compiled package across custom integrations.

## Methods

### batch()

> **batch**(`options`): `Promise`\<`BatchManifest`\>

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:459](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L459)

Run N leaders through this world in parallel via runBatch.
`scenarios` is fixed to `[this.scenario]`; supply `leaders`, `turns`,
`seed`, and any other BatchConfig fields.

For N-scenarios-×-M-leaders sweeps that span multiple worlds, call
runBatch directly with an explicit `scenarios` array.

#### Parameters

##### options

`WorldModelBatchOptions`

#### Returns

`Promise`\<`BatchManifest`\>

***

### fork()

> **fork**(`snapshot`, `opts?`): `Promise`\<`WorldModel`\>

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:556](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L556)

Construct a new WorldModel positioned at the snapshot's turn. The
new WorldModel has no prior run of its own; calling `.simulate()`
on it resumes from the snapshot's kernel state, optionally with a
different leader, seed, or custom events.

`metadata.forkedFrom` on the subsequent `.simulate()` call's
returned RunArtifact is set to
`{ parentRunId: snapshot.parentRunId, atTurn: snapshot.kernel.turn }`.

The `opts` argument is accepted for API symmetry but not consumed
at fork time; the caller passes `opts.leader` / `opts.seed` /
`opts.customEvents` through to the subsequent `.simulate()` call
directly. A future spec may fold this into a single-call API.

#### Parameters

##### snapshot

[`WorldModelSnapshot`](../interfaces/WorldModelSnapshot.md)

##### opts?

`ForkOptions` = `{}`

#### Returns

`Promise`\<`WorldModel`\>

#### Throws

Error when `snapshot.kernel.scenarioId !== this.scenario.id`.

***

### forkFromArtifact()

> **forkFromArtifact**(`artifact`, `atTurn`, `opts?`): `Promise`\<`WorldModel`\>

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:590](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L590)

Convenience: pulls the kernel snapshot at `atTurn` from
`artifact.scenarioExtensions.kernelSnapshotsPerTurn` (populated
when the parent run was created with `captureSnapshots: true`)
and calls [WorldModel.fork](#fork) with it.

#### Parameters

##### artifact

###### aborted?

`boolean` = `...`

###### assumptions?

`string`[] = `...`

Assumptions held true during the simulation.

###### citations?

`object`[] = `...`

###### cost?

\{ `breakdown?`: `Record`\<`string`, `number`\>; `cachedReadTokens?`: `number`; `cacheSavingsUSD?`: `number`; `inputTokens?`: `number`; `llmCalls?`: `number`; `outputTokens?`: `number`; `totalUSD`: `number`; \} = `...`

###### cost.breakdown?

`Record`\<`string`, `number`\> = `...`

Per-site / per-model breakdown: `{ director: 0.12, departments: 0.34 }`.

###### cost.cachedReadTokens?

`number` = `...`

###### cost.cacheSavingsUSD?

`number` = `...`

###### cost.inputTokens?

`number` = `...`

###### cost.llmCalls?

`number` = `...`

###### cost.outputTokens?

`number` = `...`

###### cost.totalUSD

`number` = `...`

###### decisions?

`object`[] = `...`

Every decision made during the run — one per commander choice in turn-loop.

###### disclaimer?

`string` = `...`

Scenario-supplied disclaimer (digital-twin simulations use this for medical / professional caveats).

###### finalState?

\{ `capacities?`: `Record`\<`string`, `number`\>; `environment?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `metrics`: `Record`\<`string`, `number`\>; `politics?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `statuses?`: `Record`\<`string`, `string` \| `boolean`\>; \} = `...`

###### finalState.capacities?

`Record`\<`string`, `number`\> = `...`

Capacity constraints: life support, housing, budget.

###### finalState.environment?

`Record`\<`string`, `string` \| `number` \| `boolean`\> = `...`

Environmental conditions: weather, radiation, depth, altitude.

###### finalState.metrics

`Record`\<`string`, `number`\> = `...`

Numeric gauges: food, power, population, morale, VO2max, whatever.

###### finalState.politics?

`Record`\<`string`, `string` \| `number` \| `boolean`\> = `...`

Political/social pressures. Values may be numeric or categorical.

###### finalState.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### finalState.statuses?

`Record`\<`string`, `string` \| `boolean`\> = `...`

Categorical state: governance status, alignment, phase.

###### finalSwarm?

\{ `agents`: `object`[]; `births?`: `number`; `deaths?`: `number`; `morale?`: `number`; `population`: `number`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `time`: `number`; `turn`: `number`; \} = `...`

Final agent-swarm roster at end-of-run. Pairs with `finalState`: the
world snapshot is the macro view (metrics, statuses), the swarm
snapshot is the micro view (every agent's role, mood, family edges,
memory). Populated in `turn-loop` runs that exercised the swarm.
Use `WorldModel.swarm()` for the live equivalent during a run.

###### finalSwarm.agents

`object`[] = `...`

Every agent in the swarm at snapshot time, alive or dead.

###### finalSwarm.births?

`number` = `...`

Number of births this turn.

###### finalSwarm.deaths?

`number` = `...`

Number of deaths this turn.

###### finalSwarm.morale?

`number` = `...`

Aggregate morale 0..1 (population-weighted).

###### finalSwarm.population

`number` = `...`

Aggregate counts derived from `agents`.

###### finalSwarm.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### finalSwarm.time

`number` = `...`

Scenario time at snapshot (years/quarters/ticks per scenario).

###### finalSwarm.turn

`number` = `...`

Turn number this snapshot was taken at (0-indexed).

###### fingerprint?

`Record`\<`string`, `string` \| `number`\> = `...`

Loose classification scores. Paracosm heritage; scenarios may extend.

###### forgedTools?

`object`[] = `...`

###### intervention?

\{ `adherenceProfile?`: \{ `expected`: `number`; `risks?`: `string`[]; \}; `category?`: `string`; `description`: `string`; `duration?`: \{ `unit`: `string`; `value`: `number`; \}; `id`: `string`; `mechanism?`: `string`; `name`: `string`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `targetBehaviors?`: `string`[]; \} = `...`

Intervention being tested on the subject.

###### intervention.adherenceProfile?

\{ `expected`: `number`; `risks?`: `string`[]; \} = `...`

###### intervention.adherenceProfile.expected

`number` = `...`

###### intervention.adherenceProfile.risks?

`string`[] = `...`

###### intervention.category?

`string` = `...`

###### intervention.description

`string` = `...`

###### intervention.duration?

\{ `unit`: `string`; `value`: `number`; \} = `...`

###### intervention.duration.unit

`string` = `...`

###### intervention.duration.value

`number` = `...`

###### intervention.id

`string` = `...`

###### intervention.mechanism?

`string` = `...`

###### intervention.name

`string` = `...`

###### intervention.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### intervention.targetBehaviors?

`string`[] = `...`

###### leveragePoints?

`string`[] = `...`

Actionable leverage points for consumers of the artifact.

###### metadata

\{ `completedAt?`: `string`; `forkedFrom?`: \{ `atTurn`: `number`; `parentRunId`: `string`; \}; `mode`: `"turn-loop"` \| `"batch-trajectory"` \| `"batch-point"`; `runId`: `string`; `scenario`: \{ `id`: `string`; `name`: `string`; `version?`: `string`; \}; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `seed?`: `number`; `startedAt`: `string`; \} = `RunMetadataSchema`

Required. Identifies the run + scenario + mode.

###### metadata.completedAt?

`string` = `...`

###### metadata.forkedFrom?

\{ `atTurn`: `number`; `parentRunId`: `string`; \} = `...`

When this run was produced by forking a prior run, records the
parent run-id + the turn at which the fork happened. Consumers
walking a fork chain follow this link transitively through
stored artifacts. Omitted for fresh (non-forked) runs.

Added in 0.7.x with the WorldModel.fork() API. Additive +
optional; no COMPILE_SCHEMA_VERSION bump required.

###### metadata.forkedFrom.atTurn

`number` = `...`

###### metadata.forkedFrom.parentRunId

`string` = `...`

###### metadata.mode

`"turn-loop"` \| `"batch-trajectory"` \| `"batch-point"` = `SimulationModeSchema`

###### metadata.runId

`string` = `...`

Unique identifier for this run. UUID, slug, or host-assigned id.

###### metadata.scenario

\{ `id`: `string`; `name`: `string`; `version?`: `string`; \} = `...`

###### metadata.scenario.id

`string` = `...`

###### metadata.scenario.name

`string` = `...`

###### metadata.scenario.version?

`string` = `...`

Scenario version; not artifact version. Optional.

###### metadata.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### metadata.seed?

`number` = `...`

Absent for non-deterministic runs (LLM-only synthesis without a seeded kernel).

###### metadata.startedAt

`string` = `...`

###### overview?

`string` = `...`

Short headline summary. Digital-twin `overview`, paracosm verdict's
`summary`, a game's end-of-run narrator line.

###### providerError?

\{ `actionUrl?`: `string`; `kind`: `"unknown"` \| `"auth"` \| `"quota"` \| `"rate_limit"` \| `"network"`; `message`: `string`; `provider`: `string`; \} \| `null` = `...`

###### riskFlags?

`object`[] = `...`

Risk callouts. Maps to digital-twin `risk_flags` after camelCase rename.

###### scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### specialistNotes?

`object`[] = `...`

Specialist analyses across domains. Flat list; multiple entries per domain/turn OK.

###### subject?

\{ `conditions?`: `string`[]; `id`: `string`; `markers?`: `object`[]; `name`: `string`; `personality?`: `Record`\<`string`, `number`\>; `profile?`: `Record`\<`string`, `unknown`\>; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `signals?`: `object`[]; \} = `...`

Subject being simulated (person, character, organism, vessel, etc.).

###### subject.conditions?

`string`[] = `...`

###### subject.id

`string` = `...`

###### subject.markers?

`object`[] = `...`

###### subject.name

`string` = `...`

###### subject.personality?

`Record`\<`string`, `number`\> = `...`

###### subject.profile?

`Record`\<`string`, `unknown`\> = `...`

###### subject.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### subject.signals?

`object`[] = `...`

###### trajectory?

\{ `points?`: `object`[]; `timepoints?`: `object`[]; `timeUnit`: \{ `plural`: `string`; `singular`: `string`; \}; \} = `...`

Labeled trajectory of the simulation. `trajectory.points` for sparklines,
`trajectory.timepoints` for rich labeled snapshots. Both optional; at
least one populated in `turn-loop` and `batch-trajectory` modes.

###### trajectory.points?

`object`[] = `...`

Lightweight per-sample metric records; good for sparklines.

###### trajectory.timepoints?

`object`[] = `...`

Rich labeled snapshots with narrative + score; good for timepoint cards.

###### trajectory.timeUnit

\{ `plural`: `string`; `singular`: `string`; \} = `...`

###### trajectory.timeUnit.plural

`string` = `...`

###### trajectory.timeUnit.singular

`string` = `...`

##### atTurn

`number`

##### opts?

`ForkOptions` = `{}`

#### Returns

`Promise`\<`WorldModel`\>

#### Throws

Error when the artifact has no embedded per-turn
  snapshots (parent wasn't run with `captureSnapshots: true`) or
  when `atTurn` is out of range of the available snapshots.

***

### intervene()

> **intervene**(`opts`): `Promise`\<\{ `aborted?`: `boolean`; `assumptions?`: `string`[]; `citations?`: `object`[]; `cost?`: \{ `breakdown?`: `Record`\<`string`, `number`\>; `cachedReadTokens?`: `number`; `cacheSavingsUSD?`: `number`; `inputTokens?`: `number`; `llmCalls?`: `number`; `outputTokens?`: `number`; `totalUSD`: `number`; \}; `decisions?`: `object`[]; `disclaimer?`: `string`; `finalState?`: \{ `capacities?`: `Record`\<`string`, `number`\>; `environment?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `metrics`: `Record`\<`string`, `number`\>; `politics?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `statuses?`: `Record`\<`string`, `string` \| `boolean`\>; \}; `finalSwarm?`: \{ `agents`: `object`[]; `births?`: `number`; `deaths?`: `number`; `morale?`: `number`; `population`: `number`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `time`: `number`; `turn`: `number`; \}; `fingerprint?`: `Record`\<`string`, `string` \| `number`\>; `forgedTools?`: `object`[]; `intervention?`: \{ `adherenceProfile?`: \{ `expected`: `number`; `risks?`: `string`[]; \}; `category?`: `string`; `description`: `string`; `duration?`: \{ `unit`: `string`; `value`: `number`; \}; `id`: `string`; `mechanism?`: `string`; `name`: `string`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `targetBehaviors?`: `string`[]; \}; `leveragePoints?`: `string`[]; `metadata`: \{ `completedAt?`: `string`; `forkedFrom?`: \{ `atTurn`: `number`; `parentRunId`: `string`; \}; `mode`: `"turn-loop"` \| `"batch-trajectory"` \| `"batch-point"`; `runId`: `string`; `scenario`: \{ `id`: `string`; `name`: `string`; `version?`: `string`; \}; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `seed?`: `number`; `startedAt`: `string`; \}; `overview?`: `string`; `providerError?`: \{ `actionUrl?`: `string`; `kind`: `"unknown"` \| `"auth"` \| `"quota"` \| `"rate_limit"` \| `"network"`; `message`: `string`; `provider`: `string`; \} \| `null`; `riskFlags?`: `object`[]; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `specialistNotes?`: `object`[]; `subject?`: \{ `conditions?`: `string`[]; `id`: `string`; `markers?`: `object`[]; `name`: `string`; `personality?`: `Record`\<`string`, `number`\>; `profile?`: `Record`\<`string`, `unknown`\>; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `signals?`: `object`[]; \}; `trajectory?`: \{ `points?`: `object`[]; `timepoints?`: `object`[]; `timeUnit`: \{ `plural`: `string`; `singular`: `string`; \}; \}; \}\>

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:447](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L447)

Simulate an intervention applied to a subject within this world.

Sugar over [WorldModel.simulate](#simulate) that names the digital-twin
pattern: a subject (a person, organization, system, or biological
entity) is held constant, an intervention (a treatment, policy, or
action) is applied, and the leader drives the run. The returned
RunArtifact carries `subject` and `intervention` for traceability.

#### Parameters

##### opts

[`InterveneOptions`](../interfaces/InterveneOptions.md)

Options bag containing the subject, intervention, actor,
and normal simulation settings.

#### Returns

`Promise`\<\{ `aborted?`: `boolean`; `assumptions?`: `string`[]; `citations?`: `object`[]; `cost?`: \{ `breakdown?`: `Record`\<`string`, `number`\>; `cachedReadTokens?`: `number`; `cacheSavingsUSD?`: `number`; `inputTokens?`: `number`; `llmCalls?`: `number`; `outputTokens?`: `number`; `totalUSD`: `number`; \}; `decisions?`: `object`[]; `disclaimer?`: `string`; `finalState?`: \{ `capacities?`: `Record`\<`string`, `number`\>; `environment?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `metrics`: `Record`\<`string`, `number`\>; `politics?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `statuses?`: `Record`\<`string`, `string` \| `boolean`\>; \}; `finalSwarm?`: \{ `agents`: `object`[]; `births?`: `number`; `deaths?`: `number`; `morale?`: `number`; `population`: `number`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `time`: `number`; `turn`: `number`; \}; `fingerprint?`: `Record`\<`string`, `string` \| `number`\>; `forgedTools?`: `object`[]; `intervention?`: \{ `adherenceProfile?`: \{ `expected`: `number`; `risks?`: `string`[]; \}; `category?`: `string`; `description`: `string`; `duration?`: \{ `unit`: `string`; `value`: `number`; \}; `id`: `string`; `mechanism?`: `string`; `name`: `string`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `targetBehaviors?`: `string`[]; \}; `leveragePoints?`: `string`[]; `metadata`: \{ `completedAt?`: `string`; `forkedFrom?`: \{ `atTurn`: `number`; `parentRunId`: `string`; \}; `mode`: `"turn-loop"` \| `"batch-trajectory"` \| `"batch-point"`; `runId`: `string`; `scenario`: \{ `id`: `string`; `name`: `string`; `version?`: `string`; \}; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `seed?`: `number`; `startedAt`: `string`; \}; `overview?`: `string`; `providerError?`: \{ `actionUrl?`: `string`; `kind`: `"unknown"` \| `"auth"` \| `"quota"` \| `"rate_limit"` \| `"network"`; `message`: `string`; `provider`: `string`; \} \| `null`; `riskFlags?`: `object`[]; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `specialistNotes?`: `object`[]; `subject?`: \{ `conditions?`: `string`[]; `id`: `string`; `markers?`: `object`[]; `name`: `string`; `personality?`: `Record`\<`string`, `number`\>; `profile?`: `Record`\<`string`, `unknown`\>; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `signals?`: `object`[]; \}; `trajectory?`: \{ `points?`: `object`[]; `timepoints?`: `object`[]; `timeUnit`: \{ `plural`: `string`; `singular`: `string`; \}; \}; \}\>

RunArtifact with `subject` and `intervention` populated.

#### Example

```ts
import { WorldModel } from 'paracosm';

const wm = await WorldModel.fromJson(scenarioJson);
const artifact = await wm.intervene({
  subject: { id: 'company', kind: 'organization', attributes: { headcount: 100 } },
  intervention: { id: 'layoff', kind: 'policy', description: '25% RIF', parameters: { percent: 25 } },
  actor: leader,
  maxTurns: 4,
});
console.log(artifact.subject, artifact.intervention);
```

***

### quickstart()

> **quickstart**(`options?`): `Promise`\<[`WorldModelQuickstartResult`](../interfaces/WorldModelQuickstartResult.md)\>

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:484](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L484)

Quickstart: generate N contextual HEXACO leaders for this world and
run them in parallel against the same seed. Leaders are produced by
a structured-output LLM call (Zod schema with HEXACO bounds); each
run is a direct `runSimulation` call so `captureSnapshots: true`
flows through verbatim and the results are fork-eligible.

Unlike [batch](#batch), this path assumes one scenario and same-seed
runs across leaders: the entire product value is "same seed,
different HEXACO, see divergence".

#### Parameters

##### options?

[`WorldModelQuickstartOptions`](../interfaces/WorldModelQuickstartOptions.md) = `{}`

#### Returns

`Promise`\<[`WorldModelQuickstartResult`](../interfaces/WorldModelQuickstartResult.md)\>

#### Example

```ts
const wm = await WorldModel.fromPrompt({ seedText });
const { actors, artifacts } = await wm.quickstart({ actorCount: 3 });
artifacts.forEach((a, i) => console.log(actors[i].name, a.fingerprint));
```

***

### replay()

> **replay**(`artifact`): `Promise`\<[`WorldModelReplayResult`](../interfaces/WorldModelReplayResult.md)\>

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:638](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L638)

Re-execute the kernel transitions captured in `artifact` and report
whether today's kernel produces the same snapshots. The audit
use case named in the 2026-04-23 positioning spec is now a single
API call; pillar 2 (Reproducible) is verifiable in code rather
than promised in copy.

Implementation re-runs the deterministic between-turn progression
hook from each recorded snapshot to the next, captures fresh
snapshots, and compares the fresh `kernelSnapshotsPerTurn` array
to the input artifact's via canonical JSON. `matches=true` proves
the kernel is byte-equal-deterministic for this artifact's transitions.

Required preconditions on `artifact`:
  - `scenarioExtensions.kernelSnapshotsPerTurn` populated.
  - `decisions[]` populated.
  - `metadata.scenario.id` matches this WorldModel's scenario.

#### Parameters

##### artifact

The stored RunArtifact to replay.

###### aborted?

`boolean` = `...`

###### assumptions?

`string`[] = `...`

Assumptions held true during the simulation.

###### citations?

`object`[] = `...`

###### cost?

\{ `breakdown?`: `Record`\<`string`, `number`\>; `cachedReadTokens?`: `number`; `cacheSavingsUSD?`: `number`; `inputTokens?`: `number`; `llmCalls?`: `number`; `outputTokens?`: `number`; `totalUSD`: `number`; \} = `...`

###### cost.breakdown?

`Record`\<`string`, `number`\> = `...`

Per-site / per-model breakdown: `{ director: 0.12, departments: 0.34 }`.

###### cost.cachedReadTokens?

`number` = `...`

###### cost.cacheSavingsUSD?

`number` = `...`

###### cost.inputTokens?

`number` = `...`

###### cost.llmCalls?

`number` = `...`

###### cost.outputTokens?

`number` = `...`

###### cost.totalUSD

`number` = `...`

###### decisions?

`object`[] = `...`

Every decision made during the run — one per commander choice in turn-loop.

###### disclaimer?

`string` = `...`

Scenario-supplied disclaimer (digital-twin simulations use this for medical / professional caveats).

###### finalState?

\{ `capacities?`: `Record`\<`string`, `number`\>; `environment?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `metrics`: `Record`\<`string`, `number`\>; `politics?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `statuses?`: `Record`\<`string`, `string` \| `boolean`\>; \} = `...`

###### finalState.capacities?

`Record`\<`string`, `number`\> = `...`

Capacity constraints: life support, housing, budget.

###### finalState.environment?

`Record`\<`string`, `string` \| `number` \| `boolean`\> = `...`

Environmental conditions: weather, radiation, depth, altitude.

###### finalState.metrics

`Record`\<`string`, `number`\> = `...`

Numeric gauges: food, power, population, morale, VO2max, whatever.

###### finalState.politics?

`Record`\<`string`, `string` \| `number` \| `boolean`\> = `...`

Political/social pressures. Values may be numeric or categorical.

###### finalState.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### finalState.statuses?

`Record`\<`string`, `string` \| `boolean`\> = `...`

Categorical state: governance status, alignment, phase.

###### finalSwarm?

\{ `agents`: `object`[]; `births?`: `number`; `deaths?`: `number`; `morale?`: `number`; `population`: `number`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `time`: `number`; `turn`: `number`; \} = `...`

Final agent-swarm roster at end-of-run. Pairs with `finalState`: the
world snapshot is the macro view (metrics, statuses), the swarm
snapshot is the micro view (every agent's role, mood, family edges,
memory). Populated in `turn-loop` runs that exercised the swarm.
Use `WorldModel.swarm()` for the live equivalent during a run.

###### finalSwarm.agents

`object`[] = `...`

Every agent in the swarm at snapshot time, alive or dead.

###### finalSwarm.births?

`number` = `...`

Number of births this turn.

###### finalSwarm.deaths?

`number` = `...`

Number of deaths this turn.

###### finalSwarm.morale?

`number` = `...`

Aggregate morale 0..1 (population-weighted).

###### finalSwarm.population

`number` = `...`

Aggregate counts derived from `agents`.

###### finalSwarm.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### finalSwarm.time

`number` = `...`

Scenario time at snapshot (years/quarters/ticks per scenario).

###### finalSwarm.turn

`number` = `...`

Turn number this snapshot was taken at (0-indexed).

###### fingerprint?

`Record`\<`string`, `string` \| `number`\> = `...`

Loose classification scores. Paracosm heritage; scenarios may extend.

###### forgedTools?

`object`[] = `...`

###### intervention?

\{ `adherenceProfile?`: \{ `expected`: `number`; `risks?`: `string`[]; \}; `category?`: `string`; `description`: `string`; `duration?`: \{ `unit`: `string`; `value`: `number`; \}; `id`: `string`; `mechanism?`: `string`; `name`: `string`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `targetBehaviors?`: `string`[]; \} = `...`

Intervention being tested on the subject.

###### intervention.adherenceProfile?

\{ `expected`: `number`; `risks?`: `string`[]; \} = `...`

###### intervention.adherenceProfile.expected

`number` = `...`

###### intervention.adherenceProfile.risks?

`string`[] = `...`

###### intervention.category?

`string` = `...`

###### intervention.description

`string` = `...`

###### intervention.duration?

\{ `unit`: `string`; `value`: `number`; \} = `...`

###### intervention.duration.unit

`string` = `...`

###### intervention.duration.value

`number` = `...`

###### intervention.id

`string` = `...`

###### intervention.mechanism?

`string` = `...`

###### intervention.name

`string` = `...`

###### intervention.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### intervention.targetBehaviors?

`string`[] = `...`

###### leveragePoints?

`string`[] = `...`

Actionable leverage points for consumers of the artifact.

###### metadata

\{ `completedAt?`: `string`; `forkedFrom?`: \{ `atTurn`: `number`; `parentRunId`: `string`; \}; `mode`: `"turn-loop"` \| `"batch-trajectory"` \| `"batch-point"`; `runId`: `string`; `scenario`: \{ `id`: `string`; `name`: `string`; `version?`: `string`; \}; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `seed?`: `number`; `startedAt`: `string`; \} = `RunMetadataSchema`

Required. Identifies the run + scenario + mode.

###### metadata.completedAt?

`string` = `...`

###### metadata.forkedFrom?

\{ `atTurn`: `number`; `parentRunId`: `string`; \} = `...`

When this run was produced by forking a prior run, records the
parent run-id + the turn at which the fork happened. Consumers
walking a fork chain follow this link transitively through
stored artifacts. Omitted for fresh (non-forked) runs.

Added in 0.7.x with the WorldModel.fork() API. Additive +
optional; no COMPILE_SCHEMA_VERSION bump required.

###### metadata.forkedFrom.atTurn

`number` = `...`

###### metadata.forkedFrom.parentRunId

`string` = `...`

###### metadata.mode

`"turn-loop"` \| `"batch-trajectory"` \| `"batch-point"` = `SimulationModeSchema`

###### metadata.runId

`string` = `...`

Unique identifier for this run. UUID, slug, or host-assigned id.

###### metadata.scenario

\{ `id`: `string`; `name`: `string`; `version?`: `string`; \} = `...`

###### metadata.scenario.id

`string` = `...`

###### metadata.scenario.name

`string` = `...`

###### metadata.scenario.version?

`string` = `...`

Scenario version; not artifact version. Optional.

###### metadata.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### metadata.seed?

`number` = `...`

Absent for non-deterministic runs (LLM-only synthesis without a seeded kernel).

###### metadata.startedAt

`string` = `...`

###### overview?

`string` = `...`

Short headline summary. Digital-twin `overview`, paracosm verdict's
`summary`, a game's end-of-run narrator line.

###### providerError?

\{ `actionUrl?`: `string`; `kind`: `"unknown"` \| `"auth"` \| `"quota"` \| `"rate_limit"` \| `"network"`; `message`: `string`; `provider`: `string`; \} \| `null` = `...`

###### riskFlags?

`object`[] = `...`

Risk callouts. Maps to digital-twin `risk_flags` after camelCase rename.

###### scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### specialistNotes?

`object`[] = `...`

Specialist analyses across domains. Flat list; multiple entries per domain/turn OK.

###### subject?

\{ `conditions?`: `string`[]; `id`: `string`; `markers?`: `object`[]; `name`: `string`; `personality?`: `Record`\<`string`, `number`\>; `profile?`: `Record`\<`string`, `unknown`\>; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `signals?`: `object`[]; \} = `...`

Subject being simulated (person, character, organism, vessel, etc.).

###### subject.conditions?

`string`[] = `...`

###### subject.id

`string` = `...`

###### subject.markers?

`object`[] = `...`

###### subject.name

`string` = `...`

###### subject.personality?

`Record`\<`string`, `number`\> = `...`

###### subject.profile?

`Record`\<`string`, `unknown`\> = `...`

###### subject.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### subject.signals?

`object`[] = `...`

###### trajectory?

\{ `points?`: `object`[]; `timepoints?`: `object`[]; `timeUnit`: \{ `plural`: `string`; `singular`: `string`; \}; \} = `...`

Labeled trajectory of the simulation. `trajectory.points` for sparklines,
`trajectory.timepoints` for rich labeled snapshots. Both optional; at
least one populated in `turn-loop` and `batch-trajectory` modes.

###### trajectory.points?

`object`[] = `...`

Lightweight per-sample metric records; good for sparklines.

###### trajectory.timepoints?

`object`[] = `...`

Rich labeled snapshots with narrative + score; good for timepoint cards.

###### trajectory.timeUnit

\{ `plural`: `string`; `singular`: `string`; \} = `...`

###### trajectory.timeUnit.plural

`string` = `...`

###### trajectory.timeUnit.singular

`string` = `...`

#### Returns

`Promise`\<[`WorldModelReplayResult`](../interfaces/WorldModelReplayResult.md)\>

Replay result: `{ artifact, matches, divergence }`.

#### Throws

WorldModelReplayError when preconditions fail.

***

### simulate()

> **simulate**(`opts`): `Promise`\<\{ `aborted?`: `boolean`; `assumptions?`: `string`[]; `citations?`: `object`[]; `cost?`: \{ `breakdown?`: `Record`\<`string`, `number`\>; `cachedReadTokens?`: `number`; `cacheSavingsUSD?`: `number`; `inputTokens?`: `number`; `llmCalls?`: `number`; `outputTokens?`: `number`; `totalUSD`: `number`; \}; `decisions?`: `object`[]; `disclaimer?`: `string`; `finalState?`: \{ `capacities?`: `Record`\<`string`, `number`\>; `environment?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `metrics`: `Record`\<`string`, `number`\>; `politics?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `statuses?`: `Record`\<`string`, `string` \| `boolean`\>; \}; `finalSwarm?`: \{ `agents`: `object`[]; `births?`: `number`; `deaths?`: `number`; `morale?`: `number`; `population`: `number`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `time`: `number`; `turn`: `number`; \}; `fingerprint?`: `Record`\<`string`, `string` \| `number`\>; `forgedTools?`: `object`[]; `intervention?`: \{ `adherenceProfile?`: \{ `expected`: `number`; `risks?`: `string`[]; \}; `category?`: `string`; `description`: `string`; `duration?`: \{ `unit`: `string`; `value`: `number`; \}; `id`: `string`; `mechanism?`: `string`; `name`: `string`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `targetBehaviors?`: `string`[]; \}; `leveragePoints?`: `string`[]; `metadata`: \{ `completedAt?`: `string`; `forkedFrom?`: \{ `atTurn`: `number`; `parentRunId`: `string`; \}; `mode`: `"turn-loop"` \| `"batch-trajectory"` \| `"batch-point"`; `runId`: `string`; `scenario`: \{ `id`: `string`; `name`: `string`; `version?`: `string`; \}; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `seed?`: `number`; `startedAt`: `string`; \}; `overview?`: `string`; `providerError?`: \{ `actionUrl?`: `string`; `kind`: `"unknown"` \| `"auth"` \| `"quota"` \| `"rate_limit"` \| `"network"`; `message`: `string`; `provider`: `string`; \} \| `null`; `riskFlags?`: `object`[]; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `specialistNotes?`: `object`[]; `subject?`: \{ `conditions?`: `string`[]; `id`: `string`; `markers?`: `object`[]; `name`: `string`; `personality?`: `Record`\<`string`, `number`\>; `profile?`: `Record`\<`string`, `unknown`\>; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `signals?`: `object`[]; \}; `trajectory?`: \{ `points?`: `object`[]; `timepoints?`: `object`[]; `timeUnit`: \{ `plural`: `string`; `singular`: `string`; \}; \}; \}\>

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:376](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L376)

Run a single simulation through this world with the given leader.
Delegates to runSimulation with `scenario` pinned to this
instance.

`keyPersonnel` is optional for parity with the underlying API; most
callers pass `[]` or omit it. The returned [RunArtifact](../type-aliases/RunArtifact.md) is
the universal Zod-validated contract exported from `paracosm/schema`.

When this WorldModel was produced by [WorldModel.fork](#fork) or
[WorldModel.forkFromArtifact](#forkfromartifact), the pending
`_resumeFrom` + `_forkedFrom` context is threaded into the
underlying runSimulation via the internal `_resumeFrom` /
`_forkedFrom` fields on [RunOptions](../interfaces/RunOptions.md). Both are cleared after
simulate() consumes them so a second simulate() on the same
WorldModel does not double-apply.

#### Parameters

##### opts

[`SimulateOptions`](../interfaces/SimulateOptions.md)

#### Returns

`Promise`\<\{ `aborted?`: `boolean`; `assumptions?`: `string`[]; `citations?`: `object`[]; `cost?`: \{ `breakdown?`: `Record`\<`string`, `number`\>; `cachedReadTokens?`: `number`; `cacheSavingsUSD?`: `number`; `inputTokens?`: `number`; `llmCalls?`: `number`; `outputTokens?`: `number`; `totalUSD`: `number`; \}; `decisions?`: `object`[]; `disclaimer?`: `string`; `finalState?`: \{ `capacities?`: `Record`\<`string`, `number`\>; `environment?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `metrics`: `Record`\<`string`, `number`\>; `politics?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `statuses?`: `Record`\<`string`, `string` \| `boolean`\>; \}; `finalSwarm?`: \{ `agents`: `object`[]; `births?`: `number`; `deaths?`: `number`; `morale?`: `number`; `population`: `number`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `time`: `number`; `turn`: `number`; \}; `fingerprint?`: `Record`\<`string`, `string` \| `number`\>; `forgedTools?`: `object`[]; `intervention?`: \{ `adherenceProfile?`: \{ `expected`: `number`; `risks?`: `string`[]; \}; `category?`: `string`; `description`: `string`; `duration?`: \{ `unit`: `string`; `value`: `number`; \}; `id`: `string`; `mechanism?`: `string`; `name`: `string`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `targetBehaviors?`: `string`[]; \}; `leveragePoints?`: `string`[]; `metadata`: \{ `completedAt?`: `string`; `forkedFrom?`: \{ `atTurn`: `number`; `parentRunId`: `string`; \}; `mode`: `"turn-loop"` \| `"batch-trajectory"` \| `"batch-point"`; `runId`: `string`; `scenario`: \{ `id`: `string`; `name`: `string`; `version?`: `string`; \}; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `seed?`: `number`; `startedAt`: `string`; \}; `overview?`: `string`; `providerError?`: \{ `actionUrl?`: `string`; `kind`: `"unknown"` \| `"auth"` \| `"quota"` \| `"rate_limit"` \| `"network"`; `message`: `string`; `provider`: `string`; \} \| `null`; `riskFlags?`: `object`[]; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `specialistNotes?`: `object`[]; `subject?`: \{ `conditions?`: `string`[]; `id`: `string`; `markers?`: `object`[]; `name`: `string`; `personality?`: `Record`\<`string`, `number`\>; `profile?`: `Record`\<`string`, `unknown`\>; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `signals?`: `object`[]; \}; `trajectory?`: \{ `points?`: `object`[]; `timepoints?`: `object`[]; `timeUnit`: \{ `plural`: `string`; `singular`: `string`; \}; \}; \}\>

***

### snapshot()

> **snapshot**(): [`WorldModelSnapshot`](../interfaces/WorldModelSnapshot.md)

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:524](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L524)

Capture a [WorldModelSnapshot](../interfaces/WorldModelSnapshot.md) of the state at the end of
this WorldModel's most recent `simulate()` call. Requires
`simulate(..., { captureSnapshots: true })` on that prior call;
throws with a clear pointer otherwise.

The returned snapshot is plain JSON-safe; serialize to disk with
`JSON.stringify` and reload with `JSON.parse` + `fork()`.

#### Returns

[`WorldModelSnapshot`](../interfaces/WorldModelSnapshot.md)

#### Throws

Error when this WorldModel has never run simulate(), or
  when the last simulate() did not set `captureSnapshots: true`.

***

### fromJson()

> `static` **fromJson**(`worldJson`, `options?`): `Promise`\<`WorldModel`\>

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:257](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L257)

Compile a raw scenario JSON into a runnable WorldModel.

Delegates to [compileScenario](../compiler/functions/compileScenario.md) under the hood; all
[CompileOptions](../compiler/interfaces/CompileOptions.md) (cache, provider, model, seed ingestion) are
supported.

#### Parameters

##### worldJson

`Record`\<`string`, `unknown`\>

##### options?

[`CompileOptions`](../compiler/interfaces/CompileOptions.md) = `{}`

#### Returns

`Promise`\<`WorldModel`\>

***

### fromPrompt()

> `static` **fromPrompt**(`seed`, `options?`): `Promise`\<`WorldModel`\>

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:295](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L295)

Compile a world model from prompt, brief, or document text (with an
optional domain hint and source URL). Delegates to
compileFromSeed: the LLM proposes a scenario draft against
`DraftScenarioSchema`, validates it, then routes it into the existing
[compileScenario](../compiler/functions/compileScenario.md) pipeline so the `seedText` research grounding
and hook generation stages still fire. JSON stays the canonical
contract; this wrapper only makes unstructured source material a
first-class authoring input.

#### Parameters

##### seed

`CompileFromSeedInput`

##### options?

`CompileFromSeedOptions` = `{}`

#### Returns

`Promise`\<`WorldModel`\>

#### Example

```ts
const wm = await WorldModel.fromPrompt({
  seedText: 'Q3 board brief: the company needs to decide between...',
  domainHint: 'corporate strategic decision',
}, { provider: 'anthropic' });
const result = await wm.quickstart({ actorCount: 3 });
```

***

### fromScenario()

> `static` **fromScenario**(`scenario`): `WorldModel`

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:272](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L272)

Wrap an already-compiled [ScenarioPackage](../interfaces/ScenarioPackage.md) (e.g. `marsScenario`,
`lunarScenario`, or any cached result of a prior `compileScenario`
call).

Pure construction, no I/O.

#### Parameters

##### scenario

[`ScenarioPackage`](../interfaces/ScenarioPackage.md)

#### Returns

`WorldModel`

***

### swarm()

> `static` **swarm**(`artifact`): \{ `agents`: `object`[]; `births?`: `number`; `deaths?`: `number`; `morale?`: `number`; `population`: `number`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `time`: `number`; `turn`: `number`; \} \| `undefined`

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:328](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L328)

Final agent-swarm snapshot from a [RunArtifact](../type-aliases/RunArtifact.md), or `undefined`
if the run did not produce one (e.g., batch-point modes that bypass
the turn loop). Equivalent to reading `artifact.finalSwarm` directly;
provided so consumers have a single import surface for swarm access.

#### Parameters

##### artifact

###### aborted?

`boolean` = `...`

###### assumptions?

`string`[] = `...`

Assumptions held true during the simulation.

###### citations?

`object`[] = `...`

###### cost?

\{ `breakdown?`: `Record`\<`string`, `number`\>; `cachedReadTokens?`: `number`; `cacheSavingsUSD?`: `number`; `inputTokens?`: `number`; `llmCalls?`: `number`; `outputTokens?`: `number`; `totalUSD`: `number`; \} = `...`

###### cost.breakdown?

`Record`\<`string`, `number`\> = `...`

Per-site / per-model breakdown: `{ director: 0.12, departments: 0.34 }`.

###### cost.cachedReadTokens?

`number` = `...`

###### cost.cacheSavingsUSD?

`number` = `...`

###### cost.inputTokens?

`number` = `...`

###### cost.llmCalls?

`number` = `...`

###### cost.outputTokens?

`number` = `...`

###### cost.totalUSD

`number` = `...`

###### decisions?

`object`[] = `...`

Every decision made during the run — one per commander choice in turn-loop.

###### disclaimer?

`string` = `...`

Scenario-supplied disclaimer (digital-twin simulations use this for medical / professional caveats).

###### finalState?

\{ `capacities?`: `Record`\<`string`, `number`\>; `environment?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `metrics`: `Record`\<`string`, `number`\>; `politics?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `statuses?`: `Record`\<`string`, `string` \| `boolean`\>; \} = `...`

###### finalState.capacities?

`Record`\<`string`, `number`\> = `...`

Capacity constraints: life support, housing, budget.

###### finalState.environment?

`Record`\<`string`, `string` \| `number` \| `boolean`\> = `...`

Environmental conditions: weather, radiation, depth, altitude.

###### finalState.metrics

`Record`\<`string`, `number`\> = `...`

Numeric gauges: food, power, population, morale, VO2max, whatever.

###### finalState.politics?

`Record`\<`string`, `string` \| `number` \| `boolean`\> = `...`

Political/social pressures. Values may be numeric or categorical.

###### finalState.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### finalState.statuses?

`Record`\<`string`, `string` \| `boolean`\> = `...`

Categorical state: governance status, alignment, phase.

###### finalSwarm?

\{ `agents`: `object`[]; `births?`: `number`; `deaths?`: `number`; `morale?`: `number`; `population`: `number`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `time`: `number`; `turn`: `number`; \} = `...`

Final agent-swarm roster at end-of-run. Pairs with `finalState`: the
world snapshot is the macro view (metrics, statuses), the swarm
snapshot is the micro view (every agent's role, mood, family edges,
memory). Populated in `turn-loop` runs that exercised the swarm.
Use `WorldModel.swarm()` for the live equivalent during a run.

###### finalSwarm.agents

`object`[] = `...`

Every agent in the swarm at snapshot time, alive or dead.

###### finalSwarm.births?

`number` = `...`

Number of births this turn.

###### finalSwarm.deaths?

`number` = `...`

Number of deaths this turn.

###### finalSwarm.morale?

`number` = `...`

Aggregate morale 0..1 (population-weighted).

###### finalSwarm.population

`number` = `...`

Aggregate counts derived from `agents`.

###### finalSwarm.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### finalSwarm.time

`number` = `...`

Scenario time at snapshot (years/quarters/ticks per scenario).

###### finalSwarm.turn

`number` = `...`

Turn number this snapshot was taken at (0-indexed).

###### fingerprint?

`Record`\<`string`, `string` \| `number`\> = `...`

Loose classification scores. Paracosm heritage; scenarios may extend.

###### forgedTools?

`object`[] = `...`

###### intervention?

\{ `adherenceProfile?`: \{ `expected`: `number`; `risks?`: `string`[]; \}; `category?`: `string`; `description`: `string`; `duration?`: \{ `unit`: `string`; `value`: `number`; \}; `id`: `string`; `mechanism?`: `string`; `name`: `string`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `targetBehaviors?`: `string`[]; \} = `...`

Intervention being tested on the subject.

###### intervention.adherenceProfile?

\{ `expected`: `number`; `risks?`: `string`[]; \} = `...`

###### intervention.adherenceProfile.expected

`number` = `...`

###### intervention.adherenceProfile.risks?

`string`[] = `...`

###### intervention.category?

`string` = `...`

###### intervention.description

`string` = `...`

###### intervention.duration?

\{ `unit`: `string`; `value`: `number`; \} = `...`

###### intervention.duration.unit

`string` = `...`

###### intervention.duration.value

`number` = `...`

###### intervention.id

`string` = `...`

###### intervention.mechanism?

`string` = `...`

###### intervention.name

`string` = `...`

###### intervention.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### intervention.targetBehaviors?

`string`[] = `...`

###### leveragePoints?

`string`[] = `...`

Actionable leverage points for consumers of the artifact.

###### metadata

\{ `completedAt?`: `string`; `forkedFrom?`: \{ `atTurn`: `number`; `parentRunId`: `string`; \}; `mode`: `"turn-loop"` \| `"batch-trajectory"` \| `"batch-point"`; `runId`: `string`; `scenario`: \{ `id`: `string`; `name`: `string`; `version?`: `string`; \}; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `seed?`: `number`; `startedAt`: `string`; \} = `RunMetadataSchema`

Required. Identifies the run + scenario + mode.

###### metadata.completedAt?

`string` = `...`

###### metadata.forkedFrom?

\{ `atTurn`: `number`; `parentRunId`: `string`; \} = `...`

When this run was produced by forking a prior run, records the
parent run-id + the turn at which the fork happened. Consumers
walking a fork chain follow this link transitively through
stored artifacts. Omitted for fresh (non-forked) runs.

Added in 0.7.x with the WorldModel.fork() API. Additive +
optional; no COMPILE_SCHEMA_VERSION bump required.

###### metadata.forkedFrom.atTurn

`number` = `...`

###### metadata.forkedFrom.parentRunId

`string` = `...`

###### metadata.mode

`"turn-loop"` \| `"batch-trajectory"` \| `"batch-point"` = `SimulationModeSchema`

###### metadata.runId

`string` = `...`

Unique identifier for this run. UUID, slug, or host-assigned id.

###### metadata.scenario

\{ `id`: `string`; `name`: `string`; `version?`: `string`; \} = `...`

###### metadata.scenario.id

`string` = `...`

###### metadata.scenario.name

`string` = `...`

###### metadata.scenario.version?

`string` = `...`

Scenario version; not artifact version. Optional.

###### metadata.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### metadata.seed?

`number` = `...`

Absent for non-deterministic runs (LLM-only synthesis without a seeded kernel).

###### metadata.startedAt

`string` = `...`

###### overview?

`string` = `...`

Short headline summary. Digital-twin `overview`, paracosm verdict's
`summary`, a game's end-of-run narrator line.

###### providerError?

\{ `actionUrl?`: `string`; `kind`: `"unknown"` \| `"auth"` \| `"quota"` \| `"rate_limit"` \| `"network"`; `message`: `string`; `provider`: `string`; \} \| `null` = `...`

###### riskFlags?

`object`[] = `...`

Risk callouts. Maps to digital-twin `risk_flags` after camelCase rename.

###### scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### specialistNotes?

`object`[] = `...`

Specialist analyses across domains. Flat list; multiple entries per domain/turn OK.

###### subject?

\{ `conditions?`: `string`[]; `id`: `string`; `markers?`: `object`[]; `name`: `string`; `personality?`: `Record`\<`string`, `number`\>; `profile?`: `Record`\<`string`, `unknown`\>; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `signals?`: `object`[]; \} = `...`

Subject being simulated (person, character, organism, vessel, etc.).

###### subject.conditions?

`string`[] = `...`

###### subject.id

`string` = `...`

###### subject.markers?

`object`[] = `...`

###### subject.name

`string` = `...`

###### subject.personality?

`Record`\<`string`, `number`\> = `...`

###### subject.profile?

`Record`\<`string`, `unknown`\> = `...`

###### subject.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### subject.signals?

`object`[] = `...`

###### trajectory?

\{ `points?`: `object`[]; `timepoints?`: `object`[]; `timeUnit`: \{ `plural`: `string`; `singular`: `string`; \}; \} = `...`

Labeled trajectory of the simulation. `trajectory.points` for sparklines,
`trajectory.timepoints` for rich labeled snapshots. Both optional; at
least one populated in `turn-loop` and `batch-trajectory` modes.

###### trajectory.points?

`object`[] = `...`

Lightweight per-sample metric records; good for sparklines.

###### trajectory.timepoints?

`object`[] = `...`

Rich labeled snapshots with narrative + score; good for timepoint cards.

###### trajectory.timeUnit

\{ `plural`: `string`; `singular`: `string`; \} = `...`

###### trajectory.timeUnit.plural

`string` = `...`

###### trajectory.timeUnit.singular

`string` = `...`

#### Returns

\{ `agents`: `object`[]; `births?`: `number`; `deaths?`: `number`; `morale?`: `number`; `population`: `number`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `time`: `number`; `turn`: `number`; \}

##### agents

> **agents**: `object`[]

Every agent in the swarm at snapshot time, alive or dead.

##### births?

> `optional` **births**: `number`

Number of births this turn.

##### deaths?

> `optional` **deaths**: `number`

Number of deaths this turn.

##### morale?

> `optional` **morale**: `number`

Aggregate morale 0..1 (population-weighted).

##### population

> **population**: `number`

Aggregate counts derived from `agents`.

##### scenarioExtensions?

> `optional` **scenarioExtensions**: `Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

##### time

> **time**: `number`

Scenario time at snapshot (years/quarters/ticks per scenario).

##### turn

> **turn**: `number`

Turn number this snapshot was taken at (0-indexed).

`undefined`

#### Example

```ts
const result = await wm.simulate(leader, { maxTurns: 6 });
const swarm = WorldModel.swarm(result);
if (swarm) {
  console.log(`T${swarm.turn}: ${swarm.population} agents`);
  for (const a of swarm.agents) console.log(`  ${a.name} · ${a.department} · ${a.mood}`);
}
```

***

### swarmByDepartment()

> `static` **swarmByDepartment**(`artifact`): `Record`\<`string`, [`SwarmAgent`](../schema/type-aliases/SwarmAgent.md)[]\>

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:341](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L341)

Group the swarm by department. Returns a map keyed by department
label; values are the (alive + dead) agents in that department,
preserving insertion order from the snapshot. Delegates to
import('paracosm/swarm').swarmByDepartment.

Useful for org-chart-style summaries: "Engineering: 18 agents (15
alive). Lead: Maria Chen."

#### Parameters

##### artifact

###### aborted?

`boolean` = `...`

###### assumptions?

`string`[] = `...`

Assumptions held true during the simulation.

###### citations?

`object`[] = `...`

###### cost?

\{ `breakdown?`: `Record`\<`string`, `number`\>; `cachedReadTokens?`: `number`; `cacheSavingsUSD?`: `number`; `inputTokens?`: `number`; `llmCalls?`: `number`; `outputTokens?`: `number`; `totalUSD`: `number`; \} = `...`

###### cost.breakdown?

`Record`\<`string`, `number`\> = `...`

Per-site / per-model breakdown: `{ director: 0.12, departments: 0.34 }`.

###### cost.cachedReadTokens?

`number` = `...`

###### cost.cacheSavingsUSD?

`number` = `...`

###### cost.inputTokens?

`number` = `...`

###### cost.llmCalls?

`number` = `...`

###### cost.outputTokens?

`number` = `...`

###### cost.totalUSD

`number` = `...`

###### decisions?

`object`[] = `...`

Every decision made during the run — one per commander choice in turn-loop.

###### disclaimer?

`string` = `...`

Scenario-supplied disclaimer (digital-twin simulations use this for medical / professional caveats).

###### finalState?

\{ `capacities?`: `Record`\<`string`, `number`\>; `environment?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `metrics`: `Record`\<`string`, `number`\>; `politics?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `statuses?`: `Record`\<`string`, `string` \| `boolean`\>; \} = `...`

###### finalState.capacities?

`Record`\<`string`, `number`\> = `...`

Capacity constraints: life support, housing, budget.

###### finalState.environment?

`Record`\<`string`, `string` \| `number` \| `boolean`\> = `...`

Environmental conditions: weather, radiation, depth, altitude.

###### finalState.metrics

`Record`\<`string`, `number`\> = `...`

Numeric gauges: food, power, population, morale, VO2max, whatever.

###### finalState.politics?

`Record`\<`string`, `string` \| `number` \| `boolean`\> = `...`

Political/social pressures. Values may be numeric or categorical.

###### finalState.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### finalState.statuses?

`Record`\<`string`, `string` \| `boolean`\> = `...`

Categorical state: governance status, alignment, phase.

###### finalSwarm?

\{ `agents`: `object`[]; `births?`: `number`; `deaths?`: `number`; `morale?`: `number`; `population`: `number`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `time`: `number`; `turn`: `number`; \} = `...`

Final agent-swarm roster at end-of-run. Pairs with `finalState`: the
world snapshot is the macro view (metrics, statuses), the swarm
snapshot is the micro view (every agent's role, mood, family edges,
memory). Populated in `turn-loop` runs that exercised the swarm.
Use `WorldModel.swarm()` for the live equivalent during a run.

###### finalSwarm.agents

`object`[] = `...`

Every agent in the swarm at snapshot time, alive or dead.

###### finalSwarm.births?

`number` = `...`

Number of births this turn.

###### finalSwarm.deaths?

`number` = `...`

Number of deaths this turn.

###### finalSwarm.morale?

`number` = `...`

Aggregate morale 0..1 (population-weighted).

###### finalSwarm.population

`number` = `...`

Aggregate counts derived from `agents`.

###### finalSwarm.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### finalSwarm.time

`number` = `...`

Scenario time at snapshot (years/quarters/ticks per scenario).

###### finalSwarm.turn

`number` = `...`

Turn number this snapshot was taken at (0-indexed).

###### fingerprint?

`Record`\<`string`, `string` \| `number`\> = `...`

Loose classification scores. Paracosm heritage; scenarios may extend.

###### forgedTools?

`object`[] = `...`

###### intervention?

\{ `adherenceProfile?`: \{ `expected`: `number`; `risks?`: `string`[]; \}; `category?`: `string`; `description`: `string`; `duration?`: \{ `unit`: `string`; `value`: `number`; \}; `id`: `string`; `mechanism?`: `string`; `name`: `string`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `targetBehaviors?`: `string`[]; \} = `...`

Intervention being tested on the subject.

###### intervention.adherenceProfile?

\{ `expected`: `number`; `risks?`: `string`[]; \} = `...`

###### intervention.adherenceProfile.expected

`number` = `...`

###### intervention.adherenceProfile.risks?

`string`[] = `...`

###### intervention.category?

`string` = `...`

###### intervention.description

`string` = `...`

###### intervention.duration?

\{ `unit`: `string`; `value`: `number`; \} = `...`

###### intervention.duration.unit

`string` = `...`

###### intervention.duration.value

`number` = `...`

###### intervention.id

`string` = `...`

###### intervention.mechanism?

`string` = `...`

###### intervention.name

`string` = `...`

###### intervention.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### intervention.targetBehaviors?

`string`[] = `...`

###### leveragePoints?

`string`[] = `...`

Actionable leverage points for consumers of the artifact.

###### metadata

\{ `completedAt?`: `string`; `forkedFrom?`: \{ `atTurn`: `number`; `parentRunId`: `string`; \}; `mode`: `"turn-loop"` \| `"batch-trajectory"` \| `"batch-point"`; `runId`: `string`; `scenario`: \{ `id`: `string`; `name`: `string`; `version?`: `string`; \}; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `seed?`: `number`; `startedAt`: `string`; \} = `RunMetadataSchema`

Required. Identifies the run + scenario + mode.

###### metadata.completedAt?

`string` = `...`

###### metadata.forkedFrom?

\{ `atTurn`: `number`; `parentRunId`: `string`; \} = `...`

When this run was produced by forking a prior run, records the
parent run-id + the turn at which the fork happened. Consumers
walking a fork chain follow this link transitively through
stored artifacts. Omitted for fresh (non-forked) runs.

Added in 0.7.x with the WorldModel.fork() API. Additive +
optional; no COMPILE_SCHEMA_VERSION bump required.

###### metadata.forkedFrom.atTurn

`number` = `...`

###### metadata.forkedFrom.parentRunId

`string` = `...`

###### metadata.mode

`"turn-loop"` \| `"batch-trajectory"` \| `"batch-point"` = `SimulationModeSchema`

###### metadata.runId

`string` = `...`

Unique identifier for this run. UUID, slug, or host-assigned id.

###### metadata.scenario

\{ `id`: `string`; `name`: `string`; `version?`: `string`; \} = `...`

###### metadata.scenario.id

`string` = `...`

###### metadata.scenario.name

`string` = `...`

###### metadata.scenario.version?

`string` = `...`

Scenario version; not artifact version. Optional.

###### metadata.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### metadata.seed?

`number` = `...`

Absent for non-deterministic runs (LLM-only synthesis without a seeded kernel).

###### metadata.startedAt

`string` = `...`

###### overview?

`string` = `...`

Short headline summary. Digital-twin `overview`, paracosm verdict's
`summary`, a game's end-of-run narrator line.

###### providerError?

\{ `actionUrl?`: `string`; `kind`: `"unknown"` \| `"auth"` \| `"quota"` \| `"rate_limit"` \| `"network"`; `message`: `string`; `provider`: `string`; \} \| `null` = `...`

###### riskFlags?

`object`[] = `...`

Risk callouts. Maps to digital-twin `risk_flags` after camelCase rename.

###### scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### specialistNotes?

`object`[] = `...`

Specialist analyses across domains. Flat list; multiple entries per domain/turn OK.

###### subject?

\{ `conditions?`: `string`[]; `id`: `string`; `markers?`: `object`[]; `name`: `string`; `personality?`: `Record`\<`string`, `number`\>; `profile?`: `Record`\<`string`, `unknown`\>; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `signals?`: `object`[]; \} = `...`

Subject being simulated (person, character, organism, vessel, etc.).

###### subject.conditions?

`string`[] = `...`

###### subject.id

`string` = `...`

###### subject.markers?

`object`[] = `...`

###### subject.name

`string` = `...`

###### subject.personality?

`Record`\<`string`, `number`\> = `...`

###### subject.profile?

`Record`\<`string`, `unknown`\> = `...`

###### subject.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### subject.signals?

`object`[] = `...`

###### trajectory?

\{ `points?`: `object`[]; `timepoints?`: `object`[]; `timeUnit`: \{ `plural`: `string`; `singular`: `string`; \}; \} = `...`

Labeled trajectory of the simulation. `trajectory.points` for sparklines,
`trajectory.timepoints` for rich labeled snapshots. Both optional; at
least one populated in `turn-loop` and `batch-trajectory` modes.

###### trajectory.points?

`object`[] = `...`

Lightweight per-sample metric records; good for sparklines.

###### trajectory.timepoints?

`object`[] = `...`

Rich labeled snapshots with narrative + score; good for timepoint cards.

###### trajectory.timeUnit

\{ `plural`: `string`; `singular`: `string`; \} = `...`

###### trajectory.timeUnit.plural

`string` = `...`

###### trajectory.timeUnit.singular

`string` = `...`

#### Returns

`Record`\<`string`, [`SwarmAgent`](../schema/type-aliases/SwarmAgent.md)[]\>

***

### swarmFamilyTree()

> `static` **swarmFamilyTree**(`artifact`): `Record`\<`string`, `string`[]\>

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:355](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L355)

Build a family-tree adjacency map from the swarm: parent agentId →
list of direct-descendant agentIds. Edge direction is parent→child;
walk the map recursively to render multi-generation trees. Founders
(no parent in the swarm) are the roots. Delegates to
import('paracosm/swarm').swarmFamilyTree.

Returns an empty object when the run produced no swarm or the
scenario does not track family edges.

#### Parameters

##### artifact

###### aborted?

`boolean` = `...`

###### assumptions?

`string`[] = `...`

Assumptions held true during the simulation.

###### citations?

`object`[] = `...`

###### cost?

\{ `breakdown?`: `Record`\<`string`, `number`\>; `cachedReadTokens?`: `number`; `cacheSavingsUSD?`: `number`; `inputTokens?`: `number`; `llmCalls?`: `number`; `outputTokens?`: `number`; `totalUSD`: `number`; \} = `...`

###### cost.breakdown?

`Record`\<`string`, `number`\> = `...`

Per-site / per-model breakdown: `{ director: 0.12, departments: 0.34 }`.

###### cost.cachedReadTokens?

`number` = `...`

###### cost.cacheSavingsUSD?

`number` = `...`

###### cost.inputTokens?

`number` = `...`

###### cost.llmCalls?

`number` = `...`

###### cost.outputTokens?

`number` = `...`

###### cost.totalUSD

`number` = `...`

###### decisions?

`object`[] = `...`

Every decision made during the run — one per commander choice in turn-loop.

###### disclaimer?

`string` = `...`

Scenario-supplied disclaimer (digital-twin simulations use this for medical / professional caveats).

###### finalState?

\{ `capacities?`: `Record`\<`string`, `number`\>; `environment?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `metrics`: `Record`\<`string`, `number`\>; `politics?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `statuses?`: `Record`\<`string`, `string` \| `boolean`\>; \} = `...`

###### finalState.capacities?

`Record`\<`string`, `number`\> = `...`

Capacity constraints: life support, housing, budget.

###### finalState.environment?

`Record`\<`string`, `string` \| `number` \| `boolean`\> = `...`

Environmental conditions: weather, radiation, depth, altitude.

###### finalState.metrics

`Record`\<`string`, `number`\> = `...`

Numeric gauges: food, power, population, morale, VO2max, whatever.

###### finalState.politics?

`Record`\<`string`, `string` \| `number` \| `boolean`\> = `...`

Political/social pressures. Values may be numeric or categorical.

###### finalState.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### finalState.statuses?

`Record`\<`string`, `string` \| `boolean`\> = `...`

Categorical state: governance status, alignment, phase.

###### finalSwarm?

\{ `agents`: `object`[]; `births?`: `number`; `deaths?`: `number`; `morale?`: `number`; `population`: `number`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `time`: `number`; `turn`: `number`; \} = `...`

Final agent-swarm roster at end-of-run. Pairs with `finalState`: the
world snapshot is the macro view (metrics, statuses), the swarm
snapshot is the micro view (every agent's role, mood, family edges,
memory). Populated in `turn-loop` runs that exercised the swarm.
Use `WorldModel.swarm()` for the live equivalent during a run.

###### finalSwarm.agents

`object`[] = `...`

Every agent in the swarm at snapshot time, alive or dead.

###### finalSwarm.births?

`number` = `...`

Number of births this turn.

###### finalSwarm.deaths?

`number` = `...`

Number of deaths this turn.

###### finalSwarm.morale?

`number` = `...`

Aggregate morale 0..1 (population-weighted).

###### finalSwarm.population

`number` = `...`

Aggregate counts derived from `agents`.

###### finalSwarm.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### finalSwarm.time

`number` = `...`

Scenario time at snapshot (years/quarters/ticks per scenario).

###### finalSwarm.turn

`number` = `...`

Turn number this snapshot was taken at (0-indexed).

###### fingerprint?

`Record`\<`string`, `string` \| `number`\> = `...`

Loose classification scores. Paracosm heritage; scenarios may extend.

###### forgedTools?

`object`[] = `...`

###### intervention?

\{ `adherenceProfile?`: \{ `expected`: `number`; `risks?`: `string`[]; \}; `category?`: `string`; `description`: `string`; `duration?`: \{ `unit`: `string`; `value`: `number`; \}; `id`: `string`; `mechanism?`: `string`; `name`: `string`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `targetBehaviors?`: `string`[]; \} = `...`

Intervention being tested on the subject.

###### intervention.adherenceProfile?

\{ `expected`: `number`; `risks?`: `string`[]; \} = `...`

###### intervention.adherenceProfile.expected

`number` = `...`

###### intervention.adherenceProfile.risks?

`string`[] = `...`

###### intervention.category?

`string` = `...`

###### intervention.description

`string` = `...`

###### intervention.duration?

\{ `unit`: `string`; `value`: `number`; \} = `...`

###### intervention.duration.unit

`string` = `...`

###### intervention.duration.value

`number` = `...`

###### intervention.id

`string` = `...`

###### intervention.mechanism?

`string` = `...`

###### intervention.name

`string` = `...`

###### intervention.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### intervention.targetBehaviors?

`string`[] = `...`

###### leveragePoints?

`string`[] = `...`

Actionable leverage points for consumers of the artifact.

###### metadata

\{ `completedAt?`: `string`; `forkedFrom?`: \{ `atTurn`: `number`; `parentRunId`: `string`; \}; `mode`: `"turn-loop"` \| `"batch-trajectory"` \| `"batch-point"`; `runId`: `string`; `scenario`: \{ `id`: `string`; `name`: `string`; `version?`: `string`; \}; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `seed?`: `number`; `startedAt`: `string`; \} = `RunMetadataSchema`

Required. Identifies the run + scenario + mode.

###### metadata.completedAt?

`string` = `...`

###### metadata.forkedFrom?

\{ `atTurn`: `number`; `parentRunId`: `string`; \} = `...`

When this run was produced by forking a prior run, records the
parent run-id + the turn at which the fork happened. Consumers
walking a fork chain follow this link transitively through
stored artifacts. Omitted for fresh (non-forked) runs.

Added in 0.7.x with the WorldModel.fork() API. Additive +
optional; no COMPILE_SCHEMA_VERSION bump required.

###### metadata.forkedFrom.atTurn

`number` = `...`

###### metadata.forkedFrom.parentRunId

`string` = `...`

###### metadata.mode

`"turn-loop"` \| `"batch-trajectory"` \| `"batch-point"` = `SimulationModeSchema`

###### metadata.runId

`string` = `...`

Unique identifier for this run. UUID, slug, or host-assigned id.

###### metadata.scenario

\{ `id`: `string`; `name`: `string`; `version?`: `string`; \} = `...`

###### metadata.scenario.id

`string` = `...`

###### metadata.scenario.name

`string` = `...`

###### metadata.scenario.version?

`string` = `...`

Scenario version; not artifact version. Optional.

###### metadata.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### metadata.seed?

`number` = `...`

Absent for non-deterministic runs (LLM-only synthesis without a seeded kernel).

###### metadata.startedAt

`string` = `...`

###### overview?

`string` = `...`

Short headline summary. Digital-twin `overview`, paracosm verdict's
`summary`, a game's end-of-run narrator line.

###### providerError?

\{ `actionUrl?`: `string`; `kind`: `"unknown"` \| `"auth"` \| `"quota"` \| `"rate_limit"` \| `"network"`; `message`: `string`; `provider`: `string`; \} \| `null` = `...`

###### riskFlags?

`object`[] = `...`

Risk callouts. Maps to digital-twin `risk_flags` after camelCase rename.

###### scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### specialistNotes?

`object`[] = `...`

Specialist analyses across domains. Flat list; multiple entries per domain/turn OK.

###### subject?

\{ `conditions?`: `string`[]; `id`: `string`; `markers?`: `object`[]; `name`: `string`; `personality?`: `Record`\<`string`, `number`\>; `profile?`: `Record`\<`string`, `unknown`\>; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `signals?`: `object`[]; \} = `...`

Subject being simulated (person, character, organism, vessel, etc.).

###### subject.conditions?

`string`[] = `...`

###### subject.id

`string` = `...`

###### subject.markers?

`object`[] = `...`

###### subject.name

`string` = `...`

###### subject.personality?

`Record`\<`string`, `number`\> = `...`

###### subject.profile?

`Record`\<`string`, `unknown`\> = `...`

###### subject.scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

###### subject.signals?

`object`[] = `...`

###### trajectory?

\{ `points?`: `object`[]; `timepoints?`: `object`[]; `timeUnit`: \{ `plural`: `string`; `singular`: `string`; \}; \} = `...`

Labeled trajectory of the simulation. `trajectory.points` for sparklines,
`trajectory.timepoints` for rich labeled snapshots. Both optional; at
least one populated in `turn-loop` and `batch-trajectory` modes.

###### trajectory.points?

`object`[] = `...`

Lightweight per-sample metric records; good for sparklines.

###### trajectory.timepoints?

`object`[] = `...`

Rich labeled snapshots with narrative + score; good for timepoint cards.

###### trajectory.timeUnit

\{ `plural`: `string`; `singular`: `string`; \} = `...`

###### trajectory.timeUnit.plural

`string` = `...`

###### trajectory.timeUnit.singular

`string` = `...`

#### Returns

`Record`\<`string`, `string`[]\>
