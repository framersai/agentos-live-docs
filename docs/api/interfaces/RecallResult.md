# Interface: RecallResult

Defined in: [packages/agentos/src/memory/AgentMemory.ts:65](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/AgentMemory.ts#L65)

## Properties

### diagnostics

> **diagnostics**: `object`

Defined in: [packages/agentos/src/memory/AgentMemory.ts:71](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/AgentMemory.ts#L71)

Retrieval diagnostics.

#### candidatesScanned

> **candidatesScanned**: `number`

#### scoringTimeMs

> **scoringTimeMs**: `number`

#### totalTimeMs

> **totalTimeMs**: `number`

#### vectorSearchTimeMs

> **vectorSearchTimeMs**: `number`

***

### memories

> **memories**: [`ScoredMemoryTrace`](ScoredMemoryTrace.md)[]

Defined in: [packages/agentos/src/memory/AgentMemory.ts:67](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/AgentMemory.ts#L67)

Relevant memory traces sorted by relevance.

***

### partial

> **partial**: [`PartiallyRetrievedTrace`](PartiallyRetrievedTrace.md)[]

Defined in: [packages/agentos/src/memory/AgentMemory.ts:69](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/AgentMemory.ts#L69)

Partially retrieved traces (tip-of-the-tongue).
