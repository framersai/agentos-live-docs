# Class: TypedSpreadingActivation

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedSpreadingActivation.ts:71](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedSpreadingActivation.ts#L71)

Spreading-activation primitive over a typed network. Constructed
once per pipeline; safe to share across queries (all per-call state
lives in the local activation map).

## Constructors

### Constructor

> **new TypedSpreadingActivation**(`options`): `TypedSpreadingActivation`

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedSpreadingActivation.ts:75](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedSpreadingActivation.ts#L75)

#### Parameters

##### options

[`TypedSpreadingActivationOptions`](../interfaces/TypedSpreadingActivationOptions.md)

#### Returns

`TypedSpreadingActivation`

## Methods

### spread()

> **spread**(`store`, `seedIds`, `options`): `Map`\<`string`, `number`\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedSpreadingActivation.ts:93](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedSpreadingActivation.ts#L93)

Run spreading activation from a set of seed fact IDs. Returns a
map from fact ID to activation level, including the seeds (at
activation 1.0) and every reachable fact above the threshold.

Uses Eq. 12's max-aggregation: each step computes the candidate
activation `current · weight · δ · μ(kind)` for every outgoing
edge, then keeps the max across paths into a node.

#### Parameters

##### store

[`TypedNetworkStore`](TypedNetworkStore.md)

The typed network to traverse.

##### seedIds

`string`[]

Initial seed fact IDs (activated at 1.0).

##### options

[`SpreadOptions`](../interfaces/SpreadOptions.md)

maxDepth + activationThreshold.

#### Returns

`Map`\<`string`, `number`\>
