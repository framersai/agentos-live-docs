# Interface: MemoryReflectionResult

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:24](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/MemoryReflector.ts#L24)

## Properties

### compressionRatio

> **compressionRatio**: `number`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:32](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/MemoryReflector.ts#L32)

Compression ratio achieved.

***

### consumedNoteIds

> **consumedNoteIds**: `string`[]

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:30](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/MemoryReflector.ts#L30)

IDs of observation notes that were consumed.

***

### supersededTraceIds

> **supersededTraceIds**: `string`[]

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:28](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/MemoryReflector.ts#L28)

IDs of existing traces that should be superseded.

***

### traces

> **traces**: `Omit`\<[`MemoryTrace`](MemoryTrace.md), `"id"` \| `"updatedAt"` \| `"createdAt"` \| `"accessCount"` \| `"lastAccessedAt"` \| `"stability"` \| `"encodingStrength"` \| `"retrievalCount"` \| `"reinforcementInterval"`\>[]

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:26](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/MemoryReflector.ts#L26)

New long-term memory traces to store.
