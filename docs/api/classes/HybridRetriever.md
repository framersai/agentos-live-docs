# Class: HybridRetriever

Defined in: [packages/agentos/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts:158](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts#L158)

Hybrid BM25 + dense retriever.

## Example

```ts
const hybrid = new HybridRetriever({ memoryStore, rerankerService });
// At ingest:
hybrid.bm25.addDocument(trace.id, trace.content, { tag: 'bench-session:s-1' });
// At query time:
const result = await hybrid.retrieve(
  'What did the user say about their mortgage?',
  { valence: 0, arousal: 0, dominance: 0 },
  { scope: 'user', scopeId: 'u1' },
  { recallTopK: 10 },
);
```

## Constructors

### Constructor

> **new HybridRetriever**(`opts`): `HybridRetriever`

Defined in: [packages/agentos/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts:171](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts#L171)

#### Parameters

##### opts

[`HybridRetrieverOptions`](../interfaces/HybridRetrieverOptions.md)

#### Returns

`HybridRetriever`

## Properties

### bm25

> `readonly` **bm25**: [`BM25Index`](BM25Index.md)

Defined in: [packages/agentos/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts:159](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts#L159)

## Methods

### retrieve()

> **retrieve**(`query`, `mood`, `scope`, `options?`): `Promise`\<[`CognitiveRetrievalResult`](../interfaces/CognitiveRetrievalResult.md)\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts:185](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/hybrid/HybridRetriever.ts#L185)

#### Parameters

##### query

`string`

##### mood

[`PADState`](../interfaces/PADState.md)

##### scope

###### scope

[`MemoryScope`](../type-aliases/MemoryScope.md)

###### scopeId

`string`

##### options?

[`HybridRetrieveOptions`](../interfaces/HybridRetrieveOptions.md) = `{}`

#### Returns

`Promise`\<[`CognitiveRetrievalResult`](../interfaces/CognitiveRetrievalResult.md)\>
