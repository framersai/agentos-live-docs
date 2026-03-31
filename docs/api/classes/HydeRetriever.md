# Class: HydeRetriever

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:166](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/HydeRetriever.ts#L166)

HyDE retriever: generates a hypothetical answer, embeds it, and searches
the vector store with adaptive thresholding.

## Constructors

### Constructor

> **new HydeRetriever**(`opts`): `HydeRetriever`

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:171](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/HydeRetriever.ts#L171)

#### Parameters

##### opts

###### config?

`Partial`\<[`HydeConfig`](../interfaces/HydeConfig.md)\>

###### embeddingManager

[`IEmbeddingManager`](../interfaces/IEmbeddingManager.md)

###### llmCaller

[`HydeLlmCaller`](../type-aliases/HydeLlmCaller.md)

#### Returns

`HydeRetriever`

## Accessors

### enabled

#### Get Signature

> **get** **enabled**(): `boolean`

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:182](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/HydeRetriever.ts#L182)

Whether HyDE is enabled.

##### Returns

`boolean`

## Methods

### generateHypothesis()

> **generateHypothesis**(`query`): `Promise`\<\{ `hypothesis`: `string`; `latencyMs`: `number`; \}\>

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:202](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/HydeRetriever.ts#L202)

Generate a hypothetical answer for a query.

#### Parameters

##### query

`string`

#### Returns

`Promise`\<\{ `hypothesis`: `string`; `latencyMs`: `number`; \}\>

***

### generateMultipleHypotheses()

> **generateMultipleHypotheses**(`query`, `count?`): `Promise`\<\{ `hypotheses`: `string`[]; `latencyMs`: `number`; \}\>

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:243](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/HydeRetriever.ts#L243)

Generate multiple hypothetical documents from different perspectives.

Each hypothesis approaches the query from a different angle, improving
recall by covering more of the semantic space. Uses chain-of-thought
prompting to ensure diverse, high-quality hypotheses.

The system prompt asks the LLM to generate N diverse hypotheses:
- Hypothesis 1: Technical/formal perspective
- Hypothesis 2: Practical/example perspective
- Hypothesis 3: Overview/summary perspective
- (Additional hypotheses explore further angles)

#### Parameters

##### query

`string`

The user query to generate hypotheses for.

##### count?

`number`

Number of hypotheses to generate. Default: config.hypothesisCount (3).

#### Returns

`Promise`\<\{ `hypotheses`: `string`[]; `latencyMs`: `number`; \}\>

Generated hypotheses and timing.

#### Throws

If the LLM call fails.

#### Example

```typescript
const { hypotheses, latencyMs } = await retriever.generateMultipleHypotheses(
  'How does BM25 scoring work?',
  3,
);
// hypotheses[0]: Technical explanation with formulas
// hypotheses[1]: Practical example with code
// hypotheses[2]: High-level conceptual overview
```

***

### retrieve()

> **retrieve**(`opts`): `Promise`\<[`HydeRetrievalResult`](../interfaces/HydeRetrievalResult.md)\>

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:438](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/HydeRetriever.ts#L438)

Embed the hypothesis and search the vector store.
Uses adaptive thresholding: starts at initialThreshold, steps down
until results are found or minThreshold is reached.

#### Parameters

##### opts

###### collectionName

`string`

###### hypothesis?

`string`

Pre-generated hypothesis (skip generation if provided).

###### query

`string`

###### queryOptions?

`Partial`\<[`QueryOptions`](../interfaces/QueryOptions.md)\>

###### vectorStore

[`IVectorStore`](../interfaces/IVectorStore.md)

#### Returns

`Promise`\<[`HydeRetrievalResult`](../interfaces/HydeRetrievalResult.md)\>

***

### retrieveContext()

> **retrieveContext**(`opts`): `Promise`\<\{ `chunkCount`: `number`; `context`: `string`; `effectiveThreshold`: `number`; `hypothesis`: `string`; `latencyMs`: `number`; \}\>

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:531](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/HydeRetriever.ts#L531)

Convenience: retrieve and format as augmented context string.

#### Parameters

##### opts

###### collectionName

`string`

###### query

`string`

###### queryOptions?

`Partial`\<[`QueryOptions`](../interfaces/QueryOptions.md)\>

###### separator?

`string`

###### vectorStore

[`IVectorStore`](../interfaces/IVectorStore.md)

#### Returns

`Promise`\<\{ `chunkCount`: `number`; `context`: `string`; `effectiveThreshold`: `number`; `hypothesis`: `string`; `latencyMs`: `number`; \}\>

***

### retrieveMulti()

> **retrieveMulti**(`opts`): `Promise`\<[`HydeMultiRetrievalResult`](../interfaces/HydeMultiRetrievalResult.md)\>

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:356](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/HydeRetriever.ts#L356)

Multi-hypothesis retrieval: generates N diverse hypotheses, searches with each,
and merges results by deduplication (keeping the highest score per document).

This dramatically improves recall compared to single-hypothesis HyDE because
one bad hypothesis doesn't ruin everything — other hypotheses can still find
relevant documents from different angles.

Pipeline:
1. Generate N hypotheses via [generateMultipleHypotheses](#generatemultiplehypotheses)
2. Embed each hypothesis
3. Search the vector store with each embedding
4. Union all results, deduplicate by document ID, keep highest score

#### Parameters

##### opts

Retrieval options.

###### collectionName

`string`

Collection to search in.

###### hypothesisCount?

`number`

Override hypothesis count for this call.

###### query

`string`

The user query.

###### queryOptions?

`Partial`\<[`QueryOptions`](../interfaces/QueryOptions.md)\>

Additional query options.

###### vectorStore

[`IVectorStore`](../interfaces/IVectorStore.md)

Vector store to search.

#### Returns

`Promise`\<[`HydeMultiRetrievalResult`](../interfaces/HydeMultiRetrievalResult.md)\>

Deduplicated results from all hypotheses.

#### Example

```typescript
const result = await retriever.retrieveMulti({
  query: 'How does BM25 work?',
  vectorStore: myStore,
  collectionName: 'knowledge-base',
  hypothesisCount: 3,
});
console.log(`Found ${result.queryResult.documents.length} unique docs from ${result.hypothesisCount} hypotheses`);
```
