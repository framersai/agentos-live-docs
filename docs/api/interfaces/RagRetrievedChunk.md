# Interface: RagRetrievedChunk

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:129](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L129)

Structure describing a retrieved chunk.

## Properties

### aclGroups?

> `optional` **aclGroups**: `string`[]

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:156](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L156)

ACL groups allowed to retrieve this chunk.

***

### classification?

> `optional` **classification**: `"internal"` \| `"public"` \| `"confidential"` \| `"restricted"`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:158](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L158)

Sensitivity classification of the originating document.

***

### content

> **content**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:131](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L131)

***

### dataSourceId?

> `optional` **dataSourceId**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:135](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L135)

Data source / collection identifier.

***

### effectiveDate?

> `optional` **effectiveDate**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:162](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L162)

ISO timestamp: when the originating document became authoritative.

***

### embedding?

> `optional` **embedding**: `number`[]

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:143](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L143)

Embedding vector if `includeEmbeddings` was requested.

***

### expiresAt?

> `optional` **expiresAt**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:164](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L164)

ISO timestamp: when the originating document stops being authoritative.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:130](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L130)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, [`MetadataValue`](../type-aliases/MetadataValue.md)\>

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:139](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L139)

Metadata that traveled with the chunk.

***

### originalDocumentId

> **originalDocumentId**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:133](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L133)

Original document ID for traceability.

***

### relevanceScore?

> `optional` **relevanceScore**: `number`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:141](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L141)

Similarity or relevance score returned by the vector store.

***

### source?

> `optional` **source**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:137](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L137)

Optional human-friendly source description.

***

### status?

> `optional` **status**: `"draft"` \| `"deprecated"` \| `"active"` \| `"archived"`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:160](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L160)

Lifecycle status of the originating document.

***

### tenantId?

> `optional` **tenantId**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:154](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L154)

Tenant the originating document belongs to.
