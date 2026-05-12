# Type Alias: SessionSummarizerInvoker()

> **SessionSummarizerInvoker** = (`system`, `user`) => `Promise`\<\{ `model`: `string`; `text`: `string`; `tokensIn`: `number`; `tokensOut`: `number`; \}\>

Defined in: [packages/agentos/src/memory/ingest/SessionSummarizer.ts:68](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/ingest/SessionSummarizer.ts#L68)

Callable that invokes a chat LLM given a system + user prompt and
returns the generated text. The bench constructs one from the
existing IReader so summarization reuses the same pricing +
timeout plumbing as the benchmark's reader.

## Parameters

### system

`string`

### user

`string`

## Returns

`Promise`\<\{ `model`: `string`; `text`: `string`; `tokensIn`: `number`; `tokensOut`: `number`; \}\>
