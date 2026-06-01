# Interface: StreamTextResult

Defined in: [packages/agentos/src/api/streamText.ts:67](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamText.ts#L67)

The object returned immediately by [streamText](../functions/streamText.md).

Consumers may iterate `textStream` for raw token deltas, `fullStream` for
all event types, or simply `await` the promise properties for aggregated
results once the stream has drained.

## Properties

### fullStream

> **fullStream**: `AsyncIterable`\<[`StreamPart`](../type-aliases/StreamPart.md)\>

Defined in: [packages/agentos/src/api/streamText.ts:71](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamText.ts#L71)

Async iterable that yields all [StreamPart](../type-aliases/StreamPart.md) events in order.

***

### model

> **model**: `Promise`\<`string`\>

Defined in: [packages/agentos/src/api/streamText.ts:90](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamText.ts#L90)

Resolves to the resolved model id once the stream has started.

***

### provider

> **provider**: `Promise`\<`string`\>

Defined in: [packages/agentos/src/api/streamText.ts:88](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamText.ts#L88)

Resolves to the resolved provider id (e.g. `openrouter`, `anthropic`)
once the stream has started. Available eagerly because routing happens
before the first chunk; exposed as a Promise so the type lines up with
the rest of this contract and so callers don't see undefined while the
stream is still spinning up. Used by wilds-ai's `[llm-call]` telemetry
line for per-step latency attribution (production fix 2026-05-05:
narrator-stream rows were logging `provider=unknown model=unknown`,
which made model-routing audits significantly harder).

***

### text

> **text**: `Promise`\<`string`\>

Defined in: [packages/agentos/src/api/streamText.ts:73](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamText.ts#L73)

Resolves to the fully assembled assistant reply when the stream completes.

***

### textStream

> **textStream**: `AsyncIterable`\<`string`\>

Defined in: [packages/agentos/src/api/streamText.ts:69](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamText.ts#L69)

Async iterable that yields only raw text-delta strings (filters out non-text parts).

***

### toolCalls

> **toolCalls**: `Promise`\<[`ToolCallRecord`](ToolCallRecord.md)[]\>

Defined in: [packages/agentos/src/api/streamText.ts:77](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamText.ts#L77)

Resolves to the ordered list of [ToolCallRecord](ToolCallRecord.md)s when the stream completes.

***

### usage

> **usage**: `Promise`\<[`TokenUsage`](TokenUsage.md)\>

Defined in: [packages/agentos/src/api/streamText.ts:75](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamText.ts#L75)

Resolves to aggregated [TokenUsage](TokenUsage.md) when the stream completes.
