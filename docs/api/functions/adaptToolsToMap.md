# Function: adaptToolsToMap()

> **adaptToolsToMap**(`tools`): [`ToolDefinitionMap`](../type-aliases/ToolDefinitionMap.md)

Defined in: [packages/agentos/src/api/runtime/toolAdapter.ts:332](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/runtime/toolAdapter.ts#L332)

Converts any supported tool input into a named tool map.

Later helpers such as `agent()` / `agency()` use this to safely merge tool
inputs that may arrive as records, `Map` registries, or prompt-only schemas.
The returned map always contains executable `ITool` instances keyed by
tool name.

## Parameters

### tools

Optional high-level tool input.

[`AdaptableToolInput`](../type-aliases/AdaptableToolInput.md) | `undefined`

## Returns

[`ToolDefinitionMap`](../type-aliases/ToolDefinitionMap.md)

A name-keyed tool map. Returns `{}` when no tools are supplied.
