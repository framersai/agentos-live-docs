# Interface: SessionRetrieverOptions

Defined in: [packages/agentos/src/cognition/memory/retrieval/session/SessionRetriever.ts:77](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/session/SessionRetriever.ts#L77)

Options for constructing a [SessionRetriever](../classes/SessionRetriever.md).

## Properties

### defaultChunksPerSession?

> `optional` **defaultChunksPerSession**: `number`

Defined in: [packages/agentos/src/cognition/memory/retrieval/session/SessionRetriever.ts:86](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/session/SessionRetriever.ts#L86)

Default M (chunks per session in Stage 2).

#### Default

```ts
3
```

***

### defaultTopSessions?

> `optional` **defaultTopSessions**: `number`

Defined in: [packages/agentos/src/cognition/memory/retrieval/session/SessionRetriever.ts:84](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/session/SessionRetriever.ts#L84)

Default K (sessions to select in Stage 1).

#### Default

```ts
5
```

***

### embeddingManager

> **embeddingManager**: [`IEmbeddingManager`](IEmbeddingManager.md)

Defined in: [packages/agentos/src/cognition/memory/retrieval/session/SessionRetriever.ts:80](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/session/SessionRetriever.ts#L80)

***

### memoryStore

> **memoryStore**: [`MemoryStore`](../classes/MemoryStore.md)

Defined in: [packages/agentos/src/cognition/memory/retrieval/session/SessionRetriever.ts:79](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/session/SessionRetriever.ts#L79)

***

### rerankerService?

> `optional` **rerankerService**: `RerankerService`

Defined in: [packages/agentos/src/cognition/memory/retrieval/session/SessionRetriever.ts:82](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/session/SessionRetriever.ts#L82)

Optional reranker. When provided, the merged chunk pool is reranked before truncation.

***

### summaryStore

> **summaryStore**: [`SessionSummaryStore`](../classes/SessionSummaryStore.md)

Defined in: [packages/agentos/src/cognition/memory/retrieval/session/SessionRetriever.ts:78](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/session/SessionRetriever.ts#L78)
