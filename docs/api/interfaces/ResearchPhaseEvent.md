# Interface: ResearchPhaseEvent

Defined in: [packages/agentos/src/query-router/types.ts:965](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L965)

Emitted after each iteration of the research loop.

## Properties

### iteration

> **iteration**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:968](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L968)

Current iteration number (1-based).

***

### newChunksFound

> **newChunksFound**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:972](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L972)

Number of new chunks discovered in this iteration.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:974](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L974)

Timestamp of the event.

***

### totalIterations

> **totalIterations**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:970](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L970)

Total configured iterations.

***

### type

> **type**: `"research:phase"`

Defined in: [packages/agentos/src/query-router/types.ts:966](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L966)
