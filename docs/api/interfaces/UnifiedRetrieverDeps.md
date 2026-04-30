# Interface: UnifiedRetrieverDeps

Defined in: [packages/agentos/src/rag/unified/UnifiedRetriever.ts:100](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/UnifiedRetriever.ts#L100)

Dependencies injected into the [UnifiedRetriever](../classes/UnifiedRetriever.md).

All dependencies are optional — the retriever gracefully skips sources
whose dependencies are not provided. This allows incremental adoption:
start with just vector + BM25, then add GraphRAG, RAPTOR, memory, etc.

## Example

```typescript
const deps: UnifiedRetrieverDeps = {
  hybridSearcher: myHybridSearcher,
  rerank: async (q, chunks, n) => chunks.slice(0, n),
  emit: (event) => console.log(event.type),
};
```

## Properties

### collectionName?

> `optional` **collectionName**: `string`

Defined in: [packages/agentos/src/rag/unified/UnifiedRetriever.ts:111](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/UnifiedRetriever.ts#L111)

Vector store collection name for hybrid search.

#### Default

```ts
'knowledge-base'
```

***

### decompose()?

> `optional` **decompose**: (`query`, `maxSubQueries`) => `Promise`\<`string`[]\>

Defined in: [packages/agentos/src/rag/unified/UnifiedRetriever.ts:182](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/UnifiedRetriever.ts#L182)

Query decomposition callback for complex strategies.

#### Parameters

##### query

`string`

The original multi-part query.

##### maxSubQueries

`number`

Maximum sub-queries to generate.

#### Returns

`Promise`\<`string`[]\>

Array of decomposed sub-query strings.

***

### deepResearch()?

> `optional` **deepResearch**: (`query`, `sources`) => `Promise`\<\{ `sources`: [`RetrievedChunk`](RetrievedChunk.md)[]; `synthesis`: `string`; \}\>

Defined in: [packages/agentos/src/rag/unified/UnifiedRetriever.ts:170](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/UnifiedRetriever.ts#L170)

Deep research synthesis callback.

#### Parameters

##### query

`string`

The user query.

##### sources

`string`[]

Source hints for research.

#### Returns

`Promise`\<\{ `sources`: [`RetrievedChunk`](RetrievedChunk.md)[]; `synthesis`: `string`; \}\>

Synthesis narrative and source chunks.

***

### defaultMood?

> `optional` **defaultMood**: `object`

Defined in: [packages/agentos/src/rag/unified/UnifiedRetriever.ts:219](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/UnifiedRetriever.ts#L219)

Default PAD mood state for memory operations.
Used when no mood context is available.

#### arousal

> **arousal**: `number`

#### dominance

> **dominance**: `number`

#### valence

> **valence**: `number`

***

### defaultTopK?

> `optional` **defaultTopK**: `number`

Defined in: [packages/agentos/src/rag/unified/UnifiedRetriever.ts:200](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/UnifiedRetriever.ts#L200)

Default topK for final results.

#### Default

```ts
10
```

***

### emit()?

> `optional` **emit**: (`event`) => `void`

Defined in: [packages/agentos/src/rag/unified/UnifiedRetriever.ts:188](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/UnifiedRetriever.ts#L188)

Event listener callback for retrieval lifecycle events.

#### Parameters

##### event

[`UnifiedRetrieverEvent`](../type-aliases/UnifiedRetrieverEvent.md)

A typed UnifiedRetriever event.

#### Returns

`void`

***

### graphEngine?

> `optional` **graphEngine**: [`IGraphRAGEngine`](IGraphRAGEngine.md)

Defined in: [packages/agentos/src/rag/unified/UnifiedRetriever.ts:123](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/UnifiedRetriever.ts#L123)

GraphRAG engine for entity/relationship traversal.
When provided, enables the `graph` source.

***

### hybridSearcher?

> `optional` **hybridSearcher**: [`HybridSearcher`](../classes/HybridSearcher.md)

Defined in: [packages/agentos/src/rag/unified/UnifiedRetriever.ts:105](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/UnifiedRetriever.ts#L105)

Hybrid dense+sparse searcher (vector + BM25).
When provided, enables the `vector` and `bm25` sources.

***

### hydeRetriever?

> `optional` **hydeRetriever**: [`HydeRetriever`](../classes/HydeRetriever.md)

Defined in: [packages/agentos/src/rag/unified/UnifiedRetriever.ts:136](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/UnifiedRetriever.ts#L136)

HyDE (Hypothetical Document Embedding) retriever.
When provided and plan.hyde.enabled is true, generates hypothetical
answers before embedding for improved recall.

***

### maxSubQueries?

> `optional` **maxSubQueries**: `number`

Defined in: [packages/agentos/src/rag/unified/UnifiedRetriever.ts:206](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/UnifiedRetriever.ts#L206)

Maximum sub-queries for complex decomposition.

#### Default

```ts
5
```

***

### memoryCacheThreshold?

> `optional` **memoryCacheThreshold**: `number`

Defined in: [packages/agentos/src/rag/unified/UnifiedRetriever.ts:213](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/UnifiedRetriever.ts#L213)

Memory cache hit confidence threshold.
Episodic memories above this confidence skip external sources.

#### Default

```ts
0.85
```

***

### memoryManager?

> `optional` **memoryManager**: [`ICognitiveMemoryManager`](ICognitiveMemoryManager.md)

Defined in: [packages/agentos/src/rag/unified/UnifiedRetriever.ts:129](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/UnifiedRetriever.ts#L129)

Cognitive memory manager.
When provided, enables the `memory` source and memory feedback loop.

***

### multimodalIndexer?

> `optional` **multimodalIndexer**: [`MultimodalIndexer`](../classes/MultimodalIndexer.md)

Defined in: [packages/agentos/src/rag/unified/UnifiedRetriever.ts:142](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/UnifiedRetriever.ts#L142)

Multimodal indexer for image/audio/video search.
When provided, enables the `multimodal` source.

***

### raptorTree?

> `optional` **raptorTree**: [`RaptorTree`](../classes/RaptorTree.md)

Defined in: [packages/agentos/src/rag/unified/UnifiedRetriever.ts:117](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/UnifiedRetriever.ts#L117)

RAPTOR hierarchical summary tree.
When provided, enables the `raptor` source.

***

### rerank()?

> `optional` **rerank**: (`query`, `chunks`, `topN`) => `Promise`\<[`RetrievedChunk`](RetrievedChunk.md)[]\>

Defined in: [packages/agentos/src/rag/unified/UnifiedRetriever.ts:161](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/UnifiedRetriever.ts#L161)

Cross-encoder or LLM-based reranker.

#### Parameters

##### query

`string`

The user query for relevance scoring.

##### chunks

[`RetrievedChunk`](RetrievedChunk.md)[]

Candidate chunks to rerank.

##### topN

`number`

Maximum chunks to keep after reranking.

#### Returns

`Promise`\<[`RetrievedChunk`](RetrievedChunk.md)[]\>

Reranked chunks.

***

### rrfK?

> `optional` **rrfK**: `number`

Defined in: [packages/agentos/src/rag/unified/UnifiedRetriever.ts:194](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/UnifiedRetriever.ts#L194)

RRF constant k. Higher values flatten score differences.

#### Default

```ts
60
```

***

### vectorSearch()?

> `optional` **vectorSearch**: (`query`, `topK`) => `Promise`\<[`RetrievedChunk`](RetrievedChunk.md)[]\>

Defined in: [packages/agentos/src/rag/unified/UnifiedRetriever.ts:151](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/UnifiedRetriever.ts#L151)

Vector search function (fallback when hybridSearcher is not available).

#### Parameters

##### query

`string`

The search query.

##### topK

`number`

Maximum results to return.

#### Returns

`Promise`\<[`RetrievedChunk`](RetrievedChunk.md)[]\>

Retrieved chunks.
