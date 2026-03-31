# Interface: GraphEdge

Defined in: [packages/agentos/src/orchestration/ir/types.ts:483](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L483)

A directed edge connecting two vertices in the compiled execution graph.

The `source` and `target` fields may be `START` or `END` sentinels.

## Properties

### condition?

> `optional` **condition**: [`GraphCondition`](../type-aliases/GraphCondition.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:499](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L499)

Routing predicate; required when `type` is `'conditional'`.

***

### discoveryFallback?

> `optional` **discoveryFallback**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:505](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L505)

Node id used as fallback when discovery resolves no target.

***

### discoveryKind?

> `optional` **discoveryKind**: `"tool"` \| `"skill"` \| `"extension"` \| `"any"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:503](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L503)

Capability kind filter applied during discovery-based routing.

***

### discoveryQuery?

> `optional` **discoveryQuery**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:501](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L501)

Semantic query used to discover the target node at runtime; required for `'discovery'` edges.

***

### guardrailPolicy?

> `optional` **guardrailPolicy**: [`GuardrailPolicy`](GuardrailPolicy.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:518](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L518)

Optional guardrail policy evaluated when traffic crosses this edge.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:485](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L485)

Unique identifier within the parent `CompiledExecutionGraph`.

***

### personalityCondition?

> `optional` **personalityCondition**: `object`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:511](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L511)

Personality-based routing descriptor; required when `type` is `'personality'`.
The runtime reads `trait` from the agent's current HEXACO/PAD state and
routes to `above` or `below` depending on whether the value exceeds `threshold`.

#### above

> **above**: `string`

#### below

> **below**: `string`

#### threshold

> **threshold**: `number`

#### trait

> **trait**: `string`

***

### source

> **source**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:487](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L487)

Source node id (or `START`).

***

### target

> **target**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:489](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L489)

Target node id (or `END`).

***

### type

> **type**: `"discovery"` \| `"static"` \| `"conditional"` \| `"personality"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:497](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L497)

Edge routing strategy:
- `static`      — always followed; no condition evaluated.
- `conditional` — followed only when `condition` evaluates to this edge's target.
- `discovery`   — target is resolved at runtime via capability discovery.
- `personality` — target is chosen based on the agent's current trait values.
