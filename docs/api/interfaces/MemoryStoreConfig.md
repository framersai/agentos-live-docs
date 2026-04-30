# Interface: MemoryStoreConfig

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:49](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/MemoryStore.ts#L49)

## Properties

### collectionPrefix

> **collectionPrefix**: `string`

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:54](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/MemoryStore.ts#L54)

Collection name prefix.

#### Default

```ts
'cogmem'
```

***

### decayConfig?

> `optional` **decayConfig**: [`DecayConfig`](DecayConfig.md)

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:57](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/MemoryStore.ts#L57)

***

### embeddingDimension?

> `optional` **embeddingDimension**: `number`

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:56](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/MemoryStore.ts#L56)

Embedding dimension (auto-detected if possible).

***

### embeddingManager

> **embeddingManager**: [`IEmbeddingManager`](IEmbeddingManager.md)

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:51](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/MemoryStore.ts#L51)

***

### knowledgeGraph

> **knowledgeGraph**: [`IKnowledgeGraph`](IKnowledgeGraph.md)

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:52](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/MemoryStore.ts#L52)

***

### mechanismsEngine?

> `optional` **mechanismsEngine**: [`CognitiveMechanismsEngine`](../classes/CognitiveMechanismsEngine.md)

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:59](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/MemoryStore.ts#L59)

Optional cognitive mechanisms engine for retrieval-time hooks.

***

### moodProvider()?

> `optional` **moodProvider**: () => [`PADState`](PADState.md)

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:61](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/MemoryStore.ts#L61)

Optional mood provider for reconsolidation drift during recordAccess.

#### Returns

[`PADState`](PADState.md)

***

### vectorStore

> **vectorStore**: [`IVectorStore`](IVectorStore.md)

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:50](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/MemoryStore.ts#L50)
