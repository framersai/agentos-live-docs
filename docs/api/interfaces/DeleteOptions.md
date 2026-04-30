# Interface: DeleteOptions

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:226](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L226)

Options for a vector store delete operation.

## Interface

DeleteOptions

## Properties

### customParams?

> `optional` **customParams**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:229](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L229)

Provider-specific parameters for the delete operation.

***

### deleteAll?

> `optional` **deleteAll**: `boolean`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:228](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L228)

If true (and `ids` and `filter` are empty), attempt to delete all documents
in the specified collection. This is a destructive operation and should be used with extreme caution.

***

### filter?

> `optional` **filter**: [`MetadataFilter`](../type-aliases/MetadataFilter.md)

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:227](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L227)

Optional: Delete documents matching this metadata filter.
If `ids` are also provided, the behavior (AND/OR) might be store-specific or could be an error.
Typically, deletion is by IDs OR by filter.
