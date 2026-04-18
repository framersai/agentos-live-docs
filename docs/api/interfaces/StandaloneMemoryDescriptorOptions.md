# Interface: StandaloneMemoryDescriptorOptions

Defined in: [packages/agentos/src/memory/io/extension/StandaloneMemoryExtension.ts:36](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/io/extension/StandaloneMemoryExtension.ts#L36)

## Properties

### manageLifecycle?

> `optional` **manageLifecycle**: `boolean`

Defined in: [packages/agentos/src/memory/io/extension/StandaloneMemoryExtension.ts:42](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/io/extension/StandaloneMemoryExtension.ts#L42)

When true, the descriptor's `shutdown()` will close the configured
`Memory` instance.

#### Default

```ts
false
```

***

### overrides?

> `optional` **overrides**: `Partial`\<[`MemoryProviderPayload`](MemoryProviderPayload.md)\>

Defined in: [packages/agentos/src/memory/io/extension/StandaloneMemoryExtension.ts:47](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/io/extension/StandaloneMemoryExtension.ts#L47)

Optional payload overrides.
