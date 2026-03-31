# Function: assembleMemoryContext()

> **assembleMemoryContext**(`input`): [`AssembledMemoryContext`](../interfaces/AssembledMemoryContext.md)

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:89](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/prompt/MemoryPromptAssembler.ts#L89)

Assemble memory context into a single formatted string within
the given token budget, with overflow redistribution.

## Parameters

### input

[`MemoryAssemblerInput`](../interfaces/MemoryAssemblerInput.md)

## Returns

[`AssembledMemoryContext`](../interfaces/AssembledMemoryContext.md)
