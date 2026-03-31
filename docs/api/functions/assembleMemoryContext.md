# Function: assembleMemoryContext()

> **assembleMemoryContext**(`input`): [`AssembledMemoryContext`](../interfaces/AssembledMemoryContext.md)

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:89](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/prompt/MemoryPromptAssembler.ts#L89)

Assemble memory context into a single formatted string within
the given token budget, with overflow redistribution.

## Parameters

### input

[`MemoryAssemblerInput`](../interfaces/MemoryAssemblerInput.md)

## Returns

[`AssembledMemoryContext`](../interfaces/AssembledMemoryContext.md)
