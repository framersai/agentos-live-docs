# Interface: GraphState\<TInput, TScratch, TArtifacts\>

Defined in: [packages/agentos/src/orchestration/ir/types.ts:548](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L548)

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

Defined in: [packages/agentos/src/orchestration/ir/types.ts:556](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L556)

Accumulated outputs intended for the caller; merged via `StateReducers` after each node.

***

### checkpointId?

> `optional` **checkpointId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:566](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L566)

Id of the most recently persisted checkpoint snapshot, if any.

***

### currentNodeId

> **currentNodeId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:560](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L560)

Id of the node currently executing (or most recently completed).

***

### diagnostics

> **diagnostics**: [`DiagnosticsView`](DiagnosticsView.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:558](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L558)

Append-only telemetry record updated after each node completes.

***

### input

> **input**: `Readonly`\<`TInput`\>

Defined in: [packages/agentos/src/orchestration/ir/types.ts:550](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L550)

The original user-provided input; frozen after graph start.

***

### iteration

> **iteration**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:564](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L564)

Number of times the graph has looped back to a previously visited node.

***

### memory

> **memory**: [`MemoryView`](MemoryView.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:554](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L554)

Read-only memory snapshot populated before each node executes.

***

### scratch

> **scratch**: `TScratch`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:552](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L552)

Node-to-node communication bag; merged via `StateReducers` after each node.

***

### visitedNodes

> **visitedNodes**: `string`[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:562](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L562)

Ordered list of node ids that have completed execution in this run.
