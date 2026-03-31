# Interface: AgentOSMemoryToolsConfig

Defined in: [packages/agentos/src/api/AgentOS.ts:335](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/AgentOS.ts#L335)

Options controlling which memory tools are exposed and how their descriptors
are prioritised.

## Extends

- [`MemoryToolsExtensionOptions`](MemoryToolsExtensionOptions.md)

## Properties

### enabled?

> `optional` **enabled**: `boolean`

Defined in: [packages/agentos/src/api/AgentOS.ts:340](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/AgentOS.ts#L340)

Enable or disable automatic memory-tool registration.
Default: true when this block is provided.

***

### identifier?

> `optional` **identifier**: `string`

Defined in: [packages/agentos/src/api/AgentOS.ts:359](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/AgentOS.ts#L359)

Optional extension-pack identifier override.

#### Default

```ts
'config-memory-tools'
```

***

### includeReflect?

> `optional` **includeReflect**: `boolean`

Defined in: [packages/agentos/src/memory/io/extension/MemoryToolsExtension.ts:30](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/extension/MemoryToolsExtension.ts#L30)

Include the `memory_reflect` consolidation tool when available.
Defaults to `true`.

#### Inherited from

[`MemoryToolsExtensionOptions`](MemoryToolsExtensionOptions.md).[`includeReflect`](MemoryToolsExtensionOptions.md#includereflect)

***

### manageLifecycle?

> `optional` **manageLifecycle**: `boolean`

Defined in: [packages/agentos/src/api/AgentOS.ts:353](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/AgentOS.ts#L353)

If true, AgentOS will call `memory.close()` during shutdown via the loaded
extension pack's deactivation hook.
Default: false (caller manages lifecycle).

***

### memory

> **memory**: `Pick`\<[`Memory`](../classes/Memory.md), `"createTools"`\> & `Partial`\<`Pick`\<[`Memory`](../classes/Memory.md), `"close"`\>\>

Defined in: [packages/agentos/src/api/AgentOS.ts:346](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/AgentOS.ts#L346)

Standalone memory backend whose `createTools()` output should be exposed
through the shared AgentOS tool registry.

***

### name?

> `optional` **name**: `string`

Defined in: [packages/agentos/src/memory/io/extension/MemoryToolsExtension.ts:41](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/extension/MemoryToolsExtension.ts#L41)

Optional pack name override.

#### Default

```ts
'agentos-memory-tools'
```

#### Inherited from

[`MemoryToolsExtensionOptions`](MemoryToolsExtensionOptions.md).[`name`](MemoryToolsExtensionOptions.md#name)

***

### priority?

> `optional` **priority**: `number`

Defined in: [packages/agentos/src/memory/io/extension/MemoryToolsExtension.ts:35](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/extension/MemoryToolsExtension.ts#L35)

Optional registry priority applied to all emitted tool descriptors.

#### Inherited from

[`MemoryToolsExtensionOptions`](MemoryToolsExtensionOptions.md).[`priority`](MemoryToolsExtensionOptions.md#priority)

***

### version?

> `optional` **version**: `string`

Defined in: [packages/agentos/src/memory/io/extension/MemoryToolsExtension.ts:47](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/extension/MemoryToolsExtension.ts#L47)

Optional pack version override.

#### Default

```ts
'1.0.0'
```

#### Inherited from

[`MemoryToolsExtensionOptions`](MemoryToolsExtensionOptions.md).[`version`](MemoryToolsExtensionOptions.md#version)
