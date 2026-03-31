# Function: createMemoryToolsPack()

> **createMemoryToolsPack**(`memory`, `options?`): [`ExtensionPack`](../interfaces/ExtensionPack.md)

Defined in: [packages/agentos/src/memory/io/extension/MemoryToolsExtension.ts:89](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/extension/MemoryToolsExtension.ts#L89)

Create an `ExtensionPack` exposing the standalone memory editor tools.

Loading the returned pack through `ExtensionManager` makes the tools
immediately visible to `ToolExecutor`/`ToolOrchestrator` because they all
share the same `tool` registry.

## Parameters

### memory

`Pick`\<[`Memory`](../classes/Memory.md), `"createTools"`\>

### options?

[`MemoryToolsExtensionOptions`](../interfaces/MemoryToolsExtensionOptions.md)

## Returns

[`ExtensionPack`](../interfaces/ExtensionPack.md)
