# Function: generateText()

> **generateText**(`opts`): `Promise`\<[`GenerateTextResult`](../interfaces/GenerateTextResult.md)\>

Defined in: [packages/agentos/src/api/generateText.ts:667](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L667)

Stateless text generation with optional multi-step tool calling.

Creates a temporary provider manager, executes one or more LLM completion
steps (each tool-call round trip counts as one step), and returns the final
assembled result.  Provider credentials are resolved from environment
variables unless overridden in `opts`.

When `planning` is enabled, an upfront LLM call produces a step-by-step plan
that is then injected into the system prompt for the tool loop.

## Parameters

### opts

[`GenerateTextOptions`](../interfaces/GenerateTextOptions.md)

Generation options including model, prompt/messages, and optional tools.

## Returns

`Promise`\<[`GenerateTextResult`](../interfaces/GenerateTextResult.md)\>

A promise that resolves to the final text, token usage, tool call log, and finish reason.

## Example

```ts
const result = await generateText({
  model: 'openai:gpt-4o',
  prompt: 'Summarise the history of the Roman Empire in two sentences.',
});
console.log(result.text);
```
