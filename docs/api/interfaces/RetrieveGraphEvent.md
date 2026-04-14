# Interface: RetrieveGraphEvent

Defined in: [packages/agentos/src/query-router/types.ts:914](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L914)

Emitted when graph traversal results are available.

## Properties

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:919](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L919)

Duration of graph retrieval in milliseconds.

***

### entityCount

> **entityCount**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:917](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L917)

Number of entities discovered via graph traversal.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:921](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L921)

Timestamp of the event.

***

### type

> **type**: `"retrieve:graph"`

Defined in: [packages/agentos/src/query-router/types.ts:915](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L915)
