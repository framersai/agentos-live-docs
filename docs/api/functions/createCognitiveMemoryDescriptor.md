# Function: createCognitiveMemoryDescriptor()

> **createCognitiveMemoryDescriptor**(`overrides?`): [`MemoryProviderDescriptor`](../type-aliases/MemoryProviderDescriptor.md)

Defined in: [packages/agentos/src/cognition/memory/io/extension/CognitiveMemoryExtension.ts:102](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/extension/CognitiveMemoryExtension.ts#L102)

Create a MemoryProviderDescriptor for the cognitive memory system.

This is a factory function rather than a static constant because
the provider needs runtime dependencies (vector store, embedding
manager, etc.) injected at activation time.

## Parameters

### overrides?

`Partial`\<[`MemoryProviderPayload`](../interfaces/MemoryProviderPayload.md)\>

## Returns

[`MemoryProviderDescriptor`](../type-aliases/MemoryProviderDescriptor.md)
