# Interface: StreamTextResult

Defined in: [packages/agentos/src/api/streamText.ts:66](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/streamText.ts#L66)

The object returned immediately by [streamText](../functions/streamText.md).

Consumers may iterate `textStream` for raw token deltas, `fullStream` for
all event types, or simply `await` the promise properties for aggregated
results once the stream has drained.

## Properties

### fullStream

> **fullStream**: `AsyncIterable`\<[`StreamPart`](../type-aliases/StreamPart.md)\>

Defined in: [packages/agentos/src/api/streamText.ts:70](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/streamText.ts#L70)

Async iterable that yields all [StreamPart](../type-aliases/StreamPart.md) events in order.

***

### text

> **text**: `Promise`\<`string`\>

Defined in: [packages/agentos/src/api/streamText.ts:72](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/streamText.ts#L72)

Resolves to the fully assembled assistant reply when the stream completes.

***

### textStream

> **textStream**: `AsyncIterable`\<`string`\>

Defined in: [packages/agentos/src/api/streamText.ts:68](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/streamText.ts#L68)

Async iterable that yields only raw text-delta strings (filters out non-text parts).

***

### toolCalls

> **toolCalls**: `Promise`\<[`ToolCallRecord`](ToolCallRecord.md)[]\>

Defined in: [packages/agentos/src/api/streamText.ts:76](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/streamText.ts#L76)

Resolves to the ordered list of [ToolCallRecord](ToolCallRecord.md)s when the stream completes.

***

### usage

> **usage**: `Promise`\<[`TokenUsage`](TokenUsage.md)\>

Defined in: [packages/agentos/src/api/streamText.ts:74](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/streamText.ts#L74)

Resolves to aggregated [TokenUsage](TokenUsage.md) when the stream completes.
