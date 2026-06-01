# Interface: InterveneOptions

Defined in: [apps/paracosm/src/api/types.ts:122](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/api/types.ts#L122)

Options-bag for `wm.intervene`. Adds subject + intervention to
SimulateOptions. Replaces the v0.8 `simulateIntervention(subject,
intervention, leader, opts)` 4-positional form.

## Extends

- [`SimulateOptions`](SimulateOptions.md)

## Properties

### \_forkedFrom?

> `optional` **\_forkedFrom**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator/index.ts:381](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/orchestrator/index.ts#L381)

Internal-only: `WorldModel.fork()` sets this to thread the
`{ parentRunId, atTurn }` link onto the child run's
`metadata.forkedFrom`. Not part of the public API; callers should
use `WorldModel.fork()` rather than setting this directly.

#### atTurn

> **atTurn**: `number`

#### parentRunId

> **parentRunId**: `string`

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`_forkedFrom`](SimulateOptions.md#_forkedfrom)

***

### \_resumeFrom?

> `optional` **\_resumeFrom**: `KernelSnapshot`

Defined in: [apps/paracosm/src/runtime/orchestrator/index.ts:387](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/orchestrator/index.ts#L387)

Internal-only: `WorldModel.fork()` sets this to a
KernelSnapshot that the orchestrator restores before
running the first turn. Not part of the public API.

#### Inherited from

`InterveneOptions`.[`_resumeFrom`](#_resumefrom)

***

### activeDepartments?

> `optional` **activeDepartments**: `string`[]

Defined in: [apps/paracosm/src/runtime/orchestrator/index.ts:361](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/orchestrator/index.ts#L361)

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`activeDepartments`](SimulateOptions.md#activedepartments)

***

### actor

> **actor**: [`ActorConfig`](ActorConfig.md)

Defined in: [apps/paracosm/src/api/types.ts:110](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/api/types.ts#L110)

The actor whose decisions drive the simulation.

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`actor`](SimulateOptions.md#actor)

***

### anthropicKey?

> `optional` **anthropicKey**: `string`

Defined in: [apps/paracosm/src/engine/provider/credentials.ts:8](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/provider/credentials.ts#L8)

Anthropic API key.

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`anthropicKey`](SimulateOptions.md#anthropickey)

***

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [apps/paracosm/src/engine/provider/credentials.ts:6](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/provider/credentials.ts#L6)

OpenAI API key. Historical dashboard field name.

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`apiKey`](SimulateOptions.md#apikey)

***

### braveKey?

> `optional` **braveKey**: `string`

Defined in: [apps/paracosm/src/engine/provider/credentials.ts:16](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/provider/credentials.ts#L16)

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`braveKey`](SimulateOptions.md#bravekey)

***

### captureSnapshots?

> `optional` **captureSnapshots**: `boolean`

Defined in: [apps/paracosm/src/runtime/orchestrator/index.ts:374](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/orchestrator/index.ts#L374)

When true, the orchestrator captures a KernelSnapshot at
the end of every turn and stashes the resulting array under
`artifact.scenarioExtensions.kernelSnapshotsPerTurn`. Enables
`WorldModel.forkFromArtifact()` on the returned artifact. Default
false so normal runs stay lean; snapshots add ~100 KB per turn
for 100-agent Mars-shape runs.

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`captureSnapshots`](SimulateOptions.md#capturesnapshots)

***

### cohereKey?

> `optional` **cohereKey**: `string`

Defined in: [apps/paracosm/src/engine/provider/credentials.ts:17](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/provider/credentials.ts#L17)

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`cohereKey`](SimulateOptions.md#coherekey)

***

### costPreset?

> `optional` **costPreset**: `CostPreset`

Defined in: [apps/paracosm/src/runtime/orchestrator/index.ts:405](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/orchestrator/index.ts#L405)

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

[`SimulateOptions`](SimulateOptions.md).[`costPreset`](SimulateOptions.md#costpreset)

***

### customEvents?

> `optional` **customEvents**: `object`[]

Defined in: [apps/paracosm/src/runtime/orchestrator/index.ts:364](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/orchestrator/index.ts#L364)

#### description

> **description**: `string`

#### title

> **title**: `string`

#### turn

> **turn**: `number`

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`customEvents`](SimulateOptions.md#customevents)

***

### economics?

> `optional` **economics**: `ResolvedEconomicsProfile`

Defined in: [apps/paracosm/src/runtime/orchestrator/index.ts:406](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/orchestrator/index.ts#L406)

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`economics`](SimulateOptions.md#economics)

***

### execution?

> `optional` **execution**: `Partial`\<`SimulationExecutionConfig`\>

Defined in: [apps/paracosm/src/runtime/orchestrator/index.ts:412](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/orchestrator/index.ts#L412)

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`execution`](SimulateOptions.md#execution)

***

### firecrawlKey?

> `optional` **firecrawlKey**: `string`

Defined in: [apps/paracosm/src/engine/provider/credentials.ts:14](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/provider/credentials.ts#L14)

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`firecrawlKey`](SimulateOptions.md#firecrawlkey)

***

### initialPopulation?

> `optional` **initialPopulation**: `number`

Defined in: [apps/paracosm/src/runtime/orchestrator/index.ts:407](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/orchestrator/index.ts#L407)

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`initialPopulation`](SimulateOptions.md#initialpopulation)

***

### intervention

> **intervention**: `object`

Defined in: [apps/paracosm/src/api/types.ts:124](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/api/types.ts#L124)

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

#### Overrides

[`SimulateOptions`](SimulateOptions.md).[`intervention`](SimulateOptions.md#intervention)

***

### keyPersonnel?

> `optional` **keyPersonnel**: [`KeyPersonnel`](KeyPersonnel.md)[]

Defined in: [apps/paracosm/src/api/types.ts:112](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/api/types.ts#L112)

Optional supporting cast for context retrieval. Default [].

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`keyPersonnel`](SimulateOptions.md#keypersonnel)

***

### liveSearch?

> `optional` **liveSearch**: `boolean`

Defined in: [apps/paracosm/src/runtime/orchestrator/index.ts:360](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/orchestrator/index.ts#L360)

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`liveSearch`](SimulateOptions.md#livesearch)

***

### maxTurns?

> `optional` **maxTurns**: `number`

Defined in: [apps/paracosm/src/runtime/orchestrator/index.ts:356](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/orchestrator/index.ts#L356)

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`maxTurns`](SimulateOptions.md#maxturns)

***

### models?

> `optional` **models**: `Partial`\<[`SimulationModelConfig`](SimulationModelConfig.md)\>

Defined in: [apps/paracosm/src/runtime/orchestrator/index.ts:365](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/orchestrator/index.ts#L365)

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`models`](SimulateOptions.md#models)

***

### onEvent()?

> `optional` **onEvent**: (`event`) => `void`

Defined in: [apps/paracosm/src/runtime/orchestrator/index.ts:363](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/orchestrator/index.ts#L363)

#### Parameters

##### event

`SimEvent`

#### Returns

`void`

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`onEvent`](SimulateOptions.md#onevent)

***

### provider?

> `optional` **provider**: `LlmProvider`

Defined in: [apps/paracosm/src/runtime/orchestrator/index.ts:362](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/orchestrator/index.ts#L362)

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`provider`](SimulateOptions.md#provider)

***

### scenario?

> `optional` **scenario**: [`ScenarioPackage`](ScenarioPackage.md)

Defined in: [apps/paracosm/src/runtime/orchestrator/index.ts:413](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/orchestrator/index.ts#L413)

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`scenario`](SimulateOptions.md#scenario)

***

### seed?

> `optional` **seed**: `number`

Defined in: [apps/paracosm/src/runtime/orchestrator/index.ts:357](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/orchestrator/index.ts#L357)

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`seed`](SimulateOptions.md#seed)

***

### serperKey?

> `optional` **serperKey**: `string`

Defined in: [apps/paracosm/src/engine/provider/credentials.ts:13](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/provider/credentials.ts#L13)

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`serperKey`](SimulateOptions.md#serperkey)

***

### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [apps/paracosm/src/runtime/orchestrator/index.ts:424](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/orchestrator/index.ts#L424)

Cancellation signal. When `.aborted` flips to true, the turn loop
short-circuits at the next turn boundary, emits a `sim_aborted`
event, and returns the partial result accumulated so far.

Server wires this to an AbortController that fires after a grace
period of zero connected SSE clients, so a user who closes the tab
or navigates away stops billing for new LLM calls while preserving
the partial results they already accumulated in the event buffer.

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`signal`](SimulateOptions.md#signal)

***

### startingEnvironment?

> `optional` **startingEnvironment**: `Record`\<`string`, `string` \| `number` \| `boolean`\>

Defined in: [apps/paracosm/src/runtime/orchestrator/index.ts:411](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/orchestrator/index.ts#L411)

#### Inherited from

`InterveneOptions`.[`startingEnvironment`](#startingenvironment)

***

### startingPolitics?

> `optional` **startingPolitics**: `StartingPolitics`

Defined in: [apps/paracosm/src/runtime/orchestrator/index.ts:409](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/orchestrator/index.ts#L409)

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`startingPolitics`](SimulateOptions.md#startingpolitics)

***

### startingResources?

> `optional` **startingResources**: `StartingResources`

Defined in: [apps/paracosm/src/runtime/orchestrator/index.ts:408](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/orchestrator/index.ts#L408)

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`startingResources`](SimulateOptions.md#startingresources)

***

### startingStatuses?

> `optional` **startingStatuses**: `Record`\<`string`, `string` \| `boolean`\>

Defined in: [apps/paracosm/src/runtime/orchestrator/index.ts:410](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/orchestrator/index.ts#L410)

#### Inherited from

`InterveneOptions`.[`startingStatuses`](#startingstatuses)

***

### startTime?

> `optional` **startTime**: `number`

Defined in: [apps/paracosm/src/runtime/orchestrator/index.ts:358](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/orchestrator/index.ts#L358)

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`startTime`](SimulateOptions.md#starttime)

***

### subject

> **subject**: `object`

Defined in: [apps/paracosm/src/api/types.ts:123](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/api/types.ts#L123)

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

#### Overrides

[`SimulateOptions`](SimulateOptions.md).[`subject`](SimulateOptions.md#subject)

***

### tavilyKey?

> `optional` **tavilyKey**: `string`

Defined in: [apps/paracosm/src/engine/provider/credentials.ts:15](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/provider/credentials.ts#L15)

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`tavilyKey`](SimulateOptions.md#tavilykey)

***

### timePerTurn?

> `optional` **timePerTurn**: `number`

Defined in: [apps/paracosm/src/runtime/orchestrator/index.ts:359](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/orchestrator/index.ts#L359)

#### Inherited from

[`SimulateOptions`](SimulateOptions.md).[`timePerTurn`](SimulateOptions.md#timeperturn)
