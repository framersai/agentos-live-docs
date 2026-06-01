# Interface: TypedSpreadingActivationOptions

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedSpreadingActivation.ts:49](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedSpreadingActivation.ts#L49)

Construction options for spreading activation.

## Properties

### decay

> **decay**: `number`

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedSpreadingActivation.ts:51](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedSpreadingActivation.ts#L51)

Per-hop decay factor δ ∈ (0, 1). Default 0.5.

***

### edgeMultipliers?

> `optional` **edgeMultipliers**: `Record`\<`"entity"` \| `"semantic"` \| `"temporal"` \| `"causal"`, `number`\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedSpreadingActivation.ts:53](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedSpreadingActivation.ts#L53)

Override the default [DEFAULT\_EDGE\_MULTIPLIERS](../variables/DEFAULT_EDGE_MULTIPLIERS.md).
