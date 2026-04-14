# Interface: MemoryToolsExtensionOptions

Defined in: [packages/agentos/src/memory/io/extension/MemoryToolsExtension.ts:25](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/extension/MemoryToolsExtension.ts#L25)

Options controlling which memory tools are exposed and how their descriptors
are prioritised.

## Extended by

- [`AgentOSMemoryToolsConfig`](AgentOSMemoryToolsConfig.md)

## Properties

### includeReflect?

> `optional` **includeReflect**: `boolean`

Defined in: [packages/agentos/src/memory/io/extension/MemoryToolsExtension.ts:30](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/extension/MemoryToolsExtension.ts#L30)

Include the `memory_reflect` consolidation tool when available.
Defaults to `true`.

***

### includeRehydrate?

> `optional` **includeRehydrate**: `boolean`

Defined in: [packages/agentos/src/memory/io/extension/MemoryToolsExtension.ts:54](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/extension/MemoryToolsExtension.ts#L54)

Include the `rehydrate_memory` tool for inflating gisted/archived traces.
Requires an `IMemoryArchive` to be provided via the archive option.
Defaults to `false`.

***

### name?

> `optional` **name**: `string`

Defined in: [packages/agentos/src/memory/io/extension/MemoryToolsExtension.ts:41](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/extension/MemoryToolsExtension.ts#L41)

Optional pack name override.

#### Default

```ts
'agentos-memory-tools'
```

***

### priority?

> `optional` **priority**: `number`

Defined in: [packages/agentos/src/memory/io/extension/MemoryToolsExtension.ts:35](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/extension/MemoryToolsExtension.ts#L35)

Optional registry priority applied to all emitted tool descriptors.

***

### version?

> `optional` **version**: `string`

Defined in: [packages/agentos/src/memory/io/extension/MemoryToolsExtension.ts:47](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/extension/MemoryToolsExtension.ts#L47)

Optional pack version override.

#### Default

```ts
'1.0.0'
```
