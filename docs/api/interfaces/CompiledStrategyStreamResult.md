# Interface: CompiledStrategyStreamResult

Defined in: [packages/agentos/src/api/types.ts:907](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L907)

Internal stream result shape returned by compiled agency strategies.

Strategy compilers may return only the live iterables plus aggregate promises.
The outer `agency()` wrapper can enrich this into the public
[AgencyStreamResult](AgencyStreamResult.md).

This type exists for strategy authors. Most external callers should consume
[AgencyStreamResult](AgencyStreamResult.md) from `agency().stream(...)` instead.

## Properties

### agentCalls?

> `optional` **agentCalls**: `Promise`\<[`AgentCallRecord`](AgentCallRecord.md)[]\>

Defined in: [packages/agentos/src/api/types.ts:922](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L922)

Final per-agent ledger for the strategy run, when available.

***

### fullStream?

> `optional` **fullStream**: `AsyncIterable`\<[`AgencyStreamPart`](../type-aliases/AgencyStreamPart.md), `any`, `any`\>

Defined in: [packages/agentos/src/api/types.ts:911](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L911)

Structured live stream parts from the strategy.

***

### text?

> `optional` **text**: `Promise`\<`string`\>

Defined in: [packages/agentos/src/api/types.ts:913](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L913)

Final raw text assembled by the strategy, when available.

***

### textStream?

> `optional` **textStream**: `AsyncIterable`\<`string`, `any`, `any`\>

Defined in: [packages/agentos/src/api/types.ts:909](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L909)

Raw live text chunks from the strategy.

***

### usage?

> `optional` **usage**: `Promise`\<\{ `completionTokens`: `number`; `costUSD?`: `number`; `promptTokens`: `number`; `totalTokens`: `number`; \}\>

Defined in: [packages/agentos/src/api/types.ts:915](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L915)

Aggregate usage for the strategy run, when available.
