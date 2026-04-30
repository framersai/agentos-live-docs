# Interface: StandaloneMemoryDescriptorOptions

Defined in: [packages/agentos/src/memory/io/extension/StandaloneMemoryExtension.ts:36](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/extension/StandaloneMemoryExtension.ts#L36)

## Properties

### manageLifecycle?

> `optional` **manageLifecycle**: `boolean`

Defined in: [packages/agentos/src/memory/io/extension/StandaloneMemoryExtension.ts:42](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/extension/StandaloneMemoryExtension.ts#L42)

When true, the descriptor's `shutdown()` will close the configured
`Memory` instance.

#### Default

```ts
false
```

***

### overrides?

> `optional` **overrides**: `Partial`\<[`MemoryProviderPayload`](MemoryProviderPayload.md)\>

Defined in: [packages/agentos/src/memory/io/extension/StandaloneMemoryExtension.ts:47](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/extension/StandaloneMemoryExtension.ts#L47)

Optional payload overrides.
