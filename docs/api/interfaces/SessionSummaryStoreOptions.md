# Interface: SessionSummaryStoreOptions

Defined in: [packages/agentos/src/cognition/memory/retrieval/session/SessionSummaryStore.ts:49](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/session/SessionSummaryStore.ts#L49)

Options for constructing a [SessionSummaryStore](../classes/SessionSummaryStore.md).

## Properties

### collectionPrefix?

> `optional` **collectionPrefix**: `string`

Defined in: [packages/agentos/src/cognition/memory/retrieval/session/SessionSummaryStore.ts:59](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/session/SessionSummaryStore.ts#L59)

Collection-name prefix. Final collection is
`<prefix>_<scope>_<scopeId>`.

#### Default

```ts
'cogmem_sessions'
```

***

### embeddingManager

> **embeddingManager**: [`IEmbeddingManager`](IEmbeddingManager.md)

Defined in: [packages/agentos/src/cognition/memory/retrieval/session/SessionSummaryStore.ts:53](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/session/SessionSummaryStore.ts#L53)

Embedding manager shared with the rest of the memory stack (reuse for cache hits).

***

### vectorStore

> **vectorStore**: [`IVectorStore`](IVectorStore.md)

Defined in: [packages/agentos/src/cognition/memory/retrieval/session/SessionSummaryStore.ts:51](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/session/SessionSummaryStore.ts#L51)

Vector store to use for the summary collection.
