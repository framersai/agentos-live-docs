# Class: TypedNetworkRetriever

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedNetworkRetriever.ts:89](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedNetworkRetriever.ts#L89)

Adapter that produces canonical-shaped retrieval results from the
typed-network store. Plugs into the bench's existing reader
pipeline without requiring changes to downstream code.

## Constructors

### Constructor

> **new TypedNetworkRetriever**(`opts`): `TypedNetworkRetriever`

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedNetworkRetriever.ts:95](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedNetworkRetriever.ts#L95)

#### Parameters

##### opts

[`TypedNetworkRetrieverOptions`](../interfaces/TypedNetworkRetrieverOptions.md)

#### Returns

`TypedNetworkRetriever`

## Methods

### retrieve()

> **retrieve**(`query`, `options`): `Promise`\<[`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)[]\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedNetworkRetriever.ts:109](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedNetworkRetriever.ts#L109)

Retrieve top-K typed facts for the query, formatted as
[ScoredMemoryTrace](../interfaces/ScoredMemoryTrace.md)s. Returns an empty array when no
query entities match seed facts in the store (e.g. queries with
no proper nouns or quoted strings, or queries whose entities
the typed network has not yet observed).

#### Parameters

##### query

`string`

##### options

[`TypedNetworkRetrieveOptions`](../interfaces/TypedNetworkRetrieveOptions.md)

#### Returns

`Promise`\<[`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)[]\>
