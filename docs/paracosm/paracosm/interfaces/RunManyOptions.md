# Interface: RunManyOptions

Defined in: [apps/paracosm/src/api/types.ts:67](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/api/types.ts#L67)

Options accepted by `runMany(prompt, opts)`. Extends `RunOptions` with
parallel-run params.

## Extends

- [`RunOptions`](RunOptions.md)

## Properties

### cacheDir?

> `optional` **cacheDir**: `string`

Defined in: [apps/paracosm/src/api/types.ts:58](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/api/types.ts#L58)

Compiler cache directory. Reused across multiple runs in `runMany`.

#### Inherited from

[`RunOptions`](RunOptions.md).[`cacheDir`](RunOptions.md#cachedir)

***

### captureSnapshots?

> `optional` **captureSnapshots**: `boolean`

Defined in: [apps/paracosm/src/api/types.ts:44](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/api/types.ts#L44)

Whether to embed kernel snapshots so the result is fork-eligible. Default true.

#### Inherited from

[`RunOptions`](RunOptions.md).[`captureSnapshots`](RunOptions.md#capturesnapshots)

***

### costPreset?

> `optional` **costPreset**: `"quality"` \| `"economy"`

Defined in: [apps/paracosm/src/api/types.ts:48](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/api/types.ts#L48)

Cost preset. Default 'quality'.

#### Inherited from

[`RunOptions`](RunOptions.md).[`costPreset`](RunOptions.md#costpreset)

***

### count?

> `optional` **count**: `number`

Defined in: [apps/paracosm/src/api/types.ts:69](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/api/types.ts#L69)

How many actors to generate + run in parallel. Default 3, range 2..6.

***

### customEvents?

> `optional` **customEvents**: [`CustomEvent`](CustomEvent.md)[]

Defined in: [apps/paracosm/src/api/types.ts:52](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/api/types.ts#L52)

Custom events to inject during the run.

#### Inherited from

[`RunOptions`](RunOptions.md).[`customEvents`](RunOptions.md#customevents)

***

### maxTurns?

> `optional` **maxTurns**: `number`

Defined in: [apps/paracosm/src/api/types.ts:42](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/api/types.ts#L42)

Hard cap on turns. Default: scenario's `setup.defaultTurns`.

#### Inherited from

[`RunOptions`](RunOptions.md).[`maxTurns`](RunOptions.md#maxturns)

***

### models?

> `optional` **models**: [`SimulationModelConfig`](SimulationModelConfig.md)

Defined in: [apps/paracosm/src/api/types.ts:50](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/api/types.ts#L50)

Per-role model overrides.

#### Inherited from

[`RunOptions`](RunOptions.md).[`models`](RunOptions.md#models)

***

### onEvent()?

> `optional` **onEvent**: (`e`) => `void`

Defined in: [apps/paracosm/src/api/types.ts:56](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/api/types.ts#L56)

Stream-event callback (forge attempts, decisions, errors).

#### Parameters

##### e

\{ `data`: \{ `births?`: `number`; `category?`: `string`; `crisis?`: `string`; `deaths?`: `number`; `description?`: `string`; `emergent?`: `boolean`; `metrics?`: `Record`\<`string`, `number`\>; `pacing?`: `unknown`; `summary?`: `string`; `title?`: `string`; `totalEvents?`: `number`; `turnSummary?`: `string`; \}; `leader`: `string`; `time?`: `number`; `turn?`: `number`; `type`: `string`; \} | \{ `data`: \{ `category`: `string`; `description?`: `string`; `emergent?`: `boolean`; `eventIndex`: `number`; `pacing?`: `unknown`; `summary?`: `string`; `title`: `string`; `totalEvents`: `number`; `turnSummary?`: `string`; \}; `leader`: `string`; `time?`: `number`; `turn?`: `number`; `type`: `string`; \} | \{ `data`: \{ `department`: `string`; `eventIndex`: `number`; `summary?`: `string`; \}; `leader`: `string`; `time?`: `number`; `turn?`: `number`; `type`: `string`; \} | \{ `data`: \{ `citationList`: `object`[]; `citations`: `number`; `department`: `string`; `deptSummary?`: `string`; `eventIndex`: `number`; `forgedTools`: `unknown`[]; `recommendedActions?`: `string`[]; `risks`: `string`[]; `summary?`: `string`; \}; `leader`: `string`; `time?`: `number`; `turn?`: `number`; `type`: `string`; \} | \{ `data`: \{ `approved`: `boolean`; `confidence`: `number`; `department`: `string`; `description?`: `string`; `errorReason?`: `string`; `eventIndex?`: `number`; `inputFields`: `string`[]; `mode?`: `string`; `name`: `string`; `outputFields`: `string`[]; `summary?`: `string`; `timestamp`: `string`; \}; `leader`: `string`; `time?`: `number`; `turn?`: `number`; `type`: `string`; \} | \{ `data`: \{ `eventIndex`: `number`; `summary?`: `string`; \}; `leader`: `string`; `time?`: `number`; `turn?`: `number`; `type`: `string`; \} | \{ `data`: \{ `decision`: `string`; `eventIndex`: `number`; `rationale`: `string`; `reasoning`: `string`; `selectedOptionId?`: `string`; `selectedPolicies`: `unknown`[]; `summary?`: `string`; \}; `leader`: `string`; `time?`: `number`; `turn?`: `number`; `type`: `string`; \} | \{ `data`: \{ `category`: `string`; `emergent`: `boolean`; `eventIndex`: `number`; `outcome`: `string`; `summary?`: `string`; `systemDeltas`: `Record`\<`string`, `number`\>; \}; `leader`: `string`; `time?`: `number`; `turn?`: `number`; `type`: `string`; \} | \{ `data`: \{ `agents`: `Record`\<`string`, \{ `hexaco`: `Record`\<`string`, `number`\>; `name`: `string`; \}\>; `commander`: `unknown`; `summary?`: `string`; \}; `leader`: `string`; `time?`: `number`; `turn?`: `number`; `type`: `string`; \} | \{ `data`: \{ `moodSummary?`: `unknown`; `reactions`: `unknown`[]; `summary?`: `string`; \}; `leader`: `string`; `time?`: `number`; `turn?`: `number`; `type`: `string`; \} | \{ `data`: \{ `posts`: `unknown`[]; `summary?`: `string`; \}; `leader`: `string`; `time?`: `number`; `turn?`: `number`; `type`: `string`; \} | \{ `data`: \{ `deathCauses?`: `Record`\<`string`, `number`\>; `environment?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; `error?`: `string`; `metrics`: `Record`\<`string`, `number`\>; `statuses?`: `Record`\<`string`, `string` \| `boolean`\>; `summary?`: `string`; `toolsForged`: `number`; `totalEvents?`: `number`; \}; `leader`: `string`; `time?`: `number`; `turn?`: `number`; `type`: `string`; \} | \{ `data`: \{ `agentId`: `string`; `department`: `string`; `reason?`: `string`; `role`: `string`; `summary?`: `string`; \}; `leader`: `string`; `time?`: `number`; `turn?`: `number`; `type`: `string`; \} | \{ `data`: \{ `agents`: `unknown`[]; `births`: `number`; `deaths`: `number`; `foodReserve`: `number`; `morale`: `number`; `population`: `number`; `summary?`: `string`; \}; `leader`: `string`; `time?`: `number`; `turn?`: `number`; `type`: `string`; \} | \{ `data`: \{ `actionUrl?`: `string`; `kind`: `"unknown"` \| `"auth"` \| `"quota"` \| `"rate_limit"` \| `"network"`; `message`: `string`; `provider`: `string`; `site?`: `string`; `summary?`: `string`; \}; `leader`: `string`; `time?`: `number`; `turn?`: `number`; `type`: `string`; \} | \{ `data`: \{ `error`: `string`; `rawTextPreview`: `string`; `schemaName?`: `string`; `site`: `string`; `summary?`: `string`; \}; `leader`: `string`; `time?`: `number`; `turn?`: `number`; `type`: `string`; \} | \{ `data`: \{ `completedTurns`: `number`; `metrics`: `Record`\<`string`, `number`\>; `reason`: `string`; `summary?`: `string`; `toolsForged`: `number`; \}; `leader`: `string`; `time?`: `number`; `turn?`: `number`; `type`: `string`; \}

#### Returns

`void`

#### Inherited from

[`RunOptions`](RunOptions.md).[`onEvent`](RunOptions.md#onevent)

***

### provider?

> `optional` **provider**: `"openai"` \| `"anthropic"`

Defined in: [apps/paracosm/src/api/types.ts:46](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/api/types.ts#L46)

LLM provider for the simulation. Default 'anthropic'.

#### Inherited from

[`RunOptions`](RunOptions.md).[`provider`](RunOptions.md#provider)

***

### seed?

> `optional` **seed**: `number`

Defined in: [apps/paracosm/src/api/types.ts:40](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/api/types.ts#L40)

Per-run seed. Default: scenario's `setup.defaultSeed` else 42.

#### Inherited from

[`RunOptions`](RunOptions.md).[`seed`](RunOptions.md#seed)

***

### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [apps/paracosm/src/api/types.ts:54](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/api/types.ts#L54)

Cancel the run early.

#### Inherited from

[`RunOptions`](RunOptions.md).[`signal`](RunOptions.md#signal)
