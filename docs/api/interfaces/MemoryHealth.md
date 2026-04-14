# Interface: MemoryHealth

Defined in: [packages/agentos/src/memory/io/facade/types.ts:591](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L591)

Snapshot of the memory store's health and usage statistics.
Returned by `Memory.health()`.

## Properties

### activeTraces

> **activeTraces**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:600](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L600)

Number of traces that are currently active (strength > pruneThreshold).

***

### avgStrength

> **avgStrength**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:605](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L605)

Mean Ebbinghaus strength across all active traces (0–1).

***

### documentsIngested

> **documentsIngested**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:641](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L641)

Total number of document chunks ingested via `Memory.ingest()`.

***

### graphEdges

> **graphEdges**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:620](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L620)

Number of edges in the knowledge graph (0 when `graph` is disabled).

***

### graphNodes

> **graphNodes**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:615](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L615)

Number of nodes in the knowledge graph (0 when `graph` is disabled).

***

### lastConsolidation

> **lastConsolidation**: `string` \| `null`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:626](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L626)

ISO 8601 timestamp of the last successful consolidation run.
`null` if consolidation has never been run.

***

### totalTraces

> **totalTraces**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:595](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L595)

Total number of traces in the store (active + inactive).

***

### tracesPerScope

> **tracesPerScope**: `Record`\<`string`, `number`\>

Defined in: [packages/agentos/src/memory/io/facade/types.ts:636](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L636)

Trace count broken down by visibility scope.

***

### tracesPerType

> **tracesPerType**: `Record`\<`string`, `number`\>

Defined in: [packages/agentos/src/memory/io/facade/types.ts:631](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L631)

Trace count broken down by Tulving memory type.

***

### weakestTraceStrength

> **weakestTraceStrength**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:610](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L610)

Strength of the weakest active trace.
