# Function: createMemoryToolDescriptors()

> **createMemoryToolDescriptors**(`memory`, `options?`): [`ToolDescriptor`](../type-aliases/ToolDescriptor.md)[]

Defined in: [packages/agentos/src/memory/io/extension/MemoryToolsExtension.ts:73](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/extension/MemoryToolsExtension.ts#L73)

Convert a standalone `Memory` facade's built-in tool set into extension
descriptors that can be registered directly with `ExtensionManager`.

## Parameters

### memory

`Pick`\<[`Memory`](../classes/Memory.md), `"createTools"`\>

### options?

`Pick`\<[`MemoryToolsExtensionOptions`](../interfaces/MemoryToolsExtensionOptions.md), `"includeReflect"` \| `"priority"`\>

## Returns

[`ToolDescriptor`](../type-aliases/ToolDescriptor.md)[]
