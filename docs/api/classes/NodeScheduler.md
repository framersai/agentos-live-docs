# Class: NodeScheduler

Defined in: [packages/agentos/src/orchestration/runtime/NodeScheduler.ts:23](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/runtime/NodeScheduler.ts#L23)

Schedules graph node execution by computing topological ordering, detecting
structural issues (cycles, unreachable nodes), and determining which nodes
are ready to run given a set of already-completed nodes.

All methods are pure and stateless with respect to execution — the scheduler
only reads the static graph structure provided at construction time.

## Constructors

### Constructor

> **new NodeScheduler**(`nodes`, `edges`): `NodeScheduler`

Defined in: [packages/agentos/src/orchestration/runtime/NodeScheduler.ts:39](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/runtime/NodeScheduler.ts#L39)

Constructs a NodeScheduler from a compiled graph's node and edge lists.

#### Parameters

##### nodes

[`GraphNode`](../interfaces/GraphNode.md)[]

All real (non-sentinel) graph nodes.

##### edges

[`GraphEdge`](../interfaces/GraphEdge.md)[]

All directed edges, including those from/to START or END sentinels.

#### Returns

`NodeScheduler`

## Methods

### getReadyNodes()

> **getReadyNodes**(`completedNodeIds`, `skippedNodeIds?`): `string`[]

Defined in: [packages/agentos/src/orchestration/runtime/NodeScheduler.ts:158](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/runtime/NodeScheduler.ts#L158)

Returns the ids of all real nodes that are eligible to execute next, given
the set of nodes that have already finished (completed or skipped).

A node is "ready" when:
1. It has not already completed or been skipped.
2. Every one of its predecessors is either the START sentinel or a member of
   the completed/skipped set.

#### Parameters

##### completedNodeIds

`string`[]

Node ids that have successfully finished execution.

##### skippedNodeIds?

`string`[] = `[]`

Node ids that were bypassed (e.g. via conditional routing).

#### Returns

`string`[]

Array of node ids that can be dispatched for execution immediately.

***

### getUnreachableNodes()

> **getUnreachableNodes**(): `string`[]

Defined in: [packages/agentos/src/orchestration/runtime/NodeScheduler.ts:192](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/runtime/NodeScheduler.ts#L192)

Returns the ids of all real nodes that are not reachable from the START
sentinel via a BFS traversal of the adjacency list.

Unreachable (orphan) nodes indicate a structural authoring error: they can
never execute because no execution path leads to them.  The runtime may
choose to warn, error, or prune these nodes before starting a run.

#### Returns

`string`[]

Array of node ids that cannot be reached from START; empty for a
         well-formed graph.

***

### hasCycles()

> **hasCycles**(): `boolean`

Defined in: [packages/agentos/src/orchestration/runtime/NodeScheduler.ts:137](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/runtime/NodeScheduler.ts#L137)

Returns `true` if the graph contains at least one directed cycle among the
real nodes (sentinels are excluded from cycle detection).

Implemented by comparing the length of the topological sort result against
the total number of real nodes: Kahn's algorithm processes every node in a
DAG, so any shortfall indicates nodes trapped inside a cycle.

#### Returns

`boolean`

`true` when a cycle exists; `false` for a valid DAG.

***

### topologicalSort()

> **topologicalSort**(): `string`[]

Defined in: [packages/agentos/src/orchestration/runtime/NodeScheduler.ts:71](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/runtime/NodeScheduler.ts#L71)

Returns real node ids in a valid topological execution order using Kahn's
algorithm (BFS over in-degree).

START and END sentinels are intentionally excluded from the returned array
because they are virtual control-flow markers, not executable nodes.

If the graph contains a cycle, the returned array will be shorter than
`nodeIds.size` — use [hasCycles](#hascycles) to distinguish this case explicitly.

#### Returns

`string`[]

Ordered array of real node ids; empty if there are no real nodes.
