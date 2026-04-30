# Interface: RunOptions

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:336](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L336)

## Properties

### activeDepartments?

> `optional` **activeDepartments**: `string`[]

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:342](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L342)

***

### costPreset?

> `optional` **costPreset**: [`CostPreset`](../../engine/type-aliases/CostPreset.md)

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:364](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L364)

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

***

### customEvents?

> `optional` **customEvents**: `object`[]

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:345](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L345)

#### description

> **description**: `string`

#### title

> **title**: `string`

#### turn

> **turn**: `number`

***

### economics?

> `optional` **economics**: [`ResolvedEconomicsProfile`](ResolvedEconomicsProfile.md)

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:365](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L365)

***

### execution?

> `optional` **execution**: `Partial`\<`SimulationExecutionConfig`\>

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:369](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L369)

***

### initialPopulation?

> `optional` **initialPopulation**: `number`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:366](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L366)

***

### liveSearch?

> `optional` **liveSearch**: `boolean`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:341](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L341)

***

### maxTurns?

> `optional` **maxTurns**: `number`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:337](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L337)

***

### models?

> `optional` **models**: `Partial`\<[`SimulationModelConfig`](../../engine/interfaces/SimulationModelConfig.md)\>

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:346](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L346)

***

### onEvent()?

> `optional` **onEvent**: (`event`) => `void`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:344](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L344)

#### Parameters

##### event

[`SimEvent`](../type-aliases/SimEvent.md)

#### Returns

`void`

***

### provider?

> `optional` **provider**: [`LlmProvider`](../../engine/type-aliases/LlmProvider.md)

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:343](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L343)

***

### scenario?

> `optional` **scenario**: [`ScenarioPackage`](../../engine/interfaces/ScenarioPackage.md)

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:370](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L370)

***

### seed?

> `optional` **seed**: `number`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:338](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L338)

***

### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:381](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L381)

Cancellation signal. When `.aborted` flips to true, the turn loop
short-circuits at the next turn boundary, emits a `sim_aborted`
event, and returns the partial result accumulated so far.

Server wires this to an AbortController that fires after a grace
period of zero connected SSE clients, so a user who closes the tab
or navigates away stops billing for new LLM calls while preserving
the partial results they already accumulated in the event buffer.

***

### startingPolitics?

> `optional` **startingPolitics**: `StartingPolitics`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:368](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L368)

***

### startingResources?

> `optional` **startingResources**: `StartingResources`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:367](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L367)

***

### startYear?

> `optional` **startYear**: `number`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:339](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L339)

***

### yearsPerTurn?

> `optional` **yearsPerTurn**: `number`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:340](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L340)
