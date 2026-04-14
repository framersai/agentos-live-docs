# Type Alias: AdaptableToolInput

> **AdaptableToolInput** = [`ToolDefinitionMap`](ToolDefinitionMap.md) \| [`ExternalToolRegistry`](ExternalToolRegistry.md) \| `ReadonlyArray`\<`ToolDefinitionForLLM`\>

Defined in: [packages/agentos/src/api/runtime/toolAdapter.ts:49](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/runtime/toolAdapter.ts#L49)

Additional tool inputs accepted by the high-level API.

- `ExternalToolRegistry`: host-managed external tools, including `Map` and iterable forms.
- `ToolDefinitionForLLM[]`: prompt-only schemas with no attached executor.
