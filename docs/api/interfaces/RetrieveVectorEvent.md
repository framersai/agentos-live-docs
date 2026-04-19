# Interface: RetrieveVectorEvent

Defined in: [packages/agentos/src/query-router/types.ts:901](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L901)

Emitted when vector search results are available.

## Properties

### chunkCount

> **chunkCount**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:904](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L904)

Number of chunks returned by vector search.

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:906](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L906)

Duration of vector retrieval in milliseconds.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:908](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L908)

Timestamp of the event.

***

### type

> **type**: `"retrieve:vector"`

Defined in: [packages/agentos/src/query-router/types.ts:902](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L902)
