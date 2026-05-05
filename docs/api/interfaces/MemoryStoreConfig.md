# Interface: MemoryStoreConfig

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:54](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/store/MemoryStore.ts#L54)

## Properties

### collectionPrefix

> **collectionPrefix**: `string`

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:59](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/store/MemoryStore.ts#L59)

Collection name prefix.

#### Default

```ts
'cogmem'
```

***

### decayConfig?

> `optional` **decayConfig**: [`DecayConfig`](DecayConfig.md)

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:62](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/store/MemoryStore.ts#L62)

***

### embeddingDimension?

> `optional` **embeddingDimension**: `number`

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:61](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/store/MemoryStore.ts#L61)

Embedding dimension (auto-detected if possible).

***

### embeddingManager

> **embeddingManager**: [`IEmbeddingManager`](IEmbeddingManager.md)

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:56](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/store/MemoryStore.ts#L56)

***

### enableGraphActivation?

> `optional` **enableGraphActivation**: `boolean`

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:76](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/store/MemoryStore.ts#L76)

Step 13: enable graph activation. When true, `store` upserts entity
nodes and `co_occurs` edges at ingest (from `trace.entities`), and
`query` seeds Anderson spreading activation from query-extracted
entities to compute the per-candidate `graphActivation` score
(weight 0.10 in `RetrievalPriorityScorer`). Default: false, which
preserves the legacy `graphActivation: 0` behavior for all
candidates.

***

### knowledgeGraph

> **knowledgeGraph**: [`IKnowledgeGraph`](IKnowledgeGraph.md)

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:57](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/store/MemoryStore.ts#L57)

***

### mechanismsEngine?

> `optional` **mechanismsEngine**: [`CognitiveMechanismsEngine`](../classes/CognitiveMechanismsEngine.md)

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:64](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/store/MemoryStore.ts#L64)

Optional cognitive mechanisms engine for retrieval-time hooks.

***

### moodProvider()?

> `optional` **moodProvider**: () => [`PADState`](PADState.md)

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:66](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/store/MemoryStore.ts#L66)

Optional mood provider for reconsolidation drift during recordAccess.

#### Returns

[`PADState`](PADState.md)

***

### vectorStore

> **vectorStore**: [`IVectorStore`](IVectorStore.md)

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:55](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/store/MemoryStore.ts#L55)
