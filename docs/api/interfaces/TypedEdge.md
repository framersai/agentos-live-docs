# Interface: TypedEdge

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/types.ts:123](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/types.ts#L123)

Typed edge between two facts in the network graph. Direction matters
for causal edges (premise → conclusion); other kinds are
bidirectional and stored as a pair of edges.

## Properties

### fromFactId

> **fromFactId**: `string`

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/types.ts:125](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/types.ts#L125)

Source fact ID.

***

### kind

> **kind**: `"entity"` \| `"semantic"` \| `"temporal"` \| `"causal"`

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/types.ts:129](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/types.ts#L129)

Edge kind — drives μ(ℓ) multiplier in spreading activation.

***

### toFactId

> **toFactId**: `string`

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/types.ts:127](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/types.ts#L127)

Target fact ID.

***

### weight

> **weight**: `number`

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/types.ts:131](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/types.ts#L131)

Edge weight. Composed with decay δ and μ(ℓ) at activation time.
