# Interface: TraitModel

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:88](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/index.ts#L88)

Complete definition of a trait model. Registered once at engine
load; consumed by the cue translator, the drift dispatcher, the
dashboard sliders, and the prompt builder.

## Properties

### axes

> **axes**: readonly [`TraitAxis`](TraitAxis.md)[]

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:96](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/index.ts#L96)

Ordered list of axes; UI renders sliders in this order.

***

### citation?

> `optional` **citation**: `string`

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:107](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/index.ts#L107)

Optional citation / provenance string for UI tooltips, e.g.
"Ashton & Lee, PSPR 2007" for HEXACO.

***

### cues

> **cues**: `Record`\<`string`, [`CueZone`](CueZone.md)\>

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:102](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/index.ts#L102)

axis-id -> per-zone prose cue for prompt injection.

***

### defaults

> **defaults**: `Record`\<`string`, `number`\>

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:98](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/index.ts#L98)

axis-id -> default float in [0, 1] when an axis is omitted.

***

### description

> **description**: `string`

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:94](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/index.ts#L94)

One-paragraph description of the model.

***

### drift

> **drift**: [`DriftTable`](DriftTable.md)

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:100](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/index.ts#L100)

Drift table consumed by the kernel between turns.

***

### id

> **id**: `string`

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:90](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/index.ts#L90)

kebab-case stable id used in artifacts and configs.

***

### name

> **name**: `string`

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:92](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/index.ts#L92)

Human-readable name for UI.

***

### recommendedProviders?

> `optional` **recommendedProviders**: readonly [`LlmProvider`](../type-aliases/LlmProvider.md)[]

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:112](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/index.ts#L112)

Recommended LLM providers / models for runs against this trait
model. Informational only; the orchestrator does not enforce.
