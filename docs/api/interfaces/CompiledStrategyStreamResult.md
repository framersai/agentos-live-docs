# Interface: CompiledStrategyStreamResult

Defined in: [packages/agentos/src/api/types.ts:987](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L987)

Internal stream result shape returned by compiled agency strategies.

Strategy compilers may return only the live iterables plus aggregate promises.
The outer `agency()` wrapper can enrich this into the public
[AgencyStreamResult](AgencyStreamResult.md).

This type exists for strategy authors. Most external callers should consume
[AgencyStreamResult](AgencyStreamResult.md) from `agency().stream(...)` instead.

## Properties

### agentCalls?

> `optional` **agentCalls**: `Promise`\<[`AgentCallRecord`](AgentCallRecord.md)[]\>

Defined in: [packages/agentos/src/api/types.ts:1004](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1004)

Final per-agent ledger for the strategy run, when available.

***

### fullStream?

> `optional` **fullStream**: `AsyncIterable`\<[`AgencyStreamPart`](../type-aliases/AgencyStreamPart.md), `any`, `any`\>

Defined in: [packages/agentos/src/api/types.ts:991](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L991)

Structured live stream parts from the strategy.

***

### text?

> `optional` **text**: `Promise`\<`string`\>

Defined in: [packages/agentos/src/api/types.ts:993](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L993)

Final raw text assembled by the strategy, when available.

***

### textStream?

> `optional` **textStream**: `AsyncIterable`\<`string`, `any`, `any`\>

Defined in: [packages/agentos/src/api/types.ts:989](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L989)

Raw live text chunks from the strategy.

***

### usage?

> `optional` **usage**: `Promise`\<\{ `cacheCreationTokens?`: `number`; `cacheReadTokens?`: `number`; `completionTokens`: `number`; `costUSD?`: `number`; `promptTokens`: `number`; `totalTokens`: `number`; \}\>

Defined in: [packages/agentos/src/api/types.ts:995](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L995)

Aggregate usage for the strategy run, when available.
