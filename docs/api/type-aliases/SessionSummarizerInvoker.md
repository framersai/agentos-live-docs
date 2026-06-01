# Type Alias: SessionSummarizerInvoker()

> **SessionSummarizerInvoker** = (`system`, `user`) => `Promise`\<\{ `model`: `string`; `text`: `string`; `tokensIn`: `number`; `tokensOut`: `number`; \}\>

Defined in: [packages/agentos/src/cognition/memory/ingest/SessionSummarizer.ts:68](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/ingest/SessionSummarizer.ts#L68)

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
