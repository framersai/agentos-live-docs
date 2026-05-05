# Interface: CompiledStrategyStreamResult

Defined in: [packages/agentos/src/api/types.ts:975](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L975)

Internal stream result shape returned by compiled agency strategies.

Strategy compilers may return only the live iterables plus aggregate promises.
The outer `agency()` wrapper can enrich this into the public
[AgencyStreamResult](AgencyStreamResult.md).

This type exists for strategy authors. Most external callers should consume
[AgencyStreamResult](AgencyStreamResult.md) from `agency().stream(...)` instead.

## Properties

### agentCalls?

> `optional` **agentCalls**: `Promise`\<[`AgentCallRecord`](AgentCallRecord.md)[]\>

Defined in: [packages/agentos/src/api/types.ts:992](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L992)

Final per-agent ledger for the strategy run, when available.

***

### fullStream?

> `optional` **fullStream**: `AsyncIterable`\<[`AgencyStreamPart`](../type-aliases/AgencyStreamPart.md), `any`, `any`\>

Defined in: [packages/agentos/src/api/types.ts:979](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L979)

Structured live stream parts from the strategy.

***

### text?

> `optional` **text**: `Promise`\<`string`\>

Defined in: [packages/agentos/src/api/types.ts:981](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L981)

Final raw text assembled by the strategy, when available.

***

### textStream?

> `optional` **textStream**: `AsyncIterable`\<`string`, `any`, `any`\>

Defined in: [packages/agentos/src/api/types.ts:977](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L977)

Raw live text chunks from the strategy.

***

### usage?

> `optional` **usage**: `Promise`\<\{ `cacheCreationTokens?`: `number`; `cacheReadTokens?`: `number`; `completionTokens`: `number`; `costUSD?`: `number`; `promptTokens`: `number`; `totalTokens`: `number`; \}\>

Defined in: [packages/agentos/src/api/types.ts:983](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L983)

Aggregate usage for the strategy run, when available.
