# Interface: SessionSummarizerOptions

Defined in: [packages/agentos/src/memory/ingest/SessionSummarizer.ts:81](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/ingest/SessionSummarizer.ts#L81)

Options for constructing a [SessionSummarizer](../classes/SessionSummarizer.md).

## Properties

### cacheDir?

> `optional` **cacheDir**: `string`

Defined in: [packages/agentos/src/memory/ingest/SessionSummarizer.ts:89](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/ingest/SessionSummarizer.ts#L89)

Optional directory for persistent disk cache. When set, summaries
survive across process restarts and re-runs. Mirrors the
CachedEmbedder cache layout.

***

### invoker

> **invoker**: [`SessionSummarizerInvoker`](../type-aliases/SessionSummarizerInvoker.md)

Defined in: [packages/agentos/src/memory/ingest/SessionSummarizer.ts:83](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/ingest/SessionSummarizer.ts#L83)

LLM invoker — produces the summary text.

***

### maxTokens?

> `optional` **maxTokens**: `number`

Defined in: [packages/agentos/src/memory/ingest/SessionSummarizer.ts:100](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/ingest/SessionSummarizer.ts#L100)

Maximum tokens to ask the LLM to emit. Default 140 (generous headroom
over the 50–100 target; truncate post-hoc if needed).

***

### modelId

> **modelId**: `string`

Defined in: [packages/agentos/src/memory/ingest/SessionSummarizer.ts:95](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/ingest/SessionSummarizer.ts#L95)

Model identifier baked into the cache key so switching models
invalidates the cache automatically. Should match the invoker's
underlying model.

***

### onCallCost()?

> `optional` **onCallCost**: (`tokensIn`, `tokensOut`, `model`) => `void`

Defined in: [packages/agentos/src/memory/ingest/SessionSummarizer.ts:108](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/ingest/SessionSummarizer.ts#L108)

Optional cost-tracker hook. Called after every uncached call.

#### Parameters

##### tokensIn

`number`

##### tokensOut

`number`

##### model

`string`

#### Returns

`void`

***

### templateVersion?

> `optional` **templateVersion**: `string`

Defined in: [packages/agentos/src/memory/ingest/SessionSummarizer.ts:106](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/ingest/SessionSummarizer.ts#L106)

Template version. Bump whenever the summarization prompt changes so
disk caches from prior versions are invalidated.
Current: `'v1-2026-04-19'`.
