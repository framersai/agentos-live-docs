# Function: streamText()

> **streamText**(`opts`): [`StreamTextResult`](../interfaces/StreamTextResult.md)

Defined in: [packages/agentos/src/api/streamText.ts:116](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/streamText.ts#L116)

Stateless streaming text generation with optional multi-step tool calling.

Returns a [StreamTextResult](../interfaces/StreamTextResult.md) immediately; the underlying provider call
begins lazily when a consumer starts iterating `textStream` or `fullStream`.
Awaiting `text`, `usage`, or `toolCalls` will also drain the stream.

## Parameters

### opts

[`GenerateTextOptions`](../interfaces/GenerateTextOptions.md)

Generation options (same shape as [generateText](generateText.md)).

## Returns

[`StreamTextResult`](../interfaces/StreamTextResult.md)

A [StreamTextResult](../interfaces/StreamTextResult.md) with async iterables and awaitable promises.

## Example

```ts
const { textStream } = streamText({ model: 'openai:gpt-4o', prompt: 'Tell me a joke.' });
for await (const chunk of textStream) {
  process.stdout.write(chunk);
}
```
