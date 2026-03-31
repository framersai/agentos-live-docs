# Interface: GraphEdge

Defined in: [packages/agentos/src/orchestration/ir/types.ts:445](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L445)

A directed edge connecting two vertices in the compiled execution graph.

The `source` and `target` fields may be `START` or `END` sentinels.

## Properties

### condition?

> `optional` **condition**: [`GraphCondition`](../type-aliases/GraphCondition.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:461](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L461)

Routing predicate; required when `type` is `'conditional'`.

***

### discoveryFallback?

> `optional` **discoveryFallback**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:467](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L467)

Node id used as fallback when discovery resolves no target.

***

### discoveryKind?

> `optional` **discoveryKind**: `"tool"` \| `"skill"` \| `"extension"` \| `"any"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:465](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L465)

Capability kind filter applied during discovery-based routing.

***

### discoveryQuery?

> `optional` **discoveryQuery**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:463](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L463)

Semantic query used to discover the target node at runtime; required for `'discovery'` edges.

***

### guardrailPolicy?

> `optional` **guardrailPolicy**: [`GuardrailPolicy`](GuardrailPolicy.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:480](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L480)

Optional guardrail policy evaluated when traffic crosses this edge.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:447](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L447)

Unique identifier within the parent `CompiledExecutionGraph`.

***

### personalityCondition?

> `optional` **personalityCondition**: `object`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:473](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L473)

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

Defined in: [packages/agentos/src/orchestration/ir/types.ts:449](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L449)

Source node id (or `START`).

***

### target

> **target**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:451](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L451)

Target node id (or `END`).

***

### type

> **type**: `"discovery"` \| `"static"` \| `"conditional"` \| `"personality"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:459](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L459)

Edge routing strategy:
- `static`      — always followed; no condition evaluated.
- `conditional` — followed only when `condition` evaluates to this edge's target.
- `discovery`   — target is resolved at runtime via capability discovery.
- `personality` — target is chosen based on the agent's current trait values.
