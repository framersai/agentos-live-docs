# Class: TypedNetworkStore

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedNetworkStore.ts:32](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedNetworkStore.ts#L32)

In-memory 4-bank store. Holds facts indexed by ID + per-bank ID set
+ outgoing-edge map. Constructed empty; populate via [addFact](#addfact)
and [addEdge](#addedge).

## Constructors

### Constructor

> **new TypedNetworkStore**(): `TypedNetworkStore`

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedNetworkStore.ts:42](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedNetworkStore.ts#L42)

Construct an empty store with one entry per bank in
[BANK\_IDS](../variables/BANK_IDS.md). Pre-allocating avoids null-checks in the
insertion path.

#### Returns

`TypedNetworkStore`

## Methods

### addEdge()

> **addEdge**(`edge`): `void`

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedNetworkStore.ts:88](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedNetworkStore.ts#L88)

Insert a typed edge. Stores both the forward edge (`from → to`)
and a paired reverse edge (`to → from`) so spreading activation
traverses bidirectionally per Hindsight §2.4.1. Identical reverse-
edge insertion is what makes entity, semantic, and temporal links
bidirectional by construction.

#### Parameters

##### edge

[`TypedEdge`](../interfaces/TypedEdge.md)

#### Returns

`void`

***

### addFact()

> **addFact**(`fact`): `void`

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedNetworkStore.ts:53](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedNetworkStore.ts#L53)

Insert a fact. Routes into `fact.bank` by membership in the
appropriate `banks[bank]` set. Re-inserting the same ID overwrites
the prior fact and leaves bank membership unchanged.

#### Parameters

##### fact

[`TypedFact`](../interfaces/TypedFact.md)

#### Returns

`void`

***

### getBank()

> **getBank**(`bank`): `Set`\<`string`\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedNetworkStore.ts:69](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedNetworkStore.ts#L69)

Return the set of fact IDs in a given bank. Live reference — do
not mutate the returned `Set` directly.

#### Parameters

##### bank

`"WORLD"` | `"EXPERIENCE"` | `"OPINION"` | `"OBSERVATION"`

#### Returns

`Set`\<`string`\>

***

### getEdges()

> **getEdges**(`factId`): [`TypedEdge`](../interfaces/TypedEdge.md)[]

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedNetworkStore.ts:102](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedNetworkStore.ts#L102)

Outgoing edges from a fact. Empty array if the fact has no
outgoing edges or is unknown.

#### Parameters

##### factId

`string`

#### Returns

[`TypedEdge`](../interfaces/TypedEdge.md)[]

***

### getFact()

> **getFact**(`id`): [`TypedFact`](../interfaces/TypedFact.md) \| `undefined`

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedNetworkStore.ts:61](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedNetworkStore.ts#L61)

Lookup a fact by ID. Returns `undefined` if not present.

#### Parameters

##### id

`string`

#### Returns

[`TypedFact`](../interfaces/TypedFact.md) \| `undefined`

***

### iterateFacts()

> **iterateFacts**(): `IterableIterator`\<[`TypedFact`](../interfaces/TypedFact.md)\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedNetworkStore.ts:110](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedNetworkStore.ts#L110)

Iterate every fact in the store. Useful for export and
persistence.

#### Returns

`IterableIterator`\<[`TypedFact`](../interfaces/TypedFact.md)\>

***

### size()

> **size**(): `number`

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedNetworkStore.ts:77](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedNetworkStore.ts#L77)

Total fact count across all banks. Useful for debugging /
consolidation pruning thresholds.

#### Returns

`number`
