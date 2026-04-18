# Interface: CompiledExecutionGraph

Defined in: [packages/agentos/src/orchestration/ir/types.ts:664](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/ir/types.ts#L664)

The fully compiled, execution-ready representation of an agent graph.

All three authoring APIs (AgentGraph builder, workflow DSL, mission planner) produce
a `CompiledExecutionGraph` as their final compilation artefact.  The runtime never
interprets authoring-API-specific constructs — it operates exclusively on this type.

## Properties

### checkpointPolicy

> **checkpointPolicy**: `"none"` \| `"every_node"` \| `"explicit"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:692](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/ir/types.ts#L692)

Graph-wide default checkpoint persistence policy.
Per-node `GraphNode.checkpoint` settings override this default.

- `every_node` — persist after every node (safe, high storage cost).
- `explicit`   — persist only for nodes that declare `checkpoint !== 'none'`.
- `none`       — never persist (lowest overhead; no recovery on crash).

***

### edges

> **edges**: [`GraphEdge`](GraphEdge.md)[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:672](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/ir/types.ts#L672)

All directed edges, including static entry/exit edges from/to `START`/`END`.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:666](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/ir/types.ts#L666)

Stable, globally unique graph identifier (slug or UUIDv4).

***

### memoryConsistency

> **memoryConsistency**: [`MemoryConsistencyMode`](../type-aliases/MemoryConsistencyMode.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:694](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/ir/types.ts#L694)

Graph-wide memory consistency mode; may be overridden per-node via `MemoryPolicy.consistency`.

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:668](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/ir/types.ts#L668)

Human-readable display name.

***

### nodes

> **nodes**: [`GraphNode`](GraphNode.md)[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:670](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/ir/types.ts#L670)

All vertices, including any `START`/`END` bridge nodes inserted by the compiler.

***

### reducers

> **reducers**: [`StateReducers`](StateReducers.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:683](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/ir/types.ts#L683)

Field-level reducer configuration applied after each node completes.

***

### stateSchema

> **stateSchema**: `object`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:677](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/ir/types.ts#L677)

JSON-Schema-compatible schema declarations for the three `GraphState` generics.
Used by the runtime for validation and by tooling for type generation.

#### artifacts

> **artifacts**: `Record`\<`string`, `unknown`\>

#### input

> **input**: `Record`\<`string`, `unknown`\>

#### scratch

> **scratch**: `Record`\<`string`, `unknown`\>
