# Function: createMemoryToolDescriptors()

> **createMemoryToolDescriptors**(`memory`, `options?`): [`ToolDescriptor`](../type-aliases/ToolDescriptor.md)[]

Defined in: [packages/agentos/src/memory/io/extension/MemoryToolsExtension.ts:73](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/extension/MemoryToolsExtension.ts#L73)

Convert a standalone `Memory` facade's built-in tool set into extension
descriptors that can be registered directly with `ExtensionManager`.

## Parameters

### memory

`Pick`\<[`Memory`](../classes/Memory.md), `"createTools"`\>

### options?

`Pick`\<[`MemoryToolsExtensionOptions`](../interfaces/MemoryToolsExtensionOptions.md), `"includeReflect"` \| `"priority"`\>

## Returns

[`ToolDescriptor`](../type-aliases/ToolDescriptor.md)[]
