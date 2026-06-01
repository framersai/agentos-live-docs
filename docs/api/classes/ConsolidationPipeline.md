# Class: ConsolidationPipeline

Defined in: [packages/agentos/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts:92](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts#L92)

## Constructors

### Constructor

> **new ConsolidationPipeline**(`config`): `ConsolidationPipeline`

Defined in: [packages/agentos/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts:99](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts#L99)

#### Parameters

##### config

[`ConsolidationPipelineConfig`](../interfaces/ConsolidationPipelineConfig.md)

#### Returns

`ConsolidationPipeline`

## Methods

### getLastRunAt()

> **getLastRunAt**(): `number`

Defined in: [packages/agentos/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts:215](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts#L215)

Get timestamp of last consolidation run.

#### Returns

`number`

***

### run()

> **run**(): `Promise`\<[`ConsolidationResult`](../interfaces/ConsolidationResult.md)\>

Defined in: [packages/agentos/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts:143](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts#L143)

Run a single consolidation cycle.

#### Returns

`Promise`\<[`ConsolidationResult`](../interfaces/ConsolidationResult.md)\>

***

### start()

> **start**(): `void`

Defined in: [packages/agentos/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts:119](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts#L119)

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

Defined in: [packages/agentos/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts:133](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts#L133)

Stop the periodic consolidation timer.

#### Returns

`void`
