# Function: createMemoryToolsPack()

> **createMemoryToolsPack**(`memory`, `options?`): [`ExtensionPack`](../interfaces/ExtensionPack.md)

Defined in: [packages/agentos/src/memory/io/extension/MemoryToolsExtension.ts:96](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/io/extension/MemoryToolsExtension.ts#L96)

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
