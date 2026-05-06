# Interface: SimulateOptions

Defined in: [apps/paracosm/src/api/types.ts:108](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/api/types.ts#L108)

Options-bag for `wm.simulate`. Replaces the v0.8 positional form
`simulate(leader, options, keyPersonnel)`. Extends the full internal
RunOptions (provider keys, economics, initial population, etc.) and
adds `actor` + `keyPersonnel` so visitor-facing call sites need only
one argument.

## Extends

- `RunOptions`

## Extended by

- [`InterveneOptions`](InterveneOptions.md)

## Properties

### \_forkedFrom?

> `optional` **\_forkedFrom**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:381](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L381)

Internal-only: `WorldModel.fork()` sets this to thread the
`{ parentRunId, atTurn }` link onto the child run's
`metadata.forkedFrom`. Not part of the public API; callers should
use `WorldModel.fork()` rather than setting this directly.

#### atTurn

> **atTurn**: `number`

#### parentRunId

> **parentRunId**: `string`

#### Inherited from

`InternalRunOptions._forkedFrom`

***

### \_resumeFrom?

> `optional` **\_resumeFrom**: `KernelSnapshot`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:387](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L387)

Internal-only: `WorldModel.fork()` sets this to a
KernelSnapshot that the orchestrator restores before
running the first turn. Not part of the public API.

#### Inherited from

[`InterveneOptions`](InterveneOptions.md).[`_resumeFrom`](InterveneOptions.md#_resumefrom)

***

### activeDepartments?

> `optional` **activeDepartments**: `string`[]

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:361](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L361)

#### Inherited from

`InternalRunOptions.activeDepartments`

***

### actor

> **actor**: [`ActorConfig`](ActorConfig.md)

Defined in: [apps/paracosm/src/api/types.ts:110](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/api/types.ts#L110)

The actor whose decisions drive the simulation.

***

### anthropicKey?

> `optional` **anthropicKey**: `string`

Defined in: [apps/paracosm/src/engine/provider-credentials.ts:8](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/provider-credentials.ts#L8)

Anthropic API key.

#### Inherited from

`InternalRunOptions.anthropicKey`

***

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [apps/paracosm/src/engine/provider-credentials.ts:6](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/provider-credentials.ts#L6)

OpenAI API key. Historical dashboard field name.

#### Inherited from

`InternalRunOptions.apiKey`

***

### braveKey?

> `optional` **braveKey**: `string`

Defined in: [apps/paracosm/src/engine/provider-credentials.ts:16](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/provider-credentials.ts#L16)

#### Inherited from

`InternalRunOptions.braveKey`

***

### captureSnapshots?

> `optional` **captureSnapshots**: `boolean`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:374](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L374)

When true, the orchestrator captures a KernelSnapshot at
the end of every turn and stashes the resulting array under
`artifact.scenarioExtensions.kernelSnapshotsPerTurn`. Enables
`WorldModel.forkFromArtifact()` on the returned artifact. Default
false so normal runs stay lean; snapshots add ~100 KB per turn
for 100-agent Mars-shape runs.

#### Inherited from

`InternalRunOptions.captureSnapshots`

***

### cohereKey?

> `optional` **cohereKey**: `string`

Defined in: [apps/paracosm/src/engine/provider-credentials.ts:17](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/provider-credentials.ts#L17)

#### Inherited from

`InternalRunOptions.cohereKey`

***

### costPreset?

> `optional` **costPreset**: `CostPreset`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:405](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L405)

Cost-vs-quality switch for model routing. Defaults to `'quality'`
which keeps department agents on the flagship tier (gpt-5.4 /
claude-sonnet-4-6) for reliable tool forging — ~$1-3 per 6-turn run
on OpenAI. Set to `'economy'` to drop every role to mid/cheap
(gpt-4o departments, gpt-5.4-nano everything else; haiku on
Anthropic) — ~$0.20-0.60 per 6-turn run on OpenAI, ~5-10× cheaper.

Economy mode drops forge approval rate by roughly 10-20pp because
the mid-tier model occasionally violates structured-output schemas
the judge rejects. Use it for quick iteration / debugging / CI;
use `'quality'` (default) for publishable or production runs.

Explicit `models` entries always win over the preset, so you can
mix and match: `{ costPreset: 'economy', models: { departments:
'gpt-5.4' } }` gives you cheap everything except departments.

#### Inherited from

`InternalRunOptions.costPreset`

***

### customEvents?

> `optional` **customEvents**: `object`[]

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:364](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L364)

#### description

> **description**: `string`

#### title

> **title**: `string`

#### turn

> **turn**: `number`

#### Inherited from

`InternalRunOptions.customEvents`

***

### economics?

> `optional` **economics**: `ResolvedEconomicsProfile`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:406](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L406)

#### Inherited from

`InternalRunOptions.economics`

***

### execution?

> `optional` **execution**: `Partial`\<`SimulationExecutionConfig`\>

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:412](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L412)

#### Inherited from

`InternalRunOptions.execution`

***

### firecrawlKey?

> `optional` **firecrawlKey**: `string`

Defined in: [apps/paracosm/src/engine/provider-credentials.ts:14](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/provider-credentials.ts#L14)

#### Inherited from

`InternalRunOptions.firecrawlKey`

***

### initialPopulation?

> `optional` **initialPopulation**: `number`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:407](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L407)

#### Inherited from

`InternalRunOptions.initialPopulation`

***

