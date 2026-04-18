# Interface: ResearchPhaseEvent

Defined in: [packages/agentos/src/query-router/types.ts:979](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/query-router/types.ts#L979)

Emitted after each iteration of the research loop.

## Properties

### iteration

> **iteration**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:982](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/query-router/types.ts#L982)

Current iteration number (1-based).

***

### newChunksFound

> **newChunksFound**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:986](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/query-router/types.ts#L986)

Number of new chunks discovered in this iteration.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:988](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/query-router/types.ts#L988)

Timestamp of the event.

***

### totalIterations

> **totalIterations**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:984](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/query-router/types.ts#L984)

Total configured iterations.

***

### type

> **type**: `"research:phase"`

Defined in: [packages/agentos/src/query-router/types.ts:980](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/query-router/types.ts#L980)
