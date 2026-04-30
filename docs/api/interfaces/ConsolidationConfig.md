# Interface: ConsolidationConfig

Defined in: [packages/agentos/src/memory/core/config.ts:125](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L125)

## Properties

### deriveInsights?

> `optional` **deriveInsights**: `boolean`

Defined in: [packages/agentos/src/memory/core/config.ts:185](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L185)

Whether the consolidation engine should derive new insight traces from
clusters of related memories during each cycle.

#### Default

```ts
true
```

***

### enabled?

> `optional` **enabled**: `boolean`

Defined in: [packages/agentos/src/memory/core/config.ts:137](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L137)

Whether the periodic consolidation timer is active. Set to false
for short-lived contexts (benches, tests, one-shot scripts) where
a lingering `setInterval` would keep the Node event loop alive
past the meaningful work.

When false, `CognitiveMemoryManager` still constructs the
pipeline so `runConsolidation()` works on-demand; only the
auto-started timer is suppressed.

#### Default

```ts
true
```

***

### every?

> `optional` **every**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:164](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L164)

Numeric complement to `trigger`.
When `trigger='turns'` this is the turn count; when `trigger='interval'`
this is the millisecond period.

#### Default

```ts
3_600_000
```

***

### intervalMs

> **intervalMs**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:139](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L139)

How often to run consolidation (ms).

#### Default

```ts
3_600_000 (1 hour)
```

***

### maxDerivedPerCycle?

> `optional` **maxDerivedPerCycle**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:192](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L192)

Maximum number of new insight traces the engine may derive per cycle.
Guards against unbounded graph growth.

#### Default

```ts
10
```

***

### maxTracesPerCycle

> **maxTracesPerCycle**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:141](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L141)

Max traces to process per cycle.

#### Default

```ts
500
```

***

### mergeSimilarityThreshold

> **mergeSimilarityThreshold**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:143](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L143)

Similarity threshold for merging redundant traces.

#### Default

```ts
0.92
```

***

### mergeThreshold?

> `optional` **mergeThreshold**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:178](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L178)

Cosine similarity above which two traces are candidates for merging.
Must be between 0 and 1.

#### Default

```ts
0.92
```

***

### minClusterSize

> **minClusterSize**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:145](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L145)

Minimum cluster size for schema integration.

#### Default

```ts
5
```

***

### pruneThreshold?

> `optional` **pruneThreshold**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:171](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L171)

Minimum Ebbinghaus strength below which a trace is pruned.
Must be between 0 and 1.

#### Default

```ts
0.05
```

***

### trigger?

> `optional` **trigger**: `"manual"` \| `"turns"` \| `"interval"`

Defined in: [packages/agentos/src/memory/core/config.ts:156](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L156)

What event or schedule triggers a consolidation run.
- `'turns'`    – fire after every N conversation turns (`every` = turn count).
- `'interval'` – fire on a wall-clock timer (`every` = milliseconds).
- `'manual'`   – only fire when explicitly requested.

#### Default

```ts
'interval'
```
