# Interface: ExtendedConsolidationConfig

Defined in: [packages/agentos/src/memory/io/facade/types.ts:54](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L54)

Extended consolidation configuration that adds lifecycle-management fields
on top of the core `ConsolidationConfig` used internally.

The `trigger` + `every` pair replace the internal `intervalMs` at the facade
level; adapters translate these to the internal representation.

## Properties

### deriveInsights?

> `optional` **deriveInsights**: `boolean`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:91](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L91)

Whether the consolidation engine should derive new insight traces from
clusters of related memories.

#### Default

```ts
true
```

***

### every?

> `optional` **every**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:70](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L70)

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

Defined in: [packages/agentos/src/memory/io/facade/types.ts:107](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L107)

How often to run consolidation in milliseconds (internal scheduler).
Superseded by `trigger`+`every` at the facade level; kept for compatibility.

#### Default

```ts
3_600_000
```

***

### maxDerivedPerCycle?

> `optional` **maxDerivedPerCycle**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:98](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L98)

Maximum number of new insight traces derived per consolidation cycle.
Guards against unbounded graph growth.

#### Default

```ts
10
```

***

### maxTracesPerCycle?

> `optional` **maxTracesPerCycle**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:114](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L114)

Maximum number of traces to process per consolidation cycle.
Bounds CPU/memory cost of a single run.

#### Default

```ts
500
```

***

### mergeSimilarityThreshold?

> `optional` **mergeSimilarityThreshold**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:120](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L120)

Similarity threshold used when merging redundant traces.

#### Default

```ts
0.92
```

***

### mergeThreshold?

> `optional` **mergeThreshold**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:84](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L84)

Cosine similarity above which two traces are candidates for merging.
Must be between 0 and 1.

#### Default

```ts
0.92
```

***

### minClusterSize?

> `optional` **minClusterSize**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:126](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L126)

Minimum cluster size required before schema integration fires.

#### Default

```ts
5
```

***

### pruneThreshold?

> `optional` **pruneThreshold**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:77](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L77)

Minimum strength below which a memory trace is pruned.
Must be between 0 and 1.

#### Default

```ts
0.05
```

***

### trigger?

> `optional` **trigger**: `"manual"` \| `"turns"` \| `"interval"`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:62](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L62)

What event or schedule triggers a consolidation run.
- `'turns'`    – run after every N conversation turns (`every` = turn count).
- `'interval'` – run on a wall-clock timer (`every` = milliseconds).
- `'manual'`   – only run when explicitly called via `consolidate()`.

#### Default

```ts
'interval'
```
