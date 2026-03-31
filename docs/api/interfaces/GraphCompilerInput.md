# Interface: GraphCompilerInput

Defined in: [packages/agentos/src/orchestration/compiler/GraphCompiler.ts:37](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/compiler/GraphCompiler.ts#L37)

Everything the compiler needs to produce a `CompiledExecutionGraph`.

## Properties

### checkpointPolicy

> **checkpointPolicy**: `"none"` \| `"every_node"` \| `"explicit"`

Defined in: [packages/agentos/src/orchestration/compiler/GraphCompiler.ts:61](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/compiler/GraphCompiler.ts#L61)

Graph-wide default checkpoint persistence strategy.

***

### edges

> **edges**: [`GraphEdge`](GraphEdge.md)[]

Defined in: [packages/agentos/src/orchestration/compiler/GraphCompiler.ts:43](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/compiler/GraphCompiler.ts#L43)

All directed edges (including START / END connections).

***

### memoryConsistency

> **memoryConsistency**: [`MemoryConsistencyMode`](../type-aliases/MemoryConsistencyMode.md)

Defined in: [packages/agentos/src/orchestration/compiler/GraphCompiler.ts:59](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/compiler/GraphCompiler.ts#L59)

Graph-wide memory isolation mode.

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/orchestration/compiler/GraphCompiler.ts:39](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/compiler/GraphCompiler.ts#L39)

Human-readable name embedded in the compiled graph.

***

### nodes

> **nodes**: `Map`\<`string`, [`GraphNode`](GraphNode.md)\>

Defined in: [packages/agentos/src/orchestration/compiler/GraphCompiler.ts:41](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/compiler/GraphCompiler.ts#L41)

All user-declared nodes keyed by their declared id.

***

### reducers

> **reducers**: [`StateReducers`](StateReducers.md)

Defined in: [packages/agentos/src/orchestration/compiler/GraphCompiler.ts:57](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/compiler/GraphCompiler.ts#L57)

Field-level merge strategies forwarded unchanged to the IR.

***

### stateSchema

> **stateSchema**: `object`

Defined in: [packages/agentos/src/orchestration/compiler/GraphCompiler.ts:48](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/compiler/GraphCompiler.ts#L48)

Zod schema instances for the three GraphState generics.

#### artifacts

> **artifacts**: `any`

Schema for `GraphState.artifacts` — accumulated external outputs.

#### input

> **input**: `any`

Schema for `GraphState.input` — the frozen user-provided input.

#### scratch

> **scratch**: `any`

Schema for `GraphState.scratch` — the node-to-node communication bag.
