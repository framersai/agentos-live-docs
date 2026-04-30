# Interface: MemoryHealth

Defined in: [packages/agentos/src/memory/io/facade/types.ts:599](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L599)

Snapshot of the memory store's health and usage statistics.
Returned by `Memory.health()`.

## Properties

### activeTraces

> **activeTraces**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:608](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L608)

Number of traces that are currently active (strength > pruneThreshold).

***

### avgStrength

> **avgStrength**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:613](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L613)

Mean Ebbinghaus strength across all active traces (0–1).

***

### documentsIngested

> **documentsIngested**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:649](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L649)

Total number of document chunks ingested via `Memory.ingest()`.

***

### graphEdges

> **graphEdges**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:628](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L628)

Number of edges in the knowledge graph (0 when `graph` is disabled).

***

### graphNodes

> **graphNodes**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:623](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L623)

Number of nodes in the knowledge graph (0 when `graph` is disabled).

***

### lastConsolidation

> **lastConsolidation**: `string` \| `null`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:634](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L634)

ISO 8601 timestamp of the last successful consolidation run.
`null` if consolidation has never been run.

***

### totalTraces

> **totalTraces**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:603](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L603)

Total number of traces in the store (active + inactive).

***

### tracesPerScope

> **tracesPerScope**: `Record`\<`string`, `number`\>

Defined in: [packages/agentos/src/memory/io/facade/types.ts:644](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L644)

Trace count broken down by visibility scope.

***

### tracesPerType

> **tracesPerType**: `Record`\<`string`, `number`\>

Defined in: [packages/agentos/src/memory/io/facade/types.ts:639](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L639)

Trace count broken down by Tulving memory type.

***

### weakestTraceStrength

> **weakestTraceStrength**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:618](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L618)

Strength of the weakest active trace.
