# Function: createMemoryToolDescriptors()

> **createMemoryToolDescriptors**(`memory`, `options?`): [`ToolDescriptor`](../type-aliases/ToolDescriptor.md)[]

Defined in: [packages/agentos/src/memory/io/extension/MemoryToolsExtension.ts:80](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/io/extension/MemoryToolsExtension.ts#L80)

Convert a standalone `Memory` facade's built-in tool set into extension
descriptors that can be registered directly with `ExtensionManager`.

## Parameters

### memory

`Pick`\<[`Memory`](../classes/Memory.md), `"createTools"`\>

### options?

`Pick`\<[`MemoryToolsExtensionOptions`](../interfaces/MemoryToolsExtensionOptions.md), `"includeReflect"` \| `"priority"`\>

## Returns

[`ToolDescriptor`](../type-aliases/ToolDescriptor.md)[]
