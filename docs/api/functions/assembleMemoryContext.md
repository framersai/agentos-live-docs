# Function: assembleMemoryContext()

> **assembleMemoryContext**(`input`): [`AssembledMemoryContext`](../interfaces/AssembledMemoryContext.md)

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:136](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/prompt/MemoryPromptAssembler.ts#L136)

Assemble memory context into a single formatted string within
the given token budget, with overflow redistribution.

## Parameters

### input

[`MemoryAssemblerInput`](../interfaces/MemoryAssemblerInput.md)

## Returns

[`AssembledMemoryContext`](../interfaces/AssembledMemoryContext.md)
