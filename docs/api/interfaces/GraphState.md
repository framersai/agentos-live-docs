# Interface: GraphState\<TInput, TScratch, TArtifacts\>

Defined in: [packages/agentos/src/orchestration/ir/types.ts:535](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/ir/types.ts#L535)

The mutable execution state threaded through every node of a graph run.

Generic parameters allow authors to provide precise types for their specific graph.
All fields except `scratch` and `artifacts` are managed exclusively by the runtime.

## Type Parameters

### TInput

`TInput` = `unknown`

Shape of the initial user-provided input.

### TScratch

`TScratch` = `unknown`

Shape of intermediate computation results passed between nodes.

### TArtifacts

`TArtifacts` = `unknown`

Shape of outputs produced for external consumption.

## Properties

### artifacts

> **artifacts**: `TArtifacts`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:543](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/ir/types.ts#L543)

Accumulated outputs intended for the caller; merged via `StateReducers` after each node.

***

### checkpointId?

> `optional` **checkpointId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:553](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/ir/types.ts#L553)

Id of the most recently persisted checkpoint snapshot, if any.

***

### currentNodeId

> **currentNodeId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:547](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/ir/types.ts#L547)

Id of the node currently executing (or most recently completed).

***

### diagnostics

> **diagnostics**: [`DiagnosticsView`](DiagnosticsView.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:545](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/ir/types.ts#L545)

Append-only telemetry record updated after each node completes.

***

### input

> **input**: `Readonly`\<`TInput`\>

Defined in: [packages/agentos/src/orchestration/ir/types.ts:537](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/ir/types.ts#L537)

The original user-provided input; frozen after graph start.

***

### iteration

> **iteration**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:551](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/ir/types.ts#L551)

Number of times the graph has looped back to a previously visited node.

***

### memory

> **memory**: [`MemoryView`](MemoryView.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:541](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/ir/types.ts#L541)

Read-only memory snapshot populated before each node executes.

***

### scratch

> **scratch**: `TScratch`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:539](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/ir/types.ts#L539)

Node-to-node communication bag; merged via `StateReducers` after each node.

***

### visitedNodes

> **visitedNodes**: `string`[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:549](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/ir/types.ts#L549)

Ordered list of node ids that have completed execution in this run.
