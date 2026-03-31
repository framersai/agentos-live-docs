# Interface: MemoryPolicy

Defined in: [packages/agentos/src/orchestration/ir/types.ts:287](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/ir/types.ts#L287)

Controls how a node reads from and writes to the agent's memory subsystem.

## Properties

### consistency

> **consistency**: [`MemoryConsistencyMode`](../type-aliases/MemoryConsistencyMode.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:288](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/ir/types.ts#L288)

Isolation mode applied for all memory I/O in this node.

***

### read?

> `optional` **read**: `object`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:289](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/ir/types.ts#L289)

Optional filter applied when loading traces before execution.

#### maxTraces?

> `optional` **maxTraces**: `number`

Maximum number of traces to surface into `GraphState.memory`.

#### minStrength?

> `optional` **minStrength**: `number`

Minimum consolidation strength (0–1) for a trace to be returned.

#### scope?

> `optional` **scope**: [`GraphMemoryScope`](../type-aliases/GraphMemoryScope.md)

Restrict loaded traces to this scope.

#### semanticQuery?

> `optional` **semanticQuery**: `string`

Free-text semantic query used for vector-similarity retrieval.

#### types?

> `optional` **types**: [`MemoryTraceType`](../type-aliases/MemoryTraceType.md)[]

Restrict loaded traces to these memory types.

***

### write?

> `optional` **write**: `object`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:301](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/ir/types.ts#L301)

Optional encoding settings applied when persisting after execution.

#### autoEncode?

> `optional` **autoEncode**: `boolean`

When true, the runtime auto-encodes node output into a new trace.

#### scope?

> `optional` **scope**: [`GraphMemoryScope`](../type-aliases/GraphMemoryScope.md)

Scope applied to auto-encoded output.

#### type?

> `optional` **type**: [`MemoryTraceType`](../type-aliases/MemoryTraceType.md)

Trace category applied to auto-encoded output.
