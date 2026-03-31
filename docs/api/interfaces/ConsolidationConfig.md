# Interface: ConsolidationConfig

Defined in: [packages/agentos/src/memory/core/config.ts:94](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L94)

## Properties

### deriveInsights?

> `optional` **deriveInsights**: `boolean`

Defined in: [packages/agentos/src/memory/core/config.ts:142](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L142)

Whether the consolidation engine should derive new insight traces from
clusters of related memories during each cycle.

#### Default

```ts
true
```

***

### every?

> `optional` **every**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:121](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L121)

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

Defined in: [packages/agentos/src/memory/core/config.ts:96](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L96)

How often to run consolidation (ms).

#### Default

```ts
3_600_000 (1 hour)
```

***

### maxDerivedPerCycle?

> `optional` **maxDerivedPerCycle**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:149](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L149)

Maximum number of new insight traces the engine may derive per cycle.
Guards against unbounded graph growth.

#### Default

```ts
10
```

***

### maxTracesPerCycle

> **maxTracesPerCycle**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:98](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L98)

Max traces to process per cycle.

#### Default

```ts
500
```

***

### mergeSimilarityThreshold

> **mergeSimilarityThreshold**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:100](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L100)

Similarity threshold for merging redundant traces.

#### Default

```ts
0.92
```

***

### mergeThreshold?

> `optional` **mergeThreshold**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:135](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L135)

Cosine similarity above which two traces are candidates for merging.
Must be between 0 and 1.

#### Default

```ts
0.92
```

***

### minClusterSize

> **minClusterSize**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:102](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L102)

Minimum cluster size for schema integration.

#### Default

```ts
5
```

***

### pruneThreshold?

> `optional` **pruneThreshold**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:128](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L128)

Minimum Ebbinghaus strength below which a trace is pruned.
Must be between 0 and 1.

#### Default

```ts
0.05
```

***

### trigger?

> `optional` **trigger**: `"manual"` \| `"turns"` \| `"interval"`

Defined in: [packages/agentos/src/memory/core/config.ts:113](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L113)

What event or schedule triggers a consolidation run.
- `'turns'`    – fire after every N conversation turns (`every` = turn count).
- `'interval'` – fire on a wall-clock timer (`every` = milliseconds).
- `'manual'`   – only fire when explicitly requested.

#### Default

```ts
'interval'
```
