# Interface: GraphState\<TInput, TScratch, TArtifacts\>

Defined in: [packages/agentos/src/orchestration/ir/types.ts:497](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L497)

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

Defined in: [packages/agentos/src/orchestration/ir/types.ts:505](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L505)

Accumulated outputs intended for the caller; merged via `StateReducers` after each node.

***

### checkpointId?

> `optional` **checkpointId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:515](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L515)

Id of the most recently persisted checkpoint snapshot, if any.

***

### currentNodeId

> **currentNodeId**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:509](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L509)

Id of the node currently executing (or most recently completed).

***

### diagnostics

> **diagnostics**: [`DiagnosticsView`](DiagnosticsView.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:507](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L507)

Append-only telemetry record updated after each node completes.

***

### input

> **input**: `Readonly`\<`TInput`\>

Defined in: [packages/agentos/src/orchestration/ir/types.ts:499](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L499)

The original user-provided input; frozen after graph start.

***

### iteration

> **iteration**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:513](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L513)

Number of times the graph has looped back to a previously visited node.

***

### memory

> **memory**: [`MemoryView`](MemoryView.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:503](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L503)

Read-only memory snapshot populated before each node executes.

***

### scratch

> **scratch**: `TScratch`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:501](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L501)

Node-to-node communication bag; merged via `StateReducers` after each node.

***

### visitedNodes

> **visitedNodes**: `string`[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:511](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L511)

Ordered list of node ids that have completed execution in this run.
