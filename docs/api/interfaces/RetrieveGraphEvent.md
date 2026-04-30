# Interface: RetrieveGraphEvent

Defined in: [packages/agentos/src/query-router/types.ts:925](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L925)

Emitted when graph traversal results are available.

## Properties

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:930](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L930)

Duration of graph retrieval in milliseconds.

***

### entityCount

> **entityCount**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:928](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L928)

Number of entities discovered via graph traversal.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:932](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L932)

Timestamp of the event.

***

### type

> **type**: `"retrieve:graph"`

Defined in: [packages/agentos/src/query-router/types.ts:926](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L926)
