# Interface: ConsolidationConfig

Defined in: [packages/agentos/src/memory/core/config.ts:134](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L134)

## Properties

### deriveInsights?

> `optional` **deriveInsights**: `boolean`

Defined in: [packages/agentos/src/memory/core/config.ts:194](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L194)

Whether the consolidation engine should derive new insight traces from
clusters of related memories during each cycle.

#### Default

```ts
true
```

***

### enabled?

> `optional` **enabled**: `boolean`

Defined in: [packages/agentos/src/memory/core/config.ts:146](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L146)

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

Defined in: [packages/agentos/src/memory/core/config.ts:173](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L173)

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

Defined in: [packages/agentos/src/memory/core/config.ts:148](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L148)

How often to run consolidation (ms).

#### Default

```ts
3_600_000 (1 hour)
```

***

### maxDerivedPerCycle?

> `optional` **maxDerivedPerCycle**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:201](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L201)

Maximum number of new insight traces the engine may derive per cycle.
Guards against unbounded graph growth.

#### Default

```ts
10
```

***

### maxTracesPerCycle

> **maxTracesPerCycle**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:150](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L150)

Max traces to process per cycle.

#### Default

```ts
500
```

***

### mergeSimilarityThreshold

> **mergeSimilarityThreshold**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:152](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L152)

Similarity threshold for merging redundant traces.

#### Default

```ts
0.92
```

***

### mergeThreshold?

> `optional` **mergeThreshold**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:187](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L187)

Cosine similarity above which two traces are candidates for merging.
Must be between 0 and 1.

#### Default

```ts
0.92
```

***

### minClusterSize

> **minClusterSize**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:154](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L154)

Minimum cluster size for schema integration.

#### Default

```ts
5
```

***

### pruneThreshold?

> `optional` **pruneThreshold**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:180](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L180)

Minimum Ebbinghaus strength below which a trace is pruned.
Must be between 0 and 1.

#### Default

```ts
0.05
```

***

### trigger?

> `optional` **trigger**: `"manual"` \| `"turns"` \| `"interval"`

Defined in: [packages/agentos/src/memory/core/config.ts:165](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/config.ts#L165)

What event or schedule triggers a consolidation run.
- `'turns'`    – fire after every N conversation turns (`every` = turn count).
- `'interval'` – fire on a wall-clock timer (`every` = milliseconds).
- `'manual'`   – only fire when explicitly requested.

#### Default

```ts
'interval'
```
