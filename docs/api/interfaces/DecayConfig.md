# Interface: DecayConfig

Defined in: [packages/agentos/src/memory/core/config.ts:54](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L54)

## Properties

### interferenceThreshold

> **interferenceThreshold**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:60](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L60)

Cosine similarity threshold for interference detection.

#### Default

```ts
0.7
```

***

### pruningThreshold

> **pruningThreshold**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:56](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L56)

Minimum strength before a trace is soft-deleted.

#### Default

```ts
0.05
```

***

### recencyHalfLifeMs

> **recencyHalfLifeMs**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:58](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/config.ts#L58)

Half-life for recency boost (ms).

#### Default

```ts
86_400_000 (24 hours)
```
