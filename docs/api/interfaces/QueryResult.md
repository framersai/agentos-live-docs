# Interface: QueryResult

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:157](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/vector-store/IVectorStore.ts#L157)

The result of a vector store query operation.

## Interface

QueryResult

## Properties

### documents

> **documents**: [`RetrievedVectorDocument`](RetrievedVectorDocument.md)[]

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:158](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/vector-store/IVectorStore.ts#L158)

An array of retrieved documents, typically sorted by relevance (similarity score).

***

### queryId?

> `optional` **queryId**: `string`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:159](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/vector-store/IVectorStore.ts#L159)

An optional identifier for the query, useful for logging or diagnostics.

***

### stats?

> `optional` **stats**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:160](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/vector-store/IVectorStore.ts#L160)

Optional statistics about the query execution (e.g., latency).
