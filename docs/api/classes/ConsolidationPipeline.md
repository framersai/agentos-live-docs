# Class: ConsolidationPipeline

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:84](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L84)

## Constructors

### Constructor

> **new ConsolidationPipeline**(`config`): `ConsolidationPipeline`

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:91](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L91)

#### Parameters

##### config

[`ConsolidationPipelineConfig`](../interfaces/ConsolidationPipelineConfig.md)

#### Returns

`ConsolidationPipeline`

## Methods

### getLastRunAt()

> **getLastRunAt**(): `number`

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:196](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L196)

Get timestamp of last consolidation run.

#### Returns

`number`

***

### run()

> **run**(): `Promise`\<[`ConsolidationResult`](../interfaces/ConsolidationResult.md)\>

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:124](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L124)

Run a single consolidation cycle.

#### Returns

`Promise`\<[`ConsolidationResult`](../interfaces/ConsolidationResult.md)\>

***

### start()

> **start**(): `void`

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:103](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L103)

Start the periodic consolidation timer.

#### Returns

`void`

***

### stop()

> **stop**(): `void`

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:114](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L114)

Stop the periodic consolidation timer.

#### Returns

`void`
