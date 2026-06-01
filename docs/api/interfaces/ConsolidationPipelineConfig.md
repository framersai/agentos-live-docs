# Interface: ConsolidationPipelineConfig

Defined in: [packages/agentos/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts:52](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts#L52)

## Properties

### agentId

> **agentId**: `string`

Defined in: [packages/agentos/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts:56](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts#L56)

***

### archive?

> `optional` **archive**: `IMemoryArchive`

Defined in: [packages/agentos/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts:64](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts#L64)

Optional memory archive for retention sweep (step 7).

***

### archiveRetention?

> `optional` **archiveRetention**: `MemoryArchiveRetentionConfig`

Defined in: [packages/agentos/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts:66](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts#L66)

Retention configuration for the archive sweep.

***

### consolidation?

> `optional` **consolidation**: `Partial`\<[`ConsolidationConfig`](ConsolidationConfig.md)\>

Defined in: [packages/agentos/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts:58](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts#L58)

***

### decay?

> `optional` **decay**: `Partial`\<[`DecayConfig`](DecayConfig.md)\>

Defined in: [packages/agentos/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts:57](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts#L57)

***

### graph?

> `optional` **graph**: [`IMemoryGraph`](IMemoryGraph.md)

Defined in: [packages/agentos/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts:54](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts#L54)

***

### llmInvoker()?

> `optional` **llmInvoker**: (`systemPrompt`, `userPrompt`) => `Promise`\<`string`\>

Defined in: [packages/agentos/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts:60](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts#L60)

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

Defined in: [packages/agentos/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts:62](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts#L62)

Optional cognitive mechanisms engine for consolidation-time hooks.

***

### store

> **store**: [`MemoryStore`](../classes/MemoryStore.md)

Defined in: [packages/agentos/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts:53](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts#L53)

***

### traits

> **traits**: [`HexacoTraits`](HexacoTraits.md)

Defined in: [packages/agentos/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts:55](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/pipeline/consolidation/ConsolidationPipeline.ts#L55)
