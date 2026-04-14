# Interface: ConsolidationConfig

Defined in: [packages/agentos/src/memory/core/config.ts:125](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/config.ts#L125)

## Properties

### deriveInsights?

> `optional` **deriveInsights**: `boolean`

Defined in: [packages/agentos/src/memory/core/config.ts:173](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/config.ts#L173)

Whether the consolidation engine should derive new insight traces from
clusters of related memories during each cycle.

#### Default

```ts
true
```

***

### every?

> `optional` **every**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:152](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/config.ts#L152)

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

Defined in: [packages/agentos/src/memory/core/config.ts:127](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/config.ts#L127)

How often to run consolidation (ms).

#### Default

```ts
3_600_000 (1 hour)
```

***

### maxDerivedPerCycle?

> `optional` **maxDerivedPerCycle**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:180](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/config.ts#L180)

Maximum number of new insight traces the engine may derive per cycle.
Guards against unbounded graph growth.

#### Default

```ts
10
```

***

### maxTracesPerCycle

> **maxTracesPerCycle**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:129](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/config.ts#L129)

Max traces to process per cycle.

#### Default

```ts
500
```

***

### mergeSimilarityThreshold

> **mergeSimilarityThreshold**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:131](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/config.ts#L131)

Similarity threshold for merging redundant traces.

#### Default

```ts
0.92
```

***

### mergeThreshold?

> `optional` **mergeThreshold**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:166](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/config.ts#L166)

Cosine similarity above which two traces are candidates for merging.
Must be between 0 and 1.

#### Default

```ts
0.92
```

***

### minClusterSize

> **minClusterSize**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:133](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/config.ts#L133)

Minimum cluster size for schema integration.

#### Default

```ts
5
```

***

### pruneThreshold?

> `optional` **pruneThreshold**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:159](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/config.ts#L159)

Minimum Ebbinghaus strength below which a trace is pruned.
Must be between 0 and 1.

#### Default

```ts
0.05
```

***

### trigger?

> `optional` **trigger**: `"manual"` \| `"turns"` \| `"interval"`

Defined in: [packages/agentos/src/memory/core/config.ts:144](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/config.ts#L144)

What event or schedule triggers a consolidation run.
- `'turns'`    – fire after every N conversation turns (`every` = turn count).
- `'interval'` – fire on a wall-clock timer (`every` = milliseconds).
- `'manual'`   – only fire when explicitly requested.

#### Default

```ts
'interval'
```
