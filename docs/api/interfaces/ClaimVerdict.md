# Interface: ClaimVerdict

Defined in: [packages/agentos/src/rag/citation/types.ts:10](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/types.ts#L10)

Verdict for a single verified claim.

## Properties

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/rag/citation/types.ts:16](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/types.ts#L16)

Cosine similarity to best-matching source (0-1).

***

### sourceIndex?

> `optional` **sourceIndex**: `number`

Defined in: [packages/agentos/src/rag/citation/types.ts:18](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/types.ts#L18)

Index of the best-matching source in the input array.

***

### sourceRef?

> `optional` **sourceRef**: `string`

Defined in: [packages/agentos/src/rag/citation/types.ts:22](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/types.ts#L22)

Source URL or file path.

***

### sourceSnippet?

> `optional` **sourceSnippet**: `string`

Defined in: [packages/agentos/src/rag/citation/types.ts:20](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/types.ts#L20)

The matching source fragment (truncated to 200 chars).

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/rag/citation/types.ts:12](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/types.ts#L12)

The atomic claim text.

***

### verdict

> **verdict**: `"supported"` \| `"contradicted"` \| `"unverifiable"` \| `"weak"`

Defined in: [packages/agentos/src/rag/citation/types.ts:14](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/types.ts#L14)

Verification verdict.

***

### webVerified?

> `optional` **webVerified**: `boolean`

Defined in: [packages/agentos/src/rag/citation/types.ts:24](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/types.ts#L24)

True if this claim was verified via web search fallback.
