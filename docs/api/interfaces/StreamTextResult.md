# Interface: StreamTextResult

Defined in: [packages/agentos/src/api/streamText.ts:65](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamText.ts#L65)

The object returned immediately by [streamText](../functions/streamText.md).

Consumers may iterate `textStream` for raw token deltas, `fullStream` for
all event types, or simply `await` the promise properties for aggregated
results once the stream has drained.

## Properties

### fullStream

> **fullStream**: `AsyncIterable`\<[`StreamPart`](../type-aliases/StreamPart.md)\>

Defined in: [packages/agentos/src/api/streamText.ts:69](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamText.ts#L69)

Async iterable that yields all [StreamPart](../type-aliases/StreamPart.md) events in order.

***

### text

> **text**: `Promise`\<`string`\>

Defined in: [packages/agentos/src/api/streamText.ts:71](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamText.ts#L71)

Resolves to the fully assembled assistant reply when the stream completes.

***

### textStream

> **textStream**: `AsyncIterable`\<`string`\>

Defined in: [packages/agentos/src/api/streamText.ts:67](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamText.ts#L67)

Async iterable that yields only raw text-delta strings (filters out non-text parts).

***

### toolCalls

> **toolCalls**: `Promise`\<[`ToolCallRecord`](ToolCallRecord.md)[]\>

Defined in: [packages/agentos/src/api/streamText.ts:75](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamText.ts#L75)

Resolves to the ordered list of [ToolCallRecord](ToolCallRecord.md)s when the stream completes.

***

### usage

> **usage**: `Promise`\<[`TokenUsage`](TokenUsage.md)\>

Defined in: [packages/agentos/src/api/streamText.ts:73](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamText.ts#L73)

Resolves to aggregated [TokenUsage](TokenUsage.md) when the stream completes.
