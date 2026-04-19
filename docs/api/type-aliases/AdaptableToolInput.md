# Type Alias: AdaptableToolInput

> **AdaptableToolInput** = [`ToolDefinitionMap`](ToolDefinitionMap.md) \| [`ExternalToolRegistry`](ExternalToolRegistry.md) \| `ReadonlyArray`\<`ToolDefinitionForLLM`\>

Defined in: [packages/agentos/src/api/runtime/toolAdapter.ts:49](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/runtime/toolAdapter.ts#L49)

Additional tool inputs accepted by the high-level API.

- `ExternalToolRegistry`: host-managed external tools, including `Map` and iterable forms.
- `ToolDefinitionForLLM[]`: prompt-only schemas with no attached executor.
