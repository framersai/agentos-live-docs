# Interface: ExtendedConsolidationConfig

Defined in: [packages/agentos/src/memory/io/facade/types.ts:52](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L52)

Extended consolidation configuration that adds lifecycle-management fields
on top of the core `ConsolidationConfig` used internally.

The `trigger` + `every` pair replace the internal `intervalMs` at the facade
level; adapters translate these to the internal representation.

## Properties

### deriveInsights?

> `optional` **deriveInsights**: `boolean`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:89](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L89)

Whether the consolidation engine should derive new insight traces from
clusters of related memories.

#### Default

```ts
true
```

***

### every?

> `optional` **every**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:68](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L68)

Numeric complement to `trigger`.
When `trigger='turns'` this is the turn count; when `trigger='interval'`
this is the millisecond interval.

#### Default

```ts
3_600_000
```

***

### intervalMs?

> `optional` **intervalMs**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:105](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L105)

How often to run consolidation in milliseconds (internal scheduler).
Superseded by `trigger`+`every` at the facade level; kept for compatibility.

#### Default

```ts
3_600_000
```

***

### maxDerivedPerCycle?

> `optional` **maxDerivedPerCycle**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:96](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L96)

Maximum number of new insight traces derived per consolidation cycle.
Guards against unbounded graph growth.

#### Default

```ts
10
```

***

### maxTracesPerCycle?

> `optional` **maxTracesPerCycle**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:112](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L112)

Maximum number of traces to process per consolidation cycle.
Bounds CPU/memory cost of a single run.

#### Default

```ts
500
```

***

### mergeSimilarityThreshold?

> `optional` **mergeSimilarityThreshold**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:118](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L118)

Similarity threshold used when merging redundant traces.

#### Default

```ts
0.92
```

***

### mergeThreshold?

> `optional` **mergeThreshold**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:82](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L82)

Cosine similarity above which two traces are candidates for merging.
Must be between 0 and 1.

#### Default

```ts
0.92
```

***

### minClusterSize?

> `optional` **minClusterSize**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:124](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L124)

Minimum cluster size required before schema integration fires.

#### Default

```ts
5
```

***

### pruneThreshold?

> `optional` **pruneThreshold**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:75](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L75)

Minimum strength below which a memory trace is pruned.
Must be between 0 and 1.

#### Default

```ts
0.05
```

***

### trigger?

> `optional` **trigger**: `"manual"` \| `"turns"` \| `"interval"`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:60](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L60)

What event or schedule triggers a consolidation run.
- `'turns'`    – run after every N conversation turns (`every` = turn count).
- `'interval'` – run on a wall-clock timer (`every` = milliseconds).
- `'manual'`   – only run when explicitly called via `consolidate()`.

#### Default

```ts
'interval'
```
