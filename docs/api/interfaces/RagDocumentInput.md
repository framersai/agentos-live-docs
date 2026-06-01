# Interface: RagDocumentInput

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:33](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L33)

Represents raw document content provided for ingestion.

## Properties

### aclGroups?

> `optional` **aclGroups**: `string`[]

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:67](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L67)

ACL groups allowed to retrieve this document. Empty/undefined means
the document inherits the data source's default ACL (typically
unrestricted within the tenant).

***

### classification?

> `optional` **classification**: `"internal"` \| `"public"` \| `"confidential"` \| `"restricted"`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:72](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L72)

Sensitivity classification. Drives default redaction policy and audit
obligations.

***

### content

> **content**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:37](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L37)

Raw text that will be chunked and embedded.

***

### dataSourceId?

> `optional` **dataSourceId**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:39](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L39)

Optional override for which data source / collection to push this document into.

***

### effectiveDate?

> `optional` **effectiveDate**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:80](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L80)

ISO timestamp: when this document became authoritative.

***

### embedding?

> `optional` **embedding**: `number`[]

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:49](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L49)

Optional pre-computed embedding vector.

***

### embeddingModelId?

> `optional` **embeddingModelId**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:51](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L51)

Identifier of the embedding model used when `embedding` is supplied.

***

### expiresAt?

> `optional` **expiresAt**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:82](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L82)

ISO timestamp: when this document stops being authoritative.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:35](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L35)

Stable identifier for the document (chunk IDs will derive from this).

***

### language?

> `optional` **language**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:45](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L45)

ISO language tag for the content.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, [`MetadataValue`](../type-aliases/MetadataValue.md)\>

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:43](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L43)

Arbitrary metadata stored alongside chunks; values must be vector-store friendly.

***

### source?

> `optional` **source**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:41](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L41)

Original source pointer (URL, file path, API, etc.).

***

### status?

> `optional` **status**: `"draft"` \| `"deprecated"` \| `"active"` \| `"archived"`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:78](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L78)

Lifecycle status. `active` chunks are returned by default;
`draft`/`archived`/`deprecated` are excluded unless the retrieval
options opt them in.

***

### tenantId?

> `optional` **tenantId**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:61](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L61)

Tenant the document belongs to. Used for multi-tenant isolation.

***

### timestamp?

> `optional` **timestamp**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:47](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L47)

ISO timestamp describing when this content was produced/updated.
