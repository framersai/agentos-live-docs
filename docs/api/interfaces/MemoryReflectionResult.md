# Interface: MemoryReflectionResult

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:32](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/observation/MemoryReflector.ts#L32)

Result of a reflection cycle.

Contains the consolidated long-term traces (typed as episodic, semantic,
procedural, prospective, or relational), any superseded trace IDs, the
consumed note IDs, and the compression ratio achieved.

## Properties

### compressionRatio

> **compressionRatio**: `number`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:47](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/observation/MemoryReflector.ts#L47)

Compression ratio achieved.

***

### consumedNoteIds

> **consumedNoteIds**: `string`[]

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:45](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/observation/MemoryReflector.ts#L45)

IDs of observation notes that were consumed.

***

### supersededTraceIds

> **supersededTraceIds**: `string`[]

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:43](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/observation/MemoryReflector.ts#L43)

IDs of existing traces that should be superseded.

***

### traces

> **traces**: `Omit`\<[`MemoryTrace`](MemoryTrace.md), `"id"` \| `"updatedAt"` \| `"createdAt"` \| `"accessCount"` \| `"lastAccessedAt"` \| `"stability"` \| `"encodingStrength"` \| `"retrievalCount"` \| `"reinforcementInterval"`\> & `object`[]

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:34](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/observation/MemoryReflector.ts#L34)

New long-term memory traces to store.
