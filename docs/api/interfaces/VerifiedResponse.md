# Interface: VerifiedResponse

Defined in: [packages/agentos/src/cognition/rag/citation/types.ts:45](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/types.ts#L45)

Aggregated verification result for a text.

## Properties

### claims

> **claims**: [`ClaimVerdict`](ClaimVerdict.md)[]

Defined in: [packages/agentos/src/cognition/rag/citation/types.ts:47](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/types.ts#L47)

Per-claim verification results.

***

### contradictedCount

> **contradictedCount**: `number`

Defined in: [packages/agentos/src/cognition/rag/citation/types.ts:56](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/types.ts#L56)

***

### overallGrounded

> **overallGrounded**: `boolean`

Defined in: [packages/agentos/src/cognition/rag/citation/types.ts:49](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/types.ts#L49)

True if no claims are contradicted.

***

### supportedCount

> **supportedCount**: `number`

Defined in: [packages/agentos/src/cognition/rag/citation/types.ts:55](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/types.ts#L55)

Counts by verdict type.

***

### supportedRatio

> **supportedRatio**: `number`

Defined in: [packages/agentos/src/cognition/rag/citation/types.ts:51](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/types.ts#L51)

Ratio of supported claims to total (0-1).

***

### totalClaims

> **totalClaims**: `number`

Defined in: [packages/agentos/src/cognition/rag/citation/types.ts:53](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/types.ts#L53)

Total claims extracted.

***

### unverifiableCount

> **unverifiableCount**: `number`

Defined in: [packages/agentos/src/cognition/rag/citation/types.ts:57](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/types.ts#L57)

***

### weakCount

> **weakCount**: `number`

Defined in: [packages/agentos/src/cognition/rag/citation/types.ts:58](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/types.ts#L58)
