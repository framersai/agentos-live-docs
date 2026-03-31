# Interface: CompiledExecutionGraph

Defined in: [packages/agentos/src/orchestration/ir/types.ts:626](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L626)

The fully compiled, execution-ready representation of an agent graph.

All three authoring APIs (AgentGraph builder, workflow DSL, mission planner) produce
a `CompiledExecutionGraph` as their final compilation artefact.  The runtime never
interprets authoring-API-specific constructs — it operates exclusively on this type.

## Properties

### checkpointPolicy

> **checkpointPolicy**: `"none"` \| `"every_node"` \| `"explicit"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:654](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L654)

Graph-wide default checkpoint persistence policy.
Per-node `GraphNode.checkpoint` settings override this default.

- `every_node` — persist after every node (safe, high storage cost).
- `explicit`   — persist only for nodes that declare `checkpoint !== 'none'`.
- `none`       — never persist (lowest overhead; no recovery on crash).

***

### edges

> **edges**: [`GraphEdge`](GraphEdge.md)[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:634](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L634)

All directed edges, including static entry/exit edges from/to `START`/`END`.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:628](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L628)

Stable, globally unique graph identifier (slug or UUIDv4).

***

### memoryConsistency

> **memoryConsistency**: [`MemoryConsistencyMode`](../type-aliases/MemoryConsistencyMode.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:656](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L656)

Graph-wide memory consistency mode; may be overridden per-node via `MemoryPolicy.consistency`.

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:630](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L630)

Human-readable display name.

***

### nodes

> **nodes**: [`GraphNode`](GraphNode.md)[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:632](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L632)

All vertices, including any `START`/`END` bridge nodes inserted by the compiler.

***

### reducers

> **reducers**: [`StateReducers`](StateReducers.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:645](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L645)

Field-level reducer configuration applied after each node completes.

***

### stateSchema

> **stateSchema**: `object`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:639](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L639)

JSON-Schema-compatible schema declarations for the three `GraphState` generics.
Used by the runtime for validation and by tooling for type generation.

#### artifacts

> **artifacts**: `Record`\<`string`, `unknown`\>

#### input

> **input**: `Record`\<`string`, `unknown`\>

#### scratch

> **scratch**: `Record`\<`string`, `unknown`\>
