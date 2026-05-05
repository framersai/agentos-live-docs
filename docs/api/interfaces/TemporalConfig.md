# Interface: TemporalConfig

Defined in: [packages/agentos/src/rag/unified/types.ts:210](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/unified/types.ts#L210)

Temporal preferences for result ordering.

## See

RetrievalPlan.temporal

## Properties

### maxAgeMs

> **maxAgeMs**: `number` \| `null`

Defined in: [packages/agentos/src/rag/unified/types.ts:224](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/unified/types.ts#L224)

Maximum age in milliseconds. Results older than this are excluded.
`null` means no age limit.

#### Default

```ts
null
```

***

### preferRecent

> **preferRecent**: `boolean`

Defined in: [packages/agentos/src/rag/unified/types.ts:212](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/unified/types.ts#L212)

Whether to boost recent results in scoring. Default: false.

***

### recencyBoost

> **recencyBoost**: `number`

Defined in: [packages/agentos/src/rag/unified/types.ts:218](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/unified/types.ts#L218)

Multiplicative boost factor for recent results.
1.0 means no boost. 2.0 means recent results can score up to 2x higher.

#### Default

```ts
1.0
```
