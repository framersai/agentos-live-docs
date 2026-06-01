# Interface: GraphEdge

Defined in: [packages/agentos/src/orchestration/ir/types.ts:496](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L496)

A directed edge connecting two vertices in the compiled execution graph.

The `source` and `target` fields may be `START` or `END` sentinels.

## Properties

### condition?

> `optional` **condition**: [`GraphCondition`](../type-aliases/GraphCondition.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:512](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L512)

Routing predicate; required when `type` is `'conditional'`.

***

### discoveryFallback?

> `optional` **discoveryFallback**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:518](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L518)

Node id used as fallback when discovery resolves no target.

***

### discoveryKind?

> `optional` **discoveryKind**: `"tool"` \| `"skill"` \| `"extension"` \| `"any"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:516](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L516)

Capability kind filter applied during discovery-based routing.

***

### discoveryQuery?

> `optional` **discoveryQuery**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:514](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L514)

Semantic query used to discover the target node at runtime; required for `'discovery'` edges.

***

### guardrailPolicy?

> `optional` **guardrailPolicy**: [`GuardrailPolicy`](GuardrailPolicy.md)

Defined in: [packages/agentos/src/orchestration/ir/types.ts:531](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L531)

Optional guardrail policy evaluated when traffic crosses this edge.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:498](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L498)

Unique identifier within the parent `CompiledExecutionGraph`.

***

### personalityCondition?

> `optional` **personalityCondition**: `object`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:524](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L524)

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

Defined in: [packages/agentos/src/orchestration/ir/types.ts:500](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L500)

Source node id (or `START`).

***

### target

> **target**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:502](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L502)

Target node id (or `END`).

***

### type

> **type**: `"discovery"` \| `"static"` \| `"conditional"` \| `"personality"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:510](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L510)

Edge routing strategy:
- `static`      — always followed; no condition evaluated.
- `conditional` — followed only when `condition` evaluates to this edge's target.
- `discovery`   — target is resolved at runtime via capability discovery.
- `personality` — target is chosen based on the agent's current trait values.
