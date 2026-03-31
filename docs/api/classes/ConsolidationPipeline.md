# Class: ConsolidationPipeline

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:78](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L78)

## Constructors

### Constructor

> **new ConsolidationPipeline**(`config`): `ConsolidationPipeline`

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:85](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L85)

#### Parameters

##### config

[`ConsolidationPipelineConfig`](../interfaces/ConsolidationPipelineConfig.md)

#### Returns

`ConsolidationPipeline`

## Methods

### getLastRunAt()

> **getLastRunAt**(): `number`

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:172](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L172)

Get timestamp of last consolidation run.

#### Returns

`number`

***

### run()

> **run**(): `Promise`\<[`ConsolidationResult`](../interfaces/ConsolidationResult.md)\>

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:118](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L118)

Run a single consolidation cycle.

#### Returns

`Promise`\<[`ConsolidationResult`](../interfaces/ConsolidationResult.md)\>

***

### start()

> **start**(): `void`

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:97](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L97)

Start the periodic consolidation timer.

#### Returns

`void`

***

### stop()

> **stop**(): `void`

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:108](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L108)

Stop the periodic consolidation timer.

#### Returns

`void`
