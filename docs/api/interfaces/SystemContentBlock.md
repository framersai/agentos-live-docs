# Interface: SystemContentBlock

Defined in: [packages/agentos/src/api/generateText.ts:193](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L193)

A structured block of system prompt content with optional cache breakpoint.
When `cacheBreakpoint` is true, providers that support prompt caching
(e.g., Anthropic) will mark this block's boundary for caching.

## Properties

### cacheBreakpoint?

> `optional` **cacheBreakpoint**: `boolean`

Defined in: [packages/agentos/src/api/generateText.ts:197](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L197)

When true, marks the end of this block as a cache boundary.

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:195](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L195)

The text content of this block.
