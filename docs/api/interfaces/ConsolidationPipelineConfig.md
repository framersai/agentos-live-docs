# Interface: ConsolidationPipelineConfig

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:45](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L45)

## Properties

### agentId

> **agentId**: `string`

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:49](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L49)

***

### archive?

> `optional` **archive**: `IMemoryArchive`

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:57](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L57)

Optional memory archive for retention sweep (step 7).

***

### archiveRetention?

> `optional` **archiveRetention**: `MemoryArchiveRetentionConfig`

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:59](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L59)

Retention configuration for the archive sweep.

***

### consolidation?

> `optional` **consolidation**: `Partial`\<[`ConsolidationConfig`](ConsolidationConfig.md)\>

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:51](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L51)

***

### decay?

> `optional` **decay**: `Partial`\<[`DecayConfig`](DecayConfig.md)\>

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:50](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L50)

***

### graph?

> `optional` **graph**: [`IMemoryGraph`](IMemoryGraph.md)

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:47](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L47)

***

### llmInvoker()?

> `optional` **llmInvoker**: (`systemPrompt`, `userPrompt`) => `Promise`\<`string`\>

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:53](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L53)

LLM invoker for schema integration (optional).

#### Parameters

##### systemPrompt

`string`

##### userPrompt

`string`

#### Returns

`Promise`\<`string`\>

***

### mechanismsEngine?

> `optional` **mechanismsEngine**: [`CognitiveMechanismsEngine`](../classes/CognitiveMechanismsEngine.md)

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:55](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L55)

Optional cognitive mechanisms engine for consolidation-time hooks.

***

### store

> **store**: [`MemoryStore`](../classes/MemoryStore.md)

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:46](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L46)

***

### traits

> **traits**: [`HexacoTraits`](HexacoTraits.md)

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:48](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L48)
