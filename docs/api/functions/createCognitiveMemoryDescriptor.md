# Function: createCognitiveMemoryDescriptor()

> **createCognitiveMemoryDescriptor**(`overrides?`): [`MemoryProviderDescriptor`](../type-aliases/MemoryProviderDescriptor.md)

Defined in: [packages/agentos/src/memory/io/extension/CognitiveMemoryExtension.ts:102](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/extension/CognitiveMemoryExtension.ts#L102)

Create a MemoryProviderDescriptor for the cognitive memory system.

This is a factory function rather than a static constant because
the provider needs runtime dependencies (vector store, embedding
manager, etc.) injected at activation time.

## Parameters

### overrides?

`Partial`\<[`MemoryProviderPayload`](../interfaces/MemoryProviderPayload.md)\>

## Returns

[`MemoryProviderDescriptor`](../type-aliases/MemoryProviderDescriptor.md)
