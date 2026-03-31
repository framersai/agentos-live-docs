# Interface: MemoryToolsExtensionOptions

Defined in: [packages/agentos/src/memory/io/extension/MemoryToolsExtension.ts:25](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/extension/MemoryToolsExtension.ts#L25)

Options controlling which memory tools are exposed and how their descriptors
are prioritised.

## Extended by

- [`AgentOSMemoryToolsConfig`](AgentOSMemoryToolsConfig.md)

## Properties

### includeReflect?

> `optional` **includeReflect**: `boolean`

Defined in: [packages/agentos/src/memory/io/extension/MemoryToolsExtension.ts:30](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/extension/MemoryToolsExtension.ts#L30)

Include the `memory_reflect` consolidation tool when available.
Defaults to `true`.

***

### name?

> `optional` **name**: `string`

Defined in: [packages/agentos/src/memory/io/extension/MemoryToolsExtension.ts:41](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/extension/MemoryToolsExtension.ts#L41)

Optional pack name override.

#### Default

```ts
'agentos-memory-tools'
```

***

### priority?

> `optional` **priority**: `number`

Defined in: [packages/agentos/src/memory/io/extension/MemoryToolsExtension.ts:35](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/extension/MemoryToolsExtension.ts#L35)

Optional registry priority applied to all emitted tool descriptors.

***

### version?

> `optional` **version**: `string`

Defined in: [packages/agentos/src/memory/io/extension/MemoryToolsExtension.ts:47](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/extension/MemoryToolsExtension.ts#L47)

Optional pack version override.

#### Default

```ts
'1.0.0'
```
