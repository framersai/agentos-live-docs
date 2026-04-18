# Function: buildSplitCallers()

> **buildSplitCallers**(`plannerOptions`, `executionOptions?`): `Promise`\<\{ `executionCaller`: (`system`, `user`) => `Promise`\<`string`\>; `executionModel`: `string`; `plannerCaller`: (`system`, `user`) => `Promise`\<`string`\>; `plannerModel`: `string`; \}\>

Defined in: [packages/agentos/src/orchestration/planning/buildLlmCaller.ts:139](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planning/buildLlmCaller.ts#L139)

Build separate planner and execution callers with potentially different providers.

## Parameters

### plannerOptions

[`BuildLlmCallerOptions`](../interfaces/BuildLlmCallerOptions.md)

Options for the ToT planning model (strong reasoning).

### executionOptions?

[`BuildLlmCallerOptions`](../interfaces/BuildLlmCallerOptions.md)

Options for agent node execution (can be different).

## Returns

`Promise`\<\{ `executionCaller`: (`system`, `user`) => `Promise`\<`string`\>; `executionModel`: `string`; `plannerCaller`: (`system`, `user`) => `Promise`\<`string`\>; `plannerModel`: `string`; \}\>

Object with `plannerCaller` and `executionCaller`.

## Example

```ts
const { plannerCaller, executionCaller } = await buildSplitCallers(
  { provider: 'claude-code-cli', model: 'claude-opus-4-6' },   // Strong for planning
  { provider: 'openai', model: 'gpt-4o' },                      // Fast for execution
);

const planner = new MissionPlanner({
  llmCaller: executionCaller,
  plannerLlmCaller: plannerCaller,
  plannerModel: 'claude-opus-4-6',
  executionModel: 'gpt-4o',
  ...
});
```
