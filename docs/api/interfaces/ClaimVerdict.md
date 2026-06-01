# Interface: ClaimVerdict

Defined in: [packages/agentos/src/cognition/rag/citation/types.ts:27](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/types.ts#L27)

Verdict for a single verified claim.

## Properties

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/cognition/rag/citation/types.ts:33](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/types.ts#L33)

Cosine similarity to best-matching source (0-1).

***

### sourceIndex?

> `optional` **sourceIndex**: `number`

Defined in: [packages/agentos/src/cognition/rag/citation/types.ts:35](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/types.ts#L35)

Index of the best-matching source in the input array.

***

### sourceRef?

> `optional` **sourceRef**: `string`

Defined in: [packages/agentos/src/cognition/rag/citation/types.ts:39](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/types.ts#L39)

Source URL or file path.

***

### sourceSnippet?

> `optional` **sourceSnippet**: `string`

Defined in: [packages/agentos/src/cognition/rag/citation/types.ts:37](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/types.ts#L37)

The matching source fragment (truncated to 200 chars).

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/cognition/rag/citation/types.ts:29](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/types.ts#L29)

The atomic claim text.

***

### verdict

> **verdict**: [`ClaimVerdictKind`](../type-aliases/ClaimVerdictKind.md)

Defined in: [packages/agentos/src/cognition/rag/citation/types.ts:31](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/types.ts#L31)

Verification verdict.

***

### webVerified?

> `optional` **webVerified**: `boolean`

Defined in: [packages/agentos/src/cognition/rag/citation/types.ts:41](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/types.ts#L41)

True if this claim was verified via web search fallback.
