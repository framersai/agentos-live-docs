# Interface: CompiledStrategyStreamResult

Defined in: [packages/agentos/src/api/types.ts:656](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L656)

Internal stream result shape returned by compiled agency strategies.

Strategy compilers may return only the live iterables plus aggregate promises.
The outer `agency()` wrapper can enrich this into the public
[AgencyStreamResult](AgencyStreamResult.md).

This type exists for strategy authors. Most external callers should consume
[AgencyStreamResult](AgencyStreamResult.md) from `agency().stream(...)` instead.

## Properties

### agentCalls?

> `optional` **agentCalls**: `Promise`\<[`AgentCallRecord`](AgentCallRecord.md)[]\>

Defined in: [packages/agentos/src/api/types.ts:671](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L671)

Final per-agent ledger for the strategy run, when available.

***

### fullStream?

> `optional` **fullStream**: `AsyncIterable`\<[`AgencyStreamPart`](../type-aliases/AgencyStreamPart.md), `any`, `any`\>

Defined in: [packages/agentos/src/api/types.ts:660](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L660)

Structured live stream parts from the strategy.

***

### text?

> `optional` **text**: `Promise`\<`string`\>

Defined in: [packages/agentos/src/api/types.ts:662](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L662)

Final raw text assembled by the strategy, when available.

***

### textStream?

> `optional` **textStream**: `AsyncIterable`\<`string`, `any`, `any`\>

Defined in: [packages/agentos/src/api/types.ts:658](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L658)

Raw live text chunks from the strategy.

***

### usage?

> `optional` **usage**: `Promise`\<\{ `completionTokens`: `number`; `costUSD?`: `number`; `promptTokens`: `number`; `totalTokens`: `number`; \}\>

Defined in: [packages/agentos/src/api/types.ts:664](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L664)

Aggregate usage for the strategy run, when available.
