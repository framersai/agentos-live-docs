# Function: mergeAdaptableTools()

> **mergeAdaptableTools**(...`inputs`): [`ToolDefinitionMap`](../type-aliases/ToolDefinitionMap.md) \| `undefined`

Defined in: [packages/agentos/src/api/runtime/toolAdapter.ts:352](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/runtime/toolAdapter.ts#L352)

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
