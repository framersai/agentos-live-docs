# Interface: DeleteOptions

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:204](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/vector-store/IVectorStore.ts#L204)

Options for a vector store delete operation.

## Interface

DeleteOptions

## Properties

### customParams?

> `optional` **customParams**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:207](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/vector-store/IVectorStore.ts#L207)

Provider-specific parameters for the delete operation.

***

### deleteAll?

> `optional` **deleteAll**: `boolean`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:206](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/vector-store/IVectorStore.ts#L206)

If true (and `ids` and `filter` are empty), attempt to delete all documents
in the specified collection. This is a destructive operation and should be used with extreme caution.

***

### filter?

> `optional` **filter**: [`MetadataFilter`](../type-aliases/MetadataFilter.md)

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:205](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/vector-store/IVectorStore.ts#L205)

Optional: Delete documents matching this metadata filter.
If `ids` are also provided, the behavior (AND/OR) might be store-specific or could be an error.
Typically, deletion is by IDs OR by filter.
