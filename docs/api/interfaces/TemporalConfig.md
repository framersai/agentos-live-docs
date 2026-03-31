# Interface: TemporalConfig

Defined in: [packages/agentos/src/rag/unified/types.ts:203](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/unified/types.ts#L203)

Temporal preferences for result ordering.

## See

RetrievalPlan.temporal

## Properties

### maxAgeMs

> **maxAgeMs**: `number` \| `null`

Defined in: [packages/agentos/src/rag/unified/types.ts:217](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/unified/types.ts#L217)

Maximum age in milliseconds. Results older than this are excluded.
`null` means no age limit.

#### Default

```ts
null
```

***

### preferRecent

> **preferRecent**: `boolean`

Defined in: [packages/agentos/src/rag/unified/types.ts:205](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/unified/types.ts#L205)

Whether to boost recent results in scoring. Default: false.

***

### recencyBoost

> **recencyBoost**: `number`

Defined in: [packages/agentos/src/rag/unified/types.ts:211](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/unified/types.ts#L211)

Multiplicative boost factor for recent results.
1.0 means no boost. 2.0 means recent results can score up to 2x higher.

#### Default

```ts
1.0
```
