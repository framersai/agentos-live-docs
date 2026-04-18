# Interface: TemporalConfig

Defined in: [packages/agentos/src/rag/unified/types.ts:208](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/unified/types.ts#L208)

Temporal preferences for result ordering.

## See

RetrievalPlan.temporal

## Properties

### maxAgeMs

> **maxAgeMs**: `number` \| `null`

Defined in: [packages/agentos/src/rag/unified/types.ts:222](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/unified/types.ts#L222)

Maximum age in milliseconds. Results older than this are excluded.
`null` means no age limit.

#### Default

```ts
null
```

***

### preferRecent

> **preferRecent**: `boolean`

Defined in: [packages/agentos/src/rag/unified/types.ts:210](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/unified/types.ts#L210)

Whether to boost recent results in scoring. Default: false.

***

### recencyBoost

> **recencyBoost**: `number`

Defined in: [packages/agentos/src/rag/unified/types.ts:216](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/unified/types.ts#L216)

Multiplicative boost factor for recent results.
1.0 means no boost. 2.0 means recent results can score up to 2x higher.

#### Default

```ts
1.0
```
