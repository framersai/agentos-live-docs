# Interface: SystemContentBlock

Defined in: [packages/agentos/src/api/generateText.ts:215](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L215)

A structured block of system prompt content with optional cache breakpoint.
When `cacheBreakpoint` is true, providers that support prompt caching
(e.g., Anthropic) will mark this block's boundary for caching.

## Properties

### cacheBreakpoint?

> `optional` **cacheBreakpoint**: `boolean`

Defined in: [packages/agentos/src/api/generateText.ts:219](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L219)

When true, marks the end of this block as a cache boundary.

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:217](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L217)

The text content of this block.
