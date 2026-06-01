# Interface: ParacosmClient

Defined in: [apps/paracosm/src/runtime/client.ts:80](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/client.ts#L80)

Handle returned by `createParacosmClient`. The three methods mirror
the corresponding standalone exports — same arg shapes, same return
types — but with the client's defaults layered in.

## Properties

### compileScenario()

> **compileScenario**: (`scenarioJson`, `opts?`) => `Promise`\<[`ScenarioPackage`](ScenarioPackage.md)\>

Defined in: [apps/paracosm/src/runtime/client.ts:98](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/client.ts#L98)

Compile a scenario with the client's compiler defaults.

#### Parameters

##### scenarioJson

`Record`\<`string`, `unknown`\>

##### opts?

[`CompileOptions`](../compiler/interfaces/CompileOptions.md)

#### Returns

`Promise`\<[`ScenarioPackage`](ScenarioPackage.md)\>

***

### runBatch()

> **runBatch**: (`config`) => `Promise`\<`BatchManifest`\>

Defined in: [apps/paracosm/src/runtime/client.ts:94](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/client.ts#L94)

Run a batch sweep. Scenarios / leaders / turns / seed are the
caller's responsibility; provider + costPreset + models inherit.

#### Parameters

##### config

`BatchConfig`

#### Returns

`Promise`\<`BatchManifest`\>

***

### runSimulation()

> **runSimulation**: (`leader`, `keyPersonnel`, `opts?`) => `Promise`\<\{ `aborted?`: `boolean`; `assumptions?`: `string`[]; `citations?`: `object`[]; `cost?`: \{ `breakdown?`: `Record`\<`string`, `number`\>; `cachedReadTokens?`: `number`; `cacheSavingsUSD?`: `number`; `inputTokens?`: `number`; `llmCalls?`: `number`; `outputTokens?`: `number`; `totalUSD`: `number`; \}; `decisions?`: `object`[]; `disclaimer?`: `string`; `finalState?`: \{ `capacities?`: `Record`\<`string`, `number`\>; `environment?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `metrics`: `Record`\<`string`, `number`\>; `politics?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `statuses?`: `Record`\<`string`, `string` \| `boolean`\>; \}; `finalSwarm?`: \{ `agents`: `object`[]; `births?`: `number`; `deaths?`: `number`; `morale?`: `number`; `population`: `number`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `time`: `number`; `turn`: `number`; \}; `fingerprint?`: `Record`\<`string`, `string` \| `number`\>; `forgedTools?`: `object`[]; `intervention?`: \{ `adherenceProfile?`: \{ `expected`: `number`; `risks?`: `string`[]; \}; `category?`: `string`; `description`: `string`; `duration?`: \{ `unit`: `string`; `value`: `number`; \}; `id`: `string`; `mechanism?`: `string`; `name`: `string`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `targetBehaviors?`: `string`[]; \}; `leveragePoints?`: `string`[]; `metadata`: \{ `completedAt?`: `string`; `forkedFrom?`: \{ `atTurn`: `number`; `parentRunId`: `string`; \}; `mode`: `"turn-loop"` \| `"batch-trajectory"` \| `"batch-point"`; `runId`: `string`; `scenario`: \{ `id`: `string`; `name`: `string`; `version?`: `string`; \}; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `seed?`: `number`; `startedAt`: `string`; \}; `overview?`: `string`; `providerError?`: \{ `actionUrl?`: `string`; `kind`: `"unknown"` \| `"auth"` \| `"quota"` \| `"rate_limit"` \| `"network"`; `message`: `string`; `provider`: `string`; \} \| `null`; `riskFlags?`: `object`[]; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `specialistNotes?`: `object`[]; `subject?`: \{ `conditions?`: `string`[]; `id`: `string`; `markers?`: `object`[]; `name`: `string`; `personality?`: `Record`\<`string`, `number`\>; `profile?`: `Record`\<`string`, `unknown`\>; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `signals?`: `object`[]; \}; `trajectory?`: \{ `points?`: `object`[]; `timepoints?`: `object`[]; `timeUnit`: \{ `plural`: `string`; `singular`: `string`; \}; \}; \}\>

Defined in: [apps/paracosm/src/runtime/client.ts:85](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/client.ts#L85)

Run one simulation. Leader + key personnel passed per-call; all
other options inherit from the client with per-call overrides.

#### Parameters

##### leader

[`ActorConfig`](ActorConfig.md)

##### keyPersonnel

[`KeyPersonnel`](KeyPersonnel.md)[]

##### opts?

`RunOptions`

#### Returns

`Promise`\<\{ `aborted?`: `boolean`; `assumptions?`: `string`[]; `citations?`: `object`[]; `cost?`: \{ `breakdown?`: `Record`\<`string`, `number`\>; `cachedReadTokens?`: `number`; `cacheSavingsUSD?`: `number`; `inputTokens?`: `number`; `llmCalls?`: `number`; `outputTokens?`: `number`; `totalUSD`: `number`; \}; `decisions?`: `object`[]; `disclaimer?`: `string`; `finalState?`: \{ `capacities?`: `Record`\<`string`, `number`\>; `environment?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `metrics`: `Record`\<`string`, `number`\>; `politics?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `statuses?`: `Record`\<`string`, `string` \| `boolean`\>; \}; `finalSwarm?`: \{ `agents`: `object`[]; `births?`: `number`; `deaths?`: `number`; `morale?`: `number`; `population`: `number`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `time`: `number`; `turn`: `number`; \}; `fingerprint?`: `Record`\<`string`, `string` \| `number`\>; `forgedTools?`: `object`[]; `intervention?`: \{ `adherenceProfile?`: \{ `expected`: `number`; `risks?`: `string`[]; \}; `category?`: `string`; `description`: `string`; `duration?`: \{ `unit`: `string`; `value`: `number`; \}; `id`: `string`; `mechanism?`: `string`; `name`: `string`; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `targetBehaviors?`: `string`[]; \}; `leveragePoints?`: `string`[]; `metadata`: \{ `completedAt?`: `string`; `forkedFrom?`: \{ `atTurn`: `number`; `parentRunId`: `string`; \}; `mode`: `"turn-loop"` \| `"batch-trajectory"` \| `"batch-point"`; `runId`: `string`; `scenario`: \{ `id`: `string`; `name`: `string`; `version?`: `string`; \}; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `seed?`: `number`; `startedAt`: `string`; \}; `overview?`: `string`; `providerError?`: \{ `actionUrl?`: `string`; `kind`: `"unknown"` \| `"auth"` \| `"quota"` \| `"rate_limit"` \| `"network"`; `message`: `string`; `provider`: `string`; \} \| `null`; `riskFlags?`: `object`[]; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `specialistNotes?`: `object`[]; `subject?`: \{ `conditions?`: `string`[]; `id`: `string`; `markers?`: `object`[]; `name`: `string`; `personality?`: `Record`\<`string`, `number`\>; `profile?`: `Record`\<`string`, `unknown`\>; `scenarioExtensions?`: `Record`\<`string`, `unknown`\>; `signals?`: `object`[]; \}; `trajectory?`: \{ `points?`: `object`[]; `timepoints?`: `object`[]; `timeUnit`: \{ `plural`: `string`; `singular`: `string`; \}; \}; \}\>
