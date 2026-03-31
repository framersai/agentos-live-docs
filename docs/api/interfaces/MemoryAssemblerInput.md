# Interface: MemoryAssemblerInput

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:56](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/prompt/MemoryPromptAssembler.ts#L56)

## Properties

### allocation?

> `optional` **allocation**: `Partial`\<[`MemoryBudgetAllocation`](MemoryBudgetAllocation.md)\>

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:60](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/prompt/MemoryPromptAssembler.ts#L60)

Budget allocation percentages.

***

### allTraces?

> `optional` **allTraces**: [`MemoryTrace`](MemoryTrace.md)[]

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:82](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/prompt/MemoryPromptAssembler.ts#L82)

All available traces for involuntary recall pool.

***

### graphContext?

> `optional` **graphContext**: `string`[]

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:72](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/prompt/MemoryPromptAssembler.ts#L72)

Graph association context (Batch 2).

***

### mechanismsEngine?

> `optional` **mechanismsEngine**: [`CognitiveMechanismsEngine`](../classes/CognitiveMechanismsEngine.md)

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:80](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/prompt/MemoryPromptAssembler.ts#L80)

Optional cognitive mechanisms engine for involuntary recall.

***

### observationNotes?

> `optional` **observationNotes**: `string`[]

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:74](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/prompt/MemoryPromptAssembler.ts#L74)

Observation notes (Batch 2).

***

### persistentMemoryText?

> `optional` **persistentMemoryText**: `string`

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:76](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/prompt/MemoryPromptAssembler.ts#L76)

Persistent markdown memory (MEMORY.md contents).

***

### prospectiveAlerts?

> `optional` **prospectiveAlerts**: `string`[]

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:70](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/prompt/MemoryPromptAssembler.ts#L70)

Prospective memory alerts (Batch 2).

***

### retrievedTraces?

> `optional` **retrievedTraces**: [`ScoredMemoryTrace`](ScoredMemoryTrace.md)[]

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:68](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/prompt/MemoryPromptAssembler.ts#L68)

Scored semantic/episodic traces from retrieval.

***

### totalTokenBudget

> **totalTokenBudget**: `number`

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:58](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/prompt/MemoryPromptAssembler.ts#L58)

Token budget for all memory context.

***

### traits

> **traits**: [`HexacoTraits`](HexacoTraits.md)

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:62](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/prompt/MemoryPromptAssembler.ts#L62)

HEXACO traits for formatting style selection.

***

### workingMemoryText?

> `optional` **workingMemoryText**: `string`

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:66](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/prompt/MemoryPromptAssembler.ts#L66)

Working memory formatted string.
