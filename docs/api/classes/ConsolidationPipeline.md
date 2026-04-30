# Class: ConsolidationPipeline

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:85](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L85)

## Constructors

### Constructor

> **new ConsolidationPipeline**(`config`): `ConsolidationPipeline`

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:92](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L92)

#### Parameters

##### config

[`ConsolidationPipelineConfig`](../interfaces/ConsolidationPipelineConfig.md)

#### Returns

`ConsolidationPipeline`

## Methods

### getLastRunAt()

> **getLastRunAt**(): `number`

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:208](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L208)

Get timestamp of last consolidation run.

#### Returns

`number`

***

### run()

> **run**(): `Promise`\<[`ConsolidationResult`](../interfaces/ConsolidationResult.md)\>

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:136](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L136)

Run a single consolidation cycle.

#### Returns

`Promise`\<[`ConsolidationResult`](../interfaces/ConsolidationResult.md)\>

***

### start()

> **start**(): `void`

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:112](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L112)

Start the periodic consolidation timer.

The timer is `.unref()`'d so it does NOT keep the Node event loop
alive on its own. Long-running agents keep the process alive
through their own mechanisms (HTTP server, message bus, etc.);
short-lived contexts (benches, scripts) can exit cleanly once
their meaningful work completes. Callers that need a guaranteed
consolidation cycle before shutdown should call `runConsolidation()`
directly or trigger it via [CognitiveMemoryManager.runConsolidation](CognitiveMemoryManager.md#runconsolidation).

#### Returns

`void`

***

### stop()

> **stop**(): `void`

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:126](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L126)

Stop the periodic consolidation timer.

#### Returns

`void`
