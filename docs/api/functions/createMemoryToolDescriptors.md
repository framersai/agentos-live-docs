# Function: createMemoryToolDescriptors()

> **createMemoryToolDescriptors**(`memory`, `options?`): [`ToolDescriptor`](../type-aliases/ToolDescriptor.md)[]

Defined in: [packages/agentos/src/memory/io/extension/MemoryToolsExtension.ts:80](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/extension/MemoryToolsExtension.ts#L80)

Convert a standalone `Memory` facade's built-in tool set into extension
descriptors that can be registered directly with `ExtensionManager`.

## Parameters

### memory

`Pick`\<[`Memory`](../classes/Memory.md), `"createTools"`\>

### options?

`Pick`\<[`MemoryToolsExtensionOptions`](../interfaces/MemoryToolsExtensionOptions.md), `"includeReflect"` \| `"priority"`\>

## Returns

[`ToolDescriptor`](../type-aliases/ToolDescriptor.md)[]
