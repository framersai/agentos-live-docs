# Interface: MemoryAssemblerInput

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:103](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/prompt/MemoryPromptAssembler.ts#L103)

## Properties

### allocation?

> `optional` **allocation**: `Partial`\<[`MemoryBudgetAllocation`](MemoryBudgetAllocation.md)\>

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:107](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/prompt/MemoryPromptAssembler.ts#L107)

Budget allocation percentages.

***

### allTraces?

> `optional` **allTraces**: [`MemoryTrace`](MemoryTrace.md)[]

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:129](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/prompt/MemoryPromptAssembler.ts#L129)

All available traces for involuntary recall pool.

***

### graphContext?

> `optional` **graphContext**: `string`[]

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:119](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/prompt/MemoryPromptAssembler.ts#L119)

Graph association context (Batch 2).

***

### mechanismsEngine?

> `optional` **mechanismsEngine**: [`CognitiveMechanismsEngine`](../classes/CognitiveMechanismsEngine.md)

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:127](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/prompt/MemoryPromptAssembler.ts#L127)

Optional cognitive mechanisms engine for involuntary recall.

***

### observationNotes?

> `optional` **observationNotes**: `string`[]

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:121](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/prompt/MemoryPromptAssembler.ts#L121)

Observation notes (Batch 2).

***

### persistentMemoryText?

> `optional` **persistentMemoryText**: `string`

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:123](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/prompt/MemoryPromptAssembler.ts#L123)

Persistent markdown memory (MEMORY.md contents).

***

### prospectiveAlerts?

> `optional` **prospectiveAlerts**: `string`[]

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:117](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/prompt/MemoryPromptAssembler.ts#L117)

Prospective memory alerts (Batch 2).

***

### retrievedTraces?

> `optional` **retrievedTraces**: [`ScoredMemoryTrace`](ScoredMemoryTrace.md)[]

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:115](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/prompt/MemoryPromptAssembler.ts#L115)

Scored semantic/episodic traces from retrieval.

***

### totalTokenBudget

> **totalTokenBudget**: `number`

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:105](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/prompt/MemoryPromptAssembler.ts#L105)

Token budget for all memory context.

***

### traits

> **traits**: [`HexacoTraits`](HexacoTraits.md)

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:109](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/prompt/MemoryPromptAssembler.ts#L109)

HEXACO traits for formatting style selection.

***

### workingMemoryText?

> `optional` **workingMemoryText**: `string`

Defined in: [packages/agentos/src/memory/core/prompt/MemoryPromptAssembler.ts:113](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/prompt/MemoryPromptAssembler.ts#L113)

Working memory formatted string.
