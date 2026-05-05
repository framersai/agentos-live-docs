# Interface: RetrieveVectorEvent

Defined in: [packages/agentos/src/query-router/types.ts:912](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/query-router/types.ts#L912)

Emitted when vector search results are available.

## Properties

### chunkCount

> **chunkCount**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:915](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/query-router/types.ts#L915)

Number of chunks returned by vector search.

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:917](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/query-router/types.ts#L917)

Duration of vector retrieval in milliseconds.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:919](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/query-router/types.ts#L919)

Timestamp of the event.

***

### type

> **type**: `"retrieve:vector"`

Defined in: [packages/agentos/src/query-router/types.ts:913](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/query-router/types.ts#L913)
