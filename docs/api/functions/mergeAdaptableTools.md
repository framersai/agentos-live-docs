# Function: mergeAdaptableTools()

> **mergeAdaptableTools**(...`inputs`): [`ToolDefinitionMap`](../type-aliases/ToolDefinitionMap.md) \| `undefined`

Defined in: [packages/agentos/src/api/runtime/toolAdapter.ts:352](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/runtime/toolAdapter.ts#L352)

Merges supported tool inputs with later inputs taking precedence by tool name.

This normalizes each input first, which means agency-level defaults can be
combined safely with per-agent maps, external registries, or prompt-only tool
schemas without relying on object spread semantics.

## Parameters

### inputs

...([`AdaptableToolInput`](../type-aliases/AdaptableToolInput.md) \| `undefined`)[]

Tool inputs ordered from lowest to highest precedence.

## Returns

[`ToolDefinitionMap`](../type-aliases/ToolDefinitionMap.md) \| `undefined`

A merged tool map, or `undefined` when no tools were supplied.
