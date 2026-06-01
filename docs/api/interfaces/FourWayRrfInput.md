# Interface: FourWayRrfInput

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/FourWayRrf.ts:21](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/FourWayRrf.ts#L21)

Inputs to the fusion. Each list is an ordered array of fact IDs
from a separate retrieval signal.

## Properties

### bm25

> **bm25**: `string`[]

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/FourWayRrf.ts:25](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/FourWayRrf.ts#L25)

BM25 ranking over fact text.

***

### graphActivation

> **graphActivation**: `string`[]

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/FourWayRrf.ts:27](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/FourWayRrf.ts#L27)

Spreading-activation ranking over the typed-network graph.

***

### semantic

> **semantic**: `string`[]

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/FourWayRrf.ts:23](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/FourWayRrf.ts#L23)

Cosine-similarity ranking over fact embeddings.

***

### temporalOverlap

> **temporalOverlap**: `string`[]

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/FourWayRrf.ts:29](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/FourWayRrf.ts#L29)

Temporal-interval-overlap ranking against the query timestamp.
