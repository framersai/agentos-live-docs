# Interface: RetrieveVectorEvent

Defined in: [packages/agentos/src/query-router/types.ts:912](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L912)

Emitted when vector search results are available.

## Properties

### chunkCount

> **chunkCount**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:915](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L915)

Number of chunks returned by vector search.

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:917](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L917)

Duration of vector retrieval in milliseconds.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:919](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L919)

Timestamp of the event.

***

### type

> **type**: `"retrieve:vector"`

Defined in: [packages/agentos/src/query-router/types.ts:913](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L913)
