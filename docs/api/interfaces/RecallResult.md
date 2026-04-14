# Interface: RecallResult

Defined in: [packages/agentos/src/memory/AgentMemory.ts:70](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/AgentMemory.ts#L70)

## Properties

### diagnostics

> **diagnostics**: `object`

Defined in: [packages/agentos/src/memory/AgentMemory.ts:76](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/AgentMemory.ts#L76)

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

Defined in: [packages/agentos/src/memory/AgentMemory.ts:72](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/AgentMemory.ts#L72)

Relevant memory traces sorted by relevance.

***

### partial

> **partial**: [`PartiallyRetrievedTrace`](PartiallyRetrievedTrace.md)[]

Defined in: [packages/agentos/src/memory/AgentMemory.ts:74](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/AgentMemory.ts#L74)

Partially retrieved traces (tip-of-the-tongue).
