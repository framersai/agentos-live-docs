# Interface: StreamTextResult

Defined in: [packages/agentos/src/api/streamText.ts:51](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/streamText.ts#L51)

The object returned immediately by [streamText](../functions/streamText.md).

Consumers may iterate `textStream` for raw token deltas, `fullStream` for
all event types, or simply `await` the promise properties for aggregated
results once the stream has drained.

## Properties

### fullStream

> **fullStream**: `AsyncIterable`\<[`StreamPart`](../type-aliases/StreamPart.md)\>

Defined in: [packages/agentos/src/api/streamText.ts:55](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/streamText.ts#L55)

Async iterable that yields all [StreamPart](../type-aliases/StreamPart.md) events in order.

***

### text

> **text**: `Promise`\<`string`\>

Defined in: [packages/agentos/src/api/streamText.ts:57](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/streamText.ts#L57)

Resolves to the fully assembled assistant reply when the stream completes.

***

### textStream

> **textStream**: `AsyncIterable`\<`string`\>

Defined in: [packages/agentos/src/api/streamText.ts:53](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/streamText.ts#L53)

Async iterable that yields only raw text-delta strings (filters out non-text parts).

***

### toolCalls

> **toolCalls**: `Promise`\<[`ToolCallRecord`](ToolCallRecord.md)[]\>

Defined in: [packages/agentos/src/api/streamText.ts:61](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/streamText.ts#L61)

Resolves to the ordered list of [ToolCallRecord](ToolCallRecord.md)s when the stream completes.

***

### usage

> **usage**: `Promise`\<[`TokenUsage`](TokenUsage.md)\>

Defined in: [packages/agentos/src/api/streamText.ts:59](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/streamText.ts#L59)

Resolves to aggregated [TokenUsage](TokenUsage.md) when the stream completes.
