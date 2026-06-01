# Interface: SpreadOptions

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedSpreadingActivation.ts:59](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedSpreadingActivation.ts#L59)

Per-call options.

## Properties

### activationThreshold?

> `optional` **activationThreshold**: `number`

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedSpreadingActivation.ts:63](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedSpreadingActivation.ts#L63)

Activation cutoff. Nodes below this threshold are not propagated.

***

### maxDepth

> **maxDepth**: `number`

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedSpreadingActivation.ts:61](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedSpreadingActivation.ts#L61)

Maximum hops from a seed node. Default cap on graph traversal.
