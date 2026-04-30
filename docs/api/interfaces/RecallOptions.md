# Interface: RecallOptions

Defined in: [packages/agentos/src/memory/io/facade/types.ts:338](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L338)

Options for querying memory traces via `Memory.recall()`.

## Properties

### after?

> `optional` **after**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:371](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L371)

Only return traces created after this Unix-ms timestamp.
Part of the three-date temporal model for time-ranged recall.

***

### before?

> `optional` **before**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:377](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L377)

Only return traces created before this Unix-ms timestamp.
Part of the three-date temporal model for time-ranged recall.

***

### limit?

> `optional` **limit**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:343](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L343)

Maximum number of traces to return.

#### Default

```ts
10
```

***

### minStrength?

> `optional` **minStrength**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:365](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L365)

Minimum retrieval strength (Ebbinghaus current strength) to include.
Traces below this value are considered too weak/forgotten.

#### Default

```ts
0
```

***

### policy?

> `optional` **policy**: [`MemoryRetrievalPolicy`](MemoryRetrievalPolicy.md)

Defined in: [packages/agentos/src/memory/io/facade/types.ts:383](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L383)

Optional shared retrieval policy override.
When omitted, recall preserves the current standalone behavior.

***

### scope?

> `optional` **scope**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:353](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L353)

Filter by visibility scope.

***

### scopeId?

> `optional` **scopeId**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:358](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L358)

Filter by scope ID.

***

### type?

> `optional` **type**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:348](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L348)

Filter by Tulving memory type.
