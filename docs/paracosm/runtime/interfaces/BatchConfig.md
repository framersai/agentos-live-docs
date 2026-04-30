# Interface: BatchConfig

Defined in: [apps/paracosm/src/runtime/batch.ts:9](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/batch.ts#L9)

## Properties

### costPreset?

> `optional` **costPreset**: [`CostPreset`](../../engine/type-aliases/CostPreset.md)

Defined in: [apps/paracosm/src/runtime/batch.ts:24](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/batch.ts#L24)

Cost-vs-quality preset forwarded to each simulation in the batch.
See `RunOptions.costPreset` for the full semantic. Defaults to
`'quality'`; set `'economy'` to drop the whole batch to the
cheaper tier.

***

### keyPersonnel?

> `optional` **keyPersonnel**: [`KeyPersonnel`](../../engine/interfaces/KeyPersonnel.md)[]

Defined in: [apps/paracosm/src/runtime/batch.ts:12](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/batch.ts#L12)

***

### leaders

> **leaders**: [`LeaderConfig`](../../engine/interfaces/LeaderConfig.md)[]

Defined in: [apps/paracosm/src/runtime/batch.ts:11](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/batch.ts#L11)

***

### maxConcurrency?

> `optional` **maxConcurrency**: `number`

Defined in: [apps/paracosm/src/runtime/batch.ts:25](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/batch.ts#L25)

***

### models?

> `optional` **models**: `Partial`\<[`SimulationModelConfig`](../../engine/interfaces/SimulationModelConfig.md)\>

Defined in: [apps/paracosm/src/runtime/batch.ts:17](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/batch.ts#L17)

***

### provider?

> `optional` **provider**: [`LlmProvider`](../../engine/type-aliases/LlmProvider.md)

Defined in: [apps/paracosm/src/runtime/batch.ts:16](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/batch.ts#L16)

***

### scenarios

> **scenarios**: [`ScenarioPackage`](../../engine/interfaces/ScenarioPackage.md)[]

Defined in: [apps/paracosm/src/runtime/batch.ts:10](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/batch.ts#L10)

***

### seed

> **seed**: `number`

Defined in: [apps/paracosm/src/runtime/batch.ts:14](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/batch.ts#L14)

***

### startYear?

> `optional` **startYear**: `number`

Defined in: [apps/paracosm/src/runtime/batch.ts:15](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/batch.ts#L15)

***

### turns

> **turns**: `number`

Defined in: [apps/paracosm/src/runtime/batch.ts:13](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/batch.ts#L13)
