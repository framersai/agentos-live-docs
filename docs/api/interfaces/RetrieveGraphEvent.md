# Interface: RetrieveGraphEvent

Defined in: [packages/agentos/src/query-router/types.ts:900](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L900)

Emitted when graph traversal results are available.

## Properties

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:905](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L905)

Duration of graph retrieval in milliseconds.

***

### entityCount

> **entityCount**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:903](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L903)

Number of entities discovered via graph traversal.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:907](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L907)

Timestamp of the event.

***

### type

> **type**: `"retrieve:graph"`

Defined in: [packages/agentos/src/query-router/types.ts:901](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L901)