### intervention?

> `optional` **intervention**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:436](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L436)

Intervention being tested on the subject. Passed through verbatim to
`RunArtifact.intervention`. Turn-loop ignores; batch modes consume.

#### adherenceProfile?

> `optional` **adherenceProfile**: `object`

##### adherenceProfile.expected

> **expected**: `number`

##### adherenceProfile.risks?

> `optional` **risks**: `string`[]

#### category?

> `optional` **category**: `string`

#### description

> **description**: `string`

#### duration?

> `optional` **duration**: `object`

##### duration.unit

> **unit**: `string`

##### duration.value

> **value**: `number`

#### id

> **id**: `string`

#### mechanism?

> `optional` **mechanism**: `string`

#### name

> **name**: `string`

#### scenarioExtensions?

> `optional` **scenarioExtensions**: `Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

#### targetBehaviors?

> `optional` **targetBehaviors**: `string`[]

#### Inherited from

`InternalRunOptions.intervention`

***

### keyPersonnel?

> `optional` **keyPersonnel**: [`KeyPersonnel`](KeyPersonnel.md)[]

Defined in: [apps/paracosm/src/api/types.ts:112](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/api/types.ts#L112)

Optional supporting cast for context retrieval. Default [].

***

### liveSearch?

> `optional` **liveSearch**: `boolean`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:360](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L360)

#### Inherited from

`InternalRunOptions.liveSearch`

***

### maxTurns?

> `optional` **maxTurns**: `number`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:356](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L356)

#### Inherited from

`InternalRunOptions.maxTurns`

***

### models?

> `optional` **models**: `Partial`\<[`SimulationModelConfig`](SimulationModelConfig.md)\>

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:365](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L365)

#### Inherited from

`InternalRunOptions.models`

***

### onEvent()?

> `optional` **onEvent**: (`event`) => `void`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:363](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L363)

#### Parameters

##### event

`SimEvent`

#### Returns

`void`

#### Inherited from

`InternalRunOptions.onEvent`

***

### provider?

> `optional` **provider**: `LlmProvider`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:362](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L362)

#### Inherited from

`InternalRunOptions.provider`

***

### scenario?

> `optional` **scenario**: [`ScenarioPackage`](ScenarioPackage.md)

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:413](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L413)

#### Inherited from

`InternalRunOptions.scenario`

***

### seed?

> `optional` **seed**: `number`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:357](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L357)

#### Inherited from

`InternalRunOptions.seed`

***

### serperKey?

> `optional` **serperKey**: `string`

Defined in: [apps/paracosm/src/engine/provider-credentials.ts:13](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/provider-credentials.ts#L13)

#### Inherited from

`InternalRunOptions.serperKey`

***

### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:424](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L424)

Cancellation signal. When `.aborted` flips to true, the turn loop
short-circuits at the next turn boundary, emits a `sim_aborted`
event, and returns the partial result accumulated so far.

Server wires this to an AbortController that fires after a grace
period of zero connected SSE clients, so a user who closes the tab
or navigates away stops billing for new LLM calls while preserving
the partial results they already accumulated in the event buffer.

#### Inherited from

`InternalRunOptions.signal`

***

### startingEnvironment?

> `optional` **startingEnvironment**: `Record`\<`string`, `string` \| `number` \| `boolean`\>

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:411](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L411)

#### Inherited from

[`InterveneOptions`](InterveneOptions.md).[`startingEnvironment`](InterveneOptions.md#startingenvironment)

***

### startingPolitics?

> `optional` **startingPolitics**: `StartingPolitics`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:409](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L409)

#### Inherited from

`InternalRunOptions.startingPolitics`

***

### startingResources?

> `optional` **startingResources**: `StartingResources`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:408](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L408)

#### Inherited from

`InternalRunOptions.startingResources`

***

### startingStatuses?

> `optional` **startingStatuses**: `Record`\<`string`, `string` \| `boolean`\>

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:410](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L410)

#### Inherited from

[`InterveneOptions`](InterveneOptions.md).[`startingStatuses`](InterveneOptions.md#startingstatuses)

***

### startTime?

> `optional` **startTime**: `number`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:358](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L358)

#### Inherited from

`InternalRunOptions.startTime`

***

### subject?

> `optional` **subject**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:431](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L431)

Subject being simulated (digital-twin person, game character,
etc.). Passed through verbatim to `RunArtifact.subject`.
Turn-loop mode does not consume this semantically; future
batch-trajectory executor will.

#### conditions?

> `optional` **conditions**: `string`[]

#### id

> **id**: `string`

#### markers?

> `optional` **markers**: `object`[]

#### name

> **name**: `string`

#### personality?

> `optional` **personality**: `Record`\<`string`, `number`\>

#### profile?

> `optional` **profile**: `Record`\<`string`, `unknown`\>

#### scenarioExtensions?

> `optional` **scenarioExtensions**: `Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

#### signals?

> `optional` **signals**: `object`[]

#### Inherited from

`InternalRunOptions.subject`

***

### tavilyKey?

> `optional` **tavilyKey**: `string`

Defined in: [apps/paracosm/src/engine/provider-credentials.ts:15](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/provider-credentials.ts#L15)

#### Inherited from

`InternalRunOptions.tavilyKey`

***

### timePerTurn?

> `optional` **timePerTurn**: `number`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:359](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/orchestrator.ts#L359)

#### Inherited from

`InternalRunOptions.timePerTurn`
