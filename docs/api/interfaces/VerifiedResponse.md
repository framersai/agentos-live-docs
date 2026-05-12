# Interface: VerifiedResponse

Defined in: [packages/agentos/src/rag/citation/types.ts:28](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/types.ts#L28)

Aggregated verification result for a text.

## Properties

### claims

> **claims**: [`ClaimVerdict`](ClaimVerdict.md)[]

Defined in: [packages/agentos/src/rag/citation/types.ts:30](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/types.ts#L30)

Per-claim verification results.

***

### contradictedCount

> **contradictedCount**: `number`

Defined in: [packages/agentos/src/rag/citation/types.ts:39](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/types.ts#L39)

***

### overallGrounded

> **overallGrounded**: `boolean`

Defined in: [packages/agentos/src/rag/citation/types.ts:32](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/types.ts#L32)

True if no claims are contradicted.

***

### summary

> **summary**: `string`

Defined in: [packages/agentos/src/rag/citation/types.ts:43](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/types.ts#L43)

Human-readable summary.

***

### supportedCount

> **supportedCount**: `number`

Defined in: [packages/agentos/src/rag/citation/types.ts:38](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/types.ts#L38)

Counts by verdict type.

***

### supportedRatio

> **supportedRatio**: `number`

Defined in: [packages/agentos/src/rag/citation/types.ts:34](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/types.ts#L34)

Ratio of supported claims to total (0-1).

***

### totalClaims

> **totalClaims**: `number`

Defined in: [packages/agentos/src/rag/citation/types.ts:36](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/types.ts#L36)

Total claims extracted.

***

### unverifiableCount

> **unverifiableCount**: `number`

Defined in: [packages/agentos/src/rag/citation/types.ts:40](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/types.ts#L40)

***

### weakCount

> **weakCount**: `number`

Defined in: [packages/agentos/src/rag/citation/types.ts:41](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/types.ts#L41)
