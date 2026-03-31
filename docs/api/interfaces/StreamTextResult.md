# Interface: StreamTextResult

Defined in: [packages/agentos/src/api/streamText.ts:55](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/streamText.ts#L55)

The object returned immediately by [streamText](../functions/streamText.md).

Consumers may iterate `textStream` for raw token deltas, `fullStream` for
all event types, or simply `await` the promise properties for aggregated
results once the stream has drained.

## Properties

### fullStream

> **fullStream**: `AsyncIterable`\<[`StreamPart`](../type-aliases/StreamPart.md)\>

Defined in: [packages/agentos/src/api/streamText.ts:59](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/streamText.ts#L59)

Async iterable that yields all [StreamPart](../type-aliases/StreamPart.md) events in order.

***

### text

> **text**: `Promise`\<`string`\>

Defined in: [packages/agentos/src/api/streamText.ts:61](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/streamText.ts#L61)

Resolves to the fully assembled assistant reply when the stream completes.

***

### textStream

> **textStream**: `AsyncIterable`\<`string`\>

Defined in: [packages/agentos/src/api/streamText.ts:57](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/streamText.ts#L57)

Async iterable that yields only raw text-delta strings (filters out non-text parts).

***

### toolCalls

> **toolCalls**: `Promise`\<[`ToolCallRecord`](ToolCallRecord.md)[]\>

Defined in: [packages/agentos/src/api/streamText.ts:65](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/streamText.ts#L65)

Resolves to the ordered list of [ToolCallRecord](ToolCallRecord.md)s when the stream completes.

***

### usage

> **usage**: `Promise`\<[`TokenUsage`](TokenUsage.md)\>

Defined in: [packages/agentos/src/api/streamText.ts:63](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/streamText.ts#L63)

Resolves to aggregated [TokenUsage](TokenUsage.md) when the stream completes.
