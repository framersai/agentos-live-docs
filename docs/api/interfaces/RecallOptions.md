# Interface: RecallOptions

Defined in: [packages/agentos/src/memory/io/facade/types.ts:336](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L336)

Options for querying memory traces via `Memory.recall()`.

## Properties

### after?

> `optional` **after**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:369](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L369)

Only return traces created after this Unix-ms timestamp.
Part of the three-date temporal model for time-ranged recall.

***

### before?

> `optional` **before**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:375](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L375)

Only return traces created before this Unix-ms timestamp.
Part of the three-date temporal model for time-ranged recall.

***

### limit?

> `optional` **limit**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:341](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L341)

Maximum number of traces to return.

#### Default

```ts
10
```

***

### minStrength?

> `optional` **minStrength**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:363](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L363)

Minimum retrieval strength (Ebbinghaus current strength) to include.
Traces below this value are considered too weak/forgotten.

#### Default

```ts
0
```

***

### scope?

> `optional` **scope**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:351](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L351)

Filter by visibility scope.

***

### scopeId?

> `optional` **scopeId**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:356](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L356)

Filter by scope ID.

***

### type?

> `optional` **type**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:346](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L346)

Filter by Tulving memory type.
