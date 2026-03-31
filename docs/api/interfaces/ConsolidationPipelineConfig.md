# Interface: ConsolidationPipelineConfig

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:43](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L43)

## Properties

### agentId

> **agentId**: `string`

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:47](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L47)

***

### consolidation?

> `optional` **consolidation**: `Partial`\<[`ConsolidationConfig`](ConsolidationConfig.md)\>

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:49](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L49)

***

### decay?

> `optional` **decay**: `Partial`\<[`DecayConfig`](DecayConfig.md)\>

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:48](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L48)

***

### graph?

> `optional` **graph**: [`IMemoryGraph`](IMemoryGraph.md)

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:45](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L45)

***

### llmInvoker()?

> `optional` **llmInvoker**: (`systemPrompt`, `userPrompt`) => `Promise`\<`string`\>

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:51](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L51)

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

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:53](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L53)

Optional cognitive mechanisms engine for consolidation-time hooks.

***

### store

> **store**: [`MemoryStore`](../classes/MemoryStore.md)

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:44](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L44)

***

### traits

> **traits**: [`HexacoTraits`](HexacoTraits.md)

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationPipeline.ts:46](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/consolidation/ConsolidationPipeline.ts#L46)
