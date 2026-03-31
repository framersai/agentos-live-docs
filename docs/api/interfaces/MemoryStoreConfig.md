# Interface: MemoryStoreConfig

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:47](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/MemoryStore.ts#L47)

## Properties

### collectionPrefix

> **collectionPrefix**: `string`

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:52](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/MemoryStore.ts#L52)

Collection name prefix.

#### Default

```ts
'cogmem'
```

***

### decayConfig?

> `optional` **decayConfig**: [`DecayConfig`](DecayConfig.md)

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:55](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/MemoryStore.ts#L55)

***

### embeddingDimension?

> `optional` **embeddingDimension**: `number`

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:54](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/MemoryStore.ts#L54)

Embedding dimension (auto-detected if possible).

***

### embeddingManager

> **embeddingManager**: [`IEmbeddingManager`](IEmbeddingManager.md)

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:49](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/MemoryStore.ts#L49)

***

### knowledgeGraph

> **knowledgeGraph**: [`IKnowledgeGraph`](IKnowledgeGraph.md)

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:50](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/MemoryStore.ts#L50)

***

### mechanismsEngine?

> `optional` **mechanismsEngine**: [`CognitiveMechanismsEngine`](../classes/CognitiveMechanismsEngine.md)

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:57](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/MemoryStore.ts#L57)

Optional cognitive mechanisms engine for retrieval-time hooks.

***

### moodProvider()?

> `optional` **moodProvider**: () => [`PADState`](PADState.md)

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:59](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/MemoryStore.ts#L59)

Optional mood provider for reconsolidation drift during recordAccess.

#### Returns

[`PADState`](PADState.md)

***

### vectorStore

> **vectorStore**: [`IVectorStore`](IVectorStore.md)

Defined in: [packages/agentos/src/memory/retrieval/store/MemoryStore.ts:48](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/MemoryStore.ts#L48)
