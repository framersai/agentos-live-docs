# Interface: MemoryReflectionResult

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:31](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/observation/MemoryReflector.ts#L31)

Result of a reflection cycle.

Contains the consolidated long-term traces (typed as episodic, semantic,
procedural, prospective, or relational), any superseded trace IDs, the
consumed note IDs, and the compression ratio achieved.

## Properties

### compressionRatio

> **compressionRatio**: `number`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:46](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/observation/MemoryReflector.ts#L46)

Compression ratio achieved.

***

### consumedNoteIds

> **consumedNoteIds**: `string`[]

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:44](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/observation/MemoryReflector.ts#L44)

IDs of observation notes that were consumed.

***

### supersededTraceIds

> **supersededTraceIds**: `string`[]

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:42](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/observation/MemoryReflector.ts#L42)

IDs of existing traces that should be superseded.

***

### traces

> **traces**: `Omit`\<[`MemoryTrace`](MemoryTrace.md), `"id"` \| `"updatedAt"` \| `"createdAt"` \| `"accessCount"` \| `"lastAccessedAt"` \| `"stability"` \| `"encodingStrength"` \| `"retrievalCount"` \| `"reinforcementInterval"`\> & `object`[]

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:33](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/observation/MemoryReflector.ts#L33)

New long-term memory traces to store.
