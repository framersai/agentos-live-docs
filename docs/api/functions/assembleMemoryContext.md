# Function: assembleMemoryContext()

> **assembleMemoryContext**(`input`): [`AssembledMemoryContext`](../interfaces/AssembledMemoryContext.md)

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:89](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/prompt/MemoryPromptAssembler.ts#L89)

Assemble memory context into a single formatted string within
the given token budget, with overflow redistribution.

## Parameters

### input

[`MemoryAssemblerInput`](../interfaces/MemoryAssemblerInput.md)

## Returns

[`AssembledMemoryContext`](../interfaces/AssembledMemoryContext.md)
