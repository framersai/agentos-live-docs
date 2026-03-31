# Function: adaptTools()

> **adaptTools**(`tools`): [`ITool`](../interfaces/ITool.md)\<`any`, `any`\>[]

Defined in: [packages/agentos/src/api/runtime/toolAdapter.ts:294](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/runtime/toolAdapter.ts#L294)

Converts supported tool inputs into an array of `ITool` instances
suitable for use with the AgentOS provider layer.

- Existing `ITool` instances (identified by `inputSchema` + `id` properties)
  are passed through unchanged.
- Plain `ToolDefinition` objects are wrapped in a minimal `ITool`
  implementation.  Zod schemas are converted to JSON Schema when `zod-to-json-schema`
  is available.
- [ExternalToolRegistry](../type-aliases/ExternalToolRegistry.md) inputs are adapted into executable `ITool`
  instances, preserving any prompt metadata they expose.
- `ToolDefinitionForLLM[]` arrays are treated as prompt-only schemas and
  produce tools that fail explicitly when invoked without an executor.

## Parameters

### tools

Optional map of tool names to definitions. Returns `[]` when falsy.

[`AdaptableToolInput`](../type-aliases/AdaptableToolInput.md) | `undefined`

## Returns

[`ITool`](../interfaces/ITool.md)\<`any`, `any`\>[]

Flat array of normalised `ITool` instances ready for provider dispatch.

## Example

```ts
const tools = adaptTools({
  getWeather: {
    description: 'Returns current weather for a city.',
    parameters: { type: 'object', properties: { city: { type: 'string' } }, required: ['city'] },
    execute: async ({ city }) => fetchWeather(city),
  },
});
```
